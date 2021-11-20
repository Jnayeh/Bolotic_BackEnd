const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const categorySchema = new Schema(
    {
        categorie: {
            type: String,
            required: true
        },
        //Many boulots reference 
        boulots:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Boulot"
              }
        ]
    }
)
const Category = mongoose.model('Category', categorySchema);
module.exports = Category;