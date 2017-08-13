
$('#new-customer').highcharts({

    title: {
        text: '新用户'
    },

    subtitle: {
        text: '最近一段时间内的新增用户'
    },

    series: [
        {
            name: '商店1',
            data: [43, 52, 57, 69]
        },
        {
            name: '商店2',
            data: [24, 24, 29, 29]
        },
        {
            name: '商店3',
            data: [11, 17, 16, 19]
        },
    ]

});

// $('#store-merchandise').highcharts({
//     chart: {
//         plotBackgroundColor: null,
//         plotBorderWidth: null,
//         plotShadow: false
//     },
//     colors: ["#91e8e1", "#8d4653", "#8085e8", "#e4d354", "#f15c80", "#8085e9", "#f7a35c", "#90ed7d", "#434348", "#7cb5ec"],
//     title: {
//         text: '商店商品存量'
//     },
//     tooltip: {
//         headerFormat: '{series.name}<br>',
//         pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
//     },
//     plotOptions: {
//         pie: {
//             allowPointSelect: true,
//             cursor: 'pointer',
//             dataLabels: {
//                 enabled: false
//             },
//             showInLegend: true
//         }
//     },
//     series: [{
//         type: 'pie',
//         name: '商店商品数量',
//         data: [
//             ['商店1', 789],
//             ['商店2', 234],
//             ['商店3', 398],
//         ]
//     }]
// });