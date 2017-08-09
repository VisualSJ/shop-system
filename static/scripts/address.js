'use strict';

var ajax = function (url, callback) {
    var _c = 'jsonp_' + (new Date() - 0);
    if (window[_c]) {
        _c += '0';
    }
    window[_c] = function (json) {
        callback(json);
        delete window[_c];
    };

    if (url.indexOf('?') !== -1) {
        url += '&callback=' + _c;
    } else {
        url += '?callback=' + _c;
    }

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4) {
            if(xhr.status == 200) {
                window.eval(xhr.responseText);
            } else {
                window[_c](null);
            }
        }
    };
    xhr.send();
};

var $province = document.getElementById('province');
var $city = document.getElementById('city');
var $county = document.getElementById('county');

var updateProvince = function (id, callback) {
    ajax('http://api.itharbors.com/interface/city/search/country?id=' + id, function (json) {
        json.result.provinces.forEach(function (province) {
            var $option = document.createElement('option');
            $option.setAttribute('value', province.id);
            $option.innerHTML = province.name;
            $province.appendChild($option);
            callback && callback();
        });
    });
};

var updateCity = function (id, callback) {
    id = id || $province.value;
    $city.innerHTML = '';
    ajax('http://api.itharbors.com/interface/city/search/province?id=' + id, function (json) {
        json.result.cities.forEach(function (city, index) {
            var $option = document.createElement('option');
            $option.setAttribute('value', city.id);
            $option.innerHTML = city.name;
            $city.appendChild($option);
            callback && callback();
        });
    });
};

var updateCounty = function (id, callback) {
    id = id || $city.value;
    $county.innerHTML = '';
    ajax('http://api.itharbors.com/interface/city/search/city?id=' + id, function (json) {
        json.result.counties.forEach(function (county) {
            var $option = document.createElement('option');
            $option.setAttribute('value', county.id);
            $option.innerHTML = county.name;
            $county.appendChild($option);
            callback && callback();
        });
    });
};

updateProvince(1, function () {
    updateCity(1, function () {
        updateCounty(1);
    });
});

$province.addEventListener('change', function (event) {
    updateCity($province.value, function () {
        updateCounty();
    });
});

$city.addEventListener('change', function (event) {
    updateCounty($city.value);
});