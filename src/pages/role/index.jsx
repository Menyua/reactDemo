import React, { Component } from 'react'
import { Card, Button, Table, message, Modal } from 'antd'

import * as API from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'
import memoryUtils from '../../utils/memoryUtils'
import {getTime} from '../../utils/dateUtils'

export default class Role extends Component {

    /**
     * 表格
     */
    initColumns = () => {
        this.columns = [
            {
                title: "角色名称",
                dataIndex: "name"
            },
            {
                title: "创建时间",
                dataIndex: "create_time",
                render: getTime
            },
            {
                title: "授权时间",
                dataIndex: "auth_time",
                render: getTime
            },
            {
                title: "授权人",
                dataIndex: "auth_name"
            }
        ]
    }

    getRoles = async () => {
        const result = await API.reqGetRoles()
        if (result.status === 0) {
            this.setState({roles: result.data})
        } else {
            message.error(result.msg)
        }
    }

    onRow = (roleSelected) => {
        return {
            onClick: event => {
                const { role } = this.state
                if (roleSelected._id === role._id) {
                    this.setState({role: {}})
                } else {
                    this.setState({role: roleSelected})
                }
                
            }
        }
    }

    // 创建角色按钮
    showAddRole = () => {
        this.setState({visibleAddRole: true})
    }

    showAuth = () => {
        this.setState({visibleAuth: true})
    }

    /**
     * 弹框
     */
    // 添加角色
    addRole = () => {
        const { formRef } = this.addFormRef.current
        formRef.current.validateFields().then(async values => {
            const { roleName } = values
            const result = await API.reqAddRole({roleName})
            if (result.status === 0) {
                message.success("添加角色成功！")
                this.getRoles()
                this.handleCancel()
            } else {
                message.error("添加角色失败！")
            }
         })
    }

    handleCancel = () => {
        const { formRef } = this.addFormRef.current
        formRef.current.resetFields()
        this.setState({visibleAddRole: false})
    }

    updateRoleAuth = async () => {
        const { user } = memoryUtils
        const { role } = this.state
        const { checkedKeys } = this.updateRoleRef.current
        const result = await API.reqUpdateRoleAuth({
            _id: role._id,
            menus: checkedKeys,
            auth_time: getTime(),
            auth_name: user.username
        })

        if (result.status === 0) {
            message.success("修改成功！")
            this.setState({visibleAuth: false})
        } else {
            message.error("修改失败！")
        }
    }

    constructor(props) {
        super(props)
        this.initColumns()
        this.addFormRef = React.createRef()
        this.updateRoleRef = React.createRef()
        this.state = {
            roles: [],
            role: {}, // 选中的role
            visibleAddRole: false,
            visibleAuth: false,
        }
    }

    componentDidMount() {
        this.getRoles()
    }

    render() {

        const { roles, role, visibleAddRole, visibleAuth } = this.state

        const title = (
            <div>
                <Button type="primary" style={{margin: "0 10px"}} onClick={this.showAddRole}>创建角色</Button>
                <Button type="primary" disabled={!role._id} onClick={this.showAuth}>设置角色权限</Button>
            </div>
        )

        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={roles}
                    columns={this.columns}
                    pagination={{defaultPageSize: 5}}
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys: [role._id],
                        onSelect: (role) => {
                            this.setState({role})
                        }
                    }}
                    onRow={this.onRow}
                />
                <Modal
                    title="添加角色"
                    visible={visibleAddRole}
                    onOk={this.addRole}
                    onCancel={this.handleCancel}
                >
                    <AddForm ref={this.addFormRef} />
                </Modal>
                <Modal
                    title="设置角色权限"
                    visible={visibleAuth}
                    onOk={this.updateRoleAuth}
                    onCancel={() => {this.setState({visibleAuth: false})}}
                >
                    <UpdateForm ref={this.updateRoleRef} role={role} />
                </Modal>
            </Card>
        )
    }
}
