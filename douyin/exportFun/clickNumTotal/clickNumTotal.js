/*
 * @Description:
 * @Author: yfye
 * @Date: 2021-01-24 18:38:27
 * @LastEditTime: 2021-01-24 19:45:57
 * @LastEditors: yfye
 */
var db = require("../../conf/conf");
const jwt = require("jsonwebtoken"); //用来生成token
let secretOrPrivateKey = "jwt";
const moment = require("moment");

const clickNumTotal = (req, res) => {
  let { id, title } = req.body;
  let token = req.headers.token;
  jwt.verify(token, secretOrPrivateKey, (err, decode) => {
    if (err) {
      //  时间失效的时候 || 伪造的token
      res.json({
        msg: "token失效，请重新登录",
        code: 500,
      });
    } else {
      var timestamp = new Date().getTime();
      let sqlSert =
        "insert  into  ClickRecord(itemId,title,creatTime,account) values(?,?,?,?)";
      var param = [id, title, moment(timestamp).format("YYYY-MM-DD HH:mm:ss"),decode.name];
      db.query(sqlSert, param, function (err, results) {
        if (err) {
          res.json({
            status: 0,
            message: err,
          });
        } else {
          res.json({
            status: 1,
            message: "新增成功",
          });
        }
      });
    }
  });
};

const clickNumTotalList = (req, res) => {
    let allCount;
    let pageNo = parseInt(req.body.pageNo);
    let pageSize = parseInt(req.body.pageSize);
    let sql = "SELECT COUNT(*) FROM ClickRecord";
    let sql2 =
      "SELECT*FROM ClickRecord  ORDER BY creatTime DESC limit" +
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

          results.map(item=>{
              item.creatTime=moment(item.creatTime).format("YYYY-MM-DD HH:mm:ss")
          })
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


module.exports = {
  clickNumTotal,
  clickNumTotalList
};
