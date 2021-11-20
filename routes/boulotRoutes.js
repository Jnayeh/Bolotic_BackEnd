const express = require('express');

const Boulot = require('../models/boulots');
const Recruteur = require('../models/recruteurs');
const path = require("path");

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

router.Post('/recruteur:id/addBoulot', auth , (req,res)=>{
    const _boulot = new Boulot(JASON.parse(req.body.boulot))

})


module.exports = router;