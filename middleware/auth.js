// ログインセッションが存在しているか確認する
function isAuthorized(cookies, sessionids) {
    if (cookies.username && cookies.sessionid) {
        if (sessionids[cookies.username]) {
            if (sessionids[cookies.username] === cookies.sessionid) {
                return true;
            }
        }
    }
    return false;
}

// ログインセッションが存在していない場合はホーム画面に遷移させない
module.exports.checkAuthorized = function (req, res, next) {
    if (isAuthorized(req.cookies, req.app.locals.sessionids)) {
        next();
        return;
    }
    res.redirect('/login');
}

// ログインセッションを作成する
module.exports.doAuthorize = function (req, res, next) {
    if (req.body.username && req.body.password) {
        const uuid = require('uuid');
        const username = req.body.username;
        const sessionid = uuid.v4(); // ランダムなセッションIDを生成する

        res.cookie('username', username);
        res.cookie('sessionid', sessionid);
        req.app.locals.sessionids[username] = sessionid;

        next();
        return;
    }
    res.redirect('/login?status=failed');
}

// ログインセッションを破棄する
module.exports.doDeauthorize = function (req, res, next) {
    if (isAuthorized(req.cookies, req.app.locals.sessionids)) {
        const username = req.cookies.username;
        const sessionid = req.app.locals.sessionids[req.cookies.username];

        delete req.app.locals.sessionids[username];
        res.clearCookie('username');
        res.clearCookie('sessionid');
    }
    next();
}