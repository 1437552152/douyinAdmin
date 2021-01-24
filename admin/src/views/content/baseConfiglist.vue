<!--
 * @Description: 
 * @version: 
 * @Date: 2019-08-31 20:27:40
 * @LastEditors: yeyifu
 * @LastEditTime: 2019-10-07 22:04:56
 * @Author: yeyifu
 * @LastModifiedBy: yeyifu
 -->
<template>
  <div>
    <div style="display:flex;justify-content:flex-end;margin: 30px 20px 10px 0;">
          <ButtonGroup>
            <Button type="primary" @click="reflash">刷新</Button>
          <!--   <Button type="primary" @click="add" style="float:right">增加</Button> -->
          </ButtonGroup>
      </div>
    <Row class="margin-top-10">
      <Table :columns="tableTitle" :data="tableData"></Table>
    </Row>
    <Row class="pageWrapper">
      <Page :total="total" :current="current" show-total :page-size="10" @on-change="changePage"></Page>
    </Row>
      <Modal v-model="modal3" footer-hide>
       <img :src="imgSrc" style="width:100%"/>
    </Modal>
  </div>
</template>
<script>

import { BASICURL,baseConfig,deleteWebsiteConfig } from "@/service/getData";
export default {
  name: "baseConfiglist",
  data() {
    return {
      currentPageIdx: 1,
      current: 1,
      total: 1,
          imgSrc:'',
      modal3: false,
      tableTitle: [
        {
          title: "公司名称",
          key: "webname"
        },
        {
          title: "公司地址",
          key: "address"
        },
        {
          title: "公司logo",
          key: "pic",
          render: (h, params) => {
            const pic = params.row.logoPic;
            let text = "";
            return h("div", [
              h("img", {
                attrs: {
                  src: pic
                },
                     on: {
                click: () => {
                  this.imgSrc = pic;
                  this.modal3 = true;
                }
              },
                style: {
                  width: "100px",
                     cursor:"pointer"
                 /*  height: "70px" */
                }
              }),
              h("span", {}, text)
            ]);
          }
        },
        {
          title: "网站链接",
          key: "website"
        },
        {
          title: "公司邮箱",
          key: "email",
          // render: (h, params) => {
          //   const category = params.row.category;
          //   let text =category == "0" ? "普通产品" : "热点产品"
          //   return h("span", text);
          // }
        },

        {
          title: "手机号",
          key: "mobile",
          // render: (h, params) => {
          //   return h("div", [
          //     h(
          //       "span",
          //       {
          //         style: {
          //           overflow: "hidden",
          //           textOverflow: "ellipsis",
          //           display: "-webkit-box",
          //           webkitBoxOrient: "vertical",
          //           webkitLineClamp: 3
          //         }
          //       },
          //       params.row.des
          //     )
          //   ]);
          // }
        },
        {
          title: "操作",
          align: "center",
          width: 240,
          key: "introduceBriefly",
          render: (h, params) => {
            const id = params.row.configId;
            return h("div", [
        /*       h(
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
                  },
                  on: {
                    click: () => {
                      this.godelete(id);
                    }
                  }
                },
                "删除"
              ), */
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
                      this.$router.push({
                        path: "/websiteConfig",
                        query: { id: id }
                      });
                    }
                  }
                },
                "修改"
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
    add() {
      this.$router.push({
        path: "/websiteConfig",
        query: { id: -1 }
      });
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
      baseConfig(obj).then(res => {
        this.tableData = res.data;
        this.total = res.total;
        this.current = res.currentPage;
        this.$Spin.hide();
      });
    },
    godelete(id) {
      deleteWebsiteConfig({ configId: id }).then(res => {
        if (res.status == 200) {
          this.$Message.success(res.msg);
          this.getData({ pageNo: this.currentPageIdx, pageSize: 10 });
        } else {
          this.$Message.error(res.msg);
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
