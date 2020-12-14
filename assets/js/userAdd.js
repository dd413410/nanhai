layui.define(["http", "getFn", "form"], function(e) {
	var http = layui.http.http,
		urls = layui.urls,
		getFn = layui.getFn;

	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form;

	var userType = sessionStorage.userLevel;
	$("#type").val(userType);
	
	function getUnitFn() {
		http({
			url: urls.unit,
			type: "post",
			data: {},
			success: function(res) {
				var data = res.data;
				var str = '<option value="">直接选择或搜索选择</option>';
				for (var d = 0; d < data.length; d++) {
					var dataItem = data[d];
					str += '<option value="' + dataItem.unit + '">' + dataItem.unit + '</option>';
				};
				$("#unit").html(str);
				form.render("select");
			}
		});
	};
	// getUnitFn();

	form.on('submit(addBtn)', function(data) {
		var data = data.field;
		delete data.passwords;
		http({
			url: urls.register,
			type: "post",
			data: data,
			success: function(res) {
				layer.msg("添加成功");
				setTimeout(function() {
					collFn();
					parent.getListFn();
				}, 1500);
			}
		});
		return false;
	});
	form.verify({
		userName: function(val) {
			if (!getFn.username(val)) {
				return '请输入正确的用户名!';
			}
		},
		password: function(val) {
			if (!getFn.trimFn(val) || val.length > 16 || val.length < 4) {
				return '请输入4至16位的密码!';
			}
		},
		passwords: function(val) {
			if (val != $("#password").val()) {
				return '两次密码输入不一致!';
			}
		},
		realName: function(val) {
			if (!getFn.trimFn(val) || !getFn.user(val)) {
				return '请输入正确的真实姓名!';
			}
		},
		mobile: function(val) {
			if (!getFn.mobile(val)) {
				return '请输入正确的手机号!';
			}
		},
		unit: function(val) {
			if (!getFn.trimFn(val) || !val) {
				return '请输入单位名!';
			}
		},
	});
	window.collFn = function() {
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.close(index);
	};
	e("userAdd", {})
});
