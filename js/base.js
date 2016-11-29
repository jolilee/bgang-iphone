var page = {
	Loading:{
		show:function(){

			$('#loading').show();
		},
		hide:function(){
			$('#loading').hide();
		}
	},
	ajax:function(url,callback){

		var me = this;

		$.ajax({
			url : url,
			dataType : "jsonp",
			type : "GET",
			jsonp : "callback",
			success : function(data) {
				
				console.log(data);
				callback(data);
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {

				console.log(XMLHttpRequest,textStatus,errorThrown);
				alert('error');
			}
		});
	},
	init:function(){

		setInterval(function(){

			if(window.scrollY > 200){

				$('#toTop').show();

			}else{

				$('#toTop').hide();
			}

		},1000);

		var me = this;
		
		me.Token = "hYB1pLI26n9lyWJI-N7qk5tPPCHagQ8SSY5SowQvonw";

		$.ajax({
			url : 'http://baogang.dpsapi.com/service/user/token',
			dataType : "json",
			type : "post",
			success : function(data) {
				
				me.Token = data.token;
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
			}
		});

	},
	switchPage:function(page,param){

		var me = this;

		me.Loading.show();

		$('.page').hide();

		if(page == 'Home'){

			me.initIndexPage();

			$('.home-area').show();

		}else if(page == 'Classify'){

			me.initClassifyPage(param);

			$('#classify').show();

		}else if(page == 'Detail'){

			me.initDetailPage(param);

			$('#detailpage').show();
		}
	},

	dataState:{
		'Home':2
	},
	Data:{
		'HomeClassify':null,
		'HomeSlider':null
	},
	bxSlider:null,
	initIndexPage:function(){

		var me = this;

		var state = 0;

		//初始化首页slider
		if(me.Data.HomeSlider){

			me.buildIndexPageSlider(me.Data.HomeSlider);

		}else{

			me.ajax('http://baogang.dpsapi.com/api/slideshow?type_1=xin_wen',function(list){

				me.Data.HomeSlider = list;

				me.buildIndexPageSlider(list);

				me.dataState.Home --;

				if(me.dataState.Home == 0){

					me.Loading.hide();
				}
			});
		}
		
		if(me.Data.HomeClassify){

			me.buildIndexPageClassify(me.Data.HomeClassify);

		}else{

			me.ajax('http://baogang.dpsapi.com/api/home',function(list){

				me.Data.HomeClassify = list;

				me.buildIndexPageClassify(list);

				me.dataState.Home --;

				if(me.dataState.Home == 0){

					me.Loading.hide();
				}
			});
		}
		
		if(me.Data.HomeSlider && me.Data.HomeClassify){

			me.Loading.hide();
		}
	},
	buildIndexPageSlider:function(list){

		var me = this, html = [];

		for(var i=0;i<list.length;i++){
			
			html.push('<li><img title="'+list[i].title+'" src="'+list[i]['图片']+'" /></li>');
		}

		$('#homeslider').html(html.join(''));
		
		if(me.bxSlider){

			me.bxSlider.destroySlider();
		}

		me.bxSlider = $('#homeslider').bxSlider({
			'controls':false,
			'pager':false,
			'captions':true
		});

		me.bxSlider.startAuto();
	},

	classNameList:{
		'xin_wen' : '新闻 News',
		'guang_jiao' : '广角 Wide Angle',
		'sheng_huo' : '生活 Life',
		'gu_shi' : '故事 Story',
		'liao_ba':'聊吧 Talking',
		'ye_jie':'业界 Industry'
	},

	buildIndexPageClassify:function(list){

		var me = this, html = '', tpl = $('#home_classify').html();

		var classlist = me.classNameList;

        var tempArr=[];

        var addPicImg = function(num){
            var picHtml='';
            var picHtml= num>0 ? "<img src='images/newspicioc.png' width='22' height='16' />":""
            return picHtml;
        };
        var addVideoImg = function(n){
            var videoHtml='';
            var videoHtml= n>0 ? "<img src='images/newsvideoioc.png' width='22' height='16' />":""
            return videoHtml;
        };

        var getIndex = function(type){
            var index=0;
            switch (type){
                case 'xin_wen':
                    index = 0;
                    break;
                case 'guang_jiao':
                    index = 1;
                    break;
                case 'gu_shi':
                    index = 2;
                    break;
                case 'ye_jie':
                    index = 3;
                    break;
                case 'sheng_huo':
                    index = 4;
                    break;
                case 'liao_ba':
                    index = 5;
                    break;
            }
            return index;
        };
			console.log(list);
		for(var i=0;i<list.length;i++){
			
			list[i]['icoImg'] = 'ico_'+list[i]['type_name']+'.jpg';

            list[i].havePicture=addPicImg(list[i].havePicture);

            list[i].haveVideo=addVideoImg(list[i].haveVideo);

			list[i]['className'] = classlist[list[i]['type_name']];

            tempArr[getIndex(list[i].type_name)]= Mustache.render(tpl, list[i]);
		}
		
		$('.home-body').html(tempArr.join(''));
	},


	initClassifyPage:function(typename){

		var me = this;

		me.cLassifyPage = 0;

		$("getMore").show();

		me.ajax('http://baogang.dpsapi.com/api/slideshow?type_1='+typename,function(list){

			me.buildClassifyPageSlider(list);

			me.Loading.hide();
		});

		$('#classifyTitle').html(me.classNameList[typename]);

		me.getClassifyPageData(typename,null);

		me.initClassifyPageChildTitle(typename);
	},

	initClassifyPageChildTitle:function(typename){
		var childs = {
			'xin_wen' : [
				{'title':'要闻','code':0},
				{'title':'基层','code':1}
			],
			'sheng_huo' : [
				{'title':'读书','code':0},
				{'title':'旅游','code':1},
				{'title':'文艺','code':2},
				{'title':'养生','code':3}
			],
			'liao_ba':[
				{'title':'话题','code':0},
				{'title':'调查','code':1}
			],
			'ye_jie':[
				{'title':'钢铁','code':0},
				{'title':'上下游','code':1}
			]
		}

		if(childs[typename]){

			var html = [],child;

			for(var i in childs[typename]){

				child = childs[typename][i];

				html.push('<li onclick="page.getClassifyPageData(\''+typename+'\','+child['code']+',this)">'+child['title']+'</li>');
			}

			$('#ChildClassify').html(html.join(''));

			$('.top-tabs').show();
		}else{

			$('.top-tabs').hide();
		}
	},
	buildClassifyPageSlider:function(list){

		var me = this, html = [];
		
		for(var i=0;i<list.length;i++){
			
			html.push('<li><img title="'+list[i].title+'" src="'+list[i]['图片']+'" /></li>');
		}

		$('#classifyslider').html(html.join('')).show();

		if(me.bxSlider){
			
			me.bxSlider.destroySlider();
		}

		me.bxSlider = $('#classifyslider').bxSlider({
			'controls':false,
			'pager':false,
			'captions':true
		});

		me.bxSlider.startAuto();
	},
	getClassifyPageData:function(typename,childtype,dom){

		var me = this, url = 'http://baogang.dpsapi.com/api/list?type='+typename+'&page='+me.cLassifyPage;

		me.ClassifyPage = {
			'tname' : typename,
			'ctype' : childtype||null
		};

		if(childtype != null){

			url = url + '&field_' + typename + '_class2_value=' + childtype;

			$('#ChildClassify li').removeClass('on');

			if(dom){

				$(dom).addClass('on');
			}
		}

		me.ajax(url,function(list){

			var me = this, html = '', tpl = $('#classify_item').html();

			var change = function(str){
                var y='',m='',d='',time='',space='',timeBody='';
                var xArr=new Array();
                var xArr=str.split('');
                y = xArr[6] + xArr[7] + xArr[8] + xArr[9];
                m = xArr[0] + xArr[1];
                d = xArr[3] + xArr[4];
                time = xArr[13] + xArr[14] + xArr[15] + xArr[16] + xArr[17];
                space = xArr[10] + xArr[11] + xArr[12];
                timeBody=y + '.' + m + '.' + d + space + time;
                return timeBody;
            };

            var addPicImg = function(num){
                var picHtml='';
                var picHtml= num>0 ? "<img src='images/newspicioc.png' width='22' height='16' />":""
                return picHtml;
            };
            var addVideoImg = function(num){
                var videoHtml='';
                var videoHtml= num>0 ? "<img src='images/newsvideoioc.png' width='22' height='16' />":""
                return videoHtml;
            };

			for(var i=0;i<list.length;i++){

                list[i].havePicture=addPicImg(list[i].havePicture);

                list[i].haveVideo=addVideoImg(list[i].haveVideo);

                list[i].time=change(list[i].time);

				html += Mustache.render(tpl, list[i]);
			}
			
			$('#ClassifyContent').html(html);


		});
	},
	getMoreClassify:function(){

		var me = this;

		me.cLassifyPage++;

		var url = 'http://baogang.dpsapi.com/api/list?type='+me.ClassifyPage.tname+'&page='+me.cLassifyPage;

		if(me.ClassifyPage.ctype != null){

			url = url + '&field_' + me.ClassifyPage.tname + '_class2_value=' + me.ClassifyPage.ctype;
		}

		me.ajax(url,function(list){

			if(list.length<=0){

				$("getMore").hide();

				return;
			}

			var me = this, html = '', tpl = $('#classify_item').html();
			
			for(var i=0;i<list.length;i++){

				html += Mustache.render(tpl, list[i]);
			}
			
			$('#ClassifyContent').append(html);
		});
	},
	initDetailPage:function(nid){

		var me = this;

		me.curNid = nid;

		me.ajax('http://baogang.dpsapi.com/api/node/'+nid,function(list){

			if(list.length>0){

				me.updateDetailPage(list[0]);

			}else{

				alert('文章不存在');
			}
			
			me.Loading.hide();
		});

		me.getCommentList(nid);
	},

	updateDetailPage:function(data) {

        $('#title_1').html(data.title);

        $('#title_2').html(data.title2);
        var date = '', y = '', m = '', d = '', time = '', space = '';
        dateArr = new Array();
        dateArr = data.time.split('');
        y = dateArr[6] + dateArr[7] + dateArr[8] + dateArr[9];
        m = dateArr[0] + dateArr[1];
        d = dateArr[3] + dateArr[4];
        time = dateArr[13] + dateArr[14] + dateArr[15] + dateArr[16] + dateArr[17];
        space = dateArr[10] + dateArr[11] + dateArr[12];

        $('#news_time').html('宝钢新闻中心：' + y + '.' + m + '.' + d + space + time);

        var imgs = eval('(' + data['images'] + ')'), imghtml = '';



        for (var i = 0; i < imgs.length; i++) {
            imghtml += '<li><img src="' + imgs[i]['preview'] + ' "  title="'+data.title+'" /></li>';
        }


        $('#imgPanel').html(imghtml);
        $('.dialog_content').html(imghtml);

        var videos = eval('(' + data['video'] + ')'), videohtml = '';

        for (var i = 0; i < videos.length; i++) {

            videohtml += '<video class="news-detail-video"  controls="controls" -webkit-playsinline="true" preload="metadata" src="' + videos[i].origina + '" poster=""></video>'
        }

        $('#videoPanel').html(videohtml);

        $('#newDetailPanel').html(data.body);

        $('#likeNum').html(data.like);

        $('#commentNum').html('评论:' + data.commentCount);

        $('#detailPanel').addClass(data.css);

        $('#extendCss').html(data.extendCss);



        $('#imgPanel img').click(function() {

            var j=$('#imgPanel img').index($(this));
            $('#dialog_box').show();

//解绑定方法   $("").unbind('click');

            $('.dialog_content').bxSlider({
                controls:false,
                captions:true,
                infiniteLoop:false,
                pager:false,
                pagerType:'short',
                pagerLocation:'bottom',
                adaptiveHeight:true,
                startSlide:j,
                onSliderLoad:function(){
                    var y = $(window).height() ;
                    $('.bx-viewport').css('height',y+'px');
                }
            });
            var k='', q='',r='',imgHeights='';
            q=$(window).height();
            imgHeights=$('.dialog_content li img').length;
            for (var i = 0; i < imgHeights; i++) {
                r =$('.dialog_content li img').eq(i).height();
                k = (q - r) / 2;
                $('.dialog_content li img').eq(i).css('margin-top',k+'px');
            }
        });

        $(window).bind( 'orientationchange', function(e){
            if (window.orientation == 90 || window.orientation == -90) {
                //iphone横屏

                var z=$(window).height() - 30;
                $('.bx-wrapper img').css({'margin-top':'0','max-height':z+'px'});

                var k='', q='',r='',imgHeights='';
                q=$(window).width();
                imgHeights=$('.dialog_content li img').length;
                for (var i = 0; i < imgHeights; i++) {
                    r =$('.dialog_content li img').eq(i).width();
                    k = (q - r) / 2;
                    $('.dialog_content li img').eq(i).css('margin-left',k+'px');

                }

            }
            else if (window.orientation == 0 || window.orientation == 180) {
                //iphone竖屏
                $('.dialog_content li img').css('margin-left','0');


            }
        });

        $('.dialog_content li img').click(function(){
            $('#dialog_box').hide();
        });


    },


	getCommentList:function(nid){

		var me = this;

		me.curNid = nid;

		me.ajax('http://baogang.dpsapi.com/api/comment/'+nid,function(list){

			var me = this, html = '', tpl = $('#comment_item').html();
			
			for(var i=0;i<list.length;i++){

				html += Mustache.render(tpl, list[i]);
			}
			
			$('#commentList').html(html);
		});
	},
	comment:function(){

		if($('#commentBox').val()==''){

			alert('请输入评论内容！');

			return;
		}

		var me = this;

		var comment = {
	        nid:me.curNid,
	        comment_body:{
	            "und":[{'value':$('#commentBox').val()}]
	        }
	    };


	    var options = {
		    type:"post",
		    url:"http://baogang.dpsapi.com/service/comment.json",
		    data:comment,
		    dataType: 'json',
		    headers: {'X-CSRF-Token':me.Token},
		    success: function(data) {
		    	alert('评论成功！');
		    }
	    }

	    $.ajax(options);
	},

	like:function(){

		var me = this;

		var vote_data = {votes:{
            entity_type:'node',
            entity_id:me.curNid,
            value_type:'points',
            value:1,
            tag:'plus1_node_vote'
        }};

	    var options = {
		    type:"post",
		    url:"http://baogang.dpsapi.com/service/votingapi/set_votes",
		    data:vote_data,
		    dataType: 'json',
		    headers: {'X-CSRF-Token':me.Token},
		    success: function(data) {

		    	var num = parseInt($('#likeNum').html(),10);

		    	$('#likeNum').html(num+1);
		    }
	    }

	    $.ajax(options);
	},

	backToHomePage:function(){

		location.href = 'zhuye.html';
	},
	backToClassifyPage:function(){

		var me = this;

		if(me.ClassifyPage && me.ClassifyPage.tname){

			page.switchPage('Classify',me.ClassifyPage.tname);
			
		}else{

			me.backToHomePage();
		}
	}
}