const { getBlogListByUser } = require('../services/blog')
const { PAGE_SIZE } = require('../config/constants')
const { SuccessModel } = require('../model/ResModel')
 
/**
  * 获取个人主页微博列表
  * @param {string} userName 用户名
  * @param {number} pageIndex 当前页面
  */
async function getProfileBlogList(userName, pageIndex = 0) {
    const result = await getBlogListByUser({
        userName,
        pageIndex,
        pageSize: PAGE_SIZE
    })
    // console.log(result)
    const blogList = result.blogList
 
    // 拼接返回数据
    return new SuccessModel({
        isEmpty: blogList.length === 0,
        blogList,
        pageSize: PAGE_SIZE,
        pageIndex,
        count: result.count
    })
}
 
module.exports = {
    getProfileBlogList
}
 