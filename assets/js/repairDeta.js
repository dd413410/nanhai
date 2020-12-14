layui.define(["http", "getFn", "form"], function(e) {
	var http = layui.http.http,
		load = layui.http.load,
		urls = layui.urls,
		getFn = layui.getFn;

	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form;

	var id = getFn.locaStr("id");
	var boatId;

	function getDetaFn() {
		http({
			url: urls.repDeta,
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

					"warmCode": data.warmCode,
					"warmTime": data.warmTime,
					"warmHeight": data.warmHeight,
					"warmType": data.warmType,
					"warmRemarks": data.warmRemarks,

					"huCode": data.huCode,
					"huTime": data.huTime,
					"huHeight": data.huHeight,
					"huType": data.huType,
					"huRemarks": data.huRemarks,

					"pwCode": data.pwCode,
					"pwTime": data.pwTime,
					"pwHeight": data.pwHeight,
					"pwType": data.pwType,
					"pwRemarks": data.pwRemarks,

					"viCode": data.viCode,
					"viTime": data.viTime,
					"viHeight": data.viHeight,
					"viType": data.viType,
					"viRemarks": data.viRemarks,

					"preCode": data.preCode,
					"preTime": data.preTime,
					"preHeight": data.preHeight,
					"preType": data.preType,
					"preRemarks": data.preRemarks,

					"wdCode": data.wdCode,
					"wdTime": data.wdTime,
					"wdHeight": data.wdHeight,
					"wdType": data.wdType,
					"wdRemarks": data.wdRemarks,

					"atCode": data.atCode,
					"atTime": data.atTime,
					"atHeight": data.atHeight,
					"atType": data.atType,
					"atRemarks": data.atRemarks,

					"intType": data.intType,
					"intCode": data.intCode,
					"intTime": data.intTime,
					"intHeight": data.intHeight,
					"intRemarks": data.intRemarks,
					
				});

				boatId = data.boatId;
				getShipDetaFn();
				if (!data.file || data.file.length <= 0) {
					return false;
				};
				var file = data.file.split(',');
				var str = '';
				for (var i = 0; i < file.length; i++) {
					var dataItem = file[i];
					var nameIdx = dataItem.lastIndexOf("/");
					var fileName = dataItem.substring(nameIdx + 1);
					var typeIdx = dataItem.lastIndexOf(".");
					var type = dataItem.substring(typeIdx + 1);
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
					"ofUnit": data.ofUnit,
					"companyMobile": data.companyMobile
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
	e("repairDeta", {})
});
