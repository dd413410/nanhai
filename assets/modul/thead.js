layui.define(function(exports) {
	function thead(name, add, tabWidth) {
		var cols = {
			// 首页
			home: [{
					field: 'boatTime',
					title: '日期',
					minWidth: 150
				},
				{
					field: 'boatTws',
					title: '风向(°)',
					minWidth: 100,
				},
				{
					field: 'boatTwd',
					title: '风速(m/s)',
					minWidth: 100
				},
				{
					field: 'boatAt',
					title: '气温(℃)',
					minWidth: 100
				},
				{
					field: 'boatHu',
					title: '湿度(℃)',
					minWidth: 100
				},
				{
					field: 'boatBp',
					title: '气压(hPa)',
					minWidth: 100
				},
				{
					field: 'boatWt',
					title: '水温(℃)',
					minWidth: 100
				},
				{
					field: 'boatWpt',
					title: '皮温(℃)',
					minWidth: 100
				},
				{
					field: 'boatSl',
					title: '盐度(‰)',
					minWidth: 100
				}
			],
			//用户权限
			user: [{
					fixed: 'left',
					field: 'userName',
					title: '用户名',
					minWidth: 100
				},
				{
					field: 'realName',
					title: '联系人',
					width: 100,
					minWidth: 100,
				},
				// {
				// 	field: 'gender',
				// 	title: '性别',
				// 	width: 80,
				// 	minWidth: 80
				// },
				{
					title: '用户权限',
					width: 110,
					minWidth: 110,
					templet: function(item) {
						return item.userLevel == 0 ? "普通用户" : "管理员";
					}
				},
				{
					field: 'unit',
					title: '单位名称',
					minWidth: 150
				},
				{
					field: 'mobile',
					title: '手机号码',
					minWidth: 150
				},
				{
					field: 'creatTime',
					title: '创建时间',
					minWidth: 210
				},
				{
					title: '审核状态',
					minWidth: 120,
					templet: function(item) {
						var html = item.isPass == 0 ? '<span style="color:#FFB203;">待审核 </span>' :
							item.isPass == 1 ? '<span style="color: #018377;">审核通过</span>' :
							'<span style="color: #f00;">审核拒绝</span>';
						return html;
					}
				},
				{
					field: 'remarks',
					title: '备注',
					minWidth: 120
				},
				{
					fixed: 'right',
					minWidth: 400,
					align: "center",
					title: '操作',
					toolbar: '#toolbar'
				}
			],
			// 志愿船信息管理>>合并
			ships: [{
					field: 'boatName',
					title: '船舶名称',
					fixed: 'left',
					minWidth: 180
				},
				{
					field: 'boatId',
					title: '船舶呼号',
					minWidth: 180
				},
				{
					field: 'boatContact',
					title: '船舶联系人(可多个)',
					minWidth: 180
				},
				{
					field: 'boatMobile',
					title: '船舶联系电话(可多个)',
					minWidth: 220
				},
				{
					field: 'ofUnit',
					title: '所属单位',
					minWidth: 180
				},
				{
					field: 'unitName',
					title: '单位联系人(可多个)',
					minWidth: 180
				},
				{
					field: 'companyMobile',
					title: '单位联系电话(可多个)',
					minWidth: 220
				},
				{
					field: 'fixTime',
					title: '入列时间',
					minWidth: 180
				},
				{
					field: 'frequency',
					title: '数据发送频次',
					minWidth: 180
				},
				{
					field: 'tonnage',
					title: '船舶吨位',
					minWidth: 120
				},
				{
					field: 'boatNormalDepth',
					title: '船舶正常吃水深度(m)',
					minWidth: 180
				},
				{
					field: 'boatFullDepth',
					title: '船舶满载吃水深度(m)',
					minWidth: 180
				},
				{
					field: 'boatDesc',
					title: '船舶用途描述',
					minWidth: 180
				},
				{
					fixed: 'right',
					field: 'right',
					minWidth: 300,
					align: "center",
					title: '操作',
					toolbar: '#toolbar'
				}
			],
			// 志愿船信息管理>>基本信息管理
			ship: [{
					field: 'boatName',
					title: '志愿船名称',
					fixed: 'left',
					minWidth: 180
				},
				{
					field: 'boatId',
					title: '志愿船舶呼号',
					minWidth: 180
				},
				{
					field: 'ofUnit',
					title: '船舶所属单位',
					minWidth: 180
				},
				{
					field: 'unitName',
					title: '单位(个人)名称',
					minWidth: 180
				},
				{
					field: 'boatContact',
					title: '船舶联系人(可多个)',
					minWidth: 180
				},
				{
					field: 'boatMobile',
					title: '船舶联系电话(可多个)',
					minWidth: 180
				},
				{
					field: 'companyMobile',
					title: '船舶公司联系电话(可多个)',
					minWidth: 180
				},
				{
					field: 'tonnage',
					title: '船舶吨位',
					minWidth: 120
				},
				{
					field: 'boatDesc',
					title: '船舶用途描述',
					minWidth: 180
				},
				{
					field: 'boatNormalDepth',
					title: '船舶正常吃水深度',
					minWidth: 180
				},
				{
					field: 'boatFullDepth',
					title: '船舶满载吃水深度',
					minWidth: 180
				},
				{
					fixed: 'right',
					field: 'right',
					minWidth: 260,
					align: "center",
					title: '操作',
					toolbar: '#toolbar'
				}
			],

			// 志愿船信息管理>>综合信息管理
			shipComp: [{
					field: 'boatName',
					title: '志愿船名称',
					fixed: 'left',
					minWidth: 180
				},
				{
					field: 'boatId',
					title: '志愿船舶呼号',
					minWidth: 180
				},
				{
					field: 'ofUnit',
					title: '船舶所属单位',
					minWidth: 180
				},
				{
					field: 'unitName',
					title: '单位(个人)名称',
					minWidth: 180
				},
				{
					field: 'boatContact',
					title: '船舶联系人(可多个)',
					minWidth: 180
				},
				{
					field: 'boatMobile',
					title: '船舶联系电话(可多个)',
					minWidth: 180
				},
				{
					field: 'companyMobile',
					title: '船舶公司联系电话(可多个)',
					minWidth: 180
				},
				{
					field: 'tonnage',
					title: '船舶吨位',
					minWidth: 120
				},
				{
					field: 'boatDesc',
					title: '船舶用途描述',
					minWidth: 180
				},
				{
					field: 'boatNormalDepth',
					title: '船舶正常吃水深度',
					minWidth: 180
				},
				{
					field: 'boatFullDepth',
					title: '船舶满载吃水深度',
					minWidth: 180
				},
				{
					fixed: 'right',
					field: 'right',
					minWidth: 260,
					align: "center",
					title: '操作',
					toolbar: '#toolbar'
				}
			],
			// 志愿船维护管理>>>设备加改装记录整体查询
			plus: [{
					field: 'boatName',
					title: '志愿船名称',
					fixed: 'left',
					minWidth: 180
				},
				{
					field: 'boatId',
					title: '船舶呼号',
					minWidth: 180
				},
				{
					field: 'fixTime',
					title: '加改装时间',
					minWidth: 180
				},
				{
					field: 'installAddress',
					title: '加改装地点',
					minWidth: 120
				},
				{
					field: 'boatContact',
					title: '船舶联系人',
					minWidth: 180
				},
				{
					field: 'boatMobile',
					title: '电话',
					minWidth: 180
				},
				{
					field: 'ofUnit',
					title: '船舶公司名称',
					minWidth: 200
				},
				{
					field: 'boatCompanyContact',
					title: '船舶公司联系人',
					minWidth: 160
				},
				{
					field: 'boatNormalDepth',
					title: '正常吃水深度',
					minWidth: 180
				},
				{
					field: 'boatFullDepth',
					title: '满载吃水深度',
					minWidth: 180
				},
				{
					title: '状态',
					minWidth: 180,
					templet: function(item) {
						var html = '';
						var val = item.isPass;
						switch (val) {
							case 0:
								html = '<span style="color:#ffde00;">待审核</span>';
								break;
							case 1:
								html = '<span style="color:#33CC00;">审核通过</span>';
								break;
							default:
								html = '<span style="color:#f00;">审核拒绝</span>';
								break;
						};
						return html;
					}
				},
				{
					fixed: 'right',
					minWidth: 380,
					align: "center",
					title: '操作',
					toolbar: '#toolbar'
				}
			],
			// 志愿船维护管理>>>设备维修维护记录
			repair: [{
					field: 'boatName',
					title: '志愿船名称',
					fixed: 'left',
					minWidth: 180
				},
				{
					field: 'boatId',
					title: '船舶呼号',
					minWidth: 180
				},
				{
					field: 'repTime',
					title: '维修维护时间',
					minWidth: 180
				},
				{
					field: 'repAddress',
					title: '维修维护地址',
					minWidth: 180
				},
				{
					field: 'boatContact',
					title: '船舶联系人',
					minWidth: 180
				},
				{
					field: 'boatMobile',
					title: '电话',
					minWidth: 180
				},
				{
					field: 'ofUnit',
					title: '船舶公司名称',
					minWidth: 200
				},
				{
					field: 'boatCompanyContact',
					title: '船舶公司联系人',
					minWidth: 180
				},
				{
					field: 'boatNormalDepth',
					title: '正常吃水深度',
					minWidth: 180
				},
				{
					field: 'boatFullDepth',
					title: '满载吃水深度',
					minWidth: 180
				},
				{
					title: '状态',
					minWidth: 180,
					templet: function(item) {
						var html = '';
						var val = item.isPass;
						switch (val) {
							case 0:
								html = '<span style="color:#ffde00;">待审核</span>';
								break;
							case 1:
								html = '<span style="color:#33CC00;">审核通过</span>';
								break;
							default:
								html = '<span style="color:#f00;">审核拒绝</span>';
								break;
						};
						return html;
					}
				},
				{
					fixed: 'right',
					minWidth: 380,
					align: "center",
					title: '操作',
					toolbar: '#toolbar'
				}
			],
			//统计分析>>数据统计分析
			anal: [{
					field: 'boatName',
					title: '船舶名称(呼号)',
					fixed: 'left',
					totalRowText: '合计'
				},
				{
					field: 'timeInterval',
					title: '统计起止时间',
					totalRow: true
				},
				{
					field: 'frequency',
					title: '数据发送频次',
					totalRow: true
				},
				{
					field: 'arrivalRate',
					title: '数据接收率',
					totalRow: true
				},
				{
					field: 'goodNum',
					title: '良好数据数量',
					totalRow: true
				},
				{
					field: 'goodRate',
					title: '数据良好率',
					totalRow: true
				}
			],

			// 仪器设备管理
			inst: [{
					fixed: 'left',
					field: 'instrumentNum',
					title: '序号',
					minWidth: 120
				},
				{
					fixed: 'left',
					field: 'instrumentName',
					title: '仪器名称',
					minWidth: 120
				},
				{
					field: 'instrumentNumber',
					title: '内部编号',
					minWidth: 120
				},
				{
					field: 'instrumentType',
					title: '仪器类别',
					minWidth: 180
				},
				{
					field: 'instrumentType',
					title: '仪器型号',
					minWidth: 180
				},
				{
					field: 'instrumentStatus',
					title: '仪器状态',
					minWidth: 120,
					templet: function(item) {
						var html = '';
						var val = item.instrumentStatus;
						switch (val) {
							case 1:
								html = "在用";
								break;
							case 2:
								html = '<span style="color:#33CC00;">备用备件</span>';
								break;
							case 3:
								html = '<span style="color:#f00;">损坏</span>';
								break;
							default:
								html = '<span style="color:#ffde00;">维修</span>';
								break;
						};
						return html;
					}
				},
				{
					field: 'purchaseTime',
					title: '采购时间',
					minWidth: 180
				},
				{
					field: 'price',
					title: '价格',
					minWidth: 120
				},
				{
					field: 'IdentificationTime',
					title: '鉴定/校准时间',
					minWidth: 180
				},
				{
					fixed: 'right',
					field: 'right',
					minWidth: 630,
					align: "center",
					title: '操作',
					toolbar: '#toolbar'
				}
			],
			//观测数据管理
			datamag: [{
					field: 'boatName',
					title: '船舶名称',
					fixed: 'left',
					minWidth: 180
				},
				{
					field: 'boatId',
					title: '船舶呼号',
					minWidth: 120,
				},
				// {
				// 	field: 'ofUnit',
				// 	title: '所属单位',
				// 	minWidth: 220
				// },
				{
					field: 'boatTime',
					title: '观测时间',
					minWidth: 220,
				},
				{
					field: 'boatLog',
					title: '经度',
					minWidth: 120,
				},
				{
					field: 'boatLat',
					title: '纬度',
					minWidth: 120,
				},
				{
					field: 'navWay',
					title: '航向(°)',
					minWidth: 120,
				},
				{
					field: 'navSpeed',
					title: '航速(节)',
					minWidth: 120,
				},
				{
					field: 'boatTwd',
					title: '风向(°)',
					minWidth: 120,
				},
				{
					field: 'boatAws',
					title: '风速(m/s)',
					minWidth: 120,
				},
				{
					field: 'boatAt',
					title: '气温(℃)',
					minWidth: 120,
				},

				{
					field: 'boatHu',
					title: '湿度(℃)',
					minWidth: 120,
				},

				{
					field: 'boatBp',
					title: '气压(hPa)',
					minWidth: 120,
				},

				{
					field: 'boatWpt',
					title: '皮温(℃)',
					minWidth: 120,
				},
				{
					field: 'boatSl',
					title: '盐度(‰)',
					minWidth: 120,
				},
				{
					field: 'state',
					title: '状态',
					minWidth: 120,
				},
				// {
				// 	field: 'remarks',
				// 	title: '问题备注',
				// 	minWidth: 120,
				// },
				// {
				// 	field: 'desc',
				// 	title: '指派部门',
				// 	minWidth: 120,
				// },
				// {
				// 	fixed: 'right',
				// 	minWidth: 220,
				// 	align: "center",
				// 	title: '操作',
				// 	toolbar: '#barDemo'
				// }
			],
			//日志管理
			log: [{
					fixed: 'left',
					field: 'userName',
					title: '用户名',
					width: 120,
					minWidth: 120
				},
				{
					field: 'modular',
					title: '操作模块',
					width: 220,
					minWidth: 220
				},
				{
					field: 'content',
					title: '内容'
				},
				{
					field: 'ip',
					title: 'IP',
					width: 180,
					minWidth: 180
				},
				{
					field: 'makeTime',
					title: '操作日期',
					width: 180,
					minWidth: 180
				},
			]
		};
		var tabWidth = tabWidth || 180;
		var is = sessionStorage.userType;
		is == 0 ? cols[name].splice(-1) : "";
		add && is == 0 ? cols[name].push({
			fixed: 'right',
			minWidth: tabWidth,
			align: "center",
			title: '操作',
			toolbar: '#toolbars'
		}) : "";
		return cols[name];
	};
	exports('thead', thead)
});
