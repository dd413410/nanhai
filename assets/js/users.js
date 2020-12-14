layui.define(["http", "layer", "form", "table"], function(e) {
	var http = layui.http.http,
		urls = layui.urls,
		getFn = layui.getFn;

	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form,
		table = layui.table;

	var username = '',
		userType = 2,
		userLevel = 2;

	window.getListFn = function() {
		table.render({
			elem: '#table',
			url: urls.userList,
			method: "post",
			where: {
				name: username,
				userType: userType,
				userLevel: userLevel,
				token: sessionStorage.token
			},
			request: {
				pageName: 'pages',
				limitName: 'pageNums'
			},
			parseData: function(res) {
				return {
					"code": 0,
					"count": res.count,
					"data": res.data
				};
			},
			cols: [
				[{
						fixed: 'left',
						field: 'userName',
						title: '用户名',
						minWidth: 100
					},
					{
						field: 'gender',
						title: '性别',
						width: 80,
						minWidth: 80
					},
					{
						title: '用户状态',
						width: 100,
						minWidth: 100,
						templet: function(item) {
							return item.userType == 0 ? "有效" : '<span style="color: #f00;">无效</span>';
						}
					},
					{
						title: '用户权限',
						width: 110,
						minWidth: 110,
						templet: function(item) {
							return item.userLevel == 0 ? "管理员" : "普通用户";
						}
					},
					{
						field: 'unit',
						title: '单位名称',
						minWidth: 150
					},
					{
						field: 'mobile',
						title: '手机号码',
						minWidth: 150
					},
					{
						field: 'creatTime',
						title: '创建时间',
						minWidth: 210
					},
					{
						title: '审核状态',
						minWidth: 120,
						templet: function(item) {
							var html = item.isPass == 0 ? '<span style="color: #018377;">审核通过</span>' :
								item.isPass == 1 ? '<span style="color: #FFB203;">待审核</span>' :
								'<span style="color: #f00;">审核拒绝</span>';
							return html;
						}
					},
					{
						field: 'remarks',
						title: '备注',
						minWidth: 120
					},
					{
						fixed: 'right',
						minWidth: 280,
						align: "center",
						title: '操作',
						toolbar: '#barDemo'
					}
				]
			],
			id: 'testReload',
			page: {
				layout: ['count', 'prev', 'page', 'next', 'skip'],
				groups: 5
			},
			height: "780"
		});
	};
	getListFn();
	// 查询
	form.on('submit(queryBtn)', function(data) {
		var data = data.field;
		username = data.username;
		userType = data.userType;
		userLevel= data.userLevel;
		getListFn();
		return false;
	});

	var itemDeta;
	table.on('tool(table)', function(obj) {
		itemDeta = obj.data;
		var evet = obj.event;
		/*
			evet:  
				0:审核通过(通过和拒绝走一个接口)
				1:删除
				2:审核拒绝(通过和拒绝走一个接口)
				3:详细修改
				4:重置密码
		*/
		switch (evet) {
			case '0':
				userChangFn(evet);
				break;
			case '1':
				var layMsg = layer.msg('此操作将永久删除该数据, 是否继续?', {
					time: 5000,
					shade: false,
					btn: ['确定', '取消'],
					yes: function() {
						obj.del();
						userDelete();
						layer.close(layMsg);
					},
					btn2: function() {
						layer.msg('已取消删除。');
					}
				});
				break;
			case '2':
				userChangFn(evet);
				break;
			case '3':
				var url, id = itemDeta.id;
				!id ? layer.msg("无此账号") : url = './userChange.html?id=' + id;
				layFn(url, 2, "540px", "600px");
				break;
			default:
				$("#userid").val(itemDeta.id);
				$("#username").val(itemDeta.userName);
				layFn($("#cBox"), 1, "460px", "350px");
				break;
		};
	});

	$("#addBtn").click(function() {
		layFn('./userAdd.html', 2);
	});

	// 通过或者拒绝
	function userChangFn(evet) {
		itemDeta.isPass = evet;
		http({
			url: urls.userChange,
			type: "post",
			data: itemDeta,
			success: function(res) {
				layer.msg(res.msg);
				table.reload('testReload', {
					page: {
						curr: $(".layui-laypage-em").next().html()
					}
				});
			}
		});
	};
	// 删除
	function userDelete() {
		http({
			url: urls.userDelete,
			type: 'post',
			data: {
				id: itemDeta.id
			},
			success: function(res) {
				layer.msg('删除成功');
				table.reload('testReload', {
					page: {
						curr: $(".layui-laypage-em").next().html()
					}
				});
			}
		});
	};

	// 封装的弹窗
	var layAlr = null;

	function layFn(url, type, width, height) {
		if (!url) {
			return false;
		};
		var type = type || 1,
			width = width || "540px",
			height = height || "680px";
		layAlr = layer.open({
			type: type,
			title: false,
			shade: false,
			closeBtn: 0,
			id: "id",
			area: [width, height],
			content: url
		});
	};
	

	

	
	e("user", {})
});
