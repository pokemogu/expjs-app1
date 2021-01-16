// ログインセッションが存在しているか確認する
function is_authorized(cookies,sessionids){
    if(cookies.username && cookies.sessionid){
        if(sessionids[cookies.username]){
            if(sessionids[cookies.username] == cookies.sessionid){
                return true;
            }
        }
    }
    return false;
}

// ログインセッションが存在していない場合はホーム画面に遷移させない
module.exports.check_authorized = function(req,res,next){
    if(is_authorized(req.cookies,req.app.locals.sessionids)){
        next();
        return;
    }
    res.redirect('/login');
}

// ログインセッションを作成する
module.exports.do_authorize = function(req,res,next){
    if(req.body.username && req.body.password){
        const uuid = require('uuid');
        let username = req.body.username;
        let sessionid = uuid.v4(); // ランダムなセッションIDを生成する

        res.cookie('username',username);
        res.cookie('sessionid',sessionid);
        req.app.locals.sessionids[username] = sessionid;

        console.log('Authorized: username = ' + username + ', sessionid = ' + sessionid);

        next();
        return;
    }
    res.redirect('/login?status=failed');
}

// ログインセッションを破棄する
module.exports.do_deauthorize = function(req,res,next){
    if(is_authorized(req.cookies,req.app.locals.sessionids)){
        let username = req.cookies.username;
        let sessionid = req.app.locals.sessionids[req.cookies.username];

        delete req.app.locals.sessionids[username];
        res.clearCookie('username');
        res.clearCookie('sessionid');

        console.log('Deauthorized: username = ' + username + ', sessionid = ' + sessionid);
    }
    next();
}