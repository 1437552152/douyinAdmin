<!--
 * @Description: 
 * @version: 
 * @Company: 烽火通信
 * @Author: yeyifu
 * @Date: 2019-08-31 10:48:30
 * @LastEditors: yeyifu
 * @LastEditTime: 2019-10-07 22:59:56
 -->
<template>
  <div>

 <Form :model="formValidate" :label-width="80" ref="formValidate" :rules="ruleValidate">
     <div style="margin:0 auto;width:1200px">
        <FormItem label="文章标题" prop="title">
            <Input v-model="formValidate.title" placeholder="请输入文章标题..."/>
        </FormItem>
        <FormItem label="文章作者" prop="author">
            <Input v-model="formValidate.author" placeholder="请输入文章作者..."/>
        </FormItem>
         <FormItem label="文章描述" prop="des">
            <Input v-model="formValidate.des"  type="textarea"  placeholder="请输入描述内容..."/>
        </FormItem>
         <FormItem label="文章关键词" prop="keyword">
            <Input v-model="formValidate.keyword" placeholder="请输入文章关键词..."/>
        </FormItem>
        <FormItem label="文章类型" prop="newstype">
            <Select v-model="formValidate.newstype">
                <Option :value="0">普通文章</Option>
                <Option :value="1">热点文章</Option>             
            </Select>
        </FormItem>

        <FormItem label="新闻分类" prop="newStatus">
            <Select v-model="formValidate.newStatus">
                <Option :value="0">行业新闻</Option>
                <Option :value="1">企业新闻</Option>             
            </Select>
        </FormItem>

       <FormItem label="语言类型" prop="lang">
          <Select v-model="formValidate.lang" @on-clear="clearValue" :clearable="true">
            <Option :value="item.id" v-for="item in langData" :key="item.id">{{item.title}}</Option>
          </Select>
        </FormItem>

        <FormItem label="上传图片" prop="pic">
        <div class="acc_sc">
             <img  id="aliImg" style="width: 200px;height:170px;" :src="pic">
            <Upload ref="upload"  name="picUrl" :show-upload-list="false"  :on-success="aliHandleSuccess"  :action="uploadUrl" enctype="multipart/form-data" :headers="myHeaders">
              <Button type="success"   icon="ios-cloud-upload-outline" style="opacity: 0;width: 200px;height: 170px;margin-top: -200px;">上传焦点图片</Button>
            </Upload>
            <div class="clearfix"></div>
        </div>
         <div class="clearfix"></div>
         </FormItem>
        
    <div id="Test"> 
         <UEditor :config="config" :defaultMsg="content"  ref="ueditor" v-if="hackReset"></UEditor>
    </div>  </div> <!--  <quill-editor ref="myTextEditor"
                v-model="content" :options="quillOption"  style="height:600px;margin:0 auto;width:1100px"   @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
        @change="onEditorChange($event)">
      </quill-editor> -->
  <!--   </div> -->
    <div  style="margin-top:50px;width:200px;margin-left:auto;margin-right:auto;display: flex;justify-content: center;margin-bottom:150px;">
        <Button type="primary" long  @click="sure('formValidate')">保存</Button>
        <Button style="margin-left: 8px" long @click="handleReset('formValidate')">清空</Button>
      </div>
    </Form>
 
  </div>
</template>
<script>
import {
  BASICURL,
  newsdetail,
  newsUpdate,
  newsadd,
  langConfiglist,
  country
} from "@/service/getData";
import { quillEditor } from "vue-quill-editor";
import quillConfig from "../../libs/quill-config.js";
import UEditor from "@/components/ueditor/ueditor.vue";
const token = localStorage.getItem("token");
export default {
  name: "articledetail",
  components: {
    quillEditor,
    UEditor
  },
  data() {
    return {
      uploadUrl: BASICURL + "admin/upload",
      pic: require("../../images/talkingdata.png"),
      hackReset: true,
      myHeaders: { token: token },
      countrydata: null,
      formValidate: {
        title: "",
        author: "",
        des: "",
        keyword: "",
        newstype: 0,
        lang: 4,
        newStatus: 0
      },

      config: {
        autoHeightEnabled: false,
        autoFloatEnabled: true,
        initialContent: "请输入内容...", //初始化编辑器的内容,也可以通过textarea/script给值，看官网例子
        autoClearinitialContent: true, //是否自动清除编辑器初始内容，注意：如果focus属性设置为true,这个也为真，那么编辑器一上来就会触发导致初始化的内容看不到了
        initialFrameWidth: null,
        initialFrameHeight: 600,
        BaseUrl: "",
        UEDITOR_HOME_URL: "static/ueditor/"
      },
      content: "",
      langData: [],
      article: "",
      quillOption: quillConfig,
      ruleValidate: {
        title: [
          {
            required: true,
            message: "文章标题不能为空",
            trigger: "blur"
          }
        ],
        author: [
          {
            required: true,
            message: "文章作者",
            trigger: "blur"
          }
        ],
        des: [
          {
            required: true,
            message: "描述不能为空",
            trigger: "change"
          }
        ],
        keyword: [
          { required: true, message: "请输入关键词", trigger: "change" }
        ]
      }
    };
  },
  watch: {
    $route(to, from) {
      if (to.name == "articledetail") {
        if (this.$route.query.id&&this.$route.query.id != -1) {
          this.getData({ id: this.$route.query.id }); //修改
          this.getLangData();
        } else {
         
          setTimeout(() => {
            this.getblank();
            this.getLangData();
          }, 500);
        }
      }
    }
  },
  created() {},
  mounted() {
    if (this.$route.query.id&&this.$route.query.id != -1) {
      this.getData({ id: this.$route.query.id }); //修改
      this.getLangData();
    } else {
      this.getblank();
      setTimeout(() => {
        this.getLangData();
      }, 500);
    }
  },
  methods: {
    onEditorBlur() {
      //失去焦点事件
    },
    onEditorFocus() {
      //获得焦点事件
    },
    onEditorChange(value) {
      //内容改变事件
      this.article = value.html;
    },
    aliHandleSuccess(res, file) {
      this.pic = BASICURL + res.ret_code;
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    clearValue() {
      this.formValidate.lang = this.langData[0].id;
    },
    getblank() {
      this.formValidate.title = "";
      this.formValidate.author = "";
      this.formValidate.des = "";
      this.formValidate.keyword = "";
      this.formValidate.lang = '4';
      this.formValidate.newstype = 0;
      this.formValidate.newStatus = 0;
      this.articlenewstype = "0";
    },
    getData(params) {
      newsdetail(params).then(res => {
        this.formValidate.title = res.data[0].title;
        this.formValidate.author = res.data[0].author;
        this.formValidate.des = res.data[0].des;
        this.formValidate.keyword = res.data[0].keyword;
        this.formValidate.newstype = Number(res.data[0].newstype);
        this.formValidate.lang = Number(res.data[0].lang);
        this.formValidate.newStatus = Number(res.data[0].newStatus);
        this.pic = res.data[0].focusPic;
        this.content = this.article = res.data[0].content;
        this.hackReset = false;
        this.$nextTick(() => {
          this.hackReset = true;
        });
      });
    },
    handleChange(html, text) {
      // console.log("html===>", html);
      // this.article = html;
    },
    getLangData() {
      langConfiglist({
        pageNo: 1,
        pageSize: 10
      }).then(res => {
        this.langData = res.data;
        this.lang = this.langData[0].id;
      });
    },
    sure(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let params = [];
          params["pic"] = this.pic;
          params["title"] = this.formValidate.title;
          params["author"] = this.formValidate.author;
          params["des"] = this.formValidate.des;
          params["newstype"] = this.formValidate.newstype;
          params["content"] = this.$refs.ueditor.getUEContent();
          params["keyword"] = this.formValidate.keyword;
          params["lang"] = this.formValidate.lang;
          params["newStatus"] = this.formValidate.newStatus;
          if (this.$route.query.id&&this.$route.query.id != -1) {
            params["Id"] = this.$route.query.id;
          }
          if (this.pic === require("../../images/talkingdata.png")) {
            this.$Message.error("请上传图片");
            return false;
          }
          if (this.$route.query.id&&this.$route.query.id != -1) {
            params["content"] =  this.$refs.ueditor.getUEContent();
            newsUpdate(params).then(res => {
              if (res.status == 200) {
                this.$Message.success("修改成功");
              } else {
                this.$Message.error("修改失败");
              }
            });
          } else {
            params["content"] = this.$refs.ueditor.getUEContent();
            newsadd(params).then(res => {
              console.log(res);
              if (res.status == 200) {
                this.$Message.success("增加成功");
              } else {
                this.$Message.error("增加失败");
              }
            });
          }
        } else {
          this.$Message.error("表单验证失败!");
        }
      });
    }
  }
};
</script>

<style>
</style>
