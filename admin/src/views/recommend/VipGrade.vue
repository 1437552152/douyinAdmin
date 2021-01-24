<template>
	<div>
    <Card>
      <p slot="title">
        VIP等级管理
        <Button type="primary" size="small" @click="refreshPageManual">
          <Icon type="refresh"></Icon>刷新
        </Button>
      </p>
      <Row class="functionWrapper">
        <div class="btnsWrapper clearfix">
          <Button type="primary" @click="add">添加</Button>
        </div>
      </Row>

      <Row class="margin-top-10 searchable-table-con1">
          <Table 
            :columns="columns_first" 
            :data="userpage" 
            border 
            :loading="ifLoading"
            ref="tabel"
            class='user_center'>
          </Table>
      </Row>

      <Row class="pageWrapper" >
        <Page :total="totalNum" style="margin-top:8px" :current="currentPageIdx"   @on-change="changePage" show-elevator></Page>
      </Row>
    </Card>
    <Modal v-model="showEditModal" :closable='false' :mask-closable='false' :width="500" class="modal">
        <h3 slot="header" class="textCenter">{{ moadlTtital }}</h3>
        <Form ref="lockForm" :model="lockForm" :rules="ruleValidate" :label-width="150" label-position="right">
            <FormItem label="vip等级名称：" prop="name">
                <Input v-model="lockForm.name"></Input>
            </FormItem>
            <FormItem label="币币交易推广一级奖励：" prop="exchangeTransactionReward.one">
                <InputNumber :min="0" v-model="lockForm.exchangeTransactionReward.one" class="width100"></InputNumber>
            </FormItem>
            <FormItem label="币币交易推广二级奖励：" prop="exchangeTransactionReward.two">
                <InputNumber :min="0" v-model="lockForm.exchangeTransactionReward.two" class="width100"></InputNumber>
            </FormItem>
            <FormItem label="法币交易推广一级奖励：" prop="otcTransactionReward.one" class="displayInline">
                <InputNumber :min="0" v-model="lockForm.otcTransactionReward.one" class="width200"></InputNumber>
            </FormItem>
            <FormItem prop="otcRewardCoin" class="displayInline coin">
                <Select :disabled="lockForm.lockPositionId ? true : false" v-model="lockForm.otcRewardCoin" placeholder="请选择币种">
                    <Option v-for="item in coinList" 
                                :value="item.name" 
                                :key="item.index">{{ item.nameCn }}</Option>
                </Select>
            </FormItem>
            <FormItem label="法币交易推广二级奖励：" prop="otcTransactionReward.two" class="displayInline">
                <InputNumber :min="0" v-model="lockForm.otcTransactionReward.two" class="width200"></InputNumber>
            </FormItem>
            <FormItem prop="otcRewardCoin" class="displayInline coin">
                <Select :disabled="lockForm.lockPositionId ? true : false" v-model="lockForm.otcRewardCoin" placeholder="请选择币种">
                    <Option v-for="item in coinList" 
                                :value="item.name" 
                                :key="item.index">{{ item.nameCn }}</Option>
                </Select>
            </FormItem>
            <FormItem label="推广注册一级奖励：" prop="registerReward.one" class="displayInline">
                <InputNumber :min="0" v-model="lockForm.registerReward.one" class="width200"></InputNumber>
            </FormItem>
            <FormItem prop="registerRewardCoin" class="displayInline coin">
                <Select :disabled="lockForm.lockPositionId ? true : false" v-model="lockForm.registerRewardCoin" placeholder="请选择币种">
                    <Option v-for="item in coinList" 
                                :value="item.name" 
                                :key="item.index">{{ item.nameCn }}</Option>
                </Select>
            </FormItem>
            <FormItem label="推广注册二级奖励：" prop="registerReward.two" class="displayInline">
                <InputNumber :min="0" v-model="lockForm.registerReward.two" class="width200"></InputNumber>
            </FormItem>
            <FormItem prop="registerRewardCoin" class="displayInline coin">
                <Select :disabled="lockForm.lockPositionId ? true : false" v-model="lockForm.registerRewardCoin" placeholder="请选择币种">
                    <Option v-for="item in coinList" 
                                :value="item.name" 
                                :key="item.index">{{ item.nameCn }}</Option>
                </Select>
            </FormItem>
        </Form>
        <div slot="footer" class="textCenter">
            <Button @click="cancelEdit('lockForm')">取消</Button>
            <Button type="primary" :loading="saveLoading" @click="saveEditPass('lockForm')">保存</Button>
        </div>
    </Modal>
  </div>
</template>

<script>
import { setStore, getStore, removeStore } from "@/config/storage";
import {
  vipGrade,
  coinAll,
  memberManage,
  lockPositionCreate,
  lockPositionUpdate,
  lockPositionDetail
} from "@/service/getData";

export default {
  data() {
    return {
      currentPageIdx: 1,
      totalNum: null,
      ifLoading: true,
      pageIndex: 1,
      loading: false,
      limitList: [
        { key: 0, val: "日" },
        { key: 1, val: "月" },
        { key: 2, val: "年" }
      ],
      coinList: [],
      statusList: [
        { status: 0, val: "放款中" },
        { status: 1, val: "放款完成" },
        { status: 2, val: "已撤销" },
        { status: 8, val: "全部" }
      ],
      columns_first: [
        {
          title: "等级简称",
          key: "name"
        },
        {
          title: "推广人数",
          key: "threshold"
        },
        {
          title: "币币交易奖励",
          children: [
            {
              title: "一级奖励",
              align: "center",
              render: (h, obj) => {
                return h(
                  "span",
                  JSON.parse(obj.row.exchangeTransactionReward).one
                );
              }
            },
            {
              title: "二级奖励",
              align: "center",
              render: (h, obj) => {
                return h(
                  "span",
                  JSON.parse(obj.row.exchangeTransactionReward).two
                );
              }
            }
          ]
        },
        {
          title: "法币交易奖励",
          children: [
            {
              title: "一级奖励",
              align: "center",
              render: (h, obj) => {
                return h(
                  "span",
                  JSON.parse(obj.row.otcTransactionReward).one +
                    obj.row.otcRewardCoin.name
                );
              }
            },
            {
              title: "二级奖励",
              align: "center",
              render: (h, obj) => {
                return h(
                  "span",
                  JSON.parse(obj.row.otcTransactionReward).two +
                    obj.row.otcRewardCoin.name
                );
              }
            }
          ]
        },
        {
          title: "推广注册奖励",
          children: [
            {
              title: "一级奖励",
              align: "center",
              render: (h, obj) => {
                return h(
                  "span",
                  JSON.parse(obj.row.registerReward).one +
                    obj.row.registerRewardCoin.name
                );
              }
            },
            {
              title: "二级奖励",
              align: "center",
              render: (h, obj) => {
                return h(
                  "span",
                  JSON.parse(obj.row.registerReward).two +
                    obj.row.registerRewardCoin.name
                );
              }
            }
          ]
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, obj) => {
            return h("div", {}, [
              h(
                "Poptip",
                {
                  props: {
                    title: "是否确定撤销？",
                    confirm: true,
                    transfer: true
                  },
                  on: {
                    "on-ok": () => {
                      this.saveApi(lockPositionUpdate, {
                        lockPositionId: obj.row.id,
                        status: 2
                      });
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
                    "删除"
                  )
                ]
              ),
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginLeft: "10px"
                  },
                  on: {
                    click: () => {
                      this.edit(obj.row);
                    }
                  }
                },
                "修改"
              )
            ]);
          }
        }
      ],
      userpage: [],
      showEditModal: false,
      moadlTtital: "",
      options: [],
      saveLoading: false,
      lockForm: {
        exchangeTransactionReward: { one: 0, two: 0 },
        otcTransactionReward: { one: 0, two: 0 },
        registerReward: { one: 0, two: 0 },
        memberId: "",
        coin: "",
        lendingCycle: 0,
        cycleSpan: 1,
        totalAmount: 1,
        totalCount: 1,
        onceAmount: 0
      },
      ruleValidate: {
        memberId: [
          { required: true, type: "number", message: "必填", trigger: "blur" }
        ],
        coin: [{ required: true, message: "必填", trigger: "change" }],
        cycleSpan: [
          { required: true, type: "number", message: "必填", trigger: "change" }
        ],
        totalAmount: [
          { required: true, type: "number", message: "必填", trigger: "change" }
        ],
        totalCount: [
          { required: true, type: "number", message: "必填", trigger: "change" }
        ],
        lendingCycle: [
          { required: true, type: "number", message: "必填", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    refreshPageManual() {
      this.currentPageIdx = 1;
      this.refreshPage({ pageNo: 1, pageSize: 10 });
    },
    add() {
      this.showEditModal = true;
      this.moadlTtital = "添加等级";
    },
    edit(row) {
      this.showEditModal = true;
      this.moadlTtital = "修改等级";
      this.getRowData(row);
    },
    getRowData(row) {
      lockPositionDetail({ id: row.id })
        .then(res => {
          if (!res.code) {
            this.lockForm.lockPositionId = res.data.id;
            this.lockForm.memberName = res.data.memberName;
            this.lockForm.memberId = res.data.memberId;
            this.lockForm.totalAmount = res.data.totalAmount;
            this.lockForm.coin = res.data.coin.name;
            this.lockForm.totalCount = res.data.totalCount;
            this.lockForm.cycleSpan = res.data.cycleSpan;
            this.lockForm.lendingCycle = res.data.lendingCycle;
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(err => console.log(err));
    },
    getMember(obj) {
      memberManage(obj)
        .then(res => {
          if (!res.code) {
            this.loading = false;
            this.options = res.data.content.length ? res.data.content : [];
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(err => console.log(err));
    },
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        this.getMember({ account: query });
      } else {
        this.options = [];
        this.lockForm.memberId = "";
      }
    },
    changeAmount(val) {
      this.lockForm.onceAmount = this.lockForm.totalCount
        ? this.div(val, this.lockForm.totalCount)
        : 0;
    },
    changeCount(val) {
      this.lockForm.onceAmount = val
        ? this.div(this.lockForm.totalAmount, val)
        : 0;
    },
    cancelEdit(name) {
      this.showEditModal = false;
      this.$refs[name].resetFields();
      this.lockForm.lockPositionId = null;
    },
    saveEditPass(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.saveLoading = true;
          delete this.lockForm.onceAmount;
          !this.lockForm.lockPositionId
            ? this.saveApi(lockPositionCreate, this.lockForm)
            : this.saveApi(lockPositionUpdate, this.lockForm);
        }
      });
    },
    saveApi(url, param) {
      url(param)
        .then(res => {
          if (!res.code) {
            this.$Message.success(res.message);
            this.cancelEdit("lockForm");
            this.refreshPageManual();
          } else {
            this.$Message.error(res.message);
          }
          this.saveLoading = false;
        })
        .catch(err => console.log(err));
    },
    changePage(pageIndex) {
      this.currentPageIdx = pageIndex;
      this.ifLoading = true;
      let obj = Object.assign(
        { pageNo: pageIndex, pageSize: 10 },
        this.filterSearch
      );
      this.refreshPage(obj);
    },
    refreshPage(obj = {}) {
      this.ifLoading = true;
      vipGrade(obj).then(res => {
        if (!res.code) {
          this.ifLoading = false;
          this.userpage = res.data.content;
          this.totalNum = res.data.totalElements;
        }
      });
    },
    getCoin() {
      coinAll().then(res => {
        if (!res.code) {
          this.coinList = res.data;
        }
      });
    }
  },
  created() {
    this.refreshPage();
    this.getCoin();
  }
};
</script>

<style lang="less">
.select {
  display: inline-block;
  .ivu-select {
    width: 70px !important;
    margin-left: -6px;
    .ivu-select-placeholder,
    .ivu-select-selected-value {
      background: #eee;
    }
  }
}
.modal {
  .spanRight {
    float: right;
    color: #ccc;
  }
  .displayInline {
    display: inline-block;
  }
  .coin {
    margin-left: -30%;
    width: 54%;
  }
  .width100 {
    width: 100%;
  }
  .width200 {
    width: 200px;
  }
  .textCenter {
    text-align: center;
  }
}
</style>