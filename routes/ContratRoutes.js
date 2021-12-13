const express = require('express');

const Boulot = require('../models/contrats');
const path = require("path");
const auth = require("../middleware/auth");
const Contrat = require('../models/contrats');
const Etudiant = require('../models/etudiants');

// To Decode Token
const jwt = require("jsonwebtoken");

const config = process.env;

// INITIALIZE ROUTER
const router = express.Router();

//  GET CONTRAT
// JSON
// AUTHENTIFICATION NEEDED

router.get('/contrats', (req, res) => {
    Contrat.find().populate("etudiant")
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            res.send(err);
        })
})

// GET CONTRAT BY ID
// JSON
// AUTHENTIFICATION NEEDED

router.get('/contrats/boulot/:boulot_id', auth, (req, res) => {
    const boulot_id = req.params.boulot_id
    Contrat.find({ boulot: boulot_id }).populate("etudiant")
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            res.send(err);
        })
});

// GET CONTRAT BY ID
// JSON
// AUTHENTIFICATION NEEDED

router.get('/contrat/:id', auth, (req, res) => {
    const id = req.params.id
    Contrat.findById(id).populate("etudiant")
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            res.send(err);
        })
});



// ADD CONTRAT
// JSON

router.post('/contrats/add', auth, async (req, res) => {

    if (req.body._id === null) {
        delete req.body._id;
    }

    const _contrat = new Contrat(req.body);

    Contrat.create(_contrat).then(async (_contrat) => {
        console.log("\n>> Created Contrat:\n", _contrat);

        await Boulot.findByIdAndUpdate(
            _contrat.boulot,
            { $push: { contrats: _contrat._id } },
            { new: true, useFindAndModify: false }
        );
        await Etudiant.findByIdAndUpdate(
            _contrat.etudiant,
            { $push: { contrats: _contrat._id } },
            { new: true, useFindAndModify: false }
        );
        res.send(_contrat);
    })
        .catch((err) => {
            res.status(400).send(err);
        });

})

//rejeter contrat
router.put('/contrats/reject/:id', auth, async (req, res) => {
    const id = req.params.id;


    const old_contrat = await Contrat.findById(id);
    if (old_contrat) {
        _contrat._id = id;

        await Contrat.findByIdAndUpdate(id, { status: 'rejected' });
        res.send(await Contrat.findById(id));
    }
    else {
        res.send("CONTRAT NOT FOUND");
    }

})

//Accepter contrat
router.put('/contrats/accept/:id', auth, async (req, res) => {
    const id = req.params.id;

    const old_contrat = await Contrat.findById(id);
    if (old_contrat) {
        _contrat._id = id;

        await Contrat.findByIdAndUpdate(id, { status: 'accepted' });
        res.send(await Contrat.findById(id));
    }
    else {
        res.send("CONTRAT NOT FOUND");
    }

})

// UPDATE CONTRAT
// JSON

router.put('/contrats/update/:id', auth, async (req, res) => {
    const id = req.params.id;
    const _contrat = new Contrat(req.body);


    const old_contrat = await Contrat.findById(id);
    if (old_contrat) {
        _contrat._id = id;

        await Contrat.findByIdAndUpdate(id, _contrat);
        res.send(await Contrat.findById(id));
    }
    else {
        res.send("CONTRAT NOT FOUND");
    }

})


// DELETE CONTRAT
// JSON

router.delete('/contrats/delete/:id', auth, async (req, res) => {
    const id = req.params.id;
    const old_contrat = await Contrat.findById(id);
    Contrat.findByIdAndDelete(id)
        .then(async (result) => {
            // Remove CONTRAT id from contrats list in the Boulot document
            await Boulot.findByIdAndUpdate(
                old_contrat.boulot,
                { $pull: { contrats: old_contrat._id } },
                { multi: true }
            );

            // Remove CONTRAT id from contrats list in the Etudiant document
            await Etudiant.findByIdAndUpdate(
                old_contrat.etudiant,
                { $pull: { contrats: old_contrat._id } },
                { multi: true }
            );
            res.send(result);
        })
        .catch((err) => {
            res.send(err);
        })

})


module.exports = router;