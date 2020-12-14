layui.define(["http", "getFn", "form"], function(e) {
	var http = layui.http.http,
		load = layui.http.load,
		urls = layui.urls,
		getFn = layui.getFn;

	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form;

	var boatId = getFn.locaStr("id");
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
					"tonnage": data.tonnage,
					"ofUnit": data.ofUnit,
					"boatNormalDepth": data.boatNormalDepth + "（m）",
					"boatFullDepth": data.boatFullDepth + "（m）",
					"boatContact": data.boatContact,
					"boatMobile": data.boatMobile,
					"unitName": data.unitName,
					"companyMobile": data.companyMobile,
					"boatDesc": data.boatDesc
				});
			}
		});
	};
	getShipDetaFn();

	// 获取船舶最新加改装信息
	var plusId = null;

	function getPlusFn() {
		http({
			url: urls.shipPlus,
			type: "post",
			data: {
				boatId: boatId
			},
			success: function(res) {
				var data = res.data;
				plusId = data.id;
				$("#fixTime").html(data.fixTime);
				$("#installAddress").html(data.installAddress);

				form.val('plusDeta', {
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
				if (!data.file || data.file.length <= 0) {
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

	getPlusFn();

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
	$(".tbodys").on("click", "button", function() {
		var url = $(this).attr("lay-url");
		var type = $(this).attr("lay-type");
		load.down(url);
		// type == 1 ? lookFn(url) : loadFn(url);
	});

	// 获取船舶最新维护信息
	function getRepFn() {
		http({
			url: urls.shipRep,
			type: "post",
			data: {
				boatId: boatId
			},
			success: function(res) {
				var data = res.data;
				$("#repTime").html(data.repTime);
				$("#repAddress").html(data.repAddress);

				form.val('repDeta', {

					"intUnit": data.intUnit,
					"intPeople": data.intPeople,
					"intMobile": data.intMobile,
					"repTime": data.repTime,
					"repAddress": data.repAddress,
					"intCheckUser": data.intCheckUser,
					"intCheckMobile": data.intCheckMobile,


					"signalType": data.signalType,
					"signalCode": data.signalCode,
					"frequency": data.frequency,
					"signalAddress": data.signalAddress,

					"warmType": data.warmType,
					"warmCode": data.warmCode,
					"warmTime": data.warmTime,
					"warmHeight": data.warmHeight,
					"warmRemarks": data.warmRemarks,

					"huType": data.huType,
					"huCode": data.huCode,
					"huTime": data.huTime,
					"huHeight": data.huHeight,
					"huRemarks": data.huRemarks,

					"pwType": data.pwType,
					"pwCode": data.pwCode,
					"pwTime": data.pwTime,
					"pwHeight": data.pwHeight,
					"pwRemarks": data.pwRemarks,

					"viType": data.viType,
					"viCode": data.viCode,
					"viTime": data.viTime,
					"viHeight": data.viHeight,
					"viRemarks": data.viRemarks,

					"preType": data.preType,
					"preCode": data.preCode,
					"preTime": data.preTime,
					"preHeight": data.preHeight,
					"preRemarks": data.preRemarks,

					"wdType": data.wdType,
					"wdCode": data.wdCode,
					"wdTime": data.wdTime,
					"wdHeight": data.wdHeight,
					"wdRemarks": data.wdRemarks,

					"atType": data.atType,
					"atCode": data.atCode,
					"atTime": data.atTime,
					"atHeight": data.atHeight,
					"atRemarks": data.atRemarks,

					"intType": data.intType,
					"intCode": data.intCode,
					"intTime": data.intTime,
					"intHeight": data.intHeight,
					"intRemarks": data.intRemarks
				});
				if (!data.file || data.file.length <= 0) {
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
				$("#tbodys").html(str);

			}
		});
	};
	getRepFn();



	// 导出
	form.on('submit(subbtn)', function() {
		if (!plusId) {
			layer.msg("该船舶无加改装记录,无法导出!");
			return false;
		}
		http({
			url: urls.shipExportDeta,
			type: "post",
			data: {
				id: plusId
			},
			success: function(res) {
				var url = res.url;
				load.down(url);
			}
		});
		return false;
	});


	window.collFn = function() {
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.close(index);
	};


	e("shipDeta", {})
});
