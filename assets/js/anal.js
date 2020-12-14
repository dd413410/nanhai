layui.define(["http", "thead", "form", "table", "laydate"], function(e) {
	var http = layui.http.http,
		urls = layui.urls,
		rouTo = layui.rouTo,
		thead = layui.thead;

	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form,
		table = layui.table,
		laydate = layui.laydate;

	// 初始化时间
	laydate.render({
		elem: '#time',
		range: "~",
		trigger: 'click'
	});


	//初始化下拉框
	function getXmFn() {
		var xmselect = xmSelect.render({
			el: '#xmselect',
			tips: '请选择船舶',
			name: 'name',
			layVerify: 'required',
			layVerType: 'msg',
			layReqText: '请选择船舶',
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


	var boatList = '',
		startTime = '',
		endTime = '';
	var cols = thead("anal");
	window.getListFn = function() {
		table.render({
			elem: '#table',
			url: urls.analList,
			method: "post",
			where: {
				name: boatList,
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
					"data": res.data,
					"total": res.total,
				};
			},
			cols: [cols],
			page: {
				layout: ['prev', 'page', 'next', 'skip', 'count', 'limit'],
				groups: 5
			},
			limits: [10],
			id: 'tabReload',
			height: "780",
			totalRow: true,
			done: function(res) {
				var data = res.total;
				$('.layui-table-total table td:eq(4) div').html(data.runRate);
				$('.layui-table-total table td:eq(5) div').html(data.arrivalRate);
				$('.layui-table-total table td:eq(6) div').html(data.goodRate);
			}
		});
	};
	getListFn();
	// 查询
	form.on('submit(queryBtn)', function(data) {
		var data = data.field;
		boatList = data.name;
		var time = data.time;
		var idx = time.indexOf("~");
		startTime = time.substring(0, idx).trim();
		endTime = time.substring(idx + 1).trim();
		getListFn();
		return false;
	});

	e("anal", {})
});
