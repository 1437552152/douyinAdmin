<template>
  <div>
    <Card>
      <p slot="title">
        奖励记录
        <Button type="primary" size="small" @click="refreshPageManual">
          <Icon type="refresh"></Icon>
          刷新
        </Button>
      </p>
			
			<!-- <Row class="functionWrapper">
				<div class="btnsWrapper clearfix">
          <Button type="info" @click="addNewRecommend">新增</Button>
        </div>
			</Row> -->

    
    <Row class="functionWrapper">
          <div class="searchWrapper clearfix">
                    <div class="poptip">
                        会员账号关键字：
                        <Poptip trigger="hover" content="会员账号关键字" placement="bottom-start">
                        <Input placeholder="会员账号关键字" 
                                v-model="filterSearch.account"/> 
                        </Input>      
                        </Poptip>
                    </div>

					<!-- <div class="poptip">
                        类型：
                        <select name="" id=""></select>
					</div> -->

					<div class="poptip">
                        类型：
						<Select v-model="filterSearch.type" placeholder="请选择币种类型">
							<Option v-for="item in type" :value="item.status" :key="item.status">{{item.text}}</Option>
						</Select>
					</div>
                    <div class="poptip">
                        币种单位：
						<Poptip trigger="hover" 
										content="请输入币种单位" 
										placement="bottom-start">
							<Input placeholder="请输入币种单位" 
										v-model="filterSearch.unit"/> 
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
          :columns="columnsList" 
          :data="userpage" 
          border
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

import Cookies from 'js-cookie'
import { getCoinName, auditRewardRecommend, queryRewardRecommend, rewardRecommendDetail,rewardRecord } from '@/service/getData';
import { setStore, getStore, removeStore } from '@/config/storage';

export default {

	name: 'CommissionParam',
  data() {
    return {
        type: [
            { status: 0, text: '推广' },
            { status: 1, text: '活动' },
            { status: 2, text: '分红' }
        ],
        filterSearch:{
          	pageNo: 1,
        	pageSize: 10,
            account:"",
            unit:"",
            type:'',
        },
        // filterSearch: {
        // 	id: null,
        // 	pageNo: 1,
        // 	pageSize: 10
        // },
        paramFrom: {
            id:　null,
            unit: '',
            status: 1,
            type: '',
            admin: '',
            one: '',
            two: '',
            effectiveTime: '',
            password: ''
        },
        columnsList: [
            {
                title: '类型',
                key: 'type',
                render: (h, obj) => {
                    return h('span', {}, this.type[obj.row.type].text)
                }
            },
            {
                title: '币种',
                key: 'name',
                render: (h, obj) => {
                    return h('span', {},obj.row.coin.name);
                }
            },
            {
                title: '备注',
                key: 'remark'
            },
            {
                title: '数量',
                key: 'amount'
            },
            {
                title: '用户名',
                key: 'username',
                render: (h, obj) => {
                    return h('span', {},obj.row.member.username);
                }
            },
            {
                title: '创建时间',
                key: 'createTime'
                
            },
     
        ],
        paramModal: false,
        coinNameArr: [],
        currentPageIdx: 1,
        ifLoading: true,
        totalNum: null,
		userpage: [],
    };
  },
    methods: {
		addNewRecommend() {
			this.paramModal = true;
		},
		submitParam (){
			for(let val of Object.values(this.paramFrom)) {
				if(String(val).trim()==='') {
					this.$Message.warning('请完善信息');
					return;
				}
			}
			auditRewardRecommend(this.paramFrom)
			.then(res => {
				if(!res.code) {
					console.log(res);
					this.$Message.success(res.message);
					this.paramModal = false;
					this.refreshPage();
					}else this.$Message.error(res.message)
			})
			.catch(err => { console.log(err) })
		},
		cancelParam (){
			for(let key in this.paramFrom)  {
				this.paramFrom[key] = '';
			}
			this.paramFrom.status = 1;
			this.paramModal = false;
		},
        refreshPageManual() {
            this.currentPageIdx = 1;
            this.filterSearch.pageNo = 1;
            this.filterSearch.id = null;
            this.refreshPage(this.filterSearch);
        },
        refreshPage(obj) {
            this.ifLoading = true;
            rewardRecord(obj)
            .then(res => {
                if(!res.code){
                    
                    this.ifLoading = false;
                    if( res.data!=undefined){
                        this.userpage = res.data.content;
                        this.totalNum = res.data.totalElements;
                    }
                    

                }else this.$Message.error(res.message);
            });
        },
        changePage(pageIndex) {
            this.currentPageIdx = pageIndex;
            this.filterSearch.pageNo = pageIndex;
            this.refreshPage(this.filterSearch);
        },
        searchByFilter() {
         
                this.currentPageIdx = this.filterSearch.pageNo = 1;
                this.filterSearch.pageSize = 10;
              
                this.refreshPage(this.filterSearch);
                
         
         
        },
    },
  created() {
		this.refreshPage()
		// this.paramFrom.admin = Cookies.getJSON('userInfo').id;
		// getCoinName()
		// .then(res => {
		// 	if(!res.code) {
		// 		this.coinNameArr = res.data ;
		// 		this.coinNameArr.push({ name: '请选择', unit: '' });
		// 	}else this.$Message.error(res.message)
		// })
		// .catch(err => console.log(err))
  }
}
</script>

<style scoped lang='less'>
 
</style>