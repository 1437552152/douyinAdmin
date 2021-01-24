/*
 * @Description: 
 * @version: 
 * @Date: 2019-09-02 23:50:13
 * @LastEditors: yeyifu
 * @LastEditTime: 2019-09-26 00:37:40
 * @Author: yeyifu
 * @LastModifiedBy: yeyifu
 */
let db = require('../conf/conf');
// 获取基础配置,轮播图
const baseConfig=(lang)=>{
    let sql1 = `SELECT * FROM baseConfig  where lang=${lang} and isShow=0`;
    let sql2 = `SELECT * FROM Carousel  where lang=${lang} and isShow=0 ORDER BY orderBy ASC`;
    let sql3 = `SELECT * FROM news  where lang=${lang} and  newstype=1 and isShow=0 limit 3`;
    let sql4 = `SELECT * FROM products  where lang=${lang} and category=1 and isShow=0 limit 8`;
    let sql5 = `SELECT * FROM news  where lang=${lang} and  newstype=1 and  newStatus=0   and isShow=0 limit 8`;
    let sql6 = `SELECT * FROM news  where lang=${lang} and  newstype=1 and  newStatus=1   and isShow=0 limit 8`;

    
    let sql = `${sql1};${sql2};${sql3};${sql4};${sql5};${sql6}`
    return new Promise((resolve, reject)=>{
    db.query(sql, function (err, results) {
        if (err) {
            reject(err)
        } else {
            let indexData={};
            indexData.baseConfig=results[0][0];
            indexData.CarouselConfig=results[1]
            indexData.hotNews=results[2]
            indexData.hotproducts=results[3]
            indexData.hotNews_Industry=results[4]
            indexData.hotNews_Corporate=results[5]
            resolve(indexData)
      }  });

 })  
}

//获取产品图
const  productList=(lang)=>{
    let sql = `SELECT * FROM  productConfig   where isShow=0  group by  id ORDER BY orderBy ASC`;
    return new Promise((resolve,reject)=>{
        db.query(sql, (err, results) => {
            if (err) {
            } else {
              let getData1 = Promise.all(results.map(item => {
                let sql = `SELECT * FROM products  where isShow=0  and lang=${lang} and  type=${item.id}`;
                return new Promise((resolve1, reject1) => db.query(sql, (err, respon) => {
                  if (err) {
                    reject1(err);
                  } else {
                    resolve1({
                       productArr: respon,
                       productConfig:item
                    });
                  }
                }));
              }));
              getData1.then(function (success) {
                resolve(success)
              }).catch(error=>{
                reject()  
              })
            }
          });
    })
 
 } 


/* 函数封装 */
const  getpage=(params)=> {
  return new Promise((resolve, reject) => db.query(params, (err, respon) => {
    if (err) {
      throw err;
      reject(err);
    } else {
      resolve(respon);
    }
  }));
}

//获取普通新闻
const  newsList=(lang,pageNo,pageSize,newStatus=null)=>{
     let allCount;
     let sql1;
     let sql2;
     newStatus==null?sql1=`SELECT COUNT(*) FROM news   where  isShow=0 and lang=${lang}`:sql1=`SELECT COUNT(*) FROM news   where  isShow=0 and lang=${lang} and newStatus=${newStatus}`
     console.log("sql1==>",sql1);
     newStatus==null?sql2=`SELECT * FROM news where isShow=0  and lang=${lang}  limit  ${(pageNo - 1)* pageSize},${pageNo * pageSize}`:sql2=`SELECT * FROM news where isShow=0  and lang=${lang} and newStatus=${newStatus}  limit  ${(pageNo - 1)* pageSize},${pageNo * pageSize}`
     console.log("sql2==>",sql2);
     return new Promise((resolve,reject)=>{
      getpage(sql1).then(function (res) {
        allCount = res[0]["COUNT(*)"];
      return  getpage(sql2);
      }).then(function (responseData) {
        var allPage = allCount / pageSize;
        var pageStr = allPage.toString();
       if (pageStr.indexOf(".") > 0) {
          allPage = parseInt(pageStr.split(".")[0]) + 1;
        }
        resolve({newData:{
          totalPages: allPage,
          data: responseData,
          total: allCount,
          currentPage: parseInt(pageNo)         
        }})
      }).catch(error=>{
        reject()
      })
     })    
}

/* 新闻详情 */
const  newsdetail=(lang,id)=>{
  return new Promise((resolve,reject)=>{
    let sql1 = `SELECT * FROM news where isShow=0 and lang=${lang}  and newsId=(select newsId from news where newsId < ${id} order by newsId desc limit 1)`;
    let sql2 =`SELECT * FROM news where isShow=0 and lang=${lang} and newsId=${id}`;
    let sql3 = `SELECT * FROM news where isShow=0 and lang=${lang} and newsId=(select newsId from news where newsId > ${id} order by newsId asc limit 1)`;
    let sql4 =`update news  set  view=view+1  where isShow=0 and newsId=${id}`;
    let sql = `${sql1};${sql2};${sql3};${sql4}`
    db.query(sql, function (err, results) {
      if (err) {
        reject();
      } else {
        resolve({data:{
          pre:results[0],
          now:results[1],
          next:results[2]
        }})
      }
    });
  })
}

/* 产品详情 */
const  productdetail=(lang,id)=>{
  return new Promise((resolve,reject)=>{
    let sql1 = `SELECT * FROM products where isShow=0 and lang=${lang}  and productId=(select productId from products where productId < ${id} order by productId desc limit 1)`;
    let sql2 =`SELECT * FROM products where isShow=0 and lang=${lang} and productId=${id}`;
    let sql3 = `SELECT * FROM products where isShow=0 and lang=${lang} and productId=(select productId from products where productId > ${id} order by productId asc limit 1)`;
    let sql4 =`update products  set  view=view+1  where isShow=0 and productId=${id}`;
    let sql = `${sql1};${sql2};${sql3};${sql4}`
    db.query(sql, function (err, results) {
      if (err) {
        reject();
      } else {
        resolve({data:{
          pre:results[0],
          now:results[1],
          next:results[2]
        }})
      }
    });
  })
}

/* 根据类型id去查询对应的产品列表 */
const productAll=(lang,id,pageNo,pageSize)=>{
  console.log(pageNo,pageSize);
  let allCount;
  let sql1=id&&pageNo?`SELECT COUNT(*) FROM products   where  isShow=0  and lang=${lang} and type=${id}`:`SELECT COUNT(*) FROM products   where  isShow=0  and lang=${lang}`
  let sql2 =id&&pageNo?`SELECT * FROM products where isShow=0  and lang=${lang}  and type=${id} limit  ${(pageNo - 1)* pageSize},${pageNo * pageSize}`:`SELECT * FROM products where isShow=0  and lang=${lang}  limit  ${(pageNo - 1)* pageSize},${pageNo * pageSize}`
 
 console.log(sql1,sql2);
  return new Promise((resolve,reject)=>{
   getpage(sql1).then(function (res) {
     allCount = res[0]["COUNT(*)"];
   return  getpage(sql2);
   }).then(function (responseData) {
     var allPage = allCount / pageSize;
     var pageStr = allPage.toString();
    if (pageStr.indexOf(".") > 0) {
       allPage = parseInt(pageStr.split(".")[0]) + 1;
     }
     resolve({productData:{
       totalPages: allPage,
       data: responseData,
       total: allCount,
       currentPage: parseInt(pageNo)         
     }})
   }).catch(error=>{
     reject()
   })
  })    
}








module.exports = {
    baseConfig: baseConfig,
    productList:productList,
    newsList:newsList,
    newsdetail:newsdetail,
    productdetail:productdetail,
    productAll:productAll
}