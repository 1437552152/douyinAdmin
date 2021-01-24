/*
 * @Description: 
 * @version: 
 * @Date: 2019-09-29 20:48:43
 * @LastEditors: yeyifu
 * @LastEditTime: 2019-09-29 20:55:47
 * @Author: yeyifu
 * @LastModifiedBy: yeyifu
 */
 $(function () {
        //改变企点弹出框的样式和字
        $('.sideBar ul>li').on('mouseenter', function (e) {
            e.stopPropagation();
            var base = $(this)
            base.find('dl').addClass('hover');
            if (base.find('.hh_box').length > 0) {
                base.find('.hh_box').addClass('hover')
            }
            $('.sideBar').on('mouseleave', function () {
                $('.sideBar dl,.hh_box').removeClass('hover');
            })

        })
        $('.sideBar_module').hover(function(){
            $(this).addClass('on')
        },function(){
            $('.sideBar_module').removeClass('on');
        })
        $('#goTop').click(function () {
            $('body,html').animate({
                'scrollTop': '0'
            }, 600);
        })
    })
    $(window).scroll(function () {
        if ($(window).scrollTop()>=1600) {
            $('#goTop').show()
        }else{
            $('#goTop').hide()
        }
    })
