const seq = require('../seq')

const { STRING, DECIMAL } = require('../types')
// users
const User = seq.define('user', {
    userName: {
        type: STRING,
        allowNull: false,
        unique: true,
        comment: '用户名唯一'
    },
    password: {
        type: STRING,
        allowNull: false,
        comment: '密码'
    },
    nikename: {
        type: STRING,
        allowNull: false,
        comment: '昵称'
    },
    gender: {
        type: DECIMAL,
        allowNull: false,
        defaultValue: 3,
        comment: '性别（1是男性 2是女性 3是保密）'
    },
    picture: {
        type: STRING,
        comment: '头像存图片地址'
    },
    city: {
        type: STRING,
        comment: '城市'
    }
})

module.exports = User