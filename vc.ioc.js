/* logic classes */
var factory = new SecurityFactory();
var iSecurity = factory.Create();
var token = iSecurity.Authenticate("myname", "mypassword");

// -------------------------------
// file : lbi.search.js
window.lbi = window.lbi || {};
var lbi = window.lbi;
lbi.search = lbi.search || {};
lbi.search.create = function(key){
	if (!lbi.search.types || lbi.search.types.length === 0)
		throw "No types registered.";

	if (key){
		for (var i = 0 ; i < lbi.search.types.lenght ; i ++){
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

lbi.search.register = function(key, type){
	lbi.search.types = lbi.search.types || [];
	lbi.search.types.push({key : key,  type : type});
};
// -------------------------------
// file : lbi.search.google.js
function(){
	var type = function(){

	};
	
	type.prototype.execute = function(){

	};

	window.lbi.search.register("google", type);
}();


// -------------------------------
/* ui classes */
var factory = new BusyFactory();
var busy = factory.Create();
busy.show(); // loads busy dialog html from template, attachs to BODY
doSomething(function(){
	busy.hide(); // removes busy dialog html from BODY
});

