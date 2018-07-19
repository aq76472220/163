//pc
function setCookieID(sid){
	$.cookie(window['cookieName'],sid,{path:'/',expires:10});
	return true;
}
function catSuccess(){
	if(window['loadCat']===0){
		return false;
	}else{
		setTimeout(function(){catSuccess()},300);
	}
}
function getHouseCatJSON(styleid,sid,vueName,callback){//styleid  对应两个接口
	var url='';
	if(styleid === '0'){
		url = '/api/HouseCategory/SearchHouseCategory';
		$.ajax({'url':url,dataType:'json',data:{'Category':sid,'timer':Math.random()},success:function(data){
			callback&&callback.call(this,data[sid],vueName);
		}});
	}else{
		url = '/api/Category/SearchCategory';
		$.ajax({'url':url,dataType:'json',data:{'Category':sid,'timer':Math.random()},success:function(data){
			callback&&callback.call(this,data[sid],vueName);
		}});
	}
}
function getHouseCat(arr1,arr2){
	window['loadCat'] = arguments.length;
	catSuccess&&catSuccess.call(this);//全部加载成功后回调函数
	var url_arr1='',url1='',url_arr2='',url2='';
	if(typeof arr1 !== 'undefined'){
		url1 = '/api/HouseCategory/SearchHouseCategory';
		$.ajax({url:url1,dataType:'json',data:{'Category':arr1.join(','),'timer':Math.random()},success:function(data){
			var key,i,txt='',fortxtid='';
			for(key in data){
				txt='';
				switch(key){
					case '1':
					fortxtid='pricerange';
					break;
					case '2':
					fortxtid='pricerange';
					break;
					case '3':
					fortxtid='pricerange';
					break;
					case '4':
					fortxtid='arearange';
					break;
					case '5':
					fortxtid='roomrange';
					break;
					default:
					fortxtid='';
				}
				
				for(i=0;i<data[key].length;i++){
					txt+='<a href="#" id="s_'+fortxtid+'_'+data[key][i]['Categoryid']+'" onclick="return filterClick(this,{'+fortxtid+':\''+data[key][i]['Categoryid']+'\'},\'s_txt_'+fortxtid+'\',\''+data[key][i]['Chrcategory']+'\');">'+data[key][i]['Chrcategory']+'</a>';
				}
				$('#cat_'+key).html($('#cat_'+key).html()+txt);
			}
			window['loadCat']--;
			
		}});
	}
	if(typeof arr2 !== 'undefined'){
		url2 = '/api/Category/SearchCategory';
		$.ajax({url:url2,dataType:'json',data:{'Category':arr2.join(','),'timer':Math.random()},success:function(data){
			var key,i,txt='',fortxtid='',fortxtid2='',entitys,entitys_len=0;
			for(key in data){
				txt='';
				switch(key){
					case '0':
						fortxtid='region';
						fortxtid2='section';
						txt+='<li><a href="#" onclick="return filterClick(this,{'+fortxtid+':\'-1\','+fortxtid2+':\'-1\'},\'s_txt_'+fortxtid+'\',\'位置\');" id="s_'+fortxtid+'_-1" data-isall="1">不限</a></li>';
						for(i=0;i<data[key].length;i++){
							txt+='<li categoryid="'+data[key][i]['Categoryid']+'"><a href="#" id="s_'+fortxtid+'_'+data[key][i]['Categoryid']+'" class="item" data-ajax="1">'+data[key][i]['Chrcategory']+'</a>';
							entitys_len = data[key][i]['Entities'].length;
							if(entitys_len===0){
								txt+='</li>';
							}else{
								txt+='<ul class="display0"><li><a onclick="return filterClick(this,{'+fortxtid+':\''+data[key][i]['Categoryid']+'\','+fortxtid2+':\'-1\'},\'s_txt_'+fortxtid+'\',\''+data[key][i]['Chrcategory']+'\');" id="s_'+fortxtid2+'_'+data[key][i]['Categoryid']+'" href="#" data-double="1">不限</a></li>';
								for(entitys=0;entitys<entitys_len;entitys++){
									txt+='<li><a href="#" id="s_'+fortxtid2+'_'+data[key][i]['Entities'][entitys]['Categoryid']+'" onclick="return filterClick(this,{'+fortxtid+':\''+data[key][i]['Categoryid']+'\','+fortxtid2+':\''+data[key][i]['Entities'][entitys]['Categoryid']+'\'},\'s_txt_'+fortxtid+'\',\''+data[key][i]['Entities'][entitys]['Chrcategory']+'\');" data-double="1">'+data[key][i]['Entities'][entitys]['Chrcategory']+'</a></li>';
								}
								txt+='</ul></li>';
							}
						}
						$('#cat_'+key).html($('#cat_'+key).html()+txt);
					break;
					case '23':
						fortxtid='shoptype';
					break;
					case '27':
						fortxtid='businesstype';
					break;
					case '14':
						fortxtid='decoratetype';
					break;
					default:
					fortxtid='';
				}
				if(key !== '0'){
					for(i=0;i<data[key].length;i++){
						txt+='<a href="#" id="s_'+fortxtid+'_'+data[key][i]['Categoryid']+'" onclick="return filterClick(this,{'+fortxtid+':\''+data[key][i]['Categoryid']+'\'},\'s_txt_'+fortxtid+'\',\''+data[key][i]['Chrcategory']+'\');">'+data[key][i]['Chrcategory']+'</a>';
					}
					$('#cat_'+key).html($('#cat_'+key).html()+txt);
				}
			}
			window['loadCat']--;
		}});
	}
}

//分页工厂函数
function getHousePcPage(){
	this.TotalPage = 0;
	this.TotalRecord = 0;
	if(typeof this.init !== 'undefined'){
		this.init.apply(this,arguments);
	}
}
getHousePcPage.prototype = {
	ifFixedFilter2:false,
	ifLoadding:false,
	ifNoMore:false,
	displayedItems: [],
	CurrentPage:1,
	TotalPage: 0,
	TotalRecord:0,
	getNext:function(){
		var that = this;
		window['keyvalues'].pageid = parseInt(window['keyvalues'].pageid)+1
		that.CurrentPage = parseInt(window['keyvalues'].pageid);
		that.getData();
	},
	getNewData:function(){
		var that = this;
		$('#housePcPageList').empty();
		that.ifNoMore = false;
		that.getData();
	},
	shouwei:function(){
		var that = this;
		var view_more = $('#view_more'),no_more = $('#no_more'),loadding = $('#loadding');
		
		if(!!that.ifNoMore){
			view_more.hide();
			no_more.show();
		}else{
			view_more.show();
			no_more.hide();
		}
		if(!that.ifLoadding){
			loadding.hide();
		}
	},
	kaitou:function(){
		var that = this;
		var view_more = $('#view_more'),no_more = $('#no_more'),loadding = $('#loadding');
		view_more.hide();
		no_more.hide();
		if(!!that.ifLoadding){
			loadding.show();
		}
	},
	getData: function (callback) {
		var that = this;
		that.CurrentPage = parseInt(window['keyvalues'].pageid);
		that.ifLoadding = true;
		that.kaitou();
		$.get(window['apiurl'],window['keyvalues'],function(res){
			var Data = res.Data;
			that.TotalPage = parseInt(res.TotalPage)
			that.TotalRecord = parseInt(res.TotalRecord);
			that.ifLoadding = false;
			(that.TotalPage===0) && (that.ifNoMore = true);
			(that.TotalPage===that.CurrentPage || that.TotalPage<that.CurrentPage) && (that.ifNoMore = true);
			setTimeout(function(){that.shouwei();},50);
			var len = Data.length,i=0;
			if(len===0) return;
			for(var i=0;i<len;i++){
				if(!!Data[i].Price&&Data[i].Price===0){
					Data[i].Price = '面议';
					Data[i].Price_y = '0';
				}
				if(!!Data[i].TopDate){
					var idate = new Date(Data[i].TopDate);
					Data[i].TopDate = formatTime(idate);
				}
				if(typeof Data[i].DealType !== 'undefined'){
					switch(Data[i].DealType){
						case 1:
						  Data[i].danwei = '元/月';
						  break;
						default:
						  Data[i].danwei = '万';
					}
				}
				if(typeof Data[i].HouseType !== 'undefined'){
					switch(Data[i].HouseType){
						case 0:
						  Data[i].ahref = '/house/shouloudetail_'+Data[i].Id;
						  break;
						case 1:
						  Data[i].ahref = '/house/chuzhudetail_'+Data[i].Id;
						  break;
						case 2:
						  Data[i].ahref = '/house/shangpudetail_'+Data[i].Id;
						  break;
						default:
						  Data[i].ahref = '#';
					}
					if(Data[i].Price===0){
						Data[i].Price='面议';
						Data[i].danwei='';
					}
				
				}
				if(!Data[i].Filepath || Data[i].Filepath==''){
					Data[i].Filepath = window['Default_tplPath']+'images/notfindimg_house.png';
				}
					
				
				$('#housePcPageList').append(Mustache.to_html(window['TPL'], Data[i]));
			}
		});
	},
	init:function(){
		var that = this;
		that.getData();
		$('#view_more').click(function(e){
			e.preventDefault();
			that.getNext();
		});
	}
}
function submitSearch(){
	filterClick(this,{keywords:encodeURIComponent($('#s_keyword').val())},'','');
	return false;
}
function filterClick(o,obj,txt_id,name){
	window['keyvalues'] = $.extend(window['keyvalues'],obj,{"pageid":"1"});
	mylist.getNewData();
	if(typeof txt_id === 'undefined')return;
	var t_o = $('#'+$(o).attr('id'));
	t_o.parent().find('.on').removeClass('on');
	t_o.addClass('on');
	
	return false;
}