/*
 * @Description: 
 * @version: 
 * @Date: 2019-08-14 21:29:11
 * @LastEditors: yeyifu
 * @LastEditTime: 2019-10-07 23:08:05
 * @Author: yeyifu
 * @LastModifiedBy: yeyifu
 */
const jwt = require('jsonwebtoken'); //用来生成token
const {
  getdata,formatDate
} = require('../exportFun');
var db = require('../../conf/conf');
const Joi = require('joi');

// 接口请求拦截
const login = (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let ip = req.body.ip;
  let content = {
    name: req.body.username
  };
  let secretOrPrivateKey = "jwt";
  let token = jwt.sign(content, secretOrPrivateKey, {
    expiresIn: 60 * 60 * 0.5
  });
  let responseData = {
    code: 0,
    data: {
      admin: null,
      permissions: null
    },
    type: 0,
    msg: "success"
  };
  let rolePermissions;
  let roleId;
  let sql1 = `SELECT  * from sys_user where isShow=0 and username='${username}'`;
  let sql2 = `SELECT * FROM  sys_menu WHERE  parentId = 0`;
  getdata(sql1).then(function (respon) {
    responseData.data.admin = respon[0];
    if (respon[0] === undefined || respon[0].password != password) {
      res.json({
        msg: "账号密码错误",
        code: 1,
      });
    } 
  /*   console.log(respon); */
    /* 如果密码正确，应该将ip插入进去 */
    let loginTime = formatDate();
    let sqlUpdate =
    `update sys_user set ip=?,loginTime=?,token=? where username=?`;
    let param1 = [ip,loginTime,token,username];
    db.query(sqlUpdate,param1,function (err, results) {
    }); 

    let sql = `select rolePermissions from  useRole  where  roleId=${respon[0].roleId}`;  
      return  getdata(sql)
  }).then(res => {
    rolePermissions = JSON.parse(res[0].rolePermissions);   
    return getdata(sql2);
     
  }).then(respon1=> {   
    let getData1 = Promise.all(respon1.map(item => {
      let sql = `select * from  sys_menu  where  parentid='${
        item.menuId
      }'`;
      return new Promise((resolve, reject) => db.query(sql, (err, respon) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            icon: item.icon,
            name: item.name,
            menuId: item.menuId,
            orderNum: item.orderNum,
            parentId: item.parentId,
            submenus: respon
          });
        }
      }));
    }));
    getData1.then(respon=> {   
      if (rolePermissions.length == 0) {
        responseData.data.permissions = [];
      } else {           
        let arr = JSON.parse(JSON.stringify(respon));
        arr.map((item, index) => {
          item.submenus = []
        });
       rolePermissions.map((item, index) => {
          respon.map((list, index1) => {
            if (list.submenus.length > 0) {
              list.submenus.map((lis, index2) => {
                if (lis.menuId == item) {
                  arr[index1].submenus.push(lis)
                }
              })
            }
          })
        })       
        responseData.data.permissions = arr;
        responseData.data.token = token;
        console.log(responseData.data.admin.secretKey)
        let sqlSS = `SELECT  * from SecretIds where isShow=0 and secretid='${responseData.data.admin.secretKey}'`;
        getdata(sqlSS).then(function (responser) {
          responseData.data.secretDetail= responser[0]; 
             res.json(responseData);  
        })       
      } 
    })
  }).catch(err => res.json({
    msg: "失败",
    code: 1,
    msg: err
  }));
}

module.exports = {
  login: login
}
