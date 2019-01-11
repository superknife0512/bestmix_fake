$(document).ready(function(){

    function slideEle(activeEl, DeactiveEl){
            $(activeEl).slideDown('normal')
            $(DeactiveEl).slideUp('normal')
    }

    $('#btn-news').click(function(){slideEle('#post','#product')});
    $('#btn-prod').click(function(){slideEle('#product','#post')});
})