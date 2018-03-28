/**
 * Created by lijiasichina@163.com on 2018/3/27.
 */
$(document).ready(function(){
    var ViewModel = function(){
    	var that = this;
    	// map对象
        that.map = new AMap.Map('container');
		/**
		 * 常量：[OPTIONS 地点查询类]
		 * @type {Object}
		 */
		var OPTIONS = { //构造地点查询类
		    pageSize: 5,
		    pageIndex: 1,
		    city: "028", //城市
		    map: that.map,
		    panel: "result"
		};
        // 地址列表监听
        that.address = ko.observableArray([]);
        // 点击切换左侧列表是否显示
        that.toggleLeft = function(){
        	$('.header').toggleClass('toggle');
        	$('.left-nav').toggleClass('toggle');
        };
        // 初始化地图数据
        that.getMapData = (function(){
        	AMap.service('AMap.PlaceSearch',function(){
			    that.search = new AMap.PlaceSearch(OPTIONS);
			    
			    //关键字查询，您如果想修改结果展现效果，请参考页面：http://lbs.amap.com/fn/css-style/
			    that.search.search('景点', function(status, result){
			    	if (status === 'complete' && result.info === 'OK') {
			    		// 循环获取到的地址数组，并添加到address
			            for(var i = 0; i < result.poiList.pois.length; i++){
			            	that.address.push(result.poiList.pois[i]);

			            }
			        }
			    })
			});
        })();
    };
    ko.applyBindings(new ViewModel());


    var render = {
    	
    }
});