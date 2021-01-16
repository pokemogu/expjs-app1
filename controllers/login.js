module.exports.login_form = function(req,res){
    if(req.query){
        res.render('login',req.query);
    }
    else
    res.render('login');
}
