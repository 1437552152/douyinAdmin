<template>
	<div>
		<Card>
			<p slot="title">
				提现管理
				<Button type="primary" size="small" @click="refreshPageManual">
					<Icon type="refresh"></Icon> 刷新
				</Button>
			</p>

			<Row class="functionWrapper">
				<div class="btnsWrapper">
					<Button type="primary" @click="addDividend">添加分红</Button>
				</div>

				<div class="searchWrapper clearfix">

					<div class="poptip">
						<span>分红币种：</span>
						<Select v-model="filterSearch.unit" >
							<Option v-for=" item in coinSearchArr" :value="item.unit" :key="item.unit">
								{{ item.unit }}
							</Option>
						</Select>
					</div>
					<div class="btns">
						<Button type="info" size="small" @click="searchByFilter">搜索</Button>
					</div>

				</div>	
			</Row>

			<Row>
				<Table :loading="ifloading" 
								:columns="columnsList" 
								:data="cbData.content"
								@on-sort-change="sortChange"
								border>
				</Table>
			</Row>

			<Row class="pageWrapper" >
				<Page :total="cbData.totalElements" 
							:current="currentPageIdx"   
							@on-change="changePage" 
							show-elevator>
				</Page>
			</Row>	

			<Modal v-model="showDividend"
						 width="420"
						 :mask-closable="false"
						 class="dividendModal"
					 	 title="创建分红">
				<Form :model="dividendForm" :rules="dividendRules" :label-width="110">
					<FormItem label="日期区间：" prop="data">
						<DatePicker type="daterange"
							style="width: 260px"
							@on-change="pickDate"
							placement="bottom-end" 
							placeholder="请选择日期区间..."> 
						</DatePicker>
					</FormItem>
					
					<FormItem label="时间区间：" prop="time">
						<TimePicker type="timerange"
							style="width: 260px"
							@on-change="pickTime"
							@on-open-change="confirmPickTime"
							placement="bottom-end" 
							placeholder="请选择时间区间..."> 
						</TimePicker>
					</FormItem>

					<FormItem v-show="coinType" label="分红币种：" prop="unit">
						<Select v-model="dividendForm.unit" @on-change="optionChange" style="width: 260px" >
							<Option v-for=" item in coinNameArr" :value="item.name" :key="item.name">
								{{item.name}}
							</Option>
						</Select>
					</FormItem>

					<FormItem v-show="coinType" label="最大分红数量：" prop="amount">
						<Input disabled v-model="dividendForm.amount" placeholder='可分红数量' style="width: 260px"></Input>
					</FormItem>

					<FormItem v-show="coinType" label="分红比例：" prop="rate">
						<Input v-model="dividendForm.rate" placeholder="请输入分红比例(0~100)" style="width: 260px"></Input> %
						<p v-show="dividendRange!==null" style="color: #2d8cf0">{{ dividendRange*dividendForm.rate*0.01 }}</p>
					</FormItem>

				</Form>

				<div slot="footer">
					<Button type="text" @click="cancelDividend">取消</Button>
					<Button type="primary" @click="confirmDividend">确定</Button>
				</div>

				<div class="circleWrapper" v-show="coinTypeLoading">
					<Spin fix>
						<Icon type="load-c" size=30 class="loadingIcon"></Icon>
						<div>获取数据中...</div>
					</Spin>
				</div>
			</Modal>

		</Card>
	</div>
</template>
<script>

import { queryDividend, startDividend, queryDividendFee, getCoinName } from "@/service/getData";

export default {
  name: "RechargeManage",
  data() {
		const validatePass = (rule, value, cb) =>{
			if (value*1>this.dividendRange*1){
				cb(new Error('请填写正确的分红数量！'))
			}
		}
		const validateRate = (rule, value, cb) =>{
			if (value*1>100 || value*1<0){
				cb(new Error('请填写正确的分红比例！'))
			}
		}
		
		return {
			coinSearchArr: [],
			dividendRange: null,
			timePicker: [],
			coinType: false,
			coinTypeLoading: false,
			timeArr: ['', '', '', ''],
			showDividend: false,
			dividendRules: {
				data: [
					{ required: true, type: 'data', message: '请选择日期', trigger: 'blur' }
				],
				time: [
					{ required: true, type: 'string', message: '请选择时间', trigger: 'blur' }
				],
				unit: [
					{ required: true, message: '请选择单位', trigger: 'blur' }
				],
				amount: [
					{ required: true, message: '请输入数量', trigger: 'blur' },
					{ validator: validatePass, trigger: 'blur' },
				],
				rate: [
					{ required: true, message: '请输入比例', trigger: 'blur' },
					{ validator: validateRate, trigger: 'blur' },
				]
			},
			dividendForm: {
				start: '',
				end: '',
				unit: '',
				amount: '',
				rate: '',
			},
			coinNameArr: [],
			filterSearch: {
				pageNo: 1,
				pageSize: 10,
				direction: [],
				property: [],
				unit: ''
			},
      cbData: {},
      ifloading: false,
      currentPageIdx: 1,
      columnsList: [
        {
          title: "#",
          key: "id"
				},
				{
          title: "分红币种",
					key: "unit",
        },
        {
          title: "分红数量",
					key: "amount",
        },
        {
          title: "分红比例",
					key: "rate",
        },
        {
          title: "开始时间",
					key: "startDate",
					sortable: 'custom'
				},
        {
          title: "结束时间",
					key: "endDate",
					sortable: 'custom'
				},
      ]
    };
  },
  methods: {
		optionChange(val) {
			this.coinNameArr.forEach(item => {
				if(item.name === val) { 
					this.dividendRange = item.sum;
					this.dividendForm.amount = item.sum;
				}
			})
		},
		sortChange(obj) {
			let sortType = true;
			let arrIndex = null;
			this.filterSearch.property.forEach((item, index) => {
				if(item===(obj.key==='startDate' ? 'start': 'end')) {
					arrIndex = index;
					sortType = false;
				} 
			})
			if(sortType) {
				this.filterSearch.property.push(obj.key==='startDate' ? 'start': 'end');
				obj.order==='asc' ? this.filterSearch.direction.push(0) : this.filterSearch.direction.push(1);
			} else {
				obj.order==='asc' ? this.filterSearch.direction[arrIndex] = 0 : this.filterSearch.direction[arrIndex] = 1;
			}
			this.refreshPage(this.filterSearch);
		},
		queryTime() {
			this.dividendForm.start = `${this.timeArr[0]} ${this.timeArr[2]}`;
			this.dividendForm.end = `${this.timeArr[1]} ${this.timeArr[3]}`;
			console.log(this.dividendForm);
			let start = this.dividendForm.start.split(' ');
			let end = this.dividendForm.end.split(' ');
			if((!!start[0].length) && (!!start[1].length) && (!!end[0].length) && (!!end[0].length)){
				this.coinTypeLoading = true;
				queryDividendFee({ start: this.dividendForm.start, end: this.dividendForm.end })
				.then(res => {
					if(!res.code) {
						if(!res.data.length) {
							this.coinType = false;
							this.coinTypeLoading = false;
							this.$Message.info('此时间段内无可分红币种！')
						}else{
							this.coinType = true;
							this.coinTypeLoading = false;
						}
						this.coinNameArr = res.data;
					}else this.$Message.error(res.message);
				})
				.catch(err => {console.log(err)})
			}
			
		},
		pickDate(date) {
			this.timeArr[0] = date[0];
			this.timeArr[1] = date[1];
			this.queryTime();
		},
		pickTime(time) {
			this.timePicker = time;
		},
		confirmPickTime(bol) {
			if(!bol) {
				this.timeArr[2] = this.timePicker[0];
				this.timeArr[3] = this.timePicker[1];
				this.queryTime();
			}
		},
		addDividend() {
			this.showDividend = true;
		},
		confirmDividend () {
			let pass = true;
			for(let key in this.dividendForm)  {
				if(!(String(this.dividendForm[key]).trim().length)) { pass = false; break;}
			}
			if( this.dividendRange*1 < this.dividendForm.amount*1 
				|| this.dividendForm.rate*1>100 
				|| this.dividendForm.rate*1<0) return;

			if(!pass) { this.$Message.warning('请完善信息！'); return }
			startDividend(this.dividendForm)
			.then(res => {
				if(!res.code) {
					this.$Message.success(res.message);
				}else this.$Message.error(res.message);
				this.refreshPage();
			})
			.catch(err => {console.log(err)})
			this.showDividend = false;
		},
		cancelDividend () {
			for(let key in this.remitFrom)  {
				this.remitFrom[key] = '';
			}
			this.coinType = false;
			this.coinTypeLoading = false;
			this.showDividend = false;
			this.$Message.info('已取消！');
		},
		searchByFilter() {
			this.currentPageIdx = 1;
      this.refreshPage(this.filterSearch);
    },
    refreshPageManual() {
			for (let key in this.filterSearch) {
        this.filterSearch[key] = "";
      }
      this.refreshPage();
    },
    changePage(pageIndex) {
			this.currentPageIdx = pageIndex;
			this.filterSearch.pageNo = pageIndex;
      this.refreshPage(this.filterSearch);
    },
    refreshPage(obj = {}) {
      this.ifloading = true;
      queryDividend(obj)
        .then(res => {
          if (!res.code) {
            this.cbData = res.data;
          } else this.$Message.error(res.message);
          this.ifloading = false;
        })
        .catch(err => {
          console.log(err);
				});
    }
  },
  created() {
		getCoinName()
		.then(res => {
			if (!res.code) {
				this.coinSearchArr = res.data;
				this.coinSearchArr.push({ name: '全部', unit: '' });
			} else this.$Message.error(res.message);
		})
		.catch(err => {
			console.log(err);
		});
		this.refreshPage();
  }
};
</script>

<style lang="less" scoped>
	.dividendModal{
		position: relative;
		.circleWrapper{
			position: absolute;
			z-index: 10;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, .1);
		}
	}
</style>