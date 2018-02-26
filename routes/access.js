const router = require('koa-router')();
const Access = require('../model/access');

router.prefix('/access');

router.get('/', async (ctx, next) =>{
  await ctx.render('access/index')
});

router.get('/list', async (ctx, next) => {
  var page = ctx.request.query.page;
  var limit = ctx.request.query.limit;
  var filter = {};

  var count = await Access.count(filter).skip(page - 1).limit(limit).exec();
  var accesss = await Access.find(filter).skip(page - 1).limit(limit).exec();
  ctx.body = {
      code: 0,
      msg: "",
      count: count,
      data: accesss
  };
});

router.get('/add', async (ctx, next) => {
  await ctx.render('access/add');
});

router.post('/save',async (ctx, next) =>{
  var access = ctx.request.body.access;
  if (access._id){
    Access.findByIdAndUpdate(access._id,access).exec();
  } else {
    await Access.create(access);
  }
  ctx.body = {result:'success'};
});

router.post('/delete',async (ctx, next) =>{
  var access_id = ctx.request.body.access_id;
  await Access.remove({_id: access_id}).exec();
  ctx.body = {result:'success'};
});

router.get('/update/:id', async (ctx, next) => {
  var access_id = ctx.params.id;
  var access = await Access.findById(access_id).exec();
  await ctx.render('access/info',{access: access});
});

module.exports = router;
