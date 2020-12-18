const User = require('./models/user');

const validators = {
    validateEmail: (email) => {
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegex.test(email);
    },
    isEmpty: (field) => {
        if(field.length === 0 || field === "") {
            return true;
        } else {
            return false;
        }
    },
    validateUsername: (uname) => {
        User.findOne({username: uname}).exec((_, user) => {
                if(user){
                    return true;
                } else {
                    return false;
                }
        });
    }, 
    validatePassword: (password) => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
        return passwordRegex.test(password);
    }
};

module.exports = validators;