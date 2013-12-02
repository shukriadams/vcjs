/* logic classes */
/*
var factory = new SecurityFactory();
var iSecurity = factory.Create();
var token = iSecurity.Authenticate("myname", "mypassword");
*/
$(function () { 

    // -------------------------------
    // file : lbi.search.js
    window.lbi = window.lbi || {};
    var lbi = window.lbi;
    lbi.search = lbi.search || {};
    lbi.search.create = function(key){
	    if (!lbi.search.types || lbi.search.types.length === 0)
		    throw "No types registered.";

	    if (key){
		    for (var i = 0 ; i < lbi.search.types.length ; i ++){
			    var type = lbi.search.types[i];
			    if (type.key === key)
				    return new type.type();
		    }
		    throw 'Did not find a registerd type {0}'.format(key);
	    }		
	    else {
		    // return default
		    return new lbi.search.types[0].type();
	    }
    };

    lbi.search.register = function (key, type) {
        lbi.search.types = lbi.search.types || [];
        lbi.search.types.push({ key: key, type: type });
        console.log('registered type {0}'.format(key));
    };
    console.log('ready to load types');
});

// -------------------------------
// file : lbi.search.google.js
$(function(){
	var type = function(){

	};
	type.prototype = function () { this.apply(this, arguments); };

	type.prototype.execute = function(){
        console.log('you just did a google search, well done!');
	};

    window.lbi.search.register("google", type);
});

// -------------------------------
// file : lbi.search.lucene.js
$(function () {
    var type = function () {

    };
    type.prototype = function () { this.apply(this, arguments); };

    type.prototype.execute = function () {
        console.log('you just did a lucene search, well done!');
    };

    window.lbi.search.register("lucene", type);
});


// -------------------------------
$(function () {
    require(['lbi.search'], function () {
        var search = lbi.search.create();
        search.execute();

        search = lbi.search.create('lucene');
        search.execute();    
    });
});

/*
1) namespaces
2) asynch loading
3) inversion of control
*/

// -------------------------------
/* ui classes */
/*
var factory = new BusyFactory();
var busy = factory.Create();
busy.show(); // loads busy dialog html from template, attachs to BODY
doSomething(function(){
	busy.hide(); // removes busy dialog html from BODY
});
*/
