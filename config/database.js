const mongoose = require("mongoose");

//    MongoDB URL
const url = 'mongodb://127.0.0.1:27017/BoloticDB';

exports.connect = () => {
    // CONNECT MONGOOSE
    
    mongoose.connect(url, { useNewUrlParser: true })
    .then((result) => console.log('Connecting to Database '))
    .catch((err) => console.log(err));

    // CHECKING CONNECTION
    const db = mongoose.connection
    db.once('open', _ => {
    console.log('Database connected:', url)
    })

    db.on('error', err => {
    console.error('connection error:', err)
    })
};