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
    	var that = this;
    	// map对象
        that.map = MAP;
        // 标记点数组
        that.markers = ko.observableArray([]);
        // 地址列表监听
        that.address = ko.observableArray([]);
        // 搜索输入文本
        that.filterContext = ko.observable('');
        // 点击切换左侧列表是否显示
        that.toggleLeft = function(){
        	$('.header').toggleClass('toggle');
        	$('.left-nav').toggleClass('toggle');
            $('.amap_lib_placeSearch_page').toggleClass('toggle');
        };
        // list
        that.$li = null;
        // list row
        that.$li_row = $('.result');
        // 筛选
        that.filter = function(){

        };
        // 点击列表
        that.listClick = function(item){
            console.log(item)
        };
        // 初始化地图
        that.init = function(){
            AMap.service('AMap.PlaceSearch',function(){
                that.search = new AMap.PlaceSearch(OPTIONS);

                //关键字查询，您如果想修改结果展现效果，请参考页面：http://lbs.amap.com/fn/css-style/
                that.search.search('景点', function(status, result){
                    if (status === 'complete' && result.info === 'OK') {
                        // 循环获取到的地址数组，并添加到address
                        for(var i = 0; i < result.poiList.pois.length; i++){
                            result.poiList.pois[i].name = (i + 1) + '.' + result.poiList.pois[i].name;
                            var pois = result.poiList.pois[i];
                            that.address.push(pois);
                        }
                        that.$li = $('.city-list li');
                    }
                });
            });

            AMap.event.addListener(that.search, "markerClick", function(e){
                var _li = that.$li.eq(e.index);
                _li.addClass('hover').siblings('li').removeClass('hover');
                that.$li_row.animate({
                    scrollTop: (e.index + 1) * 40 - 40
                },200);
            });
        };

        that.init();
    };
    ko.applyBindings(new ViewModel());

});