
$('#orders-received').highcharts({

    title: {
        text: '订单数量'
    },

    subtitle: {
        text: '最近一段时间内的订单数量'
    },

    series: [
        {
            name: '商店1',
            data: [43, 52, 57, 69, 97, 11, 13]
        },
        {
            name: '商店2',
            data: [24, 24, 29, 29, 32, 30, 38]
        },
        {
            name: '商店3',
            data: [11, 17, 16, 19, 20, 24, 32]
        },
    ]

});
