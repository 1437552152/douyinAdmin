/*
 * @Description: 
 * @version: 
 * @Date: 2019-08-14 21:29:11
 * @LastEditors: yeyifu
 * @LastEditTime: 2019-09-25 22:00:41
 * @Author: yeyifu
 * @LastModifiedBy: yeyifu
 */
var db = require('../../conf/conf');
const getWebsiteConfig = (req, res) => {
  let allCount;
  let pageNo = parseInt(req.body.pageNo);
  let pageSize = parseInt(req.body.pageSize);
  let sql = "SELECT COUNT(*) FROM baseConfig where isShow=0";
  let sql2 =`SELECT * FROM baseConfig where isShow=0 limit  ${(pageNo - 1)*pageSize},${pageNo * pageSize}`
  db.query(sql, function (err, results) {
    if (err) {
      res.json({
        msg:  err.toString(),
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
          msg:  err.toString(),
          code: 500,
        });
       } else {
        let allPage = allCount / pageSize;
        let pageStr = allPage.toString();
        // 不能整除
        if (pageStr.indexOf(".") > 0) {
          allPage = parseInt(pageStr.split(".")[0]) + 1;
        }
        res.json({
          msg: "操作成功",
          status: "200",
          totalPages: allPage,
          data: results,
          total: allCount,
          currentPage: parseInt(pageNo)
        });
      }
    });
  }
}

const deleteWebsiteConfig = (req, res) => {
  let id = req.body.configId;
  let sql = "UPDATE baseConfig  set isShow=? where configId=?";
  let param = ["1", id];
  db.query(sql, param, function (err, results) {
    if (err) {
      res.json({
        msg:  err.toString(),
        code: 500,
      });
    } else {
      res.json({
        msg: "操作成功",
        status: "200"
      });
    }
  });
}


const lookWebsiteConfig = (req, res) => {
  let id = req.body.id;
  let sql = "SELECT * FROM baseConfig where configId=" + id;
  db.query(sql, function (err, results) {
    if (err) {
      res.json({
        msg:  err.toString(),
        code: 500,
      });
    } else {
      res.json({
        msg: "操作成功",
        status: "200",
        data: results[0]
      });
    }
  });
}

const getLookRecord = (req, res) => {
    let sql = `SELECT COUNT(*) as num,address  FROM  BrowseRecords GROUP BY address`;
    db.query(sql, function (err, results) {
      if (err) {
        res.json({
          msg:  err.toString(),
          code: 500,
        });
      } else {
        res.json({
          msg: "操作成功",
          status: "200",
          data: results
        });
      }
    });
}

const WebsiteConfigUpdate = (req, res) => {  
    let longitude = req.body.longitude;
    let latitude = req.body.latitude;
    let logoPic = req.body.logoPic;
    let weChatPic = req.body.weChatPic;
    let qqeweimaPic = req.body.qqeweimaPic;
    let weiboPic = req.body.weiboPic;
    let publicPic = req.body.publicPic;
    let webname = req.body.webname;
    let website = req.body.website;
    let address = req.body.address;
    let lang = req.body.lang;
    let email = req.body.email;
    let mobile = req.body.mobile;
    let qqCode = req.body.qqCode;
    let content = req.body.content;
    let id = req.body.id;
    let param = [latitude, longitude, logoPic, weChatPic, qqeweimaPic, weiboPic, publicPic, webname, website, address,lang, email, mobile, qqCode, content,id];
    let sql = `update  baseConfig set latitude=?,longitude=?,logoPic=?,weChatPic=?,qqeweimaPic=?,weiboPic=?,publicPic=?,webname=?,website=?,address=?,lang=?,email=?,mobile=?,qqCode=?,content=?  where configId=?`;
    db.query(sql, param, function (err, results) {
      if (err) {
        res.json({
          msg:  err.toString(),
          code: 500,
        });
      } else {
        res.json({
          msg: "修改成功",
          status: "200"
        });
      }
    });
  }

// 新增
const addWebsiteConfig = (req, res) => {
  let longitude = req.body.longitude;
  let latitude = req.body.latitude;
  let logoPic = req.body.logoPic;
  let weChatPic = req.body.weChatPic;
  let qqeweimaPic = req.body.qqeweimaPic;
  let weiboPic = req.body.weiboPic;
  let publicPic = req.body.publicPic;
  let webname = req.body.webname;
  let website = req.body.website;
  let address = req.body.address;
  let lang = req.body.lang;
  let email = req.body.email;
  let mobile = req.body.mobile;
  let qqCode = req.body.qqCode;
  let content = req.body.content;
  
  let sql ="insert  into baseConfig(longitude,latitude,logoPic,weChatPic,qqeweimaPic,weiboPic,publicPic,webname,website,address,lang,email, mobile, qqCode, content) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
  let param = [latitude, longitude, logoPic, weChatPic, qqeweimaPic, weiboPic, publicPic, webname, website, address,lang, email, mobile, qqCode, content];

  db.query(sql, param, function (err, results) {
    if (err) { 
      res.json({
        msg:  err.toString(),
        code: 500,
      });   
    } else {
      res.json({
        msg: "操作成功",
        status: "200"
      });
    }
  });
}

module.exports = {
    getWebsiteConfig: getWebsiteConfig,
    WebsiteConfigUpdate: WebsiteConfigUpdate,
    getLookRecord:getLookRecord,
    deleteWebsiteConfig:deleteWebsiteConfig,
    lookWebsiteConfig:lookWebsiteConfig,
    addWebsiteConfig:addWebsiteConfig
}
