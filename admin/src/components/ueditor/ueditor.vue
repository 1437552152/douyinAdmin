<!--
 * @Description: 
 * @version: 
 * @Date: 2019-08-31 20:27:40
 * @LastEditors: yeyifu
 * @LastEditTime: 2019-09-24 22:55:08
 * @Author: yeyifu
 * @LastModifiedBy: yeyifu
 -->
<template>
  <div>
    <script id="editor" type="text/plain" ></script>
  </div>
</template>

<script>
  import '../../../static/ueditor/ueditor.config.js'
  import '../../../static/ueditor/ueditor.all.js'
  import '../../../static/ueditor/lang/zh-cn/zh-cn.js'
  import '../../../static/ueditor/jquery-2.2.3.min.js'

  export default {
    name: "UEditor",
    props: {
      id: {
          type: String
      },
       defaultMsg: {
        type: String
      },
      config: {
          type: Object
      }
    },
    data() {
      return {
        editor: null
      }
    },
    mounted() {
      //初始化UE
        const _this = this;
        this.editor = window.UE.delEditor("editor");
        this.editor = window.UE.getEditor('editor',this.config);
        this.editor.addListener("ready", function () {
        _this.editor.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
      });
    },
     methods:{
      getUEContent: function(){
       return this.editor.getContent();
      }
    },
    destoryed() {
      this.editor.destory();
    }
  }
</script>
