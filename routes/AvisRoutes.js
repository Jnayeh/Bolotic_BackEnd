const express = require('express');

const AVIS = require('../models/avis');
const Recruteur = require('../models/recruteurs');
const path = require("path");
const auth = require("../middleware/auth");

// To Decode Token
const jwt = require("jsonwebtoken");
const Etudiant = require('../models/etudiants');
const Avis = require('../models/avis');

const config = process.env;

// INITIALIZE ROUTER
const router = express.Router();

//  GET AVIS
// JSON
// AUTHENTIFICATION NEEDED

router.get('/avis', (req, res) => {
    Avis.find().populate("recruteur")
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            res.send(err);
        })
})

// GET RECRUTEUR AVIS BY ID
// JSON
// AUTHENTIFICATION NEEDED

router.get('/avis/recruteur/:rec_id', auth, (req, res) => {
    const id = req.params.rec_id
    Avis.find({ to: id }).populate("etudiant")
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

router.get('/avis/etudiant/:et_id', auth, (req, res) => {
    const id = req.params.et_id
    Avis.find({ to: id }).populate("recruteur","etudiant")
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            res.send(err);
        })
});

// GET AVIS BY ID
// JSON
// AUTHENTIFICATION NEEDED

router.get('/avis/:id', auth, (req, res) => {
    const id = req.params.id
    Etudiant.findById(id).populate("recruteur")
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            res.send(err);
        })
});



// ADD AVIS
// JSON

router.post('/avis/add', auth, async (req, res) => {

    if(req.body._id === null) {
        delete req.body._id;
      }

    const _avis = new Avis(req.body);

    //GET TOKEN FROM HEADERS
    const token = req.headers["authorization"];
    // DECODE TOKEN
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    
    
    if (decoded.role == "recruteur") {
        _avis.to= _avis.etudiant;
    }
    else if (decoded.role == "etudiant") {
        _avis.to= _avis.recruteur;
    }
    Avis.create(_avis).then(async (user_avis) => {
        console.log("\n>> Created avis:\n", user_avis);

        await Recruteur.findByIdAndUpdate(
            _avis.recruteur,
            { $push: { avis: user_avis._id } },
            { new: true, useFindAndModify: false }
        );
        await Etudiant.findByIdAndUpdate(
            _avis.etudiant,
            { $push: { avis: user_avis._id } },
            { new: true, useFindAndModify: false }
        );
        res.send(user_avis);
    })
        .catch((err) => {
            res.status(400).send(err);
        });
})


// UPDATE AVIS
// JSON

router.put('/avis/update/:id', auth, async (req, res) => {
    const id = req.params.id;
    const _avis = new Avis(req.body);

    //GET TOKEN FROM HEADERS
    const token = req.headers["authorization"];

    const old_avis = await Avis.findById(id);
    if (old_avis) {
        _avis._id = id;

        await Avis.findByIdAndUpdate(id, _avis);
        res.send(await Avis.findById(id));
    }
    else {
        res.send("AVIS NOT FOUND");
    }

})


// DELETE AVIS
// JSON

router.delete('/avis/delete/:id', auth, async (req, res) => {
    const id = req.params.id;
    const old_avis = await Avis.findById(id);
    Avis.findByIdAndDelete(id)
        .then(async (result) => {
            // Remove AVIS id from avis list in the Etudiant document
            await Etudiant.findByIdAndUpdate(
                old_avis.etudiant,
                { $pull: { avis: old_avis._id } },
                { multi: true }
            );

            // Remove AVIS id from avis list in the recruteur document
            await Recruteur.findByIdAndUpdate(
                old_avis.recruteur,
                { $pull: { avis: old_avis._id } },
                { multi: true }
            );
            res.send(result);
        })
        .catch((err) => {
            res.send(err);
        })

})


module.exports = router;