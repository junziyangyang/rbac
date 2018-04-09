const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const render = require('koa-ejs');
const path = require('path');
const mongoose = require('mongoose');
const session = require('koa-session');

mongoose.connect('mongodb://localhost/rbac');

//引入router
const index = require('./routes/index');
const user = require('./routes/user');
const role = require('./routes/role');
const access = require('./routes/access');

// error handler
onerror(app);

// middlewares
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}));

app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));

app.use(views(__dirname + '/views', {
    extension: 'ejs'
}));


app.keys = ['some secret hurr'];

const SESSION_CONFIG = {
    key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. default is false **/
};

app.use(session(SESSION_CONFIG, app));

// logger
app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods());
// check session
app.use(async (ctx, next) => {
    if (ctx.session.user == null
    ) {
        ctx.redirect('/');
    }
    else {
        ctx.state.user = ctx.session.user;
        // render(app, {
        //     root: path.join(__dirname, 'views'),
        //     layout: 'layout',
        //     viewExt: 'ejs',
        //     cache: false,
        //     debug: true
        // });
        await
            next();
    }
})
;
app.use(user.routes(), user.allowedMethods());
app.use(role.routes(), role.allowedMethods());
app.use(access.routes(), access.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
})
;

module.exports = app;

/*const session = require('koa-session-minimal')
const MysqlStore = require('koa-mysql-session')

const config = require('./../config')

// code ...

const app = new Koa()

// session存储配置
const sessionMysqlConfig= {
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE,
    host: config.database.HOST,
}

// 配置session中间件
app.use(session({
    key: 'USER_SID',
    store: new MysqlStore(sessionMysqlConfig)
}))

let session = ctx.session
session.isLogin = true
session.userName = userResult.name
session.userId = userResult.id

async indexPage ( ctx ) {
    // 判断是否有session
    if ( ctx.session && ctx.session.isLogin && ctx.session.userName ) {
        const title = 'work页面'
        await ctx.render('work', {
            title,
        })
    } else {
        // 没有登录态则跳转到错误页面
        ctx.redirect('/error')
    }
},*/

// 200 OK - [GET]：服务器成功返回用户请求的数据，该操作是幂等的（Idempotent）。
// 201 CREATED - [POST/PUT/PATCH]：用户新建或修改数据成功。
// 202 Accepted - [*]：表示一个请求已经进入后台排队（异步任务）
// 204 NO CONTENT - [DELETE]：用户删除数据成功。
// 400 INVALID REQUEST - [POST/PUT/PATCH]：用户发出的请求有错误，服务器没有进行新建或修改数据的操作，该操作是幂等的。
// 401 Unauthorized - [*]：表示用户没有权限（令牌、用户名、密码错误）。
// 403 Forbidden - [*] 表示用户得到授权（与401错误相对），但是访问是被禁止的。
// 404 NOT FOUND - [*]：用户发出的请求针对的是不存在的记录，服务器没有进行操作，该操作是幂等的。
// 406 Not Acceptable - [GET]：用户请求的格式不可得（比如用户请求JSON格式，但是只有XML格式）。
// 410 Gone -[GET]：用户请求的资源被永久删除，且不会再得到的。
// 422 Unprocesable entity - [POST/PUT/PATCH] 当创建一个对象时，发生一个验证错误。
// 500 INTERNAL SERVER ERROR - [*]：服务器发生错误，用户将无法判断发出的请求是否成功。
