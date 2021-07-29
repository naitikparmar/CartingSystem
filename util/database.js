const mongoose = require('mongoose');

const connect = () => {

    return new Promise(resolve => {
        try {
            mongoose.connect(URI,
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
