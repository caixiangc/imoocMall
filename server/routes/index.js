var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express,Very Goood' }); //app中调用这里的index.js 这里的路由渲染server里面的views-index.html
});

module.exports = router;
