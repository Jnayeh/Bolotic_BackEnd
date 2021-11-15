const express = require('express');


const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const Administrateur = require('../models/administrateurs.js');

// INITIALIZE ROUTER
const router = express.Router();

//  GET ADMINS
// JSON
// AUTHENTIFICATION NOT NEEDED

router.get('/admins', auth, (req, res) => {

    Administrateur.find()
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            res.send(err);
        })
});

// GET ADMIN BY ID
// JSON
// AUTHENTIFICATION NEEDED

router.get('/admin/:id', auth, (req, res) => {
    const id = req.params.id
    Administrateur.findById(id )
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            res.send(err);
        })
});



// LOGIN ADMIN
// JSON

router.post("/loginAdmin", async (req, res) => {
    try {
        // GET INPUT
        const email = req.body.email.toLowerCase();
        const mot_de_passe = req.body.mot_de_passe;

        // VALIDATE INPUT
        if (!(email && mot_de_passe)) {
            res.status(400).send("All input is required");
        }

        // VALIDATE ADMIN
        const _admin = await Administrateur.findOne({ email: email }).select('+mot_de_passe');


        if (_admin && (await bcrypt.compare(mot_de_passe, _admin.mot_de_passe))) {

            // CREATE TOKEN
            const token = jwt.sign(
                { id: _admin._id,
                role:"admin" },
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
        res.send(err);
    }
});

// ADD ADMIN
// FORM-DATA

router.post('/admins/add', async (req, res) => {
    

    const _admin = new Administrateur(JSON.parse(req.body.admin));

    // ENCRYPTING mot_de_passe
    _admin.mot_de_passe = await bcrypt.hash(_admin.mot_de_passe, 10);

    // CONVERT EMAIL TO LOWERCASE
    _admin.email = _admin.email.toLowerCase();

    // VALIDATE INPUT
    if (!(_admin.email && _admin.mot_de_passe && _admin.nom && _admin.prenom && _admin.num_tel)) {
        res.status(400).send("All input are required");
    }

    const oldAdmin = await Administrateur.findOne({ email: _admin.email });

    if (oldAdmin) {
        return res.status(409).send("Admin Already Exist. Please Login");
    }

    else {

        if (req.files) {

            if (req.files.pdp) {

                //Use the name of the input field (i.e. "pdp") to retrieve the uploaded file
                let pdp = req.files.pdp;

                //Use the mv() method to place the file in upload directory (i.e. "uploads")
                pdp.mv('./admin_files/' + pdp.name);
                _admin.photo ='admin/' + pdp.name;
            }
        }

        _admin.save()
            .then((result) => {

                res.json(result);
            })
            .catch((err) => {
                res.send(err);
            });
    }

})

// UPDATE ADMIN
// FORM-DATA

router.put('/admins/update/:id', auth, async (req, res) => {
    const id = req.params.id;
    const _admin = new Administrateur(JSON.parse(req.body.admin));
    const old_admin = await Administrateur.findById(id).select('+mot_de_passe');
    if (old_admin) {
        _admin._id = id;

        // CONVERT EMAIL TO LOWERCASE
        _admin.email = _admin.email.toLowerCase();

        if (req.files) {

            if (req.files.pdp) {

                //Use the name of the input field (i.e. "pdp") to retrieve the uploaded file
                let pdp = req.files.pdp;

                //Use the mv() method to place the file in upload directory (i.e. "uploads")
                pdp.mv('./admin_files/' + pdp.name);
                _admin.photo ='admin/' + pdp.name;
            }
        }
        
        _admin.mot_de_passe = old_admin.mot_de_passe;
        await Administrateur.findByIdAndUpdate(id, _admin);
        res.send(await Administrateur.findById(id));
    }
    else {
        res.send("ADMIN NOT FOUND");
    }


})

// CHANGE PASSWORD
// JSON

router.put('/admins/change_mdp/:id', auth, async (req, res) => {
    const id = req.params.id;
    const _admin = await Administrateur.findById(id).select('+mot_de_passe');
    if (_admin) {
        old_mdp = req.body.mot_de_passe;
        new_mdp = req.body.new_mot_de_passe;
        if (await bcrypt.compare(old_mdp, _admin.mot_de_passe)) {
            _admin.mot_de_passe = await bcrypt.hash(new_mdp, 10);
            await Administrateur.findByIdAndUpdate(id, _admin);
            res.send("changed password");
        }
        else {
            res.status(400).send("wrong password");
        }
    }
    else {
        res.send("admin NOT FOUND");
    }


})

// DELETE ADMIN
// JSON

router.delete('/admins/delete/:id', auth, (req, res) => {
    const id = req.params.id;

    Administrateur.findByIdAndDelete(id)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            res.send(err);
        })

})



module.exports = router;