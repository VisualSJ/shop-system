'user strict';

var $submit = document.getElementById('submit');

var $username = document.getElementById('username');
var $password = document.getElementById('password');
var $email = document.getElementById('email');
var $phone = document.getElementById('phone');

submit.addEventListener('click', function (event) {
    var username = $username.value;
    if (username.length < 4) {
        alert('用户名太短');
        event.stopPropagation();
        event.preventDefault();
        return false;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        alert('用户名只能包含大小写字母、数组和下划线');
        event.stopPropagation();
        event.preventDefault();
        return false;
    }
    var password = $password.value;
    if (password.length < 6) {
        alert('密码必须大于6位');
        event.stopPropagation();
        event.preventDefault();
        return false;
    }
    var email = $email.value;
    if (!/\S+\@\S+\.\S+/.test(email)) {
        alert('邮箱不合法');
        event.stopPropagation();
        event.preventDefault();
        return false;
    }
    var phone = $phone.value;
    if (phone.length !== 11) {
        alert('联系电话不合法');
        event.stopPropagation();
        event.preventDefault();
        return false;
    }
    return true;
});