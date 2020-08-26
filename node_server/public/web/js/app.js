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
  request.open('GET', '/get-magic-links');
  request.responseType = 'text';

  request.onload = function() {
    showMagicLinks(request.response); //show copy button
  };

  request.send();
}

function copyText(inputId, username) {
  //https://www.w3schools.com/howto/howto_js_copy_clipboard.asp 
  const copyText = document.querySelector("#" + inputId);

  copyText.select();                      //select fields
  copyText.setSelectionRange(0, 99999);   //For mobile devices

  document.execCommand("copy");           //copy text inside input

  //!!
  alert('Copied magic link for ' + username  + ' to clipboard!');
}

function showMagicLinks(data) {
  startCoundown(CIRCLES.CONSTANTS.AUTH_TOKEN_EXPIRATION_MINUTES * 60000, 'countdownElem'); //start visual timer

  const jsonData = JSON.parse(data);
  const menuElem = document.querySelector('#MagicLinksContent');
  let tableStr        = '<table class=\'pure-table\'>'        
  menuElem.setAttribute('class', 'pure-menu gutter-bottom');

  tableStr += '<thead>';
  tableStr += '<tr>';
  tableStr += '<th>username</th>';
  tableStr += '<th>email</th>';
  tableStr += '<th>magic link</th>';
  tableStr += '</tr>';
  tableStr += '</thead>';
  tableStr += '<tbody>';

  for (let i = 0; i < jsonData.length; i++) {
    tableStr += '<tr>';
    tableStr += '<td>' + jsonData[i].username +  '</td>';
    tableStr += '<td>' + jsonData[i].email +  '</td>';
    tableStr += '<td><input type=\'button\' class=\'pure-button pure-button-primary\' value=\'copy\' onclick=\'copyText("linkCopy' + i + '","' + jsonData[i].username + '")\'>';
    tableStr += '<input id=linkCopy' + i + ' type=\'text\' class=\'\' value=\'' + jsonData[i].magicLink + '\' size=\'50\' readonly></td>';
    tableStr += '</tr>';
  }

  tableStr += '</tbody>';
  tableStr += '</table>';
  menuElem.innerHTML = tableStr;
}