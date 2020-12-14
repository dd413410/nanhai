layui.define(["http", "thead", "form", "table", "laydate"], function(e) {
	var http = layui.http.http,
		load = layui.http.load,
		urls = layui.urls,
		rouTo = layui.rouTo,
		thead = layui.thead;

	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form,
		table = layui.table,
		laydate = layui.laydate;

	var userType = sessionStorage.userType;
	userType == 1 ? $('[name="isBtn"]').show() : $('[name="isBtn"]').hide();
	
	// 初始化时间
	laydate.render({
		elem: '#time',
		range: "~",
		trigger: 'click'
	});
	var boatList = '',
		startTime = '',
		endTime = '';
	var cols = thead("anal");

	//初始化下拉框
	var xmselect = null;

	function getXmFn() {
		xmselect = xmSelect.render({
			el: '#xmselect',
			tips: '请选择船舶',
			name: 'name',
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


	// 加载数据
	function getListFns() {
		http({
			url: urls.analList,
			type: "post",
			data: {
				name: boatList,
				startTime: startTime,
				endTime: endTime
			},
			success: function(res) {
				var data = res.data;
				var total = res.total;
				table.render({
					elem: '#table',
					data: data,
					cols: [cols],
					height: 'full-70',
					id: 'tabReload',
					limit: res.count,
					totalRow: true,
					done: function(res) {
						$('.layui-table-total table td:eq(1) div').html("船舶运行率:" + total.runRate);
						$('.layui-table-total table td:eq(2) div').html("");
						$('.layui-table-total table td:eq(3) div').html(total.arrivalRate);
						$('.layui-table-total table td:eq(5) div').html(total.goodRate);
					}
				});
			}
		});
	};
	// 查询
	form.on('submit(queryBtn)', function(data) {
		var data = data.field;
		boatList = data.name;
		var time = data.time;
		var idx = time.indexOf("~");
		startTime = time.substring(0, idx).trim();
		endTime = time.substring(idx + 1).trim();
		getListFns();
	});
	// 查询
	form.on('submit(export)', function(data) {
		var data = data.field;
		boatList = data.name;
		if (boatList == '') {
			layer.msg("请选择船舶");
			return false;
		};
		var time = data.time;
		var idx = time.indexOf("~");
		startTime = time.substring(0, idx).trim();
		endTime = time.substring(idx + 1).trim();
		http({
			url: urls.analExport,
			type: "post",
			data: {
				name: boatList,
				startTime: startTime,
				endTime: endTime
			},
			success: function(res) {
				var url = res.url;
				load.down(url);
			}
		});
	});
	e("anals", {})
});
