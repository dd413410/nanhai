layui.define(["http", "getFn", "form", "table"], function(e) {
	var http = layui.http.http,
		urls = layui.urls,
		getFn = layui.getFn;

	var $ = layui.jquery,
		form = layui.form;

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
				getUserFn();
			}
		});
	};
	// getUnitFn();

	function getUserFn() {
		http({
			url: urls.userDeta,
			type: "post",
			data: {
				id: sessionStorage.id
			},
			success: function(res) {
				var data = res.data;
				form.val('userForm', {
					"id": data.id,
					"userName": data.userName,
					"creatTime": data.creatTime,
					"gender": data.gender,
					"userType": data.userType,
					"userLevel": data.userLevel,
					"realName": data.realName,
					"mobile": data.mobile,
					"unit": data.unit,
					"remarks": data.remarks,
					"isPass": data.isPass
				});
				$(".radio .layui-form-radio").each(function() {
					var is = $(this).hasClass("layui-form-radioed");
					if (!is) {
						$(this).prev().attr("disabled", true);
					};
				});
				form.render("radio");
			}
		});
	};
	getUserFn();


	form.on('submit(cBtn)', function(data) {
		var data = data.field;
		delete data.userName;
		http({
			url: urls.userChange,
			type: "post",
			data: data,
			success: function(res) {
				layer.msg(res.msg);
			}
		});
		return false;
	});

	var layAlr;
	form.on('submit(pBtn)', function() {
		$("#passForm")[0].reset();
		layAlr = layer.open({
			type: 1,
			title: false,
			shade: false,
			closeBtn: 0,
			id: "id",
			area: ["460px", "300px"],
			offset: ["200px", "30%"],
			content: $("#cBox")
		});
		return false;
	});
	form.on('submit(dBtn)', function() {
		var layMsg = layer.msg('此操作将永久注销此账号, 是否继续?', {
			time: 5000,
			shade: false,
			btn: ['确定', '取消'],
			yes: function() {
				http({
					url: urls.userDelete,
					type: 'post',
					data: {
						id: sessionStorage.id
					},
					success: function(res) {
						layer.msg('注销成功');
						setTimeout(function() {
							window.location.href = '../index.html';
							// setter.locaFn('../index.html');
						}, 1500);
					}
				});
			},
			btn2: function() {
				layer.msg('已取消注销。');
			}
		});
		return false;
	});

	//修改密码
	form.on('submit(conBtn)', function(data) {
		var data = data.field;
		delete data.new_passwords;
		data.id = sessionStorage.id;
		http({
			url: urls.password,
			type: "post",
			data: data,
			success: function(res) {
				layer.close(layAlr);
				layer.msg("修改密码成功");
			}
		});
		return false;
	});

	$(".cTle").click(function() {
		layer.close(layAlr);
	});

	// 密码type切换
	$(".domImg").click(function() {
		var type, c;
		var is = $(this).attr("is");
		is == 2 ? (type = "text", c = "1") : (type = "password", c = "2");
		$(this).prev("input").attr("type", type);
		var src = '../static/c' + is + '.png';
		$(this).find("img").attr("src", src);
		$(this).attr("is", c);
	});

	form.verify({
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
		old_password: function(val) {
			if (!getFn.trimFn(val)) {
				return '请输入旧密码!';
			}
		},
		new_password: function(val) {
			if (!getFn.trimFn(val) || val.length > 16 || val.length < 4) {
				return '请输入4至16位的新密码!';
			}
		},
		new_passwords: function(val) {
			if (val != $("#password").val()) {
				return '两次新密码输入不一致!';
			}
		}
	});






	e("info", {})
});
