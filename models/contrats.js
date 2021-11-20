const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const contratSchema = new Schema(
    {
        status: {
            type: String,
            required: true,
            default: "non selected"
        },
        //One boulot reference
        boulot: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Boulot"
        },
        //One etudiant reference
        etudiant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Etudiant"
        }
    }
)
const Contrat = mongoose.model('Contrat', contratSchema);
module.exports = Contrat;