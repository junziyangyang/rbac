const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');

//引入router
const index = require('./routes/index');
const users = require('./routes/users');

// error handler
onerror(app);

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}));

app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}));

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

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
