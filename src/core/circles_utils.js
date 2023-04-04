'use strict';

const isEmptyObj = function(obj) {
  return (obj && Object.keys(obj).length === 0 && Object.getPrototypeOf(obj) === Object.prototype);
}

const YEATS_WORD_LIST = [  'had', 'i', 'the', 'heavens', 'embroidered', 'cloths',
                            'enwrought', 'with', 'golden', 'and', 'silver', 'light',
                            'the', 'blue', 'and', 'the', 'dim', 'and', 'the', 'dark', 'cloths',
                            'of', 'night', 'and', 'light', 'and', 'the', 'half', 'light',
                            'i', 'would', 'spread', 'the', 'cloths', 'under', 'your', 'feet'];
function generateRandomString(numWords = 1) {
  //const textInput = document.querySelector("#" + inputID);
  const arrLength = YEATS_WORD_LIST.length;

  const getRandomWord = () => {
    return YEATS_WORD_LIST[Math.floor(Math.random() * arrLength)];
  };

  let autoStr     = getRandomWord();
  for (let i = 0; i < numWords; i++) {
    autoStr += '-' + getRandomWord();
  }

  return autoStr;
}

function isTheSameXYZ(xyz_1, xyz_2, diff = Number.EPSILON) {
  return (  (Math.abs(xyz_1.x - xyz_2.x) < diff) &&
            (Math.abs(xyz_1.y - xyz_2.y) < diff) &&
            (Math.abs(xyz_1.z - xyz_2.z) < diff)
         );
}

module.exports = {
  isEmptyObj,
  generateRandomString,
  isTheSameXYZ
};
