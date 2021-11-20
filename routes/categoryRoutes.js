const express = require('express');

const Category = require('../models/categories');
const path = require("path");

// To Decode Token
const jwt = require("jsonwebtoken");

const config = process.env;

// INITIALIZE ROUTER
const router = express.Router();

router.get('/categories', (req, res) => {
    Category.find()
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            res.send(err);
        })
})

// ADD Category
// JSON

router.post('/categories/add', (req, res) => {
    const _category = new Category(req.body);
    
    //GET TOKEN FROM HEADERS
    const token = req.headers["access-token"];
    // DECODE TOKEN
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    // GET ADMIN ID
    const admin_id = decoded.id;
    _boulot.administrateur = admin_id;
    if(decoded.role=="administrateur"){
        Category.create(_category).then(admin_category => {
            console.log("\n>> Category Created:\n", admin_category)
            .then((admin)=>{
                res.send(admin);
            })
            .catch((err) => {
                res.send(err);
            });
        })
        .catch((err) => {
            res.send(err);
        });
    }
    else{
        res.send("Not Admin");
    }
})
//  GET CATEGORIES
// JSON
// AUTHENTIFICATION NOT NEEDED

router.get('/categories', (req, res) => {

    Category.find()
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            res.send(err);
        })
});


// DELETE CATEGORY
// JSON

router.delete('/categories/delete/:id', (req, res) => {
    const id = req.params.id;

    Category.findByIdAndDelete(id)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            res.send(err);
        })

})


module.exports = router;