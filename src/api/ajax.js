/**
 * 定义一个发送异步ajax请求的函数模块
 * 封装axios库，返回值是Promise对象
 * 
 * 1、同一出库请求异常
 */
import {message} from 'antd'
import axios from 'axios'

 export default function ajax(url, type='GET', data={}) {

    return new Promise((resolve, reject) => {
        let promise
        // 1、执行异步ajax请求
        if (type === 'GET') {// 发GET请求
            promise = axios.get(url, {
                // 这是一个配置对象
                params: data
            })
        } else {
            promise = axios.post(url, data)
        }
        // 2、执行成功
        promise.then(response => {
            resolve(response.data)

        // 3、执行失败
        }).catch(err => {
            message.error('啊哦，出错了！/(ㄒoㄒ)/~~')
            console.log(err.message)
        })

    })



 }