const express = require('express');

const Signalement = require('../models/signalement');
const Recruteur = require('../models/recruteurs');
const path = require("path");
const auth = require("../middleware/auth");

// To Decode Token
const jwt = require("jsonwebtoken");
const Etudiant = require('../models/etudiants');
const config = process.env;

// INITIALIZE ROUTER
const router = express.Router();

//  GET signalement
// JSON
// AUTHENTIFICATION NEEDED

router.get('/signalement', (req, res) => {
    Signalement.find()
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            res.send(err);
        })
})

// GET RECRUTEUR signalement BY ID
// JSON
// AUTHENTIFICATION NEEDED

router.get('/recruteur/signalement/:rec_id', auth, (req, res) => {
    const _id = req.params.rec_id
    Signalement.find({ id_signaling: _id }).populate("recruteur","etudiant")
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            res.send(err);
        })
});
// GET RECRUTEUR signaled BY ID
// JSON
// AUTHENTIFICATION NEEDED

router.get('/recruteur/signaled/:rec_id', auth, (req, res) => {
    const _id = req.params.rec_id
    Signalement.find({ id_signaled: _id }).populate("recruteur","etudiant")
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            res.send(err);
        })
});

// GET ETUDIANT AVIS BY ID
// JSON
// AUTHENTIFICATION NEEDED

router.get('/etudiant/signalement/:et_id', auth, (req, res) => {
    const _id = req.params.et_id
    Signalement.find({ id_signaling : _id }).populate("recruteur","etudiant")
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            res.send(err);
        })
});
// GET RECRUTEUR signaled BY ID
// JSON
// AUTHENTIFICATION NEEDED

router.get('/etudiant/signaled/:et_id', auth, (req, res) => {
    const _id = req.params.et_id
    Signalement.find({ id_signaled: _id }).populate("recruteur","etudiant")
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            res.send(err);
        })
});

// GET signalement BY ID
// JSON
// AUTHENTIFICATION NEEDED

router.get('/signalement/:id', auth, (req, res) => {
    const id = req.params.id
    Etudiant.findById(id).populate("recruteur","etudiant")
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            res.send(err);
        })
});



// ADD Signalement
// JSON

router.post('/signalement/add', auth, async (req, res) => {

    if(req.body._id === null) {
        delete req.body._id;
      }

    const _signalement = new Signalement(req.body);

    //GET TOKEN FROM HEADERS
    const token = req.headers["authorization"];
    // DECODE TOKEN
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    
    
    if (decoded.role == "recruteur") {
        _signalement.id_signaled= _signalement.etudiant;
        _signalement.id_signaling= _signalement.recruteur;
    }
    else if (decoded.role == "etudiant") {
        _signalement.id_signaled= _signalement.recruteur;
        _signalement.id_signaling= _signalement.etudiant;
    }
    Signalement.create(_signalement).then(async (user_signalement) => {
        console.log("\n>> Created signalement:\n", user_signalement);

        await Recruteur.findByIdAndUpdate(
            _signalement.recruteur,
            { $push: { Signalement: user_signalement._id } },
            { new: true, useFindAndModify: false }
        );
        await Etudiant.findByIdAndUpdate(
            _signalement.etudiant,
            { $push: { Signalement: user_avis._id } },
            { new: true, useFindAndModify: false }
        );
        res.send(user_signalement);
    })
        .catch((err) => {
            res.status(400).send(err);
        });
})


// UPDATE AVIS
// JSON

router.put('/signalement/update/:id', auth, async (req, res) => {
    const id = req.params.id;
    const _avis = new Signalement(req.body);

    //GET TOKEN FROM HEADERS
    const token = req.headers["authorization"];

    const old_signalement = await Signalement.findById(id);
    if (old_signalement) {
        _signalement._id = id;

        await Signalement.findByIdAndUpdate(id, _avis);
        res.send(await Signalement.findById(id));
    }
    else {
        res.send("signalement NOT FOUND");
    }

})


// DELETE signalement
// JSON

router.delete('/signalement/delete/:id', auth, async (req, res) => {
    const id = req.params.id;
    const old_signalement = await Avis.findById(id);
    Avis.findByIdAndDelete(id)
        .then(async (result) => {
            // Remove signalement id from signalement  list in the Etudiant document
            await Etudiant.findByIdAndUpdate(
                old_signalement.etudiant,
                { $pull: { Signalement: old_signalement._id } },
                { multi: true }
            );

            // Remove signalement  id from signalement  list in the recruteur document
            await Recruteur.findByIdAndUpdate(
                old_signalement.recruteur,
                { $pull: { Signalement: old_signalement._id } },
                { multi: true }
            );
            res.send(result);
        })
        .catch((err) => {
            res.send(err);
        })

})


module.exports = router;