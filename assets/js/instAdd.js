layui.define(["http", "getFn", "form", "laydate", "upload"], function(e) {
	var http = layui.http.http,
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
			}
		});
	};
	getShipList();
	var filePath = "";
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
				instAddFn();
			}
		}
	});
	//文件上传
	var fileArr = [];
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
					'<p>' + file.name + '</p>',
					'<p>' + (file.size / 1024).toFixed(1) + 'kb</p>',
					'<p>等待上传</p>',
					'<p>',
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
	var data;
	form.on('submit(addBtn)', function(d) {
		data = d.field;
		data.certificate = fileArr.join(",");
		isFile == 1 ? $("#addBtn").click() : instAddFn();
		return false;
	});

	function instAddFn() {
		data.testRecord = filePath;
		delete data.file;
		http({
			url: urls.instAdd,
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
				return '请选择安装的船舶!';
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
	window.collFn = function() {
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.close(index);
	};
	e("instAdd", {})
});
