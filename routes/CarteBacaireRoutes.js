const express = require('express');

const CarteBancaire = require('../models/boulots');
const Etudiant = require('../models/etudiants');
const Recruteur = require('../models/recruteurs');
const path = require("path");
const auth = require("../middleware/auth");
const Boulot = require('../models/boulots');

// To Decode Token
const jwt = require("jsonwebtoken");
const Category = require('../models/categories');

const config = process.env;

// INITIALIZE ROUTER
const router = express.Router();


// PAIEMENT
// JSON

router.put('/boulots/paiement/:id', auth, async (req, res) => {
    const id = req.params.id;
    const _CarteBancaire = new CarteBancaire(req.body);
    const boulot= Boulot.findById(id);
    const montant= boulot.prix;
    //GET TOKEN FROM HEADERS
    const token = req.headers["authorization"];

    const old_carte = await CarteBancaire.find({numero:{$eq:_CarteBancaire.numero}});
    if (old_carte) {
        _CarteBancaire.id=old_carte.id;
        // The recruiter can never be changed but the category can   

        if (old_carte.balance >= montant) {
            const newBalance=old_carte.balance-montant;
            _CarteBancaire.balance=newBalance;
        }
        await CarteBancaire.findByIdAndUpdate(id, _CarteBancaire);
        res.send(await CarteBancaire.findById(id));
    }
    else {
        res.send("BOULOT NOT FOUND");
    }

})

module.exports = router;