/*
 * @Description:
 * @version:
 * @Date: 2019-07-31 19:53:23
 * @LastEditors: yfye
 * @LastEditTime: 2021-01-24 19:30:54
 * @Author: yeyifu
 * @LastModifiedBy: yeyifu
 */
import {
    Host,
    fetch,
    post,
    patch,
    put,
    postConfig,
    getExcelService
} from './http.js';

export const BASICURL = Host;
// post登陆接口
export const Login = data => post('admin/login', data);

// 获取uuid列表
export const getUUIDlist = data => post('admin/getUUidList', data);

// 获取uuid列表
export const productSecretid = data => post('admin/UUidAdd', data);

// 删除uuid列表
export const deleteUUid = data => post('admin/deleteUUid', data);

// 获取用户列表
export const getUserDouyinList = data => post('admin/getUserDouyinList', data);

// 删除用户列表
export const deleteUserDouyin = data => post('admin/deleteUserDouyin', data);

// 修改用户状态
export const UserDouyinUpdate = data => post('admin/UserDouyinUpdate', data);

// 充值
export const Recharge = data => post('admin/Recharge', data);

// post注册接口
export const Register = data => post('admin/registrtUser', data);

// post "用户管理" => "用户详情"
export const employeeDetail = data => post('admin/system/employee/detail', data);
// post "个人中心" => "修改密码"
export const fixPersonalPW = data => post('admin/system/employee/update-password', data);

// 案例列表
export const team = data => post('/admin/team', data);
// 案例详情
export const teamdetail = data => post('/admin/team/detail', data);
// 案例修改
export const teamdeupdate = data => post('/admin/team/update', data);
// 学生删除
export const teamdelete = data => post('/admin/team/delete', data);
// 案例增加
export const teamdeadd = data => post('/admin/team/add', data);
// 轮播图列表
export const carouselConfiglist = data => post('/admin/carouselConfig', data);
// 轮播图增加
export const carouselConfigadd = data => post('/admin/carouselConfig/add', data);
// 轮播图删除
export const carouselConfigdelete = data => post('/admin/carouselConfig/delete', data);
// 轮播图修改
export const carouselConfigUpdate = data => post('/admin/carouselConfig/update', data);
// 轮播图详情
export const carouselConfigdetail = data => post('/admin/carouselConfig/detail', data);

// 产品类型列表
export const productConfiglist = data => post('/admin/productConfig', data);
// 产品类型增加
export const productConfigadd = data => post('/admin/productConfig/add', data);
// 产品类型删除
export const productConfigdelete = data => post('/admin/productConfig/delete', data);
// 产品类型修改
export const productConfigUpdate = data => post('/admin/productConfig/update', data);
// 产品类型详情
export const productConfigdetail = data => post('/admin/productConfig/detail', data);

// 产品类型列表
export const langConfiglist = data => post('/admin/langConfig', data);
// 产品类型增加
export const langConfigadd = data => post('/admin/langConfig/add', data);
// 产品类型删除
export const langConfigdelete = data => post('/admin/langConfig/delete', data);
// 产品类型修改
export const langConfigUpdate = data => post('/admin/langConfig/update', data);
// 产品类型详情
export const langConfigdetail = data => post('/admin/langConfig/detail', data);

// 文章列表
export const newslist = data => post('/admin/news', data);
// 文章详情
export const newsdetail = data => post('/admin/news/detail', data);
// 文章增加
export const newsadd = data => post('/admin/news/add', data);
// 文章删除
export const newsdelete = data => post('/admin/news/delete', data);
// 文章修改
export const newsUpdate = data => post('/admin/news/update', data);
// 公司简介
export const companylist = data => post('/admin/company', data);
// 删除
export const companydelete = data => post('/admin/company/delete', data);
// 公司详情
export const companydetail = data => post('/admin/company/detail', data);
// 公司修改
export const companyupdate = data => post('/admin/company/update', data);
// 公司增加
export const companyadd = data => post('/admin/company/add', data);

// 报名列表
// export const reportlist = data => post('/admin/reportlist/reportlist', data);
// 删除
export const reportdelete = data => post('/admin/submit/messagedelete', data);
// 留言列表
export const messagelist = data => post('/admin/submit/messagelist', data);
// 查看某一条留言
export const messagedetail = data => post('/admin/submit/messagedetail', data);
// 删除留言
export const messagedelete = data => post('/admin/submit/messagedelete', data);
// 留言回复
export const messageupdate = data => post('/admin/submit/messageupdate', data);

// 获取国家接口
export const country = data => post('/admin/country');
// 著名学校列表
export const schoolList = data => post('/admin/schoolList', data);
// 学校删除
export const schooldelete = data => post('/admin/schooldelete', data);
// 学校增加
export const schoolAdd = data => post('/admin/school/add', data);
// 学校修改
export const schoolUpdate = data => post('/admin/school/update', data);
// 查看某一个学校的详情
export const schooldetail = data => post('/admin/school/detail', data);
// 套餐列表
export const priceList = data => post('/admin/priceList', data);
// 套餐删除
export const pricedelete = data => post('/admin/price/delete', data);
// 套餐增加
export const priceadd = data => post('/admin/price/add', data);
// 套餐修改
export const priceUpdate = data => post('/admin/price/update', data);
// 套餐详情
export const pricedetail = data => post('/admin/price/detail', data);

// 获取基础配置
export const baseConfig = data => post('/admin/getWebsiteConfig', data);
// 修改基础设置
export const baseConfigUpdate = data => post('/admin/WebsiteConfigUpdate', data);
// 删除基础配置
export const deleteWebsiteConfig = data => post('/admin/deleteWebsiteConfig', data);
// 查看基础配置详情
export const lookWebsiteConfig = data => post('/admin/lookWebsiteConfig', data);
// 新增基础配置详情
export const addWebsiteConfig = data => post('/admin/addWebsiteConfig', data);

// 获取访问地址以及ip
export const getLookRecord = data => post('/admin/getLookRecord');

// 用户列表
export const queryEmployee = data => post('/admin/getUserList', data);
// post "用户管理" => "删除用户"
export const delEmployee = data => post('admin/employee/deletes', data);
/* 新增用户 */
export const getUseradd = data => post('admin/getUseradd', data);
/* 用户修改 */
export const getUserUpdate = data => post('admin/getUserUpdate', data);

// POST "系统管理" => "角色管理"
export const roleManage = () => post('admin/useRolelist');
// POST "系统管理" => "角色管理"->"删除角色"
export const deleteRole = data => post('admin/role/delete', data);
// POST "系统管理" => "角色管理"->"角色新增"
export const useRoleadd = data => post('admin/useRoleadd', data);

// 获取所有权限
export const getAllPessions = data => post('admin/getAllPessions');

/* 修改权限 */
export const useRoleUpdate = data => post('admin/useRoleUpdate', data);
/* 导出模块 */
export const getWuCGExportExcel = data => getExcelService('admin/getWuCGExportExcel', data);

/* 网站查询 */
export const getWebsiteUrl = data => post('admin/getWebsiteUrl', data);
/* 更新 */
export const updateRemark = data => post('admin/updateRemark', data);
/* 首页链接 */
export const homeList = data => post('admin/homeList', data);
/* 站内通知 */
export const getNoticeList = data => post('admin/getNoticeList', data);
/* 修改文字 */
export const updateNotice = data => post('admin/updateNotice', data);
/* 修改状态 */
export const updatNoticeStatus = data => post('admin/updatNoticeStatus', data);
/* 统计点击数量 */
export const clickNumTotal = data => post('admin/clickNumTotal', data);
export const clickNumTotalList = data => post('admin/clickNumTotalList', data);

