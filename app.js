require("dotenv").config();
require("./config/database").connect();

const express = require('express');

const morgan = require('morgan');

const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const _ = require('lodash');


//Routes
const EtudiantRoutes = require('./routes/EtudiantRoutes');


//Express App
const app = express();

//Listen to pot
app.listen(3000);

// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

//add other middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


//       STATIC FILES
app.use(express.static('./files'));

//     LOGS
app.use(morgan('dev'));

//       USE ROUTES
app.use(EtudiantRoutes);

// // //    ERRORS SHOULD ALWAYS BE AFTER EVERYTHING 
app.use((req, res) => {
    res.status(404).send({error:{
        message: "Undefied Route",
        code:"404"
    }});
  })