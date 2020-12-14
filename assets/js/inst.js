layui.define(["http", "thead", "form", "table"], function(e) {
	var http = layui.http.http,
		load = layui.http.load,
		urls = layui.urls,
		rouTo = layui.rouTo,
		thead = layui.thead;

	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form,
		table = layui.table;

	var userType = sessionStorage.userType;
	userType == 1 ? $('[name="isBtn"]').show() : $('[name="isBtn"]').hide();

	var inst = "",
		type = 0;
	var cols = thead("inst", 1, 420);
	window.getListFn = function() {
		table.render({
			elem: '#table',
			url: urls.instList,
			method: "post",
			where: {
				name: inst,
				type: type,
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
		inst = data.inst;
		type = data.type;
		getListFn();
		return false;
	});

	var instData;
	table.on('tool(table)', function(obj) {
		var evet = obj.event;
		instData = obj;
		switch (evet) {
			case "1":
				var id = obj.data.id;
				var url = "./instDeta.html?id=" + id;
				layFn(url, '<img src="../static/zyc11.png"><span>仪器设备采集信息表</span>');
				break;
			case "2":
				var names = instData.data.instrumentName;
				var url = "./instData.html?names=" + names;
				// layFn(url);
				layFn(url, '<img src="../static/zyc11.png"><span>比测信息</span>');
				break;
			case "3":
				instDelete();
				break;
			case "4":
				var id = obj.data.id;
				var url = "./instChang.html?id=" + id;
				// layFn(url);
				layFn(url, '<img src="../static/zyc11.png"><span>仪器设备采集信息表</span>');
				break;
			case "5":
				var names = instData.data.instrumentName;
				var url = "./instTime.html?names=" + names;
				// layFn(url, "500px");
				layFn(url, '<img src="../static/zyc13.png"><span>检定/校验时间</span>', "500px");
				break;
			default:
				dataExport();
				break;
		};
	});

	$("#addBtn").click(function() {
		var url = "./instAdd.html";
		layFn(url);
	});
	// var url = "./instAdd.html";
	// layFn(url);
	// 删除
	function instDelete() {
		var layMsg = layer.msg('此操作将永久删除该数据, 是否继续?', {
			time: 5000,
			shade: false,
			btn: ['确定', '取消'],
			yes: function() {
				http({
					url: urls.instDelete,
					type: "post",
					data: {
						id: instData.data.id
					},
					success: function(res) {
						instData.del();
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
	// 导出
	function dataExport() {
		var url = urls.instExport + '?id=' + instData.data.id + '&token=' + sessionStorage.token;
		load.down(url);
	};

	function layFn(url, title, w, h) {
		if (!url) {
			return false;
		};
		var area_w = w || "680px",
			area_h = h || "822px";
		layer.open({
			type: 2,
			skin: 'drop-demo',
			title: title,
			shade: false,
			closeBtn: 1,
			id: "id",
			area: [area_w, area_h],
			content: url
		});
	};
	window.collFn = function() {
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.close(index);
	};
	e("inst", {})
});
