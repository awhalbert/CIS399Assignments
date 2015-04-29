var hand = [
	{"rank": "two", "suit":"hearts"},
	{"rank": "ace", "suit":"spades"},
	{"rank": "five", "suit":"spades"},
	{"rank": "king", "suit":"clubs"},
	{"rank": "seven", "suit":"diamonds"}
];

var ranks = hand.map(fn);

var fn = function(card) {
	return card.rank;
};

console.log(ranks);