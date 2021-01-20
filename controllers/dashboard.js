module.exports.dashboardForm = function (req, res) {
    res.render('dashboard', {
        username: req.cookies.username
    });
}

module.exports.dashboardRedirect = function (req, res) {
    res.redirect('/dashboard');
}
