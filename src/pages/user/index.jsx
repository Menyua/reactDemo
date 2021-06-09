import React, { Component } from 'react'
import { Table, Card, Button, Modal, message, Popconfirm } from 'antd'
import UserAddUpdate from './add-update'

import * as API from '../../api'
import {getTime} from '../../utils/dateUtils'


export default class User extends Component {

    init = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username',
            },
            {
                title: '邮箱',
                dataIndex: 'email',
            },
            {
                title: '电话',
                dataIndex: 'phone',
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: getTime
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                render: (role_id) => {
                    const {roles} = this.state
                    const role = roles.find(item => item._id === role_id)
                    if (role) {
                        return role.name
                    }
                }
            },
            {
                title: '操作',
                render: (user) => (
                    <div>
                        <a onClick={() => this.updateUser(user)}>修改</a>
                        <Popconfirm
                            title="确认删除吗?"
                            okText="确认"
                            cancelText="取消"
                            onConfirm={() => this.deleteUser(user)}
                        >
                            <a style={{marginLeft: "10px"}}>删除</a>
                        </Popconfirm>
                    </div>
                )
            },
        ]
        this.title = (
            <Button type="primary" onClick={this.addUser}>创建用户</Button>
        )
    }

    getUsersAndRoles = async () => {
        const result = await API.reqGetUsers()
        if (result.status === 0) {
            this.setState({
                users: result.data.users,
                roles: result.data.roles
            })
        } else {
            message.error(result.msg)
        }
    }

    addUser = () => {
        this.setState({isUpdate: false, visible: true})
    }

    updateUser = (user) => {
        this.user = user
        this.setState({isUpdate: true, visible: true})
    }

    deleteUser = async (user) => {
        const result = await API.reqDeleteUser(user._id)
        if (result.status === 0) {
            message.success("删除成功！")
            this.getUsersAndRoles()
        } else {
            message.success("删除失败！")
            console.log(result.msg)
        }
    }

    onModalOk = async () => {

        const {username, password, phone, email, role_id} = this.addupdateRef.current.formRef.current.getFieldsValue()
        const {isUpdate} = this.state
        if (isUpdate) {
            const {_id} = this.user
            const result = await API.reqUpdateUser({
                _id, username, phone, email, role_id
            })
            if (result.status === 0) {
                message.success("修改成功！")
                this.setState({visible: false})
                this.getUsersAndRoles()
            } else {
                message.success("修改失败！")
                console.log(result.msg)
            }
        } else {
            
            const result = await API.reqAddUser({
                username, password, phone, email, role_id
            })
            if (result.status === 0) {
                message.success("添加成功！")
                this.setState({visible: false})
                this.getUsersAndRoles()
            } else {
                message.success("添加失败！")
                console.log(result.msg)
            }
        }
    }

    onModalCancel = () => {
        this.setState({visible: false})
    }

    constructor(props) {
        super(props)
        this.addupdateRef = React.createRef()
        this.init()
        this.state = {
            users: [],
            isUpdate: false,
            visible: false,
            roles: []
        }
    }

    componentDidMount() {
        this.getUsersAndRoles()
    }

    render() {

        const {users, roles, isUpdate, visible} = this.state

        return (
            <div>
                <Card title={this.title}>
                    <Table
                        rowKey="_id"
                        columns={this.columns}
                        dataSource={users}
                    />
                    <Modal
                        title={isUpdate ? "修改用户" : "创建用户"}
                        visible={visible}
                        onOk={this.onModalOk}
                        onCancel={this.onModalCancel}
                    >
                        <UserAddUpdate ref={this.addupdateRef} user={isUpdate ? this.user : {}} roles={roles} />
                    </Modal>
                </Card>
                
            </div>
        )
    }
}
