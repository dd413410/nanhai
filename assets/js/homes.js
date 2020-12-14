layui.define(["http", "form", "layer", "element"], function(e) {
	var http = layui.http.http,
		urls = layui.urls,
		rouTo = layui.rouTo;

	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form,
		element = layui.element;

	var map = new AMap.Map("map", {
		zoom: 3,
		center: [121, 30],
		zooms: [4, 9]
	});
	AMap.plugin('AMap.MapType', function() {
		var t = new AMap.MapType({
			defaultType: 1
		});
		map.addControl(t);
		t.hide();
	});

	var shipType = [1, 2];
	var shipData = null;
	var shipId = null;

	function getShipFn() {
		var type = shipType.join(",");
		http({
			url: urls.shipList,
			type: "post",
			data: {
				type: type
			},
			success: function(res) {
				shipData = res.data;
				addIconFn();
				// shipData.length > 0 ? addIconFn() : layer.msg("暂无船舶");
			}
		});
	};
	getShipFn();

	form.on('checkbox(checkShip)', function(data) {
		var is = data.elem.checked;
		var val = data.value;
		if (is) {
			shipType.push(val);
		} else {
			var idx = shipType.indexOf(val);
			shipType.splice(idx, 1);
		};
		map.remove(mapLayer);
		getShipFn();
		return false;
	});
	var mapLayer = new AMap.LabelsLayer({
		zIndex: 1000
	});

	function addIconFn() {
		var markers = [];
		mapLayer.add(markers);
		map.add(mapLayer);
		var labelMarker;
		for (var d = 0; d < shipData.length; d++) {
			var dataItem = shipData[d];
			var icon = {
				type: 'image',
				image: '../static/icon' + dataItem.boatType + dataItem.boatState + '.png',
				size: [50, 30],
				anchor: 'center',
			};
			var item = {
				position: [dataItem.boatLog, dataItem.boatLat],
				icon,
				text: {
					content: dataItem.boatName,
					direction: 'bottom',
					offset: [0, 5],
					style: {
						fontSize: 12,
						fillColor: '#22886f',
					}
				},
				extData: {
					item: dataItem
				}
			};
			labelMarker = new AMap.LabelMarker(item);
			markers.push(labelMarker);
			labelMarker.on("click", function(e) {
				var item = e.target._opts.extData.item;
				shipId = item.boatId;
				var state = item.boatState;
				state != 1 ? rouTo.handUrl(2, 232) : getBoatDataFn();
			})
		};
		mapLayer.add(markers);
		shipId = shipData[0].boatId;
		getBoatDataFn();
	};


	var setBoat = null;

	function getBoatDataFn() {
		window.clearTimeout(setBoat);
		http({
			url: urls.boatData,
			type: "post",
			data: {
				boatId: shipId
			},
			success: function(res) {
				var data = res.data;
				var str_deta = '';
				for (var d = 0; d < data.length; d++) {
					var dataItem = data[d];
					str_deta += '<p title=\"' + dataItem.title + ":" + dataItem.dataItem + '\">' + dataItem.title + ':<span>' +
						dataItem.value +
						'</span></p>';
				};
				$("#shipDeta").html(str_deta);
				var elData = res.elData;
				var str_el = '';
				for (var d = 0; d < elData.length; d++) {
					var elItem = elData[d];
					str_el += '<div title=\"' + elItem.title + ":" + elItem.value + '\">' +
						'<img src="../static/s' + elItem.status + '.png">' +
						'<p>' + elItem.title + '<span>:' + elItem.value + '</span></p>' +
						'</div>';
				};
				$("#elDeta").html(str_el);
			},
			complete: function() {
				setBoat = setTimeout(getBoatDataFn, 60000);
			}
		});
	};

	// 船舶安装的运行情况
	window.getType = 1;
	var getFunTimeout = null,
		getFunTime = 60000;
	window.getFun = function() {
		http({
			url: urls.get,
			type: "post",
			data: {
				type: getType
			},
			success: function(res) {
				var data = res.data;
				$("#total").html(data.total);
				$("#normal").html(data.normal);
				$("#repair").html(data.data_miss);
				$("#damage").html(data.data_interrupt);
				$("#proItem1").attr("lay-percent", data.normal_per);
				$("#proItem2").attr("lay-percent", data.data_miss_per);
				$("#proItem3").attr("lay-percent", data.data_interrupt_per);
				element.init();
			},
			complete: function() {
				getFunTimeout = setTimeout(getFun, getFunTime);
			}
		});
	};
	getFun();
	// 报警记录
	window.alarmType = 0;
	var getAlarmTimeout = null,
		setTime = null,
		getAlarmTime = 60000;
	var sh = 35,
		speed = 30; //sh:li的高度,speed:滚动速度;
	window.getAlarmFn = function() {
		window.clearTimeout(getAlarmTimeout);
		http({
			url: urls.alarm,
			type: "post",
			data: {
				type: alarmType
			},
			success: function(res) {
				var data = res.data;
				var str = '';
				for (var d = 0; d < data.length; d++) {
					var dataItem = data[d];
					str += '<li class="item">' +
						'<p title=\"' + dataItem.desc + '\">' + dataItem.desc + '</p>' +
						'<p class="time" title=\"' + dataItem.time + '\">' + dataItem.time + '</p>' +
						'</li>';
				};
				$("#ltCall").html('<ul>' + str + '</ul>');
				if ($("#ltCall").find("ul").height() <= $("#ltCall").height()) {
					window.clearInterval(setTime);
				} else {
					window.clearInterval(setTime);
					setTime = setInterval(function() {
						setRollFn();
					}, speed);
				};
			},
			complete: function() {
				getAlarmTimeout = setTimeout(getAlarmFn, getAlarmTime);
			}
		});
	};
	getAlarmFn();

	function setRollFn() {
		$("#ltCall").find("ul").animate({
			marginTop: '-=1'
		}, 0, function() {
			var s = Math.abs(parseInt($(this).css("margin-top")));
			if (s >= sh) {
				$(this).find("li").slice(0, 1).appendTo($(this));
				$(this).css("margin-top", 0);
			}
		});
		$("#ltCall").hover(function() {
			window.clearTimeout(setTime);
			window.clearTimeout(getAlarmTimeout);
		}, function() {
			window.clearInterval(setTime);
			window.clearTimeout(getAlarmTimeout);
			setTime = setInterval(function() {
				setRollFn();
			}, speed);
			getAlarmTimeout = setTimeout(getAlarmFn, getAlarmTime);
		});
	};

	// 维修记录
	window.repType = 1;
	var getRepTimeout = null,
		setRepTime = null,
		getRepTime = 60000;
	var shr = 35,
		sped = 30; //sh:li的高度,speed:滚动速度;
	window.getRepFn = function() {
		window.clearTimeout(getRepTimeout);
		http({
			url: urls.records,
			type: "post",
			data: {
				type: repType
			},
			success: function(res) {
				var data = res.data;
				var str = '';
				for (var d = 0; d < data.length; d++) {
					var dataItem = data[d];
					str += '<li class="item">' +
						'<p title=\"提交维护人:' + dataItem.user + '\">' + dataItem.user + '</p>' +
						'<p class="time" title=\"提交时间:' + dataItem.time + '\">' + dataItem.time + '</p>' +
						'<p title=\"需维修船舶:' + dataItem.boatName + '\">' + dataItem.boatName + '</p>' +
						'<p title=\"维修反馈:' + dataItem.feedback + '\">' + dataItem.feedback + '</p>' +
						'</li>';
				};
				$("#rtCall").html('<ul>' + str + '</ul>');
				if ($("#rtCall").find("ul").height() <= $("#rtCall").height()) {
					window.clearInterval(setRepTime);
				} else {
					window.clearInterval(setRepTime);
					setRepTime = setInterval(function() {
						setRollFns();
					}, sped);
				};
			},
			complete: function() {
				getRepTimeout = setTimeout(getRepFn, getRepTime);
			}
		});
	};
	getRepFn();

	function setRollFns() {
		$("#rtCall").find("ul").animate({
			marginTop: '-=1'
		}, 0, function() {
			var s = Math.abs(parseInt($(this).css("margin-top")));
			if (s >= shr) {
				$(this).find("li").slice(0, 1).appendTo($(this));
				$(this).css("margin-top", 0);
			}
		});
		$("#rtCall").hover(function() {
			window.clearInterval(setRepTime);
			window.clearTimeout(getRepTimeout);
		}, function() {
			window.clearInterval(setRepTime);
			window.clearTimeout(getRepTimeout);
			setTime = setInterval(function() {
				setRollFns();
			}, sped);
			getRepTimeout = setTimeout(getRepFn, getRepTime);
		});
	};
	window.getFn = function(t, i, d, fn, dom) {
		$(t).siblings().removeClass("add");
		$(t).addClass("add");
		if (dom) {
			$(dom).empty();
		};
		window[d] = i;
		window[fn]();
	};


	window.locaFn = function(val) {
		if (!val) {
			layer.msg("待完善!")
			return false;
		};
		rouTo.handUrl(val);
	};
	window.outFn = function() {
		window.top.location.href = "../index.html";
	};
	e("homes", {})
});
