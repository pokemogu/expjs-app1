// *****************************************
// アプリケーション初期化
// *****************************************

// コントローラー、ミドルウェア
const controller_login = require('./controllers/login');
const controller_register = require('./controllers/register');
const controller_dashboard = require('./controllers/dashboard');
const middleware_auth = require('./middleware/auth');

// ExpressJS初期化
const express = require('express');
const app = express();
const cookie_parser = require('cookie-parser');
app.use(cookie_parser());
app.use(express.urlencoded({extended: true}));

// アプリケーション設定
const port = process.env.PORT || 3000;
app.set('view engine','ejs');
app.locals.sessionids = [];

// *****************************************
// ルーティング
// *****************************************

// ログイン
app.get('/login',controller_login.login_form);
app.post('/login',
  middleware_auth.do_authorize,
  function(req,res){res.redirect('/dashboard');}
);

// ユーザー登録
app.get('/register',controller_register.register_form);
app.post('/register',
  controller_register.do_register,
  middleware_auth.do_authorize,
  function(req,res){res.redirect('/dashboard');}
);

// ログアウト
app.get('/logout',
  middleware_auth.do_deauthorize,
  function(req,res){res.redirect('/login');}
);
app.post('/logout',
  middleware_auth.do_deauthorize,
  function(req,res){res.redirect('/login');}
);

// ダッシュボード
app.use('/dashboard',middleware_auth.check_authorized);
app.get('/dashboard',controller_dashboard.dashboard_form);

// ルート
app.get('/',
  middleware_auth.check_authorized,
  function(req,res){res.redirect('/dashboard');}
);

// *****************************************
// サーバー開始
// *****************************************
app.listen(port,() => {
  console.log('Server started');
});
