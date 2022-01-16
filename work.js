const mongoose=require("mongoose")
mongoose.connect('mongodb://localhost:27017/Checking')
.then(()=>{
        console.log("Connected to Mongo DB")
})
.catch((err)=>{
    console.log("Error Found")
    console.log(err)
})
const registerSchema = new mongoose.Schema ({
    first_name:{
        type:String,
        required:true,
        uppercase:true,

    },
    last_name:{
        type:String,
        required:true,
        uppercase:true,

    },
    date_start:{
        type:Date,
        default:Date.now()
    }
})

const Register=mongoose.model('Register',registerSchema);

const product = new Register(
    {
        first_name:'Rajesh',
        last_name:"Sharma",
        date_start: new Date("12/22/2020")
    }
)

var details;

async function findDetails()
{
    details = await Register.findOne({first_name:'Rajesh'})
    console.log("Finded Details")
    console.log(details)
}
async function saveProduct()
{
        await product.save().then((a)=>{
        console.log("Added to the database")
        console.log(a)
        console.log("startedd what we want")
    })
    await findDetails()
    console.log(`The dates are ${product.date_start} and ${details.date_start} The difference between date ${Math.floor((details.date_start.getTime()-Date.now())/(1000*24*3600))}`)
}


saveProduct()

