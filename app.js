require("dotenv").config();
require("./config/database").connect();

const express = require('express');
const { createServer } = require("http");
const { Server } = require("socket.io");
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
const CategoryRoutes = require('./routes/CategoryRoutes');


//Express App
const app = express();

// Socket server
const httpServer = createServer(app);
// Socket Layer over Http Server
const socket = new Server(httpServer,{
    cors: {
      origin: ["http://localhost:4200"]
    }
  });
// On every Client Connection
socket.on('connection', socket => {
    console.log('Socket: client connected');
});

//Listen to port

httpServer.listen(3000);

// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

//add other middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Emit notifications

// Send Notification API
app.post('/send-notification', async(req, res) => {
    const notify = req.body;
    socket.emit('notification', notify); // Updates Live Notification
    res.send(notify);
});

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
app.use(CategoryRoutes);

// // //    ERRORS SHOULD ALWAYS BE AFTER EVERYTHING 
app.use((req, res) => {
    res.status(404).send({
        error: {
            message: "Undefied Route",
            code: "404"
        }
    });
})