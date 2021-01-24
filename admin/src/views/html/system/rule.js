/*
 * @Description:验证规则
 * @version: 1.0
 * @Date: 2019-08-17 20:23:58
 * @LastEditors: yeyifu
 * @LastEditTime: 2019-08-17 21:13:38
 * @Author: yeyifu
 * @LastModifiedBy: yeyifu
 */
const ruleValidate = {
    username: [{
        required: true,
        message: '用户名不能为空',
        trigger: "blur"
    }],
    email: [{
            required: true,
            message: '邮箱不能为空',
            trigger: "blur"
        },
        {
            type: 'email',
            message: '邮箱格式不对',
            trigger: "blur"
        }
    ],
    mobile: [{
        required: true,
        message: '手机不能为空',
        trigger: "blur"
    }],
    password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
        },
        {
            type: 'string',
            min: 8,
            max: 20,
            message: '密码长度不小于8且不大于20',
            trigger: 'blur'
        }
    ]

};

export default ruleValidate;