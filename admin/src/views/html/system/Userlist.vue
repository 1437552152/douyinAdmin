<!--
 * @Description: 
 * @version: 
 * @Date: 2019-07-31 19:53:24
 * @LastEditors: yeyifu
 * @LastEditTime: 2019-09-11 19:04:31
 * @Author: yeyifu
 * @LastModifiedBy: yeyifu
 -->
<template>
    <div >
      <Card>
        <p slot="title">
        用户列表
          <Button type="primary" size="small" @click="refreshPageManual">
            <Icon type="refresh"></Icon>
            刷新
          </Button>
        </p>

        <Row class="functionWrapper">
          <div class="btnsWrapper clearfix">
            <Button type="error" @click="ifDelete = true">删除用户</Button>
            <Button type="primary" @click="addUserBtn">添加用户</Button>
          </div>
        </Row>

        <Row >
          <Table 
            :columns="column_frist" 
            :data="userpage" 
            :loading="ifLoading"
            @on-selection-change="select"
            border>
          </Table>
        </Row>

        <Row class="pageWrapper">
          <Page :total="pageNum" 
                class="buttomPage"
                @on-change="changePage"
								:current="currentPageIdx"
                show-elevator></Page>
        </Row>

        <Modal
          v-model="ifDelete"
          title="删除用户"
          @on-ok="confirmDel"
          @on-cancel="$Message.info('已取消！')">
          <p>是否删除所选的{{ delArr.length }}项?</p>
       </Modal>
      <Modal v-model="addUpdate"  draggable scrollable :title="title" footer-hide>
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="用户名" prop="username">
            <Input v-model="formValidate.username" placeholder="请输入用户名" :disabled='title==="修改"?true:false'/>
        </FormItem>
        <FormItem label="邮箱" prop="email">
            <Input v-model="formValidate.email" placeholder="请输入邮箱"/>
        </FormItem>
        <FormItem label="角色" prop="role">
            <Select v-model="formValidate.role" placeholder="请选择用户角色">
                <Option :value="item.roleId" v-for="(item,index) in rolelist" :key="index">{{item.roleName}}</Option>               
            </Select>
        </FormItem>      
        <FormItem label="手机号" prop="mobile">
           <Input  v-model="formValidate.mobile" placeholder="请输入手机号"/>
        </FormItem>   
          <FormItem label="密码" prop="password">
            <Input type="password" v-model="formValidate.password" placeholder="请输入密码"/>
        </FormItem>        
        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">清空</Button>
        </FormItem>
    </Form>
      </Modal>
      </Card>
    </div>
</template>

<script>
import { setStore, getStore, removeStore } from "@/config/storage";
import {
  roleManage,
  queryEmployee,
  getUseradd,
  addAuditEmployee,
  employeeDetail,
  delEmployee,
  getUserUpdate,
  departmentManage
} from "@/service/getData";
import ruleValidate from "./rule";
export default {
  data() {
    return {
      addUpdate: false /* 模态框默认隐藏 */,
      title: "增加" /* 标题默认为增加 */,
      currentPageIdx: 1,
      pageNum: null,
      delArr: [],
      ifLoading: true,
      user_id: null,
      ifDelete: false,
      departName: null,
      column_frist: [
        {
          type: "selection",
          width: 80,
          align: "center"
        },
        {
          title: "用户ID",
          key: "user_id",
          width: 80
        },
        {
          title: "用户名",
          key: "username"
        },
        {
          title: "角色",
          key: "roleName",
          render: (h, obj) => {
            let text = "";
            this.rolelist.map((item, index) => {
              if (item.roleId == obj.row.roleId) {
                text = item.roleName;
              }
            });
            return h("div", text);
          }
        },
        {
          title: "手机号",
          key: "mobile"
        },
        {
          title: "邮箱",
          key: "email"
        },
        {
          title: "操作",
          render: (h, obj) => {
            return (
              "div",
              [
                h(
                  "Button",
                  {
                    props: {
                      type: "info",
                      size: "small",
                      disabled:obj.row.username==='admin'?true:false
                    },
                    on: {
                      click: () => {
                        let editObj = obj.row;
                        this.addUpdate = true;
                        this.title = "修改";
                        this.user_id = editObj.user_id;
                        this.formValidate = {
                          username: editObj.username,
                          email: editObj.email,
                          role: Number(editObj.roldId),
                          mobile: editObj.mobile
                        };
                      }
                    }
                  },
                  "查看 / 编辑"
                )
              ]
            );
          }
        }
      ],
      userpage: [],
      rolelist: [],
      formValidate: {
        username: "",
        email: "",
        role: "",
        mobile: "",
        password: ""
      },
      ruleValidate: ruleValidate
    };
  },
  methods: {
    changePage(pageIndex) {
      this.currentPageIdx = pageIndex;
      this.freshPage({ pageNo: pageIndex, pageSize: 10 });
    },
    select(solutions) {
      this.delArr = [];
      solutions.forEach(item => {
        this.delArr.push(item.user_id);
      });
    },
    addUserBtn() {
      this.addUpdate = true;
      this.title = "增加";
      this.formValidate = {
        username: "",
        email: "",
        role: "1111",
        mobile: "",
        password: ""
      };
    },
    confirmDel() {
      delEmployee({ user_id: this.delArr })
        .then(res => {
          if (!res.code) {
            this.freshPage();
            this.$Message.success("删除成功！");
          } else this.$Message.error("删除失败！");
        })
        .catch(err => {
          console.log(err);
        });
    },

    refreshPageManual() {
      this.freshPage({ pageNo: this.currentPageIdx, pageSize: 10 });
    },
    freshPage(obj) {
      this.ifLoading = true;
      queryEmployee(obj)
        .then(res => {
          console.log(res);
          if (res.status == 200) {
            this.userpage = res.data;
            this.ifLoading = false;
            this.pageNum = res.total;
          } else this.$Message.error(res.msg);
        })
        .catch(err => console.log(err));
    },
    roleList(obj) {
      roleManage(obj).then(
        res => {
          if (!res.code) {
            this.rolelist = res.data;           
          } else this.$Message.error(res.msg);
        },
        err => {
          console.log(err);
        }
      );
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.title === "增加") {
            getUseradd(this.formValidate)
              .then(res => {
                if (res.status === "200") {
                  this.$Message.success(res.msg);
                   this.freshPage({ pageNo: 1, pageSize: 10 }); 
                  this.addUpdate = false;
                } else {
                  this.$Message.error(res.msg);
                }
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            this.formValidate.user_id = this.user_id;
            getUserUpdate(this.formValidate)
              .then(res => {
                if (res.status === "200") {
                  this.$Message.success(res.msg);
                   this.freshPage({ pageNo: 1, pageSize: 10 }); 
                   this.addUpdate = false;
                } else {
                  this.$Message.error(res.msg);
                }
              })
              .catch(err => {
                console.log(err);
              });
          }
        } else {
          this.$Message.error("验证失败!");
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
      this.addUpdate = false;
    }
  },
  created() {
    removeStore("employeeID");
    this.freshPage({ pageNo: 1, pageSize: 10 }); //获取用户列表
    this.roleList({ pageNo: 1, pageSize: 100 }); //获取角色列表
  }
};
</script>

<style lang="less" scoped></style>