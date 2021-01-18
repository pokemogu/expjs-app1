module.exports.registerForm = function (req, res) {
    res.render('register', req.query);
}

module.exports.doRegister = function (req, res, next) {
    if (req.body.password && req.body.password_confirm) {
        if (req.body.password !== req.body.password_confirm) {
            res.redirect('/register?status=password_unmatch');
            return;
        }
        if (req.body.password.length < 8) {
            res.redirect('/register?status=password_tooshort');
            return;
        }
    }
    next();
}