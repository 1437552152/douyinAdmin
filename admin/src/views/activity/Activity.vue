<template>
  <div>
    <Card>
      <p slot="title">
        活动管理
        <Button type="primary" size="small" @click="refreshPageManual">
          <Icon type="refresh"></Icon>刷新
        </Button>
      </p>

      <Row class="functionWrapper">
        <div class="btnsWrapper clearfix">
          <Button type="primary" @click="addNew">新增</Button>
        </div>

        <div class="searchWrapper clearfix">
          <!-- <div class="poptip">
						<Poptip trigger="hover" content="请输入用户名搜索" placement="bottom-start">
							<Input placeholder="请输入用户名搜索" 
										v-model="filterSearch.adminName"/> 
							</Input>      
						</Poptip>
          </div>-->

          <!-- <div class="poptip">
						<Select v-model="filterSearch.module" placeholder="请选择...">
							<Option v-for="item in moduleArr" :value="item.status" :key="item.status">{{item.text}}</Option>
						</Select>
          </div>-->

          <!-- <div class="btns">
						<Button type="info" size="small" @click="searchByFilter">搜索</Button>
          </div>-->
        </div>
      </Row>
      <Row>
        <Table :columns="columns_first" :data="userpage" border :loading="ifLoading"></Table>
      </Row>

      <div class="pageWrapper">
        <Page :total="totalNum" :current="currentPageIdx" @on-change="changePage" show-elevator></Page>
      </div>

      <Modal
        title="编辑签到"
        :width="400"
        v-model="auditModal"
        @on-ok="confirmSub"
        @on-cancel="cancelSub"
      >
        <Form :model="signModal" :label-position="'left'" :label-width="80">
          <FormItem label="赠送币种：" prop="unit">
            <Select v-model="signModal.unit" :disabled="isDisable">
              <Option
                v-for=" coin in allCoinArr"
                :value="coin.unit"
                :key="coin.unit"
              >{{ coin.unit }}</Option>
            </Select>
          </FormItem>
          <FormItem label="赠送数量：" prop="amount">
            <Input v-model="signModal.amount" :disabled="isDisable"></Input>
          </FormItem>
          <FormItem label="结束时间：" prop="activityTime">
            <!-- :options="dateOpt" -->
            <!-- :disabled="isDisable" -->
            <!-- v-model="activityTime" -->

            <!-- style="width: 100%"
							type="date"
							@on-change="selectTime" 
            >-->
            <DatePicker
              type="date"
              v-model="activityTime"
              style="width: 100%"
              :options="dateOpt"
              :disabled="isDisable"
              @on-change="selectTime"
            ></DatePicker>
          </FormItem>
        </Form>
        <div slot="footer" v-if="isDisable">
          <Button long type="error" @click="auditModal = false">关 闭</Button>
        </div>
      </Modal>
    </Card>
  </div>
</template>

<script>
import {
  queryIfEnd,
  activityQuery,
  createSign,
  getCoinName,
  signDetail,
  fixSignDetail,
  earlyCloseSign,
  memberSignQuery
} from "@/service/getData";

export default {
  name: "Activity",
  data() {
    return {
      allCoinArr: [],
      auditModal: false,
      isDisable: false,
      activityTime: "",
      signModal: {
        unit: "",
        amount: "",
        endDate: ""
      },
      filterSearch: {
        pageNo: 1,
        pageSize: 10,
        adminName: "",
        module: -1
      },
      currentPageIdx: 1,
      ifLoading: true,
      totalNum: null,
      columns_first: [
        {
          title: "币种",
          key: "name"
        },
        {
          title: "币种单位",
          key: "unit"
        },
        {
          title: "数量",
          key: "amount"
        },
        {
          title: "开始时间",
          key: "creationTime",
          width: 105
        },
        // {
        // 	title: "开始时间",
        // 	key: "startDate"
        // },
        {
          title: "结束时间",
          key: "endDate"
        },
        {
          title: "活动状态",
          key: "status"
        },
        {
          title: "操作",
          key: "opration",
          width: 180,
          render: (h, obj) => {
            let text = "查看 / 编辑";
            if (obj.row.status === "UNDERWAY") text = "查看 / 编辑";
            else text = "查看";
            let arr = [
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
                      signDetail(obj.row.id)
                        .then(res => {
                          if (!res.code) {
                            for (let key in this.signModal) {
                              this.signModal[key] = res.data[key];
                            }
                            this.activityTime = this.signModal.endDate;
                            this.signModal.id = obj.row.id;
                            if (res.data.status === "UNDERWAY")
                              this.isDisable = false;
                            else this.isDisable = true;
                            this.auditModal = true;
                          } else this.$Message.error(res.message);
                        })
                        .catch(err => console.log(err));
                    }
                  }
                },
                text
              )
            ];
            if (obj.row.status === "UNDERWAY") {
              arr.push(
                h(
                  "Poptip",
                  {
                    props: {
                      title: "是否结束？",
                      confirm: true,
                      transfer: true
                    },
                    on: {
                      "on-ok": () => {
                        earlyCloseSign(obj.row.id)
                          .then(res => {
                            if (!res.code) {
                              this.$Message.success(res.message);
                              this.refreshPage();
                            } else this.$Message.error(res.message);
                          })
                          .catch(err => {
                            console.log(err);
                          });
                      },
                      "on-cancel": () => {
                        this.$Message.info("已取消！");
                      }
                    }
                  },
                  [
                    h(
                      "Button",
                      {
                        props: {
                          type: "error",
                          size: "small"
                        }
                      },
                      "结束"
                    )
                  ]
                )
              );
            }
            return h("div", {}, arr);
          }
        }
      ],
      userpage: [],
      dateOpt: {
        disabledDate(date) {
          return date.valueOf() < Date.now();
        }
      }
    };
  },
  methods: {
    addNew() {
      queryIfEnd()
        .then(res => {
          if (!res.data) {
            delete this.auditModal.id;
            this.isDisable = false;
            this.auditModal = true;
          } else {
            this.$Message.warning("请先关闭进行中活动！");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    confirmSub() {
      let fn = "";
      if (!this.signModal.id) {
        fn = createSign(this.signModal);
      } else {
        let obj = JSON.parse(JSON.stringify(this.signModal));
        delete obj.id;
        fn = fixSignDetail(this.signModal.id, obj);
      }
      for (let val in Object.values(this.signModal)) {
        if (val === "") {
          this.$Message.warning("请完善信息！");
          return;
        }
      }

      fn.then(res => {
        if (!res.code) {
          this.$Message.success(res.message);
        } else this.$Message.error(res.message);
        this.cancelSub();
        this.refreshPage();
      }).catch(err => console.log(err));
    },
    cancelSub() {
      for (let key in this.signModal) {
        this.signModal[key] = "";
      }
      this.activityTime = "";
    },
    selectTime(time) {
      console.log(time);

      // this.signModal.startDate = time[0];
      this.signModal.endDate = time;
    },
    // searchByFilter() {
    // 	this.filterSearch.pageNo = 1;
    // 	this.currentPageIdx = 1;
    //   this.refreshPage(this.filterSearch);
    // },
    refreshPageManual() {
      this.currentPageIdx = 1;
      this.filterSearch.pageNo = 1;
      this.filterSearch.pageSize = 10;
      this.refreshPage(this.filterSearch);
    },
    refreshPage(obj) {
      this.ifLoading = true;
      activityQuery(obj).then(res => {
        if (!res.code) {
          this.ifLoading = false;
          this.userpage = res.data.content;
          this.totalNum = res.data.totalElements;
        } else this.$Message.error(res.message);
      });
    },
    changePage(pageIndex) {
      this.currentPageIdx = pageIndex;
      this.filterSearch.pageNo = pageIndex;
      this.refreshPage(this.filterSearch);
    }
  },
  created() {
    getCoinName()
      .then(res => {
        if (!res.code) {
          this.allCoinArr = res.data;
        } else this.$Message.error(res.message);
      })
      .catch(err => {
        console.log(err);
      });
    this.refreshPage();
  }
};
</script>

<style scoped lang='less'>
</style>