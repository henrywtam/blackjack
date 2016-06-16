var dealerText = document.getElementById("dealerText");
var userInput = document.getElementById("userInput");

function getUserInput() {
	game.handlePlayerResponse(userInput.value.toLowerCase());
	userInput.value="";
}

function Dealer() {
	this.prevOutput = "";
	this.output = "";
	this.hand = [];
	this.say = function(text) {
		this.output = text;
		dealerText.textContent = this.output;
	};
	this.repeat = function() {
		this.say(this.prevOutput);
	};
}

function Player() {
	this.hand = [];
}

function BlackJack() {
	this.dealer = new Dealer();
	this.player = new Player();
	this.deck = [
		"2","2","2","2","3","3","3","3","4","4","4","4",
		"5","5","5","5","6","6","6","6","7","7","7","7",
		"8","8","8","8","9","9","9","9","10","10","10","10",
		"J","J","J","J","Q","Q","Q","Q","K","K","K","K",
		"A","A","A","A"
	];
	this.shuffleDeck = function() {
		var deckLen = this.deck.length;
	    for (var i = deckLen - 1; i > 0; i--) {
	        var j = Math.floor(Math.random() * (i + 1));
	        var temp = this.deck[i];
	        this.deck[i] = this.deck[j];
	        this.deck[j] = temp;
	    }
    }
    this.handlePlayerResponse = function(input) {
		switch(input) {
			case "yes":
			case "y":
				this.dealHand();
				break;
			case "hit":
			case "h":
				this.dealCard("player");
				break;
			case "stay":
			case "s":
				this.evaluateHands(); // to do
				break;
			default:
				this.dealer.prevOutput = this.dealer.output; // timeouts can't take in params
				this.dealer.say("I didn't get that?");
				window.setTimeout(function() {
					this.dealer.repeat();
				}.bind(this), 1500);
		}
	}
	this.evalPlayerHand = function() {
		var score = this.player.hand.reduce(function(prev, curr) {
			if ("JQK".indexOf(curr) != -1) {
				curr = 10;
			} else if (curr == "A") {
				curr = 11;
			}
			return parseInt(prev) + parseInt(curr);
		}, 0);
		if (score == 21) {
			this.dealer.say("You have " + this.player.hand.join("/") + "! That's 21! You win!");
		} else if (score > 21) {
			this.dealer.say("You have " + this.player.hand.join("/") + "! That's over 21. You lose :(");
		} else {
			this.dealer.say("I have " + this.dealer.hand.join("/") +
				". You have " + this.player.hand.join("/") +
				". What would you like to hit or stay?");
		}
	}
}

BlackJack.prototype.start = function() {
	this.shuffleDeck();
	this.dealer.say("Would you like to play some blackjack?");
}

BlackJack.prototype.dealHand = function() {
	this.dealer.hand.push(this.deck.shift());
	this.player.hand.push(this.deck.shift());
	this.dealer.hand.push(this.deck.shift());
	this.player.hand.push(this.deck.shift());
	this.dealer.say("I have " + this.dealer.hand.join("/") +
		". You have " + this.player.hand.join("/") +
		". What would you like to hit or stay?");
}

BlackJack.prototype.dealCard = function(entity) {
	if (entity == "player") {
		this.player.hand.push(this.deck.shift());
		this.evalPlayerHand();
	} else {
		// to be implemented when adding evaluateHands logic and dealer is losing
	}
}

var game = new BlackJack();
game.start();


