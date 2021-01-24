<template>
	<div>
        <Card>
            <p slot="title">
                渠道详情
                <!-- <Button type="primary" size="small" @click="refreshPageManual">
                <Icon type="refresh"></Icon>刷新
                </Button> -->
            </p>
            

            <Row class="margin-top-10 searchable-table-con1">
                <Table  :columns="columns_first" :data="userpage"  border  ref="tabel" class='user_center' >
                </Table>
            </Row>

            <Row class="pageWrapper" >
                <Page :total="totalNum" style='margin-top:8px' :current="currentPageIdx" :page-size='pageSize'   @on-change="changePage" show-elevator></Page>
            </Row>
        </Card>
        

  </div>
</template>

<script>

    import { setStore, getStore, removeStore } from '@/config/storage';
    import {channelList,channelSetUp,channelRevoke,channelDetail} from '@/service/getData';

    export default {
    data () {
        return {
            currentPageIdx: 1,
            phone:'',
            channelModal:false,
            memberStatusArr: [
                { status: 0, text: '正常' },
                { status: 1, text: '非法' },
                { status: '', text: '全部' },
            ],
            totalNum: null,
            ifLoading: true,
            usemmuber:'',
            pageIndex:1,
            loading:true,
            columns_first: [
                {
                    title: '类型',
                    key: 'type',
                    render: (h, ctx) => {
						return h('span', {}, '渠道奖励' )
					}
                },
                {
                    title: '时间',
                    width: 100,
                    key: 'createTime'
                },
            
            
                {
                    title: '数量',
                    key: 'amount'
                },
                {
                    title: '币种',
                    key: 'symbol'
                },
            
            
            ],
            userpage: [],
            pageSize:10,
        }
    },
    methods: {
        refreshPageManual(){

            this.refreshPage(1);
            this.currentPageIdx=1;
        },
        refreshPage(index) {
            // this.ifLoading = true;

            channelDetail({pageNo:index,pageSize:this.pageSize,memberId:this.$route.query.id})
            // channelDetail({pageNo:index,pageSize:this.pageSize,memberId:133})
            .then(
                res=>{
                    this.userpage = res.data.content;
                    this.totalNum = res.data.totalElements;
                }
            )
        },
        changePage(pageIndex) {
            this.currentPageIdx = pageIndex;
            this.refreshPage(pageIndex);
        },
    
    },
    created() {
        this.refreshPage(1);
    },
}
</script>

<style lang="less" scoped>

    .channelInput{
        width:400px;
        margin-right:10px;
    }

    .search-mask{
        position: absolute;
        z-index: 8888;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .2);
    }
</style>