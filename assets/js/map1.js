layui.define(["http"], function(e) {
	var http = layui.http.http,
		urls = layui.urls;

	var $ = layui.jquery,
		layer = layui.layer;

	var zoom = 4;
	var levels = [4, 9];
	var map = new T.Map('map');
	map.centerAndZoom(new T.LngLat(122, 30), zoom);

	map.setMinZoom(levels[0]);
	map.setMaxZoom(levels[1]);

	// 切换地图类型
	var layMap = null;
	window.setMapTypeFn = function() {
		if (layMap != null) {
			map.removeLayer(layMap);
			layMap = null;
			return false;
		};
		var url = "http://t0.tianditu.gov.cn/img_w/wmts?" +
			"SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles" +
			"&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=bcee36ff29bfc867f2900974991b2ef8";
		layMap = new T.TileLayer(url, {
			minZoom: levels[0],
			maxZoom: levels[1]
		});
		map.addLayer(layMap);
	};
	var lineTool = new T.PolylineTool(map, {
		showLabel: true
	});
	// 鼠标移动获取经纬度
	map.addEventListener("mousemove", function(e) {
		var c = e.lnglat;
		var lnglat = c.lng + "," + c.lat;
		$("#lnglat").html("<span>" + lnglat + "</span>");
	});
	// 地图缩放后更改图层图片大小
	map.addEventListener("zoomend", function(e) {
		zoom = map.getZoom();
		publcFn(type, retData);
	});
	var lineList = {}; //绘制线的轨迹,后续用来清除
	var markerList = []; //绘制图片的,后续用来清除

	// 调取公共子函数的函数
	var type = 0; //0:船舶;1:台风;2:表漂;3:船舶轨迹;4:表漂轨迹
	var retData = null;
	window.publcFn = function(t, data) {
		type = t;
		retData = data;
		if (type != 6) {
			map.clearOverLays();
		};
		switch (Number(type)) {
			case 0:
				console.log("船舶")
				getShipFn();
				break;
			case 1:
				console.log("台风")
				getTyFn();
				break;
			case 2:
				getBuoyFn();
				break;
			case 3:
				getBuoyTrakFn(data);
				console.log("表漂轨迹")
				break;
			case 4:
				console.log("船舶轨迹")
				getTrackFn(data);
				break;
			case 5:
				console.log("查找定位")
				shipDeta = data;
				getShipFn();
				break;
			case 6:
				console.log("测距")
				rang();
				break;
			default:
				getShipFn();
				parent.domFn(2);
				console.log("默认")
		}
	};
	publcFn(type);
	// 测距
	function rang() {
		lineTool.open();
	};

	// 台风轨迹
	var typhDList = null,
		typhName = null;
	var typhDeta = null;
	var typhSet = null;
	var typhLabel = null;

	function getTyFn() {
		http({
			url: urls.typhoon,
			type: "post",
			data: {},
			success: function(res) {
				console.log(res)
				typhDList = res.data;
				typhName = res.name;
				setTyFn();
			}
		});
	};
	// 台风轨迹绘制
	function setTyFn() {
		var w = Math.ceil(zoom * 7),
			h = Math.ceil(zoom * 6);
		var points = [];
		for (var t = 0; t < typhDList.length; t++) {
			var dataItem = typhDList[t];
			var latlng = new T.LngLat(dataItem.boatLog, dataItem.boatLat);
			points.push(latlng);
			var tyImg = "../static/ty" + dataItem.typhoonLevel + ".png";
			var icon = new T.Icon({
				iconUrl: tyImg,
				iconSize: new T.Point(w, h)
				// iconSize: new T.Point(27, 24)
			});
			markerList[t] = new T.Marker(latlng, {
				icon: icon,
				zIndexOffset: 2,
				item: dataItem
			});
			map.addOverLay(markerList[t]);
			markerList[t].addEventListener("mouseover", function(e) {
				typhDeta = e.target.options.item;
				addTyphInFn();
			});
		};
		var key = typhName;
		lineList[key] = new T.Polyline(points, {
			color: "#3385FF",
			weight: 2,
			opacity: 0.5,
			fillOpacity: 0.5
		});
		map.addOverLay(lineList[key]);
		parent.domFn(1);
	};

	function addTyphInFn() {
		window.clearTimeout(typhSet);
		if (typhLabel) {
			map.removeOverLay(typhLabel);
		};
		var latlng = new T.LngLat(typhDeta.boatLog, typhDeta.boatLat);
		var htm = '<div>' + typhName + '</div><div>风力: ' + typhDeta.typhoonLevel + '级 </div> ';
		typhLabel = new T.InfoWindow(htm, {
			closeButton: false,
			offset: new T.Point(0, -15)
		});
		typhLabel.setLngLat(latlng);
		map.addOverLay(typhLabel);
		typhSet = setTimeout(function() {
			map.removeOverLay(typhLabel);
		}, 3000);
	};


	// 表漂
	var buoyList = null;
	var buoyDeta = null;
	var buoySet = null;
	var buoyLabel = null;

	function getBuoyFn() {
		http({
			url: urls.buoy,
			type: "post",
			data: {},
			success: function(res) {
				buoyList = res.data;
				setBuoyFn();
			}
		});
	};

	function setBuoyFn() {
		var w = Math.ceil(zoom * 7.5),
			h = Math.ceil(zoom * 6);
		for (var t = 0; t < buoyList.length; t++) {
			var dataItem = buoyList[t];
			var latlng = new T.LngLat(dataItem.boatLog, dataItem.boatLat);
			var icon = new T.Icon({
				iconUrl: "../static/fb.png",
				iconSize: new T.Point(w, h)
			});
			markerList[t] = new T.Marker(latlng, {
				icon: icon,
				zIndexOffset: 2,
				item: dataItem
			});
			map.addOverLay(markerList[t]);
			markerList[t].addEventListener("mouseover", function(e) {
				buoyDeta = e.target.options.item;
				addBuoyInFn();
			});
		};
		parent.domFn(1);
	};

	function addBuoyInFn() {
		window.clearTimeout(buoySet);
		if (buoyLabel) {
			map.removeOverLay(buoyLabel);
		};
		var latlng = new T.LngLat(buoyDeta.boatLog, buoyDeta.boatLat);
		var htm = '<div>' + buoyDeta.buoyName + '<div/>';
		buoyLabel = new T.InfoWindow(htm, {
			closeButton: false,
			offset: new T.Point(0, -15)
		});
		buoyLabel.setLngLat(latlng);
		map.addOverLay(buoyLabel);
		buoySet = setTimeout(function() {
			map.removeOverLay(buoyLabel);
		}, 3000);
	};

	// 表漂轨迹
	var buoyTrakList = null;

	function getBuoyTrakFn(data) {
		var time = data.time;
		var idx = time.indexOf("~");
		var startTime = time.substring(0, idx).trim();
		var endTime = time.substring(idx + 1).trim();
		http({
			url: urls.getBuoyTrak,
			type: "post",
			data: {
				surfaceList: data.surfaceList,
				startTime: startTime,
				endTime: endTime
			},
			success: function(res) {
				buoyTrakList = res.data;
				setBuoyTrakFn();
			}
		});
	};

	function setBuoyTrakFn() {
		var w = Math.ceil(zoom * 7.5),
			h = Math.ceil(zoom * 6);
		for (var key in buoyTrakList) {
			var item = buoyTrakList[key];
			var points = [];
			for (var i = 0; i < item.length; i++) {
				var dataItem = item[i];
				var latlng = new T.LngLat(dataItem.boatLog, dataItem.boatLat);
				points.push(latlng);

				var tyImg = "../static/fb.png";
				var icon = new T.Icon({
					iconUrl: tyImg,
					iconSize: new T.Point(w, h)
					// iconSize: new T.Point(27, 24)
				});
				markerList[key] = {};
				markerList[key][i] = new T.Marker(latlng, {
					icon: icon,
					zIndexOffset: 2,
					item: dataItem
				});
				map.addOverLay(markerList[key][i]);
			};
			lineList[key] = new T.Polyline(points, {
				color: "#4E17B6",
				weight: 1,
				opacity: 0.5,
				lineStyle: "dashed",
				fillOpacity: 0.5
			});
			map.addOverLay(lineList[key]);
		};
		parent.domFn(1);
	};

	// 船舶轨迹
	var trackList = null;

	function getTrackFn(data) {
		var time = data.time;
		var idx = time.indexOf("~");
		var startTime = time.substring(0, idx).trim();
		var endTime = time.substring(idx + 1).trim();
		http({
			url: urls.track,
			type: "post",
			data: {
				boatList: data.boatList,
				startTime: startTime,
				endTime: endTime
			},
			success: function(res) {
				console.log(res)
				trackList = res.data;
				setTrackFn();
			}
		});
	};
	// 绘制船舶轨迹
	function setTrackFn() {
		var w = Math.ceil(zoom * 10),
			h = Math.ceil(zoom * 5.2);

		for (var key in trackList) {
			var item = trackList[key];
			var points = [];
			for (var i = 0; i < item.length; i++) {
				var dataItem = item[i];
				var latlng = new T.LngLat(dataItem.boatLog, dataItem.boatLat);
				points.push(latlng);

				var icon = new T.Icon({
					iconUrl: "../static/map16.png",
					iconSize: new T.Point(w, h)
				});
				markerList[key] = {};
				markerList[key][i] = new T.Marker(latlng, {
					icon: icon,
					zIndexOffset: 2,
					item: dataItem
				});
				map.addOverLay(markerList[key][i]);

			};
			lineList[key] = new T.Polyline(points, {
				color: "#4E17B6",
				weight: 1,
				opacity: 0.5,
				lineStyle: "dashed",
				fillOpacity: 0.5
			});
			map.addOverLay(lineList[key]);
		};
		parent.domFn(1);
	};

	// 获取船舶列表
	var shipList = null; //全部船
	var shipDeta = null; //船信息
	function getShipFn() {
		http({
			url: urls.shipList,
			type: "post",
			data: {
				type: "1,2"
			},
			success: function(res) {
				shipList = res.data;
				shipList.length > 0 ? addIconFn() : layer.msg("暂无船舶");
			}
		});
	};
	// 添加船舶图层
	function addIconFn() {
		var w = Math.ceil(zoom * 10),
			h = Math.ceil(zoom * 5.2);
		for (var i = 0; i < shipList.length; i++) {
			var dataItem = shipList[i];
			var icon = new T.Icon({
				iconUrl: "../static/map16.png",
				iconSize: new T.Point(w, h)
			});

			var latlng = new T.LngLat(dataItem.boatLog, dataItem.boatLat);
			var marker = new T.Marker(latlng, {
				icon: icon,
				zIndexOffset: 1,
				item: dataItem
			});
			map.addOverLay(marker);
			marker.addEventListener("click", function(e) {
				shipDeta = e.target.options.item;
				addCirFn();
			});
			marker.addEventListener("mouseover", function(e) {
				shipDeta = e.target.options.item;
				addInFn();
			});
		};
		type == 5 ? addCirFn(1) : "";
	};
	// 点击船舶
	var clickIcon = null;

	function addCirFn(x) {
		var w = Math.ceil(zoom * 17),
			h = Math.ceil(zoom * 9.3);

		var latlng = new T.LngLat(shipDeta.boatLog, shipDeta.boatLat);
		if (clickIcon) {
			map.removeOverLay(clickIcon);
		};
		var icon = new T.Icon({
			iconUrl: "../static/map17.png",
			iconSize: new T.Point(w, h)
		});
		clickIcon = new T.Marker(latlng, {
			icon: icon,
			item: shipDeta
		});
		map.addOverLay(clickIcon);
		clickIcon.addEventListener("click", function(e) {
			shipDeta = e.target.options.item;
			addCirFn();
		});
		clickIcon.addEventListener("mouseover", function(e) {
			shipDeta = e.target.options.item;
			addInFn();
		});
		x ? map.panTo(latlng) : layDetaFn();
	};
	// 鼠标移入
	var label = null;
	var setInfoOut = null;

	function addInFn() {
		window.clearTimeout(setInfoOut);
		if (label) {
			map.removeOverLay(label);
		};
		var latlng = new T.LngLat(shipDeta.boatLog, shipDeta.boatLat);
		var htm = '<div>' + shipDeta.boatName + '<div/>';
		label = new T.InfoWindow(htm, {
			closeButton: false,
			offset: new T.Point(0, -15)
		});
		label.setLngLat(latlng);
		map.addOverLay(label);
		setInfoOut=setTimeout(function() {
			map.removeOverLay(label);
		}, 3000);
	};
	// 点击船舶弹窗
	function layDetaFn() {
		var shipName = shipDeta.boatName,
			boatId = shipDeta.boatId;
		parent.layDetaFn(shipName, boatId);
	};

	e("map1", {})
});
