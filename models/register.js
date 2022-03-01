const { string } = require("joi");
const mongoose=require("mongoose")



const registerSchema = new mongoose.Schema ({
    name:{
        type:String,
        required:true,
        uppercase:true,

    },
    father_name:{
        type:String,
        required:true,
        uppercase:true,

    },
    email:
    {
        type:String,
        required:true,
    },
    dateOfbirth:{
        type:Date,
        required:true
    },
    rollNo:
    {
        type:Number,
        requird:true,
        min:0
    },
    mobileNo:
    {
        type:Number,
        requird:true,

    },    
    department:
    {
        type:String,
        uppercase:true,
        enum:['B.TECH','B.SC','B.VOC','M.TECH','M.SC','MA'],
        required:true,
    },
    designation:{
        type:String,
        enum:['ADMIN','TEACHER','STUDENT'],
        required:true,
    },
    date_start:{
        type:Date,
        default:Date.now()
    },
    images:{
        url:String,
        filename:String
    }
})

const Register=mongoose.model('Register',registerSchema);
module.exports = Register;