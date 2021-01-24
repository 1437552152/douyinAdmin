<!--
 * @Description: 
 * @version: 
 * @Date: 2019-08-20 00:29:21
 * @LastEditors: yeyifu
 * @LastEditTime: 2019-10-07 22:39:46
 * @Author: yeyifu
 * @LastModifiedBy: yeyifu
 -->
<template>
  <div> 
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" inline style="margin-top:50px">
        <FormItem label="新闻标题" prop="title">
            <Input v-model="formValidate.title" />
        </FormItem>
      
        <FormItem label="文章分类" prop="newstype">
          <Select v-model="formValidate.newstype" :clearable="true"  style="width:200px">
            <Option value="-1">全部</Option>
            <Option value="0">普通文章</Option>
            <Option value="1">热点文章</Option>
          </Select>
        </FormItem>

       <FormItem label="新闻分类" prop="newStatus">
          <Select v-model="formValidate.newStatus" :clearable="true"  style="width:200px">
            <Option value="-1">全部</Option>
            <Option value="0">行业新闻</Option>
            <Option value="1">企业新闻</Option>
          </Select>
        </FormItem>
        
        <FormItem label="语言:" prop="lang">
            <RadioGroup v-model="formValidate.lang">
                <Radio label="0">全部</Radio>
                <Radio label="4">英文</Radio>
                <Radio label="5">中文</Radio>             
            </RadioGroup>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">查询</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
        <FormItem style="float:right;">
          <ButtonGroup>
            <Button type="primary" @click="reflash">刷新</Button>
            <Button type="primary" @click="add" style="float:right">增加</Button>
          </ButtonGroup>
        </FormItem>
    </Form>
    <Row class="margin-top-10">
      <Table :columns="tableTitle" :data="tableData"></Table>
    </Row>
     <Row class="pageWrapper" >
        <Page :total="total"  :current="current" show-total  :page-size="10"   @on-change="changePage"></Page>
      </Row>
        <Modal v-model="modal3" footer-hide>
       <img :src="imgSrc" style="width:100%"/>
    </Modal>
  </div>
</template>
<script>
import { newslist, newsdelete } from "@/service/getData";
export default {
  name: "article",
  data() {
    return {
      currentPageIdx: 1,
      current: 1,
      total: 1,
      imgSrc: "",
      modal3: false,
      formValidate: {
        title: "",
        newStatus: "",
        lang: 0,
        newstype: ""
      },
      ruleValidate: {},
      tableTitle: [
        {
          title: "作者",
          key: "author"
        },
        {
          title: "描述",
          key: "des",
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    webkitBoxOrient: "vertical",
                    webkitLineClamp: 3
                  }
                },
                params.row.des
              )
            ]);
          }
        },
        {
          title: "标题",
          key: "title",
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    webkitBoxOrient: "vertical",
                    webkitLineClamp: 3
                  }
                },
                params.row.title
              )
            ]);
          }
        },
        {
          title: "发布时间",
          key: "time"
        },
        /*   {
          title: "浏览量",
          key: "view"
        },   */

        {
          title: "焦点图",
          key: "pic",
          render: (h, params) => {
            const pic = params.row.focusPic;
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
                  cursor: "pointer"
                  /*   height: "70px" */
                }
              }),
              h("span", {}, text)
            ]);
          }
        },
        {
          title: "文章类型",
          key: "newstype",
          render(h, params) {
            let text = "";
            if (params.row.newstype == 0) {
              text = "普通文章";
            } else if (params.row.newstype == 1) {
              text = "热点新闻";
            }
            return h("div", text);
          }
        },
        {
          title: "语言类型",
          key: "lang",
          render(h, params) {
            let text = "";
            if (params.row.lang == "4") {
              text = "英文";
            } else if (params.row.lang == "5") {
              text = "中文";
            }
            return h("div", text);
          }
        },
        {
          title: "文章分类",
          key: "newStatus",
          render(h, params) {
            let text = "";
            if (params.row.newStatus == "1") {
              text = "企业新闻";
            } else if (params.row.newStatus == "0") {
              text = "行业新闻";
            }
            return h("div", text);
          }
        },
        {
          title: "操作",
          align: "center",
          width: 240,
          key: "introduceBriefly",
          render: (h, params) => {
            const id = params.row.newsId;
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
                      this.$router.push({
                        path: "/argu-page/articledetail",
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
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          console.log(this.formValidate);
          let params = {};
          params["title"] = this.formValidate.title;
          params["newStatus"] = this.formValidate.newStatus;
          params["lang"] = this.formValidate.lang;
          params["newstype"] = this.formValidate.newstype;
          this.getData(Object.assign({ pageNo: 1, pageSize: 10 }, params));
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    handleReset(name) {
      this.getData({ pageNo: 1, pageSize: 10 });
      this.$refs[name].resetFields();
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
    },
    add() {
      this.$router.push({
        path: "/argu-page/articledetail",
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
      newslist(obj).then(res => {
        this.tableData = res.data;
        this.total = res.total;
        this.current = res.currentPage;
        this.$Spin.hide();
      });
    },
    godelete(id) {
      newsdelete({ Id: id }).then(res => {
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
