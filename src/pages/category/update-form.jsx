import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input } from 'antd'


const Item = Form.Item

export default class UpdateForm extends Component {

    static propTypes = {
        categoryName: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired
    }

    form = React.createRef()

    componentDidMount() {
        // 把form实例给父组件
        this.props.setForm(this.form)

        // 第一次挂载之后，设置表单字段的值
        this.form.current.setFieldsValue({
            categoryName: this.props.categoryName
        })
    }

    componentDidUpdate() {
        // 更新之后，设置表单字段的值
        this.form.current.setFieldsValue({
            categoryName: this.props.categoryName
        })
    }
    
    render() {

        return (
            <Form 
                ref={this.form}
            >
                <Item name="categoryName" rules={[
                    {
                        required: true,
                        message: "分类名不能是空的！"
                    }
                    ]}>
                    <Input placeholder='请输入分类名称' />
                </Item>
            </Form>
        )
    }
}
