layui.define(["http", "getFn", "thead", "form", "table", "layer", "laydate"], function(e) {
	var http = layui.http.http,
		urls = layui.urls,
		rouTo = layui.rouTo,
		getFn = layui.getFn,
		thead = layui.thead;

	var $ = layui.jquery,
		form = layui.form,
		layer = layui.layer,
		table = layui.table,
		laydate = layui.laydate;
		
		var userType = sessionStorage.userType;
		userType == 1 ? $('[name="isBtn"]').show() : $('[name="isBtn"]').hide();

	// 初始化时间
	laydate.render({
		elem: '#time',
		type: 'datetime',
		range: "~",
		trigger: 'click'
	});
	//初始化下拉框
	function getXmFn() {
		var xmselect = xmSelect.render({
			el: '#xmselect',
			tips: '请选择船舶',
			name: 'boatList',
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
		endTime = '',
		log_right = '', //最大经度
		log_left = '', //最小经度
		lat_right = '', //最大纬度
		lat_left = ''; //最小纬度

	var cols = thead("datamag");
	window.getListFn = function() {
		table.render({
			elem: '#table',
			url: urls.dataList,
			method: "post",
			where: {
				name: boatList,
				startTime: startTime,
				endTime: endTime,
				log_right: log_right,
				log_left: log_left,
				lat_right: lat_right,
				lat_left: lat_left,
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
			height: "780",
			// done: function(res) {
			// 	$(".layui-laypage-limits select").attr("disabled",true)
			// }
		});
	};
	getListFn();
	// 查询
	form.on('submit(queryBtn)', function(data) {
		var data = data.field;
		boatList = data.boatList;
		var time = data.time;
		var idx = time.indexOf("~");
		startTime = time.substring(0, idx).trim();
		endTime = time.substring(idx + 1).trim();
		if (data.latlog.length <= 0) {
			log_right = ''; //最大经度
			log_left = ''; //最小经度
			lat_right = ''; //最大纬度
			lat_left = ''; //最小纬度
		} else {
			var latlog = data.latlog.split(',');
			log_right = latlog[0]; //最大经度
			log_left = latlog[1]; //最小经度
			lat_right = latlog[2]; //最大纬度
			lat_left = latlog[3]; //最小纬度
		};
		getListFn();
	});
	// 导出1
	form.on('submit(export1)', function() {
		layFn("./export.html", "导出1", "622px");
	});
	// 导出2
	form.on('submit(export2)', function() {
		layFn("./export2.html", "导出2", "450px");
	});

	function layFn(url, title, height) {
		if (!url) {
			return false;
		};
		layer.open({
			type: 2,
			title: title,
			skin: "data-tle",
			shade: false,
			closeBtn: 1,
			id: '1',
			area: ["600px", height],
			content: url
		});
	};

	form.verify({
		latlog: function(val) {
			if (val.length > 0) {
				var arr = val.split(',');
				if (arr.length != 4) {
					return '请严格按照提示顺序输入四个范围数值';
				} else {
					var a = arr[0];
					var b = arr[1];
					var c = arr[2];
					var d = arr[3];
					if (!getFn.regLog(a)) {
						return '请输入正确的最大经度!';
					} else if (!getFn.regLog(b)) {
						return '请输入正确的最小经度!';
					} else if (!getFn.regLat(c)) {
						return '请输入正确的最大纬度!';
					} else if (!getFn.regLat(d)) {
						return '请输入正确的最小纬度!';
					};
				}
			}
		}
	});


	e("datamag", {})
});
