'use strict';

const Builder = require('../builder');

Promise.resolve()
    .then(Builder.waitDatabaseServer)
    .then(Builder.createUserTable)
    .then(() => {
        console.log('创建项目完成');
    })
    .catch((error) => {
        console.log('创建项目失败');
        console.log(error);
    });