module.exports.registerForm = function (req, res) {
    res.render('register', req.query);
}

module.exports.doRegister = function (req, res, next) {
    if (req.body.realname === '') {
        res.redirect('/register?status=realname_unfilled');
        return;
    }
    if (req.body.username === '') {
        res.redirect('/register?status=username_unfilled');
        return;
    }
    if (req.body.password === '') {
        res.redirect('/register?status=password_unfilled');
        return;
    }
    if (req.body.password_confirm === '') {
        res.redirect('/register?status=password_confirm_unfilled');
        return;
    }
    if (req.body.password && req.body.password_confirm) {
        if (req.body.password !== req.body.password_confirm) {
            res.redirect('/register?status=password_unmatch');
            return;
        }
        if (req.body.password.length < req.app.locals.maximum_password_length) {
            res.redirect('/register?status=password_tooshort');
            return;
        }
    }
    next();
}