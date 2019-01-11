
$(document).ready(function(){

    $('.openList').click(function(){
        $(this)
            .parents('.products__list-title')
            .find('.products__other')
            .slideToggle(300);
    })
})