(function () { "use strict";
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var Lambda = function() { };
Lambda.exists = function(it,f) {
	var $it0 = it.iterator();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) return true;
	}
	return false;
};
var List = function() {
	this.length = 0;
};
List.prototype = {
	iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
};
var Main = function() { };
Main.main = function() {
	utils.Ajax.loadJson("files/js/data.json",function() {
		ReactDOM.render(React.createElement(view.Scores,null),window.document.getElementById("app"));
	});
};
var api = {};
api.react = {};
api.react.ReactMacro = function() { };
var haxe = {};
haxe.Http = function(url) {
	this.url = url;
	this.headers = new List();
	this.params = new List();
	this.async = true;
};
haxe.Http.prototype = {
	request: function(post) {
		var me = this;
		me.responseData = null;
		var r = this.req = js.Browser.createXMLHttpRequest();
		var onreadystatechange = function(_) {
			if(r.readyState != 4) return;
			var s;
			try {
				s = r.status;
			} catch( e ) {
				s = null;
			}
			if(s == undefined) s = null;
			if(s != null) me.onStatus(s);
			if(s != null && s >= 200 && s < 400) {
				me.req = null;
				me.onData(me.responseData = r.responseText);
			} else if(s == null) {
				me.req = null;
				me.onError("Failed to connect or resolve host");
			} else switch(s) {
			case 12029:
				me.req = null;
				me.onError("Failed to connect to host");
				break;
			case 12007:
				me.req = null;
				me.onError("Unknown host");
				break;
			default:
				me.req = null;
				me.responseData = r.responseText;
				me.onError("Http Error #" + r.status);
			}
		};
		if(this.async) r.onreadystatechange = onreadystatechange;
		var uri = this.postData;
		if(uri != null) post = true; else {
			var $it0 = this.params.iterator();
			while( $it0.hasNext() ) {
				var p = $it0.next();
				if(uri == null) uri = ""; else uri += "&";
				uri += encodeURIComponent(p.param) + "=" + encodeURIComponent(p.value);
			}
		}
		try {
			if(post) r.open("POST",this.url,this.async); else if(uri != null) {
				var question = this.url.split("?").length <= 1;
				r.open("GET",this.url + (question?"?":"&") + uri,this.async);
				uri = null;
			} else r.open("GET",this.url,this.async);
		} catch( e1 ) {
			me.req = null;
			this.onError(e1.toString());
			return;
		}
		if(!Lambda.exists(this.headers,function(h) {
			return h.header == "Content-Type";
		}) && post && this.postData == null) r.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var $it1 = this.headers.iterator();
		while( $it1.hasNext() ) {
			var h1 = $it1.next();
			r.setRequestHeader(h1.header,h1.value);
		}
		r.send(uri);
		if(!this.async) onreadystatechange(null);
	}
	,onData: function(data) {
	}
	,onError: function(msg) {
	}
	,onStatus: function(status) {
	}
};
var js = {};
js.Browser = function() { };
js.Browser.createXMLHttpRequest = function() {
	if(typeof XMLHttpRequest != "undefined") return new XMLHttpRequest();
	if(typeof ActiveXObject != "undefined") return new ActiveXObject("Microsoft.XMLHTTP");
	throw "Unable to create XMLHttpRequest object.";
};
var utils = {};
utils.Ajax = function() { };
utils.Ajax.loadJson = function(url,onSuccess) {
	var http = new haxe.Http(url);
	http.onData = function(data) {
		utils.Ajax._json = JSON.parse(data);
		onSuccess();
	};
	http.request();
};
utils.Ajax.getJson = function() {
	return utils.Ajax._json;
};
var view = {};
view.Scores = function() {
	React.Component.call(this);
};
view.Scores.__super__ = React.Component;
view.Scores.prototype = $extend(React.Component.prototype,{
	render: function() {
		return React.createElement("ul",null,this.createChildren());
	}
	,createChildren: function() {
		var json = utils.Ajax.getJson();
		var basePrices = json[0].price;
		json.shift();
		var _g = [];
		var _g1 = 0;
		while(_g1 < json.length) {
			var member = json[_g1];
			++_g1;
			_g.push(React.createElement("li",{ className : "member"},React.createElement("p",{ className : "title"},member.name),React.createElement("ol",{ className : "scores"},this.createPrices(member.price,member.correction,member.pass,basePrices))));
		}
		return _g;
	}
	,createPrices: function(info,corrections,pass,base) {
		var total = 0;
		var components = [];
		var _g1 = 0;
		var _g = info.length;
		while(_g1 < _g) {
			var i = _g1++;
			var score = this.getScore(info[i],corrections[i],base[i]);
			var scoreClass;
			if(score > 17) scoreClass = "score cool"; else scoreClass = "score";
			components.push(React.createElement("li",null,React.createElement("span",{ className : "no"},"Q",i + 1,"："),React.createElement("span",{ className : scoreClass},score,"P")));
			total += score;
		}
		var totalClass;
		if(total >= pass) totalClass = "total cool"; else totalClass = "total";
		components.push(React.createElement("li",{ className : totalClass},"Total：",total,"P（目標達成率：",Math.floor(total / pass * 100),"%）"));
		return components;
	}
	,getScore: function(price,correction,basePrice) {
		var diff = price - basePrice;
		var score = 20 - Math.floor(20 * Math.abs(diff) / basePrice);
		score += correction;
		if(diff > 0) score++;
		if(score < 0) score = 0;
		return score;
	}
});
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i1) {
	return isNaN(i1);
};
view.Scores.displayName = "Scores";
Main.main();
})();
