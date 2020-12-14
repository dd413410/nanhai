layui.define(["http", "getFn", "form"], function(e) {
	var http = layui.http.http,
		urls = layui.urls,
		rouTo = layui.rouTo,
		getFn = layui.getFn;

	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form;


	$("#username").on("input", function(e) {
		var l = $(this).val().length;
		if (l > 0) {
			$("#userImg").attr("src", "./static/login3.png").attr("is", "2");
		} else {
			$("#userImg").attr("src", "./static/login2.png").attr("is", "1");
		};
	});
	$("#username").focus(function() {
		var l = $(this).val().length;
		if (l > 0) {
			$("#userImg").attr("src", "./static/login3.png").attr("is", "2");
		} else {
			$("#userImg").attr("src", "./static/login2.png").attr("is", "1");
		};
	});
	$("#userImg").click(function() {
		var is = $(this).attr("is");
		if (is == 2) {
			$("#username").val('');
			$("#userImg").attr("src", "./static/login2.png").attr("is", "1");
		}
	});
	$("#password").focus(function() {
		$("#userImg").attr("src", "./static/login2.png").attr("is", "1");
		$("#wordImg").attr("src", "./static/login5.png").attr("is", "2");
	});
	$("#wordImg").click(function() {
		var is = $(this).attr("is");
		if (is == 2) {
			$("#password").attr("type", "text");
			$("#wordImg").attr("src", "./static/login4.png").attr("is", "1");
		} else {
			$("#password").attr("type", "password");
			$("#wordImg").attr("src", "./static/login5.png").attr("is", "2");
		}
	});

	form.on('submit(login)', function(data) {
		var data = data.field;
		http({
			url: urls.login,
			type: "post",
			data: data,
			// data:{
			// 	userName:"cc12",
			// 	passWord:"12345678"
				
			// },
			success: function(res) {
				sessionStorage.id = res.data.id;
				sessionStorage.token = res.token;
				sessionStorage.userLevel = res.data.userLevel;
				sessionStorage.limit = res.data.permissionDetail;
				sessionStorage.userType = res.data.usePermission;
				rouTo.loginFn();
			}
		});
		return false;
	});
	$("#loginReg").click(function() {
		layer.open({
			type: 2,
			title: false,
			shade: 0.8,
			closeBtn: 0,
			skin: "lay-reg",
			// area: ["920px", "800px"],
			area: ["920px", "760px"],
			content: './reg.html'
		});
	});
	e("index", {})
});



// 自行注册>>
// 	默认为普通用户>>
// 	等待超管或者管理审核>>审核通过>>默认无权限>>等待超管或者管理分配权限
	
// 管理员添加>>
// 	分为普通用户和管理员>>
// 	普通用户>>无需审核>>审核通过>>默认无权限>>等待超管或者管理分配权限
// 	管理员>>等待超管审核>>审核通过>>默认无权限>>等待超管分配权限
	
// 超级管理员添加>>
// 	分为普通用户和管理员>>>>无需审核>>审核通过>>默认无权限>>
// 	普通用户>>等待超管或者管理员分配权限
// 	管理员>>等待超管分配权限
	
// 管理员把普通用户改为管理员
// 	>>等待超管审核>>审核通过>>之前权限全清空>>等待超管分配权限
	
// 超管可以把普通用户改为管理员
// 	>>无需审核>>直接通过>>之前权限全清空>>等待超管分配权限