<template>
  <div>
    <Card>
      <p slot="title">
        推荐会员
        <Button type="primary" size="small" @click="refreshPageManual">
          <Icon type="refresh"></Icon>
          刷新
        </Button>
      </p>
			<Row class="functionWrapper">

				<div class="btnsWrapper">
					<a :href="aLink" target="_self">
						<Button type="success">导出</Button>
					</a>
				</div>

				<div class="searchWrapper clearfix">
          <div class="poptip">
            <Poptip trigger="hover" content="请输入推荐人呢称、邮箱或手机号搜索" placement="bottom-start">
              <Input placeholder="请输入推荐人呢称、邮箱或手机号搜索" 
                    v-model="filterSearch.account"/> 
              </Input>      
            </Poptip>
          </div>

					<div class="poptip range">
						<Poptip trigger="hover" 
										content="最小推荐人数" 
										placement="bottom-start">
							<Input placeholder="最小推荐人数" 
										v-model="filterSearch.minPromotionNum"/> 
							</Input> 
						</Poptip>
						~
						<Poptip trigger="hover" 
										content="最大推荐人数" 
										placement="bottom-start">
							<Input placeholder="最大推荐人数" 
										v-model="filterSearch.maxPromotionNum"/> 
							</Input> 
						</Poptip>
					</div>
				
					<div class="btns">
						<Button type="info" size="small" @click="searchByFilter">搜索</Button>
					</div>

				</div>

			</Row>		

      <Row>
        <Table 
          :columns="columns_first" 
          :data="userpage" 
          border
					@on-selection-change="selectionChange"
          :loading="ifLoading">
				</Table>
      </Row>

      <div class="pageWrapper">
        <Page  
          :total="totalNum" 
          :current="currentPageIdx"   
          @on-change="changePage" 
          show-elevator></Page>
      </div>
    </Card>
    </div>
</template>

<script>
import qs from "qs";
import { BASICURL, queryRecommend, recommendOutExcel } from "@/service/getData";
import { setStore, getStore, removeStore } from "@/config/storage";

export default {
  name: "TransferAddress",
  data() {
    return {
      aLink: `${BASICURL}admin/promotion/member/out-excel`,
      coinNameArr: [],
      filterSearch: {
        account: "",
        minPromotionNum: "",
        maxPromotionNum: "",
        pageNo: 1,
        pageSize: 10
      },
      switchStatus: false,
      addressForm: {
        id: null,
        coinName: "",
        address: "",
        transferFee: "",
        minAmount: "",
        status: 1
      },
      showModal: false,
      selection: [],
      currentPageIdx: 1,
      ifLoading: true,
      totalNum: null,
      columns_first: [
        {
          type: "selection",
          width: 80
        },
        {
          title: "#",
          key: "id",
          width: 80
        },
        {
          title: "推荐人推荐码",
          key: "promotionCode"
        },
        {
          title: "推荐人昵称",
          key: "username"
        },
        {
          title: "推荐人邮箱",
          key: "email"
        },
        {
          title: "推荐人手机号",
          key: "mobilePhone"
        },
        {
          title: "推荐会员数量",
          key: "promotionNum"
        },
        // {
        //   title: "总推荐奖励",
        //   key: "reward",
        //   render: (h, obj) => {
        //     let reward = !obj.row.reward ? [] : Object.entries(obj.row.reward);
        //     if (!obj.row.reward) return "";
        //     else return h('span',{},`${reward[0][1]} ${reward[0][0]}`);
        //   }
        // },

        {
          title: "操作",
          key: "operation",
          render: (h, obj) => {
            return h(
              "Button",
              {
                props: {
                  type: "info",
                  size: "small"
                },
                on: {
                  click: () => {
                    this.$router.push({
                      path: "/recommend/member/commissiondetail",
                      query: { memberId: obj.row.id }
                    });
                  }
                }
              },
              "查看"
            );
          }
        }
      ],
      userpage: []
    };
  },
  methods: {
    searchByFilter() {
        this.aLink = `${BASICURL}admin/promotion/member/out-excel?${qs.stringify(
            this.filterSearch
        )}`;
        this.currentPageIdx = this.filterSearch.pageNo = 1;
        this.filterSearch.pageSize = 10;
        if (this.filterSearch.minPromotionNum === "")
            this.filterSearch.minPromotionNum = -1;
        if (this.filterSearch.maxPromotionNum === "")
            this.filterSearch.maxPromotionNum = -1;
        this.refreshPage(this.filterSearch);
    },
    selectionChange(selection) {
      this.selection = selection;
    },
    refreshPageManual() {
      this.currentPageIdx = 1;
      for (let key in this.filterSearch) {
        this.filterSearch[key] = "";
      }
      this.filterSearch.minPromotionNum = this.filterSearch.maxPromotionNum =
        "";
      this.refreshPage({ pageNo: 1, pageSize: 10 });
    },

    refreshPage(obj) {
      this.ifLoading = true;
      queryRecommend(obj)
        .then(res => {
          if (!res.code) {
            this.ifLoading = false;
            this.userpage = res.data.content;
            this.totalNum = res.data.totalElements;
          } else 
          // this.$Message.error(res.message);
          this.ifLoading = false;
          this.filterSearch.minPromotionNum = this.filterSearch.maxPromotionNum =
            "";
        })
        .catch(err => {
          console.log(err);
        });
    },
    changePage(pageIndex) {
      this.currentPageIdx = pageIndex;
      this.filterSearch.pageNo = pageIndex;
      if (this.filterSearch.minPromotionNum === "")
        this.filterSearch.minPromotionNum = -1;
      if (this.filterSearch.maxPromotionNum === "")
        this.filterSearch.maxPromotionNum = -1;
      this.refreshPage(this.filterSearch);
    }
  },
  created() {
    this.refreshPage();
  }
};
</script>

<style scoped lang='less'>
</style>