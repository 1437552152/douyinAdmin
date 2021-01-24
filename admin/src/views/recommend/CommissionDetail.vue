<template>
  <div>
    <Card>
      <p slot="title">	
        佣金明细
        <Button type="primary" size="small" @click="refreshPageManual">
          <Icon type="refresh"></Icon>
          刷新
        </Button>
      </p>

		
			<Row class="functionWrapper">
				<div class="btnsWrapper">
					<Button type="primary" @click="addAddress">导出</Button>
				</div>
				<div class="searchWrapper clearfix">
					<div class="poptip">
						<Poptip trigger="hover" content="请输入手机号、真实姓名或会员名称搜索" placement="bottom-start">
							<Input placeholder="请输入手机号、真实姓名或会员名称搜索" 
										
							</Input>      
						</Poptip>
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

import { queryTansAdr, auditTansAdr, tansAdrDetail, delTansAdr } from '@/service/getData';
import { setStore, getStore, removeStore } from '@/config/storage';

export default {
	name: 'TransferAddress',
  data() {
    return {
			switchStatus: false,
			addressForm: {
				id: null,
				coinName: '',
				address: '',
				transferFee: '',
				minAmount: '',
				status: 1
			},
			showModal: false,
			selection: [],
      currentPageIdx: 1,
      ifLoading: true,
      totalNum: null,
      columns_first: [
				{
					title: '推荐人推荐码',
					key: 'id'
        },
        {
					title: '推荐人昵称',
					key: 'address'
				},
        {
					title: '推荐人邮箱',
					key: 'address'
				},
        {
					title: '推荐人手机号',
					key: 'address'
				},
        {
					title: '推荐会员数量',
					key: 'address'
				},
        {
					title: '总推荐奖励',
					key: 'address'
				},
				
        {
          title: "操作",
					key: "operation",
					render: (h, obj) => {
						return h('div',{}, '查看')
					}
        }
      ],
			userpage: [],
    };
  },
  methods: {
		addAddress() {
			for(let val in this.addressForm)  {
				this.addressForm[val] = '';
			}
			this.addressForm.id = null;
			this.addressForm.status = 1;
			this.switchStatus = false;

			this.showModal = true;
		},
		confirmSub() {
			let bol = false;
			for(let val in this.addressForm)  {
				if(this.addressForm[val] === '') {
					bol = true;
					break;
				}
			}
			console.log(this.addressForm);
			
			if(!bol){
				this.switchStatus ? this.addressForm.status = 0 : this.addressForm.status =1;
				auditTansAdr(this.addressForm)
				.then(res => {
					if(!res.code){
						this.$Message.success(res.message);
					}else this.$Message.error(res.message);
					this.refreshPageManual();
				})
				.catch(err => console.log(err))
			}else this.$Message.warning('请完善信息！');

		},
		cancelSub () {

		},
		selectionChange(selection) {
			this.selection = selection;
		},
		batchDel() {
			let ids = [];
			this.selection.forEach(item => {
				ids.push(item.id)
			})

			delTansAdr({ ids: ids })
				.then(res => {
					if(!res.code){
						this.$Message.success(res.message);
						this.refreshPageManual();
					}else this.$Message.error(res.message);
				})
				.catch(err => console.log(err))
		},
    refreshPageManual() {
			this.currentPageIdx = 1;
      this.refreshPage({pageNo: 1, pageSize: 10 });
    },
  
    refreshPage(obj) {

			this.ifLoading = true;
      queryTansAdr(obj)
      .then(res => {
        if(!res.code){
          this.ifLoading = false;
          this.userpage = res.data.content;
          this.totalNum = res.data.totalElements;
				}else this.$Message.error(res.message);
			});
    },
    changePage(pageIndex) {
      this.currentPageIdx = pageIndex;
      let subObj = { pageNo: pageIndex, pageSize: 10 };
      // Object.assign(subObj, this.filterSearch);
      this.refreshPage(subObj);
    },
  },
  created() {
		this.refreshPage()
  }
}
</script>

<style scoped lang='less'>
 
</style>