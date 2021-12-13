const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const etudiantSchema = new Schema(
    {
        nom: {
            type: String,
            required: true
        },
        prenom: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        num_tel: {
            type: Number,
            required: true
        },
        mot_de_passe: {
            type: String,
            required: true,
            select: false
        },
        suspended: {
            type: Boolean,
            default: false,
            required: false
        },
        cin: {
            type: Number,
            required: false
        },
        universite: {
            type: String,
            required: true
        },
        photo: {
            type: String,
            required: false
        },
        date_creation: {
            type: Date, default: Date.now
        },
        //Many avis reference 
        avis:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Avis"
              }
        ],
        //Many notifications reference 
        notifications:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Notification"
              }
        ],
        //Many avis reference 
        contrats:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Contrat"
              }
        ],
        //Many signalement reference 
        signalements:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Signalement"
              }
        ]
    }
);

const Etudiant = mongoose.model('Etudiant', etudiantSchema);
module.exports = Etudiant;