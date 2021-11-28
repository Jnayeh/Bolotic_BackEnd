const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const avisSchema = new Schema(
    {
        avis: {
            type: String,
            required: true
        },
        to: {
            type: mongoose.Schema.Types.ObjectId
        },
        //One recruteur reference
        recruteur: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Recruteur"
        },
        //One etudiant reference
        etudiant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Etudiant"
        }
    }
)
const Avis = mongoose.model('Avis', avisSchema);
module.exports = Avis;