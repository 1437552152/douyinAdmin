/*
 * @Description:
 * @version:
 * @Date: 2019-08-14 21:29:11
 * @LastEditors: yeyifu
 * @LastEditTime: 2019-08-22 22:52:18
 * @Author: yeyifu
 * @LastModifiedBy: yeyifu
 */
var db = require("../../conf/conf");
const Joi = require("joi");
const { formatDate } = require("../exportFun");
const { getdata } = require("../exportFun");
var moment = require("moment");
var nodeExcel = require("excel-export");

/* 新增用户 */
const registrtUser = (req, res) => {
  let username = req.body.username;
  let roleId = 1;
  let password = req.body.password;
  let secretKey = req.body.secretKey;
  let isShow = 0;
  let time = formatDate();

  let sql1 = `SELECT  * from sys_user where isShow=0 and username='${username}'`;
  getdata(sql1).then(function (respon) {
    /* 通过账号判断之前有没有注册过 */
    if (respon[0] && respon[0].username == username) {
      res.json({
        msg: "您已重复注册，请不要重复注册",
        code: 1,
      });
    } else {
      /* 判断秘钥是否存在，以及是否为未启用状态，，如果为未启用状态则改为启用     如果秘钥已经使用或者已经过期，则提示改秘钥已使用，不能用该秘钥注册 */
      let isHave = `SELECT  * from SecretIds where isShow=0 and secretid='${secretKey}'`;
      getdata(isHave).then(function (respon1) {
        if (!respon1[0]) {
          res.json({
            msg: "不存在该秘钥,请向管理员索取",
            code: 1,
          });
        } else {
          /* 判断秘钥的状态 */
          if (respon1[0] && respon1[0].status !== 0) {
            res.json({
              msg: "该秘钥已使用，不能用该秘钥注册",
              code: 1,
            });
          } else {
            /* 此时应该修改秘钥的状态，并且开始计算它的失效时间 */
            let overtime = moment()
              .subtract(-respon1[0].canUseTime, "days")
              .format("YYYY-MM-DD HH:mm:ss");
            let status = 1; //开始使用
            let sqlUpdate = `update SecretIds set status=?,overtime=? where secretid=?`;
            let param1 = [status, overtime, secretKey];
            db.query(sqlUpdate, param1, function (err, results) {
              let sql =
                "insert  into sys_user(username,roleId,password,secretKey,isShow,time) values(?,?,?,?,?,?)";
              let param = [username, roleId, password, secretKey, isShow, time];
              db.query(sql, param, function (err, results) {
                if (err) {
                  res.json({
                    msg: "注册失败",
                    status: "400",
                  });
                } else {
                  res.json({
                    msg: "注册成功",
                    status: "200",
                  });
                }
              });
            });
          }
        }
      });
    }
  });
};

/* 查询uuid列表 */
const getUUidList = (req, res) => {
  let allCount;
  let pageNo = parseInt(req.body.pageNo);
  let pageSize = parseInt(req.body.pageSize);
  let secretid = req.body.secretid || "";
  let sql = "";
  let sql2 = "";
  if (secretid !== "" && secretid !== undefined && secretid != null) {
    sql = `SELECT COUNT(*) FROM  SecretIds where isShow=0 and secretid Like '%${secretid}%'`;
    sql2 =
      `SELECT * FROM  SecretIds  where isShow=0 and secretid Like '%${secretid}%'  limit` +
      " " +
      (pageNo - 1) * pageSize +
      "," + pageSize;
  } else {
    sql = `SELECT COUNT(*) FROM  SecretIds where isShow=0`;
    sql2 =
      `SELECT * FROM  SecretIds  where isShow=0 limit` +
      " " +
      (pageNo - 1) * pageSize +
      "," +pageSize;
  }
  db.query(sql, function (err, results) {
    if (err) {
      res.json({
        msg: err.toString(),
        code: 500,
      });
    } else {
      allCount = results[0]["COUNT(*)"];
      back(allCount);
    }
  });

  function back(allCount) {
    db.query(sql2, function (err, results) {
      if (err) {
        res.json({
          msg: err.toString(),
          code: 500,
        });
      } else {
        let allPage = allCount / pageSize;
        let pageStr = allPage.toString();
        // 不能整除
        if (pageStr.indexOf(".") > 0) {
          allPage = parseInt(pageStr.split(".")[0]) + 1;
        }

        results.length > 0 &&
          results.map((item, index) => {
            item.overTime = moment(item.overTime, "YYYY-MM-DD HH:mm:ss");
          });
        res.json({
          msg: "操作成功",
          status: "200",
          totalPages: allPage,
          data: results,
          total: allCount,
          currentPage: parseInt(pageNo),
        });
      }
    });
  }
};
/* 新增uuid */
const UUidAdd = (req, res) => {
  let secretid = req.body.secretid;
  let status = 0; //默认未启用
  let canUseTime = req.body.canUseTime;
  let isShow = 0;
  let createTime = formatDate(); //创建时间
  let sql =
    "insert  into SecretIds(secretid,status,canUseTime,isShow,createTime) values(?,?,?,?,?)";
  var param = [secretid, status, canUseTime, isShow, createTime];
  db.query(sql, param, function (err, results) {
    if (err) {
      res.json({
        msg: err.toString(),
        code: 500,
      });
    } else {
      res.json({
        msg: "操作成功",
        status: "200",
      });
    }
  });
};
/* 删除 */
const deleteUUid = (req, res) => {
  let secretid = req.body.secretid;
  let sql = "UPDATE SecretIds  set isShow=? where secretid=?";
  let param = ["1", secretid];
  db.query(sql, param, function (err, results) {
    if (err) {
      res.json({
        msg: err.toString(),
        code: 500,
      });
    } else {
      res.json({
        msg: "操作成功",
        status: "200",
      });
    }
  });
};

/* 获取用户列表 */
const getUserDouyinList = (req, res) => {
  let allCount;
  let pageNo = parseInt(req.body.pageNo) || 1;
  let pageSize = parseInt(req.body.pageSize) || 10;
  let username = req.body.username || "";
  let sql = "";
  let sql2 = "";
  if (username !== "" && username !== undefined && username != null) {
    sql = `SELECT COUNT(*) FROM  sys_user where isShow=0 and username Like '%${username}%' or secretKey Like '%${username}%'`;
    sql2 =
      `SELECT * FROM  sys_user  where isShow=0 and username Like '%${username}%' or secretKey Like '%${username}%'  limit` +
      " " +
      (pageNo - 1) * pageSize +
      "," + pageSize;
  } else {
    sql = `SELECT COUNT(*) FROM  sys_user where isShow=0`;
    sql2 =
      `SELECT * FROM  sys_user  where isShow=0 limit` +
      " " +
      (pageNo - 1) * pageSize +
      "," +pageSize;
  }

  function getpage(params) {
    return new Promise((resolve, reject) =>
      db.query(params, (err, respon) => {
        if (err) {
          throw err;
          reject(err);
        } else {
          resolve(respon);
        }
      })
    );
  }
  getpage(sql)
    .then(function (res) {
      allCount = res[0]["COUNT(*)"];
      return getpage(sql2);
    })
    .then(function (responseData) {
      var allPage = allCount / pageSize;
      var pageStr = allPage.toString();
      // 不能整除
      if (pageStr.indexOf(".") > 0) {
        allPage = parseInt(pageStr.split(".")[0]) + 1;
      }
      /* 查到结果后要依据秘钥查对应的过期时间 */
        var getData1 = Promise.all(responseData.map((item,index,key) => {
          let sql = `SELECT overTime  FROM  SecretIds where isShow=0 and  secretid='${item.secretKey}'`;
          return new Promise((resolve, reject) => db.query(sql, (err, respon) => {
            if (err) {
              reject(err);
            } else {
              resolve({
                overTime: respon[0].overTime
              });
            }
          }));
        }));

        getData1.then(function (respon) {
          responseData.map((item,index)=>{
            item.overTime=respon[index].overTime
          })
          res.json({
           msg: "操作成功",
           status: "200",
           totalPages: allPage,
           total: allCount,
           currentPage: parseInt(pageNo),
            data: responseData
          });
        }).catch(err => res.json({
          msg: "失败",
          status: "0",
          msg: err
        }));
    });
};

/* 删除抖音用户 */
const deleteUserDouyin = (req, res) => {
  let user_id = req.body.user_id;
  let username = req.body.username;
  let sql = "UPDATE sys_user  set isShow=? where user_id=?";
  let param = ["1", user_id];
  db.query(sql, param, function (err, results) {
    if (err) {
    } else {
      res.json({
        msg: "操作成功",
        status: "200",
      });
    }
  });
};

//修改用户状态
const UserDouyinUpdate = (req, res) => {
  let status = req.body.status;
  let user_id = req.body.user_id;

  let sql = `update sys_user set status=?  where user_id=?`;
  let param = [status, user_id];
  db.query(sql, param, function (err, results) {
    if (err) {
      res.json({
        msg: err,
        status: "400",
      });
    } else {
      res.json({
        msg: "操作成功",
        status: "200",
      });
    }
  });
};

//充值
const Recharge = (req, res) => {
  let status = req.body.status;
  let secretid = req.body.secretid;
  let canUseTime = req.body.canUseTime;
  let overTime = req.body.overTime;
  if (status) {
    let sql = `update SecretIds set overTime=? where secretid=?`;
    let param = [overTime, secretid];
    db.query(sql, param, function (err, results) {
      if (err) {
        res.json({
          msg: err,
          status: "400",
        });
      } else {
        res.json({
          msg: "操作成功",
          status: "200",
        });
      }
    });
  } else {
    let sql = `update SecretIds set  canUseTime=canUseTime+${canUseTime}   where secretid=?`;
    let param = [secretid];
    db.query(sql, param, function (err, results) {
      if (err) {
        res.json({
          msg: err,
          status: "400",
        });
      } else {
        res.json({
          msg: "操作成功",
          status: "200",
        });
      }
    });
  }
};

/* 导出 */
const getWuCGExportExcel = (req, res) => {
  let sql = "SELECT * FROM SecretIds where isShow=0";
  db.query(sql, function (err, results) {
    if (err) {
      res.json({
        msg: err.toString(),
        code: 500,
      });
    } else {
      //导出
      var conf = {};
      conf.name = "mysheet";
      conf.cols = [
        {
          caption: "过期时间",
          type: "string",

          width: 100,
        },
        {
          caption: "秘钥",
          type: "string",

          width: 30,
        },
        {
          caption: "状态",
          type: "string",

          width: 30,
        },
        {
          caption: "创建时间",
          type: "string",
          width: 30,
        },
      ];

      let arr = [];
      results.map((item, index) => {
        let arr1 = [];

        /* status为0时，表示未启用 */
        if (item.status == 0) {
          arr1.push("无");
        } else {
          arr1.push(item.overTime);
        }
        arr1.push(item.secretid);
        if (item.status == 0) {
          arr1.push("未使用");
        } else {
          if (moment().format("YYYY-MM-DD HH:mm:ss") < item.overTime) {
            arr1.push("使用中");
          } else {
            arr1.push("已过期");
          }
        }
        arr1.push(moment(item.createTime).format("YYYY-MM-DD HH:mm:ss"));
        arr.push(arr1);
      });
      conf.rows = arr;
      var result = nodeExcel.execute(conf);
      res.setHeader("Content-Type", "application/vnd.openxmlformats");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + encodeURIComponent("导出列表") + ".xlsx"
      );
      res.end(result, "binary");
    }
  });
};

/* getWebsiteUrl   根据uuid */
const getWebsiteUrl = (req, res) => {
  let uuid = JSON.stringify(req.body.uuid);
  let sql = `SELECT * FROM Carousel where isShow=0 and uuid=${uuid}`;
  db.query(sql, function (err, results) {
    if (results && results[0] && results[0].href) {
      res.json({
        msg: "操作成功",
        status: 1,
        data: results[0],
      });
    } else {
      res.json({
        msg: "获取失败",
        status: 0,
      });
    }
  });
};

/* 更新备注 */
const updateRemark = (req, res) => {
  let user_id = req.body.user_id;
  let remark = req.body.remark;
  let sql = `update sys_user set remark='${remark}' where isShow=0 and user_id=${user_id}`;
  db.query(sql, function (err, results) {
    res.json({
      msg: "更新成功",
      status: 1,
    });
  });
};

const homeList = (req, res) => {
  let allCount;
  let sql = "SELECT COUNT(*) FROM Carousel where isShow=0";
  let sql2 = "SELECT*FROM Carousel where isShow=0";
  db.query(sql, function (err, results) {
    if (err) {
      res.json({
        msg: err.toString(),
        code: 500,
      });
    } else {
      allCount = results[0]["COUNT(*)"];
      back(allCount);
    }
  });

  function back(allCount) {
    db.query(sql2, function (err, results) {
      if (err) {
        res.json({
          msg: err.toString(),
          code: 500,
        });
      } else {
        res.json({
          msg: "操作成功",
          status: "200",
          data: results,
          total: allCount,
        });
      }
    });
  }
};

const updateNotice = (req, res) => {
  let content = req.body.content;
  let id = req.body.id;
  let sql = `update Notice set content='${content}' where id='${id}'`;
  db.query(sql, function (err, results) {
    res.json({
      msg: "更新成功",
      status: 1,
    });
  });
};

const getNoticeList = (req, res) => {
  let content = req.body.content;
  let id = req.body.id;
  let sql = `select * from Notice`;
  db.query(sql, function (err, results) {
    res.json({
      msg: "查询成功",
      status: 1,
      data:results
    });
  });
};

const updatNoticeStatus = (req, res) => {
  let status = req.body.status;
  let id = req.body.id;
  let sql = `update Notice set status=${status} where id='${id}'`;
  db.query(sql, function (err, results) {
    res.json({
      msg: "更新成功",
      status: 1,
    });
  });
};

module.exports = {
  registrtUser: registrtUser,
  getUUidList: getUUidList,
  UUidAdd: UUidAdd,
  deleteUUid: deleteUUid,
  getUserDouyinList: getUserDouyinList,
  deleteUserDouyin: deleteUserDouyin,
  UserDouyinUpdate: UserDouyinUpdate,
  Recharge: Recharge,
  getWebsiteUrl: getWebsiteUrl,
  getWuCGExportExcel: getWuCGExportExcel,
  updateRemark: updateRemark,
  homeList: homeList,
  getNoticeList:getNoticeList,
  updateNotice:updateNotice,
  updatNoticeStatus:updatNoticeStatus
};
