package view;

import api.react.ReactComponent;
import api.react.ReactMacro.jsx;
import utils.Ajax;

class Scores extends ReactComponent {
	
	public function new():Void {
		
		super();
		
	}
	
	public override function render():ReactComponent {
		
		return jsx('<ul>${createChildren()}</ul>');
		
	}
	
	private function createChildren():Array<ReactComponent> {
		
		var json      :Array<Dynamic> = Ajax.getJson();
		var basePrices:Array<Int>     = json[0].price;
		
		json.shift();
		
		return [
			
			for (member in json) {
				jsx('
				<li className="member">
					<p className="title">${member.name}</p>
					<ol className="scores">${createPrices(member.price,member.correction,member.pass,basePrices)}</ol>
				</li>
				');
			}
		
		];
		
	}
	
	private function createPrices(info:Array<Int>,corrections:Array<Int>,pass:Int,base:Array<Int>):Array<ReactComponent> {
		
		var total:Int = 0;
		var components:Array<ReactComponent> = [];
		
		for (i in 0...info.length) {
			
			var score     :Int    = getScore(info[i],corrections[i],base[i]);
			var scoreClass:String = score > 17 ? 'score cool' : 'score';
			
			components.push(jsx('<li><span className="no">Q${i + 1}：</span><span className="${scoreClass}">${score}P</span></li>'));
			total += score;
		
		}
		
		var totalClass:String = total >= pass ? 'total cool' : 'total';
		components.push(jsx('<li className="${totalClass}">Total：${total}P（目標達成率：${Math.floor(total / pass * 100)}%）</li>'));
		
		return components;
		
	}
	
	private function getScore(price:Int,correction:Int,basePrice:Int):Int {
		
		var diff :Int = price - basePrice;
		var score:Int = 20 - Math.floor(20 * Math.abs(diff) / basePrice);
		
		score += correction;
		
		if (diff > 0)  score++;
		if (score < 0) score = 0;
		
		return score;
		
	}
	
}