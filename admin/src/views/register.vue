<!--
 * @Description: 
 * @version: 
 * @Date: 2019-07-31 19:53:23
 * @LastEditors: yeyifu
 * @LastEditTime: 2019-08-18 11:59:17
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
					<Icon type="log-in"></Icon> 欢迎注册
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
							<Input type="password" v-model="form.password" :disabled="btnDisable" placeholder="请输入密码">
								<span slot="prepend">
									<Icon :size="14" type="locked"></Icon>
								</span>
							</Input>
						</FormItem>

                        <FormItem prop="secretKey">
							<Input type="password" v-model="form.secretKey" :disabled="btnDisable" placeholder="请输入密钥">
								<span slot="prepend">
									<Icon :size="14" type="locked"></Icon>
								</span>
							</Input>
						</FormItem>

						<FormItem style="margin-top:10px">
							<Button @click="handle('form')" type="primary" long>确定</Button>
						</FormItem>
						 <div>已注册？请在这里<span style="color:rgb(60, 106, 233);cursor:pointer;" @click="hreftwo">登录</span>。
            </div>
					</Form>
				</div>
			</Card>
		</div>
	</div>
</template>
<script>
import { Register } from '@/service/getData';

export default {
    name: 'register',
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
                password: null,
                secretKey: null
            },
            messshow: false,
            errormessage: null,
            rules: {
                mobile: [{ validator: validateMobile, required: true, trigger: 'blur' }],
                password: [{ validator: validatePwsd, required: true, trigger: 'blur' }],
                secretKey: [{ required: true, message: '请输入密钥', trigger: 'blur' }]
            },
            permissions: {}
        };
    },
    methods: {
        handle (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let time = this.moment().format('YYYY-MM-DD HH:mm:ss');
                    Register({ username: this.form.mobile, password: this.form.password, secretKey: this.form.secretKey, time: time })
                        .then(res => {
                            if (res.status == '200') {
                                this.$Message.success(res.msg);
                                this.$router.push({path: '/login'});
                            } else {
                                this.$Message.error(res.msg);
                            }
                        })
                        .catch(err => {
                        });
                }
            });
        },
        hreftwo () {
            this.$router.push({ path: '/login' });
        }
    },
    created () {}
};
</script>