const doingDom = document.getElementById('doing');
const standingDom = document.getElementById('outStanding');
let switches = document.querySelectorAll('#sw1, #sw2, #sw3');
// const chemistry = document.getElementById('c')

//switch function
document.querySelector('#sw1').classList.add('sw-active');
standingDom.style.display = 'none';
chemistry.style.display = 'none';

function switchIt( doingStyle, standingStyle, chemistryStyle, activeDom){
    doingDom.style.display = doingStyle;
    standingDom.style.display = standingStyle;
    chemistry.style.display = chemistryStyle;

    switches.forEach(ele => {
        ele.classList.remove('sw-active')
    });
    activeDom.classList.add('sw-active')
}

function switchDoing(e){
    switchIt('flex', 'none', 'none',e)
}

function switchStanding(e){
    switchIt('none', 'flex', 'none', e)
}

function switchChemistry(e){
    switchIt('none', 'none', 'flex', e)
}
