module.exports.dashboardForm = function (req, res) {
    res.render('dashboard');
}

module.exports.dashboardRedirect = function (req, res) {
    res.redirect('/dashboard');
}
