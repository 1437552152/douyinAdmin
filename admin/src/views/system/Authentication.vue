<template>
  <div>
    <Card>
      <p slot="title">
        实名认证
        <Button type="primary" size="small" @click="refreshPageManual">
          <Icon type="refresh"></Icon>
          刷新
        </Button>
      </p>

      <Row>
        <Table 
          :columns="columns_first" 
          :data="userpage" 
          border
          :loading="ifLoading">
				</Table>
      </Row>

      <!-- <div class="pageWrapper">
        <Page  
          :total="totalNum" 
          :current="currentPageIdx"   
          @on-change="changePage" 
          show-elevator></Page>
      </div> -->
    </Card>
    </div>
</template>

<script>

import { addAuthenticationSys, queryAuthenticationSys } from '@/service/getData';
import { setStore, getStore, removeStore } from '@/config/storage';

export default {
	name: 'AuthenticationSystem',
  data() {
    return {
      currentPageIdx: 1,
      ifLoading: true,
			totalNum: null,
			filterSearchArr: [],
			filterSearch: {
				rechargeCoinOn: '',
				withdrawCoinOn: '',
				transactionOn: '',
				promotionOn: ''
			},
      columns_first: [
        {
					title: '功能',
					key: 'function'
        },
        {
          title: "状态",
					key: 'status',
					render: (h, obj) => {
						let text = !obj.row.status ? '关闭' : '开启';
						return h('span',{},text)
					}
        },
        {
          title: "操作",
					key: "operation",
					render: (h, obj) => {
						return h('i-switch',{
							props: {
								'value': obj.row.status,
								'true-value': 1,
								'false-value': 0,
								'size': 'large'
							},
							on: {
								"on-change": (val) => {
									this.filterSearch[obj.row.key] = val;

									addAuthenticationSys(this.filterSearch)
									.then(res => {
										if(!res.code) {
											this.$Message.success(res.message);
											this.refreshPage();
										}else this.$Message.error(res.message);
									})
									.catch(err => console.log(err))
								}
							}
						},[
							h('span', {
								slot: 'close'
							},'关闭'),
							h('span', {
								slot: 'open'
							},'开启')
						])
					}
        },
      ],
      userpage: [],
    };
  },
  methods: {
    refreshPageManual() {
			this.currentPageIdx = 1;
			this.filterSearch.pageNo = 1;
      this.refreshPage(this.filterSearch);
    },
  
    refreshPage(obj) {
			this.ifLoading = true;
      queryAuthenticationSys(obj)
      .then(res => {
        if(!res.code){
					this.ifLoading = false;
					this.filterSearch = res.data;
					
                    if(res.data!=null){
                        let arr = [
                            { key: 'rechargeCoinOn', function: '是否开启充币需要实名认证', status: res.data.rechargeCoinOn},
                            { key: 'withdrawCoinOn', function: '是否开启提币需要实名认证', status: res.data.withdrawCoinOn},
                            { key: 'transactionOn', function: '是否开启交易需要实名认证', status: res.data.transactionOn},
                            { key: 'promotionOn', function: '是否开启推荐人需要实名认证', status: res.data.promotionOn}
                        ]
                        this.userpage = arr;
                    }
          // this.userpage = res.data.content;
          // this.totalNum = res.data.totalElements;
				}else this.$Message.error(res.message);
      });
    },
    // changePage(pageIndex) {
    //   this.currentPageIdx = pageIndex;
		// 	this.ifLoading = true;
		// 	this.filterSearch.pageNo = pageIndex;
    //   this.refreshPage(this.filterSearch);
    // },
  },
  created() {
		this.refreshPage()
  }
}
</script>

<style scoped lang='less'>
 
</style>