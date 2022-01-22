const express=require("express")
const mongoose=require("mongoose")
const path=require("path")
const methodOverride=require('method-override')
const morgan=require("morgan")
const Joi=require('joi')
const app=express()
const register=require('./models/register');
const AppError=require('./apperror')
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
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(morgan('tiny'));




app.use((req,res,next)=>{
    console.log(req.method.toUpperCase())
    next();// You need to add so that we ca
})



app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'/views'))




var details;
var rollNo=0;
var id;
var login=false;


var totalFees = async (rollNo)=>{
    var details= await register.find({rollNo:rollNo})
    Days=Math.floor((Date.now()-details[0].date_start.getTime())/(1000*24*3600))
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
    res.render('index.ejs',{login,details,id})

})

app.get('/login', (req,res)=>{
    a=false;
    res.render('login.ejs',{a,login})
})

app.get('/register',(req,res)=>{
    a=false;
    res.render('signup.ejs',{login})
})
app.get('/messdetails',(req,res)=>{
    res.render('messdetails.ejs',{login,details,id})
})

app.get('/logout',(req,res)=>{
    login=false
    res.redirect('/')
})
app.get('/dashboard/:id', wrapAsync(async (req,res,next)=>{
    var {id} =req.params
    console.log(id);
    var details=await register.findById(req.params.id)
    .catch((err)=>{
        logout=false;
        return next(new AppError("Wrong User Id",404))
    })
    if(details.designation=="ADMIN")
    {
        login=true;
        var details;
        details=await register.find({designation:{$ne:'ADMIN'}})
        res.render('admin.ejs',{details,login,id})
    }
    else
    {
    login=true;
    id=req.params.id;
    fees= await totalFees(details.rollNo)
    console.log(fees);
    res.render('dashboard.ejs',{details,login,fees,id})
    }
}))

app.get('/dashboard/:id/edit',wrapAsync(async (req,res)=>{
    var details = await register.findById(req.params.id)
    login=true;
    id=req.params.id;
    res.render('edit.ejs',{details,login,id})

}))





app.post('/user', wrapAsync(async (req,res)=>{
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
    id=details[0]._id
    res.redirect(`/dashboard/${id}`)
    }
}))




app.post('/dashboard', wrapAsync(async (req,res)=>{

    const dashboardSchema=Joi.object({
        name:Joi.string().required(),
        father_name:Joi.string().required()
    }).required()

    const result=dashboardSchema.validate(req.body);

    details= await register.find({rollNo:req.body.rollNo,department:req.body.department,name:req.body.name,email:req.body.email})
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
        id=details[0]._id
        res.redirect(`/dashboard/${id}`);
    }
}))






app.put('/dashboard/:id',wrapAsync(async (req,res)=>{
    const {id}=req.params;
    const details = await register.findByIdAndUpdate(id,{...req.body},{new:true})
    res.redirect(`/dashboard/${details.id}`);
}))

app.delete('/dashboard/:id',wrapAsync(async (req,res)=>{
    const {id}=req.params;
    await register.findByIdAndDelete(id);
    res.redirect('/');
}))


//if no route is found
app.use((req,res)=>{
    res.status(404).render('error.ejs',{details,login,id});
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

