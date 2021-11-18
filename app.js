require("dotenv").config();
require("./config/database").connect();

const express = require('express');

const path = require("path");
const morgan = require('morgan');

const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const _ = require('lodash');


//Routes
const EtudiantRoutes = require('./routes/EtudiantRoutes');
const RecruteurRoutes = require('./routes/RecruteurRoutes');
const AdministrateurRoutes = require('./routes/AdminRoutes');
const BoulotRoutes = require('./routes/BoulotRoutes');


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
app.use(express.urlencoded({ extended: true }));


//       STATIC FILES
// FILES THAT WE WANT TO GET FROM BACKEND SERVER
//PHOTOS
app.use(express.static('files'));

//COMPANY LOGOS
app.use('/logos', express.static(path.join(__dirname, 'logos')))

//ADMIN PHOTOS
app.use('/admin', express.static(path.join(__dirname, 'admin_files')))



//     LOGS
app.use(morgan('dev'));

//       USE ROUTES
app.use(EtudiantRoutes);
app.use(RecruteurRoutes);
app.use(AdministrateurRoutes);
app.use(BoulotRoutes);

// // //    ERRORS SHOULD ALWAYS BE AFTER EVERYTHING 
app.use((req, res) => {
    res.status(404).send({
        error: {
            message: "Undefied Route",
            code: "404"
        }
    });
})