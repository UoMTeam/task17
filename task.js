/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
    var y = dat.getFullYear();
    var m = dat.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = dat.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
}

function randomBuildData(seed) {
    var returnData = {};
    var dat = new Date("2016-01-01");
    var datStr = ''
    for (var i = 1; i < 92; i++) {
        datStr = getDateStr(dat);
        returnData[datStr] = Math.ceil(Math.random() * seed);
        dat.setDate(dat.getDate() + 1);
    }
    return returnData;
}

var aqiSourceData = {
    "北京": randomBuildData(500),
    "上海": randomBuildData(300),
    "广州": randomBuildData(200),
    "深圳": randomBuildData(100),
    "成都": randomBuildData(300),
    "西安": randomBuildData(500),
    "福州": randomBuildData(100),
    "厦门": randomBuildData(100),
    "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
    nowSelectCity: -1,
    nowGraTime: "day"
}

/**
 * 渲染图表
 */
function renderChart() {
    var keys = Object.keys(chartData);
    var output = "";
    for (var i = 0; i < keys.length; i++) {
        var color = getRandomColor();
        var width = "";
        if (pageState.nowGraTime == "day") {
            width = "10px";
        }
        if (pageState.nowGraTime == "week") {
            width = "50px";
        }
        if (pageState.nowGraTime == "month") {
            width = "100px";
        }
        output += "<div style='display:inline-block;width:" + width + ";height:" + chartData[keys[i]] + "px;background-color:" + color + ";margin-right:2px;margin:auto;' id='" + keys[i] + "'></div>"
    }
    var wrap = document.getElementById("aqi-chart-wrap");
    wrap.style.textAlign = "center";
    wrap.style.margin = "auto";
    wrap.style.height = "600px";
    wrap.innerHTML = output;
    var alldiv = wrap.getElementsByTagName("div");
    for (var i=0;i<alldiv.length;i++){
        alldiv[i].addEventListener("mouseover",function(){
           document.title = event.target.id +" "+event.target.style.height.substring(0,event.target.style.height.indexOf('p')); 
        });
    }
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
    // 设置对应数据
    var gravalue = event.target.value;
    pageState["nowGraTime"] = gravalue;
    // 调用图表渲染函数
    initAqiChartData();
    renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
    // 设置对应数据
    var cityvalue = event.target.value;
    pageState["nowSelectCity"] = cityvalue;
    // 调用图表渲染函数
    initAqiChartData();
    renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
    var radio = document.getElementsByName("gra-time");
    for (var i = 0; i < radio.length; i++) {
        radio[i].addEventListener("change", function () {
            graTimeChange();
        }, false);
        if (radio[i].checked) {
            pageState.nowGraTime = radio[i].value;
        }
    }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
    // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
    var keys = Object.keys(aqiSourceData);
    var output = "";
    for (var i = 0; i < keys.length; i++) {
        output += "<option>" + keys[i] + "</option>"
    }
    document.getElementById("city-select").innerHTML = output;
    pageState.nowSelectCity = keys[0];
    // 给select设置事件，当选项发生变化时调用函数citySelectChange
    var select = document.getElementById("city-select");
    select.addEventListener("change", function () {
        citySelectChange()
    }, false);
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
    // 将原始的源数据处理成图表需要的数据格式
    // 处理好的数据存到 chartData 中
    var dataByCity = aqiSourceData[pageState.nowSelectCity];
    var keydate = Object.keys(dataByCity);
    if (pageState.nowGraTime == "day") {
        chartData = dataByCity;
    }
    if (pageState.nowGraTime == "week") {
        var weeks;
        chartData = {};
        if (keydate.length % 7 == 0) {
            weeks = keydate.length / 7;
        } else {
            weeks = keydate.length / 7 + 1;
        }
        for (var i = 0; i < weeks; i++) {
            var _arg = 0;
            for (var j = 0; j < 7; j++) {
                _arg += dataByCity[keydate[i + j]];
            }
            var str = "week" + i;
            chartData[str] = Math.ceil(_arg / 7);
        }
    }
    if (pageState.nowGraTime == "month") {
        chartData = {};
        var month01 = 0,
            month02 = 0,
            month03 = 0;
        var cont1 = 0,
            cont2 = 0,
            cont3 = 0;

        for (var i = 0; i < keydate.length; i++) {
            if (keydate[i].substr(5, 2) == "01") {
                month01 += dataByCity[keydate[i]];
                cont1++;
            }
            if (keydate[i].substr(5, 2) == "02") {
                month02 += dataByCity[keydate[i]];
                cont2++;
            }
            if (keydate[i].substr(5, 2) == "03") {
                month03 += dataByCity[keydate[i]];
                cont3++;
            }
        }
        chartData["month1"] = Math.ceil(month01 / cont1);
        chartData["month2"] = Math.ceil(month02 / cont2);
        chartData["month3"] = Math.ceil(month03 / cont3);
    }
    renderChart();
}


/**
 * 初始化函数
 */
function init() {
    initGraTimeForm();
    initCitySelector();
    initAqiChartData();
}
window.onload = function () {
    init()
};
