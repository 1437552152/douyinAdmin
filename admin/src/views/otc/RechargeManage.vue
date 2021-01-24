<template>
	<div>
		<Card>
			<p slot="title">
				充值管理
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
		</Card>
	</div>
</template>
<script>
import { legalOtcCoin, rechargeOtcCoin, otcCoinDetail, rechargeOtcCoinPass, rechargeOtcCoinNoPass } from "@/service/getData";

export default {
  name: "RechargeManage",
  data() {
    return {
			rechargeStateArr:[
				{ status: 'APPLYING', text: '申请中' },
				{ status: 'COMPLETE', text: '完成' },
				{ status: 'DEFEATED', text: '失败' },
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
          title: "充值数量",
          key: "amount"
        },
        {
          title: "币种名称",
          key: "name",
          render(h, obj) {
            let name = obj.row.coin.name;
            return h("span", {}, name);
          }
        },
        {
          title: "充值时间",
          key: "creationTime",
          width: 105
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
        },
        {
          title: "备注",
          key: "remark"
        },
        {
          title: "状态",
          key: "state"
        },
        {
          title: "操作",
          key: "handle",
          width: 150,
          render: (h, obj) => {
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
                      rechargeOtcCoinPass(obj.row.id)
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
												disabled: obj.row.state !== 'APPLYING'
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
                      rechargeOtcCoinNoPass(obj.row.id)
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
												disabled: obj.row.state !== 'APPLYING'
                      }
                    },
                    "不通过"
                  )
                ]
              )
            ])
          }
        }
      ]
    };
  },
  methods: {
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
      rechargeOtcCoin(obj)
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
</style>
