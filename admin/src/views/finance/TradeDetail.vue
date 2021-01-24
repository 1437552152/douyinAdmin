<template>
  <div>
    <Card>
      <p slot="title">
        交易明细
        <Button type="primary" size="small" @click="refreshPageManual">
          <Icon type="refresh"></Icon>
          刷新
        </Button>
      </p>
      <Row class="functionWrapper">
				<div class="searchWrapper clearfix">
					
					<div class="poptip">
						<Poptip trigger="hover" 
										content="请输入会员ID" 
										placement="bottom-start">
							<Input placeholder="请输入会员ID" 
										v-model="filterSearch.memberId"/> 
							</Input>      
						</Poptip>
					</div>

					<div class="poptip">
						<Poptip trigger="hover" 
										content="请输入会员昵称" 
										placement="bottom-start">
							<Input placeholder="请输入会员昵称" 
										v-model="filterSearch.account"/> 
							</Input>      
						</Poptip>
					</div>

					<div class="poptip">
						<span>交易类型：</span>
						<Select v-model="filterSearch.type">
							<Option v-for="(item, index) in tradeTypeArr" 
										:value="index" 
										:key="item">{{ item }}</Option>
						</Select>
					</div>

					<div class="btns">
						<Button type="info" size="small" @click="searchByFilter">搜索</Button>
						<Button type="text" size="small" @click="seniorSearch = !seniorSearch">高级搜索</Button>
					</div>
					<br>
					<div v-show="seniorSearch">
						<div class="poptip range">
							<Poptip trigger="hover" 
											content="最低交易金额搜索" 
											placement="bottom-start">
								<Input placeholder="最低交易金额搜索" 
											v-model="filterSearch.minMoney"/> 
								</Input> 
							</Poptip>
							~
							<Poptip trigger="hover" 
											content="最高交易金额搜索" 
											placement="bottom-start">
								<Input placeholder="最高交易金额搜索" 
											v-model="filterSearch.maxMoney"/> 
								</Input> 
							</Poptip>
						</div>

						<div class="poptip range">
							<Poptip trigger="hover" 
											content="最低手续费搜索" 
											placement="bottom-start">
								<Input placeholder="最低手续费搜索" 
											v-model="filterSearch.minFee"/> 
								</Input> 
							</Poptip>
							~
							<Poptip trigger="hover" 
											content="最高手续费搜索" 
											placement="bottom-start">
								<Input placeholder="最高手续费搜索" 
											v-model="filterSearch.maxFee"/> 
								</Input> 
							</Poptip>
						</div>

						<div class="poptip">
							<!-- <DatePicker 
								type="daterange" 
								placement="bottom-end" 
								@on-change="dateRange"
								placeholder="选择时间区间"> 
							</DatePicker> -->
             <DatePicker type="datetimerange" 	placement="bottom-end" 	@on-change="dateRange"  placeholder="选择时间区间"  style="width:300px"> </DatePicker>
						</div>
	<div class="poptip">
						<span>交易币：</span>
              <Select placeholder="BTC" v-model="filterSearch.symbol" transfer>
                  <Option v-for="(item ,index) in allCoin" :key="index" :value="item.unit">{{ item.unit }}</Option>
              </Select>
	</div>
					</div>

				</div>
                <div class="btnsWrapper clearfix" style='text-align:right;margin:10px 0'>
     	<Button type="success"><a :href="urls + 'admin/finance/member-transaction/out-excel?memberId='+filterSearch.memberId+'&account='+filterSearch.account+'&type='+filterSearch.type+'&minMoney='+filterSearch.minMoney+'&maxMoney='+filterSearch.maxMoney+'&minFee='+filterSearch.minFee+'&maxFee='+filterSearch.maxFee+'&startTime='+filterSearch.startTime+'&endTime='+filterSearch.endTime+'&symbol='+filterSearch.symbol" style='color:#fff'>导出 </a></Button>
        </div>
			</Row>		

      <Row class="tableWrapper">
        <Table :columns="columns_first" :data="userpage" border :loading="ifLoading"></Table>
      </Row>

      <Row class="pageWrapper" >
        <Page :total="pageNum" :current="currentPageIdx" @on-change="changePage" show-elevator></Page>
      </Row>

    </Card>
  </div>
</template>

<script>
import { perTradeAll, getAllCoin } from "@/service/getData";
import { BASEURL } from "@/service/http.js";
export default {
  data() {
    return {
      urls: "",
      seniorSearch: false,
      filterSearch: {
        pageNo: 1,
        pageSize: 10,
        memberId: "",
        account: "",
        type: "",
        symbol: "",

        minMoney: "",
        maxMoney: "",
        minFee: "",
        maxFee: "",
        startTime: "",
        endTime: ""
      },
      tradeTypeArr: [
        "充值",
        "提现",
        "转账",
        "币币交易",
        "法币买入",
        "法币卖出",
        "活动奖励",
        "推广奖励",
        "分红",
        "投票",
        "人工充值",
        "配对",
        "缴纳商家认证保证金",
        "退回商家认证保证金"
      ],
      allCoin: [],
      currentPageIdx: 1,
      ifLoading: true,
      pageNum: null,
      userpage: [],
      columns_first: [
        {
          title: "会员名称",
          key: "memberUsername"
        },
        {
          title: "交易类型",
          render: (h, obj) => {
            let type = obj.row.type;
            return h("span", {}, this.tradeTypeArr[type]);
          }
        },
        {
          title: "交易金额",
          render: (h, obj) => {
            let amount = obj.row.amount;
            let symbol = obj.row.symbol;
            return h("span", {}, amount + " " + symbol);
          }
        },
        {
          title: "交易手续费",
          key: "fee"
        },
        {
          title: "交易时间",
          key: "createTime"
        }
      ]
    };
  },
  methods: {
    searchByFilter() {
      let reg = /\D/;

      if (reg.test(this.filterSearch.memberId)) {
        this.$Message.warning("请输入正确的会员ID!");
        return;
      }
      this.currentPageIdx = 1;
      this.filterSearch.pageNo = 1;
      this.refreshPage(this.filterSearch);
    },
    dateRange(val) {
      this.filterSearch.startTime = val[0];
      this.filterSearch.endTime = val[1];
    },
    refreshPageManual() {
      this.currentPageIdx = 1;
      for (let key in this.filterSearch) {
        this.filterSearch[key] = "";
      }
      this.filterSearch.pageNo = 1;
      this.filterSearch.pageSize = 10;
      this.refreshPage(this.filterSearch);
    },
    changePage(pageIndex) {
      this.currentPageIdx = pageIndex;
      this.filterSearch.pageNo = pageIndex;
      this.refreshPage(this.filterSearch);
    },
    refreshPage(obj) {
      this.ifLoading = true;
      perTradeAll(obj).then(res => {
        if (!res.code) {
          this.ifLoading = false;
          this.pageNum = res.data.totalElements;
          this.userpage = res.data.content;
        } else this.$Message.error(res.message);
      });
    }
  },
  created() {
    this.refreshPage();
    this.urls = BASEURL;
    /**
     * 获取所有币种
     */
    getAllCoin().then(res => {
      this.allCoin = res.data;
    });
  }
};
</script>

<style lang="less" scoped>
</style>