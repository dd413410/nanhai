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
	
	//初始化下拉框
	function getXmFn() {
		var xmselect = xmSelect.render({
			el: '#xmselect',
			tips: '请选择船舶',
			name: 'shipname',
			prop: {
				name: 'contactName',
				value: 'boatId'
			},
			model: {
				label: {
					type: 'xmselect',
					xmselect: {
						template(data, sels) {
							return "已选中 " + sels.length + " 项, 共 " + data.length + " 项"
						}
					}
				}
			},
			toolbar: {
				show: true,
				showIcon: false
			},
			data: [],
			filterable: true,
			paging: true,
			pageSize: 5
		});

		http({
			url: urls.boatList,
			type: "post",
			success: function(res) {
				var data = res.data;
				xmselect.update({
					data: data
				})
			}
		});
	};
	getXmFn();

	var shipname = "";
	var cols = thead("ships");
	// 列表接口
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
		shipname = data.field.shipname;
		getListFn();
	});
	//新增
	form.on('submit(addBtn)', function(data) {
		layFn('./shipAdd.html', '添加船舶');
	});
	// 导出
	form.on('submit(export)', function(data) {
		shipname = data.field.shipname;
		if (shipname == '') {
			layer.msg("请选择船舶");
			return false;
		};
		http({
			url: urls.shipExport,
			type: "post",
			data: {
				boatId: shipname
			},
			success: function(res) {
				var url = res.url;
				load.down(url);
			}
		});
	});
	var shipDeta;
	table.on('tool(table)', function(obj) {
		shipDeta = obj;
		var evet = obj.event;
		/*evet:1:编辑;2:删除;3:详细信息*/
		switch (evet) {
			case '1':
				layFn('./shipAdd.html?id=' + shipDeta.data.boatId, '船舶信息修改');
				break;
			case '2':
				shipDelete();
				break;
			default:
				layFn('./shipDeta.html?id=' + shipDeta.data.boatId, '船舶详细信息', "682px", "680px");
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


	// 封装的弹窗
	var layAlr = null;

	function layFn(url, title, w, h) {
		if (!url) {
			return false;
		};
		var w = w || "540px",
			h = h || "722px";
		layAlr = layer.open({
			type: 2,
			title: title,
			skin: "ship-tle",
			shade: false,
			closeBtn: 1,
			id: "id",
			area: [w, h],
			content: url
		});
	};
	e("ships", {})
});
