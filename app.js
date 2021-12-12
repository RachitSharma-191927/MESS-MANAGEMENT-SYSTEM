const express=require("express")
const path=require("path")
const app=express()

app.set('view engine', 'ejs');
app.use(express.static('public'))
app.set('views',path.join(__dirname,'/views'))

app.listen(3000,()=>{
    console.log("Listening on Port")
})
app.get('/',(req,res)=>{
    res.render('index.ejs')
})

app.get('/login',(req,res)=>{
    res.render('login.ejs')
})

app.get('/register',(req,res)=>{
    res.render('signup.ejs')
})

app.post('/dashboard',(req,res)=>{
    res.render('dashboard.ejs')
})

app.get('/messdetails',(req,res)=>{
    res.render('messdetails.ejs')
})