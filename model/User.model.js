const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
        
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6
    },
    email:{
        type: String,
        required: true,
        trim: true
    },
    
},
    {
        timestamps: true,
    }
);
 const user = mongoose.model('user',userSchema);
 module.exports = user;