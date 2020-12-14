layui.define(["http", "getFn", "dtree", "form"], function(e) {
	var http = layui.http.http,
		urls = layui.urls,
		getFn = layui.getFn,
		dtree = layui.dtree;

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
					"userName": data.userName,
					"usePermission": data.usePermission
				});
				var limit = data.permissionDetail;
				getLimintFn(limit);
			}
		});
	};
	getUserDetaFn();
	// 获取权限列表
	function getLimintFn(limit) {
		http({
			url: "../assets/json/tree.json",
			success: function(res) {
				var data = res.data;
				var DTree = dtree.render({
					elem: "#tree",
					dataStyle: "layuiStyle",
					width: 390,
					data: data,
					initLevel: 5,
					skin: "laySimple",
					nodeIconArray: {
						"3": {
							"open": "dtree-icon-jian",
							"close": "dtree-icon-jia"
						}
					},
					ficon: ["3", "7"],
					checkbar: true,
					checkbarType: "all",
					done: function() {
						dtree.chooseDataInit("tree", limit);
					}
				});
			}
		});
	};
	form.on('submit(addBtn)', function(data) {
		var data = data.field;
		var param = dtree.getCheckbarNodesParam("tree");
		var arr = [];
		for (var p = 0; p < param.length; p++) {
			arr.push(param[p].nodeId)
		};
		arr.push("28");
		var str = arr.join(',');
		data.permissionDetail = str;
		http({
			url: urls.userDist,
			type: "post",
			data: data,
			success: function(res) {
				layer.msg("分配权限成功");
				setTimeout(function() {
					collFn();
				}, 3000)
			}
		});
		return false;
	});

	form.verify({
		username: function(val) {
			if (!getFn.user(val) || val.length > 12 || val.length < 5) {
				return '请输入正确的角色名称!';
			}
		}
	});

	window.collFn = function() {
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.close(index);
	};
	e("userRole", {})
});
