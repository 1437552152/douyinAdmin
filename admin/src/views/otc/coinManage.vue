<style lang="less" scoped>
	.self{
		width: 45%;
		display: inline-block;
		&:nth-child(2n){
			margin: 0 0 0 3%;
		}
	}
</style>

<template>
	<div>
		<Card>
			<p slot="title">
				币种管理
				<Button type="primary" size="small" @click="refreshPageManual">
					<Icon type="refresh"></Icon> 刷新
				</Button>
			</p>

			<Row class="functionWrapper">
				<div class="btnsWrapper clearfix">
					<Button type="error" @click="delCoin">删除</Button>
					<Button type="info" @click="addCoin">添加</Button>
				</div>
			</Row>

			<Row>
				<Table :loading="ifloading" 
								:columns="columnsList" 
								:data="cbData.content"
								@on-selection-change="selectionChange"
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

			<Modal v-model="showEditModal" 
						:mask-closable='false'
						:width="600"
						@on-ok="saveEditPass"
						@on-cancel="cancelEdit"
						title="编辑币种">
				<Form :model="coinInformation" 
							:rules="ruleValidate" 
							:label-width="100" 
							label-position="right">
					<FormItem label="币种编号：" prop="id" v-show="false">
						<Input v-model="coinInformation.id" ></Input>
					</FormItem>
					<FormItem v-show="!nameCnStatus" label="币种名称：" prop="nameCn">
                        <Select v-model="coinInformation.nameCn" placeholder='比特币' @on-change="selectFunc">
                            <Option v-for="(item ,index) in allCoin" :key="index" :value="item.nameCn">{{ item.nameCn }}</Option>
                        </Select>
                    </FormItem>
					<!-- <FormItem label="币种名称：" prop="nameCn">
						<Input v-model="coinInformation.nameCn"></Input>
					</FormItem> -->
					<FormItem label="英文名称：" prop="name">
						<Input disabled v-model="coinInformation.name"></Input>
					</FormItem>
					<FormItem label="货币单位：" prop="unit">
						<Input disabled v-model="coinInformation.unit"></Input>
					</FormItem>
					<FormItem class="self" label="币种精度：" prop="coinScale">
						<InputNumber v-model="coinInformation.coinScale" style="width:100%" placeholder="请输入小于8的数字"></InputNumber>
					</FormItem>
					<FormItem class="self" label="最大挂单时间：" prop="maxTradingTime">
						<Input v-model="coinInformation.maxTradingTime">
							<span slot="append">小时</span>
						</Input>
					</FormItem>
					<FormItem class="self" label="最大挂单数量：" prop="maxVolume">
						<Input v-model="coinInformation.maxVolume"></Input>
					</FormItem>
					<FormItem class="self" label="交易手续费率（%）：" prop="jyRate">
						<Input v-model="coinInformation.jyRate"></Input>
					</FormItem>
					<FormItem class="self" label="卖出广告最低发布数量：" prop="sellMinAmount">
						<Input v-model="coinInformation.sellMinAmount"></Input>
					</FormItem>
					<FormItem class="self" label="买入广告最低发布数量：" prop="buyMinAmount">
						<Input v-model="coinInformation.buyMinAmount"></Input>
					</FormItem>
                    <FormItem label="币种图标:" class='coinImg' v-show = "ShowCoinImg">
                        <img :src="imgUrl" alt="币种图标"  v-if="add">
                        <img :src="coinInformation.imgUrl" alt="币种图标"  v-else>
                    </FormItem>
					<FormItem label="状态：" prop="status">
						<i-switch v-model="switchStatus" size="large">
						  <span slot="open">正常</span>
							<span slot="close">失效</span>
						</i-switch>
					</FormItem>
				</Form>
			</Modal>
		</Card>
	</div>
</template>
<script>

import { getAllCoin, queryOtcCoin, addOtcCoin, setPlatformCoin,updateOtcCoin, delOtcCoin,BASICURL } from "@/service/getData";

export default {
  name: "CoinManage",
  data() {
		const valideCoinScale = (rule, value, callback) => {
            if (value > 8) {
                    callback(new Error('请输入小于8的数字'));
            } else {
                    callback();
            }
		};
    return {
        add:false,
        imgUrl:"",
        basicUrl: BASICURL,
        ShowCoinImg:false,
        selectArr: [],
        nameCnStatus: false,
        createOrUpdate: true,
        cbData: {},
        allCoin: [], // 所有币种数据
        ifloading: false,
        currentPageIdx: 1,
        showEditModal: false,
        switchStatus: true,
        coinInformation: {
            id: null,
            nameCn: '比特币',
            name: 'BTC',
            unit: 'BTC',
            jyRate: 1,
            coinScale: 4,
            sellMinAmount: 1,
            buyMinAmount: 1,
            maxTradingTime: 168,
            maxVolume: 1,
            status: 0,
            imgUrl:""
        },
        ruleValidate: {
            coinScale: [
                {required: true, message: '币种精度不能为空', trigger: 'blur'},
                { validator: valideCoinScale, trigger: 'change'}
            ],
            maxTradingTime: [
                {required: true, message: '最大挂单时间不能为空', trigger: 'blur'}
            ],
            maxVolume: [
                { required: true, message: '最大挂单数量不能为空', trigger: 'blur' }
            ],
            nameCn: [
                { required: true }
            ],
            name: [
            { required: true, message: '英文名称不能为空',trigger: 'blur' }
            ],
            unit: [
            { required: true, message: '货币单位不能为空',trigger: 'blur'}
            ],
            jyRate: [
            { required: true, message: '交易手续费率不能为空',trigger: 'blur'}
            ],
            sellMinAmount: [
            { required: true, message: '卖出广告最低发布数量不能为空',trigger: 'blur' }
            ],
            buyMinAmount: [
            { required: true,message: '买入广告最低发布数量不能为空',trigger: 'blur'}
            ],
            status: [
            { required: true, message: '状态不能为空', trigger: 'blur' }
            ]
        },
        columnsList: [
            {
            type: "selection",
            width: 60,
            },
            {
            title: "币种编号",
            key: "id"
            },
            {
            title: "币种名称",
            key: "nameCn"
            },
            {
            title: "英文名称",
            key: "name"
            },
            {
                title: "币种图标",
                key: "imgUrl",
                render: (h, obj) => {
                    if(obj.row.imgUrl != ''){
                            return h("img", {
                                attrs: {
                                    src:obj.row.imgUrl
                                },
                                style: {
                                    display: "inline-block",
                                    width: "43px",
                                    height: "43px",
                                    verticalAlign: "middle",
                                    borderRadius:"50%",
                                    marginRight: "5px"
                                }
                            }, '');
                    }
                }
            },
            {
            title: "货币单位",
            key: "unit"
            },
            {
            title: "交易手续费率",
            key: "jyRate",
            render(h, params) {
                const row = params.row;
                return h("span", {}, row.jyRate + "%");
            }
            },
            {
            title: "卖出广告最低发布数量",
            width: 180,
            key: "sellMinAmount"
            },
            {
            title: "买入广告最低发布数量",
            width: 180,
            key: "buyMinAmount"
            },
            {
            title: "状态",
            key: "status",
            render(h, params) {
                const row = params.row;
                return h("span", {}, !row.status ? "正常" : "失效");
            }
            },
            {
            title: "操作",
            align: "center",
            key: "handle",
            render: (h, obj) => {
                return h("div", [
                h(
                    "Button",
                    {
                    props: {
                        type: "primary",
                        size: "small"
                    },
                    on: {
                        click: () => {
                            this.nameCnStatus = true;
                            this.showEditModal = true;
                            this.createOrUpdate = false;
                            this.add=false;
                            this.ShowCoinImg = true;
                            for (let val in this.coinInformation) {
                                this.coinInformation[val] = obj.row[val];
                            }
                            for( let i=0 ;i<this.allCoin.length;i++){
                                if(this.allCoin[i].unit == obj.row.unit){
                                    this.coinInformation.imgUrl =  this.allCoin[i].imgUrl
                                }
                                
                            }
                            this.coinInformation.maxTradingTime = this.div(this.coinInformation.maxTradingTime,3600)
                            !obj.row.status ? this.switchStatus = true : this.switchStatus = false;
                        }
                    }
                    }, '修改')
                ])
            }
            }
        ]
    }
  },
  methods: {
		selectionChange(selection) {
			this.selectArr = selection;
		},
		refreshPageManual() {
			this.refreshPage()
		},
    delCoin() {
			let ids = [];
			this.selectArr.forEach(item => {
				ids.push(item.id);
			})
			if(!ids.length) {
				this.$Message.warning('请选择需要删除的项！')
			}else{
				this.$Modal.confirm({
						title: '删除币种',
						content: `<p>是否删除选中的${this.selectArr.length}项</p>`,
						onOk: () => {
							delOtcCoin({ids: ids})
							.then(res => {
								if(!res.code) {
									this.$Message.success(res.message);
								}else this.$Message.error(res.message);
								this.refreshPage();
							})
							.catch(err => console.log(err))
						},
						onCancel: () => {
							this.$Message.info('已取消！');
						}
				});
			}
		},
		/**
		 * 切换币种名称
		 */
		selectFunc (e) {
            this.allCoin.forEach((coin,i)=>{
                if( e === coin.nameCn ){
                    this.coinInformation.name = coin.name
                    this.coinInformation.unit = coin.unit
                    this.ShowCoinImg=false;
                    if(coin.imgUrl != ''){
                        this.ShowCoinImg=true;
                        this.imgUrl = coin.imgUrl
                    }
                    
                }
            })
		},
    changePage(pageIndex) {
			this.currentPageIdx = pageIndex;
			this.refreshPage({ pageNo: pageIndex, pageSize: 10 });
    },
    addCoin() {
			this.nameCnStatus = false;
			this.createOrUpdate = true;
            this.showEditModal = true;
            this.add=true;
            getAllCoin().then(res => {
				this.selectFunc(this.allCoin[0].nameCn)
			})
    },
    cancelEdit() {
			this.coinInformation = Object.assign({}, {
        id: null,
        nameCn: '比特币',
        name: 'BTC',
        unit: 'BTC',
				jyRate: 1,
				coinScale: 4,
        sellMinAmount: 1,
				buyMinAmount: 1,
				maxTradingTime: 168,
				maxVolume: 1,
        status: 0
      })
			this.coinInformation.id = null;
			this.switchStatus = this.coinInformation.status = true;
    },
    saveEditPass() {
			this.coinInformation.status = this.switchStatus ? 0 : 1;
			let subFn = '';
            subFn = this.createOrUpdate ? addOtcCoin : updateOtcCoin;
            this.coinInformation.maxTradingTime =this.mul(this.coinInformation.maxTradingTime,3600);
			subFn(this.coinInformation).then(res => {
				if (!res.code) {
					this.refreshPage();
					this.$Message.success(res.message);
				} else this.$Message.error(res.message);
				this.cancelEdit();
			}).catch(err => {console.log(res.message)	})
    },
	refreshPage(obj = {}) {
      this.ifloading = true;
      queryOtcCoin(obj)
			.then(res => {
				if (!res.code) {
					this.cbData = res.data;
				} else this.$Message.error(res.message);
				this.ifloading = false;
			})
			.catch(err => {
				console.log(err)
			});
			/**
			 * 获取所有币种
			 */
			getAllCoin().then(res => {
				this.allCoin = res.data
			})
    },
     uploadSuccessed(response, file, fileList) {
        if(response.code == 0){
            this.ShowCoinImg = true;
            this.coinInformation.imgUrl = response.data;
            this.$Message.success('上传成功！');

        }else{
            this.$Message.error(response.message);
        }
        
    },
  },
  created() {
		this.refreshPage();
  },
}
</script>