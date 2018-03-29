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
    var ViewModel = function(){
    	var self = this;
    	// map对象
        self.map = MAP;
        // 标记点数组
        self.markers = ko.observableArray([]);
        // 地址列表监听
        self.address = ko.observableArray([]);
        // 搜索输入文本
        self.filterContext = ko.observable('');
        self.filterContext.changed = ko.observable(true);
        // 点击切换左侧列表是否显示
        self.toggleLeft = function(){
        	$('.header').toggleClass('toggle');
        	$('.left-nav').toggleClass('toggle');
            $('.amap_lib_placeSearch_page').toggleClass('toggle');
        };
        // list
        self.$li = null;
        // list row
        self.$li_row = $('.result');
        // 筛选
        self.filter = function(){
        	var _address = self.address();
        	var _text = self.filterContext();
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
        self.listClick = function(item){
            var _index = (Number(item.name.split('.')[0]) - 1);
            $('.poibox').eq(_index).trigger('click');
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
        };

        self.init();
    };
});