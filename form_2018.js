//pc
function get_point(){
	var search_txt = document.getElementById('search_txt');
	if(search_txt.value === '' || !search_txt.value){alert('请输入搜索关键字'); return false;}
	var myGeo = new BMap.Geocoder();
	myGeo.getPoint(search_txt.value, function(point){
	  if (point) {
		window['bz_map'].removeOverlay(window['bz_marker']);
		window['bz_marker'] = new BMap.Marker(point);
		window['bz_map'].centerAndZoom(point, 15);
		window['bz_x'] = point.lng;
		window['bz_y'] = point.lat;
		window['bz_map'].addOverlay(window['bz_marker']);
	  }else{
		 alert('没有找到相关地址！');
	  }
	}, window['CITY'] );
}
function translateCallback(ggpoint){
	if(window['latitude']==0||window['longitude']==0){
		window['bz_map'].centerAndZoom(window['CITY'] ,15);
	}else{
		window['bz_marker'] = new BMap.Marker(ggpoint);
		window['bz_map'].centerAndZoom(ggpoint, 15);
		window['bz_map'].addOverlay(window['bz_marker']);
		window['bz_x'] = ggpoint.lng;
		window['bz_y'] = ggpoint.lat;
	}
}
function bz_cancel(){
	document.getElementById("map_iframe").style.display='none';
}
function bz_ok(){
	if(window['bz_x'] === 0 || window['bz_y'] === 0){
		alert('请在地图上找到您要的位置单击地图进行标注！');
		return false;
	}
	mypage.Shop_x = window['bz_x'];
	mypage.Shop_y = window['bz_y'];
	bz_cancel();
}
function biaozhu_2018(){
	
	var map_iframe = $('#map_iframe');
	if(map_iframe.attr('data-isloaded')==='1'){
		map_iframe.show();
		return false;
	}
	if(window['CITY'] === '') window['CITY'] = '北京';
	window['bz_x'] = mypage.Shop_x;
	window['bz_y'] = mypage.Shop_y;
	window['bz_map'] = new BMap.Map("allmap");
	window['bz_map'].addControl(new BMap.NavigationControl());
	
	window['latitude']=mypage.Shop_x;
	window['longitude']=mypage.Shop_y;
	window['point']=new BMap.Point(window['latitude'],window['longitude'])
	
	translateCallback(window['point']);
	
	window['bz_map'].addEventListener("click",function(e){
		var point2 = new BMap.Point(e.point.lng, e.point.lat);
		window['bz_map'].removeOverlay(window['bz_marker']);
		window['bz_marker'] = new BMap.Marker(point2);
		window['bz_map'].addOverlay(window['bz_marker']);
		window['bz_x'] = e.point.lng;
		window['bz_y'] = e.point.lat;
	});
	window['bz_map'].enableScrollWheelZoom();
	window['bz_map'].enableContinuousZoom();
	window['bz_map'].addControl(new BMap.NavigationControl());
	window['bz_map'].addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT, type: BMAP_NAVIGATION_CONTROL_PAN}));
	map_iframe.attr('data-isloaded','1').show();
	return false;
}
$.fn.loadForm = function(url,callbefore,callback,datajson){
	var myForm = $(this),submit_btn = myForm.find('button[type="submit"]');
	myForm.submit(function() {
		if(!!callbefore){
			var result = callbefore.call(this,myForm);
			if(!result){
				return false;
			}
		}
		submit_btn.addClass('disabled').prop('disabled',true);
		var contentType = 'application/x-www-form-urlencoded';
		var idata = myForm.serializeArray();
		if(typeof datajson !=='undefined'){
			idata = JSON.stringify(datajson);
			contentType = 'application/json';
		}
		$.ajax({type:'POST',url:url,data:idata,dataType:'json',contentType:contentType,success:function(data){
			submit_btn.removeClass('disabled').prop('disabled',false);
			if(data.iserror===1){
				MSGwindowShow('house','0','提交失败了哦！','','');
				return false;
			}
			callback&&callback.call(this,myForm,data);
		},error:function(){
			MSGwindowShow('house','0','提交失败了哦！','','');
			submit_btn.removeClass('disabled').prop('disabled',false);
		}});
		return false;
	});
}
//区域选择初始化函数  非vue
function setQuyuSel(data){
	var i=0,k=0,len=data.length,txt='',Quyuid = $('#Quyuid'),Diduanid = $('#Diduanid');
	for(;i<len;i++){
		txt='<option value="'+data[i].Categoryid+'">'+data[i].Chrcategory+'</option>';
		Quyuid.append(txt);
	}
	if(window['Curcatdata'][0]!==''){
		Quyuid.val(window['Curcatdata'][0]);
		setTimeout(function(){Quyuid.trigger('change');},50);
		setTimeout(function(){Diduanid.val(window['Curcatdata'][1]);},50);
	}
	Quyuid.bind('change',function(){
		var val = $(this).val();
		Diduanid.empty();
		txt='<option value="">请选择地段</option>';
		for(i=0;i<len;i++){
			if(parseInt(val)===data[i].Categoryid){
				for(k=0;k<data[i].Entities.length;k++){
					txt+='<option value="'+data[i].Entities[k].Categoryid+'">'+data[i].Entities[k].Chrcategory+'</option>';
				}
				Diduanid.html(txt);
				break;
			}
		}
	});
}
function setQuyuSel_vue(data,vueName){
	var i=0,len = data.length,obj = {};
	for(;i<len;i++){
		obj = {}
		obj.Categoryid = data[i].Categoryid;
		obj.Chrcategory = data[i].Chrcategory;
		obj.Entities = data[i].Entities;
		mypage[vueName+'List'].push(obj);
		if(vueName ==='Quyuid'){
			if(mypage.Quyuid!=='' && mypage.Quyuid!==0){
				if(data[i].Categoryid === mypage.Quyuid){
					mypage['DiduanidList'] = data[i].Entities;
					setTimeout(function(){
						for(var k=0;k<mypage['DiduanidList'].length;k++){
							if(mypage['Diduanid'] ===mypage['DiduanidList'][k].Categoryid){
								mypage['DiduanidName'] = mypage['DiduanidList'][k].Chrcategory;
								break;
							}
						}
					},10);
				}
			}
		}else{
			if(mypage[vueName]==='0'){
				mypage[vueName+'Name'] = data[0].Chrcategory;
				mypage[vueName] = data[0].Categoryid;
			}
		}
		if(data[i].Categoryid == mypage[vueName]){mypage[vueName+'Name'] = data[i].Chrcategory}
	}
	return;
}
var Item_select = {//全部select插件
	props: ['tag','forid','fortxt','fotaction','is2','is2name'],
	methods: {
		sel_select:function(data,forid,fortxt,fotaction,is2){
			this.$parent[forid] = data.Categoryid;
			this.$parent[fortxt] = data.Chrcategory;
			this.$parent[fotaction] = false;
			if(is2!==''){
				this.$parent[is2+'List'] = data.Entities;
				this.$parent[is2+'Name'] = '请选择';
			}
		}
	},
	template: '<a href="#" @click.prevent.self="sel_select(tag,forid,fortxt,fotaction,is2)">{{tag.Chrcategory}}</a>'
};
var Item_s = {//小区搜索插件
	props: ['tag'],
	methods: {
		sel_xiaoqu:function(sid,data){
			this.$parent.Loupanid = sid;
			this.$parent.XiaoquName = data.Chrloupan;
			this.$parent.Quyuid = data.Quyuid;
			this.$parent.Diduanid = data.Diduanid;
			this.$parent.Chraddress = data.Chraddress;
			this.$parent.Shop_x = data.X;
			this.$parent.Shop_y = data.Y;
			this.$parent.Shop_z = data.Z;
			this.$parent.isXiaoquNameTip = false;
			this.$parent.xiaoquList.splice(0,this.$parent.xiaoquList.length);
			return false;
		}
	},
	template: '<a href="#" @click.prevent.self="sel_xiaoqu(tag.Loupanid,tag)">{{tag.Chrloupan}}<em>{{tag.QuyuName}}</em></a>'
	
};
var Item_tag = {
	props: ['tag','index','forname'],
	methods: {
		sel_checked:function(checked,index,forname){
			Vue.set(this.$parent[forname+'List'][index], 'checked', !checked);
		}
	},
	template: '<label class="lab2" :class="tag.checked?\'on\':\'\'" @click.prevent.self="sel_checked(tag.checked,index,forname)"><input type="checkbox" v-model="tag.checked" class="checkone" :name="forname" :value="tag.Categoryid" />{{tag.Chrcategory}}</label>'
};
var Item_tese = {
	props: ['tag','index','forname','Ccid'],
	methods: {
		sel_checked:function(checked,index,forname){
			Vue.set(this.$parent[forname+'List'][index], 'checked', !checked);
		}
	},
	template: '<label class="lab2" v-if="(tag.Styleid==29) || (tag.Styleid==31) || (tag.Styleid==25 && Ccid==1) || (tag.Styleid==24 && Ccid==0) || (tag.Styleid==26 && Ccid==2)" :class="tag.checked?\'on\':\'\'" @click.prevent.self="sel_checked(tag.checked,index,forname)"><input type="checkbox" v-model="tag.checked" class="checkone" :name="forname" :value="tag.Categoryid" />{{tag.Chrcategory}}</label>'
};