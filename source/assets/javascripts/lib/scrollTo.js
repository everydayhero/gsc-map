"use strict";

import scroll from 'scroll';

let cancelScroll = function() {
  document.onreadystatechange = function(){}
  window.removeEventListener("scroll", cancelScroll)
}

let scrollTo = function(id) {
  let node = window.document.getElementById(id);
  // need to get the body and the html nodes to make sure firefox is happy. ᕙ(⇀‸↼‶)ᕗ
  let scrollElement = [document.getElementsByTagName('html')[0], document.getElementsByTagName('body')[0]];

  if (node) {
    for (let i = 0; i < scrollElement.length; i++) {
      scroll.top(scrollElement[i], node.offsetTop - 30, { duration: 1000, ease: 'inOutQuad'});
    }
  }
}

export default scrollTo
