/**
 * 包含应用中的所有接口的请求函数的模块
 */
import ajax from './ajax'
import jsonp from 'jsonp'

// const BASE = 'http://localhost:3000/'

// 登录
export const reqLogin = (username, password) => ajax('/login', 'POST', { username, password })

// 获取一级/二级分类列表
export const reqCategorys = (parentId) => ajax('/manage/category/list', 'GET', {parentId})
// 获取一个分类名称
export const reqGetCategory = (categoryId) => ajax('/manage/category/info', 'GET', {categoryId})
// 添加分类
export const reqAddCategory = (category) => ajax('/manage/category/add', 'POST', category)
// 更新分类
export const reqUpdateCategory = (category) => ajax('/manage/category/update', 'POST', category)

// 获取商品列表
export const reqGetProducts = (pageNum, pageSize) => ajax('/manage/product/list', 'GET', {pageNum, pageSize})
// 搜索商品列表
export const reqSearchProducts = (pageNum, pageSize, searchType, searchName) => ajax('/manage/product/search', 'GET', {pageNum, pageSize, [searchType]: searchName})

// 新增商品
export const reqAddProduct = (product) => ajax("/manage/product/add", 'POST', product)
// 更新商品
export const reqUpdateProduct = (product) => ajax("/manage/product/update", 'POST', product)
// 上/下架商品
export const reqUpdateProductStatus = (productId, status) => ajax("/manage/product/updateStatus", 'POST', {productId, status})
// 删除上传的图片
export const reqDelProductImg = (name) => ajax("/manage/img/delete", 'POST', {name})

// 获取角色列表
export const reqGetRoles = () => ajax("/manage/role/list", 'GET', {})
// 添加角色
export const reqAddRole = (role) => ajax("/manage/role/add", "POST", role)
// 更新角色权限
export const reqUpdateRoleAuth = (role) => ajax("/manage/role/update", "POST", role)

// 获取用户列表
export const reqGetUsers = () => ajax("/manage/user/list", "GET", {})
// 添加用户
export const reqAddUser = (user) => ajax('/manage/user/add', 'POST', user)
// 更新用户
export const reqUpdateUser = (user) => ajax('/manage/user/update', 'POST', user)
// 删除用户
export const reqDeleteUser = (userId) => ajax('/manage/user/delete', 'POST', {userId})

// jsonp请求
export const reqWeather = (city) => {
    return new Promise((resolve, reject) => {
        const url = `https://tianqiapi.com/api?version=v1&appid=41741935&appsecret=1WCZkBa7&city=${city}`
        jsonp(url, {}, (err, data) => {
            if (!err) {
                // 获取数据
                const { wea, tem, week } = data.data[0]
                resolve({ wea, tem, week })
            } else {
                // 失败了
                console.log('获取天气失败了！')
            }
        })
    })
}

