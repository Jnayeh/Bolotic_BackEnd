const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const administrateurSchema = new Schema(
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
        photo: {
            type: String,
            required: false
        },
        date_creation: {
            type: Date, default: Date.now
        },
    }
);

const Administrateur = mongoose.model('Administrateur', administrateurSchema);
module.exports = Administrateur;