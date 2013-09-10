function resize() {
    $(".page").width($(window).width());
    $("body").width($(window).width() * ($(".page").length + 1));
}
$(window).resize(function() {
    resize();
});
resize();
$(function() {
    console.log('大神，别黑我电脑');
    var names = ["复仇之魂", "众神之王", "魅惑魔女", "变体精灵", "水晶室女", "流浪剑客", "娜伽海妖", "撼地神牛", "隐形刺客", "秀豆魔导师", "熊德", "剑圣", "月之骑士", "矮人火枪手", "巨魔战将", "暗影萨满", "钢背兽", "熊猫酒仙", "半人马酋长", "赏金猎人", "龙骑士", "敌法师", "黑暗游侠", "全能骑士", "沉默术士", "树精卫士", "谜团", "光之守卫", "熊战士", "食人魔法师", "修补匠", "幻影长毛手", "先知", "山岭巨人", "哥布林工程师", "圣骑士", "兽王", "双头龙", "练金术士", "白虎", "蛇法女妖", "暗夜魔王", "骷髅王", "末日使者", "地穴刺客", "鱼人守卫", "痛苦女王", "骷髅射手", "虚空假面", "冥界亚龙", "复仇电魂", "食尸鬼", "灵魂守卫", "受折磨的灵魂", "巫妖", "死亡先知", "恶魔巫师", "剧毒术士", "半人猛犸", "死灵飞龙混沌骑士", "狼人", "育母蜘蛛", "幻影刺客", "遗忘法师", "潮汐猎人", "痛苦之源", "死灵法师", "屠夫", "裂魂人", "地穴编织者", "影魔", "沙王", "斧王", "血魔", "地狱领主", "幽鬼", "巫医", "黑耀石毁灭者", "术士", "地卜师", "暗影牧师", "蝙蝠骑士", "牛头人酋长"]
    var host = "http://img.zhiqingchen.dev.anjuke.com";
    var pageNow = 1;
    var iosocket = io.connect('http://s.zhiqingchen.dev.anjuke.com:8180');
    iosocket.on('connect', function() {

        //init
        $(".send:eq(0)").show();
        // if(!$.cookie('pw')){$(".send:eq(0)").show();}
        $(".send:eq(1)").hide();


        iosocket.emit('count', 1);
        if (!$.cookie('user') || !$.cookie('name') || !$.cookie("pic")) {
            var id = parseInt((+new Date()) * Math.random());
            $.cookie('name', names[id % names.length], {
                expires: 1
            });
            $.cookie('user', id, {
                expires: 1
            });
            $.cookie('pic', id % 30 + ".jpg", {
                expires: 1
            });
            iosocket.emit('add', {
                ua : navigator.userAgent,
                size : $(window).width()+'x'+$(window).height()
            });
        }

        $('#count span').html($.cookie('name') + '，')

        iosocket.on('count', function(i) {
            $('#count strong').html(i);
        });
        iosocket.on('topage', function(i) {
            toPage(parseInt(i));
        });

        //chat
        iosocket.on('chat', function(m) {
            $('#chat').append($('<li><img src="' + host + '/img/' + m.p + '" width="50px" /></li>').append($('<span></span>').text(m.n + ':' + m.m))).scrollTop(99999999999);
        });
        $('#send').keypress(function(event) {
            if (event.which == 13) {
                event.preventDefault();
                chat(iosocket);
            }
        });
        $('#send_button').click(function() {
            chat(iosocket);
        });

        //gass
        iosocket.on('gass', function(msg) {
            new gass(msg);
        });
        //check
        iosocket.on('check', function(msg) {
            var index = msg.index+4;
            if (msg.status) {
                $("#page"+index+" div").html("恭喜你，答对了...");
                $("#page"+index+" td").off('click');
            } else {
                $("#page"+index+" div").html("sorry，答错了...");
            }
        });
        //graph
        iosocket.on('graph', function(msg) {
            new graph(msg);
        })
        iosocket.on('size', function(msg) {
            new size(msg);
        })
        //for root
        if (!$.cookie('pw')) return;
        //prize
        iosocket.on('prize', function(msg) {
            var index = msg.index+4;
            if ($("#page"+index+" .big-slide").length) {
                $("#page"+index+" .big-slide").html($("#page"+index+" .big-slide").html() + "<br/>恭喜，<strong>" + msg.name + "</strong>&nbsp;:&nbsp;" + msg.time + "ms")
            } else {
                $("#page"+index+"").html("<div class='big-slide'><br/><br/>恭喜，<strong>" + msg.name + "</strong>&nbsp;:&nbsp;" + msg.time + "ms</div>");
            }
        });
        $(window).keypress(function(event) {
            if (event.which == 37 || event.which == 32) {
                //next
                iosocket.emit('topage', {
                    pw: $.cookie('pw'),
                    i: pageNow + 1
                });
            } else if (event.which == 39 || event.which == 98) {
                //pre
                iosocket.emit('topage', {
                    pw: $.cookie('pw'),
                    i: pageNow - 1
                })
            }
        })
    });
    var init = {
        1: null,
        2: null,
        3: initPage3,
        4: initPage4,
        5: initPage5,
        6: initPage6,
        10:initPage10,
        11:initPage11,
        14:initPage14,
        15:initPage15
    };
    function initPage15(){
        init['15'] = null;
        $('iframe').attr('src',$('iframe').attr('data-src'));
    }
    function initPage14(){
        init['14'] = null;
        drawSpider();
    }
    function initPage4() {
        if (!$.cookie('pw')) return;
        iosocket.emit('gass', {
            pw: $.cookie('pw'),
            index:0
        });
    }

    function initPage3() {
        init['3'] = null;
    }

    function initPage6() {
        if (!$.cookie('pw')) return;
        iosocket.emit('gass', {
            pw: $.cookie('pw'),
            index:2
        });
    }
    function initPage10(){
        if (!$.cookie('pw')) return;
        iosocket.emit('graph', {
            pw: $.cookie('pw')
        });
    }
    function initPage11(){
        if (!$.cookie('pw')) return;
        iosocket.emit('size', {
            pw: $.cookie('pw')
        });
    }
    function initPage5(){
        if (!$.cookie('pw')) return;
        iosocket.emit('gass', {
            pw: $.cookie('pw'),
            index:1
        });
    }

    function toPage(index) {
        if (index > 20) {
            return;
        } else if (index < 1) {
            return;
        }
        pageNow = index;
        $(".page").each(function(i, v) {
            if (i < index || i < 2) {
                $(this).css({
                    "visibility": "visible"
                });
            }
        });
        var p = $("#page" + index);
        var s = p.offset().left;
        if($.cookie('stop')&&index>2)return;
        $('body').animate({scrollLeft: s - ($(window).width() - p.outerWidth()) / 2 },500 , function(){
            init[index] && init[index]();
        });
    }

    function gass(op) {
        function ceart(op) {
            var a = op.string.split("");
            var h = '<img src="' + op.img + '" /><ul class="in">';
            for (var i = op.size - 1; i >= 0; i--) {
                h += '<li></li>'
            };
            h += '</ul><div>加油，小伙伴</div><table>';
            for (var i = a.length - 1; i >= 0; i--) {
                if (i % 5 == 4) {
                    h += '<tr>';
                }
                h += '<td>' + a[i] + '</td>';
                if (i % 5 == 0) {
                    h += '</tr>';
                }

            };
            h += '</table>';
            return h;
        }
        var index = op.index+4;
        function bindEvent() {
            $('#page'+index+' li').click(function() {
                $("#page"+index+" .active").removeClass("active");
                $(this).addClass("active").html("");
            });
            $("#page"+index+" td").click(function() {
                $("#page"+index+" .active").html($(this).text());
                if ($("#page"+index+" .active").next('li').length) {
                    activeLi($("#page"+index+" .active").next('li'));
                }
                check();
            })
        }

        function check() {
            var s = "";
            $("#page"+index+" li").each(function() {
                s += $(this).text();
            });
            if (s.length == op.size) {
                iosocket.emit('check', {
                    str: s,
                    name: $.cookie('name')
                });
            }
        }

        function activeLi(ele) {
            $("#page"+index+" .active").removeClass("active");
            ele.addClass("active");
        }
        if (op.img && op.size) {
            $("#page"+index).html(ceart(op));
            activeLi($("#page"+index+" li:eq(0)"));
            bindEvent();
        }
    }
    function size(msg){
        var data = [];
        for (var i in msg) {
            data.push([i, msg[i]]);
        }
        $('#chart2').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: 'screen size'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [{
                type: 'pie',
                name: 'screen size',
                data: data
            }]
        });
    }
    function graph(msg) {
        var data = [];
        for (var i in msg) {
            data.push([i, msg[i]]);
        }
        $('#chart').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: 'Browser used'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [{
                type: 'pie',
                name: 'Browser share',
                data: data
            }]
        });
    }

    function chat(iosocket) {
        $('#send').val() && iosocket.emit('chat', {
            m: $('#send').val(),
            n: $.cookie('name'),
            p: $.cookie('pic'),
            u: $.cookie('user')
        });
        $('#send').val('');
    }
    VerletJS.prototype.spider = function(origin) {
        var i;
        var legSeg1Stiffness = 0.99;
        var legSeg2Stiffness = 0.99;
        var legSeg3Stiffness = 0.99;
        var legSeg4Stiffness = 0.99;
        
        var joint1Stiffness = 1;
        var joint2Stiffness = 0.4;
        var joint3Stiffness = 0.9;
        
        var bodyStiffness = 1;
        var bodyJointStiffness = 1;
        
        var composite = new this.Composite();
        composite.legs = [];
        
        
        composite.thorax = new Particle(origin);
        composite.head = new Particle(origin.add(new Vec2(0,-5)));
        composite.abdomen = new Particle(origin.add(new Vec2(0,10)));
        
        composite.particles.push(composite.thorax);
        composite.particles.push(composite.head);
        composite.particles.push(composite.abdomen);
        
        composite.constraints.push(new DistanceConstraint(composite.head, composite.thorax, bodyStiffness));
        
        
        composite.constraints.push(new DistanceConstraint(composite.abdomen, composite.thorax, bodyStiffness));
        composite.constraints.push(new AngleConstraint(composite.abdomen, composite.thorax, composite.head, 0.4));
        
        
        // legs
        for (i=0;i<4;++i) {
            composite.particles.push(new Particle(composite.particles[0].pos.add(new Vec2(3,(i-1.5)*3))));
            composite.particles.push(new Particle(composite.particles[0].pos.add(new Vec2(-3,(i-1.5)*3))));
            
            var len = composite.particles.length;
            
            composite.constraints.push(new DistanceConstraint(composite.particles[len-2], composite.thorax, legSeg1Stiffness));
            composite.constraints.push(new DistanceConstraint(composite.particles[len-1], composite.thorax, legSeg1Stiffness));
            
            
            var lenCoef = 1;
            if (i == 1 || i == 2)
                lenCoef = 0.7;
            else if (i == 3)
                lenCoef = 0.9;
            
            composite.particles.push(new Particle(composite.particles[len-2].pos.add((new Vec2(20,(i-1.5)*30)).normal().mutableScale(20*lenCoef))));
            composite.particles.push(new Particle(composite.particles[len-1].pos.add((new Vec2(-20,(i-1.5)*30)).normal().mutableScale(20*lenCoef))));
            
            len = composite.particles.length;
            composite.constraints.push(new DistanceConstraint(composite.particles[len-4], composite.particles[len-2], legSeg2Stiffness));
            composite.constraints.push(new DistanceConstraint(composite.particles[len-3], composite.particles[len-1], legSeg2Stiffness));
            
            composite.particles.push(new Particle(composite.particles[len-2].pos.add((new Vec2(20,(i-1.5)*50)).normal().mutableScale(20*lenCoef))));
            composite.particles.push(new Particle(composite.particles[len-1].pos.add((new Vec2(-20,(i-1.5)*50)).normal().mutableScale(20*lenCoef))));
            
            len = composite.particles.length;
            composite.constraints.push(new DistanceConstraint(composite.particles[len-4], composite.particles[len-2], legSeg3Stiffness));
            composite.constraints.push(new DistanceConstraint(composite.particles[len-3], composite.particles[len-1], legSeg3Stiffness));
            
            
            var rightFoot = new Particle(composite.particles[len-2].pos.add((new Vec2(20,(i-1.5)*100)).normal().mutableScale(12*lenCoef)));
            var leftFoot = new Particle(composite.particles[len-1].pos.add((new Vec2(-20,(i-1.5)*100)).normal().mutableScale(12*lenCoef)))
            composite.particles.push(rightFoot);
            composite.particles.push(leftFoot);
            
            composite.legs.push(rightFoot);
            composite.legs.push(leftFoot);
            
            len = composite.particles.length;
            composite.constraints.push(new DistanceConstraint(composite.particles[len-4], composite.particles[len-2], legSeg4Stiffness));
            composite.constraints.push(new DistanceConstraint(composite.particles[len-3], composite.particles[len-1], legSeg4Stiffness));
            
            
            composite.constraints.push(new AngleConstraint(composite.particles[len-6], composite.particles[len-4], composite.particles[len-2], joint3Stiffness));
            composite.constraints.push(new AngleConstraint(composite.particles[len-6+1], composite.particles[len-4+1], composite.particles[len-2+1], joint3Stiffness));
            
            composite.constraints.push(new AngleConstraint(composite.particles[len-8], composite.particles[len-6], composite.particles[len-4], joint2Stiffness));
            composite.constraints.push(new AngleConstraint(composite.particles[len-8+1], composite.particles[len-6+1], composite.particles[len-4+1], joint2Stiffness));
            
            composite.constraints.push(new AngleConstraint(composite.particles[0], composite.particles[len-8], composite.particles[len-6], joint1Stiffness));
            composite.constraints.push(new AngleConstraint(composite.particles[0], composite.particles[len-8+1], composite.particles[len-6+1], joint1Stiffness));
            
            composite.constraints.push(new AngleConstraint(composite.particles[1], composite.particles[0], composite.particles[len-8], bodyJointStiffness));
            composite.constraints.push(new AngleConstraint(composite.particles[1], composite.particles[0], composite.particles[len-8+1], bodyJointStiffness));
        }
        
        this.composites.push(composite);
        return composite;
    }
    
    VerletJS.prototype.spiderweb = function(origin, radius, segments, depth) {
        var stiffness = 0.6;
        var tensor = 0.3;
        var stride = (2*Math.PI)/segments;
        var n = segments*depth;
        var radiusStride = radius/n;
        var i, c;

        var composite = new this.Composite();

        // particles
        for (i=0;i<n;++i) {
            var theta = i*stride + Math.cos(i*0.4)*0.05 + Math.cos(i*0.05)*0.2;
            var shrinkingRadius = radius - radiusStride*i + Math.cos(i*0.1)*20;
            
            var offy = Math.cos(theta*2.1)*(radius/depth)*0.2;
            composite.particles.push(new Particle(new Vec2(origin.x + Math.cos(theta)*shrinkingRadius, origin.y + Math.sin(theta)*shrinkingRadius + offy)));
        }
        
        for (i=0;i<segments;i+=4)
            composite.pin(i);

        // constraints
        for (i=0;i<n-1;++i) {
            // neighbor
            composite.constraints.push(new DistanceConstraint(composite.particles[i], composite.particles[i+1], stiffness));
            
            // span rings
            var off = i + segments;
            if (off < n-1)
                composite.constraints.push(new DistanceConstraint(composite.particles[i], composite.particles[off], stiffness));
            else
                composite.constraints.push(new DistanceConstraint(composite.particles[i], composite.particles[n-1], stiffness));
        }
        
        
        composite.constraints.push(new DistanceConstraint(composite.particles[0], composite.particles[segments-1], stiffness));
        
        for (c in composite.constraints)
            composite.constraints[c].distance *= tensor;

        this.composites.push(composite);
        return composite;
    }
    
    //+ Jonas Raoni Soares Silva
    //@ http://jsfromhell.com/array/shuffle [v1.0]
    function shuffle(o) { //v1.0
        for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }
    
    VerletJS.prototype.crawl = function(leg) {
        
        var stepRadius = 100;
        var minStepRadius = 35;
        
        var spiderweb = this.composites[0];
        var spider = this.composites[1];
        
        var theta = spider.particles[0].pos.angle2(spider.particles[0].pos.add(new Vec2(1,0)), spider.particles[1].pos);

        var boundry1 = (new Vec2(Math.cos(theta), Math.sin(theta)));
        var boundry2 = (new Vec2(Math.cos(theta+Math.PI/2), Math.sin(theta+Math.PI/2)));
        
        
        var flag1 = leg < 4 ? 1 : -1;
        var flag2 = leg%2 == 0 ? 1 : 0;
        
        var paths = [];
        
        var i;
        for (i in spiderweb.particles) {
            if (
                spiderweb.particles[i].pos.sub(spider.particles[0].pos).dot(boundry1)*flag1 >= 0
                && spiderweb.particles[i].pos.sub(spider.particles[0].pos).dot(boundry2)*flag2 >= 0
            ) {
                var d2 = spiderweb.particles[i].pos.dist2(spider.particles[0].pos);
                
                if (!(d2 >= minStepRadius*minStepRadius && d2 <= stepRadius*stepRadius))
                    continue;

                var leftFoot = false;
                var j;
                for (j in spider.constraints) {
                    var k;
                    for (k=0;k<8;++k) {
                        if (
                            spider.constraints[j] instanceof DistanceConstraint
                            && spider.constraints[j].a == spider.legs[k]
                            && spider.constraints[j].b == spiderweb.particles[i])
                        {
                            leftFoot = true;
                        }
                    }
                }
                
                if (!leftFoot)
                    paths.push(spiderweb.particles[i]);
            }
        }
        
        for (i in spider.constraints) {
            if (spider.constraints[i] instanceof DistanceConstraint && spider.constraints[i].a == spider.legs[leg]) {
                spider.constraints.splice(i, 1);
                break;
            }
        }
        
        if (paths.length > 0) {
            shuffle(paths);
            spider.constraints.push(new DistanceConstraint(spider.legs[leg], paths[0], 1, 0));
        }
    }
    
    function drawSpider() {
        var p = $('#scratch').parent();
        $('#scratch').css({
            height: p.height(),
            width: p.width()
        });
        var canvas = document.getElementById("scratch");

        // canvas dimensions
        var width = parseInt(canvas.style.width);
        var height = parseInt(canvas.style.height);

        // retina
        var dpr = window.devicePixelRatio || 1;
        canvas.width = width*dpr;
        canvas.height = height*dpr;
        canvas.getContext("2d").scale(dpr, dpr);

        // simulation
        var sim = new VerletJS(width, height, canvas);
        
        // entities
        var spiderweb = sim.spiderweb(new Vec2(width/2,height/2), Math.min(width, height)/2, 20, 7);

        var spider = sim.spider(new Vec2(width/2,-300));    
        
        
        spiderweb.drawParticles = function(ctx, composite) {
            var i;
            for (i in composite.particles) {
                var point = composite.particles[i];
                ctx.beginPath();
                ctx.arc(point.pos.x, point.pos.y, 1.3, 0, 2*Math.PI);
                ctx.fillStyle = "#2dad8f";
                ctx.fill();
            }
        }
            
            
        spider.drawConstraints = function(ctx, composite) {
            var i;

            ctx.beginPath();
            ctx.arc(spider.head.pos.x, spider.head.pos.y, 4, 0, 2*Math.PI);
            ctx.fillStyle = "#000";
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(spider.thorax.pos.x, spider.thorax.pos.y, 4, 0, 2*Math.PI);
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(spider.abdomen.pos.x, spider.abdomen.pos.y, 8, 0, 2*Math.PI);
            ctx.fill();
            
            for (i=3;i<composite.constraints.length;++i) {
                var constraint = composite.constraints[i];
                if (constraint instanceof DistanceConstraint) {
                    ctx.beginPath();
                    ctx.moveTo(constraint.a.pos.x, constraint.a.pos.y);
                    ctx.lineTo(constraint.b.pos.x, constraint.b.pos.y);
                    
                    // draw legs
                    if (
                        (i >= 2 && i <= 4)
                        || (i >= (2*9)+1 && i <= (2*9)+2)
                        || (i >= (2*17)+1 && i <= (2*17)+2)
                        || (i >= (2*25)+1 && i <= (2*25)+2)
                    ) {
                        ctx.save();
                        constraint.draw(ctx);
                        ctx.strokeStyle = "#000";
                        ctx.lineWidth = 3;
                        ctx.stroke();
                        ctx.restore();
                    } else if (
                        (i >= 4 && i <= 6)
                        || (i >= (2*9)+3 && i <= (2*9)+4)
                        || (i >= (2*17)+3 && i <= (2*17)+4)
                        || (i >= (2*25)+3 && i <= (2*25)+4)
                    ) {
                        ctx.save();
                        constraint.draw(ctx);
                        ctx.strokeStyle = "#000";
                        ctx.lineWidth = 2;
                        ctx.stroke();
                        ctx.restore();
                    } else if (
                        (i >= 6 && i <= 8)
                        || (i >= (2*9)+5 && i <= (2*9)+6)
                        || (i >= (2*17)+5 && i <= (2*17)+6)
                        || (i >= (2*25)+5 && i <= (2*25)+6)
                    ) {
                        ctx.save();
                        ctx.strokeStyle = "#000";
                        ctx.lineWidth = 1.5;
                        ctx.stroke();
                        ctx.restore();
                    } else {
                        ctx.strokeStyle = "#000";
                        ctx.stroke();
                    }
                }
            }
        }
        
        spider.drawParticles = function(ctx, composite) {
        }
        
        // animation loop
        var legIndex = 0;
        var loop = function() {
            if (Math.floor(Math.random()*4) == 0) {
                sim.crawl(((legIndex++)*3)%8);
            }
            
            sim.frame(16);
            sim.draw();
            requestAnimFrame(loop);
        };

        loop();
    };
    
});