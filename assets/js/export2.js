layui.define(["http", "getFn", "form", 'laydate'], function(e) {
	var http = layui.http.http,
		urls = layui.urls,
		getFn = layui.getFn;

	var $ = layui.$,
		form = layui.form,
		laydate = layui.laydate;

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
			name: 'boatList',
			layVerify: 'required',
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
	
	form.on('submit(subbtn)', function(data) {
		var data = data.field;
		var time = data.time;
		var idx = time.indexOf("~");
		var startTime = time.substring(0, idx).trim();
		var endTime = time.substring(idx + 1).trim();
		var datas = {
			startTime: startTime,
			endTime: startTime,
			boatList: data.boatList,
			boatLog: data.boatLog,
			boatLat: data.boatLat
		};
		http({
			url: urls.dataExport,
			type: "post",
			data: datas,
			success: function(res) {
				var url = res.url;
				window.location.href = url;
				regFn();
			}
		});
	});
	form.verify({
		time: function(val) {
			if (val.indexOf("~") == -1) {
				return '请选择时间范围!';
			}
		},
		boatLog: function(val) {
			if (!getFn.regLog(val) || !getFn.trimFn(val)) {
				return '请输入正确的经度!';
			}
		},
		boatLat: function(val) {
			if (!getFn.regLat(val) || !getFn.trimFn(val)) {
				return '请输入正确的纬度!';
			}
		}
	});
	window.regFn = function() {
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.close(index);
	};
	e("export2", {})
});
