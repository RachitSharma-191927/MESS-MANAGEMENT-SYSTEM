module.exports = requireLogin = (req,res,next)=>{
    if(!req.session.user_id){
        req.flash('failure',"Please Login First")
        return res.redirect('/login')
    }
    next()
}

