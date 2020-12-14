layui.define(['jquery'], function(exports) {
	var $ = layui.$;
	var getFn = {
		locaStr: function(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) return decodeURI(r[2]);
			return null;
		},
		initDate: function() {
			var date = new Date();
			var y = date.getFullYear();
			var m = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
			var d = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate();
			var dateStr = y + '-' + m + '-' + d;
			return dateStr;
		},
		initM: function() {
			var date = new Date();
			var y = date.getFullYear();
			var m = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
			var init = y + '-' + m;
			return init;
		},
		initH: function() {
			var date = new Date();
			var y = date.getFullYear();
			var m = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
			var d = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate();
			var h = date.getHours() >= 10 ? date.getHours() : '0' + date.getHours();
			var dateStr = y + '-' + m + '-' + d + '-' + h;
			return dateStr;
		},
		username: function(val) { //账号验证
			return (/^[a-zA-z]\w{4,11}$/.test(val))
		},
		user: function(val) { //姓名验证
			return (/^[\u4E00-\u9FA5a-zA-Z]*$/.test(val))
		},
		phone: function(val) { //电话验证
			return (/^0\d{2,3}-?\d{7,8}$/.test(val))
		},
		mobile: function(val) {
			return (/^1[3456789]\d{9}$/.test(val))
		},
		fax: function(val) { //传真验证
			return (/^(?:\d{3,4}-)?\d{7,8}(?:-\d{1,6})?$/.test(val))
		},
		email: function(val) { //邮箱验证
			return (/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(val))
		},
		trimFn: function(name) { //验证是否为空
			return (/\S/.test(name));
		},
		regLog: function(val) { //验证经度
			var regLog = /^-?((0|1?[0-7]?[0-9]?)(([.][0-9]{1,4})?)|180(([.][0]{1,4})?))$/;
			return (regLog.test(val));
		},
		regLat: function(val) { //验证纬度
			var regLat = /^-?((0|[1-8]?[0-9]?)(([.][0-9]{1,4})?)|90(([.][0]{1,4})?))$/;
			return (regLat.test(val));
		},
		regDeta: function(val) { //验证日期;格式为2020-01-01
			// var reg = /^(?:19|20)[0-9][0-9]-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:[0-2][1-9])|(?:[1-3][0-1]))$/;
			var reg = /^(?:19|20)[0-9][0-9]-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:[0-2][1-9])|(?:[1-3][0-1])) (?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]:[0-5][0-9]$/;
			
			return (reg.test(val));
		},
		judge: function(x) { //判断权限
			var str = sessionStorage.str;
			return str.includes(x);
		},
		base: function() {
			var curPath = window.document.location.href;
			var pathName = window.document.location.pathname;
			var pos = curPath.indexOf(pathName);
			var localhostPath = curPath.substring(0, pos);
			var projectName = pathName.substring(
				0,
				pathName.substr(1).indexOf("/") + 1
			);
			var url = localhostPath + projectName;
			return url;
		}
	};
	exports('getFn', getFn);
});
