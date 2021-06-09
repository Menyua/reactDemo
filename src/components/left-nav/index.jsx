import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu } from 'antd';

import './index.less'
import logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig'
import memoryUtils from '../../utils/memoryUtils'


const { SubMenu } = Menu;

class LeftNav extends Component {

    /**
     * 根据menuList生成导航栏菜单
     * map() + 递归
     */
    getMenuNodes = (menuList) => {
        const pathname = this.props.location.pathname
        const {username, role} = memoryUtils.user

        return menuList.map(item => {
            if (item.children) {
                const hasMenu = item.children.find(item => {
                    return role.menus.indexOf(item.key) !== -1
                })
                if (!hasMenu && username !== "admin") {
                    return null
                }
                return (
                    <SubMenu key={item.key} icon={item.icon} title={item.title}>
                        {
                            this.getMenuNodes(item.children)
                        }
                    </SubMenu>
                )
            } else {
                if (role.menus.indexOf(item.key) === -1 && username !== "admin") {
                    return null
                }
                if (pathname.indexOf(item.key) === 0) {
                    this.path = item.key
                }

                return (
                    <Menu.Item key={item.key} icon={item.icon}>
                        <Link to={item.key}>{item.title}</Link>
                    </Menu.Item>
                )
            }
        })
    }

    componentDidMount() {
        
    }

    render() {

        const menuListDom = this.getMenuNodes(menuList)

        return (
            <div className="left-nav">
                <Link to="/" className='left-nav-header'>
                    <img src={logo} alt=""/>
                    <h1>情感后台</h1>
                </Link>
                
                {/* <Button type="primary" onClick={this.toggleCollapsed} style={{ marginBottom: 16 }}>
                    {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
                </Button> */}
                <Menu
                    selectedKeys={[this.path]}
                    mode="inline"
                    theme="dark"
                >
                    {
                        menuListDom
                    }
                </Menu>
            </div>
            
        )
    }
}

/**
 * withRouter高阶组件
 * 
 */
export default withRouter(LeftNav)
