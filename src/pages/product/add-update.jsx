import React, { Component } from 'react'
import { Card, Form, Input, message, Button, Cascader } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import RichTextEditor from './rich-text-editor'

import * as API from '../../api'
import PicturesWall from './pictures-wall'

const Item = Form.Item
const {TextArea} = Input


export default class ProductAddUpdate extends Component {

    /**
     * 表单校验
     */
    validatorPrice = (_, value) => {
        if (value < 0) {
            return Promise.reject(new Error("价格需要高于0元！"))
        }

        return Promise.resolve()
    }

    /**
     * 返回到商品列表
     */
    backProducts = () => {
        this.props.history.goBack()
    }

    /**
     * 发送ajax请求添加商品
     */
    addUpdateProduct = () => {

        this.formRef.validateFields().then(async values => {

            const {_id} = this.product
            const {categoryId, name, desc, price} = values
            const imgs =  this.pwRef.current.getImgs()
            const detail = this.rteRef.getContentValue()

            let result
            if (this.isUpdate) {
                result = await API.reqUpdateProduct({
                    _id,
                    pCategoryId: categoryId[0],
                    categoryId: !categoryId[1] ? "" : categoryId[1],
                    name,
                    desc,
                    price,
                    detail,
                    imgs,
                })
            } else {
                result = await API.reqAddProduct({
                    pCategoryId: categoryId[0],
                    categoryId: !categoryId[1] ? "" : categoryId[1],
                    name,
                    desc,
                    price,
                    detail,
                    imgs,
                })
            }
            

            if (result.status === 0) {
                message.success(this.isUpdate ? "修改成功！" : "添加成功！")
                this.props.history.replace('/product')
            } else {
                message.error(this.isUpdate ? "修改失败！" : "添加失败！")
            }
        })

        
    }

    /**
     * 商品分类级联
     */
    initOptionLists = async () => {
        let options = []
        const result = await API.reqCategorys('0')
        if (result.status === 0) {
            options = result.data.map(item => (
                {
                    value: item._id,
                    label: item.name,
                    isLeaf: false,
                }
            ))

            if (this.isUpdate && this.product.pCategoryId !== "0") {
                const result = await API.reqCategorys(this.product.pCategoryId)
                const subCategorys = result.data
                const childOptions = subCategorys.map(item => ({
                    value: item._id,
                    label: item.name,
                    isLeaf: true,
                }))

                const targetOption = options.find(item => item.value === this.product.pCategoryId)
                targetOption.children = childOptions
            }
        }

        this.setState({options})
    }

    loadData = async selectedOptions => {
        const targetOption = selectedOptions[0];
        console.log(targetOption)

        targetOption.loading = true;
        const reslut =  await API.reqCategorys(targetOption.value)
        targetOption.loading = false;

        if (reslut.status === 0) {
            if (reslut.data.length === 0) {
                targetOption.isLeaf = true
            }

            targetOption.children = reslut.data.map(item => (
                {
                    label: item.name,
                    value: item._id,
                }
            ))
        }

        this.setState([...this.state.options])

    }

    constructor(props) {
        super(props)
        this.state = {
            options: [],
        }
        this.pwRef = React.createRef()
        
        const product = this.props.location.state
        this.isUpdate = !!product
        this.product = product || {}
    }

    componentDidMount() {
        this.initOptionLists()
    }

    render() {
        
        const { options } = this.state
        const title = (
            <div>
                <a href="!#" onClick={this.backProducts} style={{margin: "0 10px"}}><ArrowLeftOutlined /></a>
                <span>{this.isUpdate ? "修改商品" : "添加商品"}</span>
            </div>
            
        )

        const categoryId = []
        if (this.isUpdate) {
            if (this.product.pCategoryId === "0") {
                categoryId.push("0")
            } else {
                categoryId.push(this.product.pCategoryId)
                categoryId.push(this.product.categoryId)
            }
        }
        

        return (
            <div>
                <Card title={title}>
                    <Form 
                        ref={form => this.formRef = form} 
                        labelCol={{span: 2}} 
                        wrapperCol={{span: 6}}
                        initialValues={{
                            name: this.product.name,
                            desc: this.product.desc,
                            price: this.product.price,
                            categoryId,
                            detail: this.product.detail,
                        }}
                    >
                        <Item 
                            label="商品名称"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: "你不写名称，它叫啥呢？"
                                }
                            ]}
                        >
                            <Input />
                        </Item>
                        <Item label="商品描述" name="desc">
                            <TextArea autoSize />
                        </Item>
                        <Item label="商品价格" name="price" rules={[{validator: this.validatorPrice}]}>
                            <Input type="number" addonAfter="元" />
                        </Item>
                        <Item label="商品分类" name="categoryId">
                            <Cascader options={options} loadData={this.loadData}/>
                        </Item>
                        <Item label="商品图片" name="imgs">
                            <PicturesWall ref={this.pwRef} imgs={this.product.imgs} />
                        </Item>
                        <Item label="商品详情" name="detail" labelCol={{span: 2}} wrapperCol={{span: 20}}>
                            <RichTextEditor ref={rteRef => this.rteRef = rteRef} detail={this.product.detail} />
                        </Item>
                        <Item style={{display: "flex", justifyContent: "flex-end"}}>
                            <Button onClick={this.addUpdateProduct} type="primary">确认</Button>
                        </Item>
                    </Form>
                </Card>
            </div>
        )
    }
}
