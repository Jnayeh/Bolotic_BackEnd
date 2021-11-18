const express = require('express');

const Boulot = require('../models/boulot.js');
const path = require("path");


// INITIALIZE ROUTER
const router = express.Router();

router.get('/boulots',(req,res)=>{
    Boulot.find()
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            res.send(err);
        })
})

// ADD BOULOT
// FORM-DATA

router.Post('/recruteur:id/addBoulot', (req,res)=>{
    const _boulot = new Boulot(JASON.parse(req.body.boulot))
    
})