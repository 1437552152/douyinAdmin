<template>
  <div>
    <Card>
      <p slot="title">
        查看当前渠道
        <Button type="primary" size="small" @click="refreshPageManual">
          <Icon type="refresh"></Icon>刷新
        </Button>
      </p>
      <Row class="functionWrapper">
        <div class="btnsWrapper clearfix">
          <Button type="success" @click="channelModal=true">设置渠道</Button>
        </div>
      </Row>

      <Row class="margin-top-10 searchable-table-con1">
        <Table
          :columns="columns_first"
          :data="userpage"
          border
          :loading="ifLoading"
          ref="tabel"
          class="user_center"
        ></Table>
      </Row>

      <Row class="pageWrapper">
        <Page
          :total="totalNum"
          style="margin-top:8px"
          :current="currentPageIdx"
          :page-size="pageSize"
          @on-change="changePage"
          show-elevator
        ></Page>
      </Row>
    </Card>
    <Modal
      title="设置渠道"
      v-model="channelModal"
      :closable="false"
      @on-ok="addChannel"
      :mask-closable="false"
    >
      <div>
        <span>手机号</span>
        <!-- <input type="number" v-model='phone'> -->
        <Input
          v-model="phone"
          type="text"
          :autosize="true"
          placeholder="请输入手机号"
          class="channelInput"
        ></Input>
      </div>
    </Modal>
  </div>
</template>

<script>
import { setStore, getStore, removeStore } from "@/config/storage";
import {
  channelList,
  channelSetUp,
  channelRevoke,
  channelDetail
} from "@/service/getData";

export default {
  data() {
    return {
      currentPageIdx: 1,
      phone: "",
      channelModal: false,
      memberStatusArr: [
        { status: 0, text: "正常" },
        { status: 1, text: "非法" },
        { status: "", text: "全部" }
      ],
      totalNum: null,
      ifLoading: true,
      usemmuber: "",
      pageIndex: 1,
      loading: true,
      columns_first: [
        {
          title: "真实姓名",
          key: "realName"
        },
        {
          title: "注册时间",
          width: 100,
          key: "registrationTime"
        },

        {
          title: "会员邮箱",
          key: "email"
        },
        {
          title: "手机号码",
          key: "mobilePhone"
        },

        {
          title: "会员等级",
          key: "memberLevel",
          width: 160,
          render: (h, obj) => {
            let memberLevel = obj.row.memberLevel;
            let memberLevelTxt = null;
            if (!memberLevel) memberLevelTxt = "普通会员";
            else if (memberLevel === 1) memberLevelTxt = "实名";
            else if (memberLevel === 2) memberLevelTxt = "认证";

            return h("span", {}, memberLevelTxt);
          }
        },
        {
          title: "推广人数",
          key: "channelCount",

          render: (h, obj) => {
            return h("span", {}, obj.row.channelVO.channelCount);
          }
        },
        {
          title: "渠道奖励",
          key: "channelReward",
          render: (h, obj) => {
            return h("span", {}, obj.row.channelVO.channelReward);
          }
        },

        {
          title: "操作",
          key: "action",
          width: 250,
          align: "center",
          render: (h, obj) => {
            // return h('Button',{
            //     props:{
            //         type:"error",
            //     },
            //     on:{
            //         click:()=>{
            //             this.revoke({memberId:obj.row.id});
            //         }
            //     }
            // },'撤销')
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.revoke({ memberId: obj.row.id });
                    }
                  }
                },
                "删除"
              ),

              h(
                "Button",
                {
                  props: {
                    type: "info",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        path: "/channel/channelDetail",
                        query: { id: obj.row.id }
                      });
                    }
                  }
                },
                "查看详情"
              )
            ]);
          }
        }
      ],
      userpage: [],
      pageSize: 10
    };
  },
  methods: {
    refreshPageManual() {
      this.refreshPage(1);
      this.currentPageIdx = 1;
    },
    refreshPage(index) {
      this.ifLoading = true;

      channelList({ pageNo: index, pageSize: this.pageSize }).then(res => {
        this.ifLoading = false;
        this.userpage = res.data.content;
        this.totalNum = res.data.totalElements;
      });
    },
    changePage(pageIndex) {
      this.currentPageIdx = pageIndex;
      this.refreshPage(pageIndex);
    },
    revoke(obj) {
      let self = this;
      channelRevoke(obj)
        .then(res => {
          if (res.code == 0) {
            this.$Message.success(res.message);
            this.refreshPage(1);
            this.currentPageIdx = 1;
          } else if (res.code == 500) {
            this.$Message.error(res.message);
          }
        })
        .catch(err => {
          // this.$Message.error(err);
        });
    },
    addChannel() {
      let self = this;
      channelSetUp({ mobilePhone: this.phone }).then(res => {
        if (res.code == 0) {
          self.$Message.success(res.message);
          self.channelModal = false;
          this.phone = "";
          self.refreshPage(1);
          this.currentPageIdx = 1;
        } else if (res.code == 500) {
          self.$Message.error(res.message);
          self.channelModal = false;
          this.phone = "";
        }
      });
    }
  },
  created() {
    this.refreshPage(1);
  }
};
</script>

<style lang="less" scoped>
.channelInput {
  width: 400px;
  margin-right: 10px;
}

.search-mask {
  position: absolute;
  z-index: 8888;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
}
</style>