layui.define(["http", "getFn", "form", "laydate", "upload"], function(e) {
	var http = layui.http.http,
		urls = layui.urls,
		load = layui.http.load,
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
	// 获取船舶
	function getShipList() {
		http({
			url: urls.boatList,
			type: "post",
			success: function(res) {
				var data = res.data;
				var str = '<option value="">直接选择或搜索选择</option>';
				for (var d = 0; d < data.length; d++) {
					var dataItem = data[d];
					str += '<option value="' + dataItem.boatName + '">' + dataItem.boatName + '</option>';
				};
				$("#formSear").html(str);
				form.render("select");
				getDetaFn();
			}
		});
	};
	getShipList();
	// 获取详情
	var filePath = '';
	var fileArr = [];
	
	function getDetaFn() {
		http({
			url: urls.instDeta,
			type: "post",
			data: {
				id: id
			},
			success: function(res) {
				var data = res.data;
				filePath = data.testRecord;
				var nameIdx = filePath.lastIndexOf("/");
				var fileName = filePath.substring(nameIdx + 1) || "未知";
				$("#file").html(fileName);
				$("#file").attr("title", filePath);
				form.val('instForm', {
					"id": data.id,
					"instrumentNum": data.instrumentNum,
					"price": data.price,
					"instrumentName": data.instrumentName,
					"instrumentStatus": data.instrumentStatus,
					"instrumentType": data.instrumentType,
					"internalNum": data.internalNum,
					"instrumentModel": data.instrumentModel,
					"purchaseTime": data.purchaseTime,
					"instrumentNumber": data.instrumentNumber,
					"fixTime": data.fixTime,
					"IdentificationTime": data.IdentificationTime,

					"testTime": data.testTime,
					"nextTime": data.nextTime,

					"installTime": data.installTime,
					"area": data.area,
					"installBoat": data.installBoat,
					"installSeat": data.installSeat
				});

				fileArr = data.certificate.split(',');
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
		type == 1 ? lookFn(url) : type == 2 ? loadFn(url) : deleFn($(this), url);
	});
	//上传证书
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
	var isFile = 0;
	var fileUpload = upload.render({
		elem: '#file',
		url: urls.upload,
		accept: 'file',
		acceptMime: 'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf',
		exts: 'doc|docx|pdf',
		size: 3072,
		multiple: true,
		auto: false,
		bindAction: '#addBtn',
		choose: function(obj) {
			var files = obj.pushFile();
			obj.preview(function(index, file, result) {
				$("#file").html(file.name);
				isFile = 1;
			});
		},
		done: function(res, index, upload) {
			if (res.status == 1) {
				filePath = res.imgs[0];
				instChangeFn();
			}
		}
	});
	//提交审核
	var data;
	form.on('submit(addBtn)', function(d) {
		data = d.field;
		data.certificate = fileArr.join(",");
		delete data.file;
		isFile == 1 ? $("#addBtn").click() : instChangeFn();
		return false;
	});

	function instChangeFn() {
		data.testRecord = filePath;
		http({
			url: urls.instChange,
			type: "post",
			data: data,
			success: function(res) {
				layer.msg(res.msg);
				setTimeout(function() {
					collFn();
				}, 1500);
			}
		})
	};
	form.verify({
		instrumentNum: function(val) {
			if (!getFn.trimFn(val)) {
				return '请输入序号!';
			}
		},
		price: function(val) {
			if (!getFn.trimFn(val)) {
				return '请输入价格!';
			}
		},

		instrumentName: function(val) {
			if (!getFn.trimFn(val)) {
				return '请输入仪器名称!';
			}
		},
		instrumentType: function(val) {
			if (!getFn.trimFn(val)) {
				return '请输入仪器类别!';
			}
		},
		internalNum: function(val) {
			if (!getFn.trimFn(val)) {
				return '请输入仪器内部编号!';
			}
		},
		instrumentModel: function(val) {
			if (!getFn.trimFn(val)) {
				return '请输入仪器型号!';
			}
		},
		purchaseTime: function(val) {
			if (!getFn.regDeta(val)) {
				return '请输入正确的采购时间,例如:2020-01-01 00:00:00!';
			}
		},
		instrumentNumber: function(val) {
			if (!getFn.trimFn(val)) {
				return '请输入仪器序列号!';
			}
		},
		installTime: function(val) {
			if (!getFn.regDeta(val)) {
				return '请输入正确的安装时间,例如:2020-01-01!';
			}
		},
		area: function(val) {
			if (!getFn.trimFn(val)) {
				return '请输入存放地点!';
			}
		},
		installBoat: function(val) {
			if (!getFn.trimFn(val)) {
				return '请选择安装的船舶名称!';
			}
		},
		installSeat: function(val) {
			if (!getFn.trimFn(val)) {
				return '请输入安装位置!';
			}
		},
		regDeta: function(val) {
			if (getFn.trimFn(val) && !getFn.regDeta(val)) {
				return '请输入正确的日期格式,例如:2020-01-01!';
			}
		}
	});
	e("instChang", {})
});
