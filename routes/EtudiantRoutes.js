const express = require('express');

const Etudiant = require('../models/etudiants.js');

const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

// INITIALIZE ROUTER
const router = express.Router();

//  GET ETUDIANTS
// JSON
// AUTHENTIFICATION NEEDED

router.get('/etudiants', auth, (req, res) => {

    Etudiant.find()
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            res.send(err);
        })
});

// GET ETUDIANT BY ID
// JSON
// AUTHENTIFICATION NEEDED

router.get('/etudiant/:id', auth, (req, res) => {
    const id = req.params.id
    Etudiant.findById(id)
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            res.send(err);
        })
});



// LOGIN ETUDIANT
// JSON

router.post("/loginEtudiant", async (req, res) => {
    try {
        // GET INPUT
        const email = req.body.email.toLowerCase();
        const mot_de_passe = req.body.mot_de_passe;

        // VALIDATE INPUT
        if (!(email && mot_de_passe)) {
            res.status(400).send("All input is required");
        }

        // VALIDATE ETUDIANT
        const _etudiant = await Etudiant.findOne({ email: email }).select('+mot_de_passe');


        if (_etudiant && (await bcrypt.compare(mot_de_passe, _etudiant.mot_de_passe))) {

            // CREATE TOKEN
            const token = jwt.sign(
                {
                    id: _etudiant._id,
                    role: "etudiant"
                },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "24h",
                }
            );

            // RETURN ETUDIANT TOKEN
            res.json(token);
        }
        else {
            res.status(400).send({ error: "Invalid Credentials" });
        }
    }
    catch (err) {
        res.send(err);
    }
});

// REGISTER ETUDIANT
// FORM-DATA

router.post('/registerEtudiant', async (req, res) => {

    if (req.body.etudiant._id === null) {
        delete req.body.etudiant._id;
    }

    const _et = new Etudiant(JSON.parse(req.body.etudiant));

    // CONVERT EMAIL TO LOWERCASE
    _et.email = _et.email.toLowerCase();

    // VALIDATE INPUT
    if (!(_et.email && _et.mot_de_passe && _et.nom && _et.prenom && _et.num_tel && _et.universite)) {
        res.status(400).send("All input are required");
    }

    const oldEtudiant = await Etudiant.findOne({ email: _et.email });

    if (oldEtudiant) {
        return res.status(409).send("Etudiant Already Exist. Please Login");
    }

    else {
        // ENCRYPTING mot_de_passe
        _et.mot_de_passe = await bcrypt.hash(_et.mot_de_passe, 10);


        if (req.files) {

            if (req.files.pdp) {

                //Use the name of the input field (i.e. "pdp") to retrieve the uploaded file
                let pdp = req.files.pdp;

                //Use the mv() method to place the file in upload directory (i.e. "uploads")
                pdp.mv('./files/' + pdp.name);
                _et.photo = pdp.name;
            }
        }

        console.log(_et);

        Etudiant.create(_et)
            .then((result) => {

                // CREATE TOKEN
                const token = jwt.sign(
                    {
                        id: et._id,
                        role: "etudiant"
                    },
                    process.env.TOKEN_KEY,
                    {
                        expiresIn: "24h",
                    }
                );

                // SAVE ETUDIANT TOKEN
                res.json(token);

            })
            .catch((err) => {
                res.send(err);
            });
    }

})

// UPDATE ETUDIANT
// FORM-DATA

router.put('/etudiants/update/:id', auth, async (req, res) => {
    const id = req.params.id;
    const _et = new Etudiant(JSON.parse(req.body.etudiant));
    const old_et = await Etudiant.findById(id).select('+mot_de_passe');
    if (old_et) {
        _et._id = id;

        // CONVERT EMAIL TO LOWERCASE
        _et.email = _et.email.toLowerCase();

        if (req.files) {

            if (req.files.pdp) {

                //Use the name of the input field (i.e. "pdp") to retrieve the uploaded file
                let pdp = req.files.pdp;

                //Use the mv() method to place the file in upload directory (i.e. "uploads")
                pdp.mv('./files/' + pdp.name);
                _et.photo = pdp.name;
            }
        }
        _et.mot_de_passe = old_et.mot_de_passe;
        await Etudiant.findByIdAndUpdate(id, _et);
        res.send(await Etudiant.findById(id));
    }
    else {
        res.send("ETUDIANT NOT FOUND");
    }


})

// CHANGE PASSWORD
// JSON

router.put('/etudiants/change_mdp/:id', auth, async (req, res) => {
    const id = req.params.id;
    const _et = await Etudiant.findById(id).select('+mot_de_passe');
    if (_et) {
        old_mdp = req.body.mot_de_passe;
        new_mdp = req.body.new_mot_de_passe;
        if (await bcrypt.compare(old_mdp, _et.mot_de_passe)) {
            _et.mot_de_passe = await bcrypt.hash(new_mdp, 10);
            await Etudiant.findByIdAndUpdate(id, _et);
            res.send("changed password");
        }
        else {
            res.status(400).send("same password");
        }
    }
    else {
        res.send("ETUDIANT NOT FOUND");
    }


})

// DELETE ETUDIANT
// JSON

router.delete('/etudiants/delete/:id', auth, (req, res) => {
    const id = req.params.id;

    Etudiant.findByIdAndDelete(id)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            res.send(err);
        })

})

// // ADD ETUDIANT
// router.post('/etudiants/add/',(req,res) => {

//     const u = new Etudiant(req.body);
//     _et.save()
//     .then((result) => {
//         res.send(result);
//     })
//     .catch((err) => {
//         res.send(err);
//     })
// })

module.exports = router;