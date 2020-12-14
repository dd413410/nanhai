layui.define(["http", "thead", "layer", "form", "table"], function(e) {
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
	var cols = thead("shipComp", 1);
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
		shipDeta = obj.data;
		var evet = obj.event;
		evet == 1 ? layFn() : dataExport();
	});
	// 导出
	function dataExport() {
		var url = urls.shipExport + '?boatId=' + shipDeta.boatId + '&token=' + sessionStorage.token;
		load.down(url);
	};

	function layFn() {
		var url = './shipDeta.html?id=' + shipDeta.boatId;
		layer.open({
			type: 2,
			title: false,
			shade: false,
			closeBtn: 0,
			id: "id",
			offset: ["60px", "350px"],
			area: ["680px", "680px"],
			content: url
		});
	};

	e("shipComp", {})
});
