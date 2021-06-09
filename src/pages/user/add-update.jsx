import React, { Component } from 'react'
import { Form, Input, Select } from 'antd'
import PropTypes from 'prop-types'

import './index.less'

const Item = Form.Item
const Option = Select.Option

export default class UserAddUpdate extends Component {

    static propTypes = {
        user: PropTypes.object.isRequired,
        roles: PropTypes.array.isRequired,
    }

    getRolesName = async () => {
        const roles = this.props.roles
        if (roles) {
            const rolesName = roles.map(item => <Option key={item._id} value={item._id}>{item.name}</Option>)
            this.setState({rolesName})
        }
    }

    constructor(props) {
        super(props)
        this.formRef = React.createRef()
        this.state = {
            rolesName: null
        }
    }

    componentDidMount() {
        this.getRolesName()
        const user = this.props.user
        if (user._id) {
            this.formRef.current.setFieldsValue({
                username: user.username,
                phone: user.phone,
                email: user.email,
                role_id: user.role_id,
            })
        }
    }

    componentDidUpdate() {
        const user = this.props.user
        if (user) {
            this.formRef.current.setFieldsValue({
                username: user.username,
                phone: user.phone,
                email: user.email,
                role_id: user.role_id,
            })
        } else {
            this.formRef.current.resetFields()
        }
    }

    render() {

        const {rolesName} = this.state
        const {user} = this.props

        return (
            <Form
                ref={this.formRef}
                labelCol={{span: 5}}
                wrapperCol={{span: 19}}
            >
                <Item label="用户名" name="username">
                    <Input className="user-addupdate-form-item" />
                </Item>
                {
                    user._id ? "" : 
                    <Item label="密码" name="password">
                        <Input className="user-addupdate-form-item" type="password" />
                    </Item>
                }
                <Item label="手机号" name="phone">
                    <Input className="user-addupdate-form-item" />
                </Item>
                <Item label="邮箱" name="email">
                    <Input className="user-addupdate-form-item" />
                </Item>
                <Item label="角色" name="role_id">
                    <Select style={{width: 200}} >
                        {rolesName}
                    </Select>
                </Item>
            </Form>
        )
    }
}
