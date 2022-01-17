var msg = [
    //Generic
	{
		name: 'newGame',
        msg: 'Are you sure you want to start a new game?',
		success: 'newGame',
		type: 'confirm'
	},
	// {
	// 	name: 'resetGame',
    //     msg: 'Are you sure you want to reset the game?',
	// 	success: 'resetGame',
	// 	type: 'confirm'
	// },
	{
		name: 'exitGame',
		msg: 'Are you sure you want to exit the current game?',
		success: 'exitGame',
		type: 'confirm'
	},
	{
		name: 'shuffle',
		msg: 'Are you sure you to shuffle the deck?',
		success: 'shuffleDeck',
		type: 'confirm'
    },
    {
		name: 'round',
		msg: 'Are you sure you start the next round?',
		success: 'shuffleDeck',
		type: 'confirm'
	},
	{
		name: 'roundPlus',
		msg: 'Are you sure you start the next round?',
		success: 'roundNumPlus',
		type: 'confirm'
    },
	{
		name: 'removeCard',
		msg: 'Are you sure you want to remove this card from the deck?',
		success: 'removeCard',
		type: 'confirm'
	},
	{
		name: 'addCard',
		msg: 'Are you sure you want to add this card back into the deck?',
		success: 'addCard',
		type: 'confirm'
	},
    {
		name: 'noCards',
		msg: 'The deck is too small to remove this card, you need to add more cards back in first.',
		success: 'none',
		type: 'alert'
	}
]