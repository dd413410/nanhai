layui.define(["http", "getFn", "layer", "form"], function(e) {
	var http = layui.http.http,
		urls = layui.urls,
		load = layui.http.load,
		getFn = layui.getFn;

	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form;

	var id = getFn.locaStr("id");

	// 获取详情
	var boatId;

	function getDetaFn() {
		http({
			url: urls.plusDeta,
			type: 'post',
			data: {
				id: id
			},
			success: function(res) {
				var data = res.data;
				var is = data.isPass;
				var html = is == 0 ? '<span style="color: #ffde00;">待审核</span>' : is == 1 ?
					'<span style="color: #33CC00;">审核已通过</span>' : '<span style="color: #f00;">审核拒绝</span>';
				$("#static").html(html);
				form.val('shipDeta', {
					"fixUnit": data.fixUnit,
					"fixPeople": data.fixPeople,
					"fixMobile": data.fixMobile,
					"fixTime": data.fixTime,
					"installAddress": data.installAddress,
					"examinPeople": data.examinPeople,
					"examineMobile": data.examineMobile,
					

					"sensorName": data.sensorName,
					"frequency": data.frequency,

					"warmSaltCode": data.warmSaltCode,
					"warmSaltTime": data.warmSaltTime,
					"installMethod": data.installMethod,

					"huCode": data.huCode,
					"huTime": data.huTime,
					"huAddress": data.huAddress,
					"huHeight": data.huHeight,

					"pwCode": data.pwCode,
					"pwTime": data.pwTime,
					"pwAddress": data.pwAddress,
					"pwHeight": data.pwHeight,

					"viCode": data.viCode,
					"viTime": data.viTime,
					"viAddress": data.viAddress,
					"viHeight": data.viHeight,

					"preCode": data.preCode,
					"preTime": data.preTime,
					"preAddress": data.preAddress,
					"preHeight": data.preHeight,

					"wdCode": data.wdCode,
					"wdTime": data.wdTime,
					"wdAddress": data.wdAddress,
					"wdHeight": data.wdHeight,

					"atCode": data.atCode,
					"atTime": data.atTime,
					"atAddress": data.atAddress,
					"atHeight": data.atHeight,

					"intCode": data.intCode,
					"intTime": data.intTime,
					"intInstallAddress": data.intInstallAddress
				});

				boatId = data.boatId;
				getShipDetaFn();
				if (!data.file||data.file.length <= 0) {
					return false;
				};
				var file = data.file.split(',');
				var str = '';
				for (var i = 0; i < file.length; i++) {
					var dataItem = file[i];
					var nameIdx = dataItem.lastIndexOf("/");
					var fileName = dataItem.substring(nameIdx + 1); //获得文件名
					var typeIdx = dataItem.lastIndexOf(".");
					var type = dataItem.substring(typeIdx + 1); //获得文件类型
					var fileType = '';
					var fileBtn = '';
					if (type == "png" || type == "jpg") {
						fileType = "图片";
						fileBtn = '<button type="button" class="layui-btn layui-btn-xs" lay-type="1" lay-url=' + dataItem +
							'>查看</button>';
					} else {
						fileType = "文件";
						fileBtn = '<button type="button" class="layui-btn layui-btn-xs" lay-type="2" lay-url=' + dataItem +
							'>下载</button>'
					};
					str += '<div class="file-item">' +
						'<p class="file-name" title="' + fileName + '">' + fileName + '</p>' +
						'<p class="file-type">' + fileType + '</p>' +
						'<p class="file-btn">' + fileBtn + '</p>' +
						'</div>';
				};
				$("#tbody").html(str);
			}
		});
	};
	getDetaFn();
	// 获取船舶信息
	function getShipDetaFn() {
		http({
			url: urls.shipDeta,
			type: "post",
			data: {
				boatId: boatId
			},
			success: function(res) {
				var data = res.data;
				form.val('shipDeta', {
					"boatName": data.boatName,
					"boatId": data.boatId,
					"boatContact": data.boatContact,
					"boatMobile": data.boatMobile,
					"boatNormalDepth": data.boatNormalDepth + "（m）",
					"boatFullDepth": data.boatFullDepth + "（m）"
				});

			}
		});
	};
	// 下载
	function loadFn(url) {
		load.down(url);
	};
	// 查看
	function lookFn(url) {
		layer.photos({
			shade: 0.2,
			anim: 5,
			photos: {
				"data": [{
					"src": url
				}]
			}
		});
	};
	$("#tbody").on("click", "button", function() {
		var url = $(this).attr("lay-url");
		var type = $(this).attr("lay-type");
		load.down(url);
		// type == 1 ? lookFn(url) : loadFn(url);
	});
	//选项卡切换
	$(".tabItem").click(function() {
		$(".tabItem").removeClass("add");
		$(this).addClass("add");
		var tab = $(this).attr("tab");
		$(".form-center").hide();
		$("#" + tab).show();
	});
	window.collFn = function() {
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.close(index);
	};
	e("plusDeta", {})
});
