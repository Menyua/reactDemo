import React, { Component } from 'react'
import { Card, List, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

import * as API from '../../api'
import './detail.less'

const Item = List.Item

export default class ProductDetail extends Component {

    getCategorys = async (pCategoryId, categoryId) => {

        if (pCategoryId === "0") {
            const category = await API.reqGetCategory(categoryId)
            if (category.status === 0) {
                const pName = category.data.name
                this.setState({pName})
            } else {
                message.error(category.msg)
            }
        } else {
            // 效率不太行
            // const pCategory = await API.reqGetCategory(pCategoryId)
            // const category = await API.reqGetCategory(categoryId)
            const results = await Promise.all([API.reqGetCategory(pCategoryId), API.reqGetCategory(categoryId)])
            if (results[0].status === 0 && results[1].status === 0) {
                const pName = results[0].data.name
                const name = results[1].data.name
                this.setState({pName, name})
            } else {
                message.error(results[0].msg)
            }
        }

        // const result = await API.reqCategorys("0")
        // if (result.status === 0) {
        //     if (pCategoryId === "0") {
        //         const targetOption = result.data.find(item => item._id === categoryId)
        //         const pName =  targetOption.name
        //         this.setState({pName})
        //     } else {
                
        //         const targetOption = result.data.find(item => item._id === pCategoryId)
        //         const pName =  targetOption.name
        //         // 查找二级分类
        //         const subCategorys = await API.reqCategorys(pCategoryId)
        //         const targetSubOption = subCategorys.data.find(item => item._id === categoryId)
        //         const name = targetSubOption.name

        //         this.setState({pName, name})
        //     }
        // } else {
        //     message.error(result.msg)
        // }
        
    }

    constructor(props) {
        super(props)

        this.product = props.location.state
        const {pCategoryId, categoryId} = this.product
        this.getCategorys(pCategoryId, categoryId)

        this.state = {
            pName: "",
            name: ""
        }
    }

    render() {

        const title = (
            <div>
                <a onClick={() => this.props.history.goBack()}><ArrowLeftOutlined /></a>
                <span style={{margin: "0 10px"}}>商品详情</span>
            </div>
        )

        const product = this.product
        const {pName, name} = this.state

        return (
            <Card
                title={title}
                className="product-detail"
            >
                <List className="product-detail-list">
                    <Item className="list-item">
                        <span className="product-lable">商品名称：</span>
                        <span>{product.name}</span>
                    </Item>
                    <Item className="list-item">
                        <span className="product-lable">商品描述：</span>
                        <span>{product.desc}</span>
                    </Item>
                    <Item className="list-item">
                        <span className="product-lable">商品价格：</span>
                        <span>{`${product.price}元`}</span>
                    </Item>
                    <Item className="list-item">
                        <span className="product-lable">所属分类：</span>
                        <span>{product.pCategoryId === "0" ? pName : pName + "-->" + name}</span>
                    </Item>
                    <Item className="list-item">
                        <span className="product-lable">商品图片：</span>
                        <span>
                            {
                            product.imgs.map(item => (
                                <img src={`http://localhost:5000/upload/${item}`} style={{width: 50, marginRight: 10}} />
                            ))
                        }
                        </span>
                        
                    </Item>
                    <Item className="list-item">
                        <span className="product-lable">商品详情：</span>
                        <span dangerouslySetInnerHTML={{__html: product.detail}}></span>
                    </Item>
                </List>
            </Card>
        )
    }
}
