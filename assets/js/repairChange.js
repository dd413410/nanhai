layui.define(["http", "getFn", "form", "laydate", "upload"], function(e) {
	var http = layui.http.http,
		load = layui.http.load,
		urls = layui.urls,
		getFn = layui.getFn;

	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form,
		laydate = layui.laydate,
		upload = layui.upload;

	//初始化多个日期框
	$('.time-item').each(function() {
		laydate.render({
			elem: this,
			type: 'datetime',
			trigger: 'click'
		});
	});

	var id = getFn.locaStr("id");
	var boatId;
	var fileArr = [];

	function getDetaFn() {
		http({
			url: urls.repDeta,
			type: 'post',
			data: {
				id: id
			},
			success: function(res) {
				var data = res.data;
				form.val('shipDeta', {
					"id": data.id,

					"intUnit": data.intUnit,
					"intPeople": data.intPeople,
					"intMobile": data.intMobile,
					"repTime": data.repTime,
					"repAddress": data.repAddress,


					"signalType": data.signalType,
					"signalCode": data.signalCode,
					"frequency": data.frequency,
					"signalHeight": data.signalHeight,
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
					"intRemarks": data.intRemarks

				});

				boatId = data.boatId;
				getShipDetaFn();
				if (!data.file || data.file.length <= 0) {
					return false;
				};
				fileArr = data.file.split(',');
				var str = '';
				for (var i = 0; i < fileArr.length; i++) {
					var dataItem = fileArr[i];
					var nameIdx = dataItem.lastIndexOf("/");
					var fileName = dataItem.substring(nameIdx + 1) || "未知"; //获得文件名
					var typeIdx = dataItem.lastIndexOf(".");
					var type = dataItem.substring(typeIdx + 1); //获得文件类型
					var fileType = '';
					var fileBtn = '';
					if (type == "png" || type == "jpg") {
						fileType = "图片";
						fileBtn = '<button type="button" class="layui-btn layui-btn-xs" lay-type="1" lay-url=' + dataItem +
							'>查看</button>' +
							'<button type="button" class="layui-btn layui-btn-xs layui-btn-danger demo-delete" lay-type="3" lay-url=' +
							i + '>删除</button>';
					} else {
						fileType = "文件";
						fileBtn = '<button type="button" class="layui-btn layui-btn-xs" lay-url=' + dataItem +
							' lay-type="2">下载</button>' +
							'<button type="button" class="layui-btn layui-btn-xs layui-btn-danger demo-delete" lay-type="3" lay-url=' +
							i + '>删除</button>';
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
	// 删除
	function deleFn(_this, idx) {
		fileArr.splice(idx, 1);
		_this.parents(".file-item").remove();
	};
	$("#tbody").on("click", "button", function() {
		var url = $(this).attr("lay-url");
		var type = $(this).attr("lay-type");
		type == 3 ? deleFn($(this), url) : loadFn(url);
		// type == 1 ? lookFn(url) : type == 2 ? loadFn(url) : deleFn($(this), url);
	});
	//选项卡切换
	$(".tabItem").click(function() {
		$(".tabItem").removeClass("add");
		$(this).addClass("add");
		var tab = $(this).attr("tab");
		$(".form-center").hide();
		$("#" + tab).show();
	});
	//上传文件
	var listView = $('#tbody');
	var uploadListIns = upload.render({
		elem: '#fileBtn',
		url: urls.upload,
		accept: 'file',
		acceptMime: 'image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf',
		exts: 'doc|docx|jpg|png|pdf',
		size: 3072,
		multiple: true,
		auto: false,
		bindAction: '#uploadBtn',
		choose: function(obj) {
			var files = this.files = obj.pushFile();
			obj.preview(function(index, file, result) {
				var item = $([
					'<div class="file-item" id="upload-' + index + '">',
					'<p class="file-name">' + file.name + '</p>',
					'<p class="file-type">等待上传</p>',
					'<p class="file-btn">',
					'<button class="layui-btn layui-btn-xs demo-reload layui-hide">重传</button>',
					'<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>',
					'</p>',
					'</div>'
				].join(''));
				item.find('.demo-delete').on('click', function() {
					delete files[index];
					item.remove();
					uploadListIns.config.elem.next()[0].value = '';
				});
				listView.append(item);
			});
		},
		done: function(res, index, upload) {
			if (res.status == 1) {
				fileArr.push(res.imgs[0]);
				var item = listView.find('div#upload-' + index),
					tds = item.children();
				tds.eq(2).html('<span style="color: #5FB878;">上传成功</span>');
				tds.eq(3).html('');
				return delete this.files[index];
			}
			this.error(index, upload);
		},
		error: function(index, upload) {
			var item = demoListView.find('div#upload-' + index),
				tds = item.children();
			tds.eq(2).html('<span style="color: #FF5722;">上传失败</span>');
			tds.eq(3).find('.demo-reload').removeClass('layui-hide');
		}
	});
	//提交审核
	form.on('submit(addBtn)', function(data) {
		var data = data.field;
		data.file = fileArr.join(",");
		http({
			url: urls.repChange,
			type: "post",
			data: data,
			success: function(res) {
				layer.msg(res.msg);
				setTimeout(function() {
					collFn();
				}, 1500);
			}
		});
		return false;
	});

	form.verify({
		boatName: function(val) {
			if (!getFn.trimFn(val)) {
				return '请选择志愿船!';
			}
		},
		repTime: function(val) {
			if (!getFn.regDeta(val)) {
				return '请输入正确的维修时间,例如:2020-01-01 00:00:00!';
			}
		},
		repAddress: function(val) {
			if (!getFn.trimFn(val)) {
				return '请输入维修维护地址!';
			}
		},
		intPeople: function(val) {
			if (getFn.trimFn(val)) {
				var str = val.trim();
				var arr = val.split(",");
				for (var i = 0; i < arr.length; i++) {
					var item = arr[i];
					if (!getFn.user(item)) {
						return '请输入正确维修人员姓名!';
					}
				};
			}
		},
		intMobile: function(val) {
			if (getFn.trimFn(val)) {
				var str = val.trim();
				var arr = val.split(",");
				for (var i = 0; i < arr.length; i++) {
					var item = arr[i];
					if (!getFn.mobile(item) && !getFn.phone(item)) {
						return '请输入正确的维修人员联系方式!';
					}
				};
			}
		},
		intCheckUser: function(val) {
			if (getFn.trimFn(val) && !getFn.user(val)) {
				return '请输入正确的验收人姓名!';
			}
		},
		intCheckMobile: function(val) {
			if (getFn.trimFn(val)) {
				if (!getFn.mobile(val) && !getFn.phone(val)) {
					return '请输入正确的联系方式!';
				}
			}
		},
		regDeta: function(val) {
			if (getFn.trimFn(val) && !getFn.regDeta(val)) {
				return '请输入正确的日期格式,例如:2020-01-01!';
			}
		},
	});

	window.collFn = function() {
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.close(index);
	};
	e("repairChange", {})
});
