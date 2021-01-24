/*
 * @Description: 
 * @version: 
 * @Date: 2019-08-14 21:29:11
 * @LastEditors: yeyifu
 * @LastEditTime: 2019-10-12 23:08:59
 * @Author: yeyifu
 * @LastModifiedBy: yeyifu
 */
var db = require('../../conf/conf');
const {formatDate} = require('../exportFun');

const carouselConfig = (req, res) => {
    let allCount;
    let pageNo = parseInt(req.body.pageNo);
    let pageSize = parseInt(req.body.pageSize);
    let sql = "SELECT COUNT(*) FROM Carousel where isShow=0";
    let sql2 =
      "SELECT*FROM Carousel where isShow=0 limit" +
      " " +
      (pageNo - 1) * pageSize +
      "," +
      pageNo * pageSize;
    db.query(sql, function (err, results) {
      if (err) {
        res.json({
          msg:  err.toString(),
          code: 500,
        })
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
          })
        } else {
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
            data: results,
            total: allCount,
            currentPage: parseInt(pageNo)
          });
        }
      });
    }
}

const carouselConfigdetail = (req, res) => {
    let id = req.body.id;
    let sql = "SELECT * FROM Carousel where id=" + id;
    db.query(sql, function (err, results) {
      if (err) {
        res.json({
          msg:  err.toString(),
          code: 500,
        })
      } else {
        res.json({
          msg: "操作成功",
          status: "200",
          data: results
        });
      }
    });
}

const carouselConfigadd = (req, res) => {
    let img = req.body.img;
  let title = req.body.title;
  let href = req.body.href;
  let orderBy = req.body.orderBy;
  let lang = req.body.lang;
  let uuid = req.body.uuid;
  let isShow = 0;
  let time = formatDate();
  let sql =
    "insert  into Carousel(img,title,href,orderBy,lang,uuid,isShow,time) values(?,?,?,?,?,?,?,?)";
  var param = [img,title,href,orderBy,lang,uuid,isShow,time];
  db.query(sql, param, function (err, results) {
    if (err) {
      res.json({
        msg:  err.toString(),
        code: 500,
      })
    } else {
      res.json({
        msg: "操作成功",
        status: "200"
      });
    }
  });
}

const carouselConfigdelete = (req, res) => { 
  let id = req.body.id;
  let sql = "UPDATE Carousel  set isShow=? where id=?";
  let param = ["1", id];
  db.query(sql, param, function (err, results) {
    if (err) {
      res.json({
        msg:  err.toString(),
        code: 500,
      })
    } else {
      res.json({
        msg: "操作成功",
        status: "200"
      });
    }
  });
}

const carouselConfigupdate = (req, res) => {
    let img = req.body.img;
    let title = req.body.title;
    let href = req.body.href;
    let orderBy = req.body.orderBy;
    let lang = req.body.lang;
    let id = req.body.id;
    let sql =
      "UPDATE Carousel set img=?,title=?,href=?,lang=?,orderBy=?  where id=?";
    var param = [img, title, href,lang, orderBy,id];
    db.query(sql, param, function (err, results) {
      if (err) {
        res.json({
          msg:  err.toString(),
          code: 500,
        })
      } else {
        res.json({
          msg: "操作成功",
          status: "200"
        });
      }
    });
  }
module.exports = {
    carouselConfig: carouselConfig,
    carouselConfigdetail: carouselConfigdetail,
    carouselConfigadd: carouselConfigadd,
    carouselConfigdelete: carouselConfigdelete,
  carouselConfigupdate: carouselConfigupdate
}
