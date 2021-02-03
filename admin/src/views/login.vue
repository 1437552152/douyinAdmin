<!--
 * @Description: 
 * @version: 
 * @Date: 2019-07-31 19:53:23
 * @LastEditors: yfye
 * @LastEditTime: 2021-01-25 21:37:42
 * @Author: yeyifu
 * @LastModifiedBy: yeyifu
 -->
<style lang="less">
@import "./login.less";
</style>

<template>
  <div class="login" @keydown.enter="handle">
    <div class="login-con">
      <Card :bordered="false">
        <p slot="title">
          <Icon type="log-in"></Icon>欢迎登录
        </p>
        <div class="form-con">
          <Form ref="form" :model="form" :rules="rules">
            <FormItem prop="mobile">
              <Input v-model.number="form.mobile" :disabled="btnDisable" placeholder="请输入手机号">
                <span slot="prepend">
                  <Icon :size="16" type="person"></Icon>
                </span>
              </Input>
            </FormItem>

            <FormItem prop="password">
              <Input
                type="password"
                v-model="form.password"
                :disabled="btnDisable"
                placeholder="请输入密码"
              >
                <span slot="prepend">
                  <Icon :size="14" type="locked"></Icon>
                </span>
              </Input>
            </FormItem>

            <FormItem style="margin-top:10px">
              <Button @click="handle('form')" type="primary" long>登录</Button>
            </FormItem>
            <p style="color:red;text-align:center" v-if="messshow">{{errormessage}}</p>
            <div>
              没有账户？请在这里
              <span style="color:rgb(60, 106, 233);cursor:pointer;" @click="hreftwo">注册</span>。
            </div>
          </Form>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie';

import { setStore } from '@/config/storage';
import { Login } from '@/service/getData';

export default {
    data () {
        const validateMobile = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入手机号'));
            } else {
                let re = /^1\d{10}$/;
                if (re.test(value)) {
                    callback();
                } else {
                    callback(new Error('手机号格式不正确'));
                }
            }
        };
        const validatePwsd = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入密码'));
            } else {
                let len = value.length;
                if (len >= 6 && len <= 8) {
                    callback();
                } else {
                    callback(new Error('请输入6~8位密码'));
                }
            }
        };
        return {
            btnDisable: false,
            form: {
                mobile: null,
                password: null
            },
            messshow: false,
            errormessage: null,
            rules: {
                mobile: [
                    { validator: validateMobile, required: true, trigger: 'blur' }
                ],
                password: [{ validator: validatePwsd, required: true, trigger: 'blur' }]
            },
            permissions: {}
        };
    },
    mounted () {
        this.getUserIP(ip => {
            this.ip = ip;
        });
    },
    methods: {
        hreftwo () {
            this.$router.push({ path: '/register' });
        },
        handle (name) {
            this.$refs[name].validate(valid => {
                if (valid) {
                    Login({ username: this.form.mobile, password: this.form.password, ip: '10.20.30.40' })
                        .then(res => {
                            if (res.code == 0) {
                                if (res.data.admin.status === '1') {
                                    this.$Message.warning('已经封号，请联系管理员进行解封');
                                    return;
                                }
                                if (this.moment(res.data.secretDetail.overTime).format('YYYY-MM-DD HH:mm:ss') <= this.moment(new Date()).format('YYYY-MM-DD HH:mm:ss')) {
                                    this.$Message.warning('密钥已过期，请联系管理员');
                                    return;
                                }
                                // 都没有过期的情况下判断还有多久过期
                                let overTime = this.moment(this.moment(res.data.secretDetail.overTime).format('YYYY-MM-DD HH:mm:ss')).valueOf();
                                let nowTime = this.moment(this.moment(new Date()).format('YYYY-MM-DD HH:mm:ss')).valueOf();
                                let gap = Math.ceil((overTime - nowTime) / 1000 / 60 / 60 / 24);
                                if (gap <= 3) {
                                    setStore('lastTime', gap);
                                }
                                let permissions = res.data.permissions;
                                //  拿到token
                                localStorage.setItem('token', res.data.token);
                                permissions.map((item, index) => {
                                    permissions[index].id = item.menuId;
                                    permissions[index].title = item.name;
                                    permissions[index].description = item.name;
                                    permissions[index].sort = item.orderNum;
                                    item.submenus.map((childitem, childindex) => {
                                        item.submenus[childindex].id = childitem.menuId;
                                        item.submenus[childindex].description = childitem.name;
                                        item.submenus[childindex].title = childitem.name;
                                        item.submenus[childindex].sort = childitem.orderNum;
                                    });
                                });
                                let admin = res.data.admin;
                                let userInfo = Object.assign({}, admin);
                                userInfo.id = admin.user_id;
                                userInfo.mobilePhone = admin.mobile;
                                userInfo.mobilePhone = admin.mobile;
                                Cookies.set('user', res.data.admin.username, { expires: 7 });
                                Cookies.set('userInfo', userInfo, { expires: 7 });
                                setStore('leftSidebarList', permissions);
                                this.$router.push({ name: 'home_index' });
                                window.location.reload();
                            } else {
                                this.$Message.error(res.msg);
                            }
                        })
                        .catch(err => {
                        });
                }
            });
        },
        getUserIP (onNewIP) {
            let MyPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
            let pc = new MyPeerConnection({
                iceServers: []
            });
            let noop = () => {
            };
            let localIPs = {};
            let ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g;
            let iterateIP = (ip) => {
                if (!localIPs[ip]) onNewIP(ip);
                localIPs[ip] = true;
            };
            pc.createDataChannel('');
            pc.createOffer().then((sdp) => {
                sdp.sdp.split('\n').forEach(function (line) {
                    if (line.indexOf('candidate') < 0) return;
                    line.match(ipRegex).forEach(iterateIP);
                });
                pc.setLocalDescription(sdp, noop, noop);
            }).catch((reason) => {
            });
            pc.onicecandidate = (ice) => {
                if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
                ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
            };
        }
    }
};
</script>