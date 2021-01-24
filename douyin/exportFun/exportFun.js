/*
 * @Description: 
 * @version: 
 * @Date: 2019-07-31 20:27:57
 * @LastEditors: yeyifu
 * @LastEditTime: 2019-09-25 21:31:44
 * @Author: yeyifu
 * @LastModifiedBy: yeyifu
 */
// 导入模块
const jwt = require('jsonwebtoken'); //用来生成token
const formaDate = require("../utils/date.js");
const multer = require("multer");
const db = require("../conf/conf.js");

// 接口请求拦截
const  intercept=(req, res, next)=>{
  if (req.originalUrl != '/admin/login' && req.originalUrl != '/admin/upload'&&req.path!='/config'&&req.originalUrl != '/admin/registrtUser') {
    let token = req.headers.token;
    let secretOrPrivateKey = "jwt";
	 let sql1 = `SELECT  * from sys_user where isShow=0 and token='${token}'`;
	getdata(sql1).then(function (respon) {	
    if (respon[0] === undefined || respon[0].token != token) {
        res.json({
          msg: "您已在其他地方登录，您将退出登录",
          code: 500,
        });
    }else{
	jwt.verify(token, secretOrPrivateKey, (err, decode) => {
      if (err) { //  时间失效的时候 || 伪造的token
        res.json({
          msg: "token失效，请重新登录",
          code: 500,
        });
      } else {
        next();
      }
    }) 	 
 }
	}
 )	
}else {
		 next();	
  }
}
// 统一的请求方法
const getdata=(params)=> {
  return new Promise((resolve, reject) => db.query(params, (err, respon) => {
    if (err) {
      reject(err);
    } else {
      resolve(respon);
    }
  }));
}


//获取当前时间
const formatDate=()=>{
  //把时间戳转化为日期对象
  let date = new Date();
  //调用封装，参数为日期对象和时间格式
  return formaDate.formaDate(date, "yyyy-MM-dd hh:mm");
}

//图片上传
const getNowFormatDate=()=> {
  let date = new Date();
  let seperator1 = "-";
  let month = date.getMonth() + 1;
  let strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  let currentdate =
    date.getFullYear() + seperator1 + month + seperator1 + strDate;
  return currentdate.toString();
}
let datatime = "public/images/" + getNowFormatDate();
//将图片放到服务器
let storage = multer.diskStorage({
  // 如果你提供的 destination 是一个函数，你需要负责创建文件夹
  destination: datatime,
  //给上传文件重命名，获取添加后缀名
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({
  storage: storage
});

module.exports = {
  intercept: intercept,
  getdata:getdata,
  formatDate:formatDate,
  upload:upload
}