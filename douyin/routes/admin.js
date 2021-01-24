/*
 * @Description: 
 * @version: 
 * @Date: 2019-07-31 19:46:39
 * @LastEditors: yfye
 * @LastEditTime: 2021-01-24 19:34:23
 * @Author: yeyifu
 * @LastModifiedBy: yeyifu
 */
const express = require("express");
const logger=require('../logs/logger.js');
const router = express.Router();
const expressJoi = require('express-joi-validator');
const {uploadConfig} = require('../uploadConfig/uploadConfig.js');

const {
  intercept,
  upload
} = require('../exportFun/exportFun');
/* 登录模块 */
const {
  login
} = require('../exportFun/login/login');
/* 系统用户模块 */
const {
  systemDetail,
  systemUpdatepassword,
  getUserList,
  getUserListSchema,
  employeedeletes,
  employeedeletesSchema,
  useRolelist,
  roledelete,
  roledeleteSchema,
  getUseradd,
  getUseraddSchema, 
  getUserUpdate,
  useRoleadd,
  getAllPessions,
  useRoleUpdate
} = require('../exportFun/user/user');

/* 轮播图配置 */
const {
  carouselConfig,
  carouselConfigdetail,
  carouselConfigadd,
  carouselConfigdelete,
  carouselConfigupdate
} = require('../exportFun/carouselConfig/carouselConfig');


/* 报名配置 */

/* 网站基础配置 */
const {
  getWebsiteConfig,
  lookWebsiteConfig,
  WebsiteConfigUpdate,
  deleteWebsiteConfig,
  addWebsiteConfig,
  getLookRecord
} = require('../exportFun/WebsiteConfig/WebsiteConfig');






/* 
 抖音网站
*/

const {
  registrtUser,
  getUUidList,
  UUidAdd,
  deleteUUid,
  getUserDouyinList,
  deleteUserDouyin,
  UserDouyinUpdate,
  Recharge,
  getWuCGExportExcel,
  getWebsiteUrl,
  updateRemark,
  homeList,
  getNoticeList,
  updateNotice,
  updatNoticeStatus
} = require('../exportFun/douyinConfig/douyinConfig');

/* 点击统计 */
const {clickNumTotal,clickNumTotalList} =require("../exportFun/clickNumTotal/clickNumTotal")

/* 
接口拦截
*/
router.use(function (req, res, next) {
   intercept(req, res, next)
});

/* 登录接口
 */
 
router.post("/login", function (req, res) {
  login(req, res);
});


router.post('/config', upload.single("upfile"), function (req, res) {
  // if(req.query.action==='uploadimage'){
  //   res.json({data:"上传成功"});
  // }
  res.json({
    state:"success",
    title:req.file.originalname,
    original:req.file.originalname,
    size:req.file.size,
    url:`http://47.107.180.202:8084/${req.file.path.split("public/").join("")}`
  });
})

router.get('/config', function (req, res) {
   res.json(uploadConfig);
})
/* ======================用户模块========================= */
/*  用户信息,个人中心 */
router.post("/system/employee/detail", function (req, res) {
  systemDetail(req, res);
});
/* 修改密码 */
router.post("/system/employee/update-password", function (req, res) {
  systemUpdatepassword(req, res);
});

/* 获取用户列表 */
router.post('/getUserList',expressJoi(getUserListSchema), function (req, res) {
  getUserList(req, res);
});

/* 新增用户 */
router.post('/getUseradd',expressJoi(getUseraddSchema), function (req, res) {
  getUseradd(req, res);
});

/*删除用户  */
router.post("/employee/deletes",expressJoi(employeedeletesSchema), function (req, res) {
  employeedeletes(req, res);
});

/* 修改用户 */
router.post('/getUserUpdate', function (req, res) {
  getUserUpdate(req, res);
});

/* 获取角色列表 */
router.post('/useRolelist', function (req, res) {
  useRolelist(req, res);
});

/* 删除角色 */
router.post("/role/delete",expressJoi(roledeleteSchema), function (req, res) {
  roledelete(req, res);
});

/* 增加角色 */
router.post('/useRoleadd', function (req, res) {
  useRoleadd(req, res);
});

/* 获取所有权限 */
router.post('/getAllPessions', function (req, res) {
  getAllPessions(req, res);
});

/* 修改权限 */
router.post('/useRoleUpdate', function (req, res) {
  useRoleUpdate(req, res);
});

/* 抖音网站 */

/* 注册 */
router.post('/registrtUser', function (req, res) {
  registrtUser(req, res);
});
/* 列表 */
router.post('/getUUidList', function (req, res) {
  getUUidList(req, res);
});
/* 新增 */
router.post('/UUidAdd', function (req, res) {
  UUidAdd(req, res);
});
/* 删除密钥uuid */
router.post('/deleteUUid', function (req, res) {
  deleteUUid(req, res);
});
/* 用户列表 */
router.post('/getUserDouyinList', function (req, res) {
  getUserDouyinList(req, res);
});
/* 删除用户 */
router.post('/deleteUserDouyin', function (req, res) {
  deleteUserDouyin(req, res);
});

/* 修改用户的状态 */
router.post('/UserDouyinUpdate', function (req, res) {
  UserDouyinUpdate(req, res);
});

/* 充值 */
router.post('/Recharge', function (req, res) {
  Recharge(req, res);
});

/* 导出 */
router.post("/getWuCGExportExcel",function (req, res) {
  getWuCGExportExcel(req, res)
 });
/* 获取uuid对应的url */
router.post("/getWebsiteUrl",function (req, res) {
  getWebsiteUrl(req, res)
 });

/* ======================用户模块结束========================= */

//----------------------------------------轮播图开始------------------
/* 轮播图列表 */
router.post("/carouselConfig", function (req, res) {
  carouselConfig(req, res)
});

/* 轮播图详情 */
router.post("/carouselConfig/detail", function (req, res) {
  carouselConfigdetail(req, res)
});

/* 轮播图增加 */
router.post("/carouselConfig/add", function (req, res) {
  carouselConfigadd(req, res);
});

/* 物理删除一条轮播图 */
router.post("/carouselConfig/delete", function (req, res) {
  carouselConfigdelete(req, res);
});

/* 修改一条轮播图 */
router.post("/carouselConfig/update", function (req, res) {
  carouselConfigupdate(req, res);
});
//----------------------------------------轮播图结束------------------


//------------------------------- 网站的基础配置开始-------------------------------------
/* 得到网站配置列表 */
router.post("/getWebsiteConfig", function (req, res) {
  getWebsiteConfig(req, res);
});

/* 修改网站配置 */
router.post("/WebsiteConfigUpdate", function (req, res) {
  WebsiteConfigUpdate(req, res);
});

//新增网站配置
router.post("/addWebsiteConfig", function (req, res) {
  addWebsiteConfig(req, res);
});

//删除网站配置
router.post("/deleteWebsiteConfig", function (req, res) {
   deleteWebsiteConfig(req, res);
});

//得到网站的某一条配置
router.post("/lookWebsiteConfig", function (req, res) {
  lookWebsiteConfig(req, res);
});
router.post("/updateRemark", function (req, res) {
  updateRemark(req, res);
});

router.post("/getNoticeList", function (req, res) {
  getNoticeList(req, res);
});

router.post("/homeList", function (req, res) {
  homeList(req, res);
});

router.post("/updateNotice", function (req, res) {
  updateNotice(req, res);
});

router.post("/updatNoticeStatus", function (req, res) {
  updatNoticeStatus(req, res);
});

/* 获取访问地址以及ip */
router.post('/getLookRecord', function(req, res) {
  getLookRecord(req, res);
});

/* 语言配置 */
router.post("/langConfig", function(req, res) {
  logger.info(req)
  langConfig(req, res)
});

/* 语言配置详情 */
router.post("/langConfig/detail", function (req, res) {
  langConfigdetail(req, res);
});
/* 语言增加 */
router.post("/langConfig/add", function (req, res) {
  langConfigadd(req, res)
});

/* 物理删除一条语言配置 */
router.post("/langConfig/delete", function (req, res) {
  langConfigdelete(req, res);
});

/* 修改一条语言配置 */
router.post("/langConfig/update", function (req, res) {
  langConfigupdate(req, res)
});

/* 统计点击量 */
router.post("/clickNumTotal", function (req, res) {
  clickNumTotal(req, res)
});
router.post("/clickNumTotalList", function (req, res) {
  clickNumTotalList(req, res)
});










//------------------------------图片上传------------------------------------------
router.post("/upload", upload.single("picUrl"), function (req, res) {
  res.json({
    state: 200,
    ret_code: req.file.path.split("public/").join("")
  });
});
module.exports = router;
