import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Layout } from 'antd'

import Header from '../../components/header'
import LeftNav from '../../components/left-nav'
import memoryUtils from '../../utils/memoryUtils'
import Home from '../home'
import Category from '../category'
import Product from '../product'
import Role from '../role'
import User from '../user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'


const { Sider, Content, Footer } = Layout

export default class Admin extends Component {

    render() {
        const user = memoryUtils.user;

        // 如果内存中没有存user
        if (!user || !user._id) {
            return <Redirect to='/login' />
        }
        return (
            <Layout style={{height: '100%'}}>
                <Sider>
                    <LeftNav/>
                </Sider>
                <Layout>
                    <Header />
                    <Content style={{margin: "20px", backgroundColor: "white"}}>
                        <Switch>
                            <Route path="/home" component={Home} />
                            <Route path="/category" component={Category} />
                            <Route path="/product" component={Product} />
                            <Route path="/role" component={Role} />
                            <Route path="/user" component={User} />
                            <Route path="/bar" component={Bar} />
                            <Route path="/line" component={Line} />
                            <Route path="/pie" component={Pie} />
                            <Redirect to="/home" />
                        </Switch>
                    </Content>
                    <Footer style={{textAlign: "center", color: "gray"}}>晚上联系我，我是个负责的男人！</Footer>
                </Layout>
            </Layout>
        )
    }
}
