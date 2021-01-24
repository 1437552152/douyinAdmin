<!--
 * @Description: 
 * @version: 
 * @Date: 2019-08-20 00:29:21
 * @LastEditors: yeyifu
 * @LastEditTime: 2019-09-19 00:59:10
 * @Author: yeyifu
 * @LastModifiedBy: yeyifu
 -->
<template>
  <div> 
      <Button type="primary"  @click="reflash">刷新</Button>
     <!-- <Button type="primary"    @click="add" style="float:right">增加</Button> -->
     <div class="clearfix"></div>
    <Row class="margin-top-10">
      <Table :columns="tableTitle" :data="tableData"></Table>
    </Row>
     <Row class="pageWrapper" >
        <Page :total="total"  :current="current" show-total  :page-size="10"   @on-change="changePage"></Page>
      </Row>
      <Modal v-model="modal11" fullscreen draggable scrollable title="留言回复" @on-ok="handleReply">
        <div><Input v-model="replyContent"/></div>
     </Modal>
  </div>
</template>
<script>
import { messagelist, reportdelete,messageupdate } from "@/service/getData";
export default {
  name: "famousSchool",
  data() {
    return {
      currentPageIdx: 1,
      current: 1,
      total: 1,
      Id:0,
      replyContent:'',
      modal11: false,
      tableTitle: [
      /*   {
          title: "标题",
          key: "title"
        }, */
        {
          title: "姓名",
          key: "name"
        },
        {
          title: "留言内容",
          key: "content"
        },
        {
          title: "邮箱",
          key: "email"
        },
        {
          title: "手机号",
          key: "mobile"
        },
        {
          title: "留言时间",
          key: "time"
        },
        {
          title: "回复内容",
          key: "replyContent"
        },
        {
          title: "操作",
          align: "center",
          width: 240,
          key: "introduceBriefly",
          render: (h, params) => {
            const id = params.row.Id;
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "20px"
                  },
                  class: {
                    // disabled: authStatus === 0 ? false : true
                  },
                  on: {
                    click: () => {
                      this.godelete(id);
                    }
                  }
                },
                "删除"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "20px"
                  },
                  class: {
                    // disabled: authStatus === 0 ? false : true
                  },
                  on: {
                    click: () => {
                       this.replyContent='';
                       this.modal11 = true;
                       this.Id=id;
                    }
                  }
                },
                "回复"
              )
            ]);
          }
        }
      ],
      tableData: []
    };
  },
  methods: {
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
    },
    changePage(pageIndex) {
      this.currentPageIdx = pageIndex;
      let obj = {
        pageNo: pageIndex,
        pageSize: 10
      };
      this.getData(obj);
    },
    getData(obj) {
      messagelist(obj).then(res => {
        this.tableData = res.data;
        this.total = res.total;
        this.current = res.currentPage;
        this.$Spin.hide();
      });
    },
    handleReply(){   
       messageupdate({replyContent:this.replyContent,Id:this.Id}).then(res => {
         this.$Message.success(res.msg);
         this.getData({ pageNo: this.currentPageIdx, pageSize: 10 });
      });
    },
    godelete(id) {
      reportdelete({ Id: id }).then(res => {
        if (res.status == 200) {
          this.$Message.success("删除成功");
          this.getData({ pageNo: this.currentPageIdx, pageSize: 10 });
        } else {
          this.$Message.error("删除失败");
          this.getData({ pageNo: this.currentPageIdx, pageSize: 10 });
        }
      });
    }
  },
  created() {
    this.getData({ pageNo: this.currentPageIdx, pageSize: 10 });
  }
};
</script>
<style lang="less" scoped>
.clearfix {
  clear: both;
}
</style>
