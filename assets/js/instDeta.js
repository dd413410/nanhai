layui.define(["http", "getFn", "form"], function(e) {
	var http = layui.http.http,
		load = layui.http.load,
		urls = layui.urls,
		getFn = layui.getFn;

	var $ = layui.jquery,
		form = layui.form;

	var id = getFn.locaStr("id");

	function getDetaFn() {
		http({
			url: urls.instDeta,
			type: "post",
			data: {
				id: id
			},
			success: function(res) {
				var data = res.data;
				var filePath = data.testRecord;
				var nameIdx = filePath.lastIndexOf("/");
				var fileName = filePath.substring(nameIdx + 1) || "未知";
				$("#file").html(fileName);
				$("#file").attr({
					"href": filePath,
					"title": filePath
				});

				form.val('instForm', {
					"instrumentNum": data.instrumentNum,
					"price": data.price,
					"instrumentName": data.instrumentName,
					"instrumentStatus": data.instrumentStatus,
					"instrumentType": data.instrumentType,
					"internalNum": data.internalNum,
					"instrumentModel": data.instrumentModel,
					"purchaseTime": data.purchaseTime,
					"instrumentNumber": data.instrumentNumber,
					"fixTime": data.instrumentNumber,
					"IdentificationTime": data.IdentificationTime,
					"testTime": data.testTime,
					"nextTime": data.nextTime,
					"installTime": data.installTime,
					"area": data.area,
					"installBoat": data.installBoat,
					"installSeat": data.installSeat
				});

				var file = data.certificate.split(',');
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
		type == 1 ? lookFn(url) : loadFn(url);
	});
	$("#file").click(function(e) {
		e.preventDefault();
		var url = $(this).attr("href");
		loadFn(url);
	});
	e("instDeta", {})
});
