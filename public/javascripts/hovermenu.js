$(document).ready(function(){
    
// for hover menu

    $('#product-menu').mouseenter(function(){
        $('.header__expand').slideDown(500);
    })

    $('#header__bottom').mouseenter(function(){
        $('.header__expand').slideDown(500);
    })

    $('header').mouseleave(function(){
        $('.header__expand').slideUp(500)
    })

    $('.header__top').mouseenter(function(){
        $('.header__expand').slideUp(500);
    })

    document.querySelector('.header__expand').style.display = 'none';
})