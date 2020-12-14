layui.define(["http", "selectInput", "form", "laydate"], function(e) {
	var http = layui.http.http,
		urls = layui.urls,
		rouTo = layui.rouTo,
		selectInput = layui.selectInput;

	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form,
		laydate = layui.laydate;




	// 初始化时间
	$(".timeItem").each(function() {
		laydate.render({
			elem: this,
			type: 'datetime',
			range: "~",
			trigger: 'click'
		});
	});

	// 模糊查询
	var boatId = "";

	function getInputFn() {
		http({
			url: urls.searchBoat,
			type: "post",
			data: {
				name: ""
			},
			success: function(res) {
				var data = res.data;
				var arr = [];
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i];
					arr[i] = {
						value: dataItem.boatId,
						name: dataItem.boatName + "(" + dataItem.boatId + ")"
					}
				};
				initFn(arr);
			}
		});
	};
	getInputFn();

	function initFn(arr) {
		var ins = selectInput.render({
			elem: '#selectInput',
			placeholder: '请输入船舶名或船舶呼号查询',
			data: arr,
			remoteSearch: true,
			parseData: function(data) {
				var arr = [];
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i];
					arr[i] = {
						value: dataItem.boatId,
						name: dataItem.boatName + "(" + dataItem.boatId + ")"
					}
				};
				return arr;
			},
			remoteMethod: function(value, cb) {
				http({
					url: urls.searchBoat,
					type: "post",
					data: {
						name: value
					},
					success: function(res) {
						return cb(res.data);
					}
				});
			}
		});
		ins.on('itemInput(selectInput)', function(obj) {
			boatId = "";
		});
		ins.on('itemSelect(selectInput)', function(obj) {
			boatId = obj.data;
		});
	};
	// 搜索
	form.on('submit(sear)', function(data) {
		var c = $("#selectInput").find("input").val();
		if (c.length <= 0) {
			layer.msg("请输入船舶名或船舶呼号查询");
			return false;
		};
		boatId = boatId || c;
		http({
			url: urls.shipDeta,
			type: "post",
			data: {
				boatId: boatId
			},
			success: function(res) {
				var shipDeta = res.data;
				var id = shipDeta.id;
				if (!id) {
					layer.msg("查询不到该船舶信息!");
					return false;
				};
				domFn(2);
				document.getElementById('iframe').contentWindow["publcFn"](5, {
					boatLog: shipDeta.boatLog,
					boatLat: shipDeta.boatLat,
					boatName: shipDeta.boatName,
					boatId:shipDeta.boatId
				});
			}
		});
	});

	$("#map").html('<iframe id="iframe" src="./map1.html" frameborder="0"></iframe>');
	// 加载不同的地图
	form.on('select(type)', function(data) {
		var t = data.value;
		var url = './map' + t + '.html';
		var dom = '<iframe id="iframe" src=' + url + ' frameborder="0"></iframe>'
		$("#map").html(dom);
	});
	// 右上多个点击
	$("[map=btnMap]").click(function() {
		var type = $(this).attr("type");
		document.getElementById('iframe').contentWindow["publcFn"](type);
	});
	// 切换地图类型
	$("#iconType div").click(function() {
		$("#iconType div").removeClass("add");
		$(this).addClass("add");
		var is = $(this).attr("is");
		document.getElementById('iframe').contentWindow["setMapTypeFn"](is);
	});
	// 控制清除的显示隐藏
	window.domFn = function(x) {
		x == 1 ? $("#dele").show() : $("#dele").hide();
	};
	// 清除除了船舶以外的图层
	$("#dele").click(function() {
		document.getElementById('iframe').contentWindow["publcFn"]();
	});


	var layShip = null;
	// 表漂轨迹
	$("#buoyLineBtn").click(function() {
		// 船舶轨迹
		layShip = layer.open({
			type: 1,
			id: "1",
			title: "表漂轨迹",
			skin: 'ship-lines',
			area: "400px",
			closeBtn: 1,
			anim: 2,
			shade: 0,
			resize: false,
			content: $("#buoyLine")
		});
	});
	//初始化表漂下拉框
	function getXmFns() {
		var xmselect = xmSelect.render({
			el: '#xmselects',
			tips: '请选择表漂',
			name: 'surfaceList',
			layVerify: 'required',
			layReqText: '请选择表漂!',
			prop: {
				name: 'surfaceName',
				value: 'surfaceName'
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
			url: urls.getBuoy,
			type: "post",
			success: function(res) {
				var data = res.data;
				xmselect.update({
					data: data
				})
			}
		});
	};
	getXmFns();
	// 表漂提交
	form.on('submit(buoyBtn)', function(data) {
		var data = data.field;
		document.getElementById('iframe').contentWindow["publcFn"]("3", data);
		layer.close(layShip);
	});
	// 船舶轨迹多条
	$("#shipLineBtn").click(function() {
		layShip = layer.open({
			type: 1,
			id: "1",
			title: "船舶轨迹",
			skin: 'ship-lines',
			area: "400px",
			closeBtn: 1,
			anim: 2,
			shade: 0,
			resize: false,
			content: $("#shipLine")
		});
	});
	//初始化下拉框
	function getXmFn() {
		var xmselect = xmSelect.render({
			el: '#xmselect',
			tips: '请选择船舶',
			name: 'boatList',
			layVerify: 'required',
			layReqText: '请选择船舶!',
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
	// 船舶轨迹多个提交
	form.on('submit(shipBtn)', function(data) {
		var data = data.field;
		document.getElementById('iframe').contentWindow["publcFn"]("4", data);
		layer.close(layShip);
	});



	var layAlr = null;
	
	// 卫星
	$("#sateBtn").click(function() {
		layAlr = layer.open({
			type: 2,
			skin: 'drop-demo',
			title: "卫星",
			shade: 0,
			closeBtn: 1,
			id: "id",
			area: ["862px", "622px"],
			content: "./sate.html"
		});
	});
	// 预警报信息
	$("#alert").click(function() {
		layAlr = layer.open({
			type: 2,
			skin: 'drop-demo',
			title: "台风预警",
			shade: 0,
			closeBtn: 1,
			id: "id",
			area: ["1000px", "802px"],
			content: "./alert.html"
		});
	});

	var sessBoatName = null,
		sessBoatId = null;
	// 船舶弹窗
	window.layDetaFn = function(shipName, boatId) {
		sessBoatName = shipName,
			sessBoatId = boatId;
		var url = "./layShip.html?id=" + sessBoatId;
		layAlr = layer.open({
			type: 2,
			skin: 'drop-demo',
			title: shipName,
			shade: 0,
			closeBtn: 1,
			area: ["682px", "422px"],
			anim: 2,
			content: url,
			success: function() {
				$(".layui-layer-title")[0].innerHTML = sessBoatName;
			}
		});
	};
	// 数据表格
	window.layDataFn = function() {
		var url = "./shipTab.html?id=" + sessBoatId;
		layAlr = layer.open({
			type: 2,
			skin: 'drop-demo',
			title: sessionStorage.shipName,
			shade: 0,
			closeBtn: 1,
			area: ["1052px", "572px"],
			anim: 2,
			content: url
		});
	};

	// 单条轨迹选择时间

	window.layTimeFn = function() {
		layAlr = layer.open({
			type: 1,
			skin: 'drop-demo',
			title: sessBoatName,
			area: ["450px", "200px"],
			closeBtn: 1,
			anim: 2,
			shade: 0,
			resize: false,
			content: $("#trackBox"),
			success: function() {
				$(".layui-layer-title")[0].innerHTML = sessBoatId;
			}
		});
	};
	// 单条轨迹确认
	form.on('submit(trackBtn)', function(data) {
		var data = data.field;
		data.boatList = sessBoatId;
		document.getElementById('iframe').contentWindow["publcFn"]("4", data);
		layer.close(layAlr);
	});


	// 隐藏和显示右下角
	$("#stretch").click(function() {
		var is = $(this).attr("is"),
			dom = $(this).next();
		if (is == 1) {
			$(dom).hide(500);
			$(this).removeClass("layui-icon-next").addClass("layui-icon-prev");
		} else {
			$(dom).show(500);
			$(this).removeClass("layui-icon-prev").addClass("layui-icon-next");
		};
		var is = is == 1 ? 0 : 1;
		$(this).attr("is", is);
	});

	form.verify({
		time: function(val) {
			if (val.indexOf("~") == -1) {
				return '请选择时间范围!';
			}
		}
	});

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
	e("home", {})
});
