layui.define(["http", "form"], function(e) {
	var http = layui.http.http,
		urls = layui.urls;

	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form;


	var data = [],
		lth = -1;
	var seep = 0;

	function getSateImgFn() {
		http({
			url: urls.getSateImg,
			type: "post",
			success: function(res) {
				data = res.data;
				lth = data.length;
				if (lth > 0) {
					var imgDom = '<img src="' + data[0].url + '">';
					$("#imgBox").html(imgDom);
					$("#time").val(data[0].time);
					var str = '';
					for (var i = 0; i < data.length; i++) {
						var dataItem = data[i];
						str += '<option value="' + i + '">' + dataItem.time + '</option>'
					};
					$("#select").html(str);
					form.render("select");

				} else {
					lth = 0;
					$("#imgBox").html("暂无数据");
				};
			}
		});
	};
	getSateImgFn();


	form.on('select(select)', function(d) {
		window.clearTimeout(setOut);
		seep = d.value;
		$("#play").removeClass("layui-icon-pause").addClass("layui-icon-play");
		var src = data[seep].url;
		$("#imgBox img").attr("src", src);
		$("#time").val(data[seep].time);
	});

	// 点击播放
	$("#play").click(function() {
		if (lth == -1) {
			layer.msg("请等待数据加载");
			return false;
		} else if (lth == 0) {
			layer.msg("暂无数据");
			return false;
		};
		var is = $(this).hasClass("layui-icon-play");
		if (is) {
			$(this).removeClass("layui-icon-play").addClass("layui-icon-pause");
			setImgFn();
		} else {
			$(this).removeClass("layui-icon-pause").addClass("layui-icon-play");
			window.clearTimeout(setOut);
		};
	});

	// 上一张
	$("#next").click(function() {
		if (lth == -1) {
			layer.msg("请等待数据加载");
			return false;
		} else if (lth == 0) {
			layer.msg("暂无数据");
			return false;
		};
		window.clearTimeout(setOut);
		if (seep == 0) {
			layer.msg("已经是第一张了");
			return false;
		};
		seep--;
		var src = data[seep].url;
		$("#imgBox img").attr("src", src);
		$("#time").val(data[seep].time);
		$("#play").removeClass("layui-icon-pause").addClass("layui-icon-play");
	});
	// 下一张
	$("#prev").click(function() {
		if (lth == -1) {
			layer.msg("请等待数据加载");
			return false;
		} else if (lth == 0) {
			layer.msg("暂无数据");
			return false;
		};
		window.clearTimeout(setOut);
		if (seep == lth - 1) {
			layer.msg("已经是最后一张了");
			return false;
		};
		seep++;
		var src = data[seep].url;
		$("#imgBox img").attr("src", src);
		$("#time").val(data[seep].time);
		$("#play").removeClass("layui-icon-pause").addClass("layui-icon-play");
	});


	var setOut = null;
	function setImgFn() {
		var src = data[seep].url;
		$("#imgBox img").attr("src", src);
		$("#time").val(data[seep].time);
		seep++;
		if (seep < lth) {
			setOut = setTimeout(function() {
				setImgFn();
			}, 500);
		} else if (seep == lth) {
			$("#play").removeClass("layui-icon-pause").addClass("layui-icon-play");
			seep = 0;
		};
	};
	e("sate", {})
});
