<!--
 * @Description: 
 * @version: 
 * @Company: 烽火通信
 * @Author: yeyifu
 * @Date: 2019-08-31 10:48:30
 * @LastEditors: yfye
 * @LastEditTime: 2021-01-24 19:43:07
 -->
<template>
  <div>
    <div style="display:flex;justify-content:flex-end;margin: 30px 20px 10px 0;">
      <ButtonGroup>
        <Button type="primary" @click="reflash">刷新</Button>
      </ButtonGroup>
    </div>
    <Row class="margin-top-10">
      <Table :columns="tableTitle" :data="tableData" />
    </Row>
    <Row class="pageWrapper">
      <Page :total="total" :current="current" show-total :page-size="10" @on-change="changePage"></Page>
    </Row>
    <Modal v-model="modal3" footer-hide>
      <img :src="imgSrc" style="width:100%" />
    </Modal>
  </div>
</template>
<script>
import { clickNumTotalList } from "@/service/getData";
export default {
  data() {
    return {
      currentPageIdx: 1,
      current: 1,
      total: 1,
      tableTitle: [
        {
          title: "操作账号",
          key: "account",
          align: "center"
        },
        {
          title: "点击时间",
          key: "creatTime",
          align: "center"
        },
        {
          title: "标题",
          key: "title",
          align: "center",
          render: (h, params) => {
            const title = params.row.title;
            return h("div", `点击了${title}按钮`);
          }
        }
      ],
      tableData: []
    };
  },
  methods: {
    changePage(pageIndex) {
      this.currentPageIdx = pageIndex;
      let obj = {
        pageNo: pageIndex,
        pageSize: 10
      };
      this.getData(obj);
    },
    getData(obj) {
      clickNumTotalList(obj).then(res => {
        this.tableData = res.data;
        this.total = res.total;
        this.current = res.currentPage;
        this.$Spin.hide();
      });
    },
    reflash() {
      this.$Spin.show({
        render: h => {
          return h("div", [
            h("Icon", {
              class: "demo-spin-icon-load",
              props: {
                type: "ios-loading",
                size: 18
              }
            }),
            h("div", "Loading")
          ]);
        }
      });
      this.getData({ pageNo: this.currentPageIdx, pageSize: 10 });
    }
  },
  created() {
    this.getData({ pageNo: this.currentPageIdx, pageSize: 10 });
  }
};
</script>
<style lang="less" scoped>
</style>
