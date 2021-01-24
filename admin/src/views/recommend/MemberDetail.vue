<template>
  <div>
    <Card>
      <p slot="title">
        推荐详情
        <Button type="primary" size="small" @click="refreshPageManual">
          <Icon type="refresh"></Icon>
          刷新
        </Button>
      </p>
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
          show-elevator></Page>
      </div>
    </Card>
    </div>
</template>

<script>

import { recommendDetail } from '@/service/getData';

export default {
	name: 'MemberDetail',
  data() {
    return {
			filterSearch: {
				memberId: null,
				pageNo: 1,
				pageSize: 10
			},
      currentPageIdx: 1,
      ifLoading: true,
      totalNum: null,
      columns_first: [
				{
					title: '被推荐人昵称',
					key: 'presentee'
        },
        {
					title: '被推荐人邮箱',
					key: 'presenteeEmail'
				},
        {
					title: '被推荐人手机号',
					key: 'presenteePhone'
				},
        {
					title: '推荐时间',
					key: 'promotionTime'
				},
        {
					title: '推荐级数',
					key: 'promotionLevel',
					render: (h, obj) => {
						let text = '';
						if(obj.row.promotionLevel===0) text = '一级';
						if(obj.row.promotionLevel===1) text = '二级';
						return h('span',{},text);;
					}
				},
        // {
		// 			title: '获得奖励',
		// 			key: 'reward',
		// 			render: (h, obj) => {
		// 				return h('span',{},`${obj.row.reward} ${obj.row.unit}`);
		// 			}
					
		// 		},
      ],
			userpage: [],
    };
  },
  methods: {
    refreshPageManual() {
			this.currentPageIdx = 1;
      this.refreshPage({pageNo: 1, pageSize: 10 });
    },
  
    refreshPage(obj) {
			this.ifLoading = true;
      recommendDetail(obj)
      .then(res => {
        if(!res.code){
          this.ifLoading = false;
          this.userpage = res.data.content;
          this.totalNum = res.data.totalElements;
				}else this.$Message.error(res.message);
			});
    },
    changePage(pageIndex) {
			this.currentPageIdx = pageIndex;
      let subObj = { memberId:this.$route.query.memberId, pageNo: pageIndex, pageSize: 10 };
      this.refreshPage(subObj);
    },
  },
  created() {
		this.filterSearch.memberId = this.$route.query.memberId;
		this.refreshPage(this.filterSearch)
  }
}
</script>

<style scoped lang='less'>
 
</style>