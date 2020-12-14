layui.define(["http", "getFn", "form", "element"], function(e) {
	var http = layui.http.http,
		urls = layui.urls,
		getFn = layui.getFn;

	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form,
		element = layui.element;

	var boatId = getFn.locaStr("id");

	boatId ? getEl() : layer.msg("请完善船舶呼号!");

	var el_val = ''; //折线图要素
	function getEl() {
		http({
			url: urls.getEl,
			type: "post",
			data: {
				boatId: boatId
			},
			success: function(res) {
				var data = res.data;
				var str = '';
				for (var d = 0; d < data.length; d++) {
					var dataItem = data[d];
					str += '<option value="' + dataItem + '">' + dataItem + '</option>';
				};
				$("#el").html(str);
				form.render("select");
				data.length > 0 ? (el_val = data[0], getLineFn()) : "";
			}
		});
	};
	// 选择要素后重新查询
	form.on('select(elFilt)', function(data) {
		el_val = data.value;
		getLineFn();
		return false;
	});
	// Ais信息页面和折线图页面切换
	window.witchFn = function(hide, show, is) {
		$("#" + hide).hide();
		$("#" + show).show();
		is == 1 ? getLineFn() : element.tabChange('tab', 'getAisFn');
	};
	element.on('tab(tab)', function(elem) {
		var fn = $(this).attr('lay-id');
		window[fn]();
	});
	// 获取近三天折线图
	var unit = null;
	window.getLineFn = function() {
		http({
			url: urls.line,
			type: "post",
			data: {
				boatId: boatId,
				dataCategory: el_val
			},
			success: function(res) {
				var time = res.timeList;
				var data = res.dataList;
				if (el_val == "风速风向") {
					for (var i = 0; i < data.length; i++) {
						var dataItem = data[i];
						dataItem.symbol = 'image://../static/dirs' + dataItem.dirs + '.png';
						dataItem.symbolSize = 15;
					};
				};
				unit = res.unit;
				initLineFn(time, data);
			}
		});
	};
	// 获取船舶信息
	window.getAisFn = function() {
		http({
			url: urls.aisInfo,
			type: "post",
			data: {
				boatId: boatId
			},
			success: function(res) {
				var data = res.data;
				var instName = data.instrumentName;
				var str = '';
				for (var i = 0; i < instName.length; i++) {
					str += instName[i];
				};
				form.val('aisForm', {
					"boatName": data.boatName,
					"boatId": data.boatId,
					"ofUnit": data.ofUnit,
					"navHead": data.navHead,
					"navWay": data.navWay,
					"navSpeed": data.navSpeed,
					"boatLog": data.boatLog,
					"boatLat": data.boatLat,
					"fixTime": data.fixTime,
					"instName": str,
					"UpdateTime": data.UpdateTime
				});
			}
		});
	};
	// 获取气象信息
	window.getMeteFn = function() {
		http({
			url: urls.meteInfo,
			type: "post",
			data: {
				boatId: boatId
			},
			success: function(res) {
				var data = res.data;
				var str = '';
				for (var item in data) {
					str += '<li><p class="name">' + item + ':</p><input type="text" value=' + data[item] +
						' name="abs_ws" disabled></li>';
				};
				$("#mete").html(str);
			}
		});
	};
	//轨迹
	$("#track").click(function() {
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.close(index);
		parent.layTimeFn();
	});
	// 数据表格
	$("#dataTab").click(function() {
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.close(index);
		parent.layDataFn(boatId);
	});

	var myChart = echarts.init(document.getElementById('main'));

	function initLineFn(time, data) {
		myChart.clear();
		var option = {
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'cross',
					label: {
						backgroundColor: '#3385FF',
					},
				},
				formatter: function(val) {
					var name = val[0].name;
					var tips = "";
					if (el_val == "风速风向") {
						var dataItem = val[0].data;
						tips = name + "</br>" +
							"风速:" + dataItem.value + unit + "</br>" +
							"风向:" + dataItem.val;
					} else {
						tips = name + "</br>" + el_val + ": " + val[0].value + unit;
					};
					return tips;
				}
			},
			grid: {
				top: '15',
				right: '15',
				bottom: '0%',
				left: '4%',
				containLabel: true
			},
			xAxis: [{
				type: 'category',
				boundaryGap: false,
				data: time,
				// data: [
				// 	"1日0时", "1日1时", "1日2时", "1日3时", "1日4时", "1日5时", "1日6时", "1日7时",
				// 	"1日8时", "1日9时", "1日10时", "1日11时", "1日12时", "1日13时", "1日14时", "1日15时",
				// 	"1日16时", "1日17时", "1日18时", "1日19时", "1日20时", "1日21时", "1日22时", "1日23时",

				// 	"2日0时", "2日1时", "2日2时", "2日3时", "2日4时", "2日5时", "2日6时", "2日7时",
				// 	"2日8时", "2日9时", "2日10时", "2日11时", "2日12时", "2日13时", "2日14时", "2日15时",
				// 	"2日16时", "2日17时", "2日18时", "2日19时", "2日20时", "2日21时", "2日22时", "2日23时",

				// 	"3日0时", "3日1时", "3日2时", "3日3时", "3日4时", "3日5时", "3日6时", "3日7时",
				// 	"3日8时", "3日9时", "3日10时", "3日11时", "3日12时", "3日13时", "3日14时", "3日15时",
				// 	"3日16时", "3日17时", "3日18时", "3日19时", "3日20时", "3日21时", "3日22时", "3日23时"

				// ],
				axisLabel: {
					show: true,
					textStyle: {
						color: '#333',
						fontSize: 12,
					},
					rotate: 45
				},
				axisLine: {
					lineStyle: {
						width: 1
					}
				},
				// splitLine: {
				// 	show: true,
				// 	lineStyle: {
				// 		color: '#4E4E4E'
				// 	}
				// }
			}],
			yAxis: [{
				type: 'value',
				axisLine: {
					onZero: false,
					lineStyle: {
						color: '#4E4E4E',
						width: 1,
					}
				},
				axisLabel: {
					formatter: function(val) {
						return val + '';
					},
					textStyle: {
						color: '#4E4E4E',
						fontSize: 14
					}
				},
				// splitLine: {
				// 	show: true,
				// 	lineStyle: {
				// 		type: 'dashed'
				// 	}

				// },
			}],
			series: [{
				type: 'line',
				smooth: true,
				// symbolSize: 6,
				// symbol: "none",
				itemStyle: {
					normal: {
						color: "#3385FF",
						lineStyle: {
							width: 2,
							type: 'solid',
							color: "#3385FF"
						}
					},
				},
				data: data
			}]
		};
		myChart.setOption(option);
	};
	e("layShip", {})
});
