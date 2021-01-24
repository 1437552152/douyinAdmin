/*
 * @Description: 
 * @version: 
 * @Date: 2019-10-12 23:44:04
 * @LastEditors: yeyifu
 * @LastEditTime: 2019-10-13 00:18:12
 * @Author: yeyifu
 * @LastModifiedBy: yeyifu
 */
// 基于准备好的dom，初始化echarts实例

$(function(){
var mapBoxEchart = echarts.init(document.getElementById('mapBox'));
var geoCoordMap = { //可以在地图上显示的城市的坐标信息
    '安徽省铜陵': [117.81154, 30.945515],
    '长春': [125.8154, 44.2584],
    '长沙': [113.0823, 28.2568],
    '贵阳': [106.6992, 26.7682],
    '杨凌': [109.1162, 34.2004],
    '深圳': [114.5435, 22.5439],
    '济南': [117.1582, 36.8701],
    '海口': [110.3893, 19.8516],
    '沈阳': [123.1238, 42.1216],
    '武汉': [114.3896, 30.6628],
    '红安': [114.23, 31.1],
    '昆明': [102.9199, 25.4663],
    '杭州': [119.5313, 29.8773],
    '成都': [103.9526, 30.7617],
    '拉萨': [91.1865, 30.1465],
    '天津': [117.4219, 39.4189],
    '合肥': [117.29, 32.0581],
    '呼和浩特': [111.4124, 40.4901],
    '哈尔滨': [127.9688, 45.368],
    '北京': [116.4551, 40.2539],
    '南京': [118.8062, 31.9208],
    '南宁': [108.479, 23.1152],
    '南昌': [116.0046, 28.6633],
    '乌鲁木齐': [87.9236, 43.5883],
    '上海': [121.4648, 31.2891],
    '三亚': [109.5000, 18.2000]
};
var HFData = [ // 数据中name的城市名称必须与geoCoordMap中城市名称一致, 不然关联不上，合肥到各地区的线路
    [{name: '合肥'}, {name: '长春',value: 66}],
    [{name: '合肥'}, {name: '长沙',value: 66}],
    [{name: '合肥'}, {name: '贵阳',value: 66}],
    [{name: '合肥'}, {name: '杨凌',value: 66}],
    [{name: '合肥'}, {name: '深圳',value: 66}],
    [{name: '合肥'}, {name: '济南',value: 66}],
    [{name: '合肥'}, { name: '海口',value: 66}],
    [{name: '合肥'}, {name: '沈阳',value: 66}],
    [{name: '合肥'}, {name: '武汉',value: 66}],
    [{name: '合肥'}, {name: '昆明',value: 66}],
    [{name: '合肥'}, {name: '合肥',value: 118}],
    [{name: '合肥'}, {name: '杭州',value: 66}],
    [{name: '合肥'}, {name: '成都',value: 66}],
    [{name: '合肥'}, {name: '拉萨',value: 66}],
    [{name: '合肥'}, {name: '天津',value: 66}],
    [{name: '合肥'}, {name: '呼和浩特',value: 66}],
    [{name: '合肥'}, {name: '哈尔滨',value: 66}],
    [{name: '合肥'}, {name: '北京',value: 66}],
    [{name: '合肥'}, {name: '南宁',value: 66}],
    [{name: '合肥'}, {name: '南昌',value: 66}],
    [{name: '合肥'}, {name: '乌鲁木齐',value: 66}],
    [{name: '合肥'}, {name: '上海',value: 66}]
];
var planePath = 'arrow'; // 箭头的svg
// push进去线路开始-结束地点-经纬度
var convertData = function(data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        var dataItem = data[i];
        var fromCoord = geoCoordMap[dataItem[0].name];
        var toCoord = geoCoordMap[dataItem[1].name];
        if (fromCoord && toCoord) {
            res.push([{
                coord: fromCoord
            }, {
                coord: toCoord
            }]);
        }
    }
    return res;
};
var color = ['#fff', '#FFFFA8', '#46bee9']; //圆圈和字的颜色，线的颜色，箭头颜色
// 数据
var series = [];
// 遍历由合肥到其他城市的线路
[
    ['合肥', HFData]
].forEach(function(item, i) {
    // 配置
    series.push({
        // 系列名称，用于tooltip的显示
        name: item[0],
        type: 'lines',
        zlevel: 1, // 用于 Canvas 分层，不同zlevel值的图形会放置在不同的 Canvas 中
        // effect出发到目的地 的白色尾巴线条
        // 线特效的配置
        effect: {
            show: true,
            period: 6, // 特效动画的时间，单位为 s
            trailLength: 0.1, // 特效尾迹的长度。取从 0 到 1 的值，数值越大尾迹越长
            color: '#46bee9', // 移动箭头颜色
            symbol: planePath,
            symbolSize: 6 // 特效标记的大小
        },
        // lineStyle出发到目的地 的线条颜色
        lineStyle: {
            normal: {
                color: color[i],
                width: 0,
                curveness: 0.2 //幅度
            }
        },
        data: convertData(item[1]) //开始到结束数据
    }, {
        //出发地信息
        name: item[0],
        type: 'lines',
        zlevel: 2,
        effect: {
            show: true,
            period: 6,
            trailLength: 0,
            symbol: planePath,
            symbolSize: 6
        },
        lineStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#FFFFA8' // 出发
                }, {
                    offset: 1,
                    color: '#58B3CC ' // 结束 颜色
                }], false),
                width: 1.5,
                opacity: 0.4,
                curveness: 0.2
            }
        },
        data: convertData(item[1])
    }, {
        // 目的地信息
        name: item[0],
        type: 'effectScatter',
        coordinateSystem: 'geo',
        zlevel: 2,
        rippleEffect: {
            brushType: 'stroke'
        },
        label: {
            normal: {
                show: true,
                position: 'right',
                formatter: '{b}'
            }
        },
        symbolSize: function(val) {
            return val[2] / 8;
        },
        itemStyle: {
            normal: {
                color: color[i]
            }
        },
        data: item[1].map(function(dataItem) {
            return {
                name: dataItem[1].name,
                value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
            };
        })
    });
});

// 指定相关的配置项和数据
var mapBoxOption = {
    geo: {
        map: 'china',
        roam: false, // 是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
        aspectScale: 0.75,
        zoom: 1.20,
        label: {
            normal: {
                show: false,
                textStyle: {
                    color: '#00a0c9'
                }
            },
            emphasis: { // 对应的鼠标悬浮效果
                show: false,
                textStyle: {
                    color: "#00a0c9"
                }
            }
        },
        itemStyle: {
            normal: {
                areaColor: '#0083ce',
                borderColor: '#0066ba'
            },
            emphasis: {
                borderWidth: 0,
                borderColor: '#0066ba',
                areaColor: "#0494e1",
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        }
    },
    series: series
};
// 使用制定的配置项和数据显示图表
mapBoxEchart.setOption(mapBoxOption);
// echart图表自适应
window.addEventListener("resize", function() {
    mapBoxEchart.resize();
});})