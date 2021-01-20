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
app.use(express.urlencoded({ extended: true }));

// アプリケーション設定
const port = process.env.PORT || 3000;
app.set('view engine', 'ejs');
app.locals.sessionids = [];
app.locals.maximum_password_length = 7;

// *****************************************
// ルーティング
// *****************************************

// ログイン
app.get('/login', controller_login.loginForm);
app.post('/login',
  middleware_auth.doAuthorize,
  controller_dashboard.dashboardRedirect
);

// ユーザー登録
app.get('/register', controller_register.registerForm);
app.post('/register',
  controller_register.doRegister,
  middleware_auth.doAuthorize,
  controller_dashboard.dashboardRedirect
);

// ログアウト
app.get('/logout',
  middleware_auth.doDeauthorize,
  controller_login.loginRedirect
);
app.post('/logout',
  middleware_auth.doDeauthorize,
  controller_login.loginRedirect
);

// ダッシュボード
app.use('/dashboard', middleware_auth.checkAuthorized);
app.get('/dashboard', controller_dashboard.dashboardForm);

// ルート
app.get('/',
  middleware_auth.checkAuthorized,
  controller_dashboard.dashboardRedirect
);

// *****************************************
// サーバー開始
// *****************************************
app.listen(port, () => {
  console.log('Server started');
});
