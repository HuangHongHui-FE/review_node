const User = require('./User')
const Blog = require('./Blog')
const UserRelation = require('./UserRelation')
const AtRelation = require('./AtRelation')

// 创建外键
Blog.belongsTo(User, {
    foreignKey: 'userId'
})

// 关注与被关注外键
UserRelation.belongsTo(User, {
    foreignKey: 'followerId'
})

User.hasMany(UserRelation, {
    foreignKey: 'userId'
})

// 首页---外键连接
Blog.belongsTo(UserRelation, {
    foreignKey: 'userId',
    targetKey: 'followerId'
})

// atMe---外键链接
Blog.hasMany(AtRelation, {
    foreignKey: 'blogId'
})

module.exports = {
    User,
    Blog,
    UserRelation,
    AtRelation
}