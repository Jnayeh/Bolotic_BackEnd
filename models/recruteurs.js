const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recruteurSchema = new Schema(
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
            required: true
        },
        cin: {
            type: Number,
            required: false
        },
        photo: {
            type: String,
            required: false
        },
        societe: {
            type: String,
            required: false
        },
        logo_societe: {
            type: String,
            required: false
        },
        date_creation: {
            type: Date, default: Date.now
        },
        //Many boulots reference 
        boulots:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Boulot"
              }
        ]
    }
);

const Recruteur = mongoose.model('Recruteur', recruteurSchema);
module.exports = Recruteur;