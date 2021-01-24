<template>
	<div>
    <Card>
      <p slot="title">
        提币管理
        <Button type="primary" size="small" @click="refreshPageManual">
          <Icon type="refresh"></Icon>
          刷新
        </Button>
      </p>
				<Row class="functionWrapper">
					<div class="btnsWrapper clearfix ">
						<Button type="primary" @click="ifPassAll(1)">一键审核通过</Button>
						<Button type="error" @click="ifPassAll(0)">一键审核不通过</Button>
						<Button type="success" @click="passAllCoinFn">一键放币</Button>
					</div>

					<div class="searchWrapper clearfix">
						<div class="poptip">
							<Poptip trigger="hover" 
											content="请输入昵称/真名搜索" 
											placement="bottom-start">
								<Input placeholder="请输入昵称/真名 搜索" 
											v-model="filterSearch.account"/> 
								</Input>      
							</Poptip>
						</div>

						<div class="poptip">
							<Poptip trigger="hover" 
											content="请输入会员ID搜索" 
											placement="bottom-start">
								<Input placeholder="请输入会员ID搜索" 
											v-model="filterSearch.memberId"/> 
								</Input>      
							</Poptip>
						</div>

						<div class="poptip">
							<Poptip trigger="hover" 
											content="请输入提现地址搜索" 
											placement="bottom-start">
								<Input placeholder="请输入提现地址搜索" 
											v-model="filterSearch.address"/> 
								</Input>      
							</Poptip>
						</div>

						<div class="poptip">
							<Poptip trigger="hover" 
											content="请输入币种单位搜索" 
											placement="bottom-start">
								<Input placeholder="请输入币种单位搜索" 
											v-model="filterSearch.unit"/> 
								</Input>      
							</Poptip>
						</div>

						<div class="btns">
							<Button type="info" size="small" @click="searchByFilter">搜索</Button>
							<Button type="text" size="small" @click="seniorSearch = !seniorSearch">高级搜索</Button>
						</div>
						<br>
						<div v-show="seniorSearch">
							<div class="poptip">
								<Poptip trigger="hover" 
												content="请输入单号搜索" 
												placement="bottom-start">
									<Input placeholder="请输入单号搜索" 
												v-model="filterSearch.orderSn"/> 
									</Input>      
								</Poptip>
							</div>
							
							<div class="poptip">
								<span>提现方式：</span>
								<Select v-model="filterSearch.isAuto">
									<Option v-for="item in orderAutoArr" 
												:value="item.status" 
												:key="item.status">{{ item.text }}</Option>
								</Select>
							</div>

							<div class="poptip">
								<span>状态：</span>
								<Select v-model="filterSearch.status">
									<Option v-for="item in orderStatusArr" 
												:value="item.status" 
												:key="item.status">{{ item.text }}</Option>
								</Select>
							</div>
						</div>
					</div>	
				</Row>
        
      <Row class="tableWrapper">
        <Table :columns="columns_first" 
							 :data="userpageCopy" 
							 border
							 :loading="ifLoading"
							 @on-selection-change="selectionChange">
        </Table>
      </Row>
      <Row class="pageWrapper">
        <Page :total="pageNum" 
							:current="currentPageIndex"   
							@on-change="changePage" 
							show-elevator>
				</Page>
      </Row>

			 <Modal 
        width="400"
				title="一键放币"
        v-model="ifPassCoin"
        @on-ok="confrimPass">
				<Row>
					<p>提示：您正在进行一键放币操作，该功能需要输入登录密码</p>
				</Row>
				<br>
				<Form :model="passAllCoin">
					<FormItem>
						<Input type="password" placeholder="请输入登录密码..." v-model="passAllCoin.password"></Input>
					</FormItem>
					<FormItem>
						<Input placeholder="请输入流水..." type="textarea" v-model="passAllCoin.transactionNumber"></Input>
					</FormItem>
				</Form>
      </Modal>

    </Card>
	</div>
</template>

<script>

import { withdrawManage, auditPass, auditNoPass, passCoin } from '@/service/getData';
import { setStore, getStore, removeStore } from '@/config/storage';
import Cookies from 'js-cookie';

export default{
	data() {
		return {
			selection: [],
			seniorSearch: false,
			ifPassCoin: false,
			passAllCoin: {
				transactionNumber: '',
				password: ''
			},
			filterSearch: {
				pageNo: 1,
				pageSize: 10,
				account: '',
				memberId: '',
				address: '',
				unit: '',
				isAuto: '',
				status: '',
				orderSn: '',
				// direction: '1',
				// property: 'status'
			},
			currentPageIndex: 1,

      ifLoading: true,
			pageNum: null,
			orderAutoArr: [
        { status: 0, text: '人工审核提现' },
        { status: 1, text: '自动提现' },
        { status: '', text: '全部' },
			],
			orderStatusArr: [
        { status: 0, text: '审核中' },
        { status: 1, text: '等待放币' },
        { status: 2, text: '失败' },
        { status: 3, text: '成功' },
        { status: '', text: '全部' },
			],
			userpage: [],
			userpageCopy: [],
			selectedNumArr: [],
			columns_first: [
				{
					type: 'selection',
					width: 60,
					align: 'center',
				},
				{
					title: '交易单号',
					key: 'transactionNumber'
				},
				{
					title: '会员ID',
					key: 'memberId',
				},
				{
					title: '会员昵称',
					key: 'memberUsername'
				},
				{
					title: '申请时间',
					key: 'createTime',
					width: 100
				},
			
				{
					title: '提现币种',
					key: 'coin',
					render: (h, obj) => {
						let unit = obj.row.unit;
						return h('span', {
						}, unit)
					}
        },
        {
					title: '提现地址',
          key: 'address',
          // width: 180
				},
				{
					title: '提现数量',
					key: 'totalAmount'
        },
        {
          title: '实际到账',
					key: 'arrivedAmount'
        },
				{
					title: '提现方式',
					render: (h, obj) => {
            const isAuto = obj.row.isAuto*1 === 0 ?'人工审核提现':'自动提现';
            
						return h('span', {
            },isAuto) 
            
					}
				},
				{
					title: '手续费',
					key: 'fee',
					render: (h, obj) => {
						let fee = obj.row.fee;
						let unit = obj.row.unit;
						
						return h('span', {
						}, fee+unit)
					}
        },
				{
					title: '状态',
					key: 'status',
					render: (h, obj) => {
						let status = obj.row.status*1;
						let statusInner = String;

						if(status === 0) statusInner = '待审核';
						else if(status === 1) statusInner = '等待放币';
						else if(status === 2) statusInner = '失败';
                        else if(status === 3) statusInner = '成功';
                        else if(status === 4) statusInner = '打款中';
						
						return h('span', {
						},statusInner);
					}
                },
                {
					title: '备注',
					key: 'errorMsg',
			
				},
				{
					title: '操作',
					key: 'action',
					render: (h, obj) => {
						let status = obj.row.status;
						let statusInner = String;
						let btnType = 'info';

						if( status === 0 ) {
							statusInner = '审核';
							btnType = 'info';
						} else {
							statusInner = '查看';
							btnType = 'success';
						} 

						return h('Button',{
							props: {
								type: btnType,
								size: 'small'
							},
							on: {
								click: () => {
									Cookies.set('financePage', this.filterSearch.pageNo);
                  this.$router.push({ path: '/finance/auditdetail'});
                  removeStore('userDetails');
                  setStore('userDetails', obj.row);
								}
							}
						}, statusInner)
					}
                },
               
			],
			}
		},
	methods:{
		passAllCoinFn() {
			if(!this.selectedNumArr.length) {
				this.$Message.warning('尚未选取项目');
				return;
			}else {
				let i = 0;
				//此处需要封装 line -308
				this.selection.every(item => {
					if (item.status !==1 ) {
						this.$Message.warning('选择数据有误！');
						i++;
						return false;
					}
					return true;
				})
				!i ? this.ifPassCoin = true : this.ifPassCoin = false;
			}
		},
		confrimPass() {
			this.ifPassAll(-1);
		},
		checkable() { 
			this.userpageCopy = [];
			this.userpage.forEach( item => {
				if(item.status===1 || item.status===0) item._disabled = false;
				else item._disabled = true;
				this.userpageCopy.push(item);
			})
		},
	
		ifPassAll(val){
			if(!this.selectedNumArr.length) {
				
				this.$Message.warning('尚未选取项目');
			}else {
				let fn = '';
				let obj = {ids: this.selectedNumArr};
				let i = 0;
				

				if(val===1) {
						//此处需要封装 line -343
					this.selection.every(item => {
					if (item.status !==0 ) {
						this.$Message.warning('选择数据有误！');
						i++;
						return false;
					}
					return true;
				})

					!i ? fn = auditPass(obj) : ''; //一键审核通过
				}	else if(val===0) {
						//此处需要封装 line -355
					this.selection.every(item => {
					if (item.status !==0 ) {
						this.$Message.warning('选择数据有误！');
						i++;
						return false;
					}
					return true;
				})

					!i ? fn = auditNoPass(obj) : ''; //一键审核不通过
				} else if(val===-1) {
					obj = Object.assign({}, obj, this.passAllCoin);
					fn = passCoin(obj);											//一键放币
				}

				fn.then( res => {
					if(!res.code) {
						this.$Message.success(res.message);
					}else this.$Message.error(res.message);

					withdrawManage({ pageNo: this.currentPageIndex, pageSize: 10 })
					.then( res => {
						this.userpage = res.data.content;
						this.checkable();
					})
				})
			}
		},
		selectionChange(selection) {
			this.selection = selection;
			this.selectedNumArr = [];
			selection.forEach( item => {
				this.selectedNumArr.push(item.id);
			})
		},
		searchByFilter() {
			let reg = /\D/;
			if(reg.test(this.filterSearch.memberId)) {
				this.$Message.warning('请输入正确的会员id');
				return;
			}
			this.resetTableContain(1);
		},
    refreshPageManual() {
			this.currentPageIndex = 1;
			for(let val in this.filterSearch)  {
				this.filterSearch[val] = '';
			}
			this.resetTableContain(1);
    },
		changePage(pageIndex){
			this.currentPageIndex = pageIndex;
			this.resetTableContain(pageIndex);
		},
		refreshPage(obj = {}) {
			this.ifLoading = true;
			withdrawManage(obj)
			.then( res => {
				if(!res.code) {
					this.ifLoading = false;
					this.userpage = res.data.content;
					this.pageNum = res.data.totalElements;
					this.userpageCopy = [...this.userpage];
					this.checkable();
				}else this.$Message.error(res.message);
			})
		},
		resetTableContain(pageNo) {
			this.filterSearch.pageNo = pageNo;
			this.filterSearch.pageSize = 10;
			this.refreshPage(this.filterSearch);
		}
	},
	beforeRouteEnter(to, from, next) {
		if(to.query.from === 'bell') {
			Cookies.set('ifFromHome', true)
		}
		next();
	},
	created(){
		let ifFormBell = Boolean(Cookies.get('ifFromHome'));
		let obj = {};
		if(ifFormBell) {
			Cookies.remove('ifFromHome');
			this.filterSearch.status = 0;
		}
		this.refreshPage(this.filterSearch);
	}
}
</script>

<style scoped>
</style>
