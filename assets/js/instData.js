layui.define(["http", "getFn", ], function(e) {
	var http = layui.http.http,
		urls = layui.urls,
		getFn = layui.getFn;

	var $ = layui.jquery;
	var names = getFn.locaStr("names");

	function getDetaFn() {
		http({
			url: urls.instData,
			type: "post",
			data: {
				name: names
			},
			success: function(res) {
				var data = res.data;
				var str = '';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i];
					str += '<div class="list-item">' +
						'<p>' + dataItem.testNum + '</p>' +
						'<p>' + dataItem.testTime + '</p>' +
						'<p>' + dataItem.nextTime + '</p></div>';
				};
				$("#listBox").html(str);
			}
		});
	};
	getDetaFn();
	e("instData", {})
});
