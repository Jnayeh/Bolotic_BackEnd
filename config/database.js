const mongoose = require("mongoose");

//    MongoDB URL
const url = "mongodb+srv://root:1001@boloticdb.g5x5o.mongodb.net/boloticDB?retryWrites=true&w=majority";

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