/*
 * @Description: 
 * @version: 
 * @Date: 2019-07-31 20:27:54
 * @LastEditors: yfye
 * @LastEditTime: 2021-01-24 18:54:30
 * @Author: yeyifu
 * @LastModifiedBy: yeyifu
 */
const express = require("express");
const swig = require("swig");
const bodyParser = require("body-parser");
const app = express();
const logger=require('./logs/logger.js');
const myfilter=require('./exportFun/filter/myfilter.js');
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
swig.setDefaults({
  cache: false
});
app.set('view cache', false);
app.set("views", './views/pages/');
app.set("view engine", "html");
app.engine('html', swig.renderFile);
/* swig.init({ filters: myfilter }); */
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
//设置跨域访问
//设置允许跨域访问该服务.
/*

app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
 if (req.method.toLowerCase() == 'options')
 res.send(200); //让options尝试请求快速结束
 else
 next();
});
*/

app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
  // res.header("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader('Access-Control-Allow-Headers',"token",'Content-Type,Access-Control-Allow-Headers,Authorization,X-Requested-With');
/*   res.header("Access-Control-Allow-Methods", "*"); */
 // res.header("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
 // res.header("Access-Control-Max-Age","1728000");

 if (req.method.toLowerCase() == 'options')
 res.send(200); //让options尝试请求快速结束
 else
 next();
});

app.use("/admin", require("./routes/admin"));
app.use(function (err, req, res, next) {
  if (err.isBoom) {
       return res.status(err.output.statusCode).json(err.output.payload);
  }
});
var server= app.listen(8090);