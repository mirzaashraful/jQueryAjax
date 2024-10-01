'use strict';
//$('#slider .slides').animate({'margin-left': -720}, 1000);
//$('#slider .slides').animate({'margin-left': '-=720'}, 1000);

 $(function (){

     // setInterval(function (){
     //     $('#slider .slides').animate({'margin-left':'-=720px'}, 1000);
     // }, 3000);

     // Configuration
     var width = 720;
     var animationSpeed = 1000;
     var pause = 3000;
     var currentSlide = 1;

     //cache DOM
     var $slider = $('#slider');
     var $sliderContainer = $slider.find('.slides');
     var $slides = $sliderContainer.find('.slide');

     // setInterval
     // animate margin-left
     // if it's last slide, go to position 1 (0px);

     var interval;

     function startSlider(){
         interval = setInterval(function (){
             $sliderContainer.animate({'margin-left': '-='+width}, animationSpeed, function (){
                 currentSlide++;
                 if(currentSlide === $slides.length) {
                     currentSlide = 1;
                     $sliderContainer.css('margin-left',0);
                 }
             });
         }, pause);
     }

     function stopSlider(){
         clearInterval(interval);
     }

     $slider.on('mouseenter', stopSlider).on('mouseleave', startSlider);

     // listen for mouseenter and pause
     // resume on mouseleave


 });