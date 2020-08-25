class Popover {
  constructor() {
    this.activator = document.querySelector('.topbar-header__popover-activator');
    this.popover = document.querySelector('.topbar-popover');
    this.wrapper = document.querySelector('.topbar-header__popover-wrapper');
    this.activator.addEventListener('click', this.togglePopover.bind(this));
    document.addEventListener('click', this.closePopover.bind(this));
  }

  togglePopover() {
    this.popover.classList.toggle('topbar-popover--is-visible');
  }

  closePopover(evt) {
    if (!this.wrapper.contains(evt.target) ) {
      this.popover.classList.remove('topbar-popover--is-visible');
    }
  }
}

window.onload = function () {
  let popover = new Popover();

  const cps = document.querySelectorAll('.colorPicker'); //from here - https://github.com/tovic/color-picker 

  if (!cps.length) {
    return;
  }

  for (let i = 0; i < cps.length; i++) {
    let picker = new CP(cps[i]);

    picker.on("change", function (color) {
      let v = CP.HEX2RGB(color);
      //v = alpha.value == 1 ? 'rgb(' + v.join(', ') + ')' : 'rgba(' + v.join(', ') + ', ' + alpha.value.replace(/^0\./, '.') + ')';
      v = 'rgb(' + v.join(', ') + ')';
      this.target.value = v;
      this.target.style.backgroundColor = v;
    });

    //update on direct text change ... not great UX but will do for now
    let update = function () {
      picker.set(this.value).enter();
    }

    picker.target.oncut = update;
    picker.target.onpaste = update;
    picker.target.onkeyup = update;
    picker.target.oninput = update;
  }
}

//********** timer functionality
let g_intervalTimer = null;

function startCoundown(numMS, textId) {
  clearInterval(g_intervalTimer); //remove if alreadt counting down

  let currTime = new Date();
  let countDownDate = new Date(currTime.getTime() + numMS).getTime();

  // Update the count down every 1 second
  g_intervalTimer = setInterval(function() {
    // Get today's date and time
    var now = new Date().getTime();
      
    // Find the distance between now and the count down date
    var distance = countDownDate - now;
      
    // Time calculations for days, hours, minutes and seconds
    var minutes = Math.floor(distance / 60000);
    var seconds = Math.floor((distance % 60000) / 1000);
      
    // Output the result in an element with id="demo"
    document.querySelector('#' + textId).innerHTML = minutes + " minutes and " + seconds + " seconds";
      
    // If the count down is over, write some text 
    if (distance < 0) {
      clearInterval(g_intervalTimer);
      document.querySelector('#' + textId).innerHTML = "EXPIRED";
    }
  }, 1000);
}


//*********** magic links button functionality */
function createMagicLinks(url) {
  console.log('CREATE LINKS!!!');
  
  let request = new XMLHttpRequest();
  request.open('GET', '/magic-links');
  request.responseType = 'text';

  request.onload = function() {
    showMagicLinks(request.response); //show copy button
  };

  request.send();
}

function showMagicLinks(data) {
  //start timer
  startCoundown(10 * 60000, 'countdownElem');

  console.log('SHOW MAGIC LINKS');
  console.log(data);
  //remove any existing data ...
}

function copyText(inputID) {
  //https://www.w3schools.com/howto/howto_js_copy_clipboard.asp 
  console.log('COPYING TEXT!!!');

  const copyText = document.querySelector("#" + inputID);

  copyText.select();                      //select fields
  copyText.setSelectionRange(0, 99999);   //For mobile devices

  document.execCommand("copy");           //copy text inside input

  //!!
  alert("Copied the text: " + copyText.value);
}