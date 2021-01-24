<template>
  <div>
    <Card>
      <p slot="title">
        手续费管理
        <Button type="primary" size="small" @click="refreshPageManual">
          <Icon type="refresh"></Icon>
          刷新
        </Button>
      </p>

      <!-- <Row class="functionWrapper">
        <div class="searchWrapper clearfix">
          <Input placeholder="请输入会员名称、会员账号搜索" style="width: 200px"/>
          <Button type="primary" size="small">搜索</Button>
        </div>

        <div class="btnsWrapper clearfix">
          <Button type="info">高级搜索</Button>
          <Button type="success">导出</Button>
        </div>
        
      </Row> -->

      <Row class="tableWrapper">
        <Table :columns="columns_first" :data="userpage" border :loading="ifLoading"></Table>
      </Row>

      <Row class="pageWrapper" >
        <Page :total="pageNum"  :current="current"   @on-change="changePage" show-elevator></Page>
      </Row>
    </Card>
  </div>
</template>

<script>

import { perTradeAll  } from '@/service/getData';

  export default{ 
    data () {
      return {
        currentPageIdx: 1,
        ifLoading: true,
        current: 1,
        pageNum: null,
        userpage: [],
        columns_first: [
					{
            title: '会员名称',
            key: 'memberUsername'
          },
          {
            title: '会员手机号',
            key: 'phone'
          },
         
          {
            title: '交易类型',
						key: 'type',
						render: (h, obj) => {
							let arr = ['充值', '提现', '转账', '币币交易', '法币买入', '法币卖出', '活动奖励', '推广奖励', '分红', '投票', '人工充值', '配对']
							return h ('span', {}, arr[obj.row.type])
						}
          },
          {
            title: '手续费类型',
            key: 'symbol',
          },
          
          {
            title: '交易时间',
            key: 'createTime'
          },
          {
            title: '交易手续费',
            key: 'fee'
          },
        ]
      }
    },
    methods: {
      refreshPageManual() {
        this.refreshPage({ pageNo: this.currentPageIdx, pageSize: 10 })
      },
      changePage(pageIndex) {
        this.currentPageIdx = pageIndex;
        let obj={
          pageNo : pageIndex,
          pageSize: 10
        }
        this.refreshPage( obj );
      },
      refreshPage(obj) {
        this.ifLoading = true;
        perTradeAll(obj)
        .then( res => {
          if(!res.code) {
            this.ifLoading = false;
            this.pageNum = res.data.totalElements;
            this.userpage = res.data.content;
          } else this.$Message.error(res.message);
        } )
      }

    },
    created () {
      this.refreshPage();
    }
  }
</script>

<style lang="less" scoped>

</style>

