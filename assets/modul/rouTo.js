// layui.define(["setter", "layer"], function(exports) {
layui.define(["urls", "layer"], function(exports) {
	var urls = layui.urls;
	var layer = layui.layer;
	var base = urls.baseUrl,
		pathName = urls.pathName,
		baseUrl = base + pathName;

	var urlList = {
		"0": baseUrl + "/index.html",
		"11": baseUrl + "/page/home.html",
		"12": baseUrl + "/page/homes.html",
		"13": baseUrl + "/page/hom.html",
		"2": baseUrl + "/src/home.html",
		"211": baseUrl + "/src/user.html",
		// "221": baseUrl + "/src/ship.html",
		// "222": baseUrl + "/src/shipComp.html",
		"221": baseUrl + "/src/ships.html",
		"231": baseUrl + "/src/plus.html",
		"232": baseUrl + "/src/repair.html",
		// "241": baseUrl + "/src/anal.html",
		"241": baseUrl + "/src/anals.html",
		"25": baseUrl + "/src/inst.html",
		"26": baseUrl + "/src/datamag.html",
		"27": baseUrl + "/src/log.html",
		"28": baseUrl + "/src/info.html",
		"29": baseUrl + "/error/501a.html",
		"30": baseUrl + "/error/501b.html",
	};
	var rouTo = {
		loginFn: function() {
			var url = -1;
			var limit = sessionStorage.limit;
			if (limit.length <= 0) {
				url = -2;
				layer.msg("请等待管理员分配权限!")
				return false;
			} else {
				var data = limit.split(",");
				for (var i = 0; i < data.length; i++) {
					var key = data[i];
					if (key == 11 || key == 12 || key == 13) {
						url = urlList[key] ? urlList[key].replace(base, "") : "-1";
						break;
					} else {
						url = urlList["2"].replace(base, "");
					};
				};
			};
			this.rouToFn(url);
		},
		handUrl: function(key, is) {
			var limit = sessionStorage.limit.split(",");
			var url = urlList["29"].replace(base, "");

			for (var l = 0; l < limit.length; l++) {
				var dataItem = limit[l];
				if (dataItem == key) {
					url = urlList[key] ? urlList[key].replace(base, "") : "-1";
					break;
				}
			};
			var src = is ? url + "?is=" + is : url;
			this.rouToFn(src);
			// this.rouToFn(url);
		},
		handUrlFn: function(key) {
			var limit = sessionStorage.limit.split(",");
			var url = urlList["29"].replace(base, "");
			for (var l = 0; l < limit.length; l++) {
				var dataItem = limit[l];
				if (dataItem == key) {
					url = urlList[key] ? urlList[key].replace(base, "") : "-1";
					break;
				}
			};
			return url;
		},
		error: function(key) {
			var _this = this;
			switch (key) {
				case 501:
					layer.msg("登录过期，请重新登录");
					setTimeout(function() {
						_this.outFn();
					}, 2500);
					break;
				default:
			};
		},
		outFn: function() {
			var url = urlList["0"].replace(base, "");
			window.top.location.href = url;
		},
		rouToFn: function(url) {
			if (url == "-2") {
				url = urlList["29"].replace(base, "");
			} else if (url == "-1") {
				url = urlList["30"].replace(base, "");
			};
			window.location.href = url;
		}
	};
	exports('rouTo', rouTo);
});
