import React, { Component } from 'react'
import { Card, Table, Button, message, Modal } from 'antd'
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons'
import * as API from '../../api'
import AddForm from './AddForm'
import UpdateForm from './update-form'

/**
 * 商品分类路由
 */
export default class Category extends Component {

    state = {
        loading: false,
        categorys: [],// 一级分类列表
        subCategorys: [],// 二级分类列表
        parentId: '0',// 当前分类的id
        parentName: '',
        modalStatus: 0,
    }

    /**
     * 初始化Table列的数组
     */
    initColumns = () => {
        this.columns = [
            {
                title: '分类名称',
                dataIndex: 'name',
                width: '70%',
            },
            {
                title: '操作',
                render: (category) => (
                    <span>
                        <a onClick={() => this.updateCategoryBtn(category)}>修改分类</a>&nbsp;&nbsp;
                        {
                            this.state.parentId === '0' ? <a onClick={() => this.getSubCategorys(category)}>查看子分类</a> : null
                        }
                    </span>
                )
            }
        ];
    }

    /**
     * 异步获取一级/二级分类category列表
     */
    getCategorys = async () => {
        this.setState({loading: true})
        // 发异步ajax请求，获取数据
        const result = await API.reqCategorys(this.state.parentId)
        this.setState({loading: false})

        if (result.status === 0) {
            const categorys = result.data
            // 拿到数据，更新state状态
            if (this.state.parentId === '0') {
                this.setState({categorys})
            } else {
                this.setState({subCategorys: categorys})
            }
        } else {
            message.error('获取分类列表失败！')
        }
    }

    /**
     * 获取一级分类列表
     */
    getFirstCategprys = () => {
        this.setState({
            parentId: '0'

        }, () => {
            this.getCategorys()
        })
    }

    /**
     * 获取二级分类列表
     */
    getSubCategorys = (category) => {
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => {
            this.getCategorys(this.state.parentId)
        })
    }

    /**
     * 添加分类按钮回调
     */
    addCategoryBtn = () => {
        this.setState({
            modalStatus: 1
        })
    }

    /**
     * 发送ajax请求添加分类
     */
    addCategory = async () => {

        const parentId = this.form.getFieldValue("parentId")
        const categoryName = this.form.getFieldValue("categoryName")

        const result = await API.reqAddCategory({
            parentId,
            categoryName,
        })

        if (result.status === 0 && parentId === this.state.parentId) {
            // 重新获取分类列表显示
            this.getCategorys()
        } else {
            console.log(result)
        }

        // 隐藏确认框
        this.setState({
            modalStatus: 0
        })
    }

    /**
     * 更新分类按钮回调
     */
    updateCategoryBtn = (category) => {

        this.category = category

        this.setState({
            modalStatus: 2,
        })
    }

    /**
     * 发送ajax请求更新分类
     */
    updateCategory = () => {

        this.form.current.validateFields(["categoryName"]).then(async values => {
            const {categoryName} = values

            const reslut = await API.reqUpdateCategory({
                categoryId: this.category._id,
                categoryName
            })

            if (reslut.status === 0) {
                this.getCategorys()
            }

            this.setState({
                modalStatus: 0
            })
        })

        
    }

    /**
     * 关闭Modal组件
     */
    handleCancel = () => {
        this.setState({
            modalStatus: 0
        })
    }

    /**
     * 为第一次render()准备数据
     */
    componentWillMount() {
        this.initColumns()
    }

    /**
     * 执行异步任务：发异步ajax请求
     */
    componentDidMount() {
        this.getCategorys()
    }

    render() {
        const { categorys, subCategorys, loading, parentId, parentName, modalStatus } = this.state
        const category = this.category || {}

        // card的左侧
        const title = parentId === '0' ? "一级分类列表" : (
            <span>
                <a onClick={this.getFirstCategprys}>一级分类列表</a>
                <ArrowRightOutlined style={{marginRight: '5px'}} />
                <span>{parentName}</span>
            </span>
        )
        // card的右侧
        const extra = (
            <Button type="primary" icon={<PlusOutlined />} onClick={this.addCategoryBtn}>添加</Button>
        )

        return (
            <div>
                <Card title={title} extra={extra}>
                    <Table
                        bordered
                        rowKey="_id"
                        loading={loading}
                        dataSource={parentId === '0' ? categorys : subCategorys}
                        columns={this.columns} 
                        pagination={{defaultPageSize: 5, showQuickJumper: true}}
                    />
                </Card>

                <Modal title="添加分类" visible={modalStatus===1} onOk={this.addCategory} onCancel={this.handleCancel}>
                    <AddForm categorys={categorys} parentId={parentId} setForm={form => {this.form = form}} />
                </Modal>

                <Modal title="更新分类" visible={modalStatus===2} onOk={this.updateCategory} onCancel={this.handleCancel}>
                    <UpdateForm categoryName={category.name || ''} setForm={(form) => {this.form = form}} />
                </Modal>

            </div>
        )
    }
}
