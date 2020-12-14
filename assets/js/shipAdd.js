layui.define(["http", "getFn", "form"], function(e) {
	var http = layui.http.http,
		urls = layui.urls,
		getFn = layui.getFn;

	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form;

	var boatId = getFn.locaStr("id");
	
	if (boatId) {
		$("#subbtn").html("修改");
		getShipDetaFn();
	} else {
		$("#subbtn").html("新增");
	};
	function getShipDetaFn() {
		http({
			url: urls.shipDeta,
			type: "post",
			data: {
				boatId: boatId
			},
			success: function(res) {
				var data = res.data;
				form.val('shipForm', {
					"id": data.id,
					"boatName": data.boatName,
					"boatId": data.boatId,
					"boatContact": data.boatContact,
					"boatMobile": data.boatMobile,
					"ofUnit": data.ofUnit,
					"unitName": data.unitName,
					"companyMobile": data.companyMobile,
					"frequency": data.frequency,
					"tonnage": data.tonnage,
					"boatNormalDepth": data.boatNormalDepth,
					"boatFullDepth": data.boatFullDepth,
					"boatDesc": data.boatDesc,
				});

			}
		});
	};
	form.on('submit(addBtn)', function(data) {
		var data = data.field;
		boatId ? shipChange(data) : shipAdd(data);
		return false;
	});
	// 修改
	function shipChange(data) {
		http({
			url: urls.shipChange,
			type: "post",
			data: data,
			success: function(res) {
				layer.msg("修改成功");
				setTimeout(function() {
					collFn();
					parent.getListFn();
				}, 1500);
			}
		});
	};
	// 添加
	function shipAdd(data) {
		delete data.id;
		http({
			url: urls.shipAdd,
			type: "post",
			data: data,
			success: function(res) {
				layer.msg("添加成功");
				setTimeout(function() {
					collFn();
					parent.getListFn();
				}, 1500);
			}
		});
	};
	form.verify({
		boatName: function(val) {
			if (!getFn.trimFn(val)) {
				return '请输入志愿船名称!';
			}
		},
		boatId: function(val) {
			if (!getFn.trimFn(val)) {
				return '请输入船舶呼号!';
			}
		},
		boatContact: function(val) {
			if (!getFn.trimFn(val)) {
				return '请输入船舶联系人,多个以,分开!';
			} else {
				var str = val.trim();
				var arr = val.split(",");
				for (var i = 0; i < arr.length; i++) {
					var item = arr[i];
					if (!getFn.user(item)) {
						return '请输入正确联系人姓名!';
					}
				};
			}
		},
		boatMobile: function(val) {
			if (!getFn.trimFn(val)) {
				return '请输入联系方式,多个以,分开!';
			} else {
				var str = val.trim();
				var arr = val.split(",");
				for (var i = 0; i < arr.length; i++) {
					var item = arr[i];
					if (!getFn.mobile(item) && !getFn.phone(item)) {
						return '请输入正确的联系方式!';
					}
				};
			}
		},
		ofUnit: function(val) {
			if (!getFn.trimFn(val)) {
				return '请输入船舶所属单位!';
			}
		},
		unitName: function(val) {
			if (!getFn.trimFn(val)) {
				return '请输入单位联系人,多个以,分开!';
			} else {
				var str = val.trim();
				var arr = val.split(",");
				for (var i = 0; i < arr.length; i++) {
					var item = arr[i];
					if (!getFn.user(item)) {
						return '请输入正确联系人姓名!';
					}
				};
			}
		},
		companyMobile: function(val) {
			if (!getFn.trimFn(val)) {
				return '请输入联系方式,多个以,分开!';
			} else {
				var str = val.trim();
				var arr = val.split(",");
				for (var i = 0; i < arr.length; i++) {
					var item = arr[i];
					if (!getFn.mobile(item) && !getFn.phone(item)) {
						return '请输入正确的联系方式!';
					}
				};
			}
		},
		tonnage: function(val) {
			if (!getFn.trimFn(val)) {
				return '请输入船舶吨位!';
			}
		},
		tonnage: function(val) {
			if (!getFn.trimFn(val)) {
				return '请输入船舶吨位!';
			}
		},
		boatNormalDepth: function(val) {
			if (!getFn.trimFn(val)) {
				return '请输入正常吃水深度!';
			}
		},
		boatFullDepth: function(val) {
			if (!getFn.trimFn(val)) {
				return '请输入满载吃水深度!';
			}
		}
	});



	window.collFn = function() {
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.close(index);
	};
	e("shipAdd", {})
});
