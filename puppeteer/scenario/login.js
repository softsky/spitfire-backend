function eventFire(el, etype){
    // for strings attepting to query Selector or xpath
    if(typeof el == 'string'){
	el = document.querySelector(el);
	if(!el){
	    el = document.evaluate(el, document);
	}
    }
    // if not found, throwing Error
    if(!el)
	throw new Error('Can\'t find element', el);
    
    if (el.fireEvent) {
	el.fireEvent('on' + etype);
    } else {
	var evObj = document.createEvent('Events');
	evObj.initEvent(etype, true, false);
	el.dispatchEvent(evObj);
    }
}

function click(el){
    eventFire(el, 'click');
}

module.exports = {
    eventFire, click,
    scenario: click('button[data-qa="mobile-nav-menu-button"]')
}
