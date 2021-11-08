const express = require('express');

const Etudiant = require('../models/etudiants.js');

const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

// INITIALIZE ROUTER
const router =express.Router();

//  GET ETUDIANTS
// JSON
// AUTHENTIFICATION NOT NEEDED

router.get('/etudiants',(req,res) => {
    
    Etudiant.find()
    .then((result) => {
        res.send (result)
    })
    .catch((err) => {
        console.log(err);
    })
}); 

// GET ETUDIANT BY ID
// JSON
// AUTHENTIFICATION NEEDED

router.get('/etudiant/:id',auth,(req,res) => {
    const id = req.params.id
    Etudiant.findOne({id: id})
    .then((result) => {
        res.send (result)
    })
    .catch((err) => {
        console.log(err);
    })
}); 



// LOGIN ETUDIANT
// JSON

router.post("/loginEtudiant", async (req, res) => {
    try {
      // GET INPUT
        const email = req.body.email.toLowerCase();
        const mot_de_passe = req.body.mot_de_passe;
      
      // VALIDATE INPUT
      if (!(email && mot_de_passe)) {
        res.status(400).send("All input is required");
      }

      // VALIDATE ETUDIANT
      const _etudiant = await Etudiant.findOne({ email:email });
      

      if (_etudiant && (await bcrypt.compare(mot_de_passe, _etudiant.mot_de_passe))) {
        
        
        _etudiant.mot_de_passe=null;
            
        // CREATE TOKEN
        const token = jwt.sign(
          { _etudiant },
          process.env.TOKEN_KEY,
          {
            expiresIn: "48h",
          }
        );
  
        // SAVE ETUDIANT TOKEN
        res.json(token);
      }
      else{
          res.status(400).send("Invalid Credentials");
      }
    }
    catch (err) {
      console.log(err);
    }
  });

// REGISTER ETUDIANT
// FORM-DATA

router.post('/registerEtudiant',async (req,res) => {
   
    const et = new Etudiant(JSON.parse(req.body.etudiant));

    // ENCRYPTING mot_de_passe
    et.mot_de_passe = await bcrypt.hash(et.mot_de_passe, 10);

    // CONVERT EMAIL TO LOWERCASE
    et.email= et.email.toLowerCase();

    // VALIDATE INPUT
    if (!(et.email && et.mot_de_passe && et.nom && et.prenom && et.num_tel && et.universite)) {
        res.status(400).send("All input are required");
      }
    
    const oldEtudiant = await Etudiant.findOne({ email : et.email });

    if (oldEtudiant) {
    return res.status(409).send("Etudiant Already Exist. Please Login");
    }

    else{

        if(req.files.pdp) {
    
            //Use the name of the input field (i.e. "pdp") to retrieve the uploaded file
            let pdp = req.files.pdp;
            
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            pdp.mv('./files/' + pdp.name);
            et.photo='http://localhost:3000/images/' + pdp.name;
        }

        console.log(et);

        et.save()
        .then((result) => {

            result.mot_de_passe=null;
            
            // CREATE TOKEN
            const token = jwt.sign(
                { etudiant: result },
                process.env.TOKEN_KEY,
                {
                expiresIn: "24h",
                }
            );
            
            // SAVE ETUDIANT TOKEN
            res.json(token);
        })
        .catch((err) => {
            console.log(err);
        });
    }
        
})

// UPDATE ETUDIANT
// FORM-DATA

router.put('/etudiants/update/:id',auth, async (req,res) => {
    const id = req.params.id;
    const et = new Etudiant(JSON.parse(req.body.etudiant));
    et._id=id;

    // CONVERT EMAIL TO LOWERCASE
    et.email= et.email.toLowerCase();

    if(req.files.pdp) {
    
        //Use the name of the input field (i.e. "pdp") to retrieve the uploaded file
        let pdp = req.files.pdp;
        
        //Use the mv() method to place the file in upload directory (i.e. "uploads")
        pdp.mv('./files/' + pdp.name);
        et.photo='http://localhost:3000/images/' + pdp.name;
    }

    const etd = await Etudiant.findById(id);
    et.mot_de_passe=etd.mot_de_passe;
    await Etudiant.findByIdAndUpdate(id,et);
    res.send( await Etudiant.findById(id));
    
})

// CHANGE PASSWORD
// JSON

router.put('/etudiants/change_mdp/:id',auth, async (req,res) => {
    const id = req.params.id;
    const et = await Etudiant.findById(id);
    old_mdp = req.body.mot_de_passe;
    new_mdp = req.body.new_mot_de_passe;
    if(await bcrypt.compare(old_mdp, et.mot_de_passe)){
        et.mot_de_passe= await bcrypt.hash(new_mdp, 10);
        await Etudiant.findByIdAndUpdate(id,et);
        res.send( "changed password");
    }
    else{
        res.status(400).send("wrong password");
    }
    
})

// DELETE ETUDIANT
// JSON

router.delete('/etudiants/delete/:id',auth,(req,res) => {
    const id = req.params.id;
    
    Etudiant.findByIdAndDelete(id)
    .then((result) => {
        res.send(result);
    })
    .catch((err) => {
        console.log(err);
    })
    
})

// // ADD ETUDIANT
// router.post('/etudiants/add/',(req,res) => {
    
//     const u = new Etudiant(req.body);
//     et.save()
//     .then((result) => {
//         res.send(result);
//     })
//     .catch((err) => {
//         console.log(err);
//     })
// })

module.exports = router;