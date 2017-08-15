'use strict';

const Database = require('../database');
const MySQL = Database.MySQL;

exports.USER =  MySQL.sugar().create('USER')
    // 唯一 ID
    .add('uid', 'INT(9)', 'NOT NULL PRIMARY KEY auto_increment')
    // 用户名
    .add('name', 'VARCHAR(32)', 'NOT NULL')
    // 加密后的密码
    .add('password', 'VARCHAR(32)', 'NOT NULL')
    // 电子邮件
    .add('email', 'VARCHAR(100)')
    // 移动电话
    .add('phone', 'VARCHAR(11)')
    // 头像地址
    .add('portrait', 'VARCHAR(40)')
    // 是否通过验证 (0 未验证, 1 已验证, 2 验证失效)
    .add('verify', 'INT(1)')
    // 用户权限等级 (0 普通, 1-80 VIP, 90-99 管理员)
    .add('level', 'INT(2)')
    // 性别 (0未知，1男，2女)
    .add('sex', 'INT(1)', 'DEFAULT 0')
    // 创建的时间
    .add('create_time', 'INT(11)');

exports.SHOP = MySQL.sugar().create('SHOP')
    // 唯一 id
    .add('sid', 'INT(9)', 'NOT NULL PRIMARY KEY auto_increment')
    // 商店名字
    .add('name', 'VARCHAR(9)')
    // 哪个用户创建的
    .add('uid', 'INT(9)')
    // 创建的时间
    .add('create_time', 'INT(11)');

exports.USER_SHOP_MAP = MySQL.sugar().create('USER_SHOP_MAP')
    // 商店 sid
    .add('sid', 'INT(9)', 'NOT NULL PRIMARY KEY')
    // 用户 uid
    .add('uid', 'INT(9)')
    // 创建的时间
    .add('create_time', 'INT(11)');

exports.WAREHOUSE = MySQL.sugar().create('WAREHOUSE')
    // 唯一 id
    .add('wid', 'INT(9)', 'NOT NULL PRIMARY KEY auto_increment')
    // 属于哪个商店
    .add('sid', 'INT(9)')
    // 仓库名字
    .add('name', 'VARCHAR(20)')
    // 哪个用户创建的
    .add('uid', 'INT(9)')
    // 创建的时间
    .add('create_time', 'INT(11)');

exports.MERCHANDISE = MySQL.sugar().create('MERCHANDISE')
    // 唯一 id
    .add('mid', 'INT(9)', 'NOT NULL PRIMARY KEY auto_increment')
    // 属于哪个商店
    .add('sid', 'INT(9)')
    // 商品名字
    .add('name', 'VARCHAR(20)')
    // 成本价格
    .add('cost_price', 'INT(7)')
    // 批发售价
    .add('wholesale_price', 'INT(7)')
    // 零售售价
    .add('retail_price', 'INT(7)')
    // 哪个用户创建的
    .add('uid', 'INT(9)')
    // 创建的时间
    .add('create_time', 'INT(11)');

exports.CUSTOMER = MySQL.sugar().create('CUSTOMER')
    // 唯一 id
    .add('cid', 'INT(9)', 'NOT NULL PRIMARY KEY auto_increment')
    // 属于哪个商店
    .add('sid', 'INT(9)')
    // 客户姓名
    .add('name', 'VARCHAR(20)')
    // 客户性别
    .add('sex', 'INT(1)', 'DEFAULT 0')
    // 客户电话
    .add('phone', 'VARCHAR(11)')
    // 客户邮箱
    .add('email', 'VARCHAR(200)')
    // 省份
    .add('province', 'VARCHAR(100)')
    // 城市
    .add('city', 'VARCHAR(100)')
    // 县区
    .add('county', 'VARCHAR(100)')
    // 详细地址
    .add('other', 'VARCHAR(100)')
    // 哪个用户创建的
    .add('uid', 'INT(9)')
    // 创建的时间
    .add('create_time', 'INT(11)');

exports.CUSTOMER_ORDER = MySQL.sugar().create('CUSTOMER_ORDER')
    // 唯一 id
    .add('oid', 'INT(9)', 'NOT NULL PRIMARY KEY auto_increment')
    // 属于哪个商店
    .add('sid', 'INT(9)')
    // 包含商品
    .add('goods', 'VARCHAR(200)')
    // 订单总价
    .add('price', 'INT(7)')
    // 订单状态(下单 1 -> 发货 2 -> 签收 3 -> 完成 4 OR 取消 0)
    // .add('state', 'INT(1)')
    // 备注(降价抹零送赠品等备注信息)
    .add('remark', 'VARCHAR(500)')
    // 哪个用户创建的
    .add('uid', 'INT(9)')
    // 创建的时间
    .add('create_time', 'INT(11)');