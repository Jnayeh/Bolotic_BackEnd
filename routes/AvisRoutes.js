const express = require('express');

const Boulot = require('../models/avis');
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

// GET AVIS BY ID
// JSON
// AUTHENTIFICATION NEEDED

router.get('/avis/recruteur/:id', auth, (req, res) => {
    const id = req.params.id
    Avis.find({ etudiant: id }).populate("etudiant")
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

router.get('/avis/etudiant/:id', auth, (req, res) => {
    const id = req.params.id
    Avis.find({ recruteur: id }).populate("recruteur")
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
    const _avis = new Avis(req.body);

    //GET TOKEN FROM HEADERS
    const token = req.headers["authorization"];
    // DECODE TOKEN
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    // GET RECRUITER ID
    const rec_id = decoded.id;
    _avis.recruteur = rec_id;
    if (decoded.role == "recruteur") {
        Avis.create(_avis).then(async (rec_avis) => {
            console.log("\n>> Created Boulot:\n", rec_avis);

            await Recruteur.findByIdAndUpdate(
                rec_id,
                { $push: { avis: rec_avis._id } },
                { new: true, useFindAndModify: false }
            );
            await Etudiant.findByIdAndUpdate(
                _avis.etudiant,
                { $push: { avis: rec_avis._id } },
                { new: true, useFindAndModify: false }
            );
            res.send(rec_avis);
        })
            .catch((err) => {
                res.status(400).send(err);
            });
    }
    else {
        res.send("Not recruteur");
    }
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
        res.send("BOULOT NOT FOUND");
    }

})


// DELETE AVIS
// JSON

router.delete('/avis/delete/:id', auth, async (req, res) => {
    const id = req.params.id;
    const old_avis = await Avis.findById(id);
    Avis.findByIdAndDelete(id)
        .then(async (result) => {
            // Remove Boulot id from boulots list in the Etudiant document
            await Etudiant.findByIdAndUpdate(
                old_avis.etudiant,
                { $pull: { avis: old_avis._id } },
                { multi: true }
            );

            // Remove Boulot id from boulots list in the recruteur document
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