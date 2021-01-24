
<style lang="less">
@import "./login.less";
</style>

<template>
  <div>
   <iframe
      align="center"
      width="100%"
      :height="ContentHeight"
      :src="src"
      frameborder="no"
      border="0"
      marginwidth="0"
      marginheight="0"
      scrolling="yes"
      id="iframe"
    />
  </div>
</template>

<script>
import { getWebsiteUrl} from '@/service/getData';
export default {
    data () {
        return {
            src: '',
            ContentHeight: document.body.clientHeight
        };
    },
    mounted () {
        window.addEventListener('message', function (e) {
            console.log(e);
        });

        document.addEventListener('DOMContentLoaded', function () {
            var hash = location.hash;
            var url = hash.substring(1, hash.length);
            var parent = document.getElementById('iframe');
            parent.setAttribute('src', url);
        }, false);
        this.getData(this.$route.query.uuid);
    },
    methods: {
        getData (id) {
            let that = this;
            let params = {};
            params['uuid'] = id;
            getWebsiteUrl(params).then((res) => {
                if (res.status) {
                    that.src = res.data.href;
                } else {
                    this.$Message.error('请求失败');
                }
            });
        }
    }
};
</script>