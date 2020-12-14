layui.define(function(exports) {
	var base = "http://120.25.155.2:8000"; //服务器地址,请求接口的地址
	var pathName = "/dist"; //项目目录名字,本地运行
	
	exports('urls', {
		base: base,
		pathName: pathName,
		login: base + "/UserInfo/login/",
		register: base + "/UserInfo/register/",
		unit: base + "/UserInfo/choose_unit/",
		// 上传接口
		upload: base + "/InstrumentInfo/image_info/",
		// 志愿船列表
		boatList: base + "/VolunteerBoatInfo/choose_boat/",
		elList: base + "/VolunteerBoatInfo/element_list/",
		shipDeta: base + "/VolunteerBoatInfo/boat_detail_info/",
		// 显示系统>>home.html
		searchBoat: base + "/VolunteerBoatInfo/search_boat_info/",
		getEl: base + "/VolunteerBoatInfo/get_element/",
		line: base + "/VolunteerBoatInfo/recent_data_curve/",
		aisInfo: base + "/VolunteerBoatInfo/boat_Ais_info/",
		meteInfo: base + "/VolunteerBoatInfo/boat_weather_info/",
		track: base + "/VolunteerBoatInfo/boat_track/",
		typhoon: base + "/VolunteerBoatInfo/typhoon_track/",
		buoy: base + "/VolunteerBoatInfo/buoy_list/",
		getTab: base + "/VolunteerBoatInfo/recent_observe_data/",
		getBuoy: base + "/VolunteerBoatInfo/boat_surface_list/",
		getBuoyTrak: base + "/VolunteerBoatInfo/boat_surface_track/",
		getSateImg: base + "/VolunteerBoatInfo/satellite_image/",
		// 运行监控>>>homes.html
		get: base + "/InstrumentInfo/instrument_operating_condition/",
		alarm: base + "/VolunteerBoatInfo/data_interrupt_alarm/",
		boatData: base + "/VolunteerBoatInfo/boat_data/",
		records: base + "/InstrumentInfo/instrument_fix_records/",
		shipList: base + "/VolunteerBoatInfo/search_boat/",
		// 综合监控>>>hom.html
		dataTotal: base + "/VolunteerBoatInfo/recevie_data_total/",
		totalData: base + "/VolunteerBoatInfo/recent_total_data/",
		runRate: base + "/InstrumentInfo/instrument_run_rate/",
		newData: base + "/VolunteerBoatInfo/new_observe_data/",
		totalBoat: base + "/VolunteerBoatInfo/recent_total_boat/",
		send: base + "/VolunteerBoatInfo/send_news/",

		// 后台管理
		// 用户信息
		userList: base + "/UserInfo/user_info/",
		userLists: base + "/UserInfo/user_list/",
		userDeta: base + "/UserInfo/userinfo_detail/",
		userChange: base + "/UserInfo/update_user/",
		userDelete: base + "/UserInfo/delete_user/",
		password: base + "/UserInfo/change_password/",
		approve: base + "/UserInfo/approve_user/",
		userDist: base + "/UserInfo/assign_permissions/",
		// 志愿船信息管理
		shipLists: base + "/VolunteerBoatInfo/show_boat_info/",
		shipAdd: base + "/VolunteerBoatInfo/add_boat_info/",
		shipChange: base + "/VolunteerBoatInfo/update_boat_info/",
		shipDelete: base + "/VolunteerBoatInfo/delete_boat_info/",
		shipExport: base + "/VolunteerBoatInfo/export_excel_boat/",
		shipPlus: base + "/InstrumentInfo/new_update_instrument/",
		shipRep: base + "/InstrumentInfo/new_maintain_instrument/",
		shipExportDeta: base + "/InstrumentInfo/export_excel_update_instrument_detail/",
		//志愿船维护管理>>加改装
		plusList: base + "/InstrumentInfo/inqure_all_instrument/",
		plusDeta: base + "/InstrumentInfo/retrofit_detail_info/",
		plusAdd: base + "/InstrumentInfo/add_instrument_record/",
		plusChange: base + "/InstrumentInfo/update_instrument_record/",
		plusDelete: base + "/InstrumentInfo/delete_instrument_record/",
		plusRove: base + "/InstrumentInfo/update_instrument_approve/",
		plusExport: base + "/InstrumentInfo/export_excel_update_instrument/",
		//志愿船维护管理>>维修维护
		repList: base + "/InstrumentInfo/maintain_instrument_list/",
		repDeta: base + "/InstrumentInfo/detail_maintain_instrument/",
		repAdd: base + "/InstrumentInfo/add_maintain_instrument/",
		repChange: base + "/InstrumentInfo/update_maintain_instrument/",
		repDelete: base + "/InstrumentInfo/delete_maintain_instrument/",
		repRove: base + "/InstrumentInfo/approve_maintain_instrument/",
		repExport: base + "/InstrumentInfo/export_excel_maintain_instrument/",
		// 统计分析
		analList: base + "/VolunteerBoatInfo/statistical_analysis_observe/",
		analExport: base + "/VolunteerBoatInfo/statistical_analysis_observe_export/",
		// 仪器设备管理
		instList: base + "/InstrumentInfo/instrument_info_list/",
		instDeta: base + "/InstrumentInfo/instrument_detail_info/",
		instAdd: base + "/InstrumentInfo/entry_instrument_info/",
		instChange: base + "/InstrumentInfo/update_instrument_info/",
		instDelete: base + "/InstrumentInfo/delete_instrument/",
		instTime: base + "/InstrumentInfo/fix_time_list/",
		instData: base + "/InstrumentInfo/test_time_list/",
		instExport: base + "/InstrumentInfo/export_excel_instrument/",
		// 观测信息
		dataList: base + "/VolunteerBoatInfo/show_observe_data/",
		dataExport: base + "/VolunteerBoatInfo/export_excel_obserbve/",
		// 日志管理
		logList: base + "/UserInfo/log_list/",

	});
});
