const mongoose=require('mongoose')
const Product=require('./models/register');
mongoose.connect('mongodb://localhost:27017/MessManagement')
.then(()=>{
        console.log("Connected to Mongo DB")
})
.catch((err)=>{
    console.log("Error Found")
    console.log(err)
})

const P = new Product ({
    name:'Ritika Sharma',
    father_name:"Pawan Kumar Sharma",
    email:'ritikasharma3642@gmail.com',
    dateOfbirth:Date.now(),
    rollNo:1,
    mobileNO:856988878,
    department:'B.TECH',
    designation:'ADMIN'
})

P.save().then((a)=>{
    console.log("Value added to the database as admin")
    console.log(a)
})