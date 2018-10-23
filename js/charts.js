function initLine(el, x_data, y_data) {
    var myChart = echarts.init(document.getElementById(el));
    // console.log(myChart)
    myChart.setOption({
        grid: {
            left: '-2.5%',
            right: '6%',
            top: '3%',
            bottom: '0',
            containLabel: true
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: '',
                lineStyle: {
                    width: 1,
                    color: '#437CF7'
                }
            },
//                      formatter: function (params) {
//                          return params[0].value;
//                      },
        },
        // X轴
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            axisTick: {
                show: false
            },
            axisLabel: {
                color: "#8d6a99", //数字刻度颜色
                fontSize: 12,
                // interval:0,
            },
            axisLine: {
                lineStyle: {
                    width: '0',
                    color: "#522656", //坐标线颜色
                }
            },
            data:x_data
        }],
        // Y轴
        yAxis: [{
            type: 'value',
            offset: '10',
            //控制y轴线是否显示
            axisLine: {
                show: false
            },
            // splitNumber: 4,
//                      min:'100',
//                      max:'120',
            // 控制网格线是否显示
            splitLine: {
                show: false,//y轴线是否显示
                lineStyle: {
                    width: '1',//线的宽度
                    color: "#EEEEEE", //线的颜色
                },
            },
            // 去除y轴上的刻度线
            axisTick: {
                show: false
            },
            //去除y轴上的刻度值
            axisLabel: {
//                          formatter: function (val) {
//                              return '￥' + val.toFixed(2);
//                          },
                color: '#A6A6A6',
                show: false   // 去除y轴上的刻度线
            },

        }],
        series: [{
            type: 'line',
            symbolSize: 1, //拐点大小
            smooth: true,
            itemStyle: {
                normal: {
                             borderColor: "#c064dc",
                }
            },
            lineStyle: {
                normal: {
                    width: 2, //折线宽度
//                              color: "#437CF7", //折线颜色
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            {offset: 0, color: '#7B63FA'},
                            // {offset: 0.75, color: '#ab4ccd'},
                            {offset: 1, color: '#BF6DDC'}
                        ]
                    )
                }
            },
            //设置折线区域填充颜色
            areaStyle: {
                normal: {
//                              color: '#E0EAFE'
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            {offset: 0, color: '#23135E'},
                            // {offset: 0.5, color: 'pink'},
                            {offset: 1, color: '#16053D'}
                        ]
                    )

                }
            },
            data:y_data
        }]

    });
}