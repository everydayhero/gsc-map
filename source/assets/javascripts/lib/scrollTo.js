"use strict";

import scroll from 'scroll';

let scrollTo = function(id) {
  // wait for document interactive so the browsers doesn't try to scroll to it's own default
  if (document.readyState !== 'interactive') {
    document.onreadystatechange = function () {
      if (document.readyState == "interactive") {
        scrollTo(id);
      }
    }

    return
  }

  let node = window.document.getElementById(id);
  // need to get the body and the html nodes to make sure firefox is happy. ᕙ(⇀‸↼‶)ᕗ
  let scrollElement = [document.getElementsByTagName('html')[0], document.getElementsByTagName('body')[0]];

  if (node) {
    for (let i = 0; i < scrollElement.length; i++) {
      scroll.top(scrollElement[i], node.offsetTop, { duration: 1000, ease: 'inOutQuad'});
    }
  }
}

export default scrollTo
