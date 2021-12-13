const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CarteBancaireSchema= new Schema(
    {
        numero:{
            type:Number,
            required:true
        },
        balance:{
            type:Number,
            required:true,
        },
        date_expiration:{
            type:Number,
            required:false
        }
        
    }
)
const CarteBancaire = mongoose.model('CarteBancaire', CarteBancaireSchema);
module.exports = CarteBancaire;