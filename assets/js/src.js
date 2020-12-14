layui.define(["http", "getFn", "form", "element"], function(e) {
	var http = layui.http.http,
		urls = layui.urls,
		rouTo = layui.rouTo,
		getFn = layui.getFn;

	var $ = layui.jquery,
		form = layui.form,
		element = layui.element;

	var toId = getFn.locaStr("is") || "211";
	// var toId = getFn.locaStr("is") || "25";
	
	$("[name=laynav]").click(function() {
		var url = $(this).attr("lay-url");
		var url = rouTo.handUrlFn(url);
		var dom = '<iframe class="iframe" src=' + url + ' frameborder="0"></iframe>'
		$("#iframe").html(dom);
	});
	
	$(".layui-nav-item").click(function() {
		$(this).siblings().removeClass("layui-nav-itemed");
	});

	(function() {
		$('[lay-url=' + toId + ']').parents(".layui-nav-item").addClass("layui-nav-itemed");
		$('[lay-url=' + toId + ']').click();
		var url = rouTo.handUrlFn(toId);
		var dom = '<iframe class="iframe" src=' + url + ' frameborder="0"></iframe>'
		$("#iframe").html(dom);
	})();

	window.locaFn = function(val) {
		if (!val) {
			layer.msg("待完善!")
			return false;
		};
		rouTo.handUrl(val);
	};
	window.outFn = function() {
		window.top.location.href = "../index.html";
	};
	e("src", {})
});
