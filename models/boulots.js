const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const boulotSchema = new Schema(
    {
        titre: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        prix: {
            type: Number,
            required: true
        },
        date_debut: {
            type: Date,
            required: false,
        },
        date_fin: {
            type: Date,
            required: false,
        },
        recruteur: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Recruteur"
        }
    }
)
const Boulot = mongoose.model('Boulot', boulotSchema);
module.exports = Boulot;