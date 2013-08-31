        $(function(){
var names=["复仇之魂","众神之王","魅惑魔女","变体精灵","水晶室女","流浪剑客","娜伽海妖","撼地神牛","隐形刺客","秀豆魔导师","熊德","剑圣","月之骑士","矮人火枪手","巨魔战将","暗影萨满","钢背兽","熊猫酒仙","半人马酋长","赏金猎人","龙骑士","敌法师","黑暗游侠","全能骑士","沉默术士","树精卫士","谜团","光之守卫","熊战士","食人魔法师","修补匠","幻影长毛手","先知","山岭巨人","哥布林工程师","圣骑士","兽王","双头龙","练金术士","白虎","蛇法女妖","暗夜魔王","骷髅王","末日使者","地穴刺客","鱼人守卫","痛苦女王","骷髅射手","虚空假面","冥界亚龙","复仇电魂","食尸鬼","灵魂守卫","受折磨的灵魂","巫妖","死亡先知","恶魔巫师","剧毒术士","半人猛犸","死灵飞龙混沌骑士","狼人","育母蜘蛛","幻影刺客","遗忘法师","潮汐猎人","痛苦之源","死灵法师","屠夫","裂魂人","地穴编织者","影魔","沙王","斧王","血魔","地狱领主","幽鬼","巫医","黑耀石毁灭者","术士","地卜师","暗影牧师","蝙蝠骑士","牛头人酋长"]
var host="http://localhost";
var pageNow = 1;
            var iosocket = io.connect('http://localhost:8180');
            iosocket.on('connect', function () {

                //init
                $(".send:eq(0)").show();
                $(".send:eq(1)").hide();


                iosocket.emit('count',1);
                if(!$.cookie('user')||!$.cookie('name')||!$.cookie("pic")){
                    var id = parseInt((+new Date())*Math.random());
                    $.cookie('name',names[id%names.length],{expires:30});
                    $.cookie('user',id,{expires:30});
                    $.cookie('pic',id%30+".jpg",{expires:30});
                    iosocket.emit('add',navigator.userAgent);
                }

                $('#count span').html($.cookie('name')+'，')

                iosocket.on('count',function(i){
                    $('#count strong').html(i);
                });
                iosocket.on('topage',function(i){
                    toPage(parseInt(i));
                });

                //chat
                iosocket.on('chat', function(m) {
                    $('#chat').append($('<li><img src="http://localhost/img/'+m.p+'" width="50px" /></li>').append($('<span></span>').text(m.n+':'+m.m))).scrollTop(99999999999);
                });
                $('#send').keypress(function(event) {
                    if(event.which == 13) {
                        event.preventDefault();
                        chat(iosocket);
                    }
                });
                $('#send_button').click(function(){
                    chat(iosocket);
                });

                //gass
                iosocket.on('gass',function(msg){
                    new gass(msg);
                })
                //for root
                if(!$.cookie('pw'))return;
                $(window).keypress(function(event){
                    if(event.which == 37||event.which == 32){
                        //next
                        iosocket.emit('topage',{pw:$.cookie('pw'),i:pageNow+1});
                    }else if(event.which == 39||event.which == 98){
                        //pre
                        iosocket.emit('topage',{pw:$.cookie('pw'),i:pageNow-1})
                    }
                })
            });
var init = {
    1:null,
    2:null,
    3:initPage3,
    4:initPage4
}

function initPage4(){
    if(!$.cookie('pw'))return;
    iosocket.emit('gass',{pw:$.cookie('pw')});
}
function initPage3(){
$("#page3").html('hello');
}
function toPage (index) {
    if(index>7){
        return;
    }else if(index < 1){
        return;
    }
    pageNow = index;
    $(".page").each(function(i,v){
            if(i<index || i<2){
                $(this).css({"visibility":"visible"});
            }else{
                $(this).css({"visibility":"hidden"});
            }
    });
    var p = $("#page"+index);
    var s=p.offset().left;
    $('body').scrollLeft(s-($(window).width()-p.outerWidth())/2);
    init[index]&&init[index]();
}
function gass (op) {
    function ceart(op){
        var a = op.string.split("");
        var h = '<img src="'+op.img+'" /><ul class="in">';
        for (var i = op.size - 1; i >= 0; i--) {
            h+='<li></li>'
        };
        h+='</ul><table>';
        for (var i = a.length - 1; i >= 0; i--) {
            if(i%5==4){
                h+='<tr>';
            }
            h+='<td>'+a[i]+'</td>';
            if(i%5==0){
                h+='</tr>';
            }

        };
        h+='</table>';
        return h;
    }
    if(op.img&&op.size){
        $('#page4').html(ceart(op));
    }
}


function chat (iosocket) {
                        $('#send').val()&&iosocket.emit('chat',{m:$('#send').val(),n:$.cookie('name'),p:$.cookie('pic'),u:$.cookie('user')});
                        $('#send').val('');
}

        });