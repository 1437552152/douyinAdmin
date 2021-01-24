<!--
 * @Description: 
 * @version: 
 * @Date: 2019-08-20 00:29:21
 * @LastEditors: yeyifu
 * @LastEditTime: 2019-10-07 21:56:47
 * @Author: yeyifu
 * @LastModifiedBy: yeyifu
 -->
<template>
  <div>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" inline style="margin-top:50px">
        <FormItem label="产品名称" prop="title">
            <Input v-model="formValidate.title" />
        </FormItem>
        <FormItem label="产品类型" prop="type">        
          <Select
            v-model="formValidate.type"
            @on-change="typeChange"
            @on-clear="clearValue"
            :clearable="true"
            style="width:200px"
          >
            <Option value="0">全部</Option>
            <Option :value="item.id" v-for="item in tableTypeData" :key="item.id">{{item.title}}</Option>
          </Select>

        </FormItem>
        <FormItem label="产品分类" prop="category">
          <Select v-model="formValidate.category" @on-clear="clearcategoryValue" :clearable="true"  style="width:200px">
            <Option value="-1">全部</Option>
            <Option value="0">普通产品</Option>
            <Option value="1">热点产品</Option>
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
    <Row class="pageWrapper">
      <Page :total="total" :current="current" show-total :page-size="10" @on-change="changePage"></Page>
    </Row>
     <Modal v-model="modal3" footer-hide>
       <img :src="imgSrc" style="width:100%"/>
    </Modal>
  </div>
</template>
<script>
import { team, teamdelete, productConfiglist } from "@/service/getData";
export default {
  name: "team",
  data() {
    return {
      currentPageIdx: 1,
      current: 1,
      total: 1,
      imgSrc: "",
      modal3: false,
      formValidate: {
          title:'',
          type:"",
          lang:0,
          category:""       
      },
      ruleValidate: { },   
      tableTitle: [
        {
          title: "产品名称",
          key: "title"
        },
         {
          title: "语言",
          key: "lang",
            render: (h, params) => {
            const lang = params.row.lang;
            let text = lang == "4" ? "英文" : "中文";
            return h("span", text);
            }
        },
        {
          title: "关键词",
          key: "keyword"
        },
        {
          title: "产品图片",
          key: "pic",
          render: (h, params) => {
            const pic = params.row.pic;
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
                  /*    height: "70px" */
                }
              }),
              h("span", {}, text)
            ]);
          }
        },
        {
          title: "产品类型",
          key: "typeTitle"
          //  render: (h, params) => {
          //   const type = params.row.type;
          //   let text = type=='1'?"真石漆系列":type=="2"?'多彩漆系列':'岩片漆';
          //   return h("span",text);
          // }
        },
        {
          title: "产品分类",
          key: "产品类型",
          render: (h, params) => {
            const category = params.row.category;
            let text = category == "0" ? "普通产品" : "热点产品";
            return h("span", text);
          }
        },

        {
          title: "简介",
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
        // {
        //   title: "浏览数",
        //   key: "view"
        // },
        //  {
        //   title: "发布时间",
        //   key: "time"
        // },
        {
          title: "操作",
          align: "center",
          width: 240,
          key: "introduceBriefly",
          render: (h, params) => {
            const id = params.row.productId;
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
                        path: "/teamdetail",
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
      tableData: [],
      tableTypeData:[]
    };
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          console.log(this.formValidate);
          let params={};
          params['title']=this.formValidate.title;
          params['type']=this.formValidate.type;
          params['lang']=this.formValidate.lang;
          params['category']=this.formValidate.category;
          this.getData(Object.assign({pageNo:1, pageSize: 10 },params))       
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
     clearValue() {
      this.formValidate.type=0;
    },
   clearcategoryValue() {
      this.formValidate.category = 0;
    },
    typeChange(value) {
      this.formValidate.type = value;
      this.tableTypeData.map((item, index) => {
        if (item.id == value) {
          this.formValidate.typeTitle = item.title;
        }
      });
    },
    handleReset(name) {
      this.getData({ pageNo: 1, pageSize: 10 });
      this.$refs[name].resetFields();
    },
    reflash() {
      this.$refs["formValidate"].resetFields();    
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
        path: "/teamdetail",
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
      team(obj).then(res => {
        this.tableData = res.data;
        this.total = res.total;
        this.current = res.currentPage;
        this.$Spin.hide();
      });
    },
    getTypeData(obj) {
      let that = this;
      productConfiglist(obj).then(res => {
        that.tableTypeData = res.data;
      });
    },
    godelete(id) {
      teamdelete({ productId: id }).then(res => {
        if (res.status == 200) {
          this.$Message.success(res.msg);
          this.getData({ pageNo: this.currentPageIdx, pageSize: 10 });
        } else {
          this.$Message.error(res.msg);
          this.getData({ pageNo: this.currentPageIdx, pageSize: 10 });
        }
      });
    },
  /*   handleSubmit(name) {
      console.log(name);
    }, */
  /*   handleReset(name) {
      this.$refs[name].resetFields();
    } */
  },
  created() {
    this.getData({ pageNo: this.currentPageIdx, pageSize: 10 });
    this.getTypeData({ pageNo: 1, pageSize: 100 }); 
  }
};
</script>
<style lang="less" scoped>
.clearfix {
  clear: both;
}
</style>
