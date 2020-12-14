layui.extend({
	urls: "api/urls",
	rouTo: "modul/rouTo",
}).define(["urls", "rouTo", "jquery", "layer"], function(exports) {
	var urls = layui.urls,
		rouTo = layui.rouTo;
	var $ = layui.$,
		lay = layui.layer;


	function http(val) {
		if (val.type == 'post') {
			val.contentType = 'application/x-www-form-urlencoded';
		};
		var url = val.url || '';
		var type = val.type || 'get';
		var data = val.data || {};
		var dataType = val.dataType || 'json';
		var async = val.async || true;
		var token = sessionStorage.token || '';
		data.token = token;
		$.ajax({
			url: url,
			type: type,
			headers: {
				'Content-Type': val.contentType,
				// 'token': token
			},
			data: data,
			dataType: dataType,
			async: async,
			beforeSend: function(bef) {
				val.beforeSend && val.beforeSend();
			},
			success: function(res) {
				if (res.code == 0) {
					lay.msg(res.msg);
					return false;
				} else if (res.code == 501) {
					rouTo.error(res.code);
					return false;
				};
				val.success && val.success(res);
			},
			error: function(err) {
				var status = err.status;
				if (status == 404) {
					lay.msg("请求地址不存在");
					return false;
				};
				console.log(err.status)
				// val.error && val.error(code);
			},
			complete: function(r) {
				val.complete && val.complete(r);
			}
		});
	};
	var load = {
		isClick: true,
		down: function(url) {
			if (load.isClick) {
				load.isClick = false;
				setTimeout(function() {
					load.isClick = true;
				}, 2000);
				window.top.open(url);
			};
		}
	};
	exports('http', {
		http: http,
		load: load
	});
});
