 $(function(){
 	$(window).resize(function(event) {
 		if($(window).width() < 576){ 			 
 			$('.menutop ul li ul').slideUp();
 		}
 	});
 	$('.menutop .navbar-light .navbar-nav > li ') .bind('touchstart',function(){		 
		$(this).children('ul').slideToggle();
 	})
 
 	// jquery cho phan hieu ung 
 	$('ul.tdtab li b').click(function(){
 		$('ul.tdtab li b').removeClass('active');
 		$(this).addClass('active');
 		chiso = $(this).parent().index() + 1; 	
 		$('ul.ndtab li .divsanpham').removeClass('xuathien');
 		$('ul.ndtab li:nth-child(' + chiso + ") .divsanpham ").addClass('xuathien');
 	})

 	// hieu ung cuon chuot 
 	 new WOW().init();

})  
 