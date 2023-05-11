const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config()
module.exports = function init(callback) {
    mongoose.set('strictQuery', 'false')
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            callback()
        })
        .catch(() => {
            callback("error connecting Database")
        });
}

