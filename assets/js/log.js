layui.define(["http",  "thead", "form", "table", "laydate"], function(e) {
	var http = layui.http.http,
		urls = layui.urls,
		rouTo = layui.rouTo,
		thead = layui.thead;

	var $ = layui.jquery,
		form = layui.form,
		table = layui.table,
		laydate = layui.laydate;

	// 初始化时间
	laydate.render({
		elem: '#time',
		type: 'datetime',
		range: "~",
		trigger: 'click'
	});

	var username = "",
		startTime = "",
		endTime = "";
	var cols = thead("log");
	window.getListFn = function() {
		table.render({
			elem: '#table',
			url: urls.logList,
			method: "post",
			where: {
				name: username,
				startTime: startTime,
				endTime: endTime,
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
	form.on('submit(queryBtn)', function(data) {
		var data = data.field;
		username = data.name;
		var time = data.time;
		var idx = time.indexOf("~");
		startTime = time.substring(0, idx).trim();
		endTime = time.substring(idx + 1).trim();
		getListFn();
		return false;
	});
	e("log", {})
});
