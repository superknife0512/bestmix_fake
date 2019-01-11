$(document).ready(function(){

    $('.noctic__item-icon').click(function(){
        const msgId = $(this).next('[name=msgId').val();
        console.log(msgId);
        fetch(`/admin/reply/${msgId}`,{
            method: 'DELETE',
        }).then(res=>{

            if(res.status === 200 || res.status === 201){
                $(this).parents('.noctic__item').remove();
                console.log('Done!');
                return res.json();
            } else {
                console.log('Error!');
            }
        }).then(data=>{
            console.log(data, data.body);
        })
        .catch(err=>{
            console.log(err);
        })
    })
})