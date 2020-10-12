var validator = require('validator');

class userRegistration {
    constructor(username, email, emailConfirmation, password)
    {
        this.username = username;
        this.email = email;
        this.emailConfirmation = emailConfirmation;
        this.password = password;
    }

    validate()
    {
        if (validator.isEmpty(this.email) == false && validator.isEmpty(this.emailConfirmation) == false && validator.isEmpty(this.password) == false && validator.isEmpty(this.username) == false)
        {
            if (validator.isEmail(this.email) && validator.isEmail(this.email))
            {
                if (this.email == this.emailConfirmation)
                {
                    if (validator.isAlpha(this.username))
                    {
                        if (validator.isAlphanumeric(this.password) && validator.isByteLength(this.password, {min: 6, max: 50}))
                        {
                            return {bool: true, reason: "all fields are correct"};
                        }
                        else
                        {
                            return {bool: false, reason: "Password format is incorrect"}
                        }
                    }
                    else
                    {
                        return {bool: false, reason: "Username format is incorrect"}
                    }
                }
                else
                {
                    return {bool: false, reason: "Emails do not match"}
                }
            }
            else
            {
                return {bool: false, reason: "Incorrect email format"}
            }
        }
        else
        {
            return {bool: false, reason: "There are missing fields"};
        }
    }
}

module.exports = userRegistration;