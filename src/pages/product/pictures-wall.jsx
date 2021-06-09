import React, { Component } from 'react'
import { Upload, Modal, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import * as API from '../../api'

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export default class PicturesWall extends Component {

    /**
     * 预览图片
     */
    handlePreview = async file => {
        console.log(file)
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };
    handleCancel = () => this.setState({ previewVisible: false });

    /**
     * 上传图片
     */
    handleChange = async ({ file, fileList }) => {
        console.log(file)
        if (file.status === "done") {
            const { name, url } = file.response.data
            file = fileList[fileList.length - 1]
            file.name = name
            file.url = url
            message.success("上传图片成功")
        } else if (file.status === "removed") {
            const { name } = file
            const result = await API.reqDelProductImg(name)
            if (result.status === 0) {
                message.success("删除图片成功")
            } else {
                console.log(result)
                message.error(result.msg)
            }
        } else if (file.status === "error") {
            message.error("上传图片失败")
        }

        this.setState({ fileList })
    };

    /**
     * 获取图片name数组
     */
    getImgs = () => {
        return this.state.fileList.map((file) => file.name)
    }

    constructor(props) {
        super(props)

        let fileList = []
        if (props.imgs && props.imgs.length > 0) {
            fileList = props.imgs.map((item, index) => ({
                uid: `-${index}`,
                name: item,
                status: 'done',
                url: `http://localhost:5000/upload/${item}`,
            }))
        }
        this.state = {
            previewVisible: false,
            previewImage: '',
            previewTitle: '',
            fileList
        };
    }

    render() {
        const { previewVisible, previewImage, fileList, previewTitle } = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );
        return (
            <>
                <Upload
                    accept="image/*"
                    action="/manage/img/upload"
                    listType="picture-card"
                    name="image"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </>
        );
    }
}
