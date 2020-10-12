const mongoose = require('mongoose');

const connect = () => {

    return new Promise(resolve => {
        try {
            mongoose.connect('mongodb+srv://naitik:naitik123@cluster0-6wc7i.mongodb.net/shop',
                { useCreateIndex: true, useUnifiedTopology: true,useNewUrlParser:true },
                (err => {
                    if (!err) {
                        console.log('connected to database !');
                        resolve()
                    } else {
                        throw err;
                    }
                })
            )
        } catch (e) {
            throw new Error(e);
        }
    })
}

module.exports = connect