layui.define(["http", "getFn", "layer", "form", "laydate", "upload"], function(e) {
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
	// 初始化加改装时间
	laydate.render({
		elem: "#fixTime",
		trigger: 'click'
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
					str += '<option value="' + dataItem.boatId + '">' + dataItem.boatName + '</option>';
				};
				$("#formSear").html(str);
				form.render("select");
			}
		});
	};
	getShipList();
	// 选择船舶后查询信息
	form.on('select(check)', function(data) {
		var boatId = data.value;
		if (boatId == "") {
			return false;
		}
		http({
			url: urls.shipDeta,
			type: "post",
			data: {
				boatId: boatId
			},
			success: function(res) {
				var data = res.data;
				form.val('shipDeta', {
					"boatId": data.boatId,
					"boatContact": data.boatContact,
					"boatMobile": data.boatMobile,
					"boatNormalDepth": data.boatNormalDepth + "（m）",
					"boatFullDepth": data.boatFullDepth + "（m）"
				});
			}
		});
	});
	// 选项卡切换
	$(".tabItem").click(function() {
		$(".tabItem").removeClass("add");
		$(this).addClass("add");
		var tab = $(this).attr("tab");
		$(".form-center").hide();
		$("#" + tab).show();
	});
	//上传文件
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
	form.on('submit(addBtn)', function(data) {
		var data = data.field;
		data.file = fileArr.join(",");
		http({
			url: urls.plusAdd,
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
		fixTime: function(val) {
			if (!getFn.regTime(val)) {
				return '请输入正确的日期格式,例如:2020-01-01!';
			}
		},
		installAddress: function(val) {
			if (!getFn.trimFn(val)) {
				return '请输入加改装地址!';
			}
		},
		fixPeople: function(val) {
			if (getFn.trimFn(val)) {
				var str = val.trim();
				var arr = val.split(",");
				for (var i = 0; i < arr.length; i++) {
					var item = arr[i];
					if (!getFn.user(item)) {
						return '请输入正确安装人员姓名!';
					}
				};
			}
		},
		fixMobile: function(val) {
			if (getFn.trimFn(val)) {
				var str = val.trim();
				var arr = val.split(",");
				for (var i = 0; i < arr.length; i++) {
					var item = arr[i];
					if (!getFn.mobile(item) && !getFn.phone(item)) {
						return '请输入正确的安装人员联系方式!';
					}
				};
			}
		},
		examinPeople: function(val) {
			if (getFn.trimFn(val) && !getFn.user(val)) {
				return '请输入正确的验收人姓名!';
			}
		},
		examineMobile: function(val) {
			if (getFn.trimFn(val)) {
				if (!getFn.mobile(val) && !getFn.phone(val)) {
					return '请输入正确的联系方式!';
				}
			}
		},
		regDeta: function(val) {
			if (getFn.trimFn(val) && !getFn.regDeta(val)) {
				return '请输入正确的日期格式,例如:2020-01-01  00:00:00!';
			}
		},
	});


	window.collFn = function() {
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.close(index);
	};
	e("plusAdd", {})
});
