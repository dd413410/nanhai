layui.define(["http"], function(e) {
	var http = layui.http.http,
		urls = layui.urls;

	var $ = layui.jquery,
		layer = layui.layer;

	var zoom = 4;
	var levels = [4, 9];

	var map = new AMap.Map('map', {
		zoom: zoom,
		center: [121.7, 31.4],
		zooms: [4, 9]
	});
	var ruler = null;
	AMap.plugin(['AMap.MouseTool'], function() {
		ruler = new AMap.MouseTool(map);
	});
	// 切换地图类型
	window.setMapTypeFn = function(is) {
		is == 2 ? map.setLayers([new AMap.TileLayer.Satellite()]) : map.setLayers([new AMap.TileLayer]);
	};
	// 鼠标移动获取经纬度
	map.on("mousemove", function(e) {
		var c = e.lnglat;
		var lnglat = c.lng + "," + c.lat;
		$("#lnglat").html(lnglat);
	});
	// 地图缩放后更改图层图片大小
	map.on("zoomend", function(e) {
		zoom = map.getZoom();
		publcFn(type, retData);
	});

	var lineList = {}; //记录绘制线的轨迹,后续用来清除
	var markerList = []; //记录绘制图片的,后续用来清除


	// 调取公共子函数的函数
	var type = 0; //0:船舶;1:台风;2:表漂;3:船舶轨迹;4:表漂轨迹
	var retData = null;
	window.publcFn = function(t, data) {
		type = t;
		retData = data;
		if (type != 6) {
			map.clearMap();
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
				console.log("表漂")
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
		ruler.rule({
			startMarkerOptions: { //可缺省
				icon: new AMap.Icon({
					size: new AMap.Size(19, 31), //图标大小
					imageSize: new AMap.Size(19, 31),
					image: "https://webapi.amap.com/theme/v1.3/markers/b/start.png"
				})
			},
			endMarkerOptions: { //可缺省
				icon: new AMap.Icon({
					size: new AMap.Size(19, 31), //图标大小
					imageSize: new AMap.Size(19, 31),
					image: "https://webapi.amap.com/theme/v1.3/markers/b/end.png"
				}),
				offset: new AMap.Pixel(-9, -31)
			},
			midMarkerOptions: { //可缺省
				icon: new AMap.Icon({
					size: new AMap.Size(19, 31), //图标大小
					imageSize: new AMap.Size(19, 31),
					image: "https://webapi.amap.com/theme/v1.3/markers/b/mid.png"
				}),
				offset: new AMap.Pixel(-9, -31)
			},
			lineOptions: { //可缺省
				strokeStyle: "solid",
				strokeColor: "#FF33FF",
				strokeOpacity: 1,
				strokeWeight: 2
			}
		});
	};


	// 台风轨迹
	var typhDList = null,
		typhName = null;

	function getTyFn() {
		http({
			url: urls.typhoon,
			type: "post",
			data: {},
			success: function(res) {
				typhDList = res.data;
				typhName = res.name;
				setTyphFn();
			}
		});
	};
	// 台风轨迹绘制
	function setTyphFn() {
		var key = typhName;
		var w = Math.ceil(zoom * 7),
			h = Math.ceil(zoom * 6),
			x = Math.ceil(w / 2),
			y = Math.ceil(h / 2);
		var points = [];
		var markers = [];
		for (var t = 0; t < typhDList.length; t++) {
			var dataItem = typhDList[t];
			points.push([dataItem.boatLog, dataItem.boatLat]);
			var tyImg = "../static/ty" + dataItem.typhoonLevel + ".png";
			var icon = new AMap.Icon({
				type: 'image',
				image: tyImg,
				size: [w, h],
				imageSize: [w, h],
				offset: new AMap.Pixel(x, y)
			});
			var title = key + "风力:" + dataItem.typhoonLevel + "级";
			markerList[t] = new AMap.Marker({
				position: new AMap.LngLat(dataItem.boatLog, dataItem.boatLat),
				icon: icon,
				title: title,
				zIndex: 15,
				anchor: "center"
			});
			markers.push(markerList[t]);
		};
		map.add(markers);
		lineList[key] = new AMap.Polyline({
			map: map,
			path: points,
			strokeColor: "#3385FF",
			strokeWeight: 2
		});
		parent.domFn(1);
	};


	// 表漂
	var buoyList = null;

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
			h = Math.ceil(zoom * 6),
			x = Math.ceil(w / 2),
			y = Math.ceil(h / 2);

		var markers = [];
		for (var t = 0; t < buoyList.length; t++) {
			var dataItem = buoyList[t];
			var icon = new AMap.Icon({
				type: 'image',
				image: '../static/fb.png',
				size: [w, h],
				imageSize: [w, h],
				offset: new AMap.Pixel(x, y)
			});
			markerList[t] = new AMap.Marker({
				position: new AMap.LngLat(dataItem.boatLog, dataItem.boatLat),
				icon: icon,
				title: dataItem.buoyName,
				zIndex: 15,
				anchor: "center"
			});
			markers.push(markerList[t]);
		};
		map.add(markers);
		parent.domFn(1);
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

		var w = Math.ceil(zoom * 7),
			h = Math.ceil(zoom * 6),
			x = Math.ceil(w / 2),
			y = Math.ceil(h / 2);

		var markers = [];
		var points = [];
		for (var key in buoyTrakList) {
			var item = buoyTrakList[key];
			for (var i = 0; i < item.length; i++) {
				var dataItem = item[i];
				points.push([dataItem.boatLog, dataItem.boatLat]);
				var icon = new AMap.Icon({
					type: 'image',
					image: "../static/fb.png",
					size: [w, h],
					imageSize: [w, h],
					offset: new AMap.Pixel(x, y)
				});
				markerList[key] = {};
				markerList[key][i] = new AMap.Marker({
					position: new AMap.LngLat(dataItem.boatLog, dataItem.boatLat),
					icon: icon,
					title: dataItem.buoyName,
					zIndex: 15,
					anchor: "center"
				});
				markers.push(markerList[key][i]);
			};
		};
		lineList[key] = new AMap.Polyline({
			map: map,
			path: points,
			strokeColor: "#4E17B6",
			strokeWeight: 1,
			strokeStyle: "dashed",
			lineJoin: "round"
		});
		map.add(markers);
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
				trackList = res.data;
				setTrackFn();
			}
		});
	};
	// 绘制船舶轨迹
	function setTrackFn() {

		var w = Math.ceil(zoom * 10),
			h = Math.ceil(zoom * 5.2),
			x = Math.ceil(w / 2),
			y = Math.ceil(h / 2);

		var markers = [];
		var points = [];


		for (var key in trackList) {
			var item = trackList[key];
			for (var i = 0; i < item.length; i++) {
				var dataItem = item[i];
				points.push([dataItem.boatLog, dataItem.boatLat]);
				var icon = new AMap.Icon({
					type: 'image',
					image: "../static/fb.png",
					size: [w, h],
					imageSize: [w, h],
					offset: new AMap.Pixel(x, y)
				});
				markerList[key] = {};
				markerList[key][i] = new AMap.Marker({
					position: new AMap.LngLat(dataItem.boatLog, dataItem.boatLat),
					icon: icon,
					title: dataItem.buoyName,
					zIndex: 15,
					anchor: "center"
				});
				markers.push(markerList[key][i]);
			};
		};
		lineList[key] = new AMap.Polyline({
			map: map,
			path: points,
			strokeColor: "#4E17B6",
			strokeWeight: 1,
			strokeStyle: "dashed",
			lineJoin: "round"
		});
		map.add(markers);
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
	getShipFn();

	function addIconFn() {
		var w = Math.ceil(zoom * 10),
			h = Math.ceil(zoom * 5.2);
		var x = w / 2,
			y = h / 2;
		var markers = [];
		var icon = new AMap.Icon({
			type: 'image',
			imageSize: [w, h],
			image: '../static/map16.png',
			imageSize: [w, h],
			offset: new AMap.Pixel(x, y)
		});
		for (var d = 0; d < shipList.length; d++) {
			var dataItem = shipList[d];
			var viaMarker = new AMap.Marker({
				position: new AMap.LngLat(dataItem.boatLog, dataItem.boatLat),
				icon: icon,
				title: dataItem.boatName,
				zIndex: 13,
				anchor: "center",
				extData: {
					item: dataItem
				}
			});
			viaMarker.on("click", function(e) {
				shipDeta = e.target._opts.extData.item;
				addCirFn();
			});
			markers.push(viaMarker);
		};
		map.add(markers);
		type == 5 ? addCirFn(1): "";
	};
	var clickIcon = null;

	function addCirFn(x) {
		if (clickIcon != null) {
			map.remove(clickIcon);
		};
		var w = Math.ceil(zoom * 17),
			h = Math.ceil(zoom * 9.3);
		var icon = new AMap.Icon({
			// type: 'image',
			// size: [98, 56],
			// image: '../static/map17.png',
			// imageSize: [98, 56]
			type: 'image',
			size: [w, h],
			image: '../static/map17.png',
			imageSize: [w, h]
		});
		clickIcon = new AMap.Marker({
			position: new AMap.LngLat(shipDeta.boatLog, shipDeta.boatLat),
			icon: icon,
			anchor: "center",
		});
		map.add(clickIcon);
		var latlng = [shipDeta.boatLog, shipDeta.boatLat];
		x ? map.panTo(latlng) : layDetaFn();
	};
	// 点击船舶弹窗
	var lay = null;

	function layDetaFn() {
		var shipName = shipDeta.boatName,
			boatId = shipDeta.boatId;
		parent.layDetaFn(shipName, boatId);
	};
	e("map3", {})
});
