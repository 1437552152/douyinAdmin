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
				<div class="searchWrapper clearfix">

					<div class="poptip">
						<Poptip trigger="hover" 
										content="请输用户名搜索" 
										placement="bottom-start">
							<Input placeholder="请输用户名搜索" 
										v-model="filterSearch.username"/> 
							</Input>      
						</Poptip>
					</div>

					<div class="poptip">
						<span>状态：</span>
						<Select v-model="filterSearch.status">
							<Option v-for="item in rechargeStateArr" 
										:value="item.status" 
										:key="item.status">{{ item.text }}</Option>
						</Select>
					</div>

					<div class="poptip">
						<span>币种名称：</span>
						<Select v-model="filterSearch.coinName">
							<Option v-for="item in rechargeNameArr" 
										:value="item" 
										:key="item">{{ item }}</Option>
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

			<Modal v-model="showPicture"
						class="modalPic"
						title="充值凭证">
				<div>
					<img :src="imgSrc" alt="充值凭证">
				</div>
				<div slot="footer">
					<Button type="primary" size="large" long @click="showPicture = false">关闭</Button>
				</div>
			</Modal>

			<Modal v-model="showRemit"
						class="certificateModal"
						width="450"
						@on-ok="confirmRemit"
						@on-cancel="cancelRemit"
						:mask-closable="false"
						title="上传打款凭证">
				<Form :model="remitFrom">
					<FormItem label="凭证：" v-if="!!remitFrom.paymentInstrument.length">
						<img :src="remitFrom.paymentInstrument" alt="打款凭证">
					</FormItem>
					<FormItem>
						<Upload :action="basicUrl+'admin/common/upload/oss/image'"
										:on-success = 'uploadSuccessed'
										:on-error = "uploadFailed"
										:on-progress = "uploading"
										:show-upload-list = "false">
							<Button type="ghost" icon="ios-cloud-upload-outline">上传打款凭证</Button>
						</Upload>


					</FormItem>

				</Form>
		
				<div class="circleWrapper" v-show="!!uploadPercent">
          <i-circle :percent="uploadPercent" :size="60" :stroke-width="10">
            <span class="demo-Circle-inner" style="font-size:12px">{{ !uploadPercent ? 0 : uploadPercent.toFixed(2) }}%</span>
          </i-circle>
        </div>
			</Modal>

		</Card>
	</div>
</template>
<script>

import { withdrawOtcCoin,	withdrawOtcCoinDetail, withdrawOtcCoinPass,	withdrawOtcCoinNoPass, withdrawOtcCoinRemit, legalOtcCoin, BASICURL } from "@/service/getData";

export default {
  name: "RechargeManage",
  data() {
    return {
			uploadPercent: null,
			basicUrl: BASICURL,
			remitFrom: {
				id: '',
				paymentInstrument: '',
			},
			showRemit: false,
			rechargeStateArr:[
				{ status: 0, text: '审核中' },
				{ status: 1, text: '待打款' },
				{ status: 2, text: '失败' },
				{ status: 3, text: '成功' },
				{ status: '', text: '全部' }
			],
			rechargeNameArr: [],
      showPicture: false,
      imgSrc: "",
			filterSearch: {
				username: '',
				status: '',
				coinName: ''
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
          title: "提现数量",
					key: "amount",
					width: 85
        },
        {
          title: "币种名称",
					key: "name",
					width: 85,
          render(h, obj) {
            let name = obj.row.coin.name;
            return h("span", {}, name);
          }
        },
        {
          title: "创建时间",
          key: "createTime",
          width: 105
				},
				{
          title: "处理时间",
          key: "dealTime",
					width: 105,
					render(h, obj) {
						let dealTime = obj.row.dealTime;
						if(!dealTime) dealTime = '--';
            return h("span", {}, dealTime);
          }
				},
				{
          title: "打款时间",
          key: "remitTime",
					width: 105,
					render(h, obj) {
						let remitTime = obj.row.remitTime;
						if(!remitTime) remitTime = '--';
            return h("span", {}, remitTime);
          }
        },
        {
          title: "用户名",
          key: "username",
          render: (h, obj) => {
            let name = obj.row.member.username;
            return h("span", {}, name);
          }
        },
        {
          title: "支付方式",
					key: "payMode",
					width: 85,
					render: (h, obj) => {
						let arr = ['支付宝', '微信', '银联'];
            return h("span", {}, arr[obj.row.payMode]);
          }
        },
        {
          title: "支付凭证",
          key: "paymentInstrument",
          width: 85,
          render: (h, obj) => {
						let imgSrc = obj.row.paymentInstrument;
						if(!imgSrc) {
							return h("span",{},'--')
						}else{
							return h("img", {
								style: {
									margin: "5px",
									cursor: "pointer"
								},
								attrs: {
									src: imgSrc,
									width: "50px",
									height: "50px"
								},
								on: {
									click: () => {
										this.imgSrc = imgSrc;
										this.showPicture = true;
									}
								}
							});
						}
          }
        },
        {
          title: "备注",
          key: "remark"
        },
        {
          title: "状态",
					key: "status",
					render: (h, obj) => {
						let arr = ['审核中', '待打款', '失败', '成功' ];
            return h('span', {
            },arr[obj.row.status]);
          }
        },
        {
          title: "操作",
          key: "handle",
          width: 150,
          render: (h, obj) => {
						obj.row.status===1
						if(!obj.row.status) {
							return h("div", [
								h(
									"Poptip",
									{
										props: {
											trigger: "click",
											confirm: true,
											transfer: true,
											title: "是否审核通过?"
										},
										on: {
											"on-ok": () => {
												withdrawOtcCoinPass(obj.row.id)
													.then(res => {
														if (!res.code) {
															let obj = Object.assign(this.filterSearch, { pageNo: this.currentPageIdx, pageSize: 10 });
															this.refreshPage(obj);
															this.$Message.success(res.message);
														} else this.$Message.error(res.message);
													})
													.catch(err => console.log(err));
											},
											"on-cancel": () => {
												this.$Message.info("已取消");
											}
										}
									},
									[
										h(
											"Button",
											{
												props: {
													type: "primary",
													size: "small",
													// disabled: !!obj.row.status
												},
												style: {
													marginRight: "5px"
												}
											},
											"通过"
										)
									]
								),
								 h(
									"Poptip",
									{
										props: {
											trigger: "click",
											confirm: true,
											transfer: true,
											title: "是否审核不通过?"
										},
										on: {
											"on-ok": () => {
												withdrawOtcCoinNoPass(obj.row.id)
													.then(res => {
														if (!res.code) {
															let obj = Object.assign(this.filterSearch, { pageNo: this.currentPageIdx, pageSize: 10 });
															this.refreshPage(obj);
															this.$Message.success(res.message);
														} else this.$Message.error(res.message);
													})
													.catch(err => console.log(err));
											},
											"on-cancel": () => {
												this.$Message.info("已取消");
											}
										}
									},
									[
										h(
											"Button",
											{
												props: {
													type: "error",
													size: "small",
												}
											},
											"不通过"
										)
									]
								)
							])
						}else if(obj.row.status===1) {
							return h("Button",{
									props: {
										type: 'info',
										size: 'small'
									},
									on: {
										click: () => {
											this.showRemit = true;
											this.remitFrom.id = obj.row.id;
											
										}
									}
							},'打款')
						} else {
							let type = 'success';
							let status = '成功';
							if(obj.row.status===2) {
								type = 'error';
								status = '失败';
							}
							return h("Button",{
									props: {
										type: type,
										size: 'small'
									}
							},status)
						}
          }
        }
      ]
    };
  },
  methods: {
		confirmRemit () {
			console.log(this.remitFrom);
			if(this.remitFrom.paymentInstrument === '') {
				this.$Message.warning('请上传打款凭证！');
				return;
			}
			let id = this.remitFrom.id;
			let data = this.remitFrom.paymentInstrument;
			withdrawOtcCoinRemit(id, {paymentInstrument: data})
			.then(res => {
				if(!res.code) {
					this.$Message.success(res.message);
					this.changePage();
				}else this.$Message.error(res.message)
				for(let key in this.remitFrom)  {
					this.remitFrom[key] = '';
				}
			})
			.catch(err => { console.log(err)})

		},
		cancelRemit () {
			for(let key in this.remitFrom)  {
				this.remitFrom[key] = '';
			}
			this.$Message.info('已取消！');
		},
		uploadSuccessed(response, file, fileList) {
			this.remitFrom.paymentInstrument = response.data;
			this.$Message.success('上传成功！');
			this.uploadPercent = null;
		},
		uploadFailed(error, file, fileList) {
			this.$Message.error(error);
			this.uploadPercent = null;
		},
		uploading(event, file, fileList){
			this.uploadPercent = event.percent;
		},
		searchByFilter() {
			this.currentPageIdx = 1;
			let obj = Object.assign(this.filterSearch, { pageNo: 1, pageSize: 10 });
			for( let key in obj) {
				if(obj[key]==='全部') {
					obj[key] = ''; 
					break;
				}
			}
      this.refreshPage(obj);
    },
    refreshPageManual() {
			for (let key in this.filterSearch) {
        this.filterSearch[key] = "";
      }
      this.refreshPage();
    },
    changePage(pageIndex) {
      this.currentPageIdx = pageIndex;
      let obj = Object.assign(this.filterSearch, {
        pageNo: pageIndex,
        pageSize: 10
			});
			for( let key in obj) {
				if(obj[key]==='全部') {
					obj[key] = ''; 
					break;
				}
			}
      this.refreshPage(obj);
    },
    refreshPage(obj = {}) {
      this.ifloading = true;
      withdrawOtcCoin(obj)
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
		this.refreshPage();
		legalOtcCoin()
		.then(res => {
			if(!res.code) {
				this.rechargeNameArr = res.data;
				this.rechargeNameArr.push('全部');
			}else this.$Message.error(res.message)
		})
		.catch(err => console.log(err))
  }
};
</script>

<style lang="less" scoped>
.modalPic {
  img {
    width: 100%;
    height: 400px;
  }
}
.certificateModal{
	position: relative;
	.circleWrapper{
    position: absolute;
    z-index: 10;
    top: 0;
    left: 0;
    width: 100%;
		height: 100%;
		
		background-color: rgba(0, 0, 0, .1);
		.ivu-chart-circle{
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
	}
	img{
		width: 50px;
		height: 50px;
	}
}
</style>

