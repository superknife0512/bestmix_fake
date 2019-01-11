
$(document).ready(function(){
    const ele = document.querySelectorAll('.product-detail__list');
    const switches = document.querySelectorAll('.product-detail__switch');
    
    ele.forEach(element => {
        element.style.display = 'none'
    });
    
    ele[0].style.display = 'block';
    switches[0].classList.add('activeBtn');
    
    function deactiveAll(){
        switches.forEach(each=>{
            each.classList.remove('activeBtn');
        })
    }
    
    function hideAll(){
        ele.forEach(ele=>{
            ele.style.display = 'none'
        })
    }
    
    function activeIt(subId){
        deactiveAll();
        hideAll();
        $(`#btn-${subId}`).addClass('activeBtn');
        $(`#product-detail__view-${subId}`).fadeIn(200);
    }

    // $('btn').click(function(e){
    //     e.preventDefault();
    // })
    
    $('#btn-des').click(function(event){
        // event.preventDefault();
        activeIt('des');
        
    })
    
    $('#btn-pros').click(function(event){
        event.preventDefault();
        activeIt('pros');
        
    })
    
    $('#btn-specities').click(function(event){
        event.preventDefault();
        activeIt('specities');
        
    })
    
    $('#btn-progressz').click(function(event){
        activeIt('progressz')
    })
    
})