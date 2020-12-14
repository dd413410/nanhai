layui.define(["http"], function(e) {
	var http = layui.http.http,
		urls = layui.urls;

	var $ = layui.jquery,
		layer = layui.layer;

	var zoom = 4;
	var levels = [4, 9];
	var map = new BMap.Map("map", {
		minZoom: levels[0],
		maxZoom: levels[1],
		enableMapClick: false
	});
	map.centerAndZoom(new BMap.Point(121.7, 31.4), zoom);
	map.enableScrollWheelZoom(true);

	var myDis = new BMapLib.DistanceTool(map);
	// 切换地图类型
	window.setMapTypeFn = function(is) {
		is == 2 ? map.setMapType(BMAP_SATELLITE_MAP) : map.setMapType(BMAP_NORMAL_MAP);
	};
	// 鼠标移动获取经纬度
	map.addEventListener("mousemove", function(e) {
		var c = e.point;
		var lnglat = c.lng + "," + c.lat;
		$("#lnglat").html(lnglat);
	});
	// 地图缩放后更改图层图片大小
	map.addEventListener("zoomstart", function(e) {
		shipDeta = null;
	});
	map.addEventListener("zoomend", function(e) {
		zoom = map.getZoom();
		publcFn(type, retData);
	});






	var lineList = {}; //绘制线的轨迹,后续用来清除
	var markerList = []; //绘制图片的,后续用来清除

	var type = 0; //0:船舶;1:台风;2:表漂;3:船舶轨迹;4:表漂轨迹
	var retData = null;
	window.publcFn = function(t, data) {
		type = t;
		retData = data;
		if (type != 6) {
			map.clearOverlays();
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
		myDis.open();
	};




	var shipList = null; //全部船
	var shipDeta = null; //船信息

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
				typhDList = res.data;
				typhName = res.name;
				setTyphFn();
			}
		});
	};
	// 台风轨迹绘制
	function setTyphFn() {
		var points = [];
		for (var t = 0; t < typhDList.length; t++) {
			var dataItem = typhDList[t];
			var latlng = new BMap.Point(dataItem.boatLog, dataItem.boatLat);
			points.push(latlng);
			var tyImg = "../static/ty" + dataItem.typhoonLevel + ".png";
			var icon = new BMap.Icon(tyImg, new BMap.Size(27, 24));
			marker = new BMap.Marker(latlng, {
				icon: icon
			});
			marker.item = dataItem;
			marker.setZIndex(3);
			map.addOverlay(marker);

			marker.addEventListener("mouseover", function(e) {
				console.log(e)
				typhDeta = e.currentTarget.item;
				addTyphInFn();
				// shipData = e.currentTarget.item;
				// addInFn();
			});
		};
		var key = typhName;
		lineList[key] = new BMap.Polyline(points, {
			strokeColor: "#3385FF",
			strokeWeight: 2,
			strokeOpacity: 0.5,
			fillOpacity: 0.5
		});
		map.addOverlay(lineList[key]);
		parent.domFn(1);
	};

	function addTyphInFn() {
		window.clearTimeout(typhSet);
		if (typhLabel) {
			map.removeOverlay(typhLabel);
		};
		var latlng = new BMap.Point(typhDeta.boatLog, typhDeta.boatLat);
		var opts = {
			position: latlng,
			offset: new BMap.Size(-30, -40)
		};
		var htm = '<div>' + typhName + '</div><div>风力: ' + typhDeta.typhoonLevel + '级 </div> ';

		typhLabel = new BMap.Label(htm, opts);
		typhLabel.setStyle({
			color: 'yellow',
			borderRadius: '5px',
			borderColor: '#ccc',
			paddingLeft: '10px',
			paddingRight: '10px',
			fontSize: '12px',
			fontFamily: '微软雅黑',
			backgroundColor: 'rgba(0,0,0,0.5)'
		});
		map.addOverlay(typhLabel);
		setInfoOut = setTimeout(function() {
			map.removeOverlay(typhLabel);
		}, 3000);
	};

	// 浮标表漂
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
			console.log(dataItem)
			var latlng = new BMap.Point(dataItem.boatLog, dataItem.boatLat);
			// var icon = new BMap.Icon("../static/fb.png", new BMap.Size(30, 24));
			var icon = new BMap.Icon("../static/fb.png", new BMap.Size(w, h));
			markerList[t] = new BMap.Marker(latlng, {
				icon: icon
			});
			markerList[t].item = dataItem;
			markerList[t].setZIndex(3);
			map.addOverlay(markerList[t]);
			markerList[t].addEventListener("mouseover", function(e) {
				buoyDeta = e.currentTarget.item;
				addBuoyInFn();
			});
		};
		parent.domFn(1);
	};

	function addBuoyInFn() {
		window.clearTimeout(buoySet);
		if (buoyLabel) {
			map.removeOverlay(buoyLabel);
		};
		var latlng = new BMap.Point(buoyDeta.boatLog, buoyDeta.boatLat);
		var opts = {
			position: latlng,
			offset: new BMap.Size(-30, -40)
		};
		var htm = buoyDeta.buoyName;
		buoyLabel = new BMap.Label(htm, opts);
		buoyLabel.setStyle({
			color: 'yellow',
			borderRadius: '5px',
			borderColor: '#ccc',
			paddingLeft: '10px',
			paddingRight: '10px',
			fontSize: '12px',
			fontFamily: '微软雅黑',
			backgroundColor: 'rgba(0,0,0,0.5)'
		});
		map.addOverlay(buoyLabel);
		setInfoOut = setTimeout(function() {
			map.removeOverlay(buoyLabel);
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
				var latlng = new BMap.Point(dataItem.boatLog, dataItem.boatLat);
				points.push(latlng);
				var icon = new BMap.Icon("../static/fb.png", new BMap.Size(w, h));
				markerList[key] = {};
				markerList[key][i] = new BMap.Marker(latlng, {
					icon: icon
				});
				markerList[key][i].setZIndex(3);
				map.addOverlay(markerList[key][i]);
			};
			lineList[key] = new BMap.Polyline(points, {
				strokeColor: "#4E17B6",
				strokeWeight: 1,
				strokeOpacity: 0.5,
				strokeStyle: "dashed",
				fillOpacity: 0.5
			});
			map.addOverlay(lineList[key]);
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
				trackList = res.data;
				shipTrack();
			}
		});
	};
	// 绘制船舶轨迹
	function shipTrack() {
		
		var w = Math.ceil(zoom * 10),
			h = Math.ceil(zoom * 5.2),
			size = new BMap.Size(w, h);
		
		
		for (var key in trackList) {
			var item = trackList[key];
			var points = [];
			for (var i = 0; i < item.length; i++) {
				var dataItem = item[i];
				var latlng = new BMap.Point(dataItem.boatLog, dataItem.boatLat);
				points.push(latlng);
				
				var icon = new BMap.Icon("../static/map16.png", size, {
					imageSize: size
				});
				var marker = new BMap.Marker(latlng, {
					icon: icon
				});
				marker.item = dataItem;
				marker.setZIndex(2);
				map.addOverlay(marker);
				
			};
			lineList[key] = new BMap.Polyline(points, {
				strokeColor: "#4E17B6",
				strokeWeight: 1,
				strokeOpacity: 0.5,
				strokeStyle: "dashed",
				fillOpacity: 0.5
			});
			map.addOverlay(lineList[key]);
		};
		parent.domFn(1);
	};
	/*
		清除图层,清除的图层有一下:
		1:台风路线,台风图标
		2:船舶轨迹
	*/
	window.deleLayer = function() {
		for (var key in lineList) {
			map.removeOverlay(lineList[key]);
		};
		for (var i = 0; i < markerList.length; i++) {
			map.removeOverlay(markerList[i]);
		};
		parent.domFn(2);
	};
	// 获取船舶列表
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
	// 添加船舶图片
	var shipData = null;

	function addIconFn() {
		var w = Math.ceil(zoom * 10),
			h = Math.ceil(zoom * 5.2),
			size = new BMap.Size(w, h);
		for (var d = 0; d < shipList.length; d++) {
			var dataItem = shipList[d];
			var latlng = new BMap.Point(dataItem.boatLog, dataItem.boatLat);
			// var icon = new BMap.Icon("../static/map16.png", new BMap.Size(60, 35));
			var icon = new BMap.Icon("../static/map16.png", size, {
				imageSize: size
			});
			var marker = new BMap.Marker(latlng, {
				icon: icon
			});
			marker.item = dataItem;
			marker.setZIndex(2);
			map.addOverlay(marker);

			marker.addEventListener("click", function(e) {
				shipDeta = e.currentTarget.item;
				addCirFn();
			});
			marker.addEventListener("mouseover", function(e) {
				// shipDeta = e.currentTarget.item;
				shipData = e.currentTarget.item;
				addInFn();
			});
		};
		shipDeta != null ? addCirFn(1) : "";
	};
	var clickIcon = null;

	function addCirFn(x) {
		map.removeOverlay(clickIcon);
		var w = Math.ceil(zoom * 17),
			h = Math.ceil(zoom * 9.7),
			size = new BMap.Size(w, h);
		var latlng = new BMap.Point(shipDeta.boatLog, shipDeta.boatLat);
		var icon = new BMap.Icon("../static/map17.png", size, {
			imageSize: size
		});
		clickIcon = new BMap.Marker(latlng, {
			icon: icon
		});
		clickIcon.setZIndex(1);
		map.addOverlay(clickIcon);
		x ? map.panTo(latlng) : layDetaFn();
	};

	var label = null;
	var setInfoOut = null;

	function addInFn() {
		window.clearTimeout(setInfoOut);
		if (label) {
			map.removeOverlay(label);
		};
		var latlng = new BMap.Point(shipData.boatLog, shipData.boatLat);
		var opts = {
			position: latlng,
			offset: new BMap.Size(-30, -40)
		};
		label = new BMap.Label(shipData.boatName, opts);
		label.setStyle({
			color: 'yellow',
			borderRadius: '5px',
			borderColor: '#ccc',
			paddingLeft: '10px',
			paddingRight: '10px',
			fontSize: '12px',
			fontFamily: '微软雅黑',
			backgroundColor: 'rgba(0,0,0,0.5)'
		});
		map.addOverlay(label);
		setInfoOut = setTimeout(function() {
			map.removeOverlay(label);
		}, 3000);
	};
	// 点击船舶弹窗
	function layDetaFn() {
		var shipName = shipDeta.boatName,
			boatId = shipDeta.boatId;
		parent.layDetaFn(shipName, boatId);
	};


	// 监听测距过程中的鼠标事件
	// myDis.addEventListener('drawend', function(e) {
	// 	console.log("drawend");
	// 	console.log(e.points);
	// 	console.log(e.overlays);
	// 	console.log(e.distance);
	// });
	// myDis.addEventListener("addpoint", function(e) {
	// 	console.log("addpoint");
	// });
	// myDis.addEventListener("removepolyline", function(e) {
	// 	console.log("removepolyline");
	// 	console.log(e);
	// });









	e("map2", {})
});
