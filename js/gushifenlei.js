$(function(){
var elements={};
	elements.homeWrapper=$('#homeWrapper');
	var windowWidth = document.body.offsetWidth;
		elements.homeWrapper.css('width', windowWidth);

	// 绑定滚动事件
		var myScroll, isWidth = 0,
			aTabList = $('.class-scroll li');
		//重新設置大小
		ReSize();

		function ReSize() {
			aTabList.each(function(i) {
				var el = $(this);
				isWidth += el.width();
			});
			$('.class-scroll ul').css({
				width: isWidth
			});
		}
		myScroll = new iScroll('homeWrapper', {
			snap: true,
			momentum: false,
			hScrollbar: false,
			vScroll: false
		});
		$(window).resize(function() {
			ReSize();
			myScroll.refresh();
		});


})