import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import {getTime} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import {reqWeather} from '../../api'
import menuList from '../../config/menuConfig'

import './index.less'

class Header extends Component {

    state = {
        currentTime: getTime(Date.now()),
        wea: '',
        tem: '',
        week: '',
    }

    getTime = () => {
        this.timer = setInterval(() => {
            const currentTime = getTime(Date.now())
            this.setState({currentTime})
        }, 1000);
    }

    getWeather = async () => {
        const {wea, tem, week} = await reqWeather('中山')
        this.setState({wea, tem, week})
    }

    getTitle = (menuList) => {
        const pathname = this.props.location.pathname
        menuList.forEach(item => {
            if (pathname.indexOf(item.key) !== -1) {
                this.title = item.title
            } else if (item.children) {
                this.getTitle(item.children)
            }
        })
    }

    loginOut = () => {
        Modal.confirm({
            title: '确认退出吗？',
            icon: <ExclamationCircleOutlined />,
            onOk: () => {
                memoryUtils.user = {}
                storageUtils.removeUser()
                this.props.history.replace('/login')
            },
            onCancel() {
              console.log('Cancel');
            },
          })
        
    }

    /**
     * 一般用来发送ajax请求，或者设置定时器
     */
    componentDidMount() {
        this.getTime()
        this.getWeather()
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    render() {

        const {currentTime, wea, tem, week} = this.state
        const username = memoryUtils.user.username
        
        this.getTitle(menuList)

        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎，{username}</span>
                    <a href="#!" onClick={this.loginOut}>退出</a>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{this.title}</div>
                    <div className="header-bottom-right">
                        <div>{week}</div>
                        <div>{currentTime}</div>
                        <div>{wea}</div>
                        <div>{tem}</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)
