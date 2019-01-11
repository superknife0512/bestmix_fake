
$(document).ready(function(){
    $('.noctic__link').click(function(e){
        $('.noctic__list').fadeToggle(300);
        e.preventDefault();
    })

    $('.noctic__icon').mouseleave(function(){
        $('.noctic__list').fadeOut(300);
    })
})