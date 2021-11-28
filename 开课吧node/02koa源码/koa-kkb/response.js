// 处理原生res逻辑

module.exports = {
    get body () {
        return this._body;  // 下划线内部变量存起来
    },

    set body(val) {
        this._body = val
    }
}