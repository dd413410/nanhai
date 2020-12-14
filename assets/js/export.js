layui.define(["http", "form", 'laydate'], function(e) {
	var http = layui.http.http,
		urls = layui.urls;

	var $ = layui.$,
		form = layui.form,
		laydate = layui.laydate;

	// 初始化时间
	laydate.render({
		elem: '#time',
		type: 'datetime',
		range: "~",
		trigger: 'click'
	});

	//初始化下拉框
	function getXmFn() {
		var xmselect = xmSelect.render({
			el: '#xmselect',
			tips: '请选择船舶',
			name: 'boatList',
			layVerify: 'required',
			layReqText: '请选择船舶',
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


	// 要素
	function getElListFn() {
		http({
			url: urls.elList,
			type: "post",
			success: function(res) {
				var data = res.data;
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i];
					var str = '<p><input type="checkbox" lay-skin="primary" value=' + dataItem.name + ' title=' + dataItem.name +
						' class="checkbox"></p>'
					$("#check").append(str);
				};
				form.render("checkbox");
			}
		});
	};
	getElListFn();

	form.on('checkbox(c_all)', function(data) {
		var a = data.elem.checked;
		if (a == true) {
			$(".checkbox").prop("checked", true);
		} else {
			$(".checkbox").prop("checked", false);
		};
		form.render('checkbox');
	});
	// 导出
	form.on('submit(subbtn)', function(data) {
		var data = data.field;
		var time = data.time;
		var idx = time.indexOf("~");
		var startTime = time.substring(0, idx).trim();
		var endTime = time.substring(idx + 1).trim();
		var el = [];
		$("#check").find('[type="checkbox"]').each(function() {
			var is = $(this).is(":checked");
			if (is) {
				el.push($(this).val())
			}
		});
		if (el.length <= 0) {
			layer.msg("请选择要素");
			return false;
		};
		var elementList = el.join(',');
		var boatList = fdata.join(',');
		var datas = {
			boatList: data.boatList,
			startTime: startTime,
			endTime: endTime,
			elementList: elementList
		};
		http({
			url: urls.dataExport,
			type: "post",
			data: datas,
			success: function(res) {
				var url = res.url;
				window.location.href = url;
				regFn();
			}
		});
	});
	form.verify({
		time: function(val) {
			if (val.indexOf("~") == -1) {
				return '请选择时间范围!';
			}
		}
	});

	window.regFn = function() {
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.close(index);
	};

	e("export", {})
});
