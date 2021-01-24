<!--
 * @Description: 
 * @version: 
 * @Date: 2019-08-31 20:27:40
 * @LastEditors: yeyifu
 * @LastEditTime: 2019-09-27 00:21:47
 * @Author: yeyifu
 * @LastModifiedBy: yeyifu
 -->
<template>
  <div>
    <div class="formHead">
      <Form :model="formItem" :label-width="200">
        <FormItem label="请填写网站名称">
          <Input v-model="formItem.webname" placeholder="请填写网站名称..." />
        </FormItem>
        <FormItem label="请输入网站域名">
          <Input v-model="formItem.website" placeholder="请输入网站域名..." />
        </FormItem>
        <FormItem label="请填写公司地址">
          <Input v-model="formItem.address" placeholder="请输入公司地址..." />
        </FormItem>
        <FormItem label="请填写公司邮箱">
          <Input v-model="formItem.email" placeholder="请填写公司邮箱..." />
        </FormItem>
        <FormItem label="请填写联系电话">
          <Input v-model="formItem.mobile" placeholder="请填写联系电话..." />
        </FormItem>
        <FormItem label="请填写QQ号码">
          <Input v-model="formItem.qqCode" placeholder="请填写QQ号码..." />
        </FormItem>
        <FormItem label="请填写公司经度">
          <Input v-model="formItem.longitude" placeholder="请填写公司经度..." />
        </FormItem>
        <FormItem label="请填写公司纬度">
          <Input v-model="formItem.latitude" placeholder="请填写公司纬度..." />
        </FormItem>

        <FormItem label="语言类型" prop="lang">
          <Select v-model="formItem.lang" @on-clear="clearValue" :clearable="true">
            <Option :value="item.id" v-for="item in langData" :key="item.id">{{item.title}}</Option>
          </Select>
        </FormItem>

        <Row>
          <Col span="12">
            <FormItem label="上传logo" prop="logoPic">
              <div class="acc_sc">
                <img id="aliImg" style="width: 200px;height:200px;" :src="logoPic" />
                <Upload
                  ref="upload"
                  name="picUrl"
                  :show-upload-list="false"
                  :on-success="aliHandleSuccesslogoPic"
                  :action="uploadUrl"
                  enctype="multipart/form-data"
                  :headers="myHeaders"
                >
                  <Button
                    type="success"
                    icon="ios-cloud-upload-outline"
                    style="    opacity: 0;width: 200px;
          height: 200px;margin-top: -200px;"
                  >上传logo</Button>
                </Upload>
              </div>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="上传微信二维码" prop="weChatPic">
              <div class="acc_sc">
                <img id="aliImg" style="width: 200px;height:200px;" :src="weChatPic" />
                <Upload
                  ref="upload"
                  name="picUrl"
                  :show-upload-list="false"
                  :on-success="aliHandleSuccessweChatPic"
                  :action="uploadUrl"
                  enctype="multipart/form-data"
                  :headers="myHeaders"
                >
                  <Button
                    type="success"
                    icon="ios-cloud-upload-outline"
                    style="    opacity: 0;width: 200px;
          height:200px;margin-top: -200px;"
                  >上传微信二维码</Button>
                </Upload>
              </div>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="上传QQ二维码" prop="qqeweimaPic">
              <div class="acc_sc">
                <img id="aliImg" style="width: 200px;height:200px;" :src="qqeweimaPic" />
                <Upload
                  ref="upload"
                  name="picUrl"
                  :show-upload-list="false"
                  :on-success="aliHandleSuccessqqeweimaPic"
                  :action="uploadUrl"
                  enctype="multipart/form-data"
                  :headers="myHeaders"
                >
                  <Button
                    type="success"
                    icon="ios-cloud-upload-outline"
                    style="    opacity: 0;width: 200px;
          height:200px;margin-top: -200px;"
                  >上传QQ二维码</Button>
                </Upload>
              </div>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="上传微博二维码" prop="weiboPic">
              <div class="acc_sc">
                <img id="aliImg" style="width: 200px;height:200px;" :src="weiboPic" />
                <Upload
                  ref="upload"
                  name="picUrl"
                  :show-upload-list="false"
                  :on-success="aliHandleSuccessweiboPic"
                  :action="uploadUrl"
                  enctype="multipart/form-data"
                  :headers="myHeaders"
                >
                  <Button
                    type="success"
                    icon="ios-cloud-upload-outline"
                    style="    opacity: 0;width: 200px;
          height:200px;margin-top: -200px;"
                  >上传微博二维码</Button>
                </Upload>
              </div>
            </FormItem>
          </Col>
        </Row>
        <FormItem label="上传公众号二维码" prop="publicPic">
          <div class="acc_sc">
            <img id="aliImg" style="width: 200px;height:200px;" :src="publicPic" />
            <Upload
              ref="upload"
              name="picUrl"
              :show-upload-list="false"
              :on-success="aliHandleSuccesspublicPic"
              :action="uploadUrl"
              enctype="multipart/form-data"
              :headers="myHeaders"
            >
              <Button
                type="success"
                icon="ios-cloud-upload-outline"
                style="    opacity: 0;width: 200px;
          height:200px;margin-top: -200px;"
              >上传公众号二维码</Button>
            </Upload>
          </div>
        </FormItem>
        <div style="color:red">注:建议上传图片大小200*200(或此比例),大小在2兆以内</div> 
      <div id="Test">
        <UEditor :config="config" :defaultMsg="content"  ref="ueditor" v-if="hackReset"></UEditor>
     </div>   <!--   <div id="Test">
          <quill-editor
            ref="myTextEditor"
            v-model="content"
            :options="quillOption"
            style="height:600px;margin:0 auto;width:1100px"
            @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)"
            @change="onEditorChange($event)"
          ></quill-editor>
        </div> -->
        <div
          style="margin-top:50px;width:200px;margin-left:auto;margin-right:auto;display: flex;justify-content: center;margin-bottom:150px;"
        >
          <Button type="primary" long @click="sure">保存</Button>
        </div>
      </Form>
    </div>
  </div>
</template>
<script>
import {
  BASICURL,
  lookWebsiteConfig,
  langConfiglist,
  addWebsiteConfig,
  baseConfigUpdate
} from "@/service/getData";
import quillConfig from "../../libs/quill-config.js";
const token = localStorage.getItem("token");
import UEditor from "@/components/ueditor/ueditor.vue";
export default {
  name: "websiteConfig",
  components: {
    UEditor
  },
  data() {
    return {
      uploadUrl: BASICURL + "admin/upload",
      logoPic: require("../../images/talkingdata.png"),
      weChatPic: require("../../images/talkingdata.png"),
      qqeweimaPic: require("../../images/talkingdata.png"),
      weiboPic: require("../../images/talkingdata.png"),
      publicPic: require("../../images/talkingdata.png"),
      myHeaders: { token: token },
      hackReset: true,
      langData: [],
      formItem: {
        webname: "",
        website: "",
        address: "",
        email: "",
        mobile: "",
        qqCode: "",
        longitude: "",
        latitude: "",
        lang: 4
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
      quillOption: quillConfig
    };
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
      console.log("value===>", value);
    },
    //获取文档内容
    getContent: function() {
      let content = this.$refs.ueditor.getUEContent();
      console.log(content);
    },
    getblank: function() {
      this.formItem.longitude = "";
      this.formItem.latitude = "";
      this.formItem.webname = "";
      this.formItem.website = "";
      this.formItem.address = "";
      this.formItem.email = "";
      this.formItem.lang = this.langData[0].id;
      this.formItem.mobile = "";
      this.formItem.longitude = "";
      this.formItem.latitude = "";
      this.formItem.qqCode = "";
      (this.logoPic = require("../../images/talkingdata.png")),
        (this.weChatPic = require("../../images/talkingdata.png")),
        (this.qqeweimaPic = require("../../images/talkingdata.png")),
        (this.weiboPic = require("../../images/talkingdata.png")),
        (this.publicPic = require("../../images/talkingdata.png")),
        (this.content = "");
    },
    getData(params) {
      lookWebsiteConfig(params).then(res => {
        this.formItem.longitude = res.data.longitude;
        this.formItem.latitude = res.data.latitude;
        this.formItem.webname = res.data.webname;
        this.formItem.website = res.data.website;
        this.formItem.address = res.data.address;
        this.formItem.email = res.data.email;
        this.formItem.lang = Number(res.data.lang);
        this.formItem.mobile = res.data.mobile;
        this.formItem.longitude = res.data.longitude;
        this.formItem.latitude = res.data.latitude;
        this.formItem.qqCode = res.data.qqCode;
        this.logoPic = res.data.logoPic;
        this.weChatPic = res.data.weChatPic;
        this.qqeweimaPic = res.data.qqeweimaPic;
        this.weiboPic = res.data.weiboPic;
        this.publicPic = res.data.publicPic;
        this.content = res.data.content;
         this.hackReset = false
        this.$nextTick(() => {
        this.hackReset = true
        })
      });
    },
    clearValue() {
      this.formItem.lang = this.langData[0].id;
    },
    aliHandleSuccesslogoPic(res, file) {
      this.logoPic = BASICURL + res.ret_code;
    },
    aliHandleSuccessweChatPic(res, file) {
      this.weChatPic = BASICURL + res.ret_code;
    },
    aliHandleSuccessqqeweimaPic(res, file) {
      this.qqeweimaPic = BASICURL + res.ret_code;
    },
    aliHandleSuccessweiboPic(res, file) {
      this.weiboPic = BASICURL + res.ret_code;
    },
    aliHandleSuccesspublicPic(res, file) {
      this.publicPic = BASICURL + res.ret_code;
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
    sure() {
      let params = {};
      params["id"] = this.$route.query.id;
      params["longitude"] = this.longitude;
      params["latitude"] = this.latitude;
      params["logoPic"] = this.logoPic;
      params["weChatPic"] = this.weChatPic;
      params["qqeweimaPic"] = this.qqeweimaPic;
      params["weiboPic"] = this.weiboPic;
      params["content"] = this.$refs.ueditor.getUEContent();
      params["publicPic"] = this.publicPic;
      params["webname"] = this.formItem.webname;
      params["website"] = this.formItem.website;
      params["address"] = this.formItem.address;
      params["lang"] = this.formItem.lang;
      params["email"] = this.formItem.email;
      params["mobile"] = this.formItem.mobile;
      params["qqCode"] = this.formItem.qqCode;
      params["longitude"] = this.formItem.longitude;
      params["latitude"] = this.formItem.latitude;

      let objvar = require("../../images/talkingdata.png");

      if (
        this.$refs.ueditor.getUEContent() == "" ||
        this.formItem.webname == "" ||
        this.formItem.website == "" ||
        this.formItem.address == "" ||
        this.formItem.email == "" ||
        this.formItem.mobile == "" ||
        this.formItem.qqCode == "" ||
        this.formItem.mobile == ""
      ) {
        this.$Message.error("请填写所有的表单数据");
        return false;
      }
      if (
        this.logoPic == objvar ||
        this.weChatPic == objvar ||
        this.qqeweimaPic == objvar ||
        this.weiboPic == objvar ||
        this.publicPic == objvar
      ) {
        this.$Message.error("请上传所有的图片");
        return false;
      }

      if (this.$route.query.id != -1) {
        baseConfigUpdate(params).then(res => {
          if (res.status == 200) {
            this.$Message.success("修改成功");
          } else {
            this.$Message.error("修改失败");
          }
        });
      } else {
        addWebsiteConfig(params)
          .then(res => {
            console.log(res);
            if (res.status == 200) {
              this.$Message.success(res.msg);
            } else {
              this.$Message.error(res.msg);
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    }
  },
  watch: {
    $route(to, from) {
      if (to.name == "websiteConfig") {
        if (this.$route.query.id != -1) {
          this.getData({ id: this.$route.query.id }); //修改
          this.getLangData();
        } else {
          this.getblank();
          setTimeout(() => {
            this.getLangData();
          }, 500);
        }
      }
    }
  },
  mounted() {
    if (this.$route.query.id != -1) {
      this.getData({ id: this.$route.query.id }); //修改
      this.getLangData();
    } else {
      this.getblank();
      setTimeout(() => {
        this.getLangData();
      }, 500);
    }
  }
  /*   created() {
    this.getLangData();
    if (this.$route.query.id != -1) {
      this.getData({ id: this.$route.query.id }); //修改
    }
  } */
};
</script>

<style lang="less" scoped>
.clearfix {
  clear: both;
}
#aliImg {
  width: 80px;
  height: 30px;
}
.formHead {
  width: 1300px;
  margin: 40px auto;
}
</style>
