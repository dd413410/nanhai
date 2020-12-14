layui.define(["http", "getFn", "form"], function(e) {
	var http = layui.http.http,
		urls = layui.urls,
		getFn = layui.getFn;

	var $ = layui.jquery,
		layer = layui.layer,
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
				getUserDetaFn();
			}
		});
	};
	getUnitFn();


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
					"userName": data.userName,
					"userLevel": data.userLevel,
					"realName": data.realName,
					"mobile": data.mobile,
					"unit": data.unit,
					"remarks": data.remarks
				});
				$(".radio .layui-form-radio").each(function() {
					var is = $(this).hasClass("layui-form-radioed");
					if (!is) {
						$(this).prev().attr("disabled", true);
					};
				});
				form.render();
			}
		});
	};
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
	window.collFn = function() {
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.close(index);
	};
	e("userDeta", {})
});
