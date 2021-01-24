<template>
  <div>
    <Card>
      <p slot="title">
        佣金参数
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

			<Modal
				title="参数修改"
				:mask-closable="false"
				:width="420"
				:closable='false'
				v-model="paramModal">
				<Form :modal="paramFrom" label-position="right" :label-width="100">
					<FormItem label="类型：">
						<Select v-model="paramFrom.type" placeholder="请选择...">
							<Option v-for="item in type" :key="item.status" :value="item.status">{{ item.text }}</Option>
						</Select>
					</FormItem>
					<FormItem label="币种名称：">
						<Select v-model="paramFrom.unit">
							<Option v-for="(item, index) in coinNameArr" :value="item.unit" :key="item.unit">
								{{ item.name }}
							</Option>
						</Select>
					</FormItem>
					<FormItem label="状态：">
						<RadioGroup v-model="paramFrom.status">
							<Radio  :label="1">
								<span>开启</span>
							</Radio>
							<Radio  :label="0">
								<span>关闭</span>
							</Radio>
						</RadioGroup>
					</FormItem>
					<FormItem label="一级返佣比例：">
						<Input v-model="paramFrom.one"></Input>
					</FormItem>
					<FormItem label="二级返佣比例：">
						<Input v-model="paramFrom.two"></Input>
					</FormItem>
					<FormItem label="有效期：">
						<Input v-model="paramFrom.effectiveTime"></Input>
					</FormItem>
					<FormItem label="登录密码：">
						<Input type="password" v-model="paramFrom.password"></Input>
					</FormItem>
				</Form>
				<div slot="footer">
					<Row>
						<Col span="6" offset="3">
							<Button type="info" @click="submitParam" long>保存</Button>
						</Col>
						<Col span="6" offset="6">
							<Button type="text" @click="cancelParam" long>取消</Button>
						</Col>
					</Row>
				</div>
			</Modal>
			
    </Card>
	</div>
</template>

<script>

import Cookies from 'js-cookie'
import { getCoinName, auditRewardRecommend, queryRewardRecommend, rewardRecommendDetail } from '@/service/getData';
import { setStore, getStore, removeStore } from '@/config/storage';

export default {

	name: 'CommissionParam',
  data() {
    return {
			type: [
				{ status: 0, text: '推广注册' },
				{ status: 1, text: '法币推广交易' },
				{ status: 2, text: '币币推广交易' }
			],
			filterSearch: {
				id: null,
				pageNo: 1,
				pageSize: 10
			},
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
					title: '一级返佣比例(%)',
					key: 'one'
				},
        {
					title: '二级返佣比例(%)',
					key: 'two'
				},
        {
					title: '修改时间',
					key: 'updateTime'
				},
        {
					title: '状态',
					key: 'status',
					render: (h, obj) => {
						return h('span',{},!!obj.row.status ? '启用' : '禁用');
					}
				},
				{
					title: '有效期(天)',
					key: 'effectiveTime'
					
				},
        {
					title: '操作',
					key: 'opration',
					render: (h, obj) => {
						return h('Button',{
							props: {
								type: 'info',
								size: 'small'
							},
							on: {
								click: () => {
									rewardRecommendDetail({id: obj.row.id})
									.then(res => {
										if(!res.code) {
											for( let key in this.paramFrom) {
												this.paramFrom[key] = res.data[key]
											}
											this.paramFrom.admin = res.data.admin.id;
											this.paramFrom.unit = !res.data.coin ? '' : res.data.coin.unit;
											this.paramModal = true;
										}else this.$Message.error(res.message);
										
									})
									.catch(err => {console.log(err)})
								}
							}
						},'编辑')
					}
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
      queryRewardRecommend(obj)
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
			this.filterSearch.pageNo = pageIndex;
      this.refreshPage(this.filterSearch);
    }
  },
  created() {
		this.refreshPage()
		this.paramFrom.admin = Cookies.getJSON('userInfo').id;
		getCoinName()
		.then(res => {
			if(!res.code) {
				this.coinNameArr = res.data ;
				this.coinNameArr.push({ name: '请选择', unit: '' });
			}else this.$Message.error(res.message)
		})
		.catch(err => console.log(err))
  }
}
</script>

<style scoped lang='less'>
 
</style>