<template>
  <div>
    <Card>
      <p slot="title">
        签到记录
        <Button type="primary" size="small" @click="refreshPageManual">
          <Icon type="refresh"></Icon>
          刷新
        </Button>
      </p>

			<Row class="functionWrapper">
        <div class="searchWrapper clearfix">
					
					<!-- <div class="poptip">
						<Poptip trigger="hover" content="请输入用户名搜索" placement="bottom-start">
							<Input placeholder="请输入用户名搜索" 
										v-model="filterSearch.adminName"/> 
							</Input>      
						</Poptip>
					</div> -->

					<!-- <div class="poptip">
						<Select v-model="filterSearch.module" placeholder="请选择...">
							<Option v-for="item in moduleArr" :value="item.status" :key="item.status">{{item.text}}</Option>
						</Select>
					</div> -->
					
					<!-- <div class="btns">
						<Button type="info" size="small" @click="searchByFilter">搜索</Button>
					</div> -->
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
          show-elevator></Page>
      </div>
    </Card>
    </div>
</template>

<script>

import { memberSignQuery } from '@/service/getData';

export default {
	name: 'SignRecord',
  data() {
    return {
			filterSearch: {
				pageNo: 1,
				pageSize: 10,
			},
      currentPageIdx: 1,
      ifLoading: true,
      totalNum: null,
      columns_first: [
				{
					title: "币种",
					key: "coinName"
				},
        {
					title: '数量',
					key: 'amount'
        },
				{
					title: "用户名",
					key: "username"
				},
				{
					title: "真实姓名",
					key: "realName"
				},
				{
          title: "创建时间",
          key: "creationTime"
        },
        {
					title: "手机号",
					key: 'mobilePhone'
        },
      ],
      userpage: [],
    };
  },
  methods: {
		searchByFilter() {
			this.filterSearch.pageNo = 1;
			this.currentPageIdx = 1;
      this.refreshPage(this.filterSearch);
		},
    refreshPageManual() {
			this.currentPageIdx = 1;
			this.filterSearch.pageNo = 1;
			this.filterSearch.pageSize = 10;
      this.refreshPage(this.filterSearch);
    },
    refreshPage(obj) {
			this.ifLoading = true;
      memberSignQuery('', obj)
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
			this.filterSearch.pageNo = pageIndex;
      this.refreshPage(this.filterSearch);
    },
  },
  created() {
		this.refreshPage()
  }
}
</script>

<style scoped lang='less'>
 
</style>