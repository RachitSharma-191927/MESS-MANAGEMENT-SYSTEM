const express=require("express")
const mongoose=require("mongoose")
const path=require("path")
const app=express()
const register=require('./models/register');
mongoose.connect('mongodb://localhost:27017/MessManagement',)
.then(()=>{
        console.log("Connected to Mongo DB")
})
.catch((err)=>{
    console.log("Error Found")
    console.log(err)
})

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.set('view engine', 'ejs');
app.use(express.static('public'))
app.set('views',path.join(__dirname,'/views'))
var details;
var rollNo=0;
var designation;
var id;
var login=false;
var totalFees = (data)=>{
    Days=Math.floor((Date.now()-data.date_start.getTime())/(1000*24*3600))
    perDayFees=120;
    fees=perDayFees*Days
    return fees
}

app.listen(3000,()=>{
    console.log("Listening on Port")
})
app.get('/',(req,res)=>{
    res.render('index.ejs',{login,details,id})
})

app.get('/login', async (req,res)=>{
    a=false;
    res.render('login.ejs',{a,login})
})

app.get('/register',(req,res)=>{
    a=false;
    res.render('signup.ejs',{login})
})
app.post('/user',async(req,res)=>{
    details= await register.find(req.body)
    a=false;
    if(details.length===0)
    {
        a=true;
        res.render("login.ejs",{a,login})
    }
    else{
    login=true;
    rollNo=req.body.rollNo;
    designation=req.body.designation;
    id=details[0]._id
    console.log(id)
    res.redirect(`/dashboard/${id}`)
    }
})
app.post('/dashboard', async (req,res)=>{
    details= await register.findOne({rollNo:req.body.rollNo,department:req.body.department,name:req.body.name,email:req.body.email})
    a=false;
    if(details.length!==0)
    {
        a=true;
        login=false;
        res.render("signup.ejs",{a,login})
    }
    else
    {
        product=new register(req.body)
        await product.save().then((v)=>{
        console.log(v);
        })
        details= await register.find({rollNo:req.body.rollNo})
        var rollNo=req.body.rollNo;
        login=true
        fees= await totalFees(details)
        res.render('dashboard.ejs',{details,login,fees,id})
    }
})


app.get('/dashboard/:id',async (req,res)=>{
    var {id} =req.params
    console.log(id)
    console.log("Wow man")
    details=await register.findById(id)
    if(details.designation==="ADMIN")
    {
        login=true;
        details=await register.find({designation:{$ne:"ADMIN"}})
        res.render('admin.ejs',{details,login,id})
    }
    else
    {
    login=true;
    fees= await totalFees(details)
    res.render('dashboard.ejs',{details,login,fees,id})
    }
})

app.get('/messdetails',(req,res)=>{
    res.render('messdetails.ejs',{login,details,id})
})

app.get('/logout',(req,res)=>{
    login=false
    res.redirect('/')
})