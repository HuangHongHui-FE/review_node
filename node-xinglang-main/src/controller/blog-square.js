const { PAGE_SIZE } = require('../config/constants')
const { SuccessModel } = require('../model/ResModel')

const { getSquareCacheList } = require('../cache/blog')

/**
 * 获取广场微博列表
 * @param {number} pageIndex 页数
 */
async function getSquareBlogList(pageIndex = 0) {
    // cache
    const result = await getSquareCacheList(pageIndex, PAGE_SIZE)

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
    getSquareBlogList
}