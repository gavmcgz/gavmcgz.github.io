var cards = [
    {
        card: '1',
        cardImg: '1',
        cardType: 'startingCard',
        automa: 'automaEnd',
        shadowEmpire: 'shadowEmpireAll',
        trackTiebreakers: ['favorite', 'military', 'exploration', 'technology', 'science'],
        shadowEmpireTiebreakers: ['science', 'technology', 'exploration', 'military', 'favorite'],
        mapTiebreaker: '1',
        income: 'true',
        topple: 'true'
    },
    {
        card: '2',
        cardImg: '2',
        cardType: 'startingCard',
        automa: 'automaAll',
        shadowEmpire: 'shadowEmpireEndLandmark',
        trackTiebreakers: ['military', 'exploration', 'favorite', 'science', 'technology'],
        shadowEmpireTiebreakers: ['technology', 'science', 'favorite', 'exploration', 'military'],
        mapTiebreaker: '2',
        income: 'true',
        topple: 'false'
    },
    {
        card: '3',
        cardImg: '3',
        cardType: 'startingCard',
        automa: 'automaEndLandmark',
        shadowEmpire: 'shadowEmpireEnd',
        trackTiebreakers: ['science', 'technology', 'military', 'exploration', 'favorite'],
        shadowEmpireTiebreakers: ['favorite', 'exploration', 'military', 'technology', 'science'],
        mapTiebreaker: '1',
        income: 'false',
        topple: 'true'
    },
    {
        card: '4',
        cardImg: '4',
        cardType: 'startingCard',
        automa: 'automaEndLandmark',
        shadowEmpire: 'shadowEmpireAll',
        trackTiebreakers: ['technology', 'science', 'favorite', 'military', 'exploration'],
        shadowEmpireTiebreakers: ['exploration', 'military', 'favorite', 'science', 'technology'],
        mapTiebreaker: '3',
        income: 'true',
        topple: 'false'
    },
    {
        card: '5',
        cardImg: '5',
        cardType: 'startingCard',
        automa: 'automaAll',
        shadowEmpire: 'shadowEmpireEndLandmark',
        trackTiebreakers: ['exploration', 'military', 'technology', 'science', 'favorite'],
        shadowEmpireTiebreakers: ['favorite', 'science', 'technology', 'military', 'exploration'],
        mapTiebreaker: '10',
        income: 'false',
        topple: 'false'
    },
    {
        card: '6',
        cardImg: '6',
        cardType: 'startingCard',
        automa: 'automaAll',
        shadowEmpire: 'shadowEmpireAll',
        trackTiebreakers: ['military', 'science', 'favorite', 'technology', 'exploration'],
        shadowEmpireTiebreakers: ['exploration', 'technology', 'favorite', 'science', 'military'],
        mapTiebreaker: '1',
        income: 'false',
        topple: 'true'
    },
    {
        card: '7',
        cardImg: '7',
        cardType: 'startingCard',
        automa: 'automaAll',
        shadowEmpire: 'shadowEmpireAll',
        trackTiebreakers: ['favorite', 'technology', 'exploration', 'military', 'science'],
        shadowEmpireTiebreakers: ['science', 'military', 'exploration', 'technology', 'favorite'],
        mapTiebreaker: '5',
        income: 'false',
        topple: 'false'
    },
    {
        card: '8',
        cardImg: '8',
        cardType: 'normal',
        automa: 'automaAll',
        shadowEmpire: 'shadowEmpireAll',
        trackTiebreakers: ['exploration', 'military', 'technology', 'favorite', 'science'],
        shadowEmpireTiebreakers: ['science', 'favorite', 'technology', 'military', 'exploration'],
        mapTiebreaker: '6',
        income: 'true',
        topple: 'false'
    },
    {
        card: '9',
        cardImg: '9',
        cardType: 'normal',
        automa: 'automaAll',
        shadowEmpire: 'shadowEmpireAll',
        trackTiebreakers: ['technology', 'science', 'favorite', 'exploration', 'military'],
        shadowEmpireTiebreakers: ['military', 'exploration', 'favorite', 'science', 'technology'],
        mapTiebreaker: '4',
        income: 'true',
        topple: 'true'
    },
    {
        card: '10',
        cardImg: '10',
        cardType: 'normal',
        automa: 'automaEndLandmark',
        shadowEmpire: 'shadowEmpireAll',
        trackTiebreakers: ['military', 'exploration', 'technology', 'science', 'favorite'],
        shadowEmpireTiebreakers: ['favorite', 'science', 'technology', 'exploration', 'military'],
        mapTiebreaker: '9',
        income: 'false',
        topple: 'true'
    },
    {
        card: '11',
        cardImg: '11',
        cardType: 'normal',
        automa: 'automaAll',
        shadowEmpire: 'shadowEmpireEndLandmark',
        trackTiebreakers: ['favorite', 'exploration', 'military', 'science', 'technology'],
        shadowEmpireTiebreakers: ['technology', 'science', 'military', 'exploration', 'favorite'],
        mapTiebreaker: '7',
        income: 'false',
        topple: 'false'
    },
    {
        card: '12',
        cardImg: '12',
        cardType: 'normal',
        automa: 'automaAll',
        shadowEmpire: 'shadowEmpireAll',
        trackTiebreakers: ['science', 'technology', 'favorite', 'military', 'exploration'],
        shadowEmpireTiebreakers: ['exploration', 'military', 'favorite', 'technology', 'science'],
        mapTiebreaker: '8',
        income: 'true',
        topple: 'true'
    },
    {
        card: '13',
        cardImg: '13',
        cardType: 'red',
        automa: 'automaAll',
        shadowEmpire: 'shadowEmpireEndLandmark',
        trackTiebreakers: ['science', 'technology', 'military', 'favorite', 'exploration'],
        shadowEmpireTiebreakers: ['exploration', 'favorite', 'military', 'technology', 'science'],
        mapTiebreaker: '6',
        income: 'false',
        topple: 'false'
    },
    {
        card: '14',
        cardImg: '14',
        cardType: 'red',
        automa: 'automaEndLandmark',
        shadowEmpire: 'shadowEmpireAll',
        trackTiebreakers: ['exploration', 'favorite', 'science', 'military', 'technology'],
        shadowEmpireTiebreakers: ['technology', 'military', 'science', 'favorite', 'exploration'],
        mapTiebreaker: '4',
        income: 'true',
        topple: 'true'
    },
    {
        card: '15',
        cardImg: '15',
        cardType: 'red',
        automa: 'automaEndLandmark',
        shadowEmpire: 'shadowEmpireEndLandmark',
        trackTiebreakers: ['favorite', 'military', 'technology', 'exploration', 'science'],
        shadowEmpireTiebreakers: ['science', 'exploration', 'technology', 'military', 'favorite'],
        mapTiebreaker: '9',
        income: 'false',
        topple: 'true'
    },
    {
        card: '16',
        cardImg: '16',
        cardType: 'red',
        automa: 'automaAll',
        shadowEmpire: 'shadowEmpireEndLandmark',
        trackTiebreakers: ['technology', 'exploration', 'favorite', 'science', 'military'],
        shadowEmpireTiebreakers: ['military', 'science', 'favorite', 'exploration', 'technology'],
        mapTiebreaker: '7',
        income: 'true',
        topple: 'false'
    },
    {
        card: '17',
        cardImg: '17',
        cardType: 'red',
        automa: 'automaAll',
        shadowEmpire: 'shadowEmpireAll',
        trackTiebreakers: ['exploration', 'favorite', 'technology', 'military', 'science'],
        shadowEmpireTiebreakers: ['science', 'military', 'technology', 'favorite', 'exploration'],
        mapTiebreaker: '5',
        income: 'true',
        topple: 'false'
    },
    {
        card: '18',
        cardImg: '18',
        cardType: 'red',
        automa: 'automaEndLandmark',
        shadowEmpire: 'shadowEmpireAll',
        trackTiebreakers: ['favorite', 'exploration', 'military', 'science', 'technology'],
        shadowEmpireTiebreakers: ['technology', 'science', 'military', 'exploration', 'favorite'],
        mapTiebreaker: '1',
        income: 'false',
        topple: 'false'
    },
    {
        card: '19',
        cardImg: '19',
        cardType: 'red',
        automa: 'automaAll',
        shadowEmpire: 'shadowEmpireAll',
        trackTiebreakers: ['military', 'technology', 'science', 'exploration', 'favorite'],
        shadowEmpireTiebreakers: ['favorite', 'exploration', 'science', 'technology', 'military'],
        mapTiebreaker: '2',
        income: 'true',
        topple: 'true'
    },
    {
        card: '20',
        cardImg: '20',
        cardType: 'red',
        automa: 'automaAll',
        shadowEmpire: 'shadowEmpireAll',
        trackTiebreakers: ['technology', 'exploration', 'science', 'military', 'favorite'],
        shadowEmpireTiebreakers: ['favorite', 'military', 'science', 'exploration', 'technology'],
        mapTiebreaker: '1',
        income: 'false',
        topple: 'false'
    },
    {
        card: '21',
        cardImg: '21',
        cardType: 'red',
        automa: 'automaAll',
        shadowEmpire: 'shadowEmpireEnd',
        trackTiebreakers: ['exploration', 'technology', 'favorite', 'science', 'military'],
        shadowEmpireTiebreakers: ['military', 'science', 'favorite', 'technology', 'exploration'],
        mapTiebreaker: '3',
        income: 'true',
        topple: 'true'
    },
    {
        card: '22',
        cardImg: '22',
        cardType: 'red',
        automa: 'automaEnd',
        shadowEmpire: 'shadowEmpireAll',
        trackTiebreakers: ['military', 'exploration', 'technology', 'favorite', 'science'],
        shadowEmpireTiebreakers: ['science', 'favorite', 'technology', 'exploration', 'military'],
        mapTiebreaker: '1',
        income: 'false',
        topple: 'true'
    }
]

let artsTiebreakers = {
    '1': 'top',
    '2': 'top',
    '4': 'bottom',
    '5': 'bottom',
    '8': 'top',
    '10': 'bottom',
    '13': 'bottom',
    '15': 'top',
    '17': 'top',
    '19': 'bottom'
}

// if(artsTiebreakers.hasOwnProperty('cardNum')) {
//     if(aaExp) {
//         show adjusted card with the arts icon
//     }
// }