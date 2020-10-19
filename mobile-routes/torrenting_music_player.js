var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var db = require('../database')
var validator = require('validator');
var unirest = require('unirest');
var TorrentIndexer = require('torrent-indexer');
var pirata = require('pirata');
const TorrentSearchApi = require('torrent-search-api');
var torrentStream = require('torrent-stream');
var path = require('path');
var webtorrent = require('webtorrent');
const { ClientResponse } = require('http');


router = express.Router();
const torrentIndexer = new TorrentIndexer();
//webtorrent
var client = new webtorrent();
/*router.use(bodyParser.urlencoded({
    extended: 'true'
}));*/

router.get('/:song_name/:artist_name/:id', (req, res) => {
    var request;
    var song_name = req.params.song_name;
    var artist_name = req.params.artist_name;
    var id = req.params.id;
    var url = "https://api.deezer.com/track/"+id;

    if (song_name != undefined && artist_name != undefined)
    {
        async function search()
        {
            try {
                const torrents_1 = await torrentIndexer.search(artist_name);
                var x = 0;
                var y = 0;

                if (torrents_1 != undefined && torrents_1.length > 0)
                {
                    //console.log("-----------------------------------------------------------------");
                    //console.log("torrentInDEXER: "+require('util').inspect(torrents_1, {showHidden: false, depth: null}))
                    //console.log("-----------------------------------------------------------------");
                    while (torrents_1[x])
                    {
                        if (torrents_1[x].fileName.search(song_name) > -1 || torrents_1[x].fileName.search(song_name.toLowerCase()) > -1 && (torrents_1[x].fileName.search('mp3') > -1 || torrents_1[x].fileName.search('Mp3') > -1 || torrents_1[x].fileName.search('MP3') > -1))
                        {
                            console.log("found the song: "+require('util').inspect(torrents_1[x], {showHidden: false, depth: null}))
                            if (torrents_1[x].link.search('magnet') == -1)
                            {
                                global.MAGNET = torrents_1[x].torrent(torrents_1[x].link);
                            }
                            else
                            {
                                global.MAGNET = torrents_1[x].link;
                            }
                            y = 1;
                            break;
                        }
                        x++;
                    }
                    if (y == 1)
                    {
                        global.song_found = true;
                        console.log("Song found");
                    }
                    else
                    {
                        global.song_found = false;
                        global.MAGNET = "";
                        console.log("No song found");
                    }
                }
                //console.log("res: "+require('util').inspect(torrents, {showHidden: false, depth: null}));
            } catch (error) {
                console.log("err: "+error);
            }
        }
        search();

        request = unirest('GET', url);
        request.end((response) => {
            if (response)
            {
                //console.log(require('util').inspect(response.body, {showHidden: false, depth: null}))
                res.render("music_player", {songInfo: response.body});
            }
            else
            {
                res.redirect('search');
            }
        }) 
    }
})

router.get('/music_output', (req, res) => {
    if (global.song_found == true)
    {
        console.log('link: '+global.MAGNET);
        var dir = path.join(__dirname, '../Music');
        console.log("dir: "+dir);
        /*const engine = torrentStream(global.MAGNET, {
            connections: 100,   
            uploads: 10,         
            path: dir, 
            verify: true,                       
            trackers: [
                'udp://tracker.leechers-paradise.org:6969/announce',
                'udp://tracker.pirateparty.gr:6969/announce',
                'udp://tracker.coppersurfer.tk:6969/announce',
                'http://asnet.pw:2710/announce',
                'http://tracker.opentrackr.org:1337/announce',
                'udp://tracker.opentrackr.org:1337/announce',
                'udp://tracker1.xku.tv:6969/announce',
                'udp://tracker1.wasabii.com.tw:6969/announce',
                'udp://tracker.zer0day.to:1337/announce',
                'udp://p4p.arenabg.com:1337/announce',
                'http://tracker.internetwarriors.net:1337/announce',
                'udp://tracker.internetwarriors.net:1337/announce',
                'udp://allesanddro.de:1337/announce',
                'udp://9.rarbg.com:2710/announce',
                'udp://tracker.dler.org:6969/announce',
                'http://mgtracker.org:6969/announce',
                'http://tracker.mg64.net:6881/announce',
                'http://tracker.devil-torrents.pl:80/announce',
                'http://ipv4.tracker.harry.lu:80/announce',
                'http://tracker.electro-torrent.pl:80/announce'
            ]
        });

        engine.on('ready', () => {
            var x = 0;
            console.log("ready");
            //Multiple files can download so we need to find the video by checking for the extension. X should stop on the file once found.
            //We dont need to check if the engine instance exists because ready will be ommited.
            while(engine.files[x])
            {
                if (engine.files[x].name.search(".mp3") > -1 || engine.files[x].name.search(".MP3")  > -1 || engine.files[x].name.search(".Mp3") > -1)
                    break;
                x++;
            }
            console.log("look: dsa "+engine.files[x].name);
            fileName = engine.files[x].name;
        
            //Just make sure that we found the correct file by checking the extension.
            if (fileName.search(".mp3") > -1 || fileName.search(".Mp3") > -1 || fileName.search(".MP3") > -1)
            {
                engine.files[x].select();             //Launch the download
                console.log("Download starting ......");
                var fileSize = engine.files[x].length;
                var range = req.headers.range;

                if (range)
                {
                    const parts = range.replace(/bytes=/, "").split("-");
                    const start = parseInt(parts[0], 10);
                    console.log("start: "+start);
                    const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1;
                    console.log("end: "+end);
                    const chunksize = (end-start)+1;
                    console.log("chunckSize: "+chunksize);
                    const head = {
                        'Content-Range': "bytes " + start + "-" + end + "/" + fileSize,
                        'Accept-Ranges': 'bytes', //required for the controls to work
                        'Content-Length': chunksize,
                        'Content-Type': 'audio/mpeg',
                        //Connection: 'keep-alive'
                    }
                    res.writeHead(206, head);
                    var stream = engine.files[x].createReadStream({
                        start: start,
                        end: end
                    })
                    stream.pipe(res);
                    //pump(stream, res);
                }
            }
            else
            {
                console.log("No torrents found");
                //handle error
            }
        }).on('download', () => {
            console.log("download percentage: "+engine.swarm.downloaded);
        }).on('torrent', (fn) => {
            engine.remove();
            console.dir("torrent: "+fn);
        }).on('idle', () => {
            console.log("download complete");
        })*/
        var opt = { path: dir }
        //check if torrent is still within client
        // 1) step one, stop all active downloads if any.
        var a = 0;
        while (a < client.torrents.length)
        {
            var torrent = client.torrents[a];
            torrent.pause();
            a++;
        }
        // 2) step two, check if the magnet is part of the clients list, if not then start a new download. If it is, then just resume the torrent.
        var torrent_from_client = client.get(global.MAGNET);
        if (torrent_from_client != null)
        {
            console.log("Resuming torrent download");
            torrent_from_client.resume();
            if (torrent_from_client.ready == true)
            {
                var x = 0;
                console.log("torrent ready");
                //Multiple files can download so we need to find the video by checking for the extension. X should stop on the file once found.
                //We dont need to check if the engine instance exists because ready will be ommited.
                while(torrent_from_client.files[x])
                {
                    if (torrent_from_client.files[x].name.search(".mp3") > -1 || torrent_from_client.files[x].name.search(".MP3")  > -1 || torrent_from_client.files[x].name.search(".Mp3") > -1)
                        break;
                    x++;
                }
                console.log("torrent_name: "+torrent_from_client.files[x].name);
                fileName = torrent_from_client.files[x].name;
            
                //Just make sure that we found the correct file by checking the extension.
                if (fileName.search(".mp3") > -1 || fileName.search(".Mp3") > -1 || fileName.search(".MP3") > -1)
                {
                    torrent_from_client.files[x].select();             //Launch the download
                    console.log("Download starting ......");
                    var fileSize = torrent_from_client.files[x].length;
                    var range = req.headers.range;
    
                    if (range)
                    {
                        const parts = range.replace(/bytes=/, "").split("-");
                        const start = parseInt(parts[0], 10);
                        console.log("start: "+start);
                        const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1;
                        console.log("end: "+end);
                        const chunksize = (end-start)+1;
                        console.log("chunckSize: "+chunksize);
                        const head = {
                            'Content-Range': "bytes " + start + "-" + end + "/" + fileSize,
                            'Accept-Ranges': 'bytes', //required for the controls to work
                            'Content-Length': chunksize,
                            'Content-Type': 'audio/mpeg',
                            Connection: 'keep-alive'
                        }
                        res.writeHead(206, head);
                        var stream = torrent_from_client.files[x].createReadStream({
                            start: start,
                            end: end
                        })
                        stream.pipe(res);
                        //pump(stream, res);
                    }
                }
            }
            torrent.on('download', (bytes) => {
                console.log('just downloaded: ' + bytes)
                console.log('total downloaded: ' + torrent.downloaded)
                console.log('download speed: ' + torrent.downloadSpeed)
                console.log('progress: ' + torrent.progress)
            })
            /*client.remove(torrentID, (err) => {
                if (err)
                    console.log(err);
                else
                {
                    console.log("torrent data removed");
                }
            })*/
        }
        else if (torrent_from_client == null)
        {
            console.log("Found a new torrent, adding to archives ....");
            client.add(global.MAGNET, opt, (torrent) => {
                //console.log("is torrent ready: "+torrent.ready);
                if (torrent.ready == true)
                {
                    var x = 0;
                    console.log("ready");
                    //Multiple files can download so we need to find the video by checking for the extension. X should stop on the file once found.
                    //We dont need to check if the engine instance exists because ready will be ommited.
                    while(torrent.files[x])
                    {
                        if (torrent.files[x].name.search(".mp3") > -1 || torrent.files[x].name.search(".MP3")  > -1 || torrent.files[x].name.search(".Mp3") > -1)
                            break;
                        x++;
                    }
                    console.log("torrent_name: "+torrent.files[x].name);
                    fileName = torrent.files[x].name;
                
                    //Just make sure that we found the correct file by checking the extension.
                    if (fileName.search(".mp3") > -1 || fileName.search(".Mp3") > -1 || fileName.search(".MP3") > -1)
                    {
                        torrent.files[x].select();             //Launch the download
                        console.log("Download starting ......");
                        var fileSize = torrent.files[x].length;
                        var range = req.headers.range;
        
                        if (range)
                        {
                            const parts = range.replace(/bytes=/, "").split("-");
                            const start = parseInt(parts[0], 10);
                            console.log("start: "+start);
                            const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1;
                            console.log("end: "+end);
                            const chunksize = (end-start)+1;
                            console.log("chunckSize: "+chunksize);
                            const head = {
                                'Content-Range': "bytes " + start + "-" + end + "/" + fileSize,
                                'Accept-Ranges': 'bytes', //required for the controls to work
                                'Content-Length': chunksize,
                                'Content-Type': 'audio/mpeg',
                                Connection: 'keep-alive'
                            }
                            res.writeHead(206, head);
                            var stream = torrent.files[x].createReadStream({
                                start: start,
                                end: end
                            })
                            stream.pipe(res);
                            //pump(stream, res);
                        }
                    }
                }
                torrent.on('download', (bytes) => {
                    console.log('just downloaded: ' + bytes)
                    console.log('total downloaded: ' + torrent.downloaded)
                    console.log('download speed: ' + torrent.downloadSpeed)
                    console.log('progress: ' + torrent.progress)
                })
            })
        }
    }
    else if (global.song_found == false)
    {
        console.log("You should close the connection");
    }
})


module.exports = router;