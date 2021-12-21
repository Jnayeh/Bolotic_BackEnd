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

var fs = require("fs");
var https = require("https");


//Routes
const EtudiantRoutes = require('./routes/EtudiantRoutes');
const RecruteurRoutes = require('./routes/RecruteurRoutes');
const AdministrateurRoutes = require('./routes/AdminRoutes');
const BoulotRoutes = require('./routes/BoulotRoutes');
const CategoryRoutes = require('./routes/CategoryRoutes');
const AvisRoutes = require('./routes/AvisRoutes');
const ContratRoutes = require('./routes/ContratRoutes');
const NotificationRoutes = require('./routes/NotificationRoutes');
const SignalementRoutes = require('./routes/SignalementRoutes');
const CarteBancaireRoutes = require('./routes/CarteBacaireRoutes');


//Express App
const app = express();

// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

//add other middleware
const corsOptions ={
  origin: "https://jnayeh.github.io", 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}
app.use(cors(corsOptions));
app.use(allowCrossDomain)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket server
const httpServer = https.createServer({
    key: fs.readFileSync("server.key"),
    cert: fs.readFileSync("server.cert"),
  },app);
// Socket Layer over Http Server
const socket = new Server(httpServer,{
    cors: {
      origin: ["https://jnayeh.github.io"]
    }
  });
// On every Client Connection
socket.on('connection', socket => {
    console.log('Socket: client connected');
});

//Listen to port


httpServer.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });
   




// Emit notifications

const Notification = require('./models/notifications');
// Send Notification API
app.post('/send_notification', async(req, res) => {
    const notify = new Notification(req.body);
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
app.use(AdministrateurRoutes);
app.use(AvisRoutes);
app.use(BoulotRoutes);
app.use(CategoryRoutes);
app.use(ContratRoutes);
app.use(EtudiantRoutes);
app.use(NotificationRoutes);
app.use(RecruteurRoutes);
app.use(SignalementRoutes);
app.use(CarteBancaireRoutes);

// // //    ERRORS SHOULD ALWAYS BE AFTER EVERYTHING 
app.use((req, res) => {
    res.status(404).send({
        error: {
            message: "Undefied Route",
            code: "404"
        }
    });
})