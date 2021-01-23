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
const { body, validationResult } = require('express-validator');

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
  body('realname')
    .notEmpty().withMessage('realname_unfilled').bail(),
  body('username')
    .notEmpty().withMessage('username_unfilled').bail()
    .isEmail().withMessage('username_not_email').bail(),
  body('password')
    .notEmpty().withMessage('password_unfilled').bail()
    .isLength({ min: 7 }).withMessage('password_tooshort').bail(),
  body('password_confirm')
    .custom((value, { req }) => value === req.body.password).withMessage('password_unmatch').bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.redirect('/register?status=' + errors.array()[0].msg);
    }
    next();
  },
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
