window.onload = function () {
  //have something in the group field when opening page
  //let's not as "explore" will be used if field is blank
  // if (typeof MagicLinkGroup !== 'undefined') {
  //   autogenerateGroupName(MagicLinkGroup, 4);
  // }

  //get worlds available from server
  getWorldsList();

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

//********** timer functionality
let g_intervalTimer = null;

function startCoundown(numMS, textId) {
  clearInterval(g_intervalTimer); //remove if alreadt counting down

  let currTime = new Date();
  let countDownDate = new Date(currTime.getTime() + numMS).getTime();

  // Update the count down every 1 second
  g_intervalTimer = setInterval(function() {
    // Get today's date and time
    let now = new Date().getTime();
      
    // Find the distance between now and the count down date
    let time_distance = countDownDate - now;
      
    // Time calculations for days, hours, minutes and seconds
    let seconds = Math.floor(time_distance / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    let hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    let days = Math.floor(hours / 24);
    hours = hours % 24;
      
    // Output the result in an element with id="demo"
    document.querySelector('#' + textId).innerHTML = days + " days, " + hours + " hours, " + minutes + " minutes, " + seconds + " seconds";
      
    // If the count down is over, write some text 
    if (time_distance < 0) {
      clearInterval(g_intervalTimer);
      document.querySelector('#' + textId).innerHTML = "EXPIRED";
    }
  }, 1000);
}


//*********** magic links button functionality */
function createMagicLinks(username, email, userTypeAsking) {
  const magic_world = document.querySelector("#MagicLinkWorld").value;
  const magic_group = document.querySelector("#MagicLinkGroup").value;
  const url = 'w/' + magic_world + '?group=' + ((magic_group === '') ? 'explore' : magic_group);

  const expiryTimeMin = document.querySelector("#MagicLinkExpiry").value * 24 * 60; //convert days to mins

  let request = new XMLHttpRequest();
  request.open('GET', '/get-magic-links?route=' + url 
                                                + '&usernameAsking='  + username 
                                                + '&emailAsking='     + email 
                                                + '&userTypeAsking='  + userTypeAsking 
                                                + '&expiryTimeMin='   + expiryTimeMin);
  request.responseType = 'text';

  request.onload = function() {
    showMagicLinks(request.response, expiryTimeMin); //show copy button
  };

  request.send();
}

function copyText(copyTextElem, username) {
  // Select the text field
  copyTextElem.select(); 
  copyTextElem.setSelectionRange(0, 99999); // For mobile devices

   // Copy the text inside the text field (need to use promises so this actually copies)
  navigator.clipboard.writeText(copyTextElem.value).then(function() {
    alert("Copied the magic link!");
  });
}

function autogenerateGroupName(inputElem, numWords = 1) {
  inputElem.value = CIRCLES.UTILS.generateRandomString(numWords);
}

function showMagicLinks(data, expiryTimeMin) {
  startCoundown(expiryTimeMin * 60000, 'countdownElem'); //start visual timer

  const jsonData = JSON.parse(data);
  const menuElem = document.querySelector('#MagicLinksContent');
  let tableStr   = '<table class=\'pure-table\'>'        
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
    let isYou     = (i === 0);
    let username  = ((isYou) ? ' <strong>' : '') + jsonData[i].username + ((isYou) ? ' (you) </strong>' : '');
    let email     = ((isYou) ? ' <strong>' : '') + jsonData[i].email + ((isYou) ? '</strong>' : '');
    let magicLink = jsonData[i].magicLink ;

    tableStr += '<tr>';
    tableStr += '<td>' + username +  '</td>';
    tableStr += '<td>' + email +  '</td>';
    tableStr += '<td><input type=\'button\' class=\'pure-button pure-button-primary\' value=\'copy\' onclick=\'copyText(linkCopy' + i + ',"' + username + '")\'>';
    tableStr += '<input id=linkCopy' + i + ' type=\'text\' class=\'\' value=\'' + magicLink + '\' size=\'50\' readonly></td>';
    tableStr += '</tr>';
  }

  tableStr += '</tbody>';
  tableStr += '</table>';
  menuElem.innerHTML = tableStr;
}

function getWorldsList() {
  let request = new XMLHttpRequest();
  request.open('GET', '/get-worlds-list');
  request.responseType = 'text';
  request.onload = function() {
    showWorldList(request.response); //show copy button
  };
  request.send();
}

function showWorldList(data) {
  const jsonData                = JSON.parse(data);

  let htmlStr_list    = '<ul class="pure-menu-list">';
  let htmlStr_select  = '';
  let urlLink = '';
  let worldName = ';'
  for (let i = 0; i < jsonData.length; i++) {
    worldName = jsonData[i];
    urlLink = '/w/' + worldName;

    htmlStr_list += '<li><a class="pure-button" href="' + urlLink + '">';
    htmlStr_list += worldName;
    htmlStr_list += '</a></li>';

    htmlStr_select += '<option value="' + worldName + '">' + worldName + '</option>';
  }
  htmlStr_list += '</ul>';

  const worldsWrapperElem       = document.querySelector('#worlds_list_wrapper');
  worldsWrapperElem.innerHTML = htmlStr_list;

  const worldsSelectElem        = document.querySelector('#MagicLinkWorld');
  if(worldsSelectElem) {
    worldsSelectElem.innerHTML = htmlStr_select;
  }
}