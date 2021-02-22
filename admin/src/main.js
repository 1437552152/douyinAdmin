/*
 * @Description:111
 * @version: 111
 * @Date: 2019-07-31 19:53:22
 * @LastEditors: yfye
 * @LastEditTime: 2021-02-03 20:14:05
 * @Author: yeyifu
 * @LastModifiedBy: yeyifu
 */

import Vue from 'vue';
import iView, {
    Message
} from 'iview';
import {
    router
} from './router/index';
import {
    appRouter
} from './router/router';
import store from './store';
import App from './app.vue';
import '@/locale';
import 'iview/dist/styles/iview.css';
import VueI18n from 'vue-i18n';
import axios from 'axios';
import Api from '@/config/api';
import Cookies from 'js-cookie';
import Viser from 'viser-vue';
import base from '@/libs/base';
import VueClipboard from 'vue-clipboard2'
// 文本编辑器的使用
/* import VueQuillEditor from 'vue-quill-editor';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css'; */
import moment from 'moment';
/* import promise from 'es6-promise';
promise.polyfill(); */
// echarts的使用
import Echart from 'echarts';
Vue.prototype.$echarts = Echart;
Vue.prototype.moment = moment;
/* Vue.use(VueQuillEditor); */
Vue.prototype.$ajax = axios;
axios.interceptors.response.use((response) => {
    const data = response.data;
    if (data.code === 4000 || response.data.code === 3000) {
        Cookies.remove('user');
        Cookies.remove('userPhone');
        Cookies.remove('userInfo');
        localStorage.removeItem('token');
        router.push({
            name: 'login'
        });
    }
    if (data.status == 500 || data.code == 500) {
        if (data.msg == 'TokenExpiredError: jwt expired') {
            Cookies.remove('user');
            Cookies.remove('userPhone');
            Cookies.remove('userInfo');
            localStorage.removeItem('token');
            router.push({
                name: 'login'
            });
        } else {
            Cookies.remove('user');
            Cookies.remove('userPhone');
            Cookies.remove('userInfo');
            localStorage.removeItem('token');
            router.push({
                name: 'login'
            });
            Message.error(data.msg);
        }
    }

    if (data.code === 5000) {
        router.push({
            name: 'error-403'
        });
    }
    return response;
}, function (error) {
    // Do something with response error
    console.log(error);
});

axios.interceptors.request.use((config) => {
    if (config.url !== 'admin/login') {
        const token = localStorage.getItem('token');
        config.headers['token'] = token;
    }
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
    return config;
});

Vue.prototype.api = Api;
Vue.use(VueI18n);
Vue.use(iView);
Vue.use(Viser);
Vue.use(base);
Vue.use(VueClipboard)
new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App),
    data: {
        currentPageName: ''
    },
    mounted () {
        this.currentPageName = this.$route.name;
        // 显示打开的页面的列表
        this.$store.commit('setOpenedList');
        this.$store.commit('initCachepage');
        // 权限菜单过滤相关
        this.$store.commit('updateMenulist');
    },
    created () {
        let tagsList = [];
        appRouter.map((item) => {
            if (item.children.length <= 1) {
                tagsList.push(item.children[0]);
            } else {
                tagsList.push(...item.children);
            }
        });
        this.$store.commit('setTagsList', tagsList);
    }
});
