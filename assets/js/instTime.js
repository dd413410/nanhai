layui.define(["http", "getFn"], function(e) {
	var http = layui.http.http,
		urls = layui.urls,
		getFn = layui.getFn;

	var $ = layui.jquery;

	var names = getFn.locaStr("names");

	function getListFn() {
		http({
			url: urls.instTime,
			type: "post",
			data: {
				name: names
			},
			success: function(res) {
				var data = res.data;
				var str='';
				for (var i = 0; i < 99; i++) {
					str += '<div class="time-item">2020年01月01日</div>';
				};
				$("#timeBox").html(str);
			}
		});
	};
	getListFn();
	
	e("instTime", {})
});
