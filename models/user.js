const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const passportLocalMongoose=require('passport-local-mongoose').default;

// console.log(typeof passportLocalMongoose);
// console.log(passportLocalMongoose);

const userSchema=new Schema({
    email: {
        type: String,
        required: true
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model('User',userSchema);