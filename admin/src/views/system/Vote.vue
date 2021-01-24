<template>
  <div>
    <Card>
      <p slot="title">
        投票管理
        <Button type="primary" size="small" @click="refreshPageManual">
          <Icon type="refresh"></Icon>
          刷新
        </Button>
      </p>

			<Row class="functionWrapper">
				<div class="btnsWrapper clearfix">
					<Button type="primary" @click="newVote">新增投票</Button>
				</div>
			</Row>

      <Row>
        <Table 
          :columns="columns_first" 
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
          show-elevator>
				</Page>
      </div>
			
			<Modal
				class="voteModal"
				v-model="voteModal"
				title="添加/编辑投票"
				:mask-closable="false"
				>

				<Form :model="voteForm" :label-width="180" :rules="ruleValidate">
					<Row>
						<Col span="19" offset="2">						
							<FormItem label="每人最多投票数目：" prop="voteLimit">
								<Input v-model="voteForm.voteLimit" placeholder="请输入最多投票数目" :precision="0"></Input >
							</FormItem>
						</Col>
					</Row>
					<Row>
						<Col span="19" offset="2">
							<FormItem label="单次投票消耗的平台币数量：" prop="amount">
								<Input  v-model="voteForm.amount" placeholder="请输入每次消耗币数量"></Input >
							</FormItem>
						</Col>
					</Row>

					<Row>
						<Col span="2">
							<FormItem class="formLine resetRequired" label="投票状态：">
								<i-switch v-model="switchStatus">
									<span slot="open">开</span>
									<span slot="close">关</span>
								</i-switch>
							</FormItem>	
						</Col>
					</Row>

					<div class="line"></div>

					<Row>
						<Col span="9">
							<FormItem class="formLine" label="币种名：" prop="name">
								<Input  v-model="currencyName" placeholder="请输入币种名"></Input >
							</FormItem>
						</Col>

						<Col span="9">
							<FormItem class="formLine" label="币种单位：" prop="unit">
								<Input  v-model="currencyUnit" placeholder="请输入币种单位"></Input >
							</FormItem>
						</Col>

						<Col span="2" offset="1" style="line-height: 32px;">
							<Button type="dashed" size="small" @click="addVoteCurrency">
								<i>+ 添加</i>
							</Button>
						</Col>
					</Row>

					<Row>
						<Col span="22">
							<FormItem class="formLine" label="备注：">
									<Input type="textarea"  v-model="remark" 
												:autosize="true"
												placeholder="单个投票币种的备注（选填）"></Input >
							</FormItem>
						</Col>
					</Row>

					<Table  
							:columns="columns_vote"
							:data="voteData"
							no-data-text="<i>请添加将要投票的币</i>"
							size="small"
							:disabled-hover="true"
							:key="Date.now()"
							:stripe="true">
					</Table>
					
				</Form>

				<Row slot="footer" style="padding-bottom: 10px"> 
					<Button type="text" @click="cancelVote">取消</Button>
					<Button type="primary" @click="subVoteInfo">确认</Button>
				</Row>

			</Modal>
				<Modal
					v-model="voteDetailModal"
					title="投票详情">
					<Table :columns="voteDetailCol"
							:data="voteDetailData"
							size="small">
					</Table>
				</Modal>

    </Card>
	</div>
</template>

<script>
import { addVote, queryVote } from "@/service/getData";

export default {
  name: "Vote",
  data() {
		const validatePass = (rule, val, cb) => {
			let reg = /[^0-9]/;
				if (reg.test(val)) {
					cb(new Error('请输入正确的格式'));
				} 
		};
    return {
      voteData: [],
			voteDetailData: [],
			voteDetailCol: [{
          title: "币种名",
          key: "name",
        },
        {
          title: "币种单位",
          key: "unit"
				},
				{
          title: "备注",
					key: "remark"
				}],
			voteDetailModal: false,
      columns_vote: [
        {
          title: "币种名",
					key: "name",
					render: (h, obj) => {
            if (!this.voteData[obj.index].editable) {
              return h("span", {}, obj.row.name);
            } else {
              return h("Input", {
                props: {
                  size: "small",
                  value: obj.row.name
                },
                style: {
                  width: "70px"
                },
                on: {
                  input: val => {
                    obj.row.name = val;
                  }
                }
              });
            }
					}
        },
        {
          title: "币种单位",
          key: "unit",
          render: (h, obj) => {
            if (!this.voteData[obj.index].editable) {
              return h("span", {}, obj.row.unit);
            } else {
              return h("Input", {
                props: {
                  size: "small",
                  value: obj.row.unit
                },
                style: {
                  width: "70px"
                },
                on: {
                  input: val => {
                    obj.row.unit = val;
                  }
                }
              });
            }
          }
				},
				{
          title: "备注",
					key: "remark",
				},
        {
          title: "操作",
          key: "btns",
          render: (h, obj) => {
            if (this.voteData[obj.index].editable) {
							return h("span", {}, [
								h(
									"Button",
									{
										props: {
											type: "success",
											size: "small"
										},
										style: {
											marginRight: "5px"
										},
										on: {
											click: () => {
												let object = {
													name: obj.row.name,
													unit: obj.row.unit,
													editable: !this.voteData[obj.index].editable
												}
												this.voteData.splice(obj.index, 1, object);
											}
										}
									},
									'保存'
								),
								h(
									"Button",
									{
										props: {
											type: "error",
											size: "small"
										},
										on: {
											click: () => {
												this.voteData.splice(obj.index, 1);
											}
										}
									},
									"删除"
								)
							]);
						} else {
							return h("span", {}, [
								h(
									"Button",
									{
										props: {
											type: 'info',
											size: "small"
										},
										style: {
											marginRight: "5px"
										},
										on: {
											click: () => {
												let object = {
													name: obj.row.name,
													unit: obj.row.unit,
													editable: !this.voteData[obj.index].editable
												}
												this.voteData.splice(obj.index, 1, object);
											}
										}
									},
									'编辑'
								),
								h(
									"Button",
									{
										props: {
											type: "error",
											size: "small"
										},
										on: {
											click: () => {
												this.voteData.splice(obj.index, 1);
											}
										}
									},
									"删除"
								)
							]);
						}
					}
				}
			],
      ruleValidate: {
        voteLimit: [
					{ required: true, message: "请输入每人最多投票数目", trigger: "blur" },
					{ validator: validatePass, trigger: 'blur' }
        ],
        amount: [
					{ required: true, message: "请输入每次消耗币数量", trigger: "blur" },
					// { validator: validatePass, trigger: 'blur' }
				],
      },
      currencyName: "",
			currencyUnit: "",
			remark: '',
			switchStatus: false,
      voteForm: {
        voteLimit: "",
        amount: "",
				preCoins: [],
				status: 1
      },
      voteModal: false,
      currentPageIdx: 1,
      ifLoading: true,
      totalNum: null,
      columns_first: [
        {
          title: "ID",
          key: "id"
        },
				{
					title: "创建时间",
					key: "createTime"
				},
        {
          title: "每人最多投票数",
          key: "voteLimit"
        },
        {
          title: "投票状态",
					key: "status",
					render: (h, obj) => {
						let color = '';
						if(!!obj.row.status) color = 'green';
						else color = 'red';

						return h('tag', {
							props: {
								type: "dot",
								color: color
							}
						}, !!obj.row.status ? '开' : '关')
					}
        },
        {
          title: "单次投票消耗平台币数量",
          key: "amount"
        },
        {
          title: "参与投票的币种数",
					key: "preCoins",
					render: (h, obj) => {
						return h('div',{
						},[ 
							h('Tag',{
								style: { 
									'marginRight': '5px'
								}
							},obj.row.preCoins.length),
							h('Button',{
								props: {
									type: 'text',
									size: 'small'
								},
								style: {
									'textDecoration': 'underline',
									'color': '#2b85e4',
								},
								on: {
									click: () => {
										this.voteDetailData = obj.row.preCoins;
										this.voteDetailModal = true;
									}
								}
							},'详情'),
						])
					}
				},
				{
          title: "操作",
					key: "amount",
					render: (h, obj) => {
						return h('Button',{
							props: {
								size: 'small',
								type: 'info'
							},
							on: {
								click: () => {
									this.voteForm.id = obj.row.id;
									this.voteForm.createTime = obj.row.createTime;
									this.voteForm.voteLimit = obj.row.voteLimit;
									this.voteForm.amount = obj.row.amount;
									this.switchStatus = (!!obj.row.status ? true : false);
									this.voteData = obj.row.preCoins;
									this.voteData.forEach(item => {
										item.editable = false;
										item.voteId = obj.row.id;
									})
									this.voteModal = true;
								}
							}
						},'查看 / 编辑')
					}
        },
			],
      userpage: []
    };
  },
  methods: {
		setRender(h, obj, innerObj) {
			return h("span", {}, [
				h(
					"Button",
					{
						props: {
							type: innerObj.type,
							size: "small"
						},
						style: {
							marginRight: "5px"
						},
						on: {
							click: () => {
								let object = {
									name: obj.row.name,
									unit: obj.row.unit,
									editable: !this.voteData[obj.index].editable
								}
								this.voteData.splice(obj.index, 1, object);
							}
						}
					},
					innerObj.text
				),
				h(
					"Button",
					{
						props: {
							type: "error",
							size: "small"
						},
						on: {
							click: () => {
								this.voteData.splice(obj.index, 1);
							}
						}
					},
					"删除"
				)
			]);
		},
		newVote() {
			this.cancelVote();
			this.voteModal = true;
		},
    addVoteCurrency() {
      let name = this.currencyName;
			let unit = this.currencyUnit;
			let nameArr = [];
			let unitArr = [];
			let bol = false;
			this.voteData.forEach(item => {
				if(item.name === name || item.unit === unit) {
					bol = true;
				}
			})
			
			if(bol) {
				this.$Message.warning('币种名或币种单位不能重复！');
				return;
			}

      if (!(name.trim() === "" || unit.trim() === "")) {
				// this.switchable.push(false);
        let obj = { name: name, unit: unit, remark: this.remark, editable: false };
        this.voteData.push(obj);
        this.currencyName = this.currencyUnit = this.remark = "";
      }
    },
    cancelVote() {
      for (let val in this.voteForm) {
        this.voteForm[val] = "";
			}
			this.switchStatus = false;
			this.currencyName = this.currencyUnit = "";
      this.voteData = [];
      this.voteModal = false;
    },
    subVoteInfo() {
      if (
        !this.voteData.length ||
        String(this.voteForm.voteLimit).trim() === "" ||
        String(this.voteForm.amount).trim() === ""
      ) {
        this.voteModal = true;
        this.$Message.warning("请完善信息！");
      } else {
				let status = 0;
				this.switchStatus ? status = 1 : status = 0;
				this.voteForm.preCoins = this.voteData;
				this.voteForm.status = status;

        addVote(this.voteForm, {
          headers: { "Content-Type": "application/json" }
        })
				.then(res => {
					if (!res.code) {
						this.$Message.success(res.message);
						this.cancelVote();
						this.refreshPageManual();
					} else this.$Message.error(res.message);
				})
				.catch(err => console.log(err));
      }
    },
    refreshPageManual() {
      this.currentPageIdx = 1;
      this.refreshPage({ pageNo: 1, pageSize: 10 });
    },

    refreshPage(obj = {}) {
      this.ifLoading = true;
			queryVote(obj)
			.then(res => {
        if (!res.code) {
          this.ifLoading = false;
          this.userpage = res.data.content;
          this.totalNum = res.data.totalElements;
        } else this.$Message. error(res.message);
			})
			.catch(err => console.log(err))
    },
    changePage(pageIndex) {
      this.currentPageIdx = pageIndex;
      this.ifLoading = true;
      let subObj = { pageNo: pageIndex, pageSize: 10 };
      Object.assign(subObj, this.filterSearch);
      this.refreshPage(subObj);
    }
  },
  created() {
    this.refreshPage();
  }
};
</script>

<style scoped lang='less'>
	.line{
		margin: -10px 0 15px;
		border-top: 1px dashed #ccc;
	}

</style>