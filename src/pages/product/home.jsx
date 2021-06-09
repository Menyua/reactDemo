import React, { Component } from 'react'
import { Table, Space, Button, Card, Select, Input, message } from 'antd'
import {PlusOutlined} from '@ant-design/icons'
import * as API from '../../api'

const Option = Select.Option

export default class ProductHome extends Component {

    state = {
        loading: false,
        products: [],
        current: 1,
        pageSize: 5,
        searchType: "productName",
        searchName: ""
    }

    // 初始化商品列表column
    initColumns = () => {
        this.columns = [
        {
            title: '商品名称',
            dataIndex: 'name'
        },
        {
            title: '商品描述',
            dataIndex: 'desc'
        },
        {
            title: '价格',
            dataIndex: 'price',
            render: price => `￥${price}`
        },
        {
            title: '状态',
            dataIndex: 'status',
            render: (status, product) => {
                return (
                    <Space>
                        <Button type="primary" onClick={() => this.updateProductStatus(product._id, status)}>{status === 0 ? '上架' : '下架'}</Button>
                        {status === 0 ? '已下架' : '在售'}
                    </Space>
            )}
        },
        {
            title: '操作',
            render: (product) => {
                return (
                    <Space>
                        <a onClick={() => this.props.history.push("/product/detail", product)}>详情</a>
                        <a onClick={() => this.props.history.push("/product/addupdate", product)}>修改</a>
                    </Space>
            )}
        },
    ]
    }

    // 获取商品列表
    getProducts = async () => {
        const {current, pageSize, searchType, searchName} = this.state

        this.setState({loading: true})
        let result
        if (!searchName) {
            result =  await API.reqGetProducts(current, pageSize)
        } else {
            result = await API.reqSearchProducts(1, pageSize, searchType, searchName)
        }
        this.setState({loading: false})

        if (result.status === 0) {
            const {list, pageNum, pageSize} = result.data
            this.setState({
                products: list,
                current: pageNum,
                pageSize
            })
        }
    }

    // 改变页码发ajax请求
    tableChange = (pagination) => {
        const {current, pageSize} = pagination

        this.setState({current, pageSize}, () => {
            this.getProducts()
        })
    }

    updateProductStatus = async (productId, status) => {
        const result = await API.reqUpdateProductStatus(productId, status === 0 ? 1 : 0)
        console.log(result)
        if (result.status === 0) {
            message.success(status === 0 ? "上架成功" : "下架成功")
            this.getProducts()
        } else {
            message.error(result.msg)
        }
    }

    componentDidMount() {
        this.initColumns()
        this.getProducts()
    }

    render() {
        const {products, loading, current, pageSize, searchType, searchName} = this.state

        const title = (
            <span>
                <Select value={searchType} onChange={value => this.setState({searchType: value})}>
                    <Option value="productName">按名称搜索</Option>
                    <Option value="productDesc">按描述搜索</Option>
                </Select>
                <Input value={searchName} onChange={event => this.setState({searchName: event.target.value})} placeholder="关键字" style={{margin: "0 15px", width: 200}} />
                <Button type="primary" onClick={this.getProducts}>搜索</Button>
            </span>
        )
    
        const extra = (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => this.props.history.push("/product/addupdate")}>添加商品</Button>
        )

        return (
            <div>
                <Card title={title} extra={extra}>
                    <Table 
                        rowKey="_id"
                        bordered
                        loading={loading}
                        columns={this.columns}
                        dataSource={products}
                        pagination={{current, pageSize}}
                        onChange={this.tableChange}
                    />
                </Card>
            </div>
        )
    }
}
