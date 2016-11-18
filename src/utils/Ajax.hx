package utils;

import haxe.Http;
import haxe.Json;

class Ajax {
	
	private static var _json:Array<Dynamic>;
	
	public static function loadJson(url:String,onSuccess:Void->Void):Void {
		
		var http:Http = new Http(url);
		
		http.onData = function(data:String):Void {
			
			_json = Json.parse(data);
			onSuccess();
		
		}
		
		http.request();
		
	}
	
		public static function getJson():Array<Dynamic> {

			return _json;

		}
	
}