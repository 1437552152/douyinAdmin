$(function(){
	
	   $(window).scroll(function(){
// 滚动条距离顶部的距离 大于300px时
        if($(window).scrollTop() >= 700){
            $("#myScrollspy").fadeIn(1000); // 开始淡入
        } else{
            $("#myScrollspy").stop(true,true).fadeOut(1000); // 如果小于等于 300 淡出
        }
    });
      
      $("#toparrow").click(function(){
        $("html,body").animate({scrollTop:"0px"},'slow');
    });
    
	
})

