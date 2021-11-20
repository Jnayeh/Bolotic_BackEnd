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
        offre: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Offre"
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