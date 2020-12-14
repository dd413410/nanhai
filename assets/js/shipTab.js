layui.define(["http", "getFn", "thead", "form", "table"], function(e) {
	var http = layui.http.http,
		urls = layui.urls,
		getFn = layui.getFn,
		thead = layui.thead;

	var $ = layui.jquery,
		form = layui.form,
		table = layui.table;

	var boatId = getFn.locaStr("id");
	var type = 0;
	var cols = thead("home");
	function getDataFn() {
		table.render({
			elem: '#table',
			url: urls.getTab,
			method: "post",
			where: {
				type: type,
				boatId: boatId,
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
			cols: [cols],
			page: {
				layout: ['prev', 'page', 'next', 'skip', 'count', 'limit'],
				groups: 5
			},
			limits: [10],
			id: 'tabReload',
			height: 490
		});
	};
	getDataFn();


	// 选择时间后进行查询
	form.on('select(dateFilt)', function(data) {
		type = data.value;
		getDataFn();
		return false;
	});


	e("shipTab", {})
});
