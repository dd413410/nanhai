var fdata = [];

function receFn(d) {
	fdata = d;
};
layui.define(["http", "form"], function(e) {
	var http = layui.http.http,
		urls = layui.urls;
	var $ = layui.$,
		form = layui.form;
	function boatList() {
		$("#check").empty();
		http({
			url: urls.boatList,
			type:"post",
			success: function(res) {
				var data = res.data;
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i];
					var str = '<p><input type="checkbox" lay-skin="primary" value=' + dataItem.boatId + ' title=' + dataItem.boatName +
						' class="checkbox"></p>'
					$("#check").append(str);
				};
				if (fdata.length > 0) {
					var check = $("#check").find('[type="checkbox"]');
					for (var c = 0; c < fdata.length; c++) {
						var m = fdata[c];
						for (var k = 0; k < check.length; k++) {
							var v = check[k].value;
							if (v == m) {
								$(check[k]).attr('checked', true)
							}
						}
					}
				};
				form.render("checkbox");
			}
		});
	};
	boatList();
	form.on('checkbox(c_all)', function(data) {
		var a = data.elem.checked;
		if (a == true) {
			$(".checkbox").prop("checked", true);
			form.render('checkbox');
		} else {
			$(".checkbox").prop("checked", false);
			form.render('checkbox');
		};
	});
	$("#back").click(function() {
		var arr = [];
		$(".checkbox").each(function(v) {
			var c = $(this).is(":checked");
			if (c) {
				arr.push($(this).val());
			}
		});
		parent.receFn(arr);
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.close(index);
	});
	e("boatList", {})
});
