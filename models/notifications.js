const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const notificationSchema = new Schema(
    {
        titre: {
            type: String,
            required: true
        },
        notification: {
            type: String,
            required: true
        },
        read: {
            type: Boolean,
            required: true,
            default: false
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
        },
        //One administrateur reference
        administrateur: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Administrateur"
        }
    }
)
const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;