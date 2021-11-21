const express = require('express');

const Boulot = require('../models/boulots');
const Recruteur = require('../models/recruteurs');
const path = require("path");
const auth = require("../middleware/auth");

// To Decode Token
const jwt = require("jsonwebtoken");
const Category = require('../models/categories');

const config = process.env;

// INITIALIZE ROUTER
const router = express.Router();

router.get('/boulots', (req, res) => {
    Boulot.find()
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            res.send(err);
        })
})

// ADD BOULOT
// JSON

router.post('/boulots/add', async (req, res) => {
    const _boulot = new Boulot(req.body);

    //GET TOKEN FROM HEADERS
    const token = req.headers["access-token"];
    // DECODE TOKEN
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    // GET RECRUITER ID
    const rec_id = decoded.id;
    _boulot.recruteur = rec_id;
    if (decoded.role == "recruteur") {
        Boulot.create(_boulot).then(async (rec_boulot) => {
            console.log("\n>> Created Boulot:\n", rec_boulot);

            await Recruteur.findByIdAndUpdate(
                rec_id,
                { $push: { boulots: rec_boulot._id } },
                { new: true, useFindAndModify: false }
            );
            await Category.findByIdAndUpdate(
                _boulot.category,
                { $push: { boulots: rec_boulot._id } },
                { new: true, useFindAndModify: false }
            );
            res.send(rec_boulot);
        })
            .catch((err) => {
                res.send(err);
            });
    }
    else {
        res.send("Not recruteur");
    }
})


// UPDATE BOULOT
// JSON

router.put('/boulots/update/:id', async (req, res) => {
    const id = req.params.id;
    const _boulot = new Boulot(req.body);

    //GET TOKEN FROM HEADERS
    const token = req.headers["access-token"];

    const old_boulot = await Boulot.findById(id);
    if (old_boulot) {
        _boulot._id = id;

        // The recruiter can never be changed but the category can   

        if (old_boulot.category != _boulot.category) {
            await Category.findByIdAndUpdate(
                old_boulot.category,
                { $pull: { boulots: _boulot._id } },
                { multi: true }
            );

            await Category.findByIdAndUpdate(
                _boulot.category,
                { $push: { boulots: _boulot._id } },
                { new: true, useFindAndModify: false }
            );
        }

        await Boulot.findByIdAndUpdate(id, _boulot);
        res.send(await Boulot.findById(id));
    }
    else {
        res.send("BOULOT NOT FOUND");
    }

})


// DELETE BOULOT
// JSON

router.delete('/boulots/delete/:id', async (req, res) => {
    const id = req.params.id;
    const old_boulot = await Boulot.findById(id);
    Boulot.findByIdAndDelete(id)
        .then(async (result) => {
            // Remove Boulot id from boulots list in the category document
            await Category.findByIdAndUpdate(
                old_boulot.category,
                { $pull: { boulots: old_boulot._id } },
                { multi: true }
            );

            // Remove Boulot id from boulots list in the recruteur document
            await Recruteur.findByIdAndUpdate(
                old_boulot.recruteur,
                { $pull: { boulots: old_boulot._id } },
                { multi: true }
            );
            res.send(result);
        })
        .catch((err) => {
            res.send(err);
        })

})


module.exports = router;