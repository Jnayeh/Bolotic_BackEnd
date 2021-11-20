const express = require('express');

const Boulot = require('../models/boulots');
const Recruteur = require('../models/recruteurs');
const path = require("path");
const auth = require("../middleware/auth");

// To Decode Token
const jwt = require("jsonwebtoken");

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

router.post('/boulots/add', (req, res) => {
    const _boulot = new Boulot(req.body);
    
    //GET TOKEN FROM HEADERS
    const token = req.headers["access-token"];
    // DECODE TOKEN
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    // GET RECRUITER ID
    const rec_id = decoded.id;
    _boulot.recruteur = rec_id;
    Boulot.create(_boulot).then(rec_boulot => {
        console.log("\n>> Created Boulot:\n", rec_boulot);

        Recruteur.findByIdAndUpdate(
            rec_id,
            { $push: { boulots: rec_boulot._id } },
            { new: true, useFindAndModify: false }
        ).then((rec)=>{
            res.send(rec);
        })
        .catch((err) => {
            res.send(err);
        });
    })
    .catch((err) => {
        res.send(err);
    });
})


// UPDATE BOULOT
//(Form Data is only used when we need to do file shit)
// Everything else IS :
// JSON

router.put('/boulots/update/:id', async (req, res) => {
    const id = req.params.id;
    const _boulot = new Boulot(req.body);
    
    //GET TOKEN FROM HEADERS
    const token = req.headers["access-token"];
    // DECODE TOKEN
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    // GET RECRUITER ID (We may need it XD)
    const rec_id = decoded.id;

    const old_blt = await Boulot.findById(id);
    if (old_blt) {
        _boulot._id = id;

        // The recruiter can never be changed but the category can so u need to reed the one-to-many article it has ALMOST everything  
        
        await Boulot.findByIdAndUpdate(id, _boulot);
        res.send(await Boulot.findById(id));
    }
    else {
        res.send("BOULOT NOT FOUND");
    }
    
})


module.exports = router;