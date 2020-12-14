layui.define(["http", "getFn", "form"], function(e) {
	var http = layui.http.http,
		urls = layui.urls,
		getFn = layui.getFn;

	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form;

	var id = getFn.locaStr("id");

	function getUserDetaFn() {
		http({
			url: urls.userDeta,
			type: "post",
			data: {
				id: id
			},
			success: function(res) {
				var data = res.data;
				var level = data.userLevel;
				form.val('userForm', {
					"id": data.id,
					"userName": data.userName,
					"userLevel": data.userLevel,
					"realName": data.realName,
					"mobile": data.mobile,
					"unit": data.unit,
					"remarks": data.remarks
				});
				// $("#gender .layui-form-radio").each(function() {
				// 	var is = $(this).hasClass("layui-form-radioed");
				// 	if (!is) {
				// 		$(this).prev().attr("disabled", true);
				// 	};
				// });

				form.render();
			}
		});
	};
	getUserDetaFn();


	form.on('submit(addBtn)', function(data) {
		var data = data.field;
		delete data.userName;
		http({
			url: urls.userChange,
			type: "post",
			data: data,
			success: function(res) {
				layer.msg("修改用户信息成功");
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
		passWord: function(val) {
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
	e("userChange", {})
});
