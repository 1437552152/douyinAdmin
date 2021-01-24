/*
 * @Description: 
 * @version: 
 * @Date: 2019-08-31 20:27:40
 * @LastEditors: yeyifu
 * @LastEditTime: 2019-09-28 23:59:58
 * @Author: yeyifu
 * @LastModifiedBy: yeyifu
 */
         //banner图
			var bannerSwiper = new Swiper('#banner .swiper-container', {
				loop: true,
				autoplay: true,
				loopedSlides: 1,
				autoplayDisableOnInteraction : false,
				autoplay: true,
				navigation: {
					nextEl: '#banner .swiper-button-next',
					prevEl: '#banner .swiper-button-prev',
				},
				pagination: {
					el: '#banner .swiper-pagination',
					// clickable :true,
				}
			})
			
			//切换图	
			var certifySwiper = new Swiper('#certify .swiper-container', {
				watchSlidesProgress: true,
				slidesPerView: 'auto',
				centeredSlides: true,
			  　autoplayDisableOnInteraction : false,
				loop: true,
				autoplay: true,
				loopedSlides:20,
				navigation: {
					nextEl: '#certify .swiper-button-next',
					prevEl: '#certify .swiper-button-prev',
				},
				pagination: {
					el: '#certify .swiper-pagination',
					// clickable :true,
				},
				on: {
					progress: function(progress) {
						for(i = 0; i < this.slides.length; i++) {
							var slide = this.slides.eq(i);
							var slideProgress = this.slides[i].progress;
							modify = 1;
							if(Math.abs(slideProgress) > 1) {
								modify = (Math.abs(slideProgress) - 1) * 0.3 + 1;
							}
							translate = slideProgress * modify * 260 + 'px';
							scale = 1 - Math.abs(slideProgress) / 5;
							zIndex = 999 - Math.abs(Math.round(10 * slideProgress));
							slide.transform('translateX(' + translate + ') scale(' + scale + ')');
							slide.css('zIndex', zIndex);
							slide.css('opacity', 1);
							if(Math.abs(slideProgress) > 3) {
								slide.css('opacity', 0);
							}
						}
					},
					setTransition: function(transition) {
						for(var i = 0; i < this.slides.length; i++) {
							var slide = this.slides.eq(i)
							slide.transition(transition);
						}

					}
				}

			})