<!--
 * @Description: 
 * @version: 
 * @Date: 2019-08-20 00:29:22
 * @LastEditors: yfye
 * @LastEditTime: 2021-02-03 20:50:42
 * @Author: yeyifu
 * @LastModifiedBy: yeyifu
 -->
<template>
  <div class="home">
    <Form ref="filterSearch" :model="filterSearch" inline>
      <FormItem prop="secretid">
        <Input type="text" v-model="filterSearch.secretid" placeholder="请输入秘钥" clearable>
          <!--   <Icon type="ios-person-outline" slot="prepend"></Icon> -->
        </Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit('filterSearch')">查询</Button>
      </FormItem>
    </Form>
    <div style="margin-bottom: 10px;">
      <!-- <i-button type="primary" @click="productSecretid">新增密钥</i-button> -->
      <Button type="primary" @click="addSecret">新增密钥</Button>
      <Button type="primary" @click="exportService1">导出</Button>
    </div>

    <Modal v-model="secretStatus" :width="450" title="新增密钥" @on-ok="ok" @on-cancel="cancel">
      <div>
        <div>
          <Input v-model="number">
            <span slot="prepend">秘钥可用时间:</span>
            <Select v-model="time" slot="append" style="width: 70px">
              <Option value="1">天</Option>
              <Option value="2">年</Option>
              <Option value="3">月</Option>
              <Option value="4">季度</Option>
            </Select>
          </Input>
        </div>
        <div style="margin-top:10px;">密钥：{{uuid}}</div>
      </div>
    </Modal>

    <!-- <i-table highlight-row :columns="columns3" :data="data1"></i-table> -->
    <Table :columns="columns_first" :data="userpage" border :loading="ifLoading"></Table>

    <div class="pageWrapper">
      <Page :total="totalNum" :current="currentPageIdx" @on-change="changePage" show-elevator></Page>
    </div>

    <Modal
      v-model="rejectModel"
      :width="450"
      title="提示"
      @on-ok="noPass"
      @on-cancel="cancelMemberCheck"
    >
      <div>确定删除该条数据？</div>
    </Modal>

    <Modal
      v-model="investStatus"
      :width="450"
      title="提示"
      @on-ok="investOk"
      @on-cancel="investCancel"
    >
      <div>
        <div class="invStyle">密钥：{{investObj.secretid}}</div>
        <div class="invStyle">状态：{{investObj.Nstatus}}</div>
        <div class="invStyle">创建时间：{{investObj.ctime}}</div>
        <div class="invStyle">到期时间：{{investObj.otime}}</div>
        <div>
          <Input v-model="investNumber">
            <span slot="prepend">秘钥充值使用时间:</span>
            <Select v-model="time" slot="append" style="width: 70px">
              <Option value="1">天</Option>
              <Option value="2">年</Option>
              <Option value="3">月</Option>
              <Option value="4">季度</Option>
            </Select>
          </Input>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  getUUIDlist,
  productSecretid,
  deleteUUid,
  Recharge,
  getWuCGExportExcel
} from "@/service/getData";
export default {
  data() {
    return {
      delateId: "",
      rejectModel: false,
      secretStatus: false,
      time: "1",
      investStatus: false,
      investObj: {},
      columns_first: [
        {
          title: "密钥",
          key: "secretid"
        },
        {
          title: "状态",
          key: "Nstatus"
        },
        {
          title: "卡密种类",
          key: "type"
        },
        {
          title: "创建时间",
          key: "ctime"
        },
        {
          title: "到期时间",
          key: "otime"
        },
        {
          title: "操作",
          key: "opration",
          width: 180,
          render: (h, obj) => {
            // 状态是否启用   0未启用  1开始启用    2已过期    3被禁用
            let text = "查看 / 编辑";
            let secretid=obj.row.secretid;
            let arr = [
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small",
                    disabled:obj.row.status == 0?true:false
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.investStatus = true;
                      this.investObj = obj.row;
                    }
                  }
                },
                "充值"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small",                 
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {                   
                      this.$copyText(`${secretid}`).then(
                        res => {
                          console.log(res)
                          this.$Message.info("已成功复制");
                        },
                        err => {
                        this.$Message.info("复制失败");
                        }
                      )	              
                    }
                  }
                },
                "复制"
              ),

            ];
            if (obj.row.status == 0) {
              text = "删除";
              arr.push(
                h(
                  "Button",
                  {
                    props: {
                      type: "info",
                      size: "small"
                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                        this.rejectModel = true;
                        this.delateId = obj.row.secretid;
                      }
                    }
                  },
                  text
                )
              );
            }
            return h("div", {}, arr);
          }
        }
      ],
      userpage: [],
      filterSearch: {
        pageNo: 1,
        pageSize: 10,
        secretid: ""
      },
      currentPageIdx: 1,
      ifLoading: true,
      totalNum: null,
      number: 1,
      min: 1,
      investNumber: 1,
      uuid: ""
    };
  },
  methods: {
    ok() {
      this.productSecretid();
    },
    cancel() {
      this.secretStatus = false;
    },
    investOk() {
      this.RechargeS();
    },
    investCancel() {
      this.investStatus = false;
    },
    addSecret() {
      this.secretStatus = true;
      this.uuidBety();
    },
    RechargeS() {
     /*    debugger; */
      if (!this.investNumber) {
        this.$Message.info("秘钥充值时间不能为空");
        return false;
      }
      if (!/(^[1-9]\d*$)/.test(this.investNumber)) {
        this.$Message.info("秘钥充值时间不是正整数");
        return false;
      }

      let investObj = this.investObj;
      let investNumber = this.investNumber;
      let obj = {};
      obj.status = investObj.status;
      obj.secretid = investObj.secretid;
      var timer =
        this.time == 1
          ? Number(this.investNumber)
          : this.time == 2
          ? Number(this.investNumber) * 365
          : this.time == 3
          ? Number(this.investNumber) * 30
          : Number(this.investNumber) * 90;
      obj.canUseTime = timer;
      this.investNumber = 1;
      if (investObj.status == 0) {
        obj.overTime ='';
      } else if (investObj.Nstatus == "已过期") {
        obj.overTime = this.moment()
          .subtract(-investNumber, "days")
          .format("YYYY-MM-DD HH:mm:ss");
      } else if (investObj.Nstatus == "启用中") {
        obj.overTime = this.moment(investObj.overTime)
          .subtract(-timer, "days")
          .format("YYYY-MM-DD HH:mm:ss");
      }
      obj.overTime = obj.overTime.toString();
      Recharge(obj).then(res => {
        if (res.status == 200) {
          this.ifLoading = false;
          this.time = 1;
          // 状态是否启用   0未启用  1开始启用    2已过期    3被禁用
          let filterSearch = {
            pageNo: 1,
            pageSize: 10,
            secretid: ""
          };
          this.refreshPage(filterSearch);
          this.investStatus = false;
        } else this.$Message.error(res.message);
      });
    },
    changePage(pageIndex) {
      this.currentPageIdx = pageIndex;
      this.filterSearch.pageNo = pageIndex;
      this.refreshPage(this.filterSearch);
    },
    refreshPage(obj) {
      this.ifLoading = true;
      const that = this;
      getUUIDlist(obj).then(res => {
        if (!res.code) {
          that.ifLoading = false;
          // 状态是否启用   0未启用  1开始启用    2已过期    3被禁用
          let userpage = res.data.map(v => {
            v.ctime = that.moment(v.createTime).format("YYYY-MM-DD HH:mm:ss");
            if (v.overTime) {
              v.otime = that.moment(v.overTime).format("YYYY-MM-DD HH:mm:ss");
            } else {
              v.otime = "";
            }
            if (v.status == 0) {
              v.Nstatus = "未启用";
            } else if (v.status == 1) {
              if (
                that.moment(v.overTime).format("YYYY-MM-DD HH:mm:ss") <=
                that.moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
              ) {
                v.Nstatus = "已过期";
              } else {
                v.Nstatus = "启用中";
              }
            } else if (v.status == 3) {
              v.Nstatus = "被禁用";
            }
            return v;
          });
          that.userpage = userpage;
          that.totalNum = res.total;
          that.currentPageIdx = res.currentPage;
        } else that.$Message.error(res.message);
      });
    },
    productSecretid() {
      if (!this.number) {
        this.$Message.info("输入的秘钥可用时间不能为空");
        return false;
      }
      if (!/(^[1-9]\d*$)/.test(this.number)) {
        this.$Message.info("输入的秘钥可用时间不是正整数");
        return false;
      }

      let obj = {};
      obj.secretid = this.uuid;
      var timer =
        this.time == 1
          ? Number(this.number)
          : this.time == 2
          ? Number(this.number) * 365
          : this.time == 3
          ? Number(this.number) * 30
          : Number(this.number) * 90;
      obj.canUseTime = timer;
      this.ifLoading = true;
      productSecretid(obj).then(res => {
        if (!res.code) {
          this.ifLoading = false;
          this.secretStatus = false;
          this.time = 1;
          this.$Message.success(res.msg);
          let filterSearch = {
            pageNo: 1,
            pageSize: 10,
            secretid: ""
          };
          this.refreshPage(filterSearch);
        } else this.$Message.error(res.msg);
      });
    },
    uuidBety() {
      var s = [];
      var hexDigits = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      for (var i = 0; i < 20; i++) {
        s[i] = hexDigits.substr(
          Math.floor(Math.random() * hexDigits.length),
          1
        );
      }
      var uuid = s.join("");
      this.uuid = uuid;
    },
    deleteUUid() {
      let that = this;
      let obj = {};
      obj.secretid = this.delateId;
      deleteUUid(obj)
        .then(res => {
          if (res.status === "200") {
            this.rejectModel = false;
            this.$Message.success(res.msg);
            let filterSearch = {
              pageNo: 1,
              pageSize: 10,
              secretid: ""
            };
            this.refreshPage(filterSearch);
          } else this.$Message.error(res.message);
        })
        .catch(err => console.log(err));
    },
    cancelMemberCheck() {
      this.rejectModel = false;
    },
    noPass() {
      this.deleteUUid();
    },
    handleSubmit(name) {
      this.refreshPage(this.filterSearch);
    },
    exportService1() {
      let obj = {};
      getWuCGExportExcel(obj).then(response => {});
    }
  },
  mounted() {
    this.refreshPage(this.filterSearch);
  }
};
</script>
<style lang="less" scoped>
.invStyle {
  margin-bottom: 5px;
}
h5 {
  font-size: 40px;
  color: #2d8cf0;
  text-align: center;
  margin-top: 50px;
}
.chartStyle {
  width: 1000px;
  height: 500px;
  margin: 50px auto;
  margin-top: 100px;
}
</style>
