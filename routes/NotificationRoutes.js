const express = require('express');

const Recruteur = require('../models/recruteurs');
const Etudiant = require('../models/etudiants');
const path = require("path");
const auth = require("../middleware/auth");

// To Decode Token
const jwt = require("jsonwebtoken");
const Notification = require('../models/notifications');

const config = process.env;

// INITIALIZE ROUTER
const router = express.Router();


// GET NOTIFICATION BY ID
// JSON
// AUTHENTIFICATION NEEDED

router.get('/notifications/recruteur/:id', auth, (req, res) => {
    const id = req.params.id
    Notification.find({ recruteur: id }).populate("etudiant")
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            res.send(err);
        })
});

// GET NOTIFICATION BY ID
// JSON
// AUTHENTIFICATION NEEDED

router.get('/notifications/etudiant/:id', auth, (req, res) => {
    const id = req.params.id
    Notification.find({ etudiant: id }).populate("recruteur")
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            res.send(err);
        })
});

// ADD NOTIFICATION
// JSON

router.post('/notifications/add', auth, async (req, res) => {

    if (req.body._id === null) {
        delete req.body._id;
    }

    const _notif = new Notification(req.body);

    //GET TOKEN FROM HEADERS
    const token = req.headers["authorization"];
    // DECODE TOKEN
    const decoded = jwt.verify(token, config.TOKEN_KEY);



    Notification.create(_notif).then(async (user_notif) => {
        console.log("\n>> Created notification:\n", user_notif);


        console.log("\n>>here rec");
        await Recruteur.findByIdAndUpdate(
            _notif.recruteur,
            { $push: { notifications: user_notif._id } },
            { new: true, useFindAndModify: false }
        );

        await Etudiant.findByIdAndUpdate(
            _notif.etudiant,
            { $push: { notifications: user_notif._id } },
            { new: true, useFindAndModify: false }
        );


        console.log("here finally");
        res.send(user_notif);
    })
        .catch((err) => {
            res.status(400).send(err);
        });
})


// UPDATE notifications
// JSON

router.put('/notifications/update/:id', auth, async (req, res) => {
    const id = req.params.id;
    const _notif = new Notification(req.body);

    const old_notif = await Notification.findById(id);
    if (old_notif) {
        _notif._id = id;

        await Notification.findByIdAndUpdate(id, _notif);
        res.send(await Notification.findById(id));
    }
    else {
        res.send("notification NOT FOUND");
    }

})

module.exports = router;