'use strict';

module.exports = {
    // 100 服务器
    100: '服务器正常',
    101: '服务器异常',

    // 200 用户系统
    200: '用户系统正常',
    201: '用户名存在',
    202: '邮箱存在',
    203: '联系电话存在',
    210: '用户名不存在',
    211: '密码错误',
    220: 'session 无效',
    221: 'session 对应的用户不存在',

    // 300 商店系统
    300: '商店系统正常',
    301: '商店名冲突',
    302: '商店名不合规范',
    303: '注册用户名不存在',
    310: '商店不存在',
};