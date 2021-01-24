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
    <Table 
      :columns="columns_first" 
      border
      :data="userpage">
    </Table>

    <Modal
      v-model="investStatus"
      :width="450"
      title="站内通知"
      @on-ok="ok"
      @on-cancel="cancel">
      <div>
       <Input v-model="content" show-word-limit type="textarea" placeholder="请输入备注。。。" style="width: 400px;height:80px;" />
      </div>
    </Modal>
	</div>
</template>

<script>
import { getNoticeList, updatNoticeStatus, updateNotice } from '@/service/getData';
export default {
    data () {
        return {
            userpage: [],
            investStatus: false,
            content: '',
            id: 0,
            columns_first: [
                {
                    title: '通知',
                    key: 'content'
                },
                {
                    title: '操作',
                    key: 'opration',
                    width: 180,
                    render: (h, obj) => { // 状态是否启用   0未启用  1开始启用    2已过期    3被禁用
                        let arr = [
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
                                            this.investStatus = true;
                                            this.content = obj.row.content;
                                            this.id = obj.row.id;
                                        }
                                    }
                                },
                                '编辑'
                            )
                        ];
                        arr.push(
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
                                            this.updateStataus(obj.row);
                                        }
                                    }
                                },
                                obj.row.status ? '禁用' : '启用'
                            )
                        );
                        return h('div', {}, arr);
                    }
                }
            ]
        };
    },
    methods: {
        ok () {
            this.updateNotice();
        },
        cancel () {

        },
        updateNotice () {
            const that = this;
            let obj = {};
            obj['id'] = this.id;
            obj['content'] = this.content;
            updateNotice(obj).then(res => {
                that.getNoticeList();
                that.investStatus = false;
            });
        },

        getNoticeList () {
            const that = this;
            getNoticeList().then(res => {
                that.userpage = res.data;
            });
        },
        updateStataus (obj) {
            const that = this;
            obj.status = !obj.status;
            updatNoticeStatus(obj).then(res => {
                that.getNoticeList();
            });
        }
    },
    mounted () {
        this.getNoticeList();
    }
};
</script>
<style lang="less" scoped>
.invStyle{
  margin-bottom: 5px;
}
h5 {
  font-size: 40px;
  color: #2d8cf0;
  text-align: center;
  margin-top: 50px;
}
.chartStyle{
	width:1000px;
	height:500px;
	margin: 50px auto;
	margin-top: 100px;
}
</style>
