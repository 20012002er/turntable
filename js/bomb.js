var lottery={
    index:-1,    //当前转动到哪个位置，起点位置`
    count:0,    //总共有多少个位置
    timer:0,    //setTimeout的ID，用clearTimeout清除
    speed:20,    //初始转动速度
    times:0,    //转动次数
    cycle:50,    //转动基本次数：即至少需要转动多少次再进入抽奖环节
    prize:-1,    //中奖位置
    init:function(id){
        $("#"+id).find("td").removeAttr("unit-index");
        if ($("#"+id).find(".lottery-unit").length>0) {
            $lottery = $("#"+id);
            $units = $lottery.find(".lottery-unit");
            this.obj = $lottery;
            this.count = $units.length;
            $units.each(function(index) {
                $(this).attr("unit-index", index);
            });
            // $lottery.find(".lottery-unit-"+this.index).addClass("active");
        };
    },
    roll:function(){
        var index = this.index;
        var count = this.count;
        var lottery = this.obj;
        $(lottery).find(".lottery-unit").each(function() {
            var i = $(this).attr("unit-index");
            if (i == index) {
                $(this).removeClass("active");
            }
        });
        //$(lottery).find(".lottery-unit-"+index).removeClass("active");
        index += 1;
        if (index>count-1) {
            index = 0;
        };
        $(lottery).find(".lottery-unit").each(function() {
            var i = $(this).attr("unit-index");
            if (i == index) {
                $(this).addClass("active");
            }
        });
        //$(lottery).find(".lottery-unit-"+index).addClass("active");
        this.index=index;
        return false;
    },
    stop:function(index){
        this.prize=index;
        return false;
    }
};

var myAuto = document.getElementById('bgMusic');

function roll(){
    var index = 0;
    lottery.times += 1;
    lottery.roll();//转动过程调用的是lottery的roll方法，这里是第一次调用初始化
    if (lottery.times > lottery.cycle+10 && lottery.prize==lottery.index) {
        clearTimeout(lottery.timer);
        // alert(lottery.prize);
        myAuto.pause();
        lottery.prize=-1;
        lottery.times=0;
        click=false;
    }else{
        if (lottery.times<lottery.cycle) {
            lottery.speed -= 10;
        }else if(lottery.times==lottery.cycle) {
            index = Math.random()*(lottery.count)|0;
            lottery.prize = index;        
        }else{
            if (lottery.times > lottery.cycle+10 && ((lottery.prize==0 && lottery.index==7) || lottery.prize==lottery.index+1)) {
                lottery.speed += 110;
            }else{
                lottery.speed += 20;
            }
        }
        if (lottery.speed<40) {
            lottery.speed=40;
        };
        console.log(lottery.times+'^^^^^^'+lottery.speed+'^^^^^^^'+lottery.prize);
        lottery.timer = setTimeout(roll,lottery.speed);//循环调用
    }
    return false;
}

function stop() {
    clearTimeout(lottery.timer);
    lottery.prize=-1;
    lottery.times=0;
    click=false;
    return false;
}

var click=false;

window.onload=function(){
    lottery.init('lottery');
    
    $("#roll_btn").click(function(){
        if (click) {//click控制一次抽奖过程中不能重复点击抽奖按钮，后面的点击不响应
            return false;
        }else{
            myAuto.play();
            lottery.speed=100;
            roll();
            click=true; //一次抽奖完成后，设置click为true，可继续抽奖
            return false;
        }
    });
    $("#stop_btn").click(function() {
        stop();
        $("td").each(function() {
            if ($(this).hasClass("active")) {
                var $img_td = $(this);
                var img_src = $(this).children("img").attr("src");
                alertify.alert('Which dustbin does it belong to?', '<img src="' + img_src + '" style="height: 300px; width: 450px;"></img>', function() {
                    $img_td.removeClass();
                    $img_td.children().remove();
                    lottery.init('lottery');
                });
            }
        });
        myAuto.pause();
        click=false;
        return false;
    });
    $('#reset_btn').click(function() {
        window.location.reload();
    });
};