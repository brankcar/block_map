/**
 * Created by lijiasichina@163.com on 2018/3/27.
 */
$(document).ready(function(){
    /**
     * 常量 map 数据
     * @type {AMap.Map}
     */
    var MAP = new AMap.Map('container');
    /**
     * 常量：[OPTIONS 地点查询类]
     * @type {Object}
     */
    var OPTIONS = { //构造地点查询类
        pageIndex: 1, // 页码
        city: "028", //城市
        map: MAP,// map对象
        pageSize: 50, // 每页有多少条数据：1-50
        panel: 'result'
    };
    /**
     * 常量：[URL 第三方天气api接口]
     * @type {String}
     */
    var URL = 'http://v.juhe.cn/weather/index';
    var ViewModel = function(){
    	var self = this;
    	// map对象
        self.map = MAP;
        // 是否切换左侧列表
        self.is_toggle = ko.observable(false);
        // 标记点数组
        self.markers = ko.observableArray([]);
        // 地址列表监听
        self.address = ko.observableArray([]);
        // 搜索输入文本
        self.filterContext = ko.observable('');
        self.filterContext.changed = ko.observable(true);
        /**
         * [weather 天气对象]
         * @type {Object}
         */
        self.weather = {
        	temp: ko.observable(''), // 当前温度
        	wind_direction: ko.observable(''),// 当前风向
        	wind_strength: ko.observable(''),// 当前风力
        	humidity: ko.observable(''),// 当前湿度
        	adname: ko.observable(''),// 所在位置
        	dressing_advice: ko.observable(''),// 穿衣建议
        	error: ko.observable(false),// 是否有错误信息
        	success: ko.observable(true), // 是否请求成功
        	error_message: ko.observable('')// 错误信息
        };
        // 点击切换左侧列表是否显示
        self.toggleLeft = function(){
        	self.is_toggle(self.is_toggle() ? false : true);
        };
        // list
        self.$li = null;
        // list row
        self.$li_row = $('.result');
        // 筛选
        self.filter = function(){
        	var _address = self.address();
        	var _text = self.filterContext().trim();// trim 去除左右空格
        	var reg = new RegExp(_text);
        	for(var i = 0,len = self.address().length; i < len; i++) {
				if(self.address()[i].name.match(reg)){
					self.address()[i].is_show(true);
					$('.amap-marker').eq(i).show();
				}else{
					$('.amap-marker').eq(i).hide();
					self.address()[i].is_show(false);
				}
			}
        };
        // 点击列表
        self.listClick = function(item, event){
        	var _name = item.name.split('.');
            var _index = (Number(_name[0]) - 1);
            $('.poibox').eq(_index).trigger('click');
            self.getWeather(item.adname); // 点击景点获取及时天气数据
        };
        // 第三方天气信息获取
        self.getWeather = function(text){
        	$.get(
        		URL + '?cityname='+ encodeURI(text) +'&key=999c02eeb9e06c838c6e90f7188cd801',
        		function(result){
	        		if(result.resultcode == 200){
        				self.weatherUpdata(result, text);
	        		}else{
	        			self.error(result.reason);
	        		}
        		},
        		'jsonp'
        	);
        };
        // 更新天气信息
        self.weatherUpdata = function(data, adname){
        	var _data = data.result
        	var _sk = _data.sk;
        	var _today = _data.today;
			self.weather.error(false);
        	self.weather.success(true);
        	self.weather.temp(_sk.temp);
        	self.weather.wind_direction(_sk.wind_direction);
        	self.weather.wind_strength(_sk.wind_strength);
        	self.weather.humidity(_sk.humidity);
        	self.weather.adname(adname);
        	self.weather.dressing_advice(_today.dressing_advice);
        };
        // 错误信息
        self.error = function(err){
        	self.weather.error(true);
        	self.weather.success(false);
        	self.weather.error_message('查询不到该地点准确信息');
        };
        // 初始化地图
        self.init = function(){
            AMap.service('AMap.PlaceSearch',function(){
                self.search = new AMap.PlaceSearch(OPTIONS);

                //关键字查询，您如果想修改结果展现效果，请参考页面：http://lbs.amap.com/fn/css-style/
                self.search.search('景点', function(status, result){
                    if (status === 'complete' && result.info === 'OK') {
                        // 循环获取到的地址数组，并添加到address
                        for(var i = 0; i < result.poiList.pois.length; i++){
                            var pois = result.poiList.pois[i];
                            pois.name = (i + 1) + '.' + pois.name;
                            pois.is_show = ko.observable(true);
                            self.address.push(pois);
                        }
                        self.$li = $('.city-list li');
                    }
                });
            });

            AMap.event.addListener(self.search, "markerClick", function(e){
                var _li = self.$li.eq(e.index);
                _li.addClass('hover').siblings('li').removeClass('hover');
                self.$li_row.animate({
                    scrollTop: (e.index + 1) * 40 - 40
                },200);
            });
            self.getWeather('成都', '成都市');
        };

        self.init();
    };

    ko.applyBindings(new ViewModel());
});