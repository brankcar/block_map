/**
 * Created by lijiasichina@163.com on 2018/3/27.
 */
$(document).ready(function(){
    var city_data = [{

    },{

    }];
    var ViewModel = function(){
        this.map = new AMap.Map('container');
        this.city = ko.observableArray(city_data);
    };
    ko.applyBindings(new ViewModel());
});