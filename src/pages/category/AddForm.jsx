import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Select, Input } from 'antd'

const Item = Form.Item
const Option = Select.Option

export default class AddForm extends Component {

    static propTypes = {
        categorys: PropTypes.array.isRequired,
        parentId: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired
    }

    componentDidMount(){
        this.props.setForm(this.form)

        this.form.setFieldsValue({
            parentId: this.props.parentId,
            categoryName: ''
        })
    }

    componentDidUpdate() {
        this.form.setFieldsValue({
            parentId: this.props.parentId,
            categoryName: ''
        })
    }

    render() {

        const {categorys} = this.props

        return (
            <Form 
                ref={form => this.form = form}
            >
                <Item label="哪级分类" name="parentId">
                    <Select>
                        <Option value='0'>一级分类</Option>
                        {
                            categorys.map(item => <Option key={item._id} value={item._id}>{item.name}</Option>)
                        }
                    </Select>
                </Item>
                
                <Item label="分类名称" name="categoryName">
                    <Input placeholder='请输入分类名称' />
                </Item>

            </Form>
        )
    }
}
