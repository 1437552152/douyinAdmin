<template>
  <div>
    <Card>
      <p slot="title">
        转账地址
        <Button type="primary" size="small" @click="refreshPageManual">
          <Icon type="refresh"></Icon>
          刷新
        </Button>
      </p>
			<Row class="functionWrapper">
				<div class="btnsWrapper">
					<Button type="primary" @click="addAddress">添加地址</Button>
					<Button type="error" @click="batchDel">批量删除</Button>
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
			
			 <Modal v-model="showModal"
							title="编辑地址"
							width="400"
							@on-ok="confirmSub"
							@on-cancel="cancelSub">
						
					<Form :model="addressForm" :label-width="85" label-position="left" :rules="passwordValidate">
						<FormItem label="币种名称：" prop="coinName">
							<Select v-model="addressForm.coinName">
								<Option v-for=" item in coinNameArr" :value="item.unit" :key="item.unit">
									{{ item.name }}
								</Option>
							</Select>
						</FormItem>
						<FormItem label="地址：" prop="address">
							<Input v-model="addressForm.address" placeholder="请输入地址" ></Input>
						</FormItem>
						<FormItem label="手续费：" prop="transferFee">
							<Input v-model="addressForm.transferFee" placeholder="请输入手续费" ></Input>
						</FormItem>
						<FormItem label="最低数量：" prop="minAmount">
							<Input v-model="addressForm.minAmount" placeholder="请输入最低数量" ></Input>
						</FormItem>
						<FormItem label="状态：">
						 	<i-switch v-model="switchStatus">
								<span slot="open">开</span>
								<span slot="close">关</span>
							</i-switch>
						</FormItem>	

					</Form>
			</Modal>

    </Card>
    </div>
</template>

<script>

import { queryTansAdr, auditTansAdr, tansAdrDetail, delTansAdr, getCoinName } from '@/service/getData';
import { setStore, getStore, removeStore } from '@/config/storage';

export default {
	name: 'TransferAddress',
  data() {
    return {
			coinNameArr: [],
			passwordValidate: {
				coinName: [
					{ required: true, message: '请输入币种名称', trigger: 'blur' }
				],
				address: [
					{ required: true, message: '请输入地址', trigger: 'blur' }
				],
				transferFee: [
					{ required: true, message: '请输入手续费', trigger: 'blur' }
				],
				minAmount: [
					{ required: true, message: '请输入最低数量', trigger: 'blur' }
				]
			},
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
					type: 'selection'
				},
				{
					title: 'ID',
					key: 'id'
        },
        {
					title: '地址',
					key: 'address'
				},
				{
					title: '币种名',
					key: 'coinName',
					render: (h, obj) => {
						return h('span',{},obj.row.coin.name)
					}
				},
				{
					title: '币种单位',
					key: 'coinUnit',
					render: (h, obj) => {
						return h('span',{},obj.row.coin.unit)
					}
        },
        {
          title: "最小数量",
          key: "minAmount"
        },
				{
          title: "状态",
					key: "status",
					render: (h, obj) => {
						let text = '';
						!obj.row.status ? text = '开' : text = '关';
						return h('span',{},text)
					}
        },
        {
					title: "手续费",
					key: 'transferFee',
					render: (h, obj) => {
						let str = `${obj.row.transferFee} ${obj.row.coin.unit}`
						return h('span',{},str)
					}
        },
        {
          title: "操作",
					key: "operation",
					render: (h, obj) => {
						return h('div',{},[
							h('Button',{
								props: {
									type: 'info',
									size: 'small'
								},
								style: {
									'marginRight': '5px'
								},
								on: {
									click: () => {
										tansAdrDetail({ id: obj.row.id})
										.then(res => {
											if(!res.code){
												try{
													this.addressForm = res.data;
													this.switchStatus = (!res.data.status ? true : false);
													delete this.addressForm.coin;
													this.addressForm.coinName = obj.row.coin.name;
													console.log(this.addressForm.coinName);
													
													this.showModal = true;
												}catch(err) {console.log(err)}
												this.showModal = true;
											}else this.$Message.error(res.message);
										})
										.catch(err => console.log(err))

									}
								}
							},'查看 / 编辑'),
							// h('Button',{
							// 		props: {
							// 		type: 'error',
							// 		size: 'small'
							// 	}
							// },'删除'),
						])
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
			
			getCoinName()
			.then(res => {
        if(!res.code){
					this.coinNameArr = res.data;
					this.coinNameArr.push({name: '全部', unit: ''});
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