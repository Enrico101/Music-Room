var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var db = require('../database')
var validator = require('validator');
var unirest = require('unirest');
var TorrentIndexer = require('torrent-indexer');
var pirata = require('pirata');
const TorrentSearchApi = require('torrent-search-api');


router = express.Router();
const torrentIndexer = new TorrentIndexer();
var secretString = Math.floor((Math.random() * 10000) + 1);
router.use(session({
    secret: secretString.toString(),
    resave: true,
    saveUninitialized: true
}));
router.use(bodyParser.urlencoded({
    extended: 'true'
}));

router.get('/:song_name/:artist_name/:id', (req, res) => {
    var request;
    var song_name = req.params.song_name;
    var artist_name = req.params.artist_name;
    var id = req.params.id;
    var url = "https://api.deezer.com/track/"+id;

    /*if (song_name != undefined && artist_name != undefined)
    {
        async function search()
        {
            try {
                const torrents_1 = await torrentIndexer.search(artist_name);
                var x = 0;
                var y = 0;

                if (torrents_1 != undefined && torrents_1.length > 0)
                {
                    console.log("-----------------------------------------------------------------");
                    console.log("torrentInDEXER: "+require('util').inspect(torrents_1, {showHidden: false, depth: null}))
                    console.log("-----------------------------------------------------------------");
                    while (torrents_1[x])
                    {
                        if (torrents_1[x].fileName.search(song_name) > -1 || torrents_1[x].fileName.search(song_name.toLowerCase()) > -1)
                        {
                            console.log("found the song: "+require('util').inspect(torrents_1[x], {showHidden: false, depth: null}))
                            y = 1;
                            break;
                        }
                        x++;
                    }
                    if (y == 1)
                    {
                        console.log("Song found");
                    }
                    else
                    {
                        console.log("No song found");
                        const category = pirata.categories;

                        const opts =
                        {
                            url: "https://www1.thepiratebay3.to/",
                            cat: category.Audio
                        }
                        
                        pirata.search(artist_name, opts, function(err, res)
                        {
                            var i = 0;
                            console.log("---------------------------------------------------------------");
                            console.log("pirata: "+require('util').inspect(res, {showHidden: false, depth: null}))
                            console.log("----------------------------------------------------------------");
                            if (res != undefined && res.length > 0)
                            {
                                while (res[i])
                                {
                                    if (res[i].fileName.search(song_name) > -1 || res[i].fileName.search(song_name.toLowerCase()) > -1)
                                    {
                                        console.log("found the song: "+require('util').inspect(res[i], {showHidden: false, depth: null}))
                                        y = 1;
                                        break;
                                    }
                                    i++;
                                }             
                            }
                            if (y == 1)
                            {
                                console.log("Song found");
                            }
                            else
                            {
                                async function searchAgain()
                                {
                                    try {
                                        TorrentSearchApi.enablePublicProviders();
                                        const torrents_2 = await TorrentSearchApi.search(artist_name, 'Music', 20)
                                        console.log("------------------------------------------------------------------");
                                        console.log("torrent-search-api: "+require('util').inspect(torrents_2, {showHidden: false, depth: null}))
                                        console.log("------------------------------------------------------------");
                                        if (torrents_2 != undefined && torrents_2.length > 0)
                                        {
                                            var z = 0;
                                            while(torrents_2[z])
                                            {
                                                if (torrents_2[z].title.search(song_name) > -1 || torrents_2[z].title.search(song_name.toLowerCase()) > -1)
                                                console.log("found the song: "+require('util').inspect(torrents_2[z], {showHidden: false, depth: null}));
                                                y = 1;
                                                break;
                                                z++;
                                            }
                                            if (y == 1)
                                                console.log("Song found: "+torrents_2[z].title);
                                            else
                                                console.log("No song found f***");
                                        }
                                        else
                                        {
                                            console.log("No torrents found, i give up");
                                        }   
                                    } catch (error) {
                                        console.log("error: "+error);
                                    }
                                }
                                searchAgain();
                                console.log("No song found again");
                            }
                            // res: [{name: "something", seeds: 123, leechs: 33, magnet: "linkmagnet" }]
                        });
                    }
                }
                //console.log("res: "+require('util').inspect(torrents, {showHidden: false, depth: null}));
            } catch (error) {
                console.log("err: "+error);
            }
        }
        search();*/

        request = unirest('GET', url);
        request.end((response) => {
            if (response)
            {
                //console.log(require('util').inspect(response.body, {showHidden: false, depth: null}))
                res.render("music_player", {songInfo: response.body, access_token: req.session.access_token});
            }
            else
            {
                res.redirect('search');
            }
        }) 
//    }
})


module.exports = router;