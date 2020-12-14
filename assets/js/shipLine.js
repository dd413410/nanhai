layui.define(["http", "form", "laydate"], function(e) {
	var http = layui.http.http,
		urls = layui.urls;

	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form,
		laydate = layui.laydate;
		
		function getShipFn() {
			http({
				url: urls.boatList,
				type: "post",
				success: function(res) {
					var data = res.data;
					var ship='';
					for (var d = 0; d < data.length; d++) {
						var dataItem = data[d];
						ship+='<p><input type="checkbox" lay-skin="primary" value="' + dataItem.boatId + '" title="' + dataItem.boatName + '"></p>';
					};
					$("#check").html(ship);
					form.render("checkbox");
				}
			});
		};
		getShipFn();
		
		
		laydate.render({
			elem: '#shipTime',
			type: 'datetime',
			range: "~"
		});
		
	e("shipLine", {})
});
