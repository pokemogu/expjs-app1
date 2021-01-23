module.exports.registerForm = function (req, res) {
    res.render('register', req.query);
}

module.exports.doRegister = function (req, res, next) {
    next();
}