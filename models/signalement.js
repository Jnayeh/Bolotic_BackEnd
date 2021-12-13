const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const signalementSchema = new Schema(
    {
        description: {
            type: String,
            required: true
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
        },
        id_signaled:{
            type:String,
            required:true,
        },
        id_signaling:{
            type:String,
            required:true,
        }
    }
)
const Signalement = mongoose.model('Signalement', signalementSchema);
module.exports = Signalement;