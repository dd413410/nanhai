layui.define(["http", "form"], function(e) {
	var http = layui.http.http,
		urls = layui.urls,
		rouTo = layui.rouTo;

	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form;

	var map = new BMapGL.Map("map");
	map.centerAndZoom(new BMapGL.Point(113.324572,23.102556), 4);
	map.enableScrollWheelZoom(true);
	map.setMapType(BMAP_EARTH_MAP);

	// 获取船舶列表
	var shipList, center;

	function getShipFn() {
		http({
			url: urls.shipList,
			type: "post",
			data:{
				type:"1,2"
			},
			success: function(res) {
				shipList = res.data;
				var ship = '';

				for (var d = 0; d < shipList.length; d++) {
					var dataItem = shipList[d];
					ship += '<p><input type="checkbox" lay-skin="primary" value="' + dataItem.boatId + '" title="' + dataItem.boatName +
						'" class="checkbox"></p>';
				};
				$("#check").html(ship);
				form.render("checkbox");
				center = res.center;
				shipList.length > 0 ? addIconFn() : layer.msg("暂无船舶");
			}
		});
	};
	getShipFn();

	var path = [];

	function addIconFn() {
		var centrPath = new BMapGL.Point(center.boatLog, center.boatLat);
		var centerImg = new BMapGL.Icon('../static/zxz.png', new BMapGL.Size(50, 30));
		var centerMarker = new BMapGL.Marker(centrPath, {
			icon: centerImg
		});
		centerMarker.item = center;
		map.addOverlay(centerMarker);

		for (var d = 0; d < shipList.length; d++) {
			var dataItem = shipList[d];
			var latlng = new BMapGL.Point(dataItem.boatLog, dataItem.boatLat);
			path.push(centrPath);
			path.push(latlng);
			var state = dataItem.boatState == 1 ? "1" : "3";
			var imgSrc = '../static/icon' + dataItem.boatType + state + '.png';
			var imgSize = new BMapGL.Size(50, 30);
			var icon = new BMapGL.Icon(imgSrc, imgSize);

			var marker = new BMapGL.Marker(latlng, {
				icon: icon
			});
			marker.item = dataItem;
			map.addOverlay(marker);
			marker.addEventListener("click", function(e) {
				var shipDeta = e.currentTarget.item;
				layShipFn(shipDeta);
			});
		};
		var polyline = new BMapGL.Polyline(path, {
			strokeColor: "#00FF85",
			clip: false,
			geodesic: false,
			strokeWeight: 0.1,
			strokeOpacity: 0.8
		});
		map.addOverlay(polyline);
	};

	// 获取用户列表
	function getUserListFn() {
		http({
			url: urls.userLists,
			type: "post",
			data: {},
			success: function(res) {
				var data = res.data;
				var str = '<option value="">直接选择或搜索选择</option>';
				for (var i = 0; i < data.length; i++) {
					var userItem = data[i];
					str += '<option value="' + userItem.id + '">' + userItem.realName + '</option>'
				};
				$("#userList").html(str);
				form.render("select");
			}
		});
	};
	getUserListFn();
	// 点击船弹窗
	var layShip, layShips;

	function layShipFn(item) {
		var state = item.boatState;
		var html;
		if (state == 1) {
			html = "正常";
			$("#boatState").removeClass("add");
			$("#btnForm").hide();
		} else {
			html = "异常";
			$("#boatState").addClass("add");
			$("#btnForm").show();
		};
		http({
			url: urls.shipDeta,
			type: "post",
			data: {
				boatId: item.boatId
			},
			success: function(res) {
				var data = res.data;
				form.val('shipForm', {
					"boatName": data.boatName,
					"boatId": data.boatId,
					"ofUnit": data.ofUnit,
					"navWay": data.navWay,
					"navSpeed": data.navSpeed,
					"loglat": data.boatLog + "," + data.boatLat,
					"boatState": html,
					"boatTime": data.boatTime,

				});
				layShips = layer.open({
					type: 1,
					title: "船舶信息",
					shade: false,
					closeBtn: 1,
					skin: "lay-push",
					area: "320px",
					content: $("#cPush")
				});
				$(".checkbox").prop("checked", false);
				$("#cCheck").prop("checked", false);
				form.render('checkbox');
			}
		});
	};

	// 点击选择船舶
	$("#shipBtn").click(function() {
		layShip = layer.open({
			type: 1,
			title: "船舶选择",
			shade: false,
			closeBtn: 1,
			skin: "lay-push",
			area: "400px",
			content: $("#shipBox")
		});
	});
	// 监听全选
	form.on('checkbox(c_all)', function(data) {
		var is = data.elem.checked;
		if (is == true) {
			$(".checkbox").prop("checked", true);
		} else {
			$(".checkbox").prop("checked", false);
		};
		form.render('checkbox');
	});
	// 选择船舶后确认
	form.on('submit(clickBtn)', function(data) {
		layer.close(layShip);
		return false;
	});
	// 推送
	form.on('submit(subbtn)', function(data) {
		var data = data.field;
		var shipList = [];
		$(".checkbox").each(function() {
			var is = $(this).is(":checked");
			is ? shipList.push($(this).val()) : "";
		});
		var shipStr = shipList.join(',');
		if (shipStr.length <= 0) {
			layer.msg("请至少选择一艘船");
			return false;
		};
		if (data.content == "") {
			layer.msg("请输入问题描述");
			return false;
		};
		if (data.receivePeople == "") {
			layer.msg("请选择指派人");
			return false;
		};

		http({
			url: urls.send,
			type: "post",
			data: {
				boatList: shipStr,
				receivePeople: data.receivePeople,
				content: data.content
			},
			success: function(res) {
				layer.msg(res.msg);
				layer.close(layShip);
				layer.close(layShips);
			}
		});
		return false;
	});





	// 数据接收总数统计
	var setTotal = null;

	function getTotalFn() {
		http({
			url: urls.dataTotal,
			type: "post",
			data: {},
			success: function(res) {
				var a = res.data.all_data;
				var b = res.data.obtain_data;
				var c = res.data.grab_data;
				$("#all").html(a);
				$("#obtain").html(b);
				$("#grab").html(c);
			},
			complete: function() {
				setTotal = setTimeout(getTotalFn, 3600000);
			}
		});
	};
	getTotalFn();

	// 运行率统计
	function getRunRateFn() {
		http({
			url: urls.runRate,
			type: "post",
			data: {},
			success: function(res) {
				pie.setOption({
					series: [{
						data: res.data
					}]
				});
			},
			complete: function() {
				setTimeout(getRunRateFn, 3600000);
			}
		});
	};
	getRunRateFn();

	// 近10天已接收数据
	function getTotalDataFn() {
		http({
			url: urls.totalData,
			type: "post",
			data: {},
			success: function(res) {
				var time = res.dateList;
				var data = res.totalList;
				var rate = res.goodRateList;
				initBarLine(time, data, rate);
			},
			complete: function() {
				setTimeout(getTotalDataFn, 3600000);
			}
		});
	};
	getTotalDataFn();


	var getNewTimeout = null,
		setTime = null,
		getAlarmTime = 60000;

	var sh = 40,
		speed = 30; //sh:li的高度,speed:滚动速度;

	function getNewData() {
		http({
			url: urls.newData,
			type: "post",
			data: {},
			success: function(res) {
				var data = res.data;
				var str = '';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i];
					str += '<li class="center-item">' +
						'<p title=\"' + dataItem.boatName + '\">' + dataItem.boatName + '</p>' +
						'<p title=\"' + dataItem.boatId + '\">' + dataItem.boatId + '</p>' +
						'<p title=\"' + dataItem.boatTime + '\">' + dataItem.boatTime + '</p>' +
						'<p title=\"' + dataItem.boatLog + "," + dataItem.boatLat + '\">' + dataItem.boatLog + "," + dataItem.boatLat +
						'</p>' +
						'<p title=\"' + dataItem.boatAt + '\">' + dataItem.boatAt + '</p>' +
						'<p title=\"' + dataItem.boatHu + '\">' + dataItem.boatHu + '</p>' +
						'<p title=\"' + dataItem.boatBp + '\">' + dataItem.boatBp + '</p>' +
						'<p title=\"' + dataItem.boatVb + '\">' + dataItem.boatVb + '</p>' +
						'<p title=\"' + dataItem.boatWt + '\">' + dataItem.boatWt + '</p>' +
						'<p title=\"' + dataItem.boatWpt + '\">' + dataItem.boatWpt + '</p>' +
						'<p title=\"' + dataItem.boatSl + '\">' + dataItem.boatSl + '</p>' +
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
				getNewTimeout = setTimeout(getNewData, 3600000);
			}
		});
	};
	getNewData();

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
			window.clearInterval(getNewTimeout);
		}, function() {
			window.clearInterval(setTime);
			window.clearTimeout(getNewTimeout);
			setTime = setInterval(function() {
				setRollFn();
			}, speed);
			getNewTimeout = setTimeout(getNewData, getAlarmTime);
		});
	};


	// 左下角图形报表
	var myChart = echarts.init(document.getElementById('main'));

	function initBarLine(time, data, rate) {
		myChart.clear();
		var option = {
			backgroundColor: "#000",
			grid: {
				left: "3%",
				top: "40",
				right: "10",
				bottom: "10",
				containLabel: true
			},
			legend: {
				show: true,
				itemWidth: 12,
				itemHeight: 12,
				right: "0%",
				top: "0%",
				textStyle: {
					color: "#fff"
				},
				data: [{
					icon: "rect",
					name: "数据量"
				}, {
					icon: "circle",
					name: "接收率"
				}]
			},
			tooltip: {
				trigger: "axis",
				formatter: function(params) {
					var time = params[0].name;
					var data = params[0];
					var rate = params[1];
					var str_data = data.seriesName + ":" + data.value;
					var str_rate = rate.seriesName + ":" + rate.value + "%";
					var str = time + "<br/>" + str_data + "<br/>" + str_rate;
					return str;
				}
			},
			xAxis: [{
				data: time,
				// data: ['18日', '19日', '20日', '21日', '22日', '23日', '24日', '25日', '26日', '27日'],
				axisPointer: {
					type: "shadow"
				},
				axisLabel: {
					textStyle: {
						color: "#fff",
						fontSize: 12
					}
				},
				axisLine: {
					lineStyle: {
						color: "#595BB3"
					}
				},
				axisTick: {
					show: false
				},
				splitLine: {
					show: false
				}
			}],
			yAxis: [{
					type: "value",
					axisLabel: {
						formatter: "{value}",
						textStyle: {
							color: "#fff",
							fontSize: 12
						}
					},
					axisLine: {
						lineStyle: {
							color: "#595BB3"
						}
					},
					axisTick: {
						show: false
					},
					splitLine: {
						show: false
					}
				},
				{
					min: 0,
					max: 100,
					axisLabel: {
						formatter: "{value}",
						textStyle: {
							color: "#fff",
							fontSize: 12
						}
					},
					axisLine: {
						lineStyle: {
							color: "#595BB3"
						}
					},
					axisTick: {
						show: false
					},
					splitLine: {
						show: false,
						lineStyle: {
							type: "dashed",
							color: "rgba(255,255,255,0.2)"
						}
					},
					axisLabel: {
						color: '#07a6ff',
						textStyle: {
							fontSize: 12
						},
						formatter: function(value) {
							return value + '%'
						}
					}
				}
			],
			series: [{
				name: "数据量",
				type: "bar",
				data: data,
				// data:[100, 200, 300, 200, 300, 250, 240, 150, 400, 800]
				barWidth: "20",
				itemStyle: {
					normal: {
						color: {
							type: "linear",
							x: 0,
							y: 0,
							x2: 0,
							y2: 1,
							colorStops: [{
									offset: 0.3,
									color: "#1D76FF"
								},
								{
									offset: 1,
									color: "#39B8F2"
								}
							],
							globalCoord: false
						}
					}
				}
			}, {
				name: "良好率",
				type: "line",
				data: rate,
				// data: [10, 20, 30, 20, 30, 25, 24, 15, 80, 40, 80]
				yAxisIndex: 1,
				smooth: true,
				symbol: "circle",
				symbolSize: 10,
				lineStyle: {
					normal: {
						width: 2
					}
				},
				itemStyle: {
					normal: {
						color: "#0ACB6F",
						borderColor: "#0ACB6F",
						borderWidth: 1
					}
				},
				label: {
					normal: {
						show: false
					}
				}
			}]
		};
		myChart.setOption(option);
	};


	var pie = echarts.init(document.getElementById('pie'));

	function initPie() {
		var colorList = ['#0ACB6F', '#D77A00', '#00A2FF'];
		var option = {
			backgroundColor: "#000",
			tooltip: {
				trigger: 'item',
				borderColor: 'rgba(255,255,255,.3)',
				backgroundColor: 'rgba(13,5,30,.6)',
				borderWidth: 1,
				padding: 5,
				formatter: function(parms) {
					var str = parms.marker + "" + parms.data.name + "</br>" +
						"数量：" + parms.data.value + "艘</br>" +
						"占比率：" + parms.data.percent;
					return str;
				}
			},
			series: [{
				type: 'pie',
				center: ['50%', '50%'],
				radius: ['30%', '60%'],
				hoverOffset: 0,
				itemStyle: {
					normal: {
						color: function(params) {
							return colorList[params.dataIndex]
						},
						borderWidth: 0
					},
				},
				label: {
					show: true
				},
				labelLine: {
					normal: {
						length: 10,
						length2: 5,
						lineStyle: {
							width: 1
						}
					}
				},
				// data: [{
				// 	name: "大白",
				// 	value: "40000"
				// }, {
				// 	name: "长大",
				// 	value: "53000"
				// }, {
				// 	name: "杜洛克",
				// 	value: "40000"
				// }]
			}]
		};
		pie.setOption(option)
	};
	initPie();


	// 船舶数量
	function getTotalBoatFn() {
		http({
			url: urls.totalBoat,
			type: "post",
			data: {},
			success: function(res) {
				var data = res.data;
				var time = res.time;
				initBar(time, data);
			},
			complete: function() {
				setTimeout(getTotalBoatFn, 3600000);
			}
		});
	};
	getTotalBoatFn();

	var bar = echarts.init(document.getElementById('bar'));

	function initBar(time, data) {
		bar.clear();
		var option = {
			backgroundColor: "#000",
			grid: {
				left: "3%",
				top: "10",
				right: "10",
				bottom: "10",
				containLabel: true
			},
			tooltip: {
				trigger: "axis",
				formatter: function(params) {
					var str = "";
					for (var i = 0; i < params.length; i++) {
						if (params[i].name !== "") {
							str += params[i].name + "<br/>" +
								"船舶:" + params[i].value;
						}
					}
					return str;
				}
			},
			xAxis: [{
				data: time,
				// data:['18日', '19日', '20日', '21日', '22日', '23日', '24日', '25日', '26日', '27日'],
				axisPointer: {
					type: "shadow"
				},
				axisLabel: {
					textStyle: {
						color: "#fff",
						fontSize: 12
					}
				},
				axisLine: {
					lineStyle: {
						color: "#595BB3"
					}
				},
				axisTick: {
					show: false
				},
				splitLine: {
					show: false
				}
			}],
			yAxis: [{
				type: "value",
				axisLabel: {
					formatter: "{value}",
					textStyle: {
						color: "#fff",
						fontSize: 12
					}
				},
				axisLine: {
					lineStyle: {
						color: "#595BB3"
					}
				},
				axisTick: {
					show: false
				},
				splitLine: {
					show: false
				}
			}],
			series: [{
				type: "bar",
				data: data,
				// data: [100, 200, 300, 200, 300, 250, 240, 150, 400, 800],
				barWidth: "20",
				itemStyle: {
					normal: {
						color: {
							type: "linear",
							x: 0,
							y: 0,
							x2: 0,
							y2: 1,
							colorStops: [{
									offset: 0.3,
									color: "#00DD72"
								},
								{
									offset: 1,
									color: "#00FF85"
								}
							],
							globalCoord: false
						}
					}
				}
			}]
		};
		bar.setOption(option);
	};
	// initBar();

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

	e("hom", {})
});
