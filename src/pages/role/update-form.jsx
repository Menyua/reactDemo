import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Tree } from 'antd'

import menuList from '../../config/menuConfig'

const Item = Form.Item

export default class UpdateForm extends Component {

    static propTypes = {
        role: PropTypes.object
    }
    
    onCheck = (checkedKeys) => {
        this.setState({
            checkedKeys
        })
        // 用来给父组件发请求用
        this.checkedKeys = checkedKeys
    };

    constructor(props) {
        super(props)
        this.state = {
            checkedKeys: props.role.menus,
            preCheckedKeys: []
        }
    }

    static getDerivedStateFromProps(nextProps, preState) {
        const {menus} = nextProps.role
        const {preCheckedKeys} = preState
        if (menus !== preCheckedKeys) {
            return {
                checkedKeys: menus,
                preCheckedKeys: menus
            }
        }

        return null
    }

    render() {

        const { name } = this.props.role
        const { checkedKeys } = this.state
        console.log("render", checkedKeys)

        const treeNodes = [
            {
                title: "后台权限",
                key: "/",
                children: menuList
            }
        ]

        return (
            <div>
                <Item label="角色名称">
                    <Input value={name} disabled />
                </Item>
                <Item>
                    <Tree
                        checkable
                        defaultExpandAll
                        selectable={false}
                        onCheck={this.onCheck}
                        checkedKeys={checkedKeys}
                        treeData={treeNodes}
                    />
                </Item>
                
            </div>
        )
    }
}
