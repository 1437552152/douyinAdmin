<!--
 * @Description: 
 * @version: 
 * @Date: 2019-08-20 00:29:22
 * @LastEditors: yeyifu
 * @LastEditTime: 2019-10-12 19:48:33
 * @Author: yeyifu
 * @LastModifiedBy: yeyifu
 -->
<template>
  <div class="home">
     <Form ref="filterSearch" :model="filterSearch" inline>
        <FormItem prop="username">
            <Input type="text" v-model="filterSearch.username" placeholder="请输入账号与秘钥" clearable>
              <!--   <Icon type="ios-person-outline" slot="prepend"></Icon> -->
            </Input>
        </FormItem>     
        <FormItem>
            <Button type="primary" @click="handleSubmit('filterSearch')">查询</Button>
        </FormItem>
    </Form>
    <Table :columns="columns_first" :data="userpage" border :loading="ifLoading"></Table>
    <div class="pageWrapper">
      <Page :total="totalNum" :current="currentPageIdx" @on-change="changePage" show-elevator></Page>
    </div>

    <Modal
      v-model="rejectModel"
      :width="450"
      title="提示"
      @on-ok="noPass"
      @on-cancel="cancelMemberCheck"
    >
      <div>确定删除该条数据？</div>
    </Modal>

    <Modal
      v-model="reModel"
      :width="450"
      title="备注"
      @on-ok="noPass1"
      @on-cancel="cancelMemberCheck"
    >
     <Input v-model="remark" show-word-limit type="textarea" placeholder="请输入备注。。。" style="width: 400px;height:80px;" />
    </Modal>

  </div>
</template>

<script>
import { getUserDouyinList, deleteUserDouyin, UserDouyinUpdate, updateRemark } from '@/service/getData';
export default {
    data () {
        return {
            delateId: '',
            rejectModel: false,
            reModel: false,
            remark: '',
            columns_first: [
                {
                    title: '帐号',
                    key: 'username'
                },
                {
                    title: '密码',
                    key: 'password'
                },
                /*   {
                    title: 'ip',
                    key: 'ip'
                }, */
                {
                    title: '注册时间',
                    key: 'time'
                },
                {
                    title: '到期时间',
                    key: 'overTime'
                },
                {
                    title: '秘钥',
                    key: 'secretKey'
                },
                {
                    title: '备注',
                    key: 'remark'
                },
                {
                    title: '操作',
                    key: 'opration',
                    width: 180,
                    render: (h, obj) => {
                        // 状态是否启用   0未启用  1开始启用    2已过期    3被禁用
                        let text = '封号';
                        if (obj.row.status == '1') text = '解封';
                        let arr = [
                            h(
                                'Button',
                                {
                                    props: {
                                        type: 'info',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            let objs = {};
                                            objs.user_id = obj.row.user_id;
                                            if (obj.row.status == '0') {
                                                objs.status = '1';
                                            } else {
                                                objs.status = '0';
                                            }
                                            UserDouyinUpdate(objs)
                                                .then(res => {
                                                    if (res.status === '200') {
                                                        this.rejectModel = false;
                                                        this.$Message.success(res.msg);
                                                        let filterSearch = {
                                                            pageNo: 1,
                                                            pageSize: 10,
                                                            username: ''
                                                        };
                                                        this.refreshPage(filterSearch);
                                                    } else this.$Message.error(res.message);
                                                })
                                                .catch(err => console.log(err));
                                        }
                                    }
                                },
                                text
                            )
                        ];
                        arr.push(
                            h(
                                'Button',
                                {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.rejectModel = true;
                                            this.delateId = obj.row.user_id;
                                            this.deletename = obj.row.username;
                                        }
                                    }
                                },
                                '删除'
                            )
                        );
                        arr.push(
                            h(
                                'Button',
                                {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.reModel = true;
                                            this.delateId = obj.row.user_id;
                                            this.remark = obj.row.remark;
                                        }
                                    }
                                },
                                '备注'
                            )
                        );
                        return h('div', {}, arr);
                    }
                }
            ],
            userpage: [],
            filterSearch: {
                pageNo: 1,
                pageSize: 10,
                username: ''
            },
            currentPageIdx: 1,
            ifLoading: true,
            totalNum: null,
            number: 0,
            min: 0
        };
    },
    methods: {
        changePage (pageIndex) {
            this.currentPageIdx = pageIndex;
            this.filterSearch.pageNo = pageIndex;
            this.refreshPage(this.filterSearch);
        },
        handleSubmit (name) {
            this.refreshPage(this.filterSearch);
        },
        refreshPage (obj) {
            this.ifLoading = true;
            getUserDouyinList(obj).then(res => {
                if (!res.code) {
                    this.ifLoading = false;
                    // 状态是否启用   0未启用  1开始启用    2已过期    3被禁用
                    let userpage = res.data.map(v => {
                        v.ctime = this.moment(v.createTime).format('YYYY-MM-DD HH:mm:ss');
                        v.otime = this.moment(v.overTime).format('YYYY-MM-DD HH:mm:ss');
                        if (v.status == 0) {
                            v.Nstatus = '未启用';
                        } else if (v.status == 1) {
                            if (this.moment(v.createTime).format('YYYY-MM-DD HH:mm:ss') <= this.moment(new Date()).format('YYYY-MM-DD HH:mm:ss')) {
                                v.Nstatus = '已过期';
                            } else {
                                v.Nstatus = '启用中';
                            }
                        } else if (v.status == 3) {
                            v.Nstatus = '被禁用';
                        }
                        return v;
                    });
                    this.userpage = userpage;
                    this.totalNum = res.total;
                    this.currentPageIdx = res.currentPage;
                } else this.$Message.error(res.message);
            });
        },
        /*         productSecretid () {
            if (!this.number) {
                this.$Message.error('天数需大于等于1');
                return;
            }
            let uuid = this.uuid();
            let obj = {};
            obj.secretid = uuid;
            obj.canUseTime = this.number;
            this.ifLoading = true;
            productSecretid(obj).then(res => {
                if (!res.code) {
                    this.ifLoading = false;
                    let filterSearch = {
                        pageNo: 1,
                        pageSize: 10,
                        username: ''
                    };
                    this.refreshPage(filterSearch);
                } else this.$Message.error(res.message);
            });
        }, */
        uuid () {
            var s = [];
            var hexDigits = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            for (var i = 0; i < 20; i++) {
                s[i] = hexDigits.substr(
                    Math.floor(Math.random() * hexDigits.length),
                    1
                );
            }
            var uuid = s.join('');
            return uuid;
        },
        deleteUUid () {
            const that = this;
            let obj = {};
            obj.user_id = this.delateId;
            obj.username = this.deletename;
            deleteUserDouyin(obj)
                .then(res => {
                    if (res.status === '200') {
                        this.rejectModel = false;
                        this.$Message.success(res.msg);
                        let filterSearch = {
                            pageNo: 1,
                            pageSize: 10,
                            username: ''
                        };
                        this.refreshPage(filterSearch);
                    } else this.$Message.error(res.message);
                })
                .catch(err => console.log(err));
        },
        updateRemark () {
            let that = this;
            let obj = {};
            obj.user_id = this.delateId;
            obj.remark = this.remark;
            updateRemark(obj)
                .then(res => {
                    if (res.status === 1) {
                        this.reModel = false;
                        this.$Message.success(res.msg);
                        let filterSearch = {
                            pageNo: 1,
                            pageSize: 10,
                            username: ''
                        };
                        this.refreshPage(filterSearch);
                    } else this.$Message.error(res.message);
                })
                .catch(err => console.log(err));
        },

        cancelMemberCheck () {
            this.rejectModel = false;
            this.reModel = false;
        },
        noPass () {
            this.deleteUUid();
        },
        noPass1 () {
            this.updateRemark();
        }
    },
    mounted () {
        this.refreshPage(this.filterSearch);
    }
};
</script>
<style lang="less" scoped>
h5 {
  font-size: 40px;
  color: #2d8cf0;
  text-align: center;
  margin-top: 50px;
}
.chartStyle {
  width: 1000px;
  height: 500px;
  margin: 50px auto;
  margin-top: 100px;
}
</style>
