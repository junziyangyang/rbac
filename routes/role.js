const router = require('koa-router')();
const Role = require('../model/role');

router.prefix('/role');

router.get('/', async (ctx, next) =>{
  await ctx.render('role/index')
});

router.get('/list', async (ctx, next) => {
  var page = ctx.request.query.page;
  var limit = ctx.request.query.limit;
  var filter = {};

  var count = await Role.count(filter).skip(page - 1).limit(limit).exec();
  var roles = await Role.find(filter).skip(page - 1).limit(limit).exec();
  ctx.body = {
      code: 0,
      msg: "",
      count: count,
      data: roles
  };
});

router.get('/add', async (ctx, next) => {
  await ctx.render('role/add');
});

router.post('/save',async (ctx, next) =>{
  var role = ctx.request.body.role;
  if (role._id){
    Role.findByIdAndUpdate(role._id,role).exec();
  } else {
    await Role.create(role);
  }
  ctx.body = {result:'success'};
});

router.post('/delete',async (ctx, next) =>{
  var role_id = ctx.request.body.role_id;
  await Role.remove({_id: role_id}).exec();
  ctx.body = {result:'success'};
});

router.get('/update/:id', async (ctx, next) => {
  var role_id = ctx.params.id;
  var role = await Role.findById(role_id).exec();
  await ctx.render('role/info',{role: role});
});

module.exports = router;
