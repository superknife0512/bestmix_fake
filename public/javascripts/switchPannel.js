$(document).ready(function(){

    function slideEle(activeEl, DeactiveEl){
            $(activeEl).slideDown('normal')
            $(DeactiveEl).slideUp('normal')
    }

    $('#btn-news').click(function(){slideEle('#news-edit','#product-edit')});
    $('#btn-prod').click(function(){slideEle('#product-edit','#news-edit')});
})