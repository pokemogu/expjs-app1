module.exports.register_form = function(req,res){
    if(req.query){
        res.render('register',req.query);
    }
    else
    res.render('register');
}

module.exports.do_register = function(req,res,next){
    if(req.body.password && req.body.password_confirm){
        if(req.body.password != req.body.password_confirm){
            res.redirect('/register?status=password_unmatch');
            return;
        }
        if(req.body.password.length < 8){
            res.redirect('/register?status=password_tooshort');
            return;
        }
    }
    next();
}