layui.define(["http", "thead", "layer", "form", "table"], function(e) {
	var http = layui.http.http,
		urls = layui.urls,
		rouTo = layui.rouTo,
		thead = layui.thead;

	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form,
		table = layui.table;


	var userType = sessionStorage.userType;
	userType == 1 ? $('[name="isBtn"]').show() : $('[name="isBtn"]').hide();

	var username = '',
		userLevel = '',
		isPass = 3;

	var cols = thead("user", 1);
	window.getListFn = function() {
		table.render({
			elem: '#table',
			url: urls.userList,
			method: "post",
			where: {
				name: username,
				userLevel: userLevel,
				isPass: isPass,
				token: sessionStorage.token
			},
			request: {
				pageName: 'pages',
				limitName: 'pageNums'
			},
			parseData: function(res) {
				rouTo.error(res.code);
				return {
					"code": 0,
					"count": res.count,
					"data": res.data
				};
			},
			cols: [cols],
			page: {
				layout: ['prev', 'page', 'next', 'skip', 'count', 'limit'],
				groups: 5
			},
			limits: [10],
			id: 'tabReload',
			height: "780"
		});
	};
	getListFn();
	// 查询
	form.on('submit(queryBtn)', function(data) {
		var data = data.field;
		username = data.username;
		isPass = data.isPass;
		userLevel = data.userLevel;
		getListFn();
		return false;
	});
	//新增
	$("#addBtn").click(function() {
		layFn('./userAdd.html', "添加用户", "542px", "652px");
	});
	form.on('submit(addBtn)', function(data) {
		layFn('./userAdd.html', "添加用户", "542px", "652px");
	});

	var userDeta;
	table.on('tool(table)', function(obj) {
		userDeta = obj;
		var evet = obj.event;
		/*evet: 1:审核通过(通过和拒绝走一个接口);2:审核拒绝(通过和拒绝走一个接口);3:删除;4:详情查看;5:修改;6:权限分配;*/
		switch (evet) {
			case '1':
				cAppFn(evet);
				break;
			case '2':
				cAppFn(evet);
				break;
			case '3':
				userDelete();
				break;
			case '4':
				var url, id = userDeta.data.id;
				!id ? layer.msg("无此账号") : url = './userDeta.html?id=' + id;
				layFn(url, "详细信息", "542px", "602px");
				break;
			case '5':
				var url, id = userDeta.data.id;
				!id ? layer.msg("无此账号") : url = './userChange.html?id=' + id;
				layFn(url, "修改信息", "542px", "602px");
				break;
			default:
				var url, id = userDeta.data.id;
				!id ? layer.msg("无此账号") : url = './userRole.html?id=' + id;
				layFn(url, "权限分配", "542px", "642px");
				break;
		};
	});


	// layFn('./userAdd.html', "540px", "650px");
	// 审核接口
	function cAppFn(x) {
		http({
			url: urls.approve,
			type: "post",
			data: {
				id: userDeta.data.id,
				isPass: x
			},
			success: function(res) {
				layer.msg(res.msg);
				table.reload('tabReload', {
					page: {
						curr: $(".layui-laypage-em").next().html()
					}
				});
			}
		});
	};
	// 删除用户
	function userDelete() {
		var layMsg = layer.msg('此操作将永久删除该数据, 是否继续?', {
			time: 5000,
			shade: false,
			btn: ['确定', '取消'],
			yes: function() {
				http({
					url: urls.userDelete,
					type: 'post',
					data: {
						id: userDeta.data.id
					},
					success: function(res) {
						userDeta.del();
						layer.msg('删除成功');
						table.reload('tabReload', {
							page: {
								curr: $(".layui-laypage-em").next().html()
							}
						});
						layer.close(layMsg);
					}
				});
			},
			btn2: function() {
				layer.msg('已取消删除。');
			}
		});
	};

	// 封装的弹窗
	var layAlr = null;

	function layFn(url, title, width, height) {
		if (!url) {
			return false;
		};
		var width = width || "540px",
			height = height || "680px";
		layAlr = layer.open({
			type: 2,
			skin: 'drop-demo',
			title: title,
			shade: false,
			closeBtn: 1,
			id: "id",
			area: [width, height],
			content: url
		});
	};
	e("user", {})
});
