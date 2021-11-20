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
            required: true,
            default: Date.now()
        },
        date_fin: {
            type: Date,
            required: false,
        },
        //One recruteur reference
        recruteur: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Recruteur"
        },
        //One category reference
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        }
    }
)
const Boulot = mongoose.model('Boulot', boulotSchema);
module.exports = Boulot;