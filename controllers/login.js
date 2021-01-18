module.exports.loginForm = function (req, res) {
    res.render('login', req.query);
}

module.exports.loginRedirect = function (req, res) {
    res.redirect('/login');
}