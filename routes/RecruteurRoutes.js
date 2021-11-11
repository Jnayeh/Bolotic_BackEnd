const express = require('express');

const Recruteur = require('../models/recruteurs.js');

const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

// INITIALIZE ROUTER
const router = express.Router();

//  GET RECRUITERS
// JSON
// AUTHENTIFICATION NOT NEEDED

router.get('/recruteurs', auth, (req, res) => {

    Recruteur.find()
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.log(err);
        })
});

// GET RECRUITER BY ID
// JSON
// AUTHENTIFICATION NEEDED

router.get('/recruteur/:id', auth, (req, res) => {
    const id = req.params.id
    Recruteur.findOne({ id: id })
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.log(err);
        })
});



// LOGIN
// JSON

router.post("/loginRecruteur", async (req, res) => {
    try {
        // GET INPUT
        const email = req.body.email.toLowerCase();
        const mot_de_passe = req.body.mot_de_passe;

        // VALIDATE INPUT
        if (!(email && mot_de_passe)) {
            res.status(400).send("All input is required");
        }

        // VALIDATE RECRUITER
        const _rec = await Recruteur.findOne({ email: email }).select('+mot_de_passe');


        if (_rec && (await bcrypt.compare(mot_de_passe, _rec.mot_de_passe))) {

            // CREATE TOKEN
            const token = jwt.sign(
                { recruteur_id: _rec.id },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "48h",
                }
            );

            // RETURN TOKEN
            res.json(token);
        }
        else {
            res.status(400).send("Invalid Credentials");
        }
    }
    catch (err) {
        console.log(err);
    }
});

// REGISTER RECRUITER
// FORM-DATA

router.post('/registerRecruteur', async (req, res) => {

    const _rec = new Recruteur(JSON.parse(req.body.recruteur));

    // ENCRYPTING mot_de_passe
    _rec.mot_de_passe = await bcrypt.hash(_rec.mot_de_passe, 10);

    // CONVERT EMAIL TO LOWERCASE
    _rec.email = _rec.email.toLowerCase();

    // VALIDATE INPUT
    if (!(_rec.email && _rec.mot_de_passe && _rec.nom && _rec.prenom && _rec.num_tel && _rec.universite)) {
        res.status(400).send("All input are required");
    }

    const oldRecruteur = await Recruteur.findOne({ email: _rec.email });

    if (oldRecruteur) {
        return res.status(409).send("Recruteur Already Exist. Please Login");
    }

    else {

        if (req.files) {

            if (req.files.pdp) {

                //Use the name of the input field (i.e. "pdp") to retrieve the uploaded file
                let pdp = req.files.pdp;

                //Use the mv() method to place the file in upload directory (i.e. "uploads")
                pdp.mv('./files/' + pdp.name);
                _rec.photo = pdp.name;
            }

            if (req.files.logo_societe) {

                //Use the name of the input field (i.e. "logo_societe") to retrieve the uploaded file
                let logo_societe = req.files.logo_societe;

                //Use the mv() method to place the file in upload directory (i.e. "uploads")
                logo_societe.mv('./logos/' + logo_societe.name);
                _rec.logo_societe = '/logos/' + logo_societe.name;
            }
        }

        console.log(_rec);

        _rec.save()
            .then((result) => {

                // CREATE TOKEN
                const token = jwt.sign(
                    { recruteur_id: result.id },
                    process.env.TOKEN_KEY,
                    {
                        expiresIn: "24h",
                    }
                );

                // SAVE RECRUITER TOKEN
                res.json(token);
            })
            .catch((err) => {
                console.log(err);
            });
    }

})

// UPDATE RECRUITER
// FORM-DATA

router.put('/recruteurs/update/:id', auth, async (req, res) => {
    const id = req.params.id;
    const _rec = new Recruteur(JSON.parse(req.body.recruteur));
    const old_rec = await Recruteur.findById(id).select('+mot_de_passe');

    if (old_rec) {
        _rec._id = id;
        // CONVERT EMAIL TO LOWERCASE
        _rec.email = _rec.email.toLowerCase();

        if (req.files) {

            if (req.files.pdp) {

                //Use the name of the input field (i.e. "pdp") to retrieve the uploaded file
                let pdp = req.files.pdp;

                //Use the mv() method to place the file in upload directory (i.e. "uploads")
                pdp.mv('./files/' + pdp.name);
                _rec.photo = pdp.name;
            }

            if (req.files.logo_societe) {

                //Use the name of the input field (i.e. "logo_societe") to retrieve the uploaded file
                let logo_societe = req.files.logo_societe;

                //Use the mv() method to place the file in upload directory (i.e. "uploads")
                logo_societe.mv('./logos/' + logo_societe.name);
                _rec.logo_societe = '/logos/' + logo_societe.name;
            }
        }

        _rec.mot_de_passe = old_rec.mot_de_passe;
        await Recruteur.findByIdAndUpdate(id, _rec);
        res.send(await Recruteur.findById(id));
    }
    else {
        res.send("RECRUITER NOT FOUND");
    }

})

// CHANGE PASSWORD
// JSON

router.put('/recruteurs/change_mdp/:id', auth, async (req, res) => {
    const id = req.params.id;
    const _rec = await Recruteur.findById(id).select('+mot_de_passe');
    if (_rec) {
        old_mdp = req.body.mot_de_passe;
        new_mdp = req.body.new_mot_de_passe;
        if (await bcrypt.compare(old_mdp, _rec.mot_de_passe)) {
            _rec.mot_de_passe = await bcrypt.hash(new_mdp, 10);
            await Recruteur.findByIdAndUpdate(id, _rec);
            res.send("changed password");
        }
        else {
            res.status(400).send("wrong password");
        }
    }
    else {
        res.send("RECRUITER NOT FOUND");
    }

})

// DELETE RECRUITER
// JSON

router.delete('/recruteurs/delete/:id', auth, (req, res) => {
    const id = req.params.id;

    Recruteur.findByIdAndDelete(id)
        .then((result) => {
            res.send("RECRUITER DELETED");
        })
        .catch((err) => {
            res.send(err);
        })

})


module.exports = router;