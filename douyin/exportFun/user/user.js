/*
 * @Description: 
 * @version: 
 * @Date: 2019-08-14 21:29:11
 * @LastEditors: yeyifu
 * @LastEditTime: 2019-08-22 22:52:18
 * @Author: yeyifu
 * @LastModifiedBy: yeyifu
 */
var db = require('../../conf/conf');
const Joi = require('joi');
const {formatDate} = require('../exportFun');
// 用户信息,个人中心
const  systemDetail=(req, res)=>{
    let id = req.body.id;
  let sql = "SELECT * FROM sys_user  where user_id=" + id;
  db.query(sql, function (err, results) {
    if (err) {
      throw err;
    } else {
      res.json({
        msg: "操作成功",
        status: "200",
        data: results[0]
      });
    }
  });
  }

  // 修改密码
  const  systemUpdatepassword=(req, res)=>{
  let lastPassword = req.body.lastPassword;
  let newPassword = req.body.newPassword;
  let id = req.body.id;
  let sql = `SELECT * FROM sys_user  where user_id=${id}`;
  db.query(sql, function (err, results) {
    if (err) {
      throw err;
    } else {
      if (lastPassword != results[0].password) {
        res.json({
          message: "您输入的旧密码不正确",
          code: 1
        });
      } else {
        let sql = `update  sys_user set  password=${newPassword} where  user_id=${id}`;
        db.query(sql, function (err, results) {
          if (err) {
            throw err;
          } else {
            res.json({
              message: "密码修改成功",
              code: 0
            });
          }
        })
      }
    }
  });
  }

 //获取用户列表
 const  getUserList=(req, res)=>{
    let allCount;
    let pageNo =  parseInt(req.body.pageNo)||1;
    let pageSize = parseInt(req.body.pageSize)||10;
    let sql = `SELECT COUNT(*) FROM  sys_user where isShow=0`;
    let sql2 =
      `SELECT user_id,mobile,email,username,time,roleId FROM  sys_user  where isShow=0  limit` +
      " " +(pageNo - 1) * pageSize +"," + pageNo * pageSize;
    function getpage(params) {
      return new Promise((resolve, reject) => db.query(params, (err, respon) => {
        if (err) {
          throw err;
          reject(err);
        } else {
          resolve(respon);
        }
      }));
    }
    getpage(sql).then(function (res) {
      allCount = res[0]["COUNT(*)"];
    return  getpage(sql2);
    }).then(function (responseData) {
      var allPage = allCount / pageSize;
      var pageStr = allPage.toString();
      // 不能整除
      if (pageStr.indexOf(".") > 0) {
        allPage = parseInt(pageStr.split(".")[0]) + 1;
      }
      res.json({
        msg: "操作成功",
        status: "200",
        totalPages: allPage,
        data: responseData,
        total: allCount,
        currentPage: parseInt(pageNo)
      });
    })
 }

 const  getUserListSchema = {
  body: {
    pageNo: Joi.string().min(1).trim().required(),
    pageSize:Joi.string().min(1).trim().required()
  }
};


/* 新增用户 */
const  getUseradd=(req, res)=>{
  let email = req.body.email;
  let mobile = req.body.mobile;
  let roleId = req.body.role;
  let password = req.body.password;
  let username = req.body.username;
  let isShow = 0;
  let time = formatDate();
  let sql =
    "insert  into sys_user(email,mobile,roleId,password,username,isShow,time) values(?,?,?,?,?,?,?)";
  let param = [email,mobile,roleId,password,username,isShow,time];
  db.query(sql, param, function (err, results) {
    if (err) {
      res.json({
        msg: msg,
        status: "400"
      }); 
    } else {
      res.json({
        msg: "操作成功",
        status: "200"
      });
    }
  }); 
}
const  getUseraddSchema = {
  body: {
    email: Joi.string().min(11).email().trim().required(),
    mobile:Joi.string().min(1).trim().required(),
    role: Joi.string().min(1).trim().required(),
    password:Joi.string().trim().alphanum().min(8).max(20).required(),
    username: Joi.string().trim().required()
  }
};


//修改用户
const  getUserUpdate=(req, res)=>{
  let email = req.body.email;
  let mobile = req.body.mobile;
  let roleId = req.body.role;
  let password = req.body.password;
  let user_id = req.body.user_id;  
  
  let sql =
    `update sys_user set email=?,mobile=?,roleId=?,password=? where user_id=?`;
  let param = [email, mobile, roleId,password,user_id];
  db.query(sql,param,function (err, results) {
    if (err) {
      res.json({
        msg: err,
        status: "400"
      }); 
    } else {
      res.json({
        msg: "操作成功",
        status: "200"
      });
    }
  }); 
}

  // 用户删除
  const  employeedeletes=(req, res)=>{
    let user_id = req.body.user_id;
    let sql = "UPDATE sys_user  set isShow=? where user_id=?";
    let param = ["1", user_id];
    db.query(sql, param, function (err, results) {
      if (err) {} else {
        res.json({
          msg: "操作成功",
          status: "200"
        });
      }
    });
  }
 
  const  employeedeletesSchema = {
    body: {
      user_id: Joi.string().min(1).trim().required(),
    }
  };
  
//获取角色列表
const  useRolelist=(req, res)=>{
    let allCount;
    let pageNo =  parseInt(req.body.pageNo)||1;
    let pageSize = parseInt(req.body.pageSize)||10;
    let sql = `SELECT COUNT(*) FROM  useRole where isShow=0`;
    let sql2 =
      `SELECT roleName,roleId,remark,rolePermissions FROM  useRole  where isShow=0  limit` +
      " " +(pageNo - 1) * pageSize +"," + pageNo * pageSize;
    function getpage(params) {
      return new Promise((resolve, reject) => db.query(params, (err, respon) => {
        if (err) {
          throw err;
          reject(err);
        } else {
          resolve(respon);
        }
      }));
    }
    getpage(sql).then(function (res) {
      allCount = res[0]["COUNT(*)"];
    return  getpage(sql2);
    }).then(function (responseData) {
      var allPage = allCount / pageSize;
      var pageStr = allPage.toString();
      // 不能整除
      if (pageStr.indexOf(".") > 0) {
        allPage = parseInt(pageStr.split(".")[0]) + 1;
      }
      res.json({
        msg: "操作成功",
        status: "200",
        totalPages: allPage,
        data: responseData,
        total: allCount,
        currentPage: parseInt(pageNo)
      }); 
    })
  }
 //删除角色
 const  roledelete=(req, res)=>{
    let roleId = req.body.roleId;
    let sql = "UPDATE useRole  set isShow=? where roleId=?";
    let param = ["1", roleId];
    db.query(sql, param, function (err, results) {
      if (err) {} else {
        res.json({
          msg: "操作成功",
          status: "200"
        });
      }
    });
 }
 const  roledeleteSchema = {
  body: {
    roleId: Joi.string().min(1).trim().required(),
  }
};

/* 新增角色 */
const  useRoleadd=(req, res)=>{
  let remark = req.body.remark;
  let roleName = req.body.roleName;
  let rolePermissions=JSON.stringify(req.body.permissions);
  if(rolePermissions.length<=5){
    rolePermissions=`[${rolePermissions}]`
  }
  let isShow = 0;
  let time = formatDate();
  let sql =
    "insert  into useRole(remark,roleName,rolePermissions,isShow,time) values(?,?,?,?,?)";
  let param = [remark,roleName,rolePermissions,isShow,time];
  db.query(sql, param, function (err, results) {
    if (err) {
      res.json({
        msg: msg,
        status: "400"
      }); 
    } else {
      res.json({
        msg: "操作成功",
        status: "200"
      });
    }
  }); 
}

/* 修改角色权限 */
const  useRoleUpdate=(req, res)=>{
  let roleName = req.body.roleName;
  let remark = req.body.remark;
  let roleId = req.body.roleId;
  let rolePermissions = JSON.stringify(req.body.permissions);
  let sql =
    `update useRole set roleName=?,remark=?,rolePermissions=? where roleId=?`;
  let param = [roleName, remark,rolePermissions,roleId];
  db.query(sql,param,function (err, results) {
    if (err) {
      res.json({
        msg: err,
        status: "400"
      }); 
    } else {
      res.json({
        msg: "操作成功",
        status: "200"
      });
    }
  }); 
}









/* 获取所有的用户权限 */
const  getAllPessions=(req, res)=>{
  let sql = `SELECT * FROM  sys_menu WHERE  parentId = 0`
  db.query(sql, function (err, results) {
    if (err) {
      res.json({
        msg: err,
        status: "400"
      });
    } else {
        var responseData = {
          code: 0,
          data: {
            permissions: null
          },
          type: 0,
          msg: "success"
        };
        var getData1 = Promise.all(results.map(item => {
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
        getData1.then(function (respon) {
          responseData.data.permissions = respon;
          res.json(responseData);
        }).catch(err => res.json({
          msg: "失败",
          code: 1,
          msg: err
        }));

    }
  });
}


  module.exports = {
    systemDetail: systemDetail,
    systemUpdatepassword:systemUpdatepassword,
    getUserList:getUserList,
    getUserListSchema:getUserListSchema,
    employeedeletes:employeedeletes,
    employeedeletesSchema:employeedeletesSchema,
    useRolelist:useRolelist,
    roledelete:roledelete,
    roledeleteSchema:roledeleteSchema,
    getUseraddSchema:getUseraddSchema,
    getUseradd:getUseradd,
    getUserUpdate:getUserUpdate,
    useRoleadd:useRoleadd,
    getAllPessions:getAllPessions,
    useRoleUpdate:useRoleUpdate
  }