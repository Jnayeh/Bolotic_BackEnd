const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const boulotSchema = new Schema(
    {
        titre: {
            type: String,
            required:true
        },
        description: {
            type: String,
            required: true
        },
        prix: {
            type: Number,
            required:true
        },
        date_debut: {
            type: dateTime,
            required:true,
        },
        date_fin: {
            type: dateTime,
            required:true,
        }
    }
)
const Boulot = mongoose.model('Boulot', boulotSchema);
module.exports = Boulot;