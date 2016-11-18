package;

import js.Browser;
import api.react.ReactDOM;
import api.react.ReactMacro.jsx;
import utils.Ajax;
import view.*;

class Main {
	
	public static function main():Void {
		
		Ajax.loadJson('files/js/data.json',function():Void {
			ReactDOM.render(jsx('<$Scores/>'),Browser.document.getElementById('app'));
		});
		
	}
	
}