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
    name:'rsjAAAA',
    father_name:"safAA",
    email:'rshr36AAA42@gmail.com',
    dateOfbirth:new Date('2020-12-02'),
    rollNo:1011,
    mobileNO:8243464343,
    department:'B.TECH',
    date_start:new Date('2021-10-04'),
    designation:'STUDENT'
})

P.save().then((a)=>{
    console.log("Value added to the database as admin")
    console.log(a)
})