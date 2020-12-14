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

	var shipname = "";
	var cols = thead("ship");
	window.getListFn = function() {
		table.render({
			elem: '#table',
			url: urls.shipLists,
			method: "post",
			where: {
				name: shipname,
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
				layout: ['count', 'prev', 'page', 'next', 'skip'],
				groups: 5
			},
			id: 'tabReload',
			height: "780"
		});

	};
	getListFn();
	// 查询
	form.on('submit(queryBtn)', function(data) {
		shipname = data.field.shipname;
		getListFn();
		return false;
	});
	var shipDeta;
	table.on('tool(table)', function(obj) {
		shipDeta = obj;
		var evet = obj.event;
		/*evet:1:编辑;2:删除;3:导出*/
		switch (evet) {
			case '1':
				layFn('./shipAdd.html?id=' + shipDeta.data.boatId);
				break;
			case '2':
				shipDelete();
				break;
			default:
				dataExport();
				break;
		};
	});

	// 删除船舶
	function shipDelete() {
		var layMsg = layer.msg('此操作将永久删除该数据, 是否继续?', {
			time: 5000,
			shade: false,
			btn: ['确定', '取消'],
			yes: function() {
				http({
					url: urls.shipDelete,
					type: "post",
					data: {
						id: shipDeta.data.id
					},
					success: function(res) {
						shipDeta.del();
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
		var url = urls.shipExport + '?boatId=' + shipDeta.data.boatId + '&token=' + sessionStorage.token;
		load.down(url);
	};
	$("#addBtn").click(function() {
		layFn('./shipAdd.html');
	});
	// 封装的弹窗
	var layAlr = null;

	function layFn(url) {
		if (!url) {
			return false;
		};
		layAlr = layer.open({
			type: 2,
			title: false,
			shade: false,
			closeBtn: 0,
			id: "id",
			offset: ["60px", "350px"],
			area: ["540px", "680px"],
			content: url
		});
	};
	e("ship", {})
});
