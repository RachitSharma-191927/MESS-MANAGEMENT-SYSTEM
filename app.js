if(process.env.NODE_ENV !== "production")
{
    require('dotenv').config();
}

const express=require("express")
const mongoose=require("mongoose")
const path=require("path")
const methodOverride=require('method-override')
const morgan=require("morgan")
const flash=require('connect-flash')
const app=express()
const session=require("express-session")
const register=require('./models/register');
const AppError=require('./apperror')
const requireLogin=require('./middleware')
const {dashboardSchema,dashboardSignSchema}=require('./validations')
const {storage}=require("./cloudinary")
const multer=require('multer')
const upload=multer({storage})



mongoose.connect('mongodb://localhost:27017/MessManagement',)
.then(()=>{
        console.log("Connected to Mongo DB")
})
.catch((err)=>{
    console.log("Error Found")
    console.log(err)
})

app.use(flash());

app.use(session({
    secret:"This is a good Secret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now() + (1000*60*60*24*2),
        maxAge:(1000*60*60*24*2)

    }
}))

app.use((req,res,next)=>{
    res.locals.message=req.flash('success')
    res.locals.failure=req.flash('failure')
    res.locals.failures=req.flash('failures')
    next()    
})





const validateDetails = (req,res,next)=>{
    const result=dashboardSchema.validate(req.body);
    if(result.error)
    {
        const msg=result.error.details.map(el=>el.message).join(',')
        throw new AppError(msg,400)
    }
    else
    {
        next()
    }
}

const validateSignDetails = (req,res,next)=>{
    const result=dashboardSignSchema.validate(req.body);
    if(result.error)
    {
        const msg=result.error.details.map(el=>el.message).join(',')
        throw new AppError(msg,400)
    }
    else
    {
        next()
    }
}



const adminrequire = async (req,res,next)=>{
    const id = req.session.user_id;
    const details = await register.findById(id);
    if(details.designation!=="ADMIN")
    {
        req.flash('failure',"You are not Authorized to do that")
        return res.redirect("/dashboard/details")
    }
    else{
        next()
    }
    
}


app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(morgan('tiny'));




app.use((req,res,next)=>{
    console.log(req.method.toUpperCase())
    next();// You need to add so that we ca
})



app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'/views'))





var totalFees = async (id)=>{
    const details= await register.findById(id)
    Days=Math.floor((Date.now()-details.date_start.getTime())/(1000*24*3600))
    perDayFees=120;
    fees=perDayFees*Days
    return fees
}

function wrapAsync(fn){
    return function(req,res,next)
    {
        fn(req,res,next).catch((e)=>{
            next(e)
        })
    }
}


app.get('/',(req,res)=>{
    const id = req.session.user_id;
    return res.render('index.ejs',{id})
})

app.get('/login', (req,res)=>{
    const id = req.session.user_id;
    res.render('login.ejs',{id})
    
})

app.get('/register',(req,res)=>{
    const id = req.session.user_id;
    res.render('signup.ejs',{id})
})
app.get('/messdetails',(req,res)=>{
    const id = req.session.user_id;
    res.render('messdetails.ejs',{id})
})

app.get('/logout',requireLogin,(req,res)=>{
    req.session.user_id=null;
    res.redirect('/')
})



app.get('/dashboard/details',requireLogin, wrapAsync(async (req,res,next)=>{
    const id = req.session.user_id;
    const details = await register.findById(id)
    if(details.designation=="ADMIN")
    {
        const alldetails=await register.find({designation:{$ne:'ADMIN'}})
        const fees=[]
        for( let data of alldetails)
        {
            fees.push(await totalFees(data.id))
        }
        res.render('admin.ejs',{alldetails,id,fees})
    }
    else
    {
    fees= await totalFees(id)
    console.log("The user id from session is",req.session.user_id)
    res.render('dashboard.ejs',{details,fees,id})
    }
}))



app.get('/dashboard/edit',requireLogin,wrapAsync(async (req,res)=>{
    const details = await register.findById(req.session.user_id)
    id=req.session.user_id;
    res.render('edit.ejs',{details,id})
}))

app.get('/studentsearch',requireLogin,adminrequire,(req,res)=>{
    const id = req.session.user_id;
    res.render('student_search.ejs',{id})
})


app.post('/dashboard/login',validateDetails, wrapAsync(async (req,res)=>{
    const details= await register.find(req.body) 
    if(details.length===0)
    {
        req.flash('failure',"You have entered wrong details")
        res.redirect('/login')
    }
    else{
   
    req.session.user_id=details[0]._id;
    res.redirect(`/dashboard/details`)
    }
}))



app.post('/dashboard',upload.single('images'),validateSignDetails, wrapAsync(async (req,res)=>{

    const details= await register.find({name:req.body.name,email:req.body.email})
    
    if(details.length!==0)
    {
        req.flash('failures','Your Account is Already Registered')
        res.redirect('/register')
    }
    else
    {
        product=new register(req.body)
        product.images={
            url:req.file.path,
            filename:req.file.filename
        }
        await product.save().then((v)=>{
        console.log(v);
        })
        const detailss= await register.find(req.body)
        req.session.user_id=detailss[0]._id;
        req.flash('success','Welcome to Your New Account')
        res.redirect(`/dashboard/details`);
    }
}))


app.post("/student_search",upload.single(),requireLogin,adminrequire,wrapAsync(async(req,res)=>{

    const search =req.body
    const detail= await register.find(search);
    if(detail.length==0)
    {
        var Fees=0;
    }
    else
    {
     Fees = await totalFees(detail[0]._id)
    } 
    const details ={
        detail:detail,
        Fees:Fees
    }
    res.send(details);
}))


app.put('/dashboard/update',requireLogin,wrapAsync(async (req,res)=>{
    const id=req.session.user_id;
    await register.findByIdAndUpdate(id,{...req.body},{new:true})
    req.flash('success',"Details Updation Successfull")
    res.redirect(`/dashboard/details`);
}))


app.delete('/dashboard/:id',requireLogin,adminrequire,wrapAsync(async (req,res)=>{
    const {id}=req.params;
    await register.findByIdAndDelete(id);
    res.redirect('/dashboard/details');
}))

app.put('/dashboard/fees/:id',requireLogin,adminrequire,wrapAsync(async (req,res)=>{
    const{id}=req.params;
    await register.findByIdAndUpdate(id,{date_start:Date.now()},{new:true})
    .catch((e)=>{
        res.send("Invalid Id")
        return
    })
    if(id===0)
    {
      res.send('Invalid Id')  
      return 
    }
    res.send('Done')
}))

app.put('/dashboard/fees/admin/:id',requireLogin,adminrequire,wrapAsync(async (req,res)=>{
    const{id}=req.params;
    await register.findByIdAndUpdate(id,{date_start:Date.now()},{new:true})
    .catch((e)=>{
        res.send("Invalid Id")
        return
    })
    res.redirect('/dashboard/details')
}))



//if no route is found
app.use((req,res)=>{
    const id=req.session.user_id;
    res.status(404).render('error.ejs',{id});
})


//If any error occured after any route is found and internal error
app.use((err,req,res,next)=>{
    console.log(err);
    console.log("This error was found while working")
    res.status(err.status).send(err.message);
})



app.listen(3000,()=>{
    console.log("Listening on Port")
})

