'use strict';

const isEmptyObj = function(obj) {
  return (obj && Object.keys(obj).length === 0 && Object.getPrototypeOf(obj) === Object.prototype);
}

module.exports = {
  isEmptyObj
};
