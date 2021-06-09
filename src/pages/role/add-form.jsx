import React, { Component } from 'react'
import { Form, Input } from 'antd'

const Item = Form.Item

export default class AddForm extends Component {

    constructor(props) {
        super(props)
        this.formRef = React.createRef()
    }

    render() {
        return (
            <Form ref={this.formRef}>
                <Item 
                    label="角色名称" 
                    name="roleName"
                    rules={[
                        {
                            required: true,
                            message: '角色名不能为空！',
                        }
                    ]}
                >
                    <Input placeholder="请输入角色名称" />
                </Item>
            </Form>
        )
    }
}
