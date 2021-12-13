const express = require('express');

const Category = require('../models/categories');
const path = require("path");
const auth = require("../middleware/auth");

// To Decode Token
const jwt = require("jsonwebtoken");

const config = process.env;

// INITIALIZE ROUTER
const router = express.Router();


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


//  GET CATEGORIE BY ID
// JSON
// AUTHENTIFICATION NOT NEEDED

router.get('/categories/:id', auth, (req, res) => {
    const id = req.params.id
    Category.findById(id)
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            res.send(err);
        })
});


// ADD CATEGORY
// JSON

router.post('/categories/add', (req, res) => {

    if (req.body._id === null) {
        delete req.body._id;
    }

    const _category = new Category(req.body);

    //GET TOKEN FROM HEADERS
    const token = req.headers["authorization"];
    // DECODE TOKEN
    const decoded = jwt.verify(token, config.TOKEN_KEY);

    if (decoded.role == "administrateur") {
        Category.create(_category).then(category => {
            console.log("\n>> Category Created:\n", category)

            res.send(category);

        })
            .catch((err) => {
                res.send(err);
            });
    }
    else {
        res.status(403).send("Not Admin");
    }
})


// UPDATE CATEGORY
// JSON

router.put('/categories/update/:id', async (req, res) => {
    const id = req.params.id;
    const _cat = new Category(JSON.parse(req.body));
    const old_cat = await Category.findById(id).select('+mot_de_passe');
    if (old_cat) {
        _cat._id = id;

        await Category.findByIdAndUpdate(id, _cat);
        res.send(await Category.findById(id));
    }
    else {
        res.send("CATEGORY NOT FOUND");
    }
})


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