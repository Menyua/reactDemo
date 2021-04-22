import React, { Component } from 'react'

import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import './login.less'
import logo from './images/logo.png'

export default class Login extends Component {


    // 该方法是校验通过了才会执行
    onFinish = (values) => {

        console.log('回调函数参数值：', values);

        // 获取强大功能的form对象 antd 4 不再流行
        // const form = this.props.form

        console.log(this.props)
        
        return Promise.resolve('发送ajax请求')
    }



    /**
     * 对密码进行自定义验证
     */
    validator = (rule, value) => {

        if (!value) {
            return Promise.reject(new Error('密码必须输入'))
        } else if (value.length < 4) {
            return Promise.reject(new Error('密码必须大于4位'))
        } else if (value.length > 12) {
            return Promise.reject(new Error('密码必须小于12位'))
        } else if (!/^[A-z0-9_]+$/.test(value)) {
            return Promise.reject(new Error('密码必须由字母数字下划线组成'))
        }

        return Promise.resolve()

    }

    render() {
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="啊哦！图片没了/(ㄒoㄒ)/~~" />
                    <h1>React项目：后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h2>用户登录</h2>
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{ remember: true }}
                        onFinish={this.onFinish}
                    >
                        <Form.Item
                            name="username"
                            rules={[
                                { required: true, message: '请输入你的用户名' },
                                { min: 4, message: '用户名最少4位' },
                                { max: 12, message: '用户名最多12位' },
                                { pattern: /^[A-z0-9_]+$/, message: '用户名必须以英文数字或者下划线组成' },
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ validator: this.validator}]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="密码"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>记住</Checkbox>
                            </Form.Item>

                            <a className="login-form-forgot" href="">
                            忘记密码
                            </a>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                            登录
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}

/**
 * 1、高阶函数
 * 2、高阶组件
 */

// 包装Form组件生存一个新的组件（该种方法 antd 4版本 已舍弃）
// const WrapLogin = Form.create()(Login)
// export default WrapLogin

/**
 * 1、前台表单验证
 * 2、收集表单输入数据
 */

