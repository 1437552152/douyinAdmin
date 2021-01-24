<template>
	<div>
    <Card>
      <p slot="title">
        VIP审核
        <Button type="primary" size="small" @click="refreshPageManual">
          <Icon type="refresh"></Icon>
          刷新
        </Button>
      </p>
      <Row class="functionWrapper">
        <div class="searchWrapper clearfix">
          <div class="poptip">
            <Poptip trigger="hover" content="请输入手机号、真实姓名或会员名称搜索" placement="bottom-start">
              <Input placeholder="请输入手机号、真实姓名或会员名称搜索" 
                    v-model="filterSearch.account"/> 
              </Input>      
            </Poptip>
          </div>

					<div class="poptip">
						<span>vip状态：</span>
						<Select v-model="filterSearch.vipApplyStatus">
							<Option v-for="item in checkStatus" 
										:value="item.value" 
										:key="item.value">{{ item.name }}
							</Option>
						</Select>
					</div>
					
					<div class="btns">
            <Button type="info" size="small" @click="searchByFilter">搜索</Button>
          </div>
        </div>
      </Row>

      <Row>
				<Table 
					:columns="columns_first" 
					:data="userpage" 
					border 
					:loading="ifLoading"
					@on-sort-change="definedOrder"
					class='user_center'>
				</Table>
      </Row>

      <Row class="pageWrapper" >
        <Page :total="totalNum" 
              :current="currentPageIdx"   
              @on-change="changePage" 
              show-elevator>
				</Page>			
      </Row>
    </Card>
  </div>
</template>

<script>

import { setStore, getStore, removeStore } from '@/config/storage';
import { vipApplyStatus, vipApply, memberManage, businessAudit, publishAdvOtc, vipApplyDetail  } from '@/service/getData';
import Cookies from 'js-cookie';

export default {
    data () {
        return {
            sortObj: {},
            checkStatus: [],
            filterSearch: {
                pageNo:1,
                pageSize:10,
                account: '',
                vipApplyStatus: '',
            },
            currentPageIdx: 1,
            searchInner: null,
            totalNum: null,
            ifLoading: true,
            usemmuber:'',
            loading:true,
            columns_first: [
                {
                    title: '会员昵称',
                    key: 'username',
                    render: (h, ctx) => {
                        return h('span',{},ctx.row.member.username)
                    }
                },
                {
                    title: '邮箱',
                    key: 'email',
                    render: (h, ctx) => {
                        return h('span',{},ctx.row.member.email)
                    }
                },
                {
                    title: '真实姓名',
                    key: 'realName',
                    render: (h, ctx) => {
                        return h('span',{},ctx.row.member.realName)
                    }
                },
                {
                    title: '手机号',
                    key: 'mobilePhone',
                    render: (h, ctx) => {
                        return h('span',{},ctx.row.member.mobilePhone)
                    }
                },
                {
                    title: '会员等级',
                    key: 'memberLevel',
                    width:160,
                    render: (h, obj) => {
                        let memberLevel = obj.row.member.memberLevel;
                        let memberLevelTxt = null;
                        if(obj.row.member.vipStatus === 2){
                            memberLevelTxt = obj.row.member.vipGrade.name
                        }else{
                            if (!memberLevel) memberLevelTxt = '普通会员'
                            else if (memberLevel===1) memberLevelTxt = '实名'
                            else if (memberLevel===2) memberLevelTxt = '认证'
                        }
                        return h('span',{
                        }, memberLevelTxt)
                        
                    }
                },
                {
                    title: '审核时间',
                    key: 'auditingTime',
                    // width: 105,
                    sortable: 'custom'
                },
                {
                    title: '申请时间',
                    key: 'createTime',
                    // width: 105,
                    sortable: 'custom'
                },
                {
                    title: '审核状态',
                    // key: 'status',
                    render: (h, obj) => {
                        let  userStatus = obj.row.vipApplyStatus;
                        let statusTxt = null;
                        if (userStatus === 0)  statusTxt = '待审核'
                        else if (userStatus === 1)  statusTxt = '失败'
                        else if (userStatus === 2)  statusTxt = '成功'
                        else if (userStatus === 3)  statusTxt = '过期'

                        return h('span', {
                        },statusTxt);
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 180,
                    align: 'center',
                    render: (h, obj) => {
                        let vipStatus = obj.row.member.vipStatus; // 申请状态，0待审核，1失败，2成功，3过期
                        let statusTxt = null;
                        let type = 'text';
                        if (vipStatus !== 0) {
                            return	h('div', {}, [
                                h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.$router.push({path: '/recommend/VipAuditDetail', query: {id: obj.row.id}});
                                        }
                                    }
                                }, '查看')
                            ])
                        } else {
                            statusTxt = '待审核';
                            type = 'info';
                            return h('div', {}, [
                                h('Button', {
                                    props: {
                                        type: type,
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.$store.commit('switchBusinessMask', true);
                                            vipApplyDetail({id:obj.row.id})
                                            .then(res => {
                                                if(!res.code) {
                                                    this.$store.commit('businessCheckInfo', res.data)
                                                }else this.$Message.error(res.message);
                                            })
                                        }
                                    }
                                }, statusTxt)
                            ])
                        }
                    }
                }
            ],
            userpage: []
        }
  },
  methods: {
		init(){
			vipApplyStatus()
			.then( res => {
				if (!res.code) {
				this.checkStatus = res.data;
				this.checkStatus.push({ value: '', name: '全部' },);
				}else this.$Message.error(res.message);
			})
			this.refreshPage(this.filterSearch);
		},
		definedOrder(obj) {
			this.currentPageIdx = 1;
			let orderNum = '';
			obj.order==='desc' ? orderNum = 1 : orderNum = 0;
			this.sortObj = { direction: [orderNum], property: [obj.key] };
			let sortSubObj = Object.assign({}, this.filterSearch, this.sortObj);
			this.refreshPage(sortSubObj);
			
		},
		searchByFilter() {
			let searchObj = Object.assign({}, this.filterSearch, this.sortObj);
            this.refreshPage(searchObj);
		},
        refreshPageManual(){
            this.currentPageIdx = 1;
            for(let key in this.filterSearch) {
                this.filterSearch[key] = '';
            }
            this.refreshPage({ pageNo: 1, pageSize: 10 });
        },
        changePage(pageIndex) {
            this.currentPageIdx = pageIndex;
            let searchObj = Object.assign(this.filterSearch, { pageNo: pageIndex	, pageSize: 10 });
            this.refreshPage(searchObj);
        },
        refreshPage(obj) {
            this.ifLoading = true;
            vipApply(obj)
            .then( res => {
                if (!res.code) {
                this.ifLoading = false;
                let formatArr = [];
                this.userpage = res.data.content;
                this.totalNum = res.data.totalElements;
                }
            })
        },
	},
	beforeRouteEnter (to, from, next) {
		if(to.query.from === 'bell') {
			Cookies.set('ifFromHome', true)
		}
		next();
	},
  created() {
		this.init()
	},
	computed: {
		date() {
			return this.$store.state.user.date;
		}
	},
  watch: {
		date(newVal, oldVal) {
			this.filterSearch.pageNo = this.currentPageIdx;
      this.refreshPage(this.filterSearch);
		}
  }
}
</script>

<style lang="less" scoped>
  
</style>