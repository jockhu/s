$(function(){
	var tags = [];
	function Tag(options,i,a){
		setTimeout(function(){
			var j = parseInt(Math.random()*a.length);
			var k = a.splice(j,1);
			var l = parseInt(($("#tags").width()-80)/200);
			var o = {
				bg : k,
				ic : parseInt(Math.random()*6)+1,
				ro : parseInt(Math.random()*50)-25,
				left : 90+(i%l)*parseInt(($("#tags").width()-80)/l),
				top : 75+ parseInt(i/l)*230
			},
			opt = $.extend(o,options),
			ele = creatEle();
			ele.appendTo($("#tags"));
			ele.addClass('fadeInUpBig animated');
			setTimeout(function(){
				ele.removeClass('fadeInUpBig animated');
			},2000);
			function creatEle(){
				var h = '<div class="animate" style="left:'+opt.left+'px;top:'+opt.top+'px;"><div class="tag tag'+opt.bg+'" style="-webkit-transform: rotate('+opt.ro+'deg);"><i class="i'+opt.ic+'"></i><em></em>';
				h+='<h3>'+opt.title+'</h3>';
				h+='<div class="des">'+opt.des+'</div>';
				h+='<div class="btn"><span></span>掺一脚</div></div></div>';
				return $(h);
			}
			function destory(){
				setTimeout(function(){
					ele.addClass('fadeOutDown animated');
					setTimeout(function(){
						ele.remove();
					},1000);
				},i*50);
			}
			tags.push({
				destory:destory
			})
		},i*300);
	}
	function Taglist(url){
		var a = [1,2,3,4,5,6,7,8,9,10];
		$.ajax({
			url:url,
			success:function(msg){

			}
		});
		var arr = [{
			title : "产品部海边出游",
			des : "7缺1就等你"
		},{
			title : "产品部海边出游",
			des : "7缺1就等你"
		},{
			title : "产品部海边出游",
			des : "7缺1就等你"
		},{
			title : "产品部海边出游",
			des : "7缺1就等你"
		},{
			title : "产品部海边出游",
			des : "7缺1就等你"
		},{
			title : "产品部海边出游",
			des : "7缺1就等你"
		},{
			title : "产品部海边出游",
			des : "7缺1就等你"
		},{
			title : "产品部海边出游",
			des : "7缺1就等你"
		},{
			title : "产品部海边出游",
			des : "7缺1就等你"
		},{
			title : "产品部海边出游",
			des : "7缺1就等你"
		}];
		arr.reverse();
		for (var i = arr.length - 1; i >= 0; i--) {
			new Tag(arr[i],i,a);
		};
	}
	function removeList(cb){
		for (var i = tags.length - 1; i >= 0; i--) {
			tags[i].destory();
		};
		tags = [];
		cb&&cb();
	}
	function init(){
		Taglist();
		$("nav li").click(function(){
			$("nav .active").removeClass("active");
			$(this).addClass("active");
			var url = $(this).attr("link");
			removeList(function(){
				Taglist(url);
			});
		});
		$("#in").click(function(){
			$(".da").show().addClass('swing animated');
			setTimeout(function(){
				$(".da").removeClass('swing animated');
			},2000);
		});
		$('#close').click(function(){
			$(".da").hide();
		});
		$("#add").click(function(){
			$.ajax({
				url:"?type=3&op=add_one",
				type:'POST',
				data: {
					'title' : $("#f_title").val(),
					'date' : $("#f_date").val(),
					'people' : $("#f_people").val(),
					'cate' : $("#f_cate").val(),
					'desc' : $("#f_desc").val()
				},
				success:function(){

				}
			})
		});
		$('.re').click(function(){
			$("nav .active").click();
		});
		$("#tags").on('click',".btn",function(){
			if($(this).hasClass("active")) return;
			$(this).addClass('active');
			$.get('http://www.aparty.com/?type=3&op=join_in&party_id=1');
		});
		$("#tags").on('click',"h3",function(){
			location.href = "";
		});
	}
	init();
});