const router = require('koa-router')();
const User = require('../model/user');
const Role = require('../model/role');
const UserRole = require('../model/usel_role');

router.prefix('/user');

router.get('/', async (ctx, next) =>{
  await ctx.render('user/index');
});

router.get('/list', async (ctx, next) => {
  var page = ctx.request.query.page;
  var limit = ctx.request.query.limit;
  var filter = {};

  var count = await User.count(filter).skip(page - 1).limit(limit).exec();
  var users = await User.find(filter).skip(page - 1).limit(limit).exec();
  ctx.body = {
      code: 0,
      msg: "",
      count: count,
      data: users
  };
});

router.get('/add', async (ctx, next) => {
  var roles = await Role.find().exec();
  await ctx.render('user/add', {roles: roles});
});

router.post('/save',async (ctx, next) =>{
  var user = ctx.request.body.user;
  var role_id = ctx.request.body.role_id;
  if (user._id){
    User.findByIdAndUpdate(user._id,user).exec();
  } else {
    var _user = await User.create(user);
    if(_user._id){
        await UserRole.create({user_id:_user._id, role_id: role_id});
    }
  }
  ctx.body = {result:'success'};
});

router.post('/delete',async (ctx, next) =>{
    var user_id = ctx.request.body.user_id;
  await User.remove({_id: user_id}).exec();
  ctx.body = {result:'success'};
});

router.get('/update/:id', async (ctx, next) => {
  var user_id = ctx.params.id;
  var user = await User.findById(user_id).exec();
  var roles = await Role.find().exec();
  var userRole = await UserRole.findOne({user_id:user_id}).exec();
  console.log(userRole);

  await ctx.render('user/info',{user: user, roles:roles, role_id: userRole.role_id});
});

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
});

module.exports = router;
