layui.define(["http", "thead", "layer", "form", "table"], function(e) {
	var http = layui.http.http,
		load = layui.http.load,
		urls = layui.urls,
		rouTo = layui.rouTo,
		thead = layui.thead;

	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form,
		table = layui.table;

	var userType = sessionStorage.userType;
	userType == 1 ? $('[name="isBtn"]').show() : $('[name="isBtn"]').hide();

	//初始化下拉框
	function getXmFn() {
		var xmselect = xmSelect.render({
			el: '#xmselect',
			tips: '请选择船舶',
			name: 'nameList',
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

	var nameList = "",
		isPass = 3;
	var cols = thead("repair", 1);
	// 列表接口
	window.getListFn = function() {
		table.render({
			elem: '#table',
			url: urls.repList,
			method: "post",
			where: {
				name: nameList,
				isPass: isPass,
				token: sessionStorage.token
			},
			request: {
				pageName: 'pages',
				limitName: 'pageNums'
			},
			parseData: function(res) {
				rouTo.error(res.code);
				return {
					"code": 0,
					"count": res.count,
					"data": res.data
				};
			},
			cols: [cols],
			page: {
				layout: ['prev', 'page', 'next', 'skip', 'count', 'limit'],
				groups: 5
			},
			limits: [10],
			id: 'tabReload',
			height: "780"
		});
	};
	getListFn();
	// 查询
	form.on('submit(queryBtn)', function(data) {
		var data = data.field;
		nameList = data.nameList;
		isPass = data.isPass;
		getListFn();
	});
	// 新增
	form.on('submit(addBtn)', function(data) {
		var url = "./repairAdd.html";
		layFn(url);
	});
	var perData;
	table.on('tool(table)', function(obj) {
		perData = obj;
		var evet = obj.event;
		/*evet: 1:审核通过(通过和拒绝走一个接口);2:审核拒绝(通过和拒绝走一个接口);3:删除;4:详情查看;5:修改;6:导出;*/
		switch (evet) {
			case "1":
				repRove(evet);
				break;
			case "2":
				repRove(evet);
				break;
			case "3":
				deleteFn();
				break;
			case "4":
				var id = perData.data.id;
				var url = "./repairDeta.html?id=" + id;
				layFn(url);
				break;
			case "5":
				var id = perData.data.id;
				var url = "./repairChange.html?id=" + id;
				layFn(url);
				break;
			default:
				dataExport()
				break;
		};
	});
	// 审核接口
	function repRove(x) {
		http({
			url: urls.repRove,
			type: 'post',
			data: {
				id: perData.data.id,
				isPass: x
			},
			success: function(res) {
				layer.msg(res.msg);
				table.reload('tabReload', {
					page: {
						curr: $(".layui-laypage-em").next().html()
					}
				});
			}
		});
	};
	// 删除
	function deleteFn() {
		var layMsg = layer.msg('此操作将永久删除该数据, 是否继续?', {
			time: 5000,
			shade: false,
			btn: ['确定', '取消'],
			yes: function() {
				http({
					url: urls.repDelete,
					type: 'post',
					data: {
						id: perData.data.id
					},
					success: function(res) {
						perData.del();
						layer.msg('删除成功');
						table.reload('tabReload', {
							page: {
								curr: $(".layui-laypage-em").next().html()
							}
						});
						layer.close(layMsg);
					}
				});
			},
			btn2: function() {
				layer.msg('已取消删除。');
			}
		});
	};
	// 导出接口
	function dataExport() {
		http({
			url: urls.repExport,
			type: 'post',
			data: {
				id: perData.data.id
			},
			success: function(res) {
				var url = res.url;
				load.down(url);
			}
		});
	};

	// 弹窗
	function layFn(url) {
		if (!url) {
			return false;
		};
		layer.open({
			type: 2,
			title: '<img src="../static/zyc12.png" alt=""><span>维修维护记录</span>',
			skin: "plus-tle",
			shade: false,
			closeBtn: 1,
			id: "id",
			offset: ["10px", "350px"],
			area: ["680px", "820px"],
			content: url
		});
		// layer.open({
		// 	type: 2,
		// 	title: false,
		// 	shade: false,
		// 	closeBtn: 0,
		// 	id: "id",
		// 	offset: ["10px", "350px"],
		// 	area: ["680px", "820px"],
		// 	content: url
		// });
	};
	window.collFn = function() {
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.close(index);
	};
	e("repair", {})
});
