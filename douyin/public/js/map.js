/*
 * @Description: 
 * @version: 
 * @Date: 2019-10-12 19:31:56
 * @LastEditors: yeyifu
 * @LastEditTime: 2019-10-12 23:27:17
 * @Author: yeyifu
 * @LastModifiedBy: yeyifu
 */
$(function(){
	var mapChart = echarts.init(document.getElementById('map')) //获取装载数据表的容器
function randomData() {
    return Math.round(Math.random() * 300);
}

var geoCoordMap = {
    '美国': [-73.97622, 40.757498], //纽约
    '加拿大': [-109.404347, 60.638178],
    '澳大利亚': [137.708144, -25.328065],
    '中国': [117.27541,31.842039], //安徽合肥
    '阿富汗': [69.132386, 34.739287], //阿富汗
    '安哥拉': [13.285773, -8.748538], //安哥拉
    '阿尔巴尼亚': [19.809499, 41.389924], //阿尔巴尼亚
    '阿根廷': [-64.388276, -31.379492], //阿根廷-科尔多瓦
    '阿拉伯联合酋长国': [54.662609, 24.390891], //阿拉伯联合酋长国-阿布扎比
    "奥地利": [16.373532, 48.209137], //奥地利-维也纳
  /*   "阿塞拜疆共和国": [49.867851, 40.409897], //阿塞拜疆共和国-巴库 */
    "比利时": [4.342799, 50.85052], //比利时
    '贝宁': [2.626232, 6.499347], //贝宁-波多诺伏
    '布基纳法索': [-1.521672, 12.375667], //布基纳法索-瓦加杜古
    '孟加拉人民共和国': [90.410568, 23.813179], //孟加拉人民共和国 - 达卡
    "保加利亚": [23.318705, 42.69792], //保加利亚-索非亚
    '巴哈马': [-73.562575, 40.655271], //巴哈马-拿骚
   /*  '南斯拉夫社会主义联邦共和国': [18.423339, 43.796617], //黑塞哥维那-萨拉热窝 */
    '白俄罗斯': [27.564451, 53.975825], //白俄罗斯-明克斯
    '伯利兹': [12.849472, -4.571506], //中美洲国家伯利兹-贝尔莫潘
    '百慕大群岛': [-86.054972, 40.038827], //百慕大群岛-哈密尔顿
    '玻利维亚': [-78.332036, 22.082519], //玻利维亚-哈密尔顿
    '巴西': [-47.888777, -15.791724], //巴西-巴西利亚
    '文莱': [114.951828, 4.948475], //文莱-斯里巴加湾市
    '不丹王国': [89.647324, 27.476933], //不丹王国-廷布
    '博茨瓦纳': [25.967078, -24.62583], //博茨瓦纳-哈博罗内
    '中非共和国': [18.557903, 4.396116], //中非共和国-班吉
    '瑞士': [7.44716, 46.950139], //瑞士-伯尔尼  Switzerland
    '智利': [-70.693344, 19.48165], // 智利-圣地亚哥     Chile
    '科特迪瓦': [-5.255454, 6.826119], //亚穆苏克罗-科特迪瓦 Ivory Coast
    '喀麦隆': [11.502655, 3.852758], //喀麦隆-雅温得   Cameroon
    '刚果民主共和国': [15.2495, -4.422756], //刚果民主共和国 -金沙萨   Democratic Republic of the Congo
    '刚果共和国': [15.240923, -4.263634], //刚果共和国-布拉柴维尔   Republic of the Congo
    '哥伦比亚共和国': [-74.074104, 4.715315], //哥伦比亚共和国-波哥大    Colombia
    '哥斯达黎加共和国': [-90.871819, 14.023867], //哥斯达黎加共和国-圣何塞    Costa Rica
    '古巴共和国': [-82.366883, 23.119708], //古巴共和国- 哈瓦那   Cuba
    '北塞浦路斯': [33.380839, 35.184858], //北塞浦路斯土耳其共和国-尼科西亚   Northern Cyprus
    '塞浦路斯': [33.380264, 35.183442], //塞浦路斯-尼科西亚    Cyprus
    '捷克共和国': [14.437258, 50.078142], //捷克共和国-布拉格    Czech Republic
    '德国': [13.40498, 52.521199], //德国-柏林  Germany
    '吉布提共和国': [43.146919, 11.573827], // 吉布提- 吉布提市   Djibouti
    '丹麦': [12.431735, 55.665973], //丹麦-哥本哈根  Denmark
    '多米尼加共和国': [-80.245123, 22.580836], //多米尼加共和国-圣多明各  Dominican Republic
    '阿尔及利亚': [3.058874, 36.755571], //阿尔及利亚-阿尔及尔    Algeria
    '厄瓜多尔': [-78.467263, -0.179206], //厄瓜多尔-基多   Ecuador
    '埃及': [31.236287, 30.045171], //埃及-开罗      Egypt
    '厄立特里亚': [38.925716, 15.324804], //厄立特里亚-阿斯马拉  Eritrea
    '西班牙': [-3.703414, 40.419467], //西班牙-马德里 Spain
    '爱沙尼亚': [24.75379, 59.439569], // 爱沙尼亚共和国 -塔林        Estonia
    '埃塞俄比亚': [38.753839, 8.986474], // 埃塞俄比亚联邦民主共和国-亚的斯亚贝巴  Ethiopia
    '芬兰': [24.935506, 60.173495], //芬兰-赫尔辛基   Finland
    '斐济': [178.450079, -18.122335], //斐济共和国-苏瓦    Fiji
    '马尔维纳斯群岛': [-57.940098, -51.615196], //马尔维纳斯群岛- (阿根廷港)斯坦利   Falkland Islands
    '法国': [2.333696, 48.865244], //  法兰西共和国-巴黎   France
    '加蓬': [9.495768, 0.436579], //加蓬-利伯维尔  Gabon
    '英国': [-0.130058, 51.508604], //英国-伦敦     United Kingdom
    '格鲁吉亚': [44.827351, 41.71589], //格鲁吉亚-第比利斯   Georgia
    '加纳': [-0.188114, 5.604581], //加纳-阿克拉    Ghana
    '几内亚': [-13.577316, 9.644511], //几内亚-科纳克里  Guinea
    '冈比亚': [-16.582383, 13.457299], //冈比亚   班珠尔 --Gambia
    '几内亚比绍': [-15.619766, 11.885767], //几内亚比绍 -比绍    Guinea Bissau
    '赤道几内亚': [8.736346, 3.749414], //赤道几内亚   -马拉博     Equatorial Guinea
    '雅典': [23.72821, 37.9846], //希腊-雅典   Greece
    '格陵兰': [-51.573608, 64.213084], //格陵兰-努克   redland
    '危地马拉': [-90.543513, 14.649067], //危地马拉-危地马拉城   Guatemala
    '圭亚那': [-58.140752, 6.803865], // 圭亚那-乔治敦  French Guiana
    '圭亚那合作共和国': [-58.149951, 6.81306], //圭亚那合作共和国    Guyana
    '洪都拉斯共和国': [-87.253756, 14.044503], //洪都拉斯共和国 -特古西加尔巴  Honduras
    '克罗地亚': [15.974196, 45.812166], //克罗地亚-萨格勒布  Croatia
    '海地': [-72.307002, 18.595629], //海地-太子港    Haiti
    '匈牙利': [19.04196, 47.498109], //匈牙利-布达佩斯    Hungary
    '印度尼西亚': [106.870937, -6.240893], //印度尼西亚-雅加达   Indonesia
    '印度': [77.206503, 28.62928], //印度  -新德里   India
    '爱尔兰': [-6.259735, 53.350324], //爱尔兰共和国-都柏林   Ireland
    '伊朗': [51.388399, 35.6899], //伊朗-德黑兰   Iran
    '伊拉克': [44.363655, 33.314606], //伊拉克-巴格达   Iraq
    '冰岛': [-21.859781, 64.099918], //冰岛共和国-雷克雅未克   Iceland
    '以色列': [35.21141, 31.77102], //以色列-耶路撒冷   Israel
    '意大利': [12.491267, 41.904612], //意大利 -罗马  Italy
    '牙买加': [140.433549, -36.466221], //牙买加-金斯敦  Jamaica
    '约旦': [35.927003, 31.946341], //约旦-安曼     Jordan
    '日本': [139.713657, 35.707004], //日本-东京   Japan
    '哈萨克斯坦': [71.470572, 51.160655], //哈萨克斯坦-阿斯塔纳   Kazakhstan
    '肯尼亚': [36.820997, -1.291346], //肯尼亚-内罗毕   Kenya
    '吉尔吉斯': [74.569345, 42.874887], //吉尔吉斯共和国-比什凯克市   Kyrgyzstan
    '柬埔寨': [104.891769, 11.545102], // 柬埔寨-金边  Cambodia  
    '韩国': [126.986407, 37.536804], //韩国-首尔   South Korea
    '科索沃共和国': [21.163778, 42.663444], //科索沃共和国-普里什蒂纳   Kosovo
    '科威特': [47.977439, 29.376031], //科威特-科威特城 Kuwait
    '老挝': [102.632451, 17.975794], // 老挝-万象  Laos
    '黎巴嫩': [35.500052, 33.89439], // 黎巴嫩-贝鲁特  Lebanon
    '利比里亚': [-10.761016, 6.291152], //利比里亚-蒙罗维亚
    '利比亚': [13.19135, 32.887237], //利比亚-的黎波里   Libya
    '斯里兰卡': [79.865104, 6.909415], //斯里兰卡-科伦坡  Sri Lanka
    '莱索托': [29.085487, -29.04088], //莱索托-马塞卢   Lesotho
    '立陶宛': [25.279069, 54.687457], //立陶宛-维尔纽斯  Lithuania
    '卢森堡': [6.131308, 49.613029], //卢森堡-卢森堡市 Luxembourg
    '拉脱维亚': [24.105101, 56.949378], //拉脱维亚-里加 Latvia
    '摩洛哥': [-6.862605, 33.977609], //摩洛哥-拉巴特 Morocco
    '摩尔多瓦': [28.858505, 47.012344], // 摩尔多瓦 -基希讷乌Moldova
    '马达加斯加': [47.508608, -18.867016], //马达加斯加-塔那那利佛 Madagascar
    '墨西哥': [-99.134543, 19.433793], //墨西哥   Mexico
    '马其顿共和国': [21.427289, 41.997997], // 马其顿共和国-斯科普里   Macedonia
    '马里共和国': [-8.003581, 12.640388], //马里共和国 -巴马科   Mali
    '缅甸': [96.077119, 19.763943], //缅甸-内比都   Myanmar
    '黑山共和国': [19.261583, 42.435497], //  黑山共和国-波德戈里察  Montenegro
    '蒙古': [106.908677, 47.915632], // 蒙古-乌兰巴托  Mongolia
    '莫桑比克': [32.602247, -25.890353], //莫桑比克-马普托   Mozambique
    '毛里塔尼亚': [-15.964452, 18.0745], //毛里塔尼亚-努瓦克肖特   Mauritania
    '马拉维': [33.774057, -13.961542], //马拉维-利隆圭   Malawi
    '马来西亚': [101.681865, 3.136134], // 马来西亚-吉隆坡  Malaysia
    '纳米比亚': [17.034567, -22.555179], //纳米比亚-温得和克   Namibia
    '新喀里多尼亚': [166.449312, -22.251664], //新喀里多尼亚-努美阿   New Caledonia
    '尼日尔': [2.118056, 13.516354], //尼日尔共和国-尼亚美   Niger
    '尼日利亚': [7.459498, 9.126437], //尼日利亚-阿布贾   Nigeria
    '尼加拉瓜共和国': [-86.236749, 12.115559], // 尼加拉瓜共和国-马那瓜  Nicaragua
    '荷兰': [4.89354, 52.370649], //荷兰-阿姆斯特丹   Netherlands
    '挪威': [4.89354, 52.370649], //挪威-奥斯陆   Norway
    '尼泊尔': [85.320511, 27.711], //尼泊尔-加德满都   Nepal
    '新西兰': [174.761827, -41.291661], //新西兰-惠灵顿   New Zealand
    '阿曼': [58.405562, 23.587133], //阿曼-马斯喀特   Oman
    '巴基斯坦伊斯兰': [73.076186, 33.714975], //巴基斯坦伊斯兰共和国-伊斯兰堡   Pakistan
    '巴拿马': [-79.401974, 9.102657], //巴拿马-巴拿马城   Panama
    '秘鲁': [-77.042548, -12.044223], // 秘鲁-利马  Peru
    '菲律宾': [120.985715, 14.603576], // 菲律宾-马尼拉  Philippines
    '巴布亚新几内亚': [147.27892, -9.465948], // 巴布亚新几内亚-莫尔兹比港  Papua New Guinea
    '波兰': [21.021333, 52.232842], //波兰-华沙   Poland
    '波多黎各': [120.809359, 17.750942], //波多黎各-圣胡安   Puerto Rico
    '北朝鲜': [125.760512, 39.041685], //北朝鲜-平壤   North Korea
    '葡萄牙': [-9.161365, 38.768409], //葡萄牙-里斯本   Portugal
    '巴拉圭': [-57.576213, -25.260342], //巴拉圭-亚松森   Paraguay
    '卡塔尔': [51.531551, 25.286355], //卡塔尔-多哈   Qatar
    '罗马尼亚': [51.531551, 25.286355], //罗马尼亚-布加勒斯特   Romania
    '俄罗斯': [37.621612, 55.758257], //俄罗斯联邦-莫斯科   Russia
    '卢旺达': [30.102346, -1.969667], //卢旺达-基加利   Rwanda
    '西撒哈拉': [-13.233061, 27.246935], //西撒哈拉-阿尤恩   Western Sahara
    '沙特阿拉伯': [46.672152, 24.714184], //沙特阿拉伯 -利雅得  Saudi Arabia
    '南苏丹': [31.586576, 4.891962], //南苏丹-朱巴   Sudan South
    '苏丹': [32.560519, 15.501806], //苏丹-喀土穆   Sudan
    '塞内加尔': [-17.367747, 14.764454], //塞内加尔-达喀尔   Senegal
    '所罗门群岛': [159.981803, -9.43537], //所罗门-霍尼亚拉   Solomon Islands
    '塞拉利昂': [-13.233425, 8.466744], //塞拉利昂-弗里敦   Sierra Leone
    '萨尔瓦多': [-89.22758, 13.692121], //萨尔瓦多-圣萨尔瓦多   El Salvador
    '索马里兰': [44.088511, 9.562318], //索马里兰-哈尔格萨   Somaliland
    '索马里': [45.317204, 2.047013], //索马里-摩加迪沙   Somalia
    '塞尔维亚': [20.446144, 44.786894], //塞尔维亚-贝尔格莱德   Republic of Serbia
    '苏里南共和国': [-55.206128, 5.853474], //苏里南共和国-帕拉马里博   Suriname
    '斯洛伐克共和国': [17.099623, 48.141697], //斯洛伐克共和国-布拉迪斯拉发   Slovakia
    '瑞典': [18.058376, 59.327783], // 瑞典- 斯德哥尔摩 Sweden
    '斯威士兰': [31.134648, -26.292261], //斯威士兰-姆巴巴内   Swaziland
    '叙利亚': [36.274228, 33.521994], //叙利亚-大马士革   Syria  
    '乍得': [15.058995, 12.144253], //乍得-恩贾梅纳   Chad
    '多哥': [1.244889, 6.219695], //多哥- 洛美   Togo
    '泰国': [100.451117, 13.724061], //泰国-曼谷   Thailand
    '塔吉克斯坦': [68.788383, 38.572383], //塔吉克斯坦-杜尚别   Tajikistan
    '土库曼斯坦': [58.338576, 38.057635], //土库曼斯坦-阿什哈巴德市   Turkmenistan
    '东帝汶': [125.564669, -8.549475], //东帝汶-帝力   East Timor
    '特立尼达和多巴哥': [-61.528354, 10.674498], //特立尼达和多巴哥-西班牙港   Trinidad and Tobago
    '突尼斯': [10.208651, 36.866028], //突尼斯-突尼斯市   Tunisia
    '土耳其': [32.853705, 39.941552], //土耳其-安卡拉   Turkey
    '坦桑尼亚': [35.698823, -6.211186], //坦桑尼亚联合共和国-多多马    United Republic of Tanzania
    '乌干达': [32.581738, 0.352894], //乌干达-坎帕拉   Uganda
    '乌克兰': [30.512697, 50.452995], //乌克兰-基辅   Ukraine
    '乌拉圭': [-56.163094, -34.893771], // 乌拉圭-蒙得维的亚  Uruguay
    '乌兹别克斯': [69.247259, 41.313586], //乌兹别克斯-塔什干市   Uzbekistan
    '委内瑞拉': [-66.90346, 10.492688], //委内瑞拉-加拉加斯   Venezuela
    '越南': [105.699615, 20.973967], // 越南-河内  Vietnam
    '瓦努阿图': [168.327477, -17.730243], //瓦努阿图-维拉港   Vanuatu
    '也门': [44.188624, 15.375985], // 也门-萨那  Yemen
    '南非共和国': [18.480216, -33.873348], //南非共和国- 开普敦  South Africa
    '赞比亚': [28.321954, -15.376648], //赞比亚-卢萨卡   Zambia
    '津巴布韦': [31.033189, -17.824573], //津巴布韦-哈拉雷   Zimbabwe  
};
var BJData = [
    [{
        name: '美国',
        value: randomData()
    }, {
        name: '中国'
    }],
    [{
        name: '加拿大',
        value: randomData()
    }, {
        name: '中国'
    }],
    [{
        name: '阿富汗',
        value: randomData()
    }, {
        name: '中国'
    }],
    [{
        name: '安哥拉',
        value: randomData()
    }, {
        name: '中国'
    }],
    [{
        name: '阿尔巴尼亚',
        value: randomData()
    }, {
        name: '中国'
    }],
    [{
        name: '阿根廷',
        value: randomData()
    }, {
        name: '中国'
    }],
    [{
        name: '阿拉伯联合酋长国',
        value: randomData()
    }, {
        name: '中国'
    }],
    [{
        name: '奥地利',
        value: randomData()
    }, {
        name: '中国'
    }],
   /*  [{
        name: '阿塞拜疆共和国',
        value: randomData()
    }, {
        name: '中国'
    }], */
    [{
        name: '比利时',
        value: randomData()
    }, {
        name: '中国'
    }],
    [{
        name: '贝宁',
        value: randomData()
    }, {
        name: '中国'
    }],
    [{
        name: '布基纳法索',
        value: randomData(),
    }, {
        name: '中国'
    }],
    [{
        name: '孟加拉人民共和国',
        value: randomData()
    }, {
        name: '中国'
    }],
    [{
        name: '保加利亚',
        value: randomData()
    }, {
        name: '中国'
    }],
    [{
        name: '巴哈马',
        value: randomData()
    }, {
        name: '中国'
    }],
   /*  [{
        name: '南斯拉夫社会主义联邦共和国',
        value: randomData()
    }, {
        name: '中国'
    }], */
    [{
        name: '白俄罗斯',
        value: randomData()
    }, {
        name: '中国'
    }],
    [{
        name: '伯利兹',
        value: randomData()
    }, {
        name: '中国'
    }],
 /*    [{
        name: '百慕大群岛',
        value: randomData()
    }, {
        name: '中国'
    }], */
    [{
        name: '玻利维亚',
        value: randomData()
    }, {
        name: '中国'
    }],
    [{
        name: '巴西',
        value: randomData()
    }, {
        name: '中国'
    }],
    [{
        name: '文莱',
        value: randomData()
    }, {
        name: '中国'
    }],
    [{
        name: '澳大利亚',
        value: randomData()
    }, {
        name: '中国'
    }]


];
var convertData2 = function(data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        var dataItem = data[i];
        var fromCoord = geoCoordMap[dataItem[1].name];
        var toCoord = geoCoordMap[dataItem[0].name];
        if (fromCoord && toCoord) {
            res.push([{
                    coord: fromCoord,
                    value: dataItem[0].value
                },
                {
                    coord: toCoord
                }
            ]);
        }
    }
    return res;
};

var series = [];
[
    ["中国", BJData]
].forEach(function(item, i) {
    series.push({
            // name: '攻击线2',
            type: "lines",
            zlevel: 2,
            effect: {
                show: true,
                color: 'red',
                period:3, //箭头指向速度，值越小速度越快
                trailLength:0.1, //特效尾迹长度[0,1]值越大，尾迹越长重
              //  symbol: "arrow", //箭头图标
                symbolSize:10 //图标大小
            },
            lineStyle: {
                normal: {
                    color: 'yellow',
                    width: 1, //尾迹线条宽度
                    opacity: 0, //尾迹线条透明度
                    curveness: -0.3 //尾迹线条曲直度
                }
            },
            data: convertData2(item[1])
        }, {

            type: "effectScatter",
            coordinateSystem: "geo",
            zlevel: 2,
            rippleEffect: {
                //涟漪特效
                period: 4, //动画时间，值越小速度越快
                brushType: "stroke", //波纹绘制方式 stroke, fill
                scale: 4 //波纹圆环最大限制，值越大波纹越大
            },
            label: {
                normal: {
                    show: true,
                    position: "right", //显示位置
                    offset: [5, 0], //偏移设置
                    formatter: "{b}" //圆环显示文字
                },
                emphasis: {
                    show: true,
                    color: "red"
                }
            },
            symbol: "circle",
            symbolSize: function(val) {
                return 8 + val[2] / 1000; //圆环大小
            },
            itemStyle: {
                normal: {
                    show: true,
                },
                emphasis: {
                    show: true,
                    color: "red"
                }
            },
            data: item[1].map(function(dataItem) {
                return {
                    name: dataItem[0].name,
                    value: geoCoordMap[dataItem[0].name].concat([dataItem[0].value])
                };
            })
        },
        //被攻击点
        {
            type: "scatter",
            coordinateSystem: "geo",
            zlevel: 2,
            rippleEffect: {
                period: 4,
                brushType: "stroke",
                scale: 4
            },
            label: {
                normal: {
                    show: true,
                    color: "rgb(215,13,25)",
                    position: "right",
                    formatter: "{b}",
                },
                emphasis: {
                    show: true,
                    color: "red"
                }
            },
            symbol: "pin",
            symbolSize: 30,
            itemStyle: {
                normal: {
                    show: true,
                    color: "rgb(215,13,25)",
                },
                emphasis: {
                    show: true,
                    color: "red"
                }
            },
            data: [{
                name: item[0],
                value: geoCoordMap[item[0]].concat([100]),
                visualMap: false
            }]
        }
    );
});
var svg = "http://image.baidu.com/search/detail?ct=503316480&z=1&tn=baiduimagedetail&ipn=d&word=%E5%B0%8F%E7%AE%AD%E5%A4%B4&step_word=&ie=utf-8&in=&cl=2&lm=-1&st=undefined&hd=undefined&latest=undefined©right=undefined&cs=1525371984,4236387017&os=105247815,201702987&simid=4259792343,784147648&pn=0&rn=1&di=20350&ln=1368&fr=&fmq=1564028762207_R&fm=&ic=undefined&s=undefined&se=&sme=&tab=0&width=0&height=0&face=undefined&is=0,0&istype=0&ist=&jit=&bdtype=0&spn=0&pi=0&gsm=78&objurl=http%3A%2F%2Fimg58.nipic.com%2F20140830%2F2531170_195503597000_1.jpg&rpstart=0&rpnum=0&adpicid=0&force=undefined"

option = {
    backgroundColor: '#FFF',
    tooltip: {
        trigger: "item",
        backgroundColor: "red",
        borderColor: "red",
        showDelay: 0,
        hideDelay: 0,
        enterable: true,
        transitionDuration: 0,
        extraCssText: "z-index:100",
        formatter: function(params, ticket, callback) {
            //根据业务自己拓展要显示的内容
            var res = "";
            var name = params.name;
            var value = params.value[params.seriesIndex + 1];
            res =
                "";
            return res;
        }
    },
    visualMap: {
        //图例值控制
        show: false,
        type: 'piecewise',
        pieces: [{
                max: 80,
                color: 'red'
            },
            {
                min: 80,
                max: 120,
                color: 'red'
            },
            {
                min: 120,
                color: 'red'
            }
        ],
        calculable: true,
    },
    geo: {
        map: "world",
        show: true,
        label: {
            emphasis: {
                show: false
            }
        },
        roam: false, //是否允许缩放
        layoutCenter: ["50%", "50%"], //地图位置
        layoutSize: "180%",
        itemStyle: {
            normal: {
                show: 'true',
                color: "rgb(4,40,78)", //地图背景色
                borderColor: "rgb(178,178,178)" //省市边界线
            },
            emphasis: {
                show: 'true',
                color: "rgb(4,40,78)" //悬浮背景
            }
        }
    },
    legend: {
        orient: 'vertical',
        top: '30',
        left: 'center',
        align: 'right',
        data: [{
                name: '攻击线1',
                icon: svg,
            },
            {
                name: '攻击线2',
                icon: svg
            },
        ],
        textStyle: {
            color: '#fff',
            fontSize: 20,
        },
        itemWidth: 50,
        itemHeight: 30,
        selectedMode: 'multiple'
    },
    series: series
};
mapChart.setOption(option)//把echarts配置项启动
})
