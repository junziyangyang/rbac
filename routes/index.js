const router = require('koa-router')();
const User = require('../model/user');

router.get('/', async (ctx, next) => {
    if (ctx.session.user) {
        await ctx.render('index-ajax');
        // await ctx.render('index-iframe');
        // ctx.redirect('/layout');
        // await ctx.render('index');
    } else {
        await ctx.render('login');
    }
});

router.get('/index', async (ctx, next) => {
    await ctx.render('index');
});

router.post('/login', async (ctx, next) => {
    var username = ctx.request.body.username;
    var password = ctx.request.body.password;
    var user = await User.findOne({username: username}).exec();
    if (user) {
        if (user.password == password) {
            ctx.session.user = user;
            ctx.body = {code: '200', msg: "/"}
        } else {
            ctx.body = {code: '50000', msg: "用户密码不正确"}
        }
    } else {
        ctx.body = {code: '50019', msg: "未找到此用户信息"}
    }
});

router.get('/logOut', async (ctx, next) => {
    delete ctx.session.user;
    delete ctx.state.user;
    await ctx.render('login');
});

router.get('/json', async (ctx, next) => {
    ctx.body = {
        title: 'koa2 json'
    }
});

module.exports = router;
