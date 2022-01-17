const DEBUG_GAME = false;

var time_stamp = 0; // Or Date.now()
window.addEventListener("touchstart", function(event_) {
    if (event_.timeStamp - time_stamp < 300) { // A tap that occurs less than 300 ms from the last tap will trigger a double tap. This delay may be different between browsers.
        event_.preventDefault();
        return false;
    }
    time_stamp = event_.timeStamp;
});

if(DEBUG_GAME) console.log(`DEBUG_GAME active`);

var deck = [];
var currentAutomaPoints = 0;
let savedData = '';

var aaExp = false;

var init = {
	title: 'Tapestry',
	code: 'tp',
	expansions: [],
	lastOpponent: 'automaShadowEmpire',
	actionDisplay: 'automatedSystem',
	shuffles: 0,
	deckSize: 0,
	era: 0,
	cardDisplay: 'tapestry',
	automaCivList: {
		base: ['explorers', 'conquerors', 'scientists', 'engineers'],
		plansPloys: ['equalizers', 'hucksters', 'iconoclasts', 'trailblazers']
	},
	// allAutomaCivs: ['explorers', 'conquerors', 'scientists', 'engineers', 'equalizers', 'hucksters', 'iconoclasts', 'trailblazers'],
	availableAutomaCivs: [],
	availableSecondAutomaCivs: [],
	difficultyLevelNum: 0,
	difficultyLevel: {
		options: ['automaUnderachiever', 'automaAverage', 'automaSlightlyIntimidating', 'automaSomewhatAwesome', 'automaDefinitelyAwesome', 'automaCrusherDreams']
	},
	difficultySpecs: {},
	automaMat: {},
	chosenCards: [],
	firstCard: 'true',
	passed: 'false',
	playerColors: ['blue', 'red', 'green', 'yellow', 'grey'],
	humanInfo: {
		color: 'blue',
		trackPos: [0, 0, 0, 0], // 'technology', 'military', 'exploration', 'science'
		toEndTrack: [12, 12, 12, 12] // 'technology', 'military', 'exploration', 'science'
	},
	automaInfo: {
		color: 'red',
		favTrack: '',
		originalFavTrack: '',
		firstCivSpecs: {},
		secondCivSpecs: {},
		trackPos: [0, 0, 0, 0], // 'technology', 'military', 'exploration', 'science'
		toEndTrack: [12, 12, 12, 12], // 'technology', 'military', 'exploration', 'science'
		landmarks: [],
		scoringLandmarks: 0,
		incomeAssessment: 'false',
		lastTrack: '',
		incomeBonusVPs: {
			amount: 0,
			multiplier: 0,
			total: 0
		}
	},
	shadowEmpireInfo: {
		color: 'grey',
		favTrack: '',
		originalFavTrack: '',
		trackPos: [0, 0, 0, 0], // 'technology', 'military', 'exploration', 'science'
		toEndTrack: [12, 12, 12, 12], // 'technology', 'military', 'exploration', 'science'
		incomeAssessment: 'false',
		lastTrack: ''
	},
	shadowEmpireOnlyInfo: {
		color: 'grey',
		favTrack: '',
		originalFavTrack: '',
		trackPos: [0, 0, 0, 0], // 'technology', 'military', 'exploration', 'science'
		toEndTrack: [12, 12, 12, 12], // 'technology', 'military', 'exploration', 'science'
		incomeAssessment: 'false',
		lastTrack: ''
	},
	tracks: ['technology', 'military', 'exploration', 'science'],
	rolledFavTracks: [],
	moveSymbol: '/',
	onDraw: [],
	onShuffle: ['hideShuffle'],
	resumeGame: false,
	extraCardInfo: '<p class="imageDisclaimer gameInfoHide">Not an official Stonemaier product.</p>',
	startButtons: [
		{
			name: 'Shadow Empire',
			id: 'shadowEmpire',
			classes: ['greenBtn', 'func-shadowEmpireAutomatedSystem', 'func-showLayer-shadowEmpireAutomatedSystem']
		},
		{
			name: 'Full Automa',
			id: 'fullAutoma',
			classes: ['blueBtn', 'func-fullAutomaAutomatedSystem', 'func-showLayer-fullAutomaChooseCivs']
		},
		{
			name: 'Quick Start',
			id: 'quickStart',
			classes: ['redBtn', 'func-showLayer-quickStart']
		},
		{
			name: 'Continue',
			id: 'continue',
			classes: ['redBtn', 'hidden', 'func-savedTapestryGame']
		}
	],
	gameButtons: [
		{
			name: 'Draw',
			id: 'draw',
			classes: ['redBtn', 'func-drawCard'],
			display: true
		},
		{
			name: 'Income',
			id: 'shuffle',
			classes: ['blueBtn', 'func-shuffleDeck-game', 'func-roundCleanup'],
			display: false
		},
		{
			name: 'Shuffle',
			id: 'shuffleShadowDeck',
			classes: ['greenBtn', 'func-shadowEmpirefavoriteTrackAssessment'],
			display: false
		},
		{
			name: 'Next Action',
			id: 'nextAction',
			classes: ['redBtn', 'func-drawCard', 'func-lockNextActionBtn'],
			display: false
		},
		{
			name: 'Income',
			id: 'incomeTurn',
			classes: ['redBtn', 'func-shuffleDeck-game', 'func-checkFirstToReachEra'],
			display: false
		},
		{
			name: 'Automa Info',
			id: 'automaInfo',
			classes: ['greyBtn'],
			display: false
		},
		{
			name: 'Landmarks',
			id: 'showLandmarks',
			classes: ['blueBtn', 'func-showLayer-landmarks', 'func-updateLandmarks'],
			display: false
		},
		{
			name: 'Age of Discovery Tapestry Card',
			id: 'viewTapestryCards',
			classes: ['orangeBtn', 'func-showAgeOfDiscoveryTapestryCard'],
			display: false
		},
		{
			name: 'Next',
			id: 'automaIncome1Setup',
			classes: ['redBtn', 'func-automaIncome1Action'],
			display: false
		},
		{
			name: 'Start',
			id: 'setupDoneStartGame',
			classes: ['greenBtn', 'func-automaSetupDoneStartGame', 'func-landmarkReminder'],
			display: false
		}
	],
	roundInfoTable: [1, 1, 2],
	roundInfo: [
		{
			name: "Era",
			class: "era",
			increments: "plusNum",
			trigger: "shuffle",
			reset: "none",
			value: [1],
			table: [1],
			updateTrigger: ['game'],
			animation: 'false'
		},{
			name: "Cards Left",
			class: "crdsLft",
			increments: "minusNum",
			trigger: "draw",
			reset: "shuffle",
			value: [0],
			table: [2, 3],
			updateTrigger: ['game'],
			animation: 'false'
		},{
			name: "Cards Drawn",
			class: "crdsDrwn",
			increments: "plusNum",
			trigger: "draw",
			reset: "shuffle",
			value: [0],
			table: [2, 3],
			updateTrigger: ['game'],
			animation: 'false'
		}
	],
	lockBtn: [
		{
			name: 'draw',
			time: 1000
		}
	],
	finalDeck:[],
	disclaimer: 'This is not an official <a href="https://stonemaiergames.com/games/tapestry/" target="_blank" rel="noopener">Stonemaier Games</a> product and has no affiliation with <a href="https://stonemaiergames.com/games/tapestry/" target="_blank" rel="noopener">Stonemaier Games</a>. Tapestry was designed by <a href="https://boardgamegeek.com/user/jameystegmaier" target="_blank" rel="noopener">Jamey Stegmaier</a>, with art by <a href="https://www.bosleyart.com/" target="_blank" rel="noopener">Andrew Bosley</a> and sculpts by <a href="http://cultofgame.blogspot.com/" target="_blank" rel="noopener">Rom Brown</a>. All art in this app is from <a href="https://stonemaiergames.com/games/tapestry/" target="_blank" rel="noopener">Tapestry</a>. The Automa for Tapestry was designed by <a href="https://boardgamegeek.com/user/mortenmdk" target="_blank" rel="noopener">Morten Monrad Pedersen</a> with <a href="https://boardgamegeek.com/user/elephantgirl" target="_blank" rel="noopener">Lieve Teugels</a> and <a href="https://boardgamegeek.com/user/njshaw2" target="_blank" rel="noopener">Nick Shaw</a> who represent <a href="http://www.automafactory.com/" target="_blank" rel="noopener">Automa Factory</a>.',
	landmarks: [
		{
			track:'technology',
			details: [
				{
					buildingName: 'Forge',
					buildingClass: 'technology-1-forge',
					buttonClass: 'technology1forge',
					buildingHeight: 'tall',
					imageName: 'technology-1',
					available: 'true',
					trackNum: 4
				},
				{
					buildingName: 'Rubber Works',
					buildingClass: 'technology-2-rubberWorks',
					buttonClass: 'technology2rubberWorks',
					buildingHeight: 'medium',
					imageName: 'technology-2',
					available: 'true', 
					trackNum: 7
				},
				{
					buildingName: 'Tech Hub',
					buildingClass: 'technology-3-techHub',
					buttonClass: 'technology3techHub',
					buildingHeight: 'tall',
					imageName: 'technology-3',
					available: 'true',
					trackNum: 10
				}
			]
		},
		{
			track:'military',
			details: [
				{
					buildingName: 'Barracks',
					buildingClass: 'military-1-barracks',
					buttonClass: 'military1barracks',
					buildingHeight: 'medium',
					imageName: 'military-1',
					available: 'true',
					trackNum: 4
				},
				{
					buildingName: 'Tank Factory',
					buildingClass: 'military-2-tankFactory',
					buttonClass: 'military2tankFactory',
					buildingHeight: 'medium',
					imageName: 'military-2',
					available: 'true',
					trackNum: 7
				},
				{
					buildingName: 'Fusion Reactor',
					buildingClass: 'military-3-fusionReactor',
					buttonClass: 'military3fusionReactor',
					buildingHeight: 'tall',
					imageName: 'military-3',
					available: 'true',
					trackNum: 10
				}
			]
		},
		{
			track:'exploration',
			details: [
				{
					buildingName: 'Lighthouse',
					buildingClass: 'exploration-1-lighthouse',
					buttonClass: 'exploration1lighthouse',
					buildingHeight: 'tall',
					imageName: 'exploration-1',
					available: 'true',
					trackNum: 4
				},
				{
					buildingName: 'Train Station',
					buildingClass: 'exploration-2-trainStation',
					buttonClass: 'exploration2trainStation',
					buildingHeight: 'medium',
					imageName: 'exploration-2',
					available: 'true',
					trackNum: 7
				},
				{
					buildingName: 'Launch Pad',
					buildingClass: 'exploration-3-launchPad',
					buttonClass: 'exploration3launchPad',
					buildingHeight: 'tall',
					imageName: 'exploration-3',
					available: 'true',
					trackNum: 10
				}
			]
		},
		{
			track:'science',
			details: [
				{
					buildingName: 'Apothecary',
					buildingClass: 'science-1-apothecary',
					buttonClass: 'science1apothecary',
					buildingHeight: 'medium',
					imageName: 'science-1',
					available: 'true',
					trackNum: 4
				},
				{
					buildingName: 'Academy',
					buildingClass: 'science-2-academy',
					buttonClass: 'science2academy',
					buildingHeight: 'medium',
					imageName: 'science-2',
					available: 'true',
					trackNum: 7
				},
				{
					buildingName: 'Laboratory',
					buildingClass: 'science-3-laboratory',
					buttonClass: 'science3laboratory',
					buildingHeight: 'tall',
					imageName: 'science-3',
					available: 'true',
					trackNum: 10
				}
			]
		},
		{
			track:'arts',
			details: [
				{
					buildingName: 'Clocktower',
					buildingClass: 'arts-1-clocktower',
					buttonClass: 'arts1clocktower',
					buildingHeight: 'tall',
					imageName: 'arts-1',
					available: 'true',
					trackNum: 4
				},
				{
					buildingName: 'Opera House',
					buildingClass: 'arts-2-operaHouse',
					buttonClass: 'arts2operaHouse',
					buildingHeight: 'medium',
					imageName: 'arts-2',
					available: 'true',
					trackNum: 7
				},
				{
					buildingName: 'Holocenter',
					buildingClass: 'arts-3-holocenter',
					buttonClass: 'arts3holocenter',
					buildingHeight: 'tall',
					imageName: 'arts-3',
					available: 'true',
					trackNum: 10
				}
			]
		}
	],
	landmarkSpaces: [4, 7, 10],
	firstCardInfo: {},
	secondCardInfo: {},
	firstToReachEra: 'false',
	currentIncomeStep: 1,
	quickStart: 'a-se-auto',
	automaLevel6Tracks: ['military', 'exploration', 'technology', 'science'],
	automaLevel6TrackNum: 0,
	currentMode: 'game',
	scienceDieMove: 'false',
	incomePoints: {
		era2: 0,
		era3: 0,
		era4: 0,
		era5: 0,
		total: 0
	},
	map: {
		tiles: [
			{
				tile: '0',
				control: 'neutral', // neutral, automa, human
				twoOutposts: 'false',
				automaConquersHuman: 'false',
				boardTile: 'true', // true, false
				explored: 'true',
				neighbours: [
					[1, 4, 2],
					[3, 6, 9, 7, 5],
					[8, 12, 16, 13, 10],
					[11, 15, 19, 23, 20, 17, 14],
					[18, 22, 26, 30, 27, 24, 21],
					[25, 29, 32, 33, 31, 28]
				],
				nextTo: ['NA', 'NA', 1, 4, 2, 'NA'],
				startingTile: 'false',
				row: 1,
				column: 4
			},
			{
				tile: '1',
				control: 'neutral', // neutral, automa, human
				twoOutposts: 'false',
				automaConquersHuman: 'false',
				boardTile: 'false', // true, false
				explored: 'false',
				neighbours: [
					[3, 6, 4, 0],
					[8, 12, 9, 7, 2],
					[11, 15, 19, 16, 13, 10, 5],
					[18, 22, 26, 23, 20, 17, 14],
					[25, 29, 32, 30, 27, 24, 21],
					[33, 31, 28]
				],
				nextTo: ['NA', 'NA', 3, 6, 4, 0],
				startingTile: 'false',
				row: 2,
				column: 3
			},
			{
				tile: '2',
				control: 'neutral', // neutral, automa, human
				twoOutposts: 'false',
				automaConquersHuman: 'false',
				boardTile: 'false', // true, false
				explored: 'false',
				neighbours: [
					[0, 4, 7, 5],
					[1, 6, 9, 13, 10],
					[3, 8, 12, 16, 20, 17, 14],
					[11, 15, 19, 23, 27, 24, 21],
					[18, 22, 26, 30, 33, 31, 28],
					[25, 29, 32]
				],
				nextTo: ['NA', 0, 4, 7, 5, 'NA'],
				startingTile: 'false',
				row: 2,
				column: 5
			},
			{
				tile: '3',
				control: 'neutral', // neutral, automa, human
				twoOutposts: 'false',
				automaConquersHuman: 'false',
				boardTile: 'false', // true, false
				explored: 'false',
				neighbours: [
					[8, 6, 1],
					[11, 15, 12, 9, 4, 0],
					[18, 22, 19, 16, 13, 7, 2],
					[25, 29, 26, 23, 20, 17, 10, 5],
					[32, 30, 27, 24, 21, 14],
					[33, 31, 28]
				],
				nextTo: ['NA', 'NA', 'NA', 8, 6, 1],
				startingTile: 'false',
				row: 3,
				column: 2
			},
			{
				tile: '4',
				control: 'neutral', // neutral, automa, human
				twoOutposts: 'false',
				automaConquersHuman: 'false',
				boardTile: 'true', // true, false
				explored: 'true',
				neighbours: [
					[0, 1, 6, 9, 7, 2],
					[3, 8, 12, 16, 13, 10, 5],
					[11, 15, 19, 23, 20, 17, 14],
					[18, 22, 26, 30, 27, 24, 21],
					[25, 29, 32, 33, 31, 28]
				],
				nextTo: [0, 1, 6, 9, 7, 2],
				startingTile: 'false',
				row: 3,
				column: 4
			},
			{
				tile: '5',
				control: 'neutral', // neutral, automa, human
				twoOutposts: 'false',
				automaConquersHuman: 'false',
				boardTile: 'false', // true, false
				explored: 'false',
				neighbours: [
					[2, 7, 10],
					[0, 4, 9, 13, 17, 14],
					[1, 6, 12, 16, 20, 24, 21],
					[3, 8, 15, 19, 23, 27, 31, 28],
					[11, 18, 22, 26, 30, 33],
					[25, 29, 32]
				],
				nextTo: ['NA', 2, 7, 10, 'NA', 'NA'],
				startingTile: 'false',
				row: 3,
				column: 6
			},
			{
				tile: '6',
				control: 'neutral', // neutral, automa, human
				twoOutposts: 'false',
				automaConquersHuman: 'false',
				boardTile: 'true', // true, false
				explored: 'true',
				neighbours: [
					[1, 3, 8, 12, 9, 4],
					[11, 15, 19, 16, 13, 7, 2, 0],
					[18, 22, 26, 23, 20, 17, 10, 5],
					[25, 29, 32, 30, 27, 24, 21, 14],
					[33, 31, 28]
				],
				nextTo: [1, 3, 8, 12, 9, 4],
				startingTile: 'false',
				row: 4,
				column: 3
			},
			{
				tile: '7',
				control: 'neutral', // neutral, automa, human
				twoOutposts: 'false',
				automaConquersHuman: 'false',
				boardTile: 'true', // true, false
				explored: 'true',
				neighbours: [
					[2, 4, 9, 13, 10, 5],
					[0, 1, 6, 12, 16, 20, 17, 14],
					[3, 8, 15, 19, 23, 27, 24, 21],
					[11, 18, 22, 26, 30, 33, 31, 28],
					[25, 29, 32]
				],
				nextTo: [2, 4, 9, 13, 10, 5],
				startingTile: 'false',
				row: 4,
				column: 5
			},
			{
				tile: '8',
				control: 'neutral', // neutral, automa, human
				twoOutposts: 'false',
				automaConquersHuman: 'false',
				boardTile: 'false', // true, false
				explored: 'false',
				neighbours: [
					[11, 15, 12, 6, 3],
					[18, 22, 19, 16, 9, 4, 1],
					[25, 29, 26, 23, 20, 13, 7, 2, 0],
					[32, 30, 27, 24, 17, 10, 5],
					[33, 31, 28, 21, 14]
				],
				nextTo: [3, 'NA', 11, 15, 12, 6],
				startingTile: 'false',
				row: 5,
				column: 2
			},
			{
				tile: '9',
				control: 'neutral', // neutral, automa, human
				twoOutposts: 'false',
				automaConquersHuman: 'false',
				boardTile: 'false', // true, false
				explored: 'false',
				neighbours: [
					[6, 12, 16, 13, 7, 4],
					[0, 1, 3, 8, 15, 19, 23, 20, 17, 10, 5, 2],
					[11, 18, 22, 26, 30, 27, 24, 21, 14],
					[25, 29, 32, 33, 31, 28]
				],
				nextTo: [4, 6, 12, 16, 13, 7],
				startingTile: 'false',
				row: 5,
				column: 4
			},
			{
				tile: '10',
				control: 'neutral', // neutral, automa, human
				twoOutposts: 'false',
				automaConquersHuman: 'false',
				boardTile: 'false', // true, false
				explored: 'false',
				neighbours: [
					[5, 7, 13, 17, 14],
					[2, 4, 9, 16, 20, 24, 21],
					[0, 1, 6, 12, 19, 23, 27, 31, 28],
					[3, 8, 15, 22, 26, 30, 33],
					[11, 18, 25, 29, 32],
				],
				nextTo: [5, 7, 13, 17, 14, 'NA'],
				startingTile: 'false',
				row: 5,
				column: 6
			},
			{
				tile: '11',
				control: 'neutral', // neutral, automa, human
				twoOutposts: 'false',
				automaConquersHuman: 'false',
				boardTile: 'false', // true, false
				explored: 'false',
				neighbours: [
					[18, 15, 8],
					[25, 22, 19, 12, 6, 3],
					[29, 26, 23, 16, 9, 4, 1],
					[32, 30, 27, 20, 13, 7, 2, 0],
					[33, 31, 24, 17, 10, 5],
					[28, 21, 14]
				],
				nextTo: ['NA', 'NA', 'NA', 18, 15, 8],
				startingTile: 'false',
				row: 6,
				column: 1
			},
			{
				tile: '12',
				control: 'neutral', // neutral, automa, human
				twoOutposts: 'false',
				automaConquersHuman: 'false',
				boardTile: 'false', // true, false
				explored: 'false',
				neighbours: [
					[8, 15, 19, 16, 9, 6],
					[11, 18, 22, 26, 23, 20, 13, 7, 4, 1, 3],
					[25, 29, 32, 30, 27, 24, 17, 10, 5, 2, 0],
					[33, 31, 28, 21, 14]
				],
				nextTo: [6, 8, 15, 19, 16, 9],
				startingTile: 'false',
				row: 6,
				column: 3
			},
			{
				tile: '13',
				control: 'neutral', // neutral, automa, human
				twoOutposts: 'false',
				automaConquersHuman: 'false',
				boardTile: 'false', // true, false
				explored: 'false',
				neighbours: [
					[9, 16, 20, 17, 10, 7],
					[5, 2, 4, 6, 12, 19, 23, 27, 24, 21, 14],
					[0, 1, 3, 8, 15, 22, 26, 30, 33, 31, 28],
					[11, 18, 25, 29, 32]
				],
				nextTo: [7, 9, 16, 20, 17, 10],
				startingTile: 'false',
				row: 6,
				column: 5
			},
			{
				tile: '14',
				control: 'neutral', // neutral, automa, human
				twoOutposts: 'false',
				automaConquersHuman: 'false',
				boardTile: 'false', // true, false
				explored: 'false',
				neighbours: [
					[10, 17, 21],
					[5, 7, 13, 20, 24, 28],
					[2, 4, 9, 16, 23, 27, 31],
					[0, 1, 6, 12, 19, 26, 30, 33],
					[3, 8, 15, 22, 29, 32],
					[11, 18, 25]
				],
				nextTo: [10, 17, 21, 'NA', 'NA', 'NA'],
				startingTile: 'false',
				row: 6,
				column: 7
			},
			{
				tile: '15',
				control: 'neutral', // neutral, automa, human
				twoOutposts: 'false',
				automaConquersHuman: 'false',
				boardTile: 'true', // true, false
				explored: 'true',
				neighbours: [
					[11, 18, 22, 19, 12, 8],
					[25, 29, 26, 23, 16, 9, 6, 3],
					[32, 30, 27, 20, 13, 7, 4, 1],
					[33, 31, 24, 17, 10, 5, 2, 0],
					[28, 21, 14]
				],
				nextTo: [8, 11, 18, 22, 19, 12],
				startingTile: 'false',
				row: 7,
				column: 2
			},
			{
				tile: '16',
				control: 'neutral', // neutral, automa, human
				twoOutposts: 'false',
				automaConquersHuman: 'false',
				boardTile: 'true', // true, false
				explored: 'true',
				neighbours: [
					[12, 19, 23, 20, 13, 9],
					[8, 15, 22, 26, 30, 27, 24, 17, 10, 7, 4, 6],
					[0, 1, 3, 11, 18, 25, 29, 32, 33, 31, 28, 21, 14, 5, 2]
				],
				nextTo: [9, 12, 19, 23, 20, 13],
				startingTile: 'false',
				row: 7,
				column: 4
			},
			{
				tile: '17',
				control: 'neutral', // neutral, automa, human
				twoOutposts: 'false',
				automaConquersHuman: 'false',
				boardTile: 'true', // true, false
				explored: 'true',
				neighbours: [
					[10, 13, 20, 24, 21, 14],
					[5, 7, 9, 16, 23, 27, 31, 28],
					[2, 4, 6, 12, 19, 26, 30, 33],
					[0, 1, 3, 8, 15, 22, 29, 32],
					[11, 18, 25]
				],
				nextTo: [10, 13, 20, 24, 21, 14],
				startingTile: 'false',
				row: 7,
				column: 6
			},
			{
				tile: '18',
				control: 'neutral', // neutral, automa, human
				twoOutposts: 'false',
				automaConquersHuman: 'false',
				boardTile: 'false', // true, false
				explored: 'false',
				neighbours: [
					[25, 22, 15, 11],
					[29, 26, 19, 12, 8],
					[32, 30, 23, 16, 9, 6, 3],
					[33, 27, 20, 13, 7, 4, 1],
					[31, 24, 17, 10, 5, 2, 0],
					[28, 21, 14]
				],
				nextTo: [11, 'NA', 'NA', 25, 22, 19],
				startingTile: 'false',
				row: 8,
				column: 1
			},
			{
				tile: '19',
				control: 'neutral', // neutral, automa, human
				twoOutposts: 'false',
				automaConquersHuman: 'false',
				boardTile: 'false', // true, false
				explored: 'false',
				neighbours: [
					[12, 15, 22, 26, 23, 16],
					[6, 8, 11, 18, 25, 29, 32, 30, 27, 20, 13, 9],
					[33, 31, 24, 17, 10, 7, 4, 1, 3],
					[28, 21, 14, 5, 2, 0]
				],
				nextTo: [12, 15, 22, 26, 23, 16],
				startingTile: 'false',
				row: 8,
				column: 3
			},
			{
				tile: '20',
				control: 'neutral', // neutral, automa, human
				twoOutposts: 'false',
				automaConquersHuman: 'false',
				boardTile: 'false', // true, false
				explored: 'false',
				neighbours: [
					[13, 16, 23, 27, 24, 17],
					[7, 9, 12, 19, 26, 30, 33, 31, 28, 21, 14, 10],
					[5, 2, 4, 6, 8, 15, 22, 29, 32],
					[0, 1, 3, 11, 18, 25]
				],
				nextTo: [13, 16, 23, 27, 24, 17],
				startingTile: 'false',
				row: 8,
				column: 5
			},
			{
				tile: '21',
				control: 'neutral', // neutral, automa, human
				twoOutposts: 'false',
				automaConquersHuman: 'false',
				boardTile: 'false', // true, false
				explored: 'false',
				neighbours: [
					[14, 17, 24, 28],
					[10, 13, 20, 27, 31],
					[5, 7, 9, 16, 23, 30, 33],
					[2, 4, 6, 12, 19, 26, 32],
					[0, 1, 3, 8, 15, 22, 29],
					[11, 18, 25]
				],
				nextTo: [14, 17, 24, 28, 'NA', 'NA'],
				startingTile: 'false',
				row: 8,
				column: 7
			},
			{
				tile: '22',
				control: 'automa', // neutral, automa, human
				twoOutposts: 'true',
				automaConquersHuman: 'false',
				boardTile: 'true', // true, false
				explored: 'true',
				neighbours: [
					[18, 25, 29, 26, 19, 15],
					[32, 30, 23, 16, 12, 8, 11],
					[33, 27, 20, 13, 9, 6, 3],
					[31, 24, 17, 10, 7, 4, 1],
					[28, 21, 14, 5, 2, 0]
				],
				nextTo: [15, 18, 25, 29, 26, 19],
				startingTile: 'true',
				row: 9,
				column: 2
			},
			{
				tile: '23',
				control: 'neutral', // neutral, automa, human
				twoOutposts: 'false',
				automaConquersHuman: 'false',
				boardTile: 'false', // true, false
				explored: 'false',
				neighbours: [
					[16, 19, 26, 30, 27, 20],
					[9, 12, 15, 22, 29, 32, 33, 31, 24, 17, 13],
					[28, 21, 14, 10, 7, 4, 6, 8, 11, 18, 25],
					[5, 2, 0, 1, 3]
				],
				nextTo: [16, 19, 26, 30, 27, 20],
				startingTile: 'false',
				row: 9,
				column: 4
			},
			{
				tile: '24',
				control: 'human', // neutral, automa, human
				twoOutposts: 'true',
				automaConquersHuman: 'false',
				boardTile: 'true', // true, false
				explored: 'true',
				neighbours: [
					[17, 20, 27, 31, 28, 21],
					[14, 10, 13, 16, 23, 30, 33],
					[5, 7, 9, 12, 19, 26, 32],
					[2, 4, 6, 8, 15, 22, 29],
					[0, 1, 3, 11, 18, 25]
				],
				nextTo: [17, 20, 27, 31, 28, 21],
				startingTile: 'true',
				row: 9,
				column: 6
			},
			{
				tile: '25',
				control: 'neutral', // neutral, automa, human
				twoOutposts: 'false',
				automaConquersHuman: 'false',
				boardTile: 'true', // true, false
				explored: 'true',
				neighbours: [
					[29, 22, 18],
					[32, 26, 19, 15, 11],
					[30, 23, 16, 12, 8],
					[33, 27, 20, 13, 9, 6, 3],
					[31, 24, 17, 10, 7, 4, 1],
					[28, 21, 14, 5, 2, 0]
				],
				nextTo: [18, 'NA', 'NA', 'NA', 29, 22],
				startingTile: 'false',
				row: 10,
				column: 1
			},
			{
				tile: '26',
				control: 'neutral', // neutral, automa, human
				twoOutposts: 'false',
				automaConquersHuman: 'false',
				boardTile: 'true', // true, false
				explored: 'true',
				neighbours: [
					[19, 22, 29, 32, 30, 23],
					[33, 27, 20, 16, 12, 15, 18, 25],
					[31, 24, 17, 13, 9, 6, 8, 11],
					[28, 21, 14, 10, 7, 4, 1, 3],
					[5, 2, 0]
				],
				nextTo: [19, 22, 29, 32, 30, 23],
				startingTile: 'false',
				row: 10,
				column: 3
			},
			{
				tile: '27',
				control: 'neutral', // neutral, automa, human
				twoOutposts: 'false',
				automaConquersHuman: 'false',
				boardTile: 'true', // true, false
				explored: 'true',
				neighbours: [
					[20, 23, 30, 33, 31, 24],
					[28, 21, 17, 13, 16, 19, 26, 32],
					[14, 10, 7, 9, 12, 15, 22, 29],
					[5, 2, 4, 6, 8, 11, 18, 25],
					[0, 1, 3]
				],
				nextTo: [20, 23, 30, 33, 31, 24],
				startingTile: 'false',
				row: 10,
				column: 5
			},
			{
				tile: '28',
				control: 'neutral', // neutral, automa, human
				twoOutposts: 'false',
				automaConquersHuman: 'false',
				boardTile: 'true', // true, false
				explored: 'true',
				neighbours: [
					[21, 24, 31],
					[14, 17, 20, 27, 33],
					[10, 13, 16, 23, 30],
					[5, 7, 9, 12, 19, 26, 32],
					[2, 4, 6, 8, 15, 22, 29],
					[0, 1, 3, 11, 18, 25]
				],
				nextTo: [21, 24, 31, 'NA', 'NA', 'NA'],
				startingTile: 'false',
				row: 10,
				column: 7
			},
			{
				tile: '29',
				control: 'neutral', // neutral, automa, human
				twoOutposts: 'false',
				automaConquersHuman: 'false',
				boardTile: 'false', // true, false
				explored: 'false',
				neighbours: [
					[32, 26, 22, 25],
					[30, 23, 19, 15, 18],
					[33, 27, 20, 16, 12, 8, 11],
					[31, 24, 17, 13, 9, 6, 3],
					[28, 21, 14, 10, 7, 4, 1],
					[5, 2, 0]
				],
				nextTo: [22, 25, 'NA', 'NA', 32, 26],
				startingTile: 'false',
				row: 11,
				column: 2
			},
			{
				tile: '30',
				control: 'neutral', // neutral, automa, human
				twoOutposts: 'false',
				automaConquersHuman: 'false',
				boardTile: 'false', // true, false
				explored: 'false',
				neighbours: [
					[33, 27, 23, 26, 32],
					[31, 24, 20, 16, 19, 22, 29],
					[28, 21, 17, 13, 9, 12, 15, 18, 25],
					[14, 10, 7, 4, 6, 8, 11],
					[5, 2, 0, 1, 3]
				],
				nextTo: [23, 26, 32, 'NA', 33, 27],
				startingTile: 'false',
				row: 11,
				column: 4
			},
			{
				tile: '31',
				control: 'neutral', // neutral, automa, human
				twoOutposts: 'false',
				automaConquersHuman: 'false',
				boardTile: 'false', // true, false
				explored: 'false',
				neighbours: [
					[28, 24, 27, 33],
					[21, 17, 20, 23, 30],
					[14, 10, 13, 16, 19, 26, 32],
					[5, 7, 9, 12, 15, 22, 29],
					[2, 4, 6, 8, 11, 18, 25],
					[0, 1, 3]
				],
				nextTo: [24, 27, 33, 'NA', 'NA', 28],
				startingTile: 'false',
				row: 11,
				column: 6
			},
			{
				tile: '32',
				control: 'neutral', // neutral, automa, human
				twoOutposts: 'false',
				automaConquersHuman: 'false',
				boardTile: 'false', // true, false
				explored: 'false',
				neighbours: [
					[30, 26, 29],
					[33, 27, 23, 19, 22, 25],
					[31, 24, 20, 16, 12, 15, 18],
					[28, 21, 17, 13, 9, 6, 8, 11],
					[14, 10, 7, 4, 1, 3],
					[5, 2, 0]
				],
				nextTo: [26, 29, 'NA', 'NA', 'NA', 30],
				startingTile: 'false',
				row: 12,
				column: 3
			},
			{
				tile: '33',
				control: 'neutral', // neutral, automa, human
				twoOutposts: 'false',
				automaConquersHuman: 'false',
				boardTile: 'false', // true, false
				explored: 'false',
				neighbours: [
					[31, 27, 30],
					[28, 24, 20, 23, 26, 32],
					[21, 17, 13, 16, 19, 22, 29],
					[14, 10, 7, 9, 12, 15, 18, 25],
					[5, 2, 4, 6, 8, 11],
					[0, 1, 3]
				],
				nextTo: [27, 30, 'NA', 'NA', 'NA', 31],
				startingTile: 'false',
				row: 12,
				column: 5
			}
	
		],
		tiebreakers: [
			[0, 2, 5, 1, 4, 7, 10, 14, 3, 6, 9, 13, 17, 21, 8, 12, 16, 20, 24, 28, 11, 15, 19, 23, 27, 31, 18, 22, 26, 30, 33, 25, 29, 32],
			[5, 2, 0, 14, 10, 7, 4, 1, 21, 17, 13, 9, 6, 3, 28, 24, 20, 16, 12, 8, 31, 27, 23, 19, 15, 11, 33, 30, 26, 22, 18, 32, 29, 25],
			[14, 21, 28, 5, 10, 17, 24, 31, 2, 7, 13, 20, 27, 33, 0, 4, 9, 16, 23, 30, 1, 6, 12, 19, 26, 32, 3, 8, 15, 22, 29, 11, 18, 25],
			[28, 21, 14, 31, 24, 17, 10, 5, 33, 27, 20, 13, 7, 2, 30, 23, 16, 9, 4, 0, 32, 26, 19, 12, 6, 1, 29, 22, 15, 8, 3, 25, 18, 11],
			[28, 31, 33, 21, 24, 27, 30, 32, 14, 17, 20, 23, 26, 29, 10, 13, 16, 19, 22, 25, 5, 7, 9, 12, 15, 18, 2, 4, 6, 8, 11, 0, 1, 3],
			[33, 31, 28, 32, 30, 27, 24, 21, 29, 26, 23, 20, 17, 14, 25, 22, 19, 16, 13, 10, 18, 15, 12, 9, 7, 5, 11, 8, 6, 4, 2, 3, 1, 0],
			[32, 29, 25, 33, 30, 26, 22, 18, 31, 27, 23, 19, 15, 11, 28, 24, 20, 16, 12, 8, 21, 17, 13, 9, 6, 3, 14, 10, 7, 4, 1, 5, 2, 0],
			[25, 29, 32, 18, 22, 26, 30, 33, 11, 15, 19, 23, 27, 31, 8, 12, 16, 20, 24, 28, 3, 6, 9, 13, 17, 21, 1, 4, 7, 10, 14, 0, 2, 5],
			[25, 18, 11, 29, 22, 15, 8, 3, 32, 26, 19, 12, 6, 1, 30, 23, 16, 9, 4, 0, 33, 27, 20, 13, 7, 2, 31, 24, 17, 10, 5, 28, 21, 14],
			[11, 18, 25, 3, 8, 15, 22, 29, 1, 6, 12, 19, 26, 32, 0, 4, 9, 16, 23, 30, 2, 7, 13, 20, 27, 33, 5, 10, 17, 24, 31, 14, 21, 28]
		]
	},
	achievements: {
		endOfTrack: ['available', 'available'],
		toppleTwoOutposts: ['available', 'available'],
		conquerMiddleIsland: ['available', 'available']
	}
}

function preloadImgsCallback(){
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`preloadImgsCallback func triggered`);
    setTimeout(function(){
		$('<script type="text/javascript" src="js/map.js"></script>').appendTo('body');
		expansionBoxInterval = setInterval(insertExpansionCheckbox, 100);
    }, 400);
};

function insertExpansionCheckbox() {
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`insertExpansionCheckbox() func triggered`);

	if($('#setupSummary').length != 0) {
		if(DEBUG_GAME) console.log(`$('#setupSummary').length != 0 condition met`);
		clearInterval(expansionBoxInterval);

		if(localStorage.getItem(init.code) !== null) {
			if(DEBUG_GAME) console.log(`localStorage.getItem(init.code) !== null condition met`);
			savedData = JSON.parse(localStorage.getItem(init.code));
		}

		generateAllHTML();

		if(savedData) {
			loadData('savedData', savedData);
		} else {
			loadData('newData', game);
		}

	}
}

function updateGameVersion() {
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`updateGameVersion() func triggered`);
	if(DEBUG_GAME) console.log(`game.expansions => '${game.expansions}'`);

	if(DEBUG_GAME) console.log(`$('#plansPloysCheckbox').prop("checked") => '${$('#plansPloysCheckbox').prop("checked")}'`);
	if(DEBUG_GAME) console.log(`$('#artsArchitectureCheckbox').prop("checked") => '${$('#artsArchitectureCheckbox').prop("checked")}'`);

	if($('#plansPloysCheckbox').prop("checked")) {
		if(DEBUG_GAME) console.log(`$('#plansPloysCheckbox').prop("checked") condition met`);
		if(game.expansions.indexOf('plansPloys') == -1) {
			if(DEBUG_GAME) console.log(`game.expansions.indexOf('plansPloys') == -1 condition met`);
			game.expansions.push('plansPloys');
		}
	} else {
		if(DEBUG_GAME) console.log(`!$('#plansPloysCheckbox').prop("checked") condition met`);
		if(game.expansions.indexOf('plansPloys') != -1) {
			if(DEBUG_GAME) console.log(`game.expansions.indexOf('plansPloys') != -1 condition met`);
			let plansPloysIndex = game.expansions.indexOf('plansPloys');
			game.expansions.splice(plansPloysIndex,1);
		}
	}

	if($('#artsArchitectureCheckbox').prop("checked")) {
		if(DEBUG_GAME) console.log(`$('#artsArchitectureCheckbox').prop("checked") condition met`);
		aaExp = true;
		if(game.expansions.indexOf('artsArchitecture') == -1) {
			if(DEBUG_GAME) console.log(`game.expansions.indexOf('artsArchitecture') == -1 condition met`);
			game.expansions.push('artsArchitecture');
			artsExpansionConfig(aaExp, false);
		}
	} else {
		if(DEBUG_GAME) console.log(`!$('#artsArchitectureCheckbox').prop("checked") condition met`);
		aaExp = false;
		if(game.expansions.indexOf('artsArchitecture') !== -1) {
			if(DEBUG_GAME) console.log(`game.expansions.indexOf('artsArchitecture') != -1 condition met`);
			let artsArchitectureIndex = game.expansions.indexOf('artsArchitecture');
			game.expansions.splice(artsArchitectureIndex,1);
			artsExpansionConfig(aaExp, false);
		}
	}

	if(!$('#plansPloysCheckbox').prop("checked") && !$('#artsArchitectureCheckbox').prop("checked")) {
		localStorage.setItem('tp-expansions', '');
	} else {
		localStorage.setItem('tp-expansions', JSON.stringify(game.expansions));
	}

}

$(document).on('input', '.slider', function() {

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`.slider input detected`);
	if(DEBUG_GAME) console.log(`$('.slider input').val() => '${$(this).val()}'`);
	let newDifficultyLevel = parseInt($(this).val());
	updateDifficultyLevel(newDifficultyLevel, 'slider');
});

$(document).on('change', '#quickStartAutomaDifficultySelectID', function() {
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`#quickStartAutomaDifficultySelectID change detected`);
	if(DEBUG_GAME) console.log(`$('#quickStartAutomaDifficultySelectID').val() => '${$('#quickStartAutomaDifficultySelectID').val()}'`);
	let newDifficultyLevel = parseInt($('#quickStartAutomaDifficultySelectID').val());
	updateDifficultyLevel(newDifficultyLevel, 'quickStart');
});


function checkSavedDifficultyLevel() {

	if(localStorage.getItem('tp-difficulty') !== null) {

		let savedDifficulty = localStorage.getItem('tp-difficulty');
		if(DEBUG_GAME) console.log(`savedDifficulty => '${savedDifficulty}'`);

		if(savedDifficulty == 'automaUnderachiever') {							
			game.difficultyLevelNum = 0;
		} else if(savedDifficulty == 'automaAverage') {							
			game.difficultyLevelNum = 1;
		} else if(savedDifficulty == 'automaSlightlyIntimidating') {							
			game.difficultyLevelNum = 2;
		} else if(savedDifficulty == 'automaSomewhatAwesome') {							
			game.difficultyLevelNum = 3;
		} else if(savedDifficulty == 'automaDefinitelyAwesome') {							
			game.difficultyLevelNum = 4;
		} else if(savedDifficulty == 'automaCrusherDreams') {							
			game.difficultyLevelNum = 5;
		}
		updateDifficultyLevel(game.difficultyLevelNum, 'savedDifficulty');
	} else {
		game.difficultyLevelNum = 0;
		updateDifficultyLevel(game.difficultyLevelNum, 'quickStart');
	}
}

sliderMoved = 'false';

function updateDifficultyLevel(automaLevelNum, mode) {

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`updateDifficultyLevel() func triggered`);
	if(DEBUG_GAME) console.log(`automaLevelNum => '${automaLevelNum}'`);
	if(DEBUG_GAME) console.log(`mode => '${mode}'`);

	if(mode == 'slider' || mode == 'savedDifficulty') $(`#quickStartAutomaDifficultySelectID option[value="${automaLevelNum}"]`).prop('selected', true);
	if(mode == 'quickStart') $('#difficultyLevelLayer .slider').val(automaLevelNum);
	if(mode != 'savedDifficulty') localStorage.setItem('tp-difficulty', game.difficultySpecs.class);
	if(sliderMoved == 'false' && mode == 'slider') {
		if(DEBUG_GAME) console.log(`sliderMoved == 'false' condition met`);
		difficultyInstructions();
		sliderMoved = 'true';
	}
	
	game.difficultyLevelNum = parseInt(automaLevelNum);

	if(aaExp && game.difficultyLevelNum < 4) {
		game.difficultySpecs = JSON.parse(JSON.stringify(aaDifficultyLevels[automaLevelNum]));
		localStorage.setItem('tp-difficulty', aaDifficultyLevels[automaLevelNum].class);
		game.automaMat = aaDifficultyLevels[automaLevelNum].automaMat;
	} else {
		game.difficultySpecs = JSON.parse(JSON.stringify(difficultyLevels[automaLevelNum]));
		localStorage.setItem('tp-difficulty', difficultyLevels[automaLevelNum].class);
		game.automaMat = difficultyLevels[automaLevelNum].automaMat;
	}

	game.difficultySpecs.automaMat = automaMatMultipliers[game.automaMat];
	
	if(DEBUG_GAME) console.log(`game.difficultySpecs.name => '${game.difficultySpecs.name}'`);
	if(DEBUG_GAME) console.log(`game.difficultySpecs.level => '${game.difficultySpecs.level}'`);
	if(DEBUG_GAME) console.log(`game.difficultySpecs.automaMat => '${game.difficultySpecs.automaMat}'`);
	
	let levelNum = parseInt(game.difficultySpecs.level);

	let automaMatAndDifficultyHTML = `
		<div id="difficultyInformationPanel">
	`;
	
	if(game.difficultySpecs.extraInfo == 'true') {
		automaMatAndDifficultyHTML += `
			<p class="automaLevelHeading">${game.difficultySpecs.name}</p>
			<img id="automaDifficultyExtraInfo" src="img/difficulty/level${levelNum}ExtraInfo.jpg" />
		`;
	} else {
		automaMatAndDifficultyHTML += `
			<p class="automaLevelHeading noExtraInfo">${game.difficultySpecs.name}</p>
		`;
	}

	automaMatAndDifficultyHTML += `
		</div>
		<img id="automaDifficultyLevelCardHelpIcon" class="helpLink helpLink-incomeTurn" src="img/help.png" />
		<img id="automaDifficultyLevelCard" src="img/difficulty/level${levelNum}${aaExp && levelNum < 5 ? `-aa` : ``}.jpg" />
		<div class="clearDiv"></div>
		<img id="automaDifficultyAutomaMat" src="img/difficulty/automa-mat-${game.automaMat}${aaExp ? `-aa` : ``}.jpg" />
	`;
	
	$('#automaDifficultyContent').html(automaMatAndDifficultyHTML);

	if(mode == 'slider') {
		if(automaLevelNum == '5') {
			if(DEBUG_GAME) console.log(`automaLevelNum == '5' condition met`);
			$('#fullAutomaStartButton').addClass('func-chooseSecondCivOnAutomaMatScreen').removeClass('func-showLayer-game func-gameButtons func-initActionArea func-automaIncome1Setup');
		} else {
			if(DEBUG_GAME) console.log(`automaLevelNum != '5' condition met`);
			$('#fullAutomaStartButton').addClass('func-showLayer-game func-gameButtons func-initActionArea func-automaIncome1Setup').removeClass('func-chooseSecondCivOnAutomaMatScreen ');
		}
	}

	showHideSecondCiv();
}

function difficultyInstructions() {
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`difficultyInstructions() func triggered`);
	$('#difficultyLevelLayer #automaDifficultyContent').removeClass('instructionOverlay');
	$('#difficultyLevelLayer #difficultyInstructions').fadeOut('slow');
	$('#fullAutomaStartButton').removeClass('greyBtn').addClass('greenBtn func-initActionArea func-showLayer-game func-gameButtons func-updateGame');
	$('#difficultyLevelLayer').attr('slidermoved', 'true');
}

function showHideSecondCiv(){

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`showHideSecondCiv() func triggered`);
	if(DEBUG_GAME) console.log(`$('#quickStartAutomaDifficultySelectID').val() => '${$('#quickStartAutomaDifficultySelectID').val()}'`);

	if($('#quickStartAutomaDifficultySelectID').val() == '5') {
		if(DEBUG_GAME) console.log(`$('#quickStartAutomaDifficultySelectID').val() == '5' condition met`);
		$('.automaSecondCiv').show();
	} else {
		if(DEBUG_GAME) console.log(`$('#quickStartAutomaDifficultySelectID').val() != '5' condition met`);
		$('.automaSecondCiv').hide();
	}
}

function showDefaultColorSelections() {
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`loadDefaultsColors() func triggered`);

	$(`#fullAutomaConfigColorChoiceLayer .humanColor .outpostColor.color-${game.humanInfo.color}`).addClass('chosenColor'); // blue
	$(`#quickStartHumanColorSelectID option[value="${game.humanInfo.color}"]`).prop('selected', true); // blue

	$(`#fullAutomaConfigColorChoiceLayer .automaColor .outpostColor.color-${game.automaInfo.color}`).addClass('chosenColor'); // red
	$(`#quickStartAutomaColorSelectID option[value="${game.automaInfo.color}"]`).prop('selected', true); // red

	$(`#fullAutomaConfigColorChoiceLayer .shadowEmpireColor .outpostColor.color-${game.shadowEmpireInfo.color}`).addClass('chosenColor'); // grey
	$(`#quickStartShadowEmpireColorSelectID option[value="${game.shadowEmpireInfo.color}"]`).prop('selected', true); // grey

	$(`#shadowEmpireAutomatedSystemLayer #shadowEmpireOnlyColorChoiceContainer .outpostColor.color-${game.shadowEmpireOnlyInfo.color}`).addClass('chosenColor'); // grey
}

$(document).on('change', '#quickStartHumanColorSelectID', function() {
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`#quickStartHumanColorSelectID change detected`);
	thisColor = $('#quickStartHumanColorSelectID').val();
	updateChosenOutpostColor('human', thisColor);
	updateAvailableAutomaColors();
});

$(document).on('change', '#quickStartAutomaColorSelectID', function() {
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`#quickStartAutomaColorSelectID change detected`);
	let thisColor = $('#quickStartAutomaColorSelectID').val();
	updateChosenOutpostColor('automa', thisColor);
	updateAvailableShadowEmpireColors();
});

$(document).on('change', '#quickStartShadowEmpireColorSelectID', function() {
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`#quickStartShadowEmpireColorSelectID change detected`);
	let thisColor = $('#quickStartShadowEmpireColorSelectID').val();
	updateChosenOutpostColor('shadowEmpire', thisColor);
	updateAvailableShadowEmpireColors();
});

$(document).on(touchEvent, '.humanColor.chooseColorContainer .outpostColor:not(.chosenColor)', function() {
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`.humanColor.chooseColorContainer .outpostColor:not(.chosenColor) triggered`);
	var thisColor = classProcessor($(this), 'color', 'split');
	updateChosenOutpostColor('human', thisColor[1]);
	updateChosenQuickStartSelectColor('Human', thisColor[1]);
})

$(document).on(touchEvent, '.automaColor.chooseColorContainer .outpostColor:not(.chosenColor)', function() {
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`.automaColor.chooseColorContainer .outpostColor:not(.chosenColor) triggered`);
	var thisColor = classProcessor($(this), 'color', 'split');
	updateChosenOutpostColor('automa', thisColor[1]);
	updateChosenQuickStartSelectColor('Automa', thisColor[1]);
})

$(document).on(touchEvent, '.shadowEmpireColor.chooseColorContainer .outpostColor:not(.chosenColor)', function() {
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`.shadowEmpireColor.chooseColorContainer .outpostColor:not(.chosenColor) triggered`);
	var thisColor = classProcessor($(this), 'color', 'split');
	updateChosenOutpostColor('shadowEmpire', thisColor[1]);
	updateChosenQuickStartSelectColor('ShadowEmpire', thisColor[1]);
})

$(document).on(touchEvent, '#shadowEmpireOnlyColorChoiceContainer .outpostColor:not(.chosenColor)', function() {
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`#shadowEmpireOnlyColorChoiceContainer .outpostColor:not(.chosenColor) triggered`);
	var thisColor = classProcessor($(this), 'color', 'split');
	updateChosenOutpostColor('shadowEmpireOnly', thisColor[1]);
})

function updateChosenOutpostColor(thisOpponent, thisColor) {
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`updateChosenOutpostColor() func triggered`);
	$(`.${thisOpponent}Color.chooseColorContainer .chosenColor`).removeClass('chosenColor');
	$(`.${thisOpponent}Color.chooseColorContainer .outpostColor.color-${thisColor}`).addClass('chosenColor');
	game[`${thisOpponent}Info`].color = thisColor;
	if(DEBUG_GAME) console.log(`$(.${thisOpponent}Color.chooseColorContainer .outpostColor.color-${thisColor}).addClass('chosenColor')`);
	updateAutomaShadowEmpireTextPreferences();
}

function updateChosenQuickStartSelectColor(thisOpponent, thisColor) {
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`updateChosenQuickStartSelectColor() func triggered`);
	$(`#quickStart${thisOpponent}ColorSelectID option[value="${thisColor}"]`).prop('selected', true);
	game[`${thisOpponent}Info`].color = thisColor;
	if(DEBUG_GAME) console.log(`$(.${thisOpponent}Color.chooseColorContainer .outpostColor.color-${thisColor}).addClass('chosenColor')`);
	updateAutomaShadowEmpireTextPreferences();
}

function updateAvailableAutomaColors(){
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`updateAvailableAutomaColors() func triggered`);

	var availableColors = game.playerColors.slice();
	let humanIndex = availableColors.indexOf($('#quickStartHumanColorSelectID').val());
	if(humanIndex != -1) availableColors.splice(humanIndex, 1);

	$('#quickStartAutomaColorSelectID').html('');

	for (let i = 0; i < availableColors.length; i++) {
		if(DEBUG_GAME) console.log(`availableColors[${i}] => '${availableColors[i]}'`);
		$('#quickStartAutomaColorSelectID').append(`<option value="${availableColors[i]}">${capitalizeFirstLetter(availableColors[i])}</option>`);
	}

	if(game.automaInfo.color) {
		$(`#quickStartAutomaColorSelectID option[value="${game.automaInfo.color}"]`).prop('selected', true);
	}

	updateAvailableShadowEmpireColors();
}

function updateAvailableShadowEmpireColors(){

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`updateAvailableShadowEmpireColors() func triggered`);

	var availableColors = game.playerColors.slice();
	let humanIndex = availableColors.indexOf($('#quickStartHumanColorSelectID').val());
	if(humanIndex != -1) availableColors.splice(humanIndex, 1);
	let automaIndex = availableColors.indexOf($('#quickStartAutomaColorSelectID').val());
	if(automaIndex != -1) availableColors.splice(automaIndex, 1);

	$('#quickStartShadowEmpireColorSelectID').html('')

	for (let i = 0; i < availableColors.length; i++) {
		if(DEBUG_GAME) console.log(`availableColors[${i}] => '${availableColors[i]}'`);
		$('#quickStartShadowEmpireColorSelectID').append(`<option value="${availableColors[i]}">${capitalizeFirstLetter(availableColors[i])}</option>`);
	}

	if(game.shadowEmpireInfo.color) {
		$(`#quickStartShadowEmpireColorSelectID option[value="${game.shadowEmpireInfo.color}"]`).prop('selected', true);
	}
}

function checkAIColors(){
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`checkAIColors() func triggered`);

	if(DEBUG_GAME) console.log(`game.humanInfo.color => '${game.humanInfo.color}'`);
	if(DEBUG_GAME) console.log(`game.automaInfo.color => '${game.automaInfo.color}'`);
	if(DEBUG_GAME) console.log(`game.shadowEmpireInfo.color => '${game.shadowEmpireInfo.color}'`);

	$('#fullAutomaConfigColorChoiceLayer .buttons .btn.greenBtn.func-checkAIColors').removeClass('greenBtn func-checkAIColors').addClass('greyBtn');

	let errorOpponents = [];
	let errorColor = '';

	if(game.humanInfo.color == game.automaInfo.color && game.automaInfo.color == game.shadowEmpireInfo.color) {
		if(DEBUG_GAME) console.log(`game.automaInfo.color == game.humanInfo.color condition met`);
		errorColor = game.humanInfo.color;
		errorOpponents = ['human', 'automa', 'shadowEmpire'];
	} else if(game.humanInfo.color == game.automaInfo.color) {
		if(DEBUG_GAME) console.log(`game.automaInfo.color == game.humanInfo.color condition met`);
		errorColor = game.humanInfo.color;
		errorOpponents = ['human', 'automa'];
	} else if(game.humanInfo.color == game.shadowEmpireInfo.color) {
		if(DEBUG_GAME) console.log(`game.humanInfo.color == game.shadowEmpireInfo.color condition met`);
		errorColor = game.humanInfo.color;
		errorOpponents = ['human', 'shadowEmpire'];
	} else if(game.automaInfo.color == game.shadowEmpireInfo.color) {
		if(DEBUG_GAME) console.log(`game.automaInfo.color == game.shadowEmpireInfo.color condition met`);
		errorColor = game.automaInfo.color;
		errorOpponents = ['automa', 'shadowEmpire'];
	}
	
	if(errorColor == ''){
		if(DEBUG_GAME) console.log(`errorColor == '' condition met`);
		$('#fullAutomaConfigColorChoiceLayer .buttons .btn.greyBtn').removeClass('greyBtn').addClass('greenBtn func-checkAIColors');
		showLayer('fullAutomaConfigTrackChoice');
		updateAutomaShadowEmpireTextPreferences();
	} else {
		for (let i = 0; i < errorOpponents.length; i++) {
			$(`.${errorOpponents[i]}Color.chooseColorContainer`).append(`<img class="outpostColorError ${errorColor}ColorDuplicate" src="img/outposts/error.png">`);
		}
		
		setTimeout(function(){
			$('.chooseColorContainer .outpostColorError').addClass('showColorError');
		}, 50);

		setTimeout(function(){
			$('.chooseColorContainer .outpostColorError').removeClass('showColorError');
		}, 1000);

		setTimeout(function(){
			$('.chooseColorContainer .outpostColorError').remove();
			$('#fullAutomaConfigColorChoiceLayer .buttons .btn.greyBtn').removeClass('greyBtn').addClass('greenBtn func-checkAIColors');
		}, 1500);
	}
}


function updateAutomaShadowEmpireTextPreferences() {
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`updateAutomaShadowEmpireTextPreferences() func triggered`);
	$('.automaColorReplace').removeClass(classProcessor($('.automaColorReplace'), 'color', 'whole'))
	$('.automaColorReplace').html(capitalizeFirstLetter(game.automaInfo.color)).addClass(`color-${game.automaInfo.color}`);
	if(DEBUG_GAME) console.log(`game.automaInfo.color => '${game.automaInfo.color}'`);

	$('.shadowEmpireColorReplace').removeClass(classProcessor($('.shadowEmpireColorReplace'), 'color', 'whole'))
	$('.shadowEmpireColorReplace').html(capitalizeFirstLetter(game.shadowEmpireInfo.color)).addClass(`color-${game.shadowEmpireInfo.color}`);
	if(DEBUG_GAME) console.log(`game.shadowEmpireInfo.color => '${game.shadowEmpireInfo.color}'`);

	$('.shadowEmpireFavTrackReplace').html(capitalizeFirstLetter(game.shadowEmpireInfo.originalFavTrack));
	if(DEBUG_GAME) console.log(`game.automaInfo.originalFavTrack => '${game.automaInfo.originalFavTrack}'`);

	if(DEBUG_GAME) console.log(`game.shadowEmpireInfo:`);
	if(DEBUG_GAME) console.log(game.shadowEmpireInfo);
}

function updateAvailableAutomaCivs(){
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`updateAvailableAutomaCivs() func triggered`);
	game.availableAutomaCivs = [];
	const allCivs = Object.keys(civAbilities);

	if(DEBUG_GAME) console.log(`game.expansions => '${game.expansions}'`);

	let fullAutomaCivOptionsHTML = '';
	let quickStartAutomaCivOptionsHTML = '';

	for (const thisCiv of allCivs) {

		if(civAbilities[thisCiv].gameType == 'base'){
			if(DEBUG_GAME) console.log(`civAbilities[thisCiv].gameType == 'base' condition met`);
			if(DEBUG_GAME) console.log(`thisCiv => '${thisCiv}'`);
			fullAutomaCivOptionsHTML += `<option value="${civAbilities[thisCiv].civID}">${civAbilities[thisCiv].civName} (${civAbilities[thisCiv].trackName} Fav Track)</option>`;
			quickStartAutomaCivOptionsHTML += `<option value="${civAbilities[thisCiv].civID}">${civAbilities[thisCiv].civName}</option>`;
			game.availableAutomaCivs.push(civAbilities[thisCiv].civID);
		}

		if(game.expansions.includes('plansPloys') && civAbilities[thisCiv].gameType == 'plansPloys'){
			if(DEBUG_GAME) console.log(`game.expansions.includes('plansPloys') && civAbilities[thisCiv].gameType == 'expansion' condition met`);
			if(DEBUG_GAME) console.log(`thisCiv => '${thisCiv}'`);
			fullAutomaCivOptionsHTML += `<option value="${civAbilities[thisCiv].civID}">${civAbilities[thisCiv].civName} (${civAbilities[thisCiv].trackName} Fav Track)</option>`;
			quickStartAutomaCivOptionsHTML += `<option value="${civAbilities[thisCiv].civID}">${civAbilities[thisCiv].civName}</option>`;
			game.availableAutomaCivs.push(civAbilities[thisCiv].civID);
		}

		if(game.expansions.includes('artsArchitecture') && civAbilities[thisCiv].gameType == 'artsArchitecture'){
			if(DEBUG_GAME) console.log(`game.expansions.includes('artsArchitecture') && civAbilities[thisCiv].gameType == 'expansion' condition met`);
			if(DEBUG_GAME) console.log(`thisCiv => '${thisCiv}'`);
			fullAutomaCivOptionsHTML += `<option value="${civAbilities[thisCiv].civID}">${civAbilities[thisCiv].civName} (${civAbilities[thisCiv].trackName} Fav Track)</option>`;
			quickStartAutomaCivOptionsHTML += `<option value="${civAbilities[thisCiv].civID}">${civAbilities[thisCiv].civName}</option>`;
			game.availableAutomaCivs.push(civAbilities[thisCiv].civID);
		}
	}

	$('#automaCivSelectID').html(fullAutomaCivOptionsHTML);
	$('#quickStartAutomaCivSelectID').html(quickStartAutomaCivOptionsHTML);
	$('#quickStartAutomaSecondCivSelectID').html(quickStartAutomaCivOptionsHTML);

}

function randomizeAutomaData() {

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`randomizeAutomaData() func triggered`);

	chooseRandomAutomaCivAndFavTrack();
	chooseRandomShadowEmpireFavTrack();
	updateShadowEmpireAvailableFavTracks(game.automaInfo.favTrack);
	updateAICivAndFavTracksInfo();
	updateAutomaAvailableSecondCivOptions();
	chooseRandomSecondAutomaCivilization('normal');
	chooseRandomShadowEmpireOnlyFavTrack();
}

function chooseRandomShadowEmpireOnlyFavTrack() {

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`chooseRandomShadowEmpireOnlyFavTrack() func triggered`);

	let randomTrack = Math.floor(Math.random() * parseInt(game.tracks.length));
	$(`#shadowEmpireOnlyFavTrackSelectID option[value="${game.tracks[randomTrack]}"]`).prop('selected', true);
	updateShadowEmpireOnlyIcons(game.tracks[randomTrack]);
}

$(document).on('change', '#shadowEmpireOnlyFavTrackSelectID', function() {
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`#shadowEmpireOnlyFavTrackSelectID change detected`);
	if(DEBUG_GAME) console.log(`$('#shadowEmpireOnlyFavTrackSelectID').val() => '${$('#shadowEmpireOnlyFavTrackSelectID').val()}'`);
	updateShadowEmpireOnlyIcons($('#shadowEmpireOnlyFavTrackSelectID').val());
});

function updateShadowEmpireOnlyIcons(thisTrack) {

	game.shadowEmpireOnlyInfo.favTrack = thisTrack;
	game.shadowEmpireOnlyInfo.originalFavTrack = thisTrack;

	// let favTrackIconsHTML = `
	// 	<img class="heartIcon" src="img/shadowEmpireFavTrack-blank.png" />
	// 	<p class="equalSignText">&#10513;</p>
	// 	<img class="trackIcon" src="img/tracks/${thisTrack}favTrack.png" />
	// 	<div class="clearDiv"></div>
	// `;

	let favTrackIconsHTML = `
		<img class="trackIcon" src="img/tracks/${thisTrack}favTrack.png" />
		<div class="clearDiv"></div>
	`;

	$(`#shadowEmpireOnlyTrackChoiceContainer .favTrackIcons`).html(favTrackIconsHTML);
}


function chooseRandomAutomaCivAndFavTrack() {

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`chooseRandomAutomaCivAndFavTrack() func triggered`);

	if(DEBUG_GAME) console.log(`game.availableAutomaCivs:`);
	if(DEBUG_GAME) console.log(game.availableAutomaCivs);

	if(DEBUG_GAME) console.log(`civAbilities:`);
	if(DEBUG_GAME) console.log(civAbilities);

	let civsNum = game.availableAutomaCivs.length;
	if(DEBUG_GAME) console.log(`civsNum => '${civsNum}'`);

	let randomCivNum = Math.floor(Math.random()*civsNum);
	if(DEBUG_GAME) console.log(`randomCivNum => '${randomCivNum}'`);
	
	let automaCivID = game.availableAutomaCivs[randomCivNum]; 
	if(DEBUG_GAME) console.log(`automaCivID => '${automaCivID}'`);

	let automaFavTrackID = civAbilities[automaCivID].trackID;
	if(DEBUG_GAME) console.log(`automaFavTrackID => '${automaFavTrackID}'`);

	if(automaFavTrackID == 'random') {
		if(DEBUG_GAME) console.log(`automaFavTrackID == 'random' condition met`);
		automaFavTrackID = chooseRandomAutomaFavTrack();		
	}

	game.automaInfo.favTrack = automaFavTrackID;
	game.automaInfo.originalFavTrack = automaFavTrackID;
	game.automaInfo.firstCivSpecs = JSON.parse(JSON.stringify(civAbilities[automaCivID]));

	// $('#automaTrackChoiceContainer #automaCivSelectID').val(game.automaInfo.firstCivSpecs.civID);

	if(DEBUG_GAME) console.log(`game.automaInfo.firstCivSpecs => '${game.automaInfo.firstCivSpecs}'`);

	if(DEBUG_GAME) console.log(`game.automaInfo.favTrack => '${game.automaInfo.favTrack}'`);
	if(DEBUG_GAME) console.log(`game.automaInfo.originalFavTrack => '${game.automaInfo.originalFavTrack}'`);
	if(DEBUG_GAME) console.log(`game.automaInfo.firstCivSpecs.civID => '${game.automaInfo.firstCivSpecs.civID}'`);
}


$(document).on(touchEvent, '#fullAutomaConfigTrackChoiceLayer #randomTrackChoiceContainer #randomizeFavTrackText', function() {
	
	let automaFavTrack = '';
	let validBots = $(this).attr('validbots');

	if(validBots == 'both') {
		if(DEBUG_GAME) console.log(`validBots == 'both' condition met`);
		automaFavTrack = chooseRandomAutomaFavTrack();
	} else {
		if(DEBUG_GAME) console.log(`validBots != 'both' condition met`);
		automaFavTrack = game.automaInfo.favTrack;
		
	}

	updateShadowEmpireAvailableFavTracks(automaFavTrack);
	chooseRandomShadowEmpireFavTrack();
	updateAICivAndFavTracksInfo();
	
})

function chooseRandomAutomaFavTrack() {
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`chooseRandomAutomaFavTrack() func triggered`);
	let randomFavTrackNum = Math.floor(Math.random() * parseInt(game.tracks.length));
	if(DEBUG_GAME) console.log(`randomFavTrackNum => '${randomFavTrackNum}'`);
	automaFavTrackID = game.tracks[randomFavTrackNum];
	if(DEBUG_GAME) console.log(`automaFavTrackID => '${automaFavTrackID}'`);
	finalizeChosenAutomaFavTrack('all', automaFavTrackID)
	return automaFavTrackID;
}

function chooseRandomShadowEmpireFavTrack() {
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`chooseRandomShadowEmpireFavTrack() func triggered`);

	
	let availableShadowEmpireTracks = game.tracks.slice();
	let thisIndex = availableShadowEmpireTracks.indexOf(game.automaInfo.favTrack);
	if(thisIndex != -1)	availableShadowEmpireTracks.splice(thisIndex, 1);

	if(DEBUG_GAME) console.log(`availableShadowEmpireTracks`);
	if(DEBUG_GAME) console.log(availableShadowEmpireTracks);

	let dieResult = Math.floor(Math.random() * (parseInt(game.tracks.length) - 1));
	if(DEBUG_GAME) console.log(`dieResult => '${dieResult}'`);

	game.shadowEmpireInfo.favTrack = availableShadowEmpireTracks[dieResult];
	game.shadowEmpireInfo.originalFavTrack = availableShadowEmpireTracks[dieResult];

	if(DEBUG_GAME) console.log(`game.shadowEmpireInfo.favTrack => '${game.shadowEmpireInfo.favTrack}'`);
}


function updateShadowEmpireAvailableFavTracks(automaFavTrack){

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`updateShadowEmpireAvailableFavTracks() func triggered`);

	if(automaFavTrack == game.shadowEmpireInfo.favTrack) {
		chooseRandomShadowEmpireFavTrack();
		updateAutomaShadowEmpireTextPreferences();
		finalizeChosenShadowEmpireFavTrack('all', game.shadowEmpireInfo.favTrack);
	}

	var availableTracks = game.tracks.slice();
	let thisIndex = availableTracks.indexOf(automaFavTrack);
	if(thisIndex != -1)	availableTracks.splice(thisIndex, 1);

	$('#shadowEmpireFavTrackSelectID').html('');
	$('#quickStartShadowEmpireFavTrackSelectID').html('');

	var shadowEmpireFavTrackHTML = '';

	for (let i = 0; i < availableTracks.length; i++) {
		if(DEBUG_GAME) console.log(`availableTracks[${i}] => '${availableTracks[i]}'`);
		shadowEmpireFavTrackHTML += `<option value="${availableTracks[i]}"${availableTracks[i] == game.shadowEmpireInfo.favTrack ? ` selected` : ``}>${capitalizeFirstLetter(availableTracks[i])}</option>`;
	}

	$('#shadowEmpireFavTrackSelectID').html(shadowEmpireFavTrackHTML);
	$('#quickStartShadowEmpireFavTrackSelectID').html(shadowEmpireFavTrackHTML);

}


function updateAICivAndFavTracksInfo() {

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`updateAICivAndFavTracksInfo() func triggered`);

	if(DEBUG_GAME) console.log(`game.automaInfo.firstCivSpecs.civID => '${game.automaInfo.firstCivSpecs.civID}'`);
	if(DEBUG_GAME) console.log(`game.automaInfo.favTrack => '${game.automaInfo.favTrack}'`);
	if(DEBUG_GAME) console.log(`game.shadowEmpireInfo.favTrack => '${game.shadowEmpireInfo.favTrack}'`);
	
	$(`#automaCivSelectID option[value="${game.automaInfo.firstCivSpecs.civID}"]`).prop('selected', true);
	$(`#quickStartAutomaCivSelectID option[value="${game.automaInfo.firstCivSpecs.civID}"]`).prop('selected', true);

	setTimeout(function(){
		if(game.automaInfo.firstCivSpecs.civID == 'trailblazers') {
			$('#quickStartLayer .buttons #quickStartButton').removeClass('func-automaIncome1Setup func-showLayer-game').addClass('func-trailblazersTrackOutpostsColor-quickStart');
			$('#fullAutomaConfigTrackChoiceLayer .buttons .btn.greenBtn').removeClass('func-showLayer-fullAutomaSetupInstructions').addClass('func-trailblazersTrackOutpostsColor-fullAutoma');
		} else {
			$('#quickStartLayer .buttons #quickStartButton').removeClass('func-trailblazersTrackOutpostsColor-quickStart').addClass('func-showLayer-game func-automaIncome1Setup');
			$('#fullAutomaConfigTrackChoiceLayer .buttons .btn.greenBtn').removeClass('func-trailblazersTrackOutpostsColor-fullAutoma').addClass('func-showLayer-fullAutomaSetupInstructions');
		}
	}, 50);

	$(`#automaFavTrackSelectID option[value="${game.automaInfo.favTrack}"]`).prop('selected', true);
	$(`#quickStartAutomaFavTrackSelectID option[value="${game.automaInfo.favTrack}"]`).prop('selected', true);

	if(game.automaCivList.base.indexOf(game.automaInfo.firstCivSpecs.civID) !== -1) {
		$(`#automaFavTrackSelectID`).attr('disabled', 'disabled');
		$(`#quickStartAutomaFavTrackSelectID`).attr('disabled', 'disabled');
		$(`#fullAutomaConfigTrackChoiceLayer #randomTrackChoiceContainer #automaFavTrackArrow.randomFavTrackArrow`).addClass('lockedFavTrack');
		$(`#fullAutomaConfigTrackChoiceLayer #randomTrackChoiceContainer #randomizeFavTrackText`).attr('validbots', 'shadowEmpire');
	} else {
		$(`#automaFavTrackSelectID`).removeAttr('disabled');
		$(`#quickStartAutomaFavTrackSelectID`).removeAttr('disabled');
		$(`#fullAutomaConfigTrackChoiceLayer #randomTrackChoiceContainer #automaFavTrackArrow.randomFavTrackArrow`).removeClass('lockedFavTrack');
		$(`#fullAutomaConfigTrackChoiceLayer #randomTrackChoiceContainer #randomizeFavTrackText`).attr('validbots', 'both');
	}

	updateFavTracksIcons('automa', game.automaInfo.favTrack);

	$(`#shadowEmpireFavTrackSelectID option[value="${game.shadowEmpireInfo.favTrack}"]`).prop('selected', true);
	$(`#quickStartShadowEmpireFavTrackSelectID option[value="${game.shadowEmpireInfo.favTrack}"]`).prop('selected', true);
	updateFavTracksIcons('shadowEmpire', game.shadowEmpireInfo.favTrack);
	
	$('#automaCiv').html(`<img class="automaCivCard" src="img/civs/${game.automaInfo.firstCivSpecs.civID}.jpg" />`);

	if(!emptyObj(game.automaInfo.secondCivSpecs)) {
		$(`#quickStartAutomaSecondCivSelectID option[value="${game.automaInfo.secondCivSpecs.civID}"]`).prop('selected', true);
	} else {
		updateAutomaAvailableSecondCivOptions();
		chooseRandomSecondAutomaCivilization('normal');
	}
}

function trailblazersTrackOutpostsColor(mode) {
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`trailblazersTrackOutpostsColor() func triggered`);

	if(DEBUG_GAME) console.log(`mode == "${mode}"`);

	setTimeout(function(){
		if(game.automaInfo.firstCivSpecs.civID == 'trailblazers') {
			$('#quickStartLayer .buttons #quickStartButton').removeClass('func-automaIncome1Setup func-showLayer-game').addClass('func-trailblazersTrackOutpostsColor-quickStart');
			$('#fullAutomaConfigTrackChoiceLayer .buttons .btn.greenBtn').removeClass('func-showLayer-fullAutomaSetupInstructions').addClass('func-trailblazersTrackOutpostsColor-fullAutoma');
		} else {
			$('#quickStartLayer .buttons #quickStartButton').removeClass('func-trailblazersTrackOutpostsColor-quickStart').addClass('func-showLayer-game func-automaIncome1Setup');
			$('#fullAutomaConfigTrackChoiceLayer .buttons .btn.greenBtn').removeClass('func-trailblazersTrackOutpostsColor-fullAutoma').addClass('func-showLayer-fullAutomaSetupInstructions');
		}
	}, 50);

	let chosenColors = [game.humanInfo.color, game.automaInfo.color, game.shadowEmpireInfo.color];
	let unchosenColorsHTML = ``;

	for (let i = 0; i < game.playerColors.length; i++) {
		if(chosenColors.indexOf(game.playerColors[i]) == -1) {
			unchosenColorsHTML += `<img outpostcolor="${game.playerColors[i]}" class="color-${game.playerColors[i]} trailblazersTrackOutpostChoice outpostColor" src="img/outposts/${game.playerColors[i]}.png" />`
			// unchosenColors.push(game.playerColors[i]);
		}
	}

	var trailblazersTrackOutpostsColorHTML = `
		<div class="confirmationBox alertEl trailblazersTrackOutpostsColorContainer">
			<p>Choose an unused color for the Trailblazers track outposts.</p>
			<div id="chooseTrackOutpostColorContainer">
				${unchosenColorsHTML}
			</div>
			<div class="buttons" btns="1">
				<a href="#" class="btn greenBtn">Continue</a>
			</div>

		</div>
	`;

	$(trailblazersTrackOutpostsColorHTML).appendTo('body');
	$('.confirmationBox.trailblazersTrackOutpostsColorContainer').fadeIn();
	$('#resetOverlay').fadeIn();
	$('#resetOverlay').addClass('keepOpen');

	let $firstTrackOutpost = $('.confirmationBox.alertEl.trailblazersTrackOutpostsColorContainer #chooseTrackOutpostColorContainer .trailblazersTrackOutpostChoice').eq(0);
	$firstTrackOutpost.addClass('chosenColor');
	game.automaInfo.trailblazerOutpostColor = $firstTrackOutpost.attr('outpostcolor');

	if(mode == 'quickStart') {
		$('.confirmationBox.alertEl.trailblazersTrackOutpostsColorContainer .buttons .btn').addClass('func-showLayer-game func-automaIncome1Setup');
	} else if(mode == 'fullAutoma') {
		$('.confirmationBox.alertEl.trailblazersTrackOutpostsColorContainer .buttons .btn').addClass('func-showLayer-fullAutomaSetupInstructions');
	}

	deactivateMenu();
}

$(document).on(touchEvent, '.trailblazersTrackOutpostsColorContainer .trailblazersTrackOutpostChoice:not(.chosenColor)', function() {
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`.trailblazersTrackOutpostsColorContainer .trailblazersTrackOutpostChoice touchevent detected`);
	$('.trailblazersTrackOutpostsColorContainer .trailblazersTrackOutpostChoice').removeClass('chosenColor');
	
	game.automaInfo.trailblazerOutpostColor = $(this).attr('outpostcolor');
	if(DEBUG_GAME) console.log(`game.automaInfo.trailblazerOutpostColor = "${game.automaInfo.trailblazerOutpostColor}"`);
	$(this).addClass('chosenColor');
});

function updateFavTracksIcons(opponent, favTrack) {
	// opponent = automa, opponent = shadowEmpire
	// let favTrackIconsHTML = `
	// 	<img class="heartIcon" src="img/${opponent}FavTrack-blank.png" />
	// 	<p class="equalSignText">&#10513;</p>
	// 	<img class="trackIcon" src="img/tracks/${game[`${opponent}Info`].favTrack}favTrack.png" />
	// 	<div class="clearDiv"></div>
	// `;

	let favTrackIconsHTML = `
		<img class="trackIcon" src="img/tracks/${game[`${opponent}Info`].favTrack}favTrack.png" />
		<div class="clearDiv"></div>
	`;

	$(`#fullAutomaConfigTrackChoiceLayer #${opponent}TrackChoiceContainer .favTrackIcons`).html(favTrackIconsHTML);
}


function updateAutomaAvailableSecondCivOptions(){
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`updateAutomaAvailableSecondCivOptions() func triggered`);

	game.availableSecondAutomaCivs = game.availableAutomaCivs.slice();

	let thisIndex = game.availableSecondAutomaCivs.indexOf(game.automaInfo.firstCivSpecs.civID);
	if(thisIndex != -1)	game.availableSecondAutomaCivs.splice(thisIndex, 1);

	$('#quickStartAutomaSecondCivSelectID').html('');

	let quickStartAutomaSecondCivHTML = '';

	for (let i = 0; i < game.availableSecondAutomaCivs.length; i++) {
		if(DEBUG_GAME) console.log(`game.availableSecondAutomaCivs[${i}] => '${game.availableSecondAutomaCivs[i]}'`);
		quickStartAutomaSecondCivHTML += `<option value="${game.availableSecondAutomaCivs[i]}">${capitalizeFirstLetter(game.availableSecondAutomaCivs[i])}</option>`;
	}

	$('#quickStartAutomaSecondCivSelectID').html(quickStartAutomaSecondCivHTML);
	$(`#quickStartAutomaSecondCivSelectID option[value="${game.automaInfo.secondCivSpecs.civID}"]`).prop('selected', true);
}

function chooseRandomSecondAutomaCivilization(mode) {
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`chooseRandomSecondAutomaCivilization() func triggered`);

	let secondCivsNum = game.availableSecondAutomaCivs.length;
	if(DEBUG_GAME) console.log(`secondCivsNum => '${secondCivsNum}'`);

	let randomSecondCivNum = Math.floor(Math.random()*secondCivsNum);
	if(DEBUG_GAME) console.log(`randomSecondCivNum => '${randomSecondCivNum}'`);
	
	let secondAutomaCivID = game.availableSecondAutomaCivs[randomSecondCivNum]; 
	if(DEBUG_GAME) console.log(`secondAutomaCivID => '${secondAutomaCivID}'`);

	game.automaInfo.secondCivSpecs = JSON.parse(JSON.stringify(civAbilities[secondAutomaCivID]));

	if(DEBUG_GAME) console.log(`game.automaInfo.secondCivSpecs.civID => '${game.automaInfo.secondCivSpecs.civID}'`);

	$(`#quickStartAutomaSecondCivSelectID option[value="${game.automaInfo.secondCivSpecs.civID}"]`).prop('selected', true);

	if(mode == 'automaMat') {
		$(`#automaMatScreenSecondCivSelectID option[value="${game.automaInfo.secondCivSpecs.civID}"]`).prop('selected', true);
		$('#bothCivContainer #secondCivImgContainer .level6CivImgContainer').html(`<img src="img/civs/${game.automaInfo.secondCivSpecs.civID}.jpg" />`);
	}

}


$(document).on('change', '#automaCivSelectID', function() {
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`#automaCivSelectID change detected`);
	if(DEBUG_GAME) console.log(`$('#automaCivSelectID').val() => '${$('#automaCivSelectID').val()}'`);
	finalizeChosenAutomaCiv($('#automaCivSelectID').val());
	updateAICivAndFavTracksInfo();
	updateAutomaAvailableSecondCivOptions();
	chooseRandomSecondAutomaCivilization('normal');
});

$(document).on('change', '#quickStartAutomaCivSelectID', function() {
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`#quickStartAutomaCivSelectID change detected`);
	if(DEBUG_GAME) console.log(`$('#quickStartAutomaCivSelectID').val() => '${$('#quickStartAutomaCivSelectID').val()}'`);
	finalizeChosenAutomaCiv($('#quickStartAutomaCivSelectID').val());
	updateAICivAndFavTracksInfo();
	updateAutomaAvailableSecondCivOptions();
	chooseRandomSecondAutomaCivilization('normal');
});

$(document).on('change', '#automaFavTrackSelectID', function() {
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`#automaFavTrackSelectID change detected`);
	if(DEBUG_GAME) console.log(`$('#automaFavTrackSelectID').val() => '${$('#automaFavTrackSelectID').val()}'`);
	finalizeChosenAutomaFavTrack('fullAutoma', $('#automaFavTrackSelectID').val());
});

$(document).on('change', '#quickStartAutomaFavTrackSelectID', function() {
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`#quickStartAutomaFavTrackSelectID change detected`);
	if(DEBUG_GAME) console.log(`$('#quickStartAutomaFavTrackSelectID').val() => '${$('#quickStartAutomaFavTrackSelectID').val()}'`);
	finalizeChosenAutomaFavTrack('quickStart', $('#quickStartAutomaFavTrackSelectID').val());
});

$(document).on('change', '#shadowEmpireFavTrackSelectID', function() {
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`#shadowEmpireFavTrackSelectID change detected`);
	if(DEBUG_GAME) console.log(`$('#shadowEmpireFavTrackSelectID').val() => '${$('#shadowEmpireFavTrackSelectID').val()}'`);
	finalizeChosenShadowEmpireFavTrack('fullAutoma', $('#shadowEmpireFavTrackSelectID').val());
});

$(document).on('change', '#quickStartShadowEmpireFavTrackSelectID', function() {
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`#quickStartAutomaFavTrackSelectID change detected`);
	if(DEBUG_GAME) console.log(`$('#quickStartAutomaFavTrackSelectID').val() => '${$('#quickStartAutomaFavTrackSelectID').val()}'`);
	finalizeChosenShadowEmpireFavTrack('quickStart', $('#quickStartShadowEmpireFavTrackSelectID').val());
});

$(document).on('change', '#quickStartAutomaSecondCivSelectID', function() {
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`#quickStartAutomaSecondCivSelectID change detected`);
	if(DEBUG_GAME) console.log(`$('#quickStartAutomaSecondCivSelectID').val() => '${$('#quickStartAutomaSecondCivSelectID').val()}'`);
	game.automaInfo.secondCivSpecs = JSON.parse(JSON.stringify(civAbilities[$(this).val()]));
});

function finalizeChosenAutomaCiv(thisCiv) {

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`finalizeChosenAutomaCiv() func triggered`);

	if(DEBUG_GAME) console.log(`thisCiv => '${thisCiv}'`);

	let chosenAutomaFavTrackID = civAbilities[thisCiv].trackID;
	if(DEBUG_GAME) console.log(`chosenAutomaFavTrackID => '${chosenAutomaFavTrackID}'`);

	game.automaInfo.firstCivSpecs = JSON.parse(JSON.stringify(civAbilities[thisCiv]));

	if(DEBUG_GAME) console.log(`game.automaInfo.firstCivSpecs:`);
	if(DEBUG_GAME) console.log(game.automaInfo.firstCivSpecs);

	if(chosenAutomaFavTrackID == 'random') {
		if(DEBUG_GAME) console.log(`chosenAutomaFavTrackID == 'random' condition met`);
		let randomFavTrackNum = Math.floor(Math.random() * parseInt(game.tracks.length));
		chosenAutomaFavTrackID = game.tracks[randomFavTrackNum];
	}

	game.automaInfo.favTrack = chosenAutomaFavTrackID;
	game.automaInfo.originalFavTrack = chosenAutomaFavTrackID;

	if(DEBUG_GAME) console.log(`game.automaInfo.favTrack => '${game.automaInfo.favTrack}'`);
	if(DEBUG_GAME) console.log(`game.automaInfo.originalFavTrack => '${game.automaInfo.originalFavTrack}'`);

	chooseRandomShadowEmpireFavTrack();
	
	updateShadowEmpireAvailableFavTracks(chosenAutomaFavTrackID);

}

function finalizeChosenAutomaFavTrack(mode, thisFavTrack) {
	if(mode == 'quickStart' || mode == 'all') $(`#quickStartAutomaFavTrackSelectID option[value="${thisFavTrack}"]`).prop('selected', true);
	if(mode == 'fullAutoma' || mode == 'all') $(`#automaFavTrackSelectID option[value="${thisFavTrack}"]`).prop('selected', true);
	game.automaInfo.favTrack = thisFavTrack;
	game.automaInfo.originalFavTrack = thisFavTrack;
	updateFavTracksIcons('automa', thisFavTrack);
	updateShadowEmpireAvailableFavTracks(thisFavTrack);
}

function finalizeChosenShadowEmpireFavTrack(mode, thisFavTrack) {
	if(mode == 'quickStart' || mode == 'all') $(`#quickStartShadowEmpireFavTrackSelectID option[value="${thisFavTrack}"]`).prop('selected', true);
	if(mode == 'fullAutoma' || mode == 'all') $(`#shadowEmpireFavTrackSelectID option[value="${thisFavTrack}"]`).prop('selected', true);
	game.shadowEmpireInfo.favTrack = thisFavTrack;
	game.shadowEmpireInfo.originalFavTrack = thisFavTrack;
	updateFavTracksIcons('shadowEmpire', thisFavTrack);
	updateAutomaShadowEmpireTextPreferences();
}

$(document).on('change', '#automaMatScreenSecondCivSelectID', function() {
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`#automaMatScreenSecondCivSelectID change detected`);
	if(DEBUG_GAME) console.log(`$(this).val() => '${$(this).val()}'`);
	
	game.automaInfo.secondCivSpecs = JSON.parse(JSON.stringify(civAbilities[$(this).val()]));
	$('#bothCivContainer #secondCivImgContainer .level6CivImgContainer').html(`<img src="img/civs/${game.automaInfo.secondCivSpecs.civID}.jpg" />`);

	if(DEBUG_GAME) console.log(`game.automaInfo.secondCivSpecs => '${game.automaInfo.secondCivSpecs}'`);
});


function chooseSecondCivOnAutomaMatScreen() {

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`chooseSecondCivOnAutomaMatScreen() func triggered`);

	console.log(`Potentially missing a closing div in the below code`);

	var chooseSecondCivHTML = `
		<div class="confirmationBox alertEl actionTypeAlertBox chooseSecondCiv">
			<p class="secondCivInstructions">On level 6, the Automa starts with an extra civilization of your choice. That civilizations favorite track has no effect. During income turns the effects of the first civilization are applied before the second.</p>
			
			<div id="chooseSecondCivFavTrackContainer" class="chooseSecondCivSection">
				<p class="secondCivSectionLabel">Starting Favorite Track for <span class="underline">both</span> Civs:</p>
				<div class="favTrackIcons">
					<img class="heartIcon" src="img/automaFavTrack-blank.png" />
					<p class="equalSignText">&#10513;</p>
					<img class="trackIcon" src="img/tracks/${game.automaInfo.favTrack}favTrack.png" />
					<div class="clearDiv"></div>
				</div>
				<div class="clearDiv"></div>
			</div>
			<div id="bothCivContainer">
				<div id="firstCivImgContainer" class="level6CivDetailsContainer">
					<div id="firstCivImgTitleContainer">
						<p id="firstCivImgTitle">Automas First Civ: <span class="bold" style="padding-left: 5px;">${game.automaInfo.firstCivSpecs.civName}</span></p>
					</div>
					<div class="level6CivImgContainer">
						<img src="img/civs/${game.automaInfo.firstCivSpecs.civID}.jpg" />
					</div>
				</div>
				<div id="secondCivImgContainer" class="level6CivDetailsContainer">
					<div id="secondCivImgTitleContainer">
						<p id="secondCivImgTitle">Automas Second Civ:</p>
						<select id="automaMatScreenSecondCivSelectID" name="difficultyLevel6SecondCivList" class="difficultyLevel6SecondCivList secondCivSectionInfo"></select>
					</div>
					<div class="level6CivImgContainer">
						<img src="img/civs/${game.automaInfo.secondCivSpecs.civID}.jpg" />
					</div>
				</div>
				<div class="clearDiv"></div>
			</div>
			<div class="buttons" btns="3">
				<a href="#" class="btn redBtn">Back</a>
				<a href="#" class="btn blueBtn func-chooseRandomSecondAutomaCivilization-automaMat keepOpen">Random</a>
				<a href="#" class="btn greenBtn func-showLayer-game func-gameButtons func-initActionArea func-automaIncome1Setup">Confirm</a>
			</div> <!-- eo.buttons -->
		</div>
	`;

	$(chooseSecondCivHTML).appendTo('body');

	$('.confirmationBox.chooseSecondCiv').fadeIn();
	$('#resetOverlay').fadeIn();

	deactivateMenu();

	$('#automaMatScreenSecondCivSelectID').html($('#quickStartAutomaSecondCivSelectID').html());
	$(`#automaMatScreenSecondCivSelectID option[value="${game.automaInfo.secondCivSpecs.civID}"]`).prop('selected', true);

}

// var automaMatMultipliers = {
// 	normal: {
// 		eraBonuses: [
// 			{
// 				startEraFirstVPs: 2,
// 				landmarks: 1,
// 				controlledTerritories: 1,
// 				military: 0,
// 				science: 0,
// 				technology: 1,
// 				exploration: 1
// 			},
// 			{
// 				startEraFirstVPs: 3,
// 				landmarks: 2,
// 				controlledTerritories: 2,
// 				military: 1,
// 				science: 1,
// 				technology: 1,
// 				exploration: 1
// 			},
// 			{
// 				startEraFirstVPs: 4,
// 				landmarks: 2,
// 				controlledTerritories: 2,
// 				military: 1,
// 				science: 1,
// 				technology: 2,
// 				exploration: 2
// 			},
// 			{
// 				startEraFirstVPs: 0,
// 				landmarks: 3,
// 				controlledTerritories: 3,
// 				military: 2,
// 				science: 2,
// 				technology: 3,
// 				exploration: 3
// 			}
// 		]
// 	}
// }

function automaIncome1Setup() {

	if(game.automaInfo.firstCivSpecs.civID == 'hucksters') {
		game.automaInfo.firstCivSpecs.huckstersStats = {
			'tapestryCardNum' : 1,
			'techCardNum' : 0,
			'explorationTileNum' : 0,
			'spaceTileNum' : 1,
		}
		if(aaExp) game.automaInfo.firstCivSpecs.huckstersStats.masterpieceCardNum = 0;
	} else if(game.difficultyLevelNum == "5" && game.automaInfo.secondCivSpecs.civID == 'hucksters') {
		game.automaInfo.secondCivSpecs.huckstersStats = {
			'tapestryCardNum' : 1,
			'techCardNum' : 0,
			'explorationTileNum' : 0,
			'spaceTileNum' : 1,
		}
		if(aaExp) game.automaInfo.secondCivSpecs.huckstersStats.masterpieceCardNum = 0;
	}

	automaCivTrackActionChanges();

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`automaIncome1Setup() func triggered`);

	if(DEBUG_GAME) console.log(`game`);
	if(DEBUG_GAME) console.log(game);

	if(game.difficultyLevelNum !='0') {
		if(DEBUG_GAME) console.log(`game.difficultyLevelNum !='0' condition met`);
		if(game.difficultyLevelNum !='5') {
			if(DEBUG_GAME) console.log(`game.difficultyLevelNum !='5' condition met`);
			if(game.automaInfo.firstCivSpecs.civID == 'conquerors') {
				if(DEBUG_GAME) console.log(`game.automaInfo.firstCivSpecs.civID == 'conquerors'`);
				for (let i = 0; i < game.difficultySpecs.automaMat.eraBonuses.length; i++) {
					game.difficultySpecs.automaMat.eraBonuses[i].controlledTerritories++;
				}
			} else if(game.automaInfo.firstCivSpecs.civID == 'engineers') {
				if(DEBUG_GAME) console.log(`game.automaInfo.firstCivSpecs.civID == 'engineers'`);
				for (let i = 0; i < game.difficultySpecs.automaMat.eraBonuses.length; i++) {
					game.difficultySpecs.automaMat.eraBonuses[i].landmarks++;
				}
			}

		} else {
			if(DEBUG_GAME) console.log(`game.difficultyLevelNum =='5' condition met`);
			if(game.automaInfo.firstCivSpecs.civID == 'conquerors' || game.automaInfo.secondCivSpecs.civID == 'conquerors') {
				if(DEBUG_GAME) console.log(`game.automaInfo.firstCivSpecs.civID == 'conquerors' || game.automaInfo.secondCivSpecs.civID == 'conquerors' condition met`);
				for (let i = 0; i < game.difficultySpecs.automaMat.eraBonuses.length; i++) {
					game.difficultySpecs.automaMat.eraBonuses[i].controlledTerritories++;
				}
			}
			
			if(game.automaInfo.firstCivSpecs.civID == 'engineers' || game.automaInfo.secondCivSpecs.civID == 'engineers') {
				if(DEBUG_GAME) console.log(`game.automaInfo.firstCivSpecs.civID == 'engineers' || game.automaInfo.secondCivSpecs.civID == 'engineers' condition met`);
				for (let i = 0; i < game.difficultySpecs.automaMat.eraBonuses.length; i++) {
					game.difficultySpecs.automaMat.eraBonuses[i].landmarks++;
				}
			}
		}
	}

	if(game.automaInfo.firstCivSpecs.civID == 'trailblazers' || game.difficultyLevelNum == "5" && game.automaInfo.secondCivSpecs.civID == 'trailblazers') {
		trailblazersCivSetup();
	} else {
		incomeSetup('firstToReachEra');
	}

}

function automaCivTrackActionChanges() {

	let automaAdvanceActionChanges = {
		'hucksters': {
			'tapestryCard' : `
				<div class="mainActionArea">
					<img class="actionImage" src="img/actions/tapestryCard.png" />
					<p class="actionDescription">Give the Automa a face down tapestry card. <span class="bold">(Keep separate from the Hucksters <span class="underline">face up</span> items)</span></p>
				</div>
			`,
			'conquerAndTapestryAction' : `
				<div class="mainActionArea">
					<div class="conquerAndTapestryDivider-1">
						<img class="actionImage" src="img/actions/tapestryCard.png" />
						<p class="actionDescription">Give the Automa a face down tapestry card. <span class="bold">(Keep separate from the Hucksters <span class="underline">face up</span> items)</span></p>
					</div>
					<div class="clearDiv"></div>
					<div class="conquerAndTapestryDivider-2">
						<a href="#" id="goToMapBtn" class="btn blueBtn func-showLayer-map func-showMapScreen-conquer func-buildMap">Map - Conquer</a>
					</div>
					<div class="militaryExtraTiebreakers extraTiebreakers">
						<div class="mapTiebreaker"></div>
						<div class="toppleIndicator"></div>
						<div class="clearDiv"></div>
					</div>
				</div>
			`,
		}
	}

	const allCivsWithChanges = Object.keys(automaAdvanceActionChanges);
	for (const currentCiv of allCivsWithChanges) {
		if(game.automaInfo.firstCivSpecs.civID == currentCiv || game.difficultyLevelNum == "5" && game.automaInfo.secondCivSpecs.civID == currentCiv) {
			const allActionsToChange = Object.keys(automaAdvanceActionChanges[currentCiv]);
			for (const currentAction of allActionsToChange) {
				for (let i = 0; i < actionInfo.length; i++) {
					if(actionInfo[i].actionClass == currentAction) {
						actionInfo[i].actionDesc = automaAdvanceActionChanges[currentCiv][currentAction];
					}
				}
			}
		}
	}
}

function automaSetupDoneStartGame() {

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`automaSetupDoneStartGame() func triggered`);

	gameButtonDisplay('draw', false);
	gameButtonDisplay('incomeTurn', false);
	gameButtonDisplay('shuffle', false);

	gameButtonDisplay('nextAction', true);
	gameButtonDisplay('showLandmarks', true);
	gameButtonDisplay('automaInfo', true);
	gameButtonDisplay('viewTapestryCards', true);

	gameButtonDisplay('automaIncome1Setup', false);
	gameButtonDisplay('setupDoneStartGame', false);

	roundInfoSetup();
	updateGame();

	$('.tapestryActionContainer').html('');  
	landmarkReminder();
}

function landmarkReminder() {
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`landmarkReminder() func triggered`);
	setTimeout(function(){
		if(DEBUG_GAME) console.log(`timeout #1 triggered`);
		$('.tapestryActionContainer').html('');

		let landmarkReminder = `
			<div class="landmarkReminderContainer horizontal">
				<img class="landmarkArrow" src="img/redArrow.png" />
				<p class="landmarkReminder">Reminder: Log any Landmarks you take.</p>
			</div>
			<div class="landmarkReminderContainer vertical">
				<img class="landmarkArrow" src="img/redArrow2.png" />
				<p class="landmarkReminder">Reminder: Log any Landmarks you take.</p>
			</div>
		`;

		$('.tapestryActionContainer').append(landmarkReminder);

		setTimeout(function(){
			if(DEBUG_GAME) console.log(`timeout #2 triggered`);
			$('.tapestryActionContainer .landmarkReminderContainer').addClass('showReminder');
		}, 100)

		$('#nextAction').removeClass('redBtn func-drawCard func-lockNextActionBtn').addClass('greyBtn');
		console.log(`PING ALT 1`)
	
		setTimeout(function(){
			if(DEBUG_GAME) console.log(`timeout #3 triggered`);
			$('.tapestryActionContainer .landmarkReminderContainer').removeClass('showReminder');
	
			setTimeout(function() {
				if(DEBUG_GAME) console.log(`timeout #4 triggered`);
				$('#nextAction').removeClass('greyBtn').addClass('redBtn func-drawCard func-lockNextActionBtn');
				console.log(`PING ALT 2`)
				$('.tapestryActionContainer .landmarkReminderContainer').remove();
	
			}, 800)
	
		}, 2800)
	}, 10)

	console.log('game');
	console.log(game);
	
}

function lockNextActionBtn() {
	if(DEBUG_GAME) console.log(`lockNextActionBtn() function triggered`);
	$('#nextAction').removeClass('redBtn func-drawCard func-lockNextActionBtn').addClass('greyBtn')
	console.log(`PING ALT 3`)
}

$(document).on('change', '#expansionsCheckboxContainer .customCheckboxContainer .customCheckbox input[type="checkbox"]', function() {
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`#expansionsCheckboxContainer .customCheckboxContainer .customCheckbox input[type="checkbox"] change detected`);
	if(DEBUG_GAME) console.log(`$(this).attr('id') => '${$(this).attr('id')}'`);
	if(DEBUG_GAME) console.log(`$(this).val() => '${$(this).val()}'`);
	updateGameVersion();
	randomizeHumanCivChoices();
	updateAvailableAutomaCivs();
	randomizeAutomaData();
});

function randomizeHumanCivChoices() {
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`randomizeHumanCivChoices() func triggered`);
	let civNames = {
		alchemists: 'Alchemists',
		aliens: 'Aliens',
		architects: 'Architects',
		collectors: 'Collectors',
		craftsmen: 'Craftsmen',
		entertainers: 'Entertainers',
		gamblers: 'Gamblers',
		historians: 'Historians',
		infiltrators: 'Infiltrators',
		islanders: 'Islanders',
		isolationists: 'Isolationists',
		leaders: 'Leaders',
		merrymakers: 'Merrymakers',
		militants: 'Militants',
		mystics: 'Mystics',
		nomads: 'Nomads',
		recyclers: 'Recyclers',
		relentless: 'Relentless',
		renegades: 'Renegades',
		riverfolk: 'Riverfolk',
		theChosen: 'The Chosen',
		tinkerers: 'Tinkerers',
		treasureHunters: 'Treasure Hunters',
		urbanPlanners: 'Urban Planners',
		utilitarians: 'Utilitarians'
	}

	$('.civOptionContainer').html('');

	var civs = ['alchemists', 'architects', 'craftsmen', 'entertainers', 'historians', 'isolationists', 'leaders', 'merrymakers', 'militants', 'mystics', 'nomads', 'theChosen'];
	var plansPloysCivs = ['treasureHunters', 'infiltrators', 'recyclers', 'tinkerers', 'aliens', 'utilitarians', 'islanders', 'riverfolk'];
	var artsArchitectureCivs = ['collectors', 'gamblers', 'relentless', 'renegades', 'urbanPlanners'];

	var firstCiv = '';
	var secondCiv = '';
	var firstCivIndex = 0;
	var secondCivIndex = 0;
	var cityMaps = [
		'(1) Mountain / (6) Forest',
		'(2) Wetland / (4) Desert',
		'(3) Tropical / (5) Grassland'
	]

	var advancedCityMaps = [
		'(7) Archipelago',
		'(8) Canyon',
		'(9) Cavern',
		'(10) Cloud City',
		'(11) Mesa',
		'(12) Swamp'
	]


	if(game.expansions.includes('plansPloys')) {
		if(DEBUG_GAME) console.log(`game.expansions.includes('plansPloys')`);
		civs.push(...plansPloysCivs);
	}

	if(game.expansions.includes('artsArchitecture')) {
		if(DEBUG_GAME) console.log(`game.expansions.includes('artsArchitecture')`);
		civs.push(...artsArchitectureCivs);
	}

	firstCivIndex = Math.floor(Math.random()*civs.length)
	secondCivIndex = firstCivIndex;
	firstCiv = civs[firstCivIndex];

	if(DEBUG_GAME) console.log(`firstCivIndex => '${firstCivIndex}'`);
	if(DEBUG_GAME) console.log(`firstCiv => '${firstCiv}'`);

	while(firstCivIndex == secondCivIndex) {
		secondCivIndex = Math.floor(Math.random()*civs.length)
		secondCiv = civs[secondCivIndex];
	}

	if(DEBUG_GAME) console.log(`secondCivIndex => '${secondCivIndex}'`);
	if(DEBUG_GAME) console.log(`secondCiv => '${secondCiv}'`);

	let firstCivAdj = false;
	let secondCivAdj = false;

	adjCivs[firstCiv] != false ? firstCivAdj = adjCivs[firstCiv] : ``;
	adjCivs[secondCiv] != false ? secondCivAdj = adjCivs[secondCiv] : ``;

	$('#civOption1').html(`
		<p civname="${firstCiv}" class="civTopTitle">${civNames[firstCiv]}<ion-icon name="expand" class="expandHumanCivImg"></ion-icon></p>
		<div class="civImageContainer">
			<img class="humanCivImg" src="img/humanCivs/${firstCiv}.jpg" />
			${firstCivAdj != false ? `
				<div class="civAdjustment">
					<p class="civAdjustTitle">Civ Adjustment</p>
					<p class="civAdjustDate">${adjCivDate}</p>
					<p class="civAdjustText">${firstCivAdj}</p>
				</div>
			` : ``}
		</div>
	`);

	$('#civOption2').html(`
		<p civname="${secondCiv}" class="civTopTitle">${civNames[secondCiv]}<ion-icon name="expand" class="expandHumanCivImg"></ion-icon></p>
		<div class="civImageContainer">
			<img class="humanCivImg" src="img/humanCivs/${secondCiv}.jpg" />
			${secondCivAdj != false ? `
			<div class="civAdjustment">
				<p class="civAdjustTitle">Civ Adjustment</p>
				<p class="civAdjustDate">${adjCivDate}</p>
				<p class="civAdjustText">${secondCivAdj}</p>
			</div>
			` : ``}
		</div>
	`);

	$('#quickStartHumanCivs').html(`${civNames[firstCiv]} / ${civNames[secondCiv]}`);

	var chosenPair = Math.floor(Math.random()*3);

	$('#capitalCityMatInfo').html(`${cityMaps[chosenPair]}`);
	$('#quickStartCityMat').html(`${cityMaps[chosenPair]}`);

	if(aaExp) {
		if(DEBUG_GAME) console.log(`aaExp condition met`);
		if($('#humanAdvancedCityMatText').length == 0) $('#humanCityMatText').after(`<p id="humanAdvancedCityMatText"></p>`);

		var chosenAdvancedMat = Math.floor(Math.random()*6);
		$('#humanAdvancedCityMatText').html(`
			Advanced Capital City Mat - <span class="bold">${advancedCityMaps[chosenAdvancedMat]}</span>
		`);
	}
}


$(document).on(touchEvent, '#fullAutomaChooseCivsLayer .allCivOptionContainer .civOptionContainer .civTopTitle', function() {
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`.civTopTitle touchevent detected`);

	let thisCiv = $(this).attr('civname');

	let fullSizeCivHTML = `
		<div class="fullSizeCivImgContainer alertEl">
			<img src="img/humanCivs/${thisCiv}.jpg">
		</div>
	`;

	$(fullSizeCivHTML).appendTo('body');
	$('.fullSizeCivImgContainer').fadeIn();
    $('#resetOverlay').fadeIn();

	deactivateMenu();

});

$(document).on(touchEvent, '.fullSizeCivImgContainer.alertEl', function() {
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`..fullSizeCivImgContainer.alertEl touchevent detected`);
	closeOverlays();
});

function shadowEmpireAutomatedSystem() {
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`shadowEmpireAutomatedSystem() func triggered`);
	buildShadowEmpireDeck();
	closeOverlays();
	gameButtonDisplay('draw', false);
	gameButtonDisplay('incomeTurn', false);
	gameButtonDisplay('shuffle', false);
	gameButtonDisplay('nextAction', true);
	gameButtonDisplay('showLandmarks', true);
	gameButtonDisplay('automaInfo', true);
	gameButtonDisplay('viewTapestryCards', true);

	game.lastOpponent = 'shadowEmpire';

	$('#roundMarkerTable1').css('display', 'none');
}


function fullAutomaAutomatedSystem() {
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`fullAutomaAutomatedSystem() func triggered`);
	buildFullAutomaDeck();
	closeOverlays();
	gameButtonDisplay('draw', false);
	gameButtonDisplay('incomeTurn', false);
	gameButtonDisplay('shuffle', false);
	gameButtonDisplay('nextAction', true);
	gameButtonDisplay('showLandmarks', true);
	gameButtonDisplay('automaInfo', true);
	gameButtonDisplay('viewTapestryCards', true);

	game.lastOpponent = 'automaShadowEmpire';

}

function showAutomaInfo(){

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`showAutomaInfo() func triggered`);

	var showAutomaCardsHTML = `
		<div class="confirmationBox alertEl showAutomaInfoContainer">
			<div id="automaInfoMenuOptions">
				<p id="decisionCards-link" class="automaInfoLink activeAutomaInfoLink">Decision Cards</p>
				<p id="automaCiv-link" class="automaInfoLink inactiveAutomaInfoLink">Automa Civ</p>
				<p id="automaDifficultyLevel-link" class="automaInfoLink inactiveAutomaInfoLink">Difficulty Level</p>
				<div class="clearDiv"></div>
			</div>
	`;


	if(game.lastOpponent == 'shadowEmpire') {

		if(DEBUG_GAME) console.log(`game.lastOpponent == 'shadowEmpire' condition met'`);
		showAutomaCardsHTML += `
			<div class="favoriteTracks shadowEmpireFavoriteTrackContainer">
				<div class="shadowEmpireFavoriteTrack">
					<img src="img/shadowEmpireFavTrack.png" />
					<p>${capitalizeFirstLetter(game.shadowEmpireInfo.favTrack)}</p>
				</div>
				<div class="clearDiv"></div>
			</div>
		`;
    } else if(game.lastOpponent == 'automaShadowEmpire') {

		if(DEBUG_GAME) console.log(`game.lastOpponent == 'automaShadowEmpire' condition met'`);
		showAutomaCardsHTML += `
			<div class="favoriteTracks automaShadowEmpireFavoriteTrackContainer">
				<div class="automaFavoriteTrack">
					<div class="favTrackImgTextContainer">
						<img src="img/automaFavTrack.png" />
						<p>${capitalizeFirstLetter(game.automaInfo.favTrack)}</p>
					</div>
				</div>
				<div class="shadowEmpireFavoriteTrack">
					<div class="favTrackImgTextContainer">
						<img src="img/shadowEmpireFavTrack.png" />
						<p>${capitalizeFirstLetter(game.shadowEmpireInfo.favTrack)}</p>
					</div>
				</div>
				<div class="clearDiv"></div>
			</div>
		`;
	}


	showAutomaCardsHTML += `
		<div id="automaInfoScreensContainer">
			<div automainfo="decisionCards" class="viewCardContainer automaInfoScreen">
					<img class="automaCard tiebreakerCard" src="img/cards/${game.firstCardInfo.cardImg}-tiebreaker.jpg" />
					<img class="automaCard mainActionCard" src="img/cards/${game.secondCardInfo.cardImg}-main-action.jpg" />
					<div class="clearDiv"></div>
			</div>
			<div automainfo="automaCiv" class="automaCivInfo automaInfoScreen">
				<img class="automaInfoCiv" src="img/civs/${game.automaInfo.firstCivSpecs.civID}${aaExp && game.automaInfo.firstCivSpecs.civID == 'hucksters' ? `-aa` : ``}.jpg" />
			</div>
			<div automainfo="automaDifficultyLevel" class="automaDifficultyInfo automaInfoScreen">
				<img class="automaInfoDifficulty" src="img/difficulty/level${game.difficultySpecs.level}${aaExp && game.difficultySpecs.level < 5 ? `-aa` : ``}.jpg" />
			</div>
		</div>
		<div class="buttons" btns="1">
			<a href="#" id="cancel" class="btn redBtn">Close</a>
		</div>

	</div>
	`;

	if(DEBUG_GAME) console.log(`game.lastOpponent => '${game.lastOpponent}'`);
	if(DEBUG_GAME) console.log(`game.automaInfo.favTrack => '${game.automaInfo.favTrack}'`);
	if(DEBUG_GAME) console.log(`game.shadowEmpireInfo.favTrack => '${game.shadowEmpireInfo.favTrack}'`);
	if(DEBUG_GAME) console.log(`game.firstCardInfo.card => '${game.firstCardInfo.card}'`);
	if(DEBUG_GAME) console.log(`game.firstCardInfo.card => '${game.secondCardInfo.card}'`);

	$(showAutomaCardsHTML).appendTo('body');
	$('.confirmationBox.showAutomaInfoContainer').fadeIn();
    $('#resetOverlay').fadeIn();

	deactivateMenu();

	$('.confirmationBox.alertEl.showAutomaInfoContainer #automaInfoScreensContainer .automaInfoScreen').eq(0).css('display', 'block');

}

$(document).on(touchEvent, '.confirmationBox.alertEl.showAutomaInfoContainer #automaInfoMenuOptions .automaInfoLink.inactiveAutomaInfoLink', function() {

	$('.confirmationBox.alertEl.showAutomaInfoContainer #automaInfoMenuOptions .automaInfoLink.activeAutomaInfoLink').addClass('inactiveAutomaInfoLink').removeClass('activeAutomaInfoLink');
	$(this).removeClass('inactiveAutomaInfoLink').addClass('activeAutomaInfoLink');

	let thisLink = $(this).attr('id').split('-');

	$(`.confirmationBox.alertEl.showAutomaInfoContainer #automaInfoScreensContainer .automaInfoScreen`).css('display', 'none');
	$(`.confirmationBox.alertEl.showAutomaInfoContainer #automaInfoScreensContainer .automaInfoScreen[automainfo="${thisLink[0]}"]`).css('display', 'block');	

})

function showCurrentAutomaCardsMoveHistory(cardOne, cardTwo){

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`showCurrentAutomaCardsMoveHistory() func triggered`);

	if(DEBUG_GAME) console.log(`cardOne => '${cardOne}'`);
	if(DEBUG_GAME) console.log(`cardTwo => '${cardTwo}'`);

	let cardOneImg = cards[parseInt(cardOne) - 1].cardImg;
	let cardTwoImg = cards[parseInt(cardTwo) - 1].cardImg;

	if(DEBUG_GAME) console.log(`cardOneImg => '${cardOneImg}'`);
	if(DEBUG_GAME) console.log(`cardTwoImg => '${cardTwoImg}'`);

	setTimeout(function(){
		var showAutomaCardsMoveHistoryHTML = `
			<div class="confirmationBox alertEl showCurrentAutomaCardsMoveHistoryBox">
				<h2>Current Automa Cards</h2>
				<div class="viewCardContainer">
					<img class="automaCard tiebreakerCard" src="img/cards/${cardOneImg}-tiebreaker.jpg" />
					<img class="automaCard mainActionCard" src="img/cards/${cardTwoImg}-main-action.jpg" />
					<div class="clearDiv"></div>
				</div>
				<div class="buttons" btns="1">
					<a href="#" id="cancel" class="btn redBtn keepOpen">Close</a>
				</div>
			</div>
		`;

		$(showAutomaCardsMoveHistoryHTML).appendTo('body');
		$('.confirmationBox.showCurrentAutomaCardsMoveHistoryBox').fadeIn();
		$('#resetOverlay').addClass('keepOpen');

		deactivateMenu();

		
	}, 10)

}

$(document).on(touchEvent, '.confirmationBox.showCurrentAutomaCardsMoveHistoryBox .buttons #cancel', function() {
	$('.confirmationBox.showCurrentAutomaCardsMoveHistoryBox').fadeOut();
	setTimeout(function(){
		$('.confirmationBox.showCurrentAutomaCardsMoveHistoryBox').remove();
	}, 600)
})

function showCurrentAutomaCiv(){

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`showCurrentAutomaCiv() func triggered`);

	let civIDOne = game.automaInfo.firstCivSpecs.civID;
	let civIDTwo = game.automaInfo.secondCivSpecs.civID;

	var showCurrentAutomaCivHTML = `
		<div class="confirmationBox alertEl showCurrentAutomaCivContainer">
			<img src="img/civs/${civIDOne}${aaExp && civIDOne == 'hucksters' ? `-aa` : ``}.jpg" />
			<br />
			${game.difficultySpecs.level == '6' ? `<img src="img/civs/${civIDTwo}${aaExp && civIDTwo == 'hucksters' ? `-aa` : ``}.jpg" />` : ``}
		</div>
	`;

	$(showCurrentAutomaCivHTML).appendTo('body');
	$('.confirmationBox.showCurrentAutomaCivContainer').fadeIn();
    $('#resetOverlay').fadeIn();

	deactivateMenu();
}

function showAgeOfDiscoveryTapestryCard() {

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`showAgeOfDiscoveryTapestryCard() func triggered`);

	var showTapestryCardHTML = `
		<div class="confirmationBox alertEl actionTypeAlertBox showTapestryCard">
			<p>The Age of Discovery Tapestry Card is the only card that affects the ${game.lastOpponent == 'automaShadowEmpire' ? `Automas and ` : ``}Shadow Empires Track Placements.</p>
			<img id="ageOfDiscoveryTapestry" src="img/tapestry/age-of-discovery.jpg" />
			<p><span class="bold">ONLY</span> click 'Confirm' if you're playing that Tapestry Card.</p>
			<div class="buttons" btns="2">
				<a href="#" id="cancel" class="btn redBtn">Cancel</a>
				<a href="#" class="btn greenBtn func-playAgeOfDiscovery keepOpen">Confirm</a>
			</div>
		</div>
	`;

	$(showTapestryCardHTML).appendTo('body');
	$('.confirmationBox.showTapestryCard').fadeIn();
	$('#resetOverlay').fadeIn();

	deactivateMenu();
}

function playAgeOfDiscovery() {

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`playAgeOfDiscovery() func triggered`);

	var playAgeOfDiscoveryHTML = `
		<div class="scienceDieToRoll">
			<img class="dice-face scienceDie benefitsRoll" src="img/dice/blank.png" />
			<div class="diceResults">
				<img class="dice-face noResult" src="img/dice/blank.png" />
				<img class="dice-face explorationResult" src="img/dice/exploration.png" />
				<img class="dice-face militaryResult" src="img/dice/military.png" />
				<img class="dice-face technologyResult" src="img/dice/technology.png" />
				<img class="dice-face scienceResult" src="img/dice/science.png" />
				<img class="dice-face artsResult" src="img/dice/arts.png" />
			</div>
		</div>
		<p class="ageOfDiscoverytext">The <span id="ageOfDiscoveryChosenTrack" class="bold"></span> Track has been chosen.</p>
		<p class="ageOfDiscoverytext">Click 'Confirm' to finalize this action and to move the ${game.lastOpponent == 'automaShadowEmpire' ? `Automa and ` : ``}Shadow Empire on this track, or 'Cancel' if this was done in error.</p>
		<p class="ageOfDiscoverytext automaLandmarkMessage">If this results in either artificial opponent gaining a Landmark which you were entitled to, click on the specific Landmark in the 'Landmarks' screen to return it.</p>
		<div class="buttons" btns="2">
			<a href="#" id="cancel" class="btn redBtn">Cancel</a>
			<a href="#" id="confirm" class="btn greenBtn">Confirm</a>
		</div>
	`;

	$('.confirmationBox.showTapestryCard').html(playAgeOfDiscoveryHTML);

	$('.confirmationBox.showTapestryCard .ageOfDiscoverytext').css('display', 'none');
	$('.confirmationBox.showTapestryCard .buttons').css('display', 'none');

	setTimeout(function(){
		$('.confirmationBox.showTapestryCard .scienceDieToRoll').addClass('rollDice');

		setTimeout(function(){
			let dieResult = Math.floor(Math.random() * parseInt(game.tracks.length));
			$('.scienceDieToRoll.rollDice').removeClass('noFavTrack explorationFavTrack militaryFavTrack technologyFavTrack scienceFavTrack artsFavTrack').addClass(`${game.tracks[dieResult]}FavTrack`);

			var chosenTrack = capitalizeFirstLetter(game.tracks[dieResult])

			if(DEBUG_GAME) console.log(`dieResult => '${dieResult}'`);
			if(DEBUG_GAME) console.log(`game.tracks[${dieResult}] => '${game.tracks[dieResult]}'`);
			if(DEBUG_GAME) console.log(`chosenTrack => '${chosenTrack}'`);

			$('#ageOfDiscoveryChosenTrack').html(chosenTrack)
			$('.confirmationBox.showTapestryCard .ageOfDiscoverytext').fadeIn();
			$('.confirmationBox.showTapestryCard .buttons').fadeIn();
			$('.confirmationBox.showTapestryCard .buttons #confirm').addClass('func-actionAgeOfDiscovery-' + game.tracks[dieResult] + ' func-closeOverlays');

		}, 850);

	}, 300)
}

function actionAgeOfDiscovery(chosenTrack) {

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`actionAgeOfDiscovery() func triggered`);
	if(DEBUG_GAME) console.log(`chosenTrack => '${chosenTrack}'`);
	if(DEBUG_GAME) console.log(`game.lastOpponent => '${game.lastOpponent}'`);

	if(game.lastOpponent == 'automaShadowEmpire') {
		if(DEBUG_GAME) console.log(`game.lastOpponent == 'automaShadowEmpire' condition met'`);
		if($('.tapestryActionContainer #automaMove.trackContainer').length) {
			if(DEBUG_GAME) console.log(`$('.tapestryActionContainer #automaMove.trackContainer').length condition met'`);
			$('.tapestryActionContainer #automaMove.trackContainer').fadeOut('slow');
			$('.tapestryActionContainer .actionInformationPanel').fadeOut('slow');
			setTimeout(function(){ 
				$('.tapestryActionContainer').html('');                              
				animateTrackMove('automa', chosenTrack, 'advance', 'normal', 'false', 1)
			}, automaTimeout)
		} else {
			if(DEBUG_GAME) console.log(`!$('.tapestryActionContainer #automaMove.trackContainer').length condition met'`);
			setTimeout(function(){ 
				animateTrackMove('automa', chosenTrack, 'advance', 'normal', 'false', 1)
			}, automaStartTimeout)
		}

		
		var currentAutomaTrack  = chosenTrack.toLowerCase()
		var currentAutomaTrackIndex = trackIndex(currentAutomaTrack);
		var currentAutomaSpace = game.automaInfo.trackPos[currentAutomaTrackIndex];

		if(DEBUG_GAME) console.log(`currentAutomaTrack => '${currentAutomaTrack}'`);
		if(DEBUG_GAME) console.log(`currentAutomaTrackIndex => '${currentAutomaTrackIndex}'`);
		if(DEBUG_GAME) console.log(`currentAutomaSpace => '${currentAutomaSpace}'`);

	
		if(currentAutomaSpace == 12) {
			if(DEBUG_GAME) console.log(`currentAutomaSpace == 12 condition met'`);
			if($('.tapestryActionContainer #shadowEmpireMove.trackContainer').length) {
				if(DEBUG_GAME) console.log(`$('.tapestryActionContainer #shadowEmpireMove.trackContainer').length condition met'`);
				$('.tapestryActionContainer #shadowEmpireMove.trackContainer').fadeOut('slow');
				setTimeout(function(){ 
					$('.tapestryActionContainer #shadowEmpireMove.trackContainer').remove();
					animateTrackMove('shadowEmpire', chosenTrack, 'advance', 'normal', 'false', 1);
				}, automaTimeout + 200)
			} else {
				if(DEBUG_GAME) console.log(`!$('.tapestryActionContainer #shadowEmpireMove.trackContainer').length condition met'`);
				setTimeout(function(){ 
					animateTrackMove('shadowEmpire', chosenTrack, 'advance', 'normal', 'false', 1);
				}, automaStartTimeout + 200)
			}

		} else {
			if(DEBUG_GAME) console.log(`currentAutomaSpace != 12 condition met'`);
			if($('.tapestryActionContainer #shadowEmpireMove.trackContainer').length) {
				if(DEBUG_GAME) console.log(`$('.tapestryActionContainer #shadowEmpireMove.trackContainer').length condition met'`);
				$('.tapestryActionContainer #shadowEmpireMove.trackContainer').fadeOut('slow');
				setTimeout(function(){ 
					$('.tapestryActionContainer #shadowEmpireMove.trackContainer').remove();
					animateTrackMove('shadowEmpire', chosenTrack, 'advance', 'normal', 'false', 1);
				}, shadowEmpireTimeout)
			} else {
				if(DEBUG_GAME) console.log(`!$('.tapestryActionContainer #shadowEmpireMove.trackContainer').length condition met'`);
				setTimeout(function(){ 
					animateTrackMove('shadowEmpire', chosenTrack, 'advance', 'normal', 'false', 1);
				}, shadowEmpireStartTimeout)
			}
		}

	} else if(game.lastOpponent == 'shadowEmpire') {
		if(DEBUG_GAME) console.log(`game.lastOpponent == 'shadowEmpire' condition met'`);
		if(game.lastOpponent == 'shadowEmpire' && !$('.tapestryActionContainer.shadowEmpireAutomated .shadowEmpireMove').length) {
			if(DEBUG_GAME) console.log(`game.lastOpponent == 'shadowEmpire' && !$('.tapestryActionContainer.shadowEmpireAutomated .shadowEmpireMove').length condition met'`);
			shadowEmpireContainerUpdate()
			setTimeout(function(){
				animateShadowEmpireTrackMove(chosenTrack)
			}, 1200)
		} else {
			if(DEBUG_GAME) console.log(`game.lastOpponent == 'shadowEmpire' && !$('.tapestryActionContainer.shadowEmpireAutomated .shadowEmpireMove').length condition NOT met'`);
			animateShadowEmpireTrackMove(chosenTrack)
		}

	}

}

function automaPass() {
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`automaPass() func triggered`);
	gameButtonDisplay('shuffle', true);
	gameButtonDisplay('draw', false);

}


function buildFullAutomaDeck() {

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`buildFullAutomaDeck() func triggered`);

	deck = [];
	game.chosenCards = [];
	
	for (let i = 0; i < 7; i++) {
		if(DEBUG_GAME) console.log(`cards[i]:`);
		if(DEBUG_GAME) console.log(cards[i]);
		deck.push(cards[i]);
		game.chosenCards.push(i + 1);
	}

	addCards(1);
}

function buildShadowEmpireDeck() {

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`buildShadowEmpireDeck() func triggered`);
	
	if(DEBUG_GAME) console.log(`buildShadowEmpireDeck() func triggered`);

	deck = [];
	game.chosenCards = [];
	
	for (let i = 0; i < 12; i++) {
		deck.push(cards[i]);
		game.chosenCards.push(i + 1);
	}

	deck = shuffle(deck);
	game.deckSize = parseInt(deck.length);
	game.roundInfo[1].value[0] = parseInt(deck.length);

	if(DEBUG_GAME) console.log(`game.deckSize => '${game.deckSize}'`);
	if(DEBUG_GAME) console.log(`game.roundInfo[1].value[0] => '${game.roundInfo[1].value[0]}'`);

	roundInfoSetup();
	updateGame();
}

function addCards(amount) {

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`addCards() func triggered`);

	if(amount != 0) {
		if(DEBUG_GAME) console.log(`amount != 0 condition met'`);
		var newDeckLength = deck.length + parseInt(amount);
		if(DEBUG_GAME) console.log(`newDeckLength => '${newDeckLength}'`);
		while(deck.length != newDeckLength){  
			var newCard = Math.floor(Math.random()*24) + 1;
			if(DEBUG_GAME) console.log(`newCard => '${newCard}'`);
			if(!game.chosenCards.includes(newCard)) {
				if(DEBUG_GAME) console.log(`!game.chosenCards.includes(newCard) condition met'`);
				game.chosenCards.push(newCard);
				for (let i = 0; i < cards.length; i++) {
					if(DEBUG_GAME) console.log(`cards[i].card => '${cards[i].card}'`);
					if(cards[i].card == newCard.toString()) {
						if(DEBUG_GAME) console.log(`cards[i].card == newCard.toString() condition met'`);
						if(DEBUG_GAME) console.log(`newCard.toString() => '${newCard.toString()}'`);
						deck.push(cards[i]);
						break;
					}
				}
			}
		}
	}

	deck = shuffle(deck);
	game.deckSize = parseInt(deck.length);
	game.roundInfo[1].value[0] = parseInt(deck.length);
	game.roundInfo[2].value[0] = 0;

	if(DEBUG_GAME) console.log(`game.deckSize => '${game.deckSize}'`);
	if(DEBUG_GAME) console.log(`game.roundInfo[1].value[0] => '${game.roundInfo[1].value[0]}'`);

	roundInfoSetup();
}

function checkFirstToReachEra(){

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`checkFirstToReachEra() func triggered`);

	$('.scienceDieToRoll.activeScienceDie').removeClass('activeScienceDie');

	if(game.era != 4) {
		if(DEBUG_GAME) console.log(`game.era != 4 condition met'`);
		gameButtonDisplay('draw', false);

		var checkFirstToReachEraHTML = `
			<div class="confirmationBox alertEl actionTypeAlertBox checkFirstToReachEra">
				<p>Was the Automa the first player <br />to reach <span class="bold">Era ${game.era + 1}</span>?</p>
				<div class="buttons" btns="2">
					<a href="#" class="btn redBtn func-incomeSetup-false">No</a>
					<a href="#" class="btn greenBtn func-incomeSetup-true">Yes</a>
				</div>
			</div>
		`;

		$(checkFirstToReachEraHTML).appendTo('body');
		$('.confirmationBox.checkFirstToReachEra').fadeIn();
		$('#resetOverlay').fadeIn();
		$('#resetOverlay').addClass('keepOpen');

		deactivateMenu();
	} else {
		if(DEBUG_GAME) console.log(`game.era == 4 condition met'`);
		incomeSetup('false')
	}
}


function automatedShadowEmpireRoundCleanup() {

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`automatedShadowEmpireRoundCleanup() func triggered`);

	addCards(2);
	
	gameButtonDisplay('shuffleShadowDeck', false);
	gameButtonDisplay('nextAction', true);
	gameButtons();

	roundInfoSetup()
	game.cardsDrawn = 0;
	$('#roundMarkerTable1').css('display', 'none');

	landmarkReminder();

}

function trailblazersCivSetup() {

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`incomeSetup() func triggered`);
	if(DEBUG_GAME) console.log(`game.era => '${game.era}'`);

	game.currentMode = 'income';

	if(aaExp) {
		game.automaInfo.trailblazersOutposts = [[], [], [], [], []];
	} else {
		game.automaInfo.trailblazersOutposts = [[], [], [], []];
	}
	
	closeOverlays();

	var incomeLayerHTML = `
		<div id="incomeLayer" class="layer extraSetupScreen">
			<div id="incomeTitleAndButtons">
				<div id="incomeHeadingAndIcons" class="firstEraIncomeAndSetup" icons="1">
					<h2 class="incomeLayerTitle">Setup + Era 1 Income</h2>
					<div id="incomeIcons" style="">
						<img src="img/income/civBonus.png">
						<div class="clearDiv"></div>
					</div>
					<div class="clearDiv"></div>
				</div>
				<div class="buttons">
					<a href="#" class="btn blueBtn func-showCurrentAutomaCiv">Automa Civ${game.difficultySpecs.level == '6' ? `s` : ``}</a>
					<a id="incomeButton" href="#" class="btn greyBtn">Next</a>
				</div>
			</div>
			<div id="incomeInformation">
				<div class="trailblazersOutpostPlacement">
					<p class="trailblazersOutpostPlacementText"><span class="bold">Trailblazers Civ:</span> As part of setup, place an outpost of an unused color two spaces ahead of your cube on the <span class="bold">${capitalizeFirstLetter(game.automaInfo.favTrack)}</span> track (the Automas favorite track).</p>

					<div id="${game.automaInfo.favTrack}-trailblazerSetupTrack" class="trailblazerSetupTrackContainer ${game.automaInfo.favTrack}Move currentSpace-firstTurn">
						<div class="trackImageContainer">
							<img class="trackIcon" src="img/tracks/${game.automaInfo.favTrack}Icon.png" />
							<div class="trackImagePosContainer">
								<img class="trackImg" src="img/fullTracks/${game.automaInfo.favTrack}-landmarks.jpg" />
								<!--img class="automaCubeImg cubePos-0" src="img/cubes/${game.automaInfo.color}.png" /-->
								<!--img class="shadowEmpireCubeImg cubePos-0" src="img/cubes/${game.shadowEmpireInfo.color}.png" /-->
							</div>
							<div class="trailblazersCivHumanPosToConfirm">
								<img class="humanCubeImg" src="img/cubes/${game.humanInfo.color}.png" />
							</div>
						</div>
					</div>

				</div>
			</div>
		</div>
	`;

	$(incomeLayerHTML).appendTo('#container');

	showLayer('income');

	$('#incomeLayer #incomeInformation').fadeIn('fast');
	$('#incomeLayer #incomeTitleAndButtons #incomeHeadingAndIcons #incomeIcons').fadeIn('fast');

	setTimeout(function(){
		$('#incomeLayer #incomeInformation .trailblazersOutpostPlacement .trailblazerSetupTrackContainer .trackImageContainer .trackImagePosContainer').append(`<img class="trailblazerTrackOutpost animateNewTrackOutpost" src="img/outposts/${game.automaInfo.trailblazerOutpostColor}.png" />`);
		let favTrackIndex = game.tracks.indexOf(game.automaInfo.favTrack);
		game.automaInfo.trailblazersOutposts[favTrackIndex].push(2);
	}, 100);

	setTimeout(function(){
		$('#incomeButton').removeClass('greyBtn').addClass('redBtn func-incomeSetup-firstToReachEra');
	}, 2000);

}

function incomeSetup(firstToReachEra) {

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`incomeSetup() func triggered`);
	if(DEBUG_GAME) console.log(`firstToReachEra => '${firstToReachEra}'`);
	if(DEBUG_GAME) console.log(`game.era => '${game.era}'`);

	game.currentMode = 'income';

	closeOverlays();

	game.era++;
	game.firstToReachEra = firstToReachEra;

	var incomeLayerHTML = `
		<div id="incomeTitleAndButtons">
			<div id="incomeHeadingAndIcons"${game.era == 1 ? ` class="firstEraIncomeAndSetup"` : ``}>
				<h2 class="incomeLayerTitle"></h2>
				<div id="incomeIcons"></div>
				<div class="clearDiv"></div>
			</div>
			<div class="buttons">
				${game.era > 1 ? `
					<a href="#" class="btn blueBtn func-showAutomaInfo">Automa Info</a>
				` : `
					<a href="#" class="btn blueBtn func-showCurrentAutomaCiv">Automa Civ${game.difficultySpecs.level == '6' ? `s` : ``}</a>
				`}
				<a id="incomeButton" href="#" class="btn redBtn func-nextIncomeStep">Next</a>
			</div>
		</div>
		<div id="incomeInformation"></div>
	`;

	if(game.era == 1 && game.automaInfo.firstCivSpecs.civID == 'trailblazers' || game.era == 1 && game.difficultyLevelNum == "5" && game.automaInfo.secondCivSpecs.civID == 'trailblazers') {
		$(`#incomeLayer.layer.extraSetupScreen`).html(incomeLayerHTML);
		$('#incomeLayer #incomeTitleAndButtons #incomeHeadingAndIcons .incomeLayerTitle').html(game.era == 1 ? `Setup + Era ${game.era} Income` : `Era ${game.era} Income`);
	} else {
		$(`<div id="incomeLayer" class="layer extraSetupScreen">${incomeLayerHTML}</div>`).appendTo('#container');
		$('#incomeLayer #incomeTitleAndButtons #incomeHeadingAndIcons .incomeLayerTitle').html(game.era == 1 ? `Setup + Era ${game.era} Income` : `Era ${game.era} Income`);
	}

	showLayer('income');
	nextIncomeStep();

	if(game.era != 1) {
		if(DEBUG_GAME) console.log(`game.era != 1 condition met'`);
		updateGame();
	}

	var thisMove = `<h3>Era ${game.era} Income</h3>`;
	recordMove(thisMove, 'custom', 'add');
	if(DEBUG_GAME) console.log(`thisMove => '${thisMove}'`);

}

function nextIncomeStep() {

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`nextIncomeStep() func triggered`);

	$('#incomeLayer #incomeInformation').fadeOut('fast');
	$('#incomeLayer #incomeTitleAndButtons #incomeHeadingAndIcons #incomeIcons').fadeOut('fast');

	var currentIncomeScreenHTML = '';
	var currentIncomeActions = [];
	var incomeFunctionsToAction = [];
	var currentAction = 'false';
	var nextAction = 'false';
	var triggeredIncomeScreen = '';
	var tempCurrentIncomeStep = game.currentIncomeStep;

	if(DEBUG_GAME) console.log(`tempCurrentIncomeStep => '${tempCurrentIncomeStep}'`);
	if(DEBUG_GAME) console.log(`(game.difficultySpecs.incomeScreens + 1) => '${(game.difficultySpecs.incomeScreens + 1)}'`);
	
	while(tempCurrentIncomeStep != (game.difficultySpecs.incomeScreens + 1)){ 
		var currentIncomeScreen = 'incomeScreen' + tempCurrentIncomeStep;
		for (let i = 0; i < game.difficultySpecs.incomeTurnSteps.length; i++) {

			if(DEBUG_GAME) console.log(`game.difficultySpecs.incomeTurnSteps[i].type => '${game.difficultySpecs.incomeTurnSteps[i].type}'`);
			if(DEBUG_GAME) console.log(`currentIncomeScreen => '${currentIncomeScreen}'`);
			if(DEBUG_GAME) console.log(`game.difficultySpecs.incomeTurnSteps[i].eras => '${game.difficultySpecs.incomeTurnSteps[i].eras}'`);
			if(DEBUG_GAME) console.log(`game.era => '${game.era}'`);

			if(game.difficultySpecs.incomeTurnSteps[i].type == currentIncomeScreen && game.difficultySpecs.incomeTurnSteps[i].eras.indexOf(game.era) !== -1) {
				if(DEBUG_GAME) console.log(`game.difficultySpecs.incomeTurnSteps[i].type == currentIncomeScreen && game.difficultySpecs.incomeTurnSteps[i].eras.indexOf(game.era) !== -1 condition met'`);
				if(triggeredIncomeScreen == '') {
					if(DEBUG_GAME) console.log(`triggeredIncomeScreen == '' condition met'`);
					triggeredIncomeScreen = currentIncomeScreen;
					game.currentIncomeStep = tempCurrentIncomeStep;
				} else if(triggeredIncomeScreen != currentIncomeScreen) {
					if(DEBUG_GAME) console.log(`triggeredIncomeScreen != currentIncomeScreen condition met'`);
					currentAction = 'true'
				}

				if(currentAction == 'false') {
					if(DEBUG_GAME) console.log(`currentAction == 'false' condition met'`);
					currentIncomeActions.push(game.difficultySpecs.incomeTurnSteps[i].action);
					if(DEBUG_GAME) console.log(`game.difficultySpecs.incomeTurnSteps[i].action => '${game.difficultySpecs.incomeTurnSteps[i].action}'`);
				} else if(currentAction == 'true') {
					if(DEBUG_GAME) console.log(`currentAction == 'true' condition met'`);
					nextAction = 'true';
				}
			}
		}

		tempCurrentIncomeStep++;

	}

	if(currentIncomeActions.length == 1) {
		if(DEBUG_GAME) console.log(`currentIncomeActions.length == 1 condition met'`);
		if(DEBUG_GAME) console.log(`currentIncomeActions[0] == "${currentIncomeActions[0]}"`);
			currentIncomeScreenHTML += `<div class="${currentIncomeActions[0]}">`;
			
			for (let j = 0; j < incomeStepActions.length; j++) {
				if(incomeStepActions[j].actionClass == currentIncomeActions[0]) {
					if(DEBUG_GAME) console.log(`incomeStepActions[j].actionClass == currentIncomeActions[0] condition met'`);
					if(incomeStepActions[j].dynamicContent == 'false') {
						if(DEBUG_GAME) console.log(`incomeStepActions[j].dynamicContent == 'false' condition met'`);
						currentIncomeScreenHTML += incomeStepActions[j].content;
					}
	
					if(incomeStepActions[j].functionRequired == 'true') {
						if(DEBUG_GAME) console.log(`incomeStepActions[j].functionRequired == 'true' condition met'`);
						incomeFunctionsToAction.push(incomeStepActions[j].actionClass + 'IncomeFunction')
					}
	
					if(incomeStepActions[j].actionRequired == 'true') {
						if(DEBUG_GAME) console.log(`incomeStepActions[j].actionRequired == 'true' condition met'`);
						$("#incomeButton").addClass('greyBtn').removeClass("redBtn func-nextIncomeStep");
					}
				}
			}
	
			currentIncomeScreenHTML += '</div>'

	} else {

		currentIncomeScreenHTML += `<div id="lastIncomeScreenActionsContainer">`;

		for (let i = 0; i < currentIncomeActions.length; i++) {

			currentIncomeScreenHTML += `<div class="lastIncomeScreenAction ${currentIncomeActions[i]}">`;
	
			for (let j = 0; j < incomeStepActions.length; j++) {

				if(DEBUG_GAME) console.log(`incomeStepActions[j].actionClass => '${incomeStepActions[j].actionClass}'`);
				if(DEBUG_GAME) console.log(`currentIncomeActions[${i}] => '${currentIncomeActions[i]}'`);

				if(incomeStepActions[j].actionClass == currentIncomeActions[i]) {

					if(DEBUG_GAME){
						console.log(`incomeStepActions[j]:`);
						console.log(incomeStepActions[j]);
					}

					if(DEBUG_GAME) console.log(`incomeStepActions[j].actionClass == currentIncomeActions[i] condition met'`);

					if(DEBUG_GAME) console.log(`incomeStepActions[j].dynamicContent => '${incomeStepActions[j].dynamicContent}'`);

					if(incomeStepActions[j].dynamicContent == 'false') {
						if(DEBUG_GAME) console.log(`incomeStepActions[j].dynamicContent == 'false' condition met'`);
						currentIncomeScreenHTML += incomeStepActions[j].content;
					}

					if(DEBUG_GAME) console.log(`incomeStepActions[j].functionRequired => '${incomeStepActions[j].functionRequired}'`);
	
					if(incomeStepActions[j].functionRequired == 'true') {
						if(DEBUG_GAME) console.log(`incomeStepActions[j].functionRequired == 'true' condition met'`);
						incomeFunctionsToAction.push(incomeStepActions[j].actionClass + 'IncomeFunction')
					}

					if(DEBUG_GAME) console.log(`incomeStepActions[j].actionRequired => '${incomeStepActions[j].actionRequired}'`);
	
					if(incomeStepActions[j].actionRequired == 'true') {
						if(DEBUG_GAME) console.log(`incomeStepActions[j].actionRequired == 'true' condition met'`);
						$("#incomeButton").addClass('greyBtn').removeClass("redBtn func-nextIncomeStep");
					}
					
				}
			}
	
			currentIncomeScreenHTML += '</div>'
		}

		currentIncomeScreenHTML += `</div>`;
	}

	setTimeout(function(){

		$('#incomeLayer #incomeInformation').html(currentIncomeScreenHTML);

		if(game.era == 1){

			var extraIncomeScreenHTML = '';

			if(game.expansions.length != 0) {

				extraIncomeScreenHTML += `
					<div class="clearDiv"></div>
					<div class="landmarkCardsSetup">
						<p>Draw two landmark cards and choose one for yourself. The <span class="bold underline">landmark</span> on the other card is automatically given to the Automa, and the card discarded.</p>
						<img src="img/income/landmarkCard.png" />
					</div>
					<div class="clearDiv"></div>`;
					game.automaInfo.landmarks.push('Landmark Card 1');
					game.automaInfo.scoringLandmarks = 1;

				if(game.expansions.includes('artsArchitecture')) {
					if(game.difficultyLevelNum == 2 || game.difficultyLevelNum == 3) {
						extraIncomeScreenHTML += `
							<p class="artsArchitectureLandmarkCardsSetup"><span class="bold">Difficulty Levels 3 + 4 Setup:</span> Draw 2 more landmark cards, give the Automa the associated landmarks and then discard the cards.</p>
							<div class="clearDiv"></div>
						`;
						game.automaInfo.landmarks.push('Landmark Card 2');
						game.automaInfo.landmarks.push('Landmark Card 3');
						game.automaInfo.scoringLandmarks = 3;``
					}
				}
			}
	
			if(game.automaInfo.firstCivSpecs.civID == 'hucksters') {

				let huckstersItem = '';

				if(game.automaInfo.favTrack == "military" || game.automaInfo.favTrack == "science") {
					huckstersItem = 'tapestryCard';
				} else if(game.automaInfo.favTrack == "technology") {
					huckstersItem = 'techCard';
				} else if(game.automaInfo.favTrack == "exploration") {
					huckstersItem = 'explorationTile';
				} else if(game.automaInfo.favTrack == "arts") {
					huckstersItem = 'masterpieceCard';
				}

				game.automaInfo.firstCivSpecs.huckstersStats[`${huckstersItem}Num`]++;

					extraIncomeScreenHTML += `
					<div class="automaCivSetup huckstersExtraSetupText">
						<p><span class="bold">Hucksters Setup:</span> Draw a <img class="gameIcon" src="img/icons/spaceTile.png" /> + <img class="gameIcon" src="img/icons/tapestryCard.png" /> and place these face-up in the Automas designated area.</p>
						<p>Due to the Automa having the <span class="bold">${capitalizeFirstLetter(game.automaInfo.favTrack)}</span> as its favorite track, also add ${huckstersItem == 'tapestryCard' ? `another` : `a`} face up <img class="gameIcon" src="img/icons/${huckstersItem}.png" /> to the Automas pool items.</p>
					</div>
					<div class="clearDiv"></div>
				`;
			} else if(game.automaInfo.firstCivSpecs.civID == 'trailblazers') {
					extraIncomeScreenHTML += `
					<div class="automaCivSetup trailblazersExtraSetupText">
						<p><span class="bold">Trailblazers Setup:</span> Remove the Socialism tapestry card from the game.</p>
						<img class="socialismCard" src="img/tapestry/socialismTapestry.png" />
					</div>
					<div class="clearDiv"></div>
				`;
			}

			if($('#incomeLayer #incomeInformation .tapestryCardToAutomaSupplySetup').length != 0) {
				$('#incomeLayer #incomeInformation .tapestryCardToAutomaSupplySetup').after(extraIncomeScreenHTML);
			} else if($('#incomeLayer #incomeInformation .humanAdvanceTracks').length != 0) {
				$('#incomeLayer #incomeInformation .humanAdvanceTracks').after(extraIncomeScreenHTML);
			}

	
		}

		$('#incomeLayer #incomeInformation').fadeIn('fast');

		var iconsNum = 0;
		var currentIncomeIconsHTML = ''

		for (let i = 0; i < currentIncomeActions.length; i++) {

			if(DEBUG_GAME) console.log(`currentIncomeActions[${i}] => '${currentIncomeActions[i]}'`);

			currentIncomeIconsHTML += '<img src="img/income/' + currentIncomeActions[i] + '.png" />'
			iconsNum++;
		}

		currentIncomeIconsHTML += '<div class="clearDiv"></div>'

		$('#incomeLayer #incomeTitleAndButtons #incomeHeadingAndIcons #incomeIcons').html(currentIncomeIconsHTML)
		$('#incomeLayer #incomeTitleAndButtons #incomeHeadingAndIcons #incomeIcons').fadeIn('fast');
		$('#incomeLayer #incomeTitleAndButtons #incomeHeadingAndIcons').attr('icons', iconsNum);

		if(DEBUG_GAME) console.log(`currentIncomeActions => '${currentIncomeActions}'`);

		if(currentIncomeActions.length > 1) {
			if(DEBUG_GAME) console.log(`currentIncomeActions.length > 1 condition met'`);
			$('#incomeLayer #incomeTitleAndButtons').addClass('multipleIncomeActions')
		} else {
			if(DEBUG_GAME) console.log(`!currentIncomeActions.length > 1 condition met'`);
			$('#incomeLayer #incomeTitleAndButtons').removeClass('multipleIncomeActions')
		}

		if(incomeFunctionsToAction.length > 0) {
			if(DEBUG_GAME) console.log(`incomeFunctionsToAction.length > 0 condition met'`);
			for (let i = 0; i < incomeFunctionsToAction.length; i++) {
				callfunction(incomeFunctionsToAction[i]);
			}
			
		}

		if(DEBUG_GAME) console.log(`nextAction => '${nextAction}'`);
		if(DEBUG_GAME) console.log(`game.era => '${game.era}'`);
		if(DEBUG_GAME) console.log(`game.currentIncomeStep => '${game.currentIncomeStep}'`);

		if(nextAction != 'true') {
			if(DEBUG_GAME) console.log(`extAction != 'true' condition met'`);
			if(game.era != 5) {
				if(DEBUG_GAME) console.log(`game.era != 5 condition met'`);
				game.currentIncomeStep = 1;
				$('#incomeButton').addClass('func-startNextEra').removeClass('func-nextIncomeStep')
				$('#incomeButton').text(`Start Era ${game.era}`);
			}
		}

		if($('#incomeInformation .lastIncomeScreenAction').length) {
			if(DEBUG_GAME) console.log(`$('#incomeInformation .lastIncomeScreenAction').length condition met'`);
			$('#incomeInformation').attr('incomescreenboxes', $('#incomeInformation .lastIncomeScreenAction').length)
		}

	}, 200);

	if(DEBUG_GAME) console.log(`game.currentIncomeStep => '${game.currentIncomeStep}'`);
	game.currentIncomeStep++;
	if(DEBUG_GAME) console.log(`game.currentIncomeStep => '${game.currentIncomeStep}'`);

}


// function humanAdvanceTracksIncomeFunction() {
// 	var humanAdvanceTracksIncomeStepHTML = '<div id="humanAdvanceTracksContainer">';
// 	humanAdvanceTracksIncomeStepHTML += '<p class="italic">For their first income turn, the human player advances on all 4 tracks once (in whichever order they choose), receiving the benefits.</p>';
// 	humanAdvanceTracksIncomeStepHTML += '<img src="img/difficulty/level1ExtraInfo.jpg" />';
// 	humanAdvanceTracksIncomeStepHTML += '</div>';


// 	$('#incomeLayer #incomeInformation .humanAdvanceTracks').html(humanAdvanceTracksIncomeStepHTML)
// }


function advanceOnFavoriteTracksIncomeFunction() {

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`advanceOnFavoriteTracksIncomeFunction() func triggered`);

	var advanceOnFavoriteTracksIncomeStepHTML = `
		<p class="startingIncomeTurnStatement">For the bots first income turn, they advance one space on each of their favorite tracks, receiving any applicable benefits.</p>
		<div class="tapestryActionContainer"></div>
	`;

	$('#incomeLayer #incomeInformation .advanceOnFavoriteTracks').html(advanceOnFavoriteTracksIncomeStepHTML)

	if(DEBUG_GAME) console.log(`automaStartTimeout => '${automaStartTimeout}'`);
	if(DEBUG_GAME) console.log(`shadowEmpireStartTimeout => '${shadowEmpireStartTimeout}'`);
	
	fullAnimationTime = automaStartTimeout + shadowEmpireStartTimeout + 2700;

	if(DEBUG_GAME) console.log(`fullAnimationTime => '${fullAnimationTime}'`);

	setTimeout(function(){ 
		if(DEBUG_GAME) console.log(`game.automaInfo.originalFavTrack => '${game.automaInfo.originalFavTrack}'`);
		animateTrackMove('automa', uncapitalizeFirstLetter(game.automaInfo.originalFavTrack), 'advance', 'difficultySetup', 'true', 1);
	}, automaStartTimeout);

	setTimeout(function(){ 
		if(DEBUG_GAME) console.log(`game.shadowEmpireInfo.originalFavTrack => '${game.shadowEmpireInfo.originalFavTrack}'`);
		animateTrackMove('shadowEmpire', uncapitalizeFirstLetter(game.shadowEmpireInfo.originalFavTrack), 'advance', 'difficultySetup', 'true', 1);

	}, shadowEmpireStartTimeout);

	setTimeout(function(){
		game.automaLevel6TrackNum++;
		setTimeout(function(){
			if(DEBUG_GAME) console.log(`game.automaInfo.originalFavTrack => '${game.automaInfo.originalFavTrack}'`);
			if(uncapitalizeFirstLetter(game.automaInfo.originalFavTrack) != 'science') {
				if(DEBUG_GAME) console.log(`uncapitalizeFirstLetter(game.automaInfo.originalFavTrack) != 'science' condition met'`);
				$('#automaIncome1Setup').addClass('redBtn func-automaIncome1Action').removeClass('greyBtn')	
			}
		}, 1000);
	}, 4500);

}


function advanceOnAllTracksIncomeFunction() {

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`advanceOnAllTracksIncomeFunction() func triggered`);

	$('#incomeButton').addClass('greyBtn').removeClass('redBtn func-advanceOnAllTracksIncomeFunction func-nextIncomeStep');

	if(!$('#incomeLayer #incomeInformation .advanceOnAllTracks .tapestryActionContainer').length) {
		if(DEBUG_GAME) console.log(`!$('#incomeLayer #incomeInformation .advanceOnAllTracks .tapestryActionContainer').length condition met'`);

		var advanceOnAllTracksIncomeStepHTML = `
			<p class="startingIncomeTurnStatement">
			<span class="bold">Trailblazers Setup:</span> An outpost is placed 2 spaces ahead of the on the Automas favorite track</p>
			<div class="tapestryActionContainer"></div>
		`;

		$('#incomeLayer #incomeInformation .advanceOnAllTracks').html(advanceOnAllTracksIncomeStepHTML);

		if(DEBUG_GAME) console.log(`automaStartTimeout => '${automaStartTimeout}'`);
		if(DEBUG_GAME) console.log(`shadowEmpireStartTimeout => '${shadowEmpireStartTimeout}'`);
		
		fullAnimationTime = automaStartTimeout + shadowEmpireStartTimeout + 2700;

		if(DEBUG_GAME) console.log(`fullAnimationTime => '${fullAnimationTime}'`);

		setTimeout(function(){ 			
			if(DEBUG_GAME) console.log(`game.automaLevel6Tracks[${game.automaLevel6TrackNum}] => '${game.automaLevel6Tracks[game.automaLevel6TrackNum]}'`);
			animateTrackMove('automa', game.automaLevel6Tracks[game.automaLevel6TrackNum], 'advance', 'difficultySetup', 'true', 1);
		}, automaStartTimeout)

		setTimeout(function(){ 			
			if(DEBUG_GAME) console.log(`game.automaLevel6Tracks[${game.automaLevel6TrackNum}] => '${game.automaLevel6Tracks[game.automaLevel6TrackNum]}'`);
			animateTrackMove('shadowEmpire', game.automaLevel6Tracks[game.automaLevel6TrackNum], 'advance', 'difficultySetup', 'true', 1);
		}, shadowEmpireStartTimeout)
	} else {
		if(DEBUG_GAME) console.log(`$('#incomeLayer #incomeInformation .advanceOnAllTracks .tapestryActionContainer').length condition met'`);
		$('.tapestryActionContainer #automaMove.trackContainer').fadeOut('slow');
		$('.tapestryActionContainer .actionInformationPanel').fadeOut('slow');
		$('.tapestryActionContainer #shadowEmpireMove.trackContainer').fadeOut('slow');

		if(DEBUG_GAME) console.log(`automaTimeout => '${automaTimeout}'`);
		if(DEBUG_GAME) console.log(`shadowEmpireTimeout => '${shadowEmpireTimeout}'`);

		fullAnimationTime = automaTimeout + shadowEmpireTimeout + 2300;

		if(DEBUG_GAME) console.log(`fullAnimationTime => '${fullAnimationTime}'`);
		
		setTimeout(function(){ 				
			$('.tapestryActionContainer').html('');  			
			if(DEBUG_GAME) console.log(`game.automaLevel6Tracks[${game.automaLevel6TrackNum}] => '${game.automaLevel6Tracks[game.automaLevel6TrackNum]}'`);
			animateTrackMove('automa', game.automaLevel6Tracks[game.automaLevel6TrackNum], 'advance', 'difficultySetup', 'true', 1);
		}, automaTimeout)
		
		setTimeout(function(){ 				
			$('.tapestryActionContainer #shadowEmpireMove.trackContainer').remove();			
			if(DEBUG_GAME) console.log(`game.automaLevel6Tracks[${game.automaLevel6TrackNum}] => '${game.automaLevel6Tracks[game.automaLevel6TrackNum]}'`);
			animateTrackMove('shadowEmpire', game.automaLevel6Tracks[game.automaLevel6TrackNum], 'advance', 'difficultySetup', 'true', 1);
		}, shadowEmpireTimeout)			
	}

	setTimeout(function(){		
			if(DEBUG_GAME) console.log(`game.automaLevel6Tracks[${game.automaLevel6TrackNum}] => '${game.automaLevel6Tracks[game.automaLevel6TrackNum]}'`);
		if(game.automaLevel6Tracks[game.automaLevel6TrackNum] != 'science') {
			if(DEBUG_GAME) console.log(`game.automaLevel6Tracks[game.automaLevel6TrackNum] != 'science' condition met'`);
			$('#incomeButton').removeClass('greyBtn').addClass('redBtn func-advanceOnAllTracksIncomeFunction');
		}
		game.automaLevel6TrackNum++;
	}, fullAnimationTime);

}


function favoriteTrackAssessmentIncomeFunction() {

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);

	console.log('game.automaInfo:');
	console.log(game.automaInfo);

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`favoriteTrackAssessmentIncomeFunction() func triggered`);

	game.shadowEmpireInfo.incomeAssessment = 'false';
	game.automaInfo.incomeAssessment = 'false';

	var automaFavTrack = game.automaInfo.favTrack;
	var automaFavTrackIndex = game.tracks.indexOf(automaFavTrack)

	var shadowEmpireFavTrack = game.shadowEmpireInfo.favTrack;
	var shadowEmpireFavTrackIndex = game.tracks.indexOf(shadowEmpireFavTrack)

	if(DEBUG_GAME) console.log(`automaFavTrack => '${automaFavTrack}'`);
	if(DEBUG_GAME) console.log(`automaFavTrackIndex => '${automaFavTrackIndex}'`);
	if(DEBUG_GAME) console.log(`shadowEmpireFavTrack => '${shadowEmpireFavTrack}'`);
	if(DEBUG_GAME) console.log(`shadowEmpireFavTrackIndex => '${shadowEmpireFavTrackIndex}'`);


	var favoriteTrackAssessmentIncomeStepHTML = `
		<div id="automaFavTrackContainer" class="assessFavTrackContainer">
			<div class="automaFavoriteTrack favoriteTracks">
				<img class="favTrackImg" src="img/automaFavTrack.png" />
				<p class="bold"> = </p>
				<img class="favTrackIconImg" src="img/tracks/${automaFavTrack}Icon.png" />
				<div class="clearDiv"></div>
			</div>
	`;

	if(DEBUG_GAME) console.log(`game.shadowEmpireInfo.trackPos[${automaFavTrackIndex}] => '${game.shadowEmpireInfo.trackPos[automaFavTrackIndex]}'`);
	if(DEBUG_GAME) console.log(`game.automaInfo.trackPos[${automaFavTrackIndex}] => '${game.automaInfo.trackPos[automaFavTrackIndex]}'`);

	if(game.shadowEmpireInfo.trackPos[automaFavTrackIndex] > game.automaInfo.trackPos[automaFavTrackIndex]) {
		if(DEBUG_GAME) console.log(`game.shadowEmpireInfo.trackPos[automaFavTrackIndex] > game.automaInfo.trackPos[automaFavTrackIndex] condition met'`);
		favoriteTrackAssessmentIncomeStepHTML += `
			<p class="favTrackQuestion">The <span class="underline">Shadow Empire</span> <img class="assessFavTrackCube" src="img/cubes/${game.shadowEmpireInfo.color}.png" /> is ahead of the <span class="underline">Automa</span> <img class="assessFavTrackCube" src="img/cubes/${game.automaInfo.color}.png" /> on the<br /><span class="bold">${capitalizeFirstLetter(game.automaInfo.favTrack)}</span> track.</p>
			<div class="newTrackContainer"></div>
		`;
		findNewAutomaFavTrack();
	} else if(game.automaInfo.trackPos[automaFavTrackIndex] == 12){
		if(DEBUG_GAME) console.log(`game.automaInfo.trackPos[automaFavTrackIndex] == 12 condition met'`);
		favoriteTrackAssessmentIncomeStepHTML += `
			<p class="favTrackQuestion">The <span class="underline">Automa</span> <img class="assessFavTrackCube" src="img/cubes/${game.automaInfo.color}.png" /> has reached the end of the<br /><span class="bold">${capitalizeFirstLetter(game.automaInfo.favTrack)}</span> track.</p>
			<div class="newTrackContainer"></div>
		`;
		findNewAutomaFavTrack();
	} else {
		if(DEBUG_GAME) console.log(`game.shadowEmpireInfo.trackPos[automaFavTrackIndex] <= game.automaInfo.trackPos[automaFavTrackIndex] && game.automaInfo.trackPos[automaFavTrackIndex] != 12 condition met'`);
		favoriteTrackAssessmentIncomeStepHTML += `
			<p class="favTrackQuestion">Are you <img class="assessFavTrackCube" src="img/cubes/${game.humanInfo.color}.png" /> ahead of the <span class="underline">Automa</span> <img class="assessFavTrackCube" src="img/cubes/${game.automaInfo.color}.png" /> on the<br /><span class="bold">${capitalizeFirstLetter(game.automaInfo.favTrack)}</span> track?</p>
			<div class="newTrackContainer"></div>
			<div class="buttons">
				<a href="#" class="btn redBtn func-automaFavTrackNoChange">No</a>
				<a href="#" class="btn greenBtn func-findNewAutomaFavTrack">Yes</a>
			</div>
		`;
	}

	favoriteTrackAssessmentIncomeStepHTML += `
		</div>
		<div id="shadowEmpireFavTrackContainer" class="assessFavTrackContainer">
			<div class="shadowEmpireFavoriteTrack favoriteTracks">
				<img class="favTrackImg" src="img/shadowEmpireFavTrack.png">
				<p class="bold"> = </p>
				<img class="favTrackIconImg" src="img/tracks/${shadowEmpireFavTrack}Icon.png" />
				<div class="clearDiv"></div>
			</div>
	`;

	if(DEBUG_GAME) console.log(`game.automaInfo.trackPos[${shadowEmpireFavTrackIndex}] => '${game.automaInfo.trackPos[shadowEmpireFavTrackIndex]}'`);
	if(DEBUG_GAME) console.log(`game.shadowEmpireInfo.trackPos[${shadowEmpireFavTrackIndex}] => '${game.shadowEmpireInfo.trackPos[shadowEmpireFavTrackIndex]}'`);
	if(DEBUG_GAME) console.log(`game.shadowEmpireInfo.favTrack => '${game.shadowEmpireInfo.favTrack}'`);

	if(game.automaInfo.trackPos[shadowEmpireFavTrackIndex] > game.shadowEmpireInfo.trackPos[shadowEmpireFavTrackIndex]) {
		if(DEBUG_GAME) console.log(`game.automaInfo.trackPos[${shadowEmpireFavTrackIndex}] > game.shadowEmpireInfo.trackPos[shadowEmpireFavTrackIndex] condition met'`);
		favoriteTrackAssessmentIncomeStepHTML += `
			<p class="favTrackQuestion">The <span class="underline">Automa</span> <img class="assessFavTrackCube" src="img/cubes/${game.automaInfo.color}.png" /> is ahead of the <span class="underline">Shadow Empire</span> <img class="assessFavTrackCube" src="img/cubes/${game.shadowEmpireInfo.color}.png" /> on the<br /><span class="bold">${capitalizeFirstLetter(game.shadowEmpireInfo.favTrack)}</span> track.</p>
			<div class="newTrackContainer"></div>
		`;
		findNewShadowEmpireFavTrack();
	} else if(game.shadowEmpireInfo.trackPos[shadowEmpireFavTrackIndex] == 12) {
		if(DEBUG_GAME) console.log(`game.shadowEmpireInfo.trackPos[${shadowEmpireFavTrackIndex}] == 12 condition met'`);
		favoriteTrackAssessmentIncomeStepHTML += `
			<p class="favTrackQuestion">The <span class="underline">Shadow Empire</span> <img class="assessFavTrackCube" src="img/cubes/${game.shadowEmpireInfo.color}.png" /> has reached the end of the <span class="bold">${capitalizeFirstLetter(game.shadowEmpireInfo.favTrack)}</span> track.</p>
			<div class="newTrackContainer"></div>
		`;
		findNewShadowEmpireFavTrack();
	} else {
		if(DEBUG_GAME) console.log(`game.automaInfo.trackPos[${shadowEmpireFavTrackIndex}] <= game.shadowEmpireInfo.trackPos[${shadowEmpireFavTrackIndex}] && game.shadowEmpireInfo.trackPos[${shadowEmpireFavTrackIndex}] != 12 condition met'`);
		favoriteTrackAssessmentIncomeStepHTML += `
			<p class="favTrackQuestion">Are you <img class="assessFavTrackCube" src="img/cubes/${game.humanInfo.color}.png" /> ahead of the <span class="underline">Shadow Empire</span> <img class="assessFavTrackCube" src="img/cubes/${game.shadowEmpireInfo.color}.png" /> on the<br /><span class="bold">${capitalizeFirstLetter(game.shadowEmpireInfo.favTrack)}</span> track?</p>
			<div class="newTrackContainer"></div>
			<div class="buttons">
				<a href="#" class="btn redBtn func-shadowEmpireFavTrackNoChange">No</a>
				<a href="#" class="btn greenBtn func-findNewShadowEmpireFavTrack">Yes</a>
			</div>
		`;
	}

	favoriteTrackAssessmentIncomeStepHTML += `
		<div class="clearDiv"></div>
		</div>
	`;

	$('#incomeLayer #incomeInformation .favoriteTrackAssessment').html(favoriteTrackAssessmentIncomeStepHTML)

}

function automaFavTrackNoChange() {

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`automaFavTrackNoChange() func triggered`);
	
	$('#automaFavTrackContainer .buttons').fadeOut();
	setTimeout(function(){
		var newFavTrackHTML = `
			<img class="favTrackArrow" src="img/arrow.png">
			<div class="automaFavoriteTrack newFavoriteTrack">
				<p class="noChange">No Change</p>
			</div>
		`;
		
		$('#automaFavTrackContainer .newTrackContainer').html(newFavTrackHTML)
		$('#automaFavTrackContainer .newTrackContainer').fadeIn();
		
	}, 400)

	game.automaInfo.incomeAssessment = 'true';
	checkBotsFavTrackAssessments();
}

function shadowEmpireFavTrackNoChange() {

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`shadowEmpireFavTrackNoChange() func triggered`);
	
	$('#shadowEmpireFavTrackContainer .buttons').fadeOut();
	setTimeout(function(){

		var newFavTrackHTML = `
			<img class="favTrackArrow" src="img/arrow.png">
			<div class="shadowEmpireFavoriteTrack newFavoriteTrack">
				<p class="noChange">No Change</p>
			</div>
		`;
		
		$('#shadowEmpireFavTrackContainer .newTrackContainer').html(newFavTrackHTML)
		$('#shadowEmpireFavTrackContainer .newTrackContainer').fadeIn();

	}, 400)

	game.shadowEmpireInfo.incomeAssessment = 'true';
	checkBotsFavTrackAssessments();
}

function checkBotsFavTrackAssessments() {

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`checkBotsFavTrackAssessments() func triggered`);

	if(DEBUG_GAME) console.log(`game.automaInfo.incomeAssessment => '${game.automaInfo.incomeAssessment}'`);
	if(DEBUG_GAME) console.log(`game.shadowEmpireInfo.incomeAssessment => '${game.shadowEmpireInfo.incomeAssessment}'`);

	$('#closeFavTrackAssessment').removeClass('keepOpen greyBtn').addClass('greenBtn func-automatedShadowEmpireRoundCleanup');

	if(game.automaInfo.incomeAssessment == 'true' && game.shadowEmpireInfo.incomeAssessment == 'true') {
		if(DEBUG_GAME) console.log(`game.automaInfo.incomeAssessment == 'true' && game.shadowEmpireInfo.incomeAssessment == 'true' condition met'`);
		$("#incomeButton").addClass('redBtn func-nextIncomeStep').removeClass("greyBtn");
	}
}

function advanceTrackTokensIncomeFunction() {

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`advanceTrackTokensIncomeFunction() func triggered`);

	var advanceTrackTokensIncomeStepHTML = `
		<p class="startingIncomeTurnStatement">The bots track tokens are advanced using the most recent decision card pair, receiving any applicable benefits.</p>
		<div class="tapestryActionContainer"></div>
	`;

	var thisMove = `<p class="bold italic">Advance Track Tokens - Most recent decision card pair</p>`;
	recordMove(thisMove, 'custom', 'add');

	determineChosenTrack();

	$('#incomeLayer #incomeInformation .advanceTrackTokens').html(advanceTrackTokensIncomeStepHTML)

}

function civBonusIncomeFunction() {

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`civBonusIncomeFunction() func triggered`);
	if(DEBUG_GAME) console.log(`game.automaInfo.firstCivSpecs.civID => '${game.automaInfo.firstCivSpecs.civID}'`);
	if(DEBUG_GAME) console.log(`game.era => '${game.era}'`);

	var civBonusIncomeStepHTML = `<div id="incomeAutomaCiv" class="${game.automaInfo.firstCivSpecs.civID}CivContainer">`;
	
	if(game.automaInfo.firstCivSpecs.civID == 'explorers' || game.automaInfo.firstCivSpecs.civID == 'scientists' || game.automaInfo.firstCivSpecs.civID == 'equalizers' || game.automaInfo.firstCivSpecs.civID == 'scientists') {
		if(DEBUG_GAME) console.log(`game.automaInfo.firstCivSpecs.civID == 'explorers' || game.automaInfo.firstCivSpecs.civID == 'scientists' condition met'`);
		civBonusIncomeStepHTML += `
			<div class="tapestryActionContainer"></div>
		`;
	}

	civBonusIncomeStepHTML += `
			<div class="clearDiv"></div>
		</div>
	`;

	$('#incomeLayer #incomeInformation .civBonus').html(civBonusIncomeStepHTML)

	if(game.automaInfo.firstCivSpecs.civID == 'explorers') {
		if(DEBUG_GAME) console.log(`game.automaInfo.firstCivSpecs.civID == 'explorers' condition met'`);
		var thisMove = '<p class="bold italic">Civilization Income Turn Bonus (Explorers)</p>';
		recordMove(thisMove, 'custom', 'add');

		if(game.era == 2 || game.era == 4) {
			if(DEBUG_GAME) console.log(`game.era == 2 || game.era == 4 condition met'`);
			// $('.civBonus #incomeAutomaCiv').append(`<div class="nonActionInformationPanel"></div>`);
			$('#incomeLayer #incomeInformation .civBonus #incomeAutomaCiv.explorersCivContainer').prepend(`
				<p class="civBonusIncomeAdvanceDescription">The <span class="bold">Explorer Civ</span> advances on the <span class="bold">Exploration Track</span> in Eras 2 & 4.</p>
			`);
			animateTrackMove('automa', 'exploration', 'advance', 'incomeAction', 'true', 1);
		} else if(game.era == 3 || game.era == 5) {
			if(DEBUG_GAME) console.log(`game.era == 3 || game.era == 5 condition met'`);
			$('#incomeLayer #incomeInformation .civBonus #incomeAutomaCiv.explorersCivContainer').prepend(`
				<p class="civBonusIncomeAdvanceDescription">The <span class="bold">Explorer Civ</span> advances on the <span class="bold">Military Track</span> in Eras 3 & 5.</p>
			`);
			animateTrackMove('automa', 'military', 'advance', 'incomeAction', 'true', 1);
		}

		setTimeout(function(){
			$("#incomeButton").addClass('redBtn func-nextIncomeStep').removeClass("greyBtn");
		}, 2500)

	} else if(game.automaInfo.firstCivSpecs.civID == 'scientists') {
		if(DEBUG_GAME) console.log(`game.automaInfo.firstCivSpecs.civID == 'scientists' condition met'`);
		var thisMove = `<p class="bold italic">Civilization Income Turn Bonus (Scientists)</p>`;
		recordMove(thisMove, 'custom', 'add');

		if(DEBUG_GAME) console.log(`thisMove => '${thisMove}'`);

		let automaScienceCivBonusIncome = `
				<div class="actionInformationPanel scienceDiceBenefitsActionMove">
					<div class="mainActionArea">
						<div class="scienceDieToRoll activeScienceDie">
							<img class="dice-face scienceDie benefitsRoll" src="img/dice/blank.png" />
							<div class="diceResults">
								<img class="dice-face noResult" src="img/dice/blank.png" />
								<img class="dice-face explorationResult" src="img/dice/exploration.png" />
								<img class="dice-face militaryResult" src="img/dice/military.png" />
								<img class="dice-face technologyResult" src="img/dice/technology.png" />
								<img class="dice-face scienceResult" src="img/dice/science.png" />
								<img class="dice-face artsResult" src="img/dice/arts.png" />
							</div>
						</div>
						<p class="actionDescription">The Automa rolls and advances on the indicated track, receiving any benefits.</p>
					</div>
					<div class="clearDiv"></div>
					<a href="#" tracks="all" class="btn greenBtn actionScienceDice func-scienceDieActionSelection-scientistsCivBonus+advance+true" style="margin: 10px auto 0px;">Roll Die</a>
				</div>
				<div class="clearDiv"></div>
			</div>
		`;

		$('.civBonus #incomeAutomaCiv').append(automaScienceCivBonusIncome);
		$('#incomeLayer #incomeInformation .civBonus #incomeAutomaCiv .tapestryActionContainer').addClass('collapsedContainer');
		$('.civBonus #incomeAutomaCiv .actionInformationPanel').fadeIn();

   } else if(game.automaInfo.firstCivSpecs.civID == 'engineers') {
		if(DEBUG_GAME) console.log(`game.automaInfo.firstCivSpecs.civID == 'engineers' condition met'`);
		if(DEBUG_GAME) console.log(`game.automaInfo.landmarks.length => '${game.automaInfo.landmarks.length}'`);

		let automaTechnologyCivBonusIncome = `
			<div class="nonActionInformationPanel">
				<p>The bots have collected <span class="bold">${game.automaInfo.landmarks.length}</span> Landmark${game.automaInfo.landmarks.length > 1 ? 's' : ''}, giving the Automa <span class="bold">${game.automaInfo.landmarks.length}</span> extra point${game.automaInfo.landmarks.length > 1 ? 's' : ''} this Income Turn <span class="bold underline red">(calculated on scoring screen)</span>.</p>
			</div>
		`;

		$('.civBonus #incomeAutomaCiv').append(automaTechnologyCivBonusIncome);
		$('.civBonus #incomeAutomaCiv .nonActionInformationPanel').fadeIn();

		$('.civBonus #incomeAutomaCiv #incomeAutomaCivImg').addClass('nonActionCiv')
		$("#incomeButton").addClass('redBtn func-nextIncomeStep').removeClass("greyBtn");

	} else if(game.automaInfo.firstCivSpecs.civID == 'conquerors') {
		if(DEBUG_GAME) console.log(`game.automaInfo.firstCivSpecs.civID == 'conquerors' condition met'`);
		$('.civBonus #incomeAutomaCiv').append(`<div class="nonActionInformationPanel"></div>`);
		$("#incomeButton").addClass('greyBtn').removeClass("redBtn func-nextIncomeStep");
		showMapInfoForConquerorsCiv()
	} else if(game.automaInfo.firstCivSpecs.civID == 'equalizers') {
	
		let equalizersCivBonusHTML = `
				<div class="actionInformationPanel">
						<p id="equalizersCivBonusInfo"><span class="bold">Equalizers Civ:</span> Indicate below whether your cube is 1 or 2 spaces ahead of the Automa on each track to see if the Equalizers Civ performs an advance action. If your cube is in any other position on the track, select "<span class="bold">Another Space</span>".</p>
				</div>
				<div class="clearDiv"></div>
			</div>
		`;

		$('.civBonus #incomeAutomaCiv').append(equalizersCivBonusHTML);
		$('#incomeLayer #incomeInformation .civBonus #incomeAutomaCiv .tapestryActionContainer').addClass('collapsedContainer');
		$('.civBonus #incomeAutomaCiv .actionInformationPanel').fadeIn();
		$("#incomeButton").addClass('greyBtn').removeClass("redBtn func-nextIncomeStep");

		equalizersIncomeTrackSetup();

	} else if(game.automaInfo.firstCivSpecs.civID == 'hucksters') {

		game.automaInfo.incomeBonusVPs.multiplier = game.difficultySpecs.automaMat.eraBonuses[parseInt(game.era - 2)].landmarks;

		let huckstersItem = '';

		if(game.automaInfo.favTrack == "military" || game.automaInfo.favTrack == "science") {
			huckstersItem = 'tapestryCard';
		} else if(game.automaInfo.favTrack == "technology") {
			huckstersItem = 'techCard';
		} else if(game.automaInfo.favTrack == "exploration") {
			huckstersItem = 'explorationTile';
		} else if(game.automaInfo.favTrack == "arts") {
			huckstersItem = 'masterpieceCard';
		}

		let civBonusHTML = `
				<div class="actionInformationPanel">
				<p><span class="bold">Hucksters Civ:</span> Due to the <span class="bold">${capitalizeFirstLetter(game.automaInfo.favTrack)} Track</span> being the Automas favorite track, add a face up <img class="gameIcon" src="img/icons/${huckstersItem}.png" /> to the Automas pool items.</p>
				<p>Once you've done this make any needed adjustments to the total amount of each <span class="bold underline">face up</span> item the Automa posseses for scoring.</p>
				<p id="huckstersNoteText">NOTE: The following figures are estimates and should only be different if you took any of the face up items from the Automas pool since the last income turn.</p>
					<div id="huckstersIncomeTablesContainer">
						<table class="hucksterFaceUpCards">
							<tbody>
								<tr id="hucksterTotal-tapestryCard" class="hucksterItemRow">
									<td class="minusOne changeItemVal">
										<p>-</p>
									</td>
									<td class="itemImgAndAmount">
										<img src="img/icons/tapestryCard.png" />
										<p class="itemAmount">x<span class="itemVal">0</span></p>
									</td>							
									<td class="addOne changeItemVal">
										<p>+</p>
									</td>
								</tr>
								<tr class="middleRow"><td></td><td></td><td></td></tr>
								<tr id="hucksterTotal-techCard" class="hucksterItemRow">
									<td class="minusOne changeItemVal">
										<p>-</p>
									</td>
									<td class="itemImgAndAmount">
										<img src="img/icons/techCard.png" />
										<p class="itemAmount">x<span class="itemVal">0</span></p>
									</td>							
									<td class="addOne changeItemVal">
										<p>+</p>
									</td>
								</tr>
							</tbody>
						</table>
						<table class="hucksterFaceUpTiles">
							<tbody>
								<tr id="hucksterTotal-explorationTile" class="hucksterItemRow">
									<td class="minusOne changeItemVal">
										<p>-</p>
									</td>
									<td class="itemImgAndAmount">
										<img src="img/icons/explorationTile.png" />
										<p class="itemAmount">x<span class="itemVal">0</span></p>
									</td>							
									<td class="addOne changeItemVal">
										<p>+</p>
									</td>
								</tr>
								<tr class="middleRow"><td></td><td></td><td></td></tr>
								<tr id="hucksterTotal-spaceTile" class="hucksterItemRow">
									<td class="minusOne changeItemVal">
										<p>-</p>
									</td>
									<td class="itemImgAndAmount">
										<img src="img/icons/spaceTile.png" />
										<p class="itemAmount">x<span class="itemVal">0</span></p>
									</td>							
									<td class="addOne changeItemVal">
										<p>+</p>
									</td>
								</tr>
							</tbody>
						</table>

						${aaExp ? `
							<table class="hucksterFaceUpMasterpieceCards">
								<tbody>
									<tr id="hucksterTotal-masterpieceCard" class="hucksterItemRow">
										<td class="minusOne changeItemVal">
											<p>-</p>
										</td>
										<td class="itemImgAndAmount">
											<img src="img/icons/masterpieceCard.png" />
											<p class="itemAmount">x<span class="itemVal">0</span></p>
										</td>							
										<td class="addOne changeItemVal">
											<p>+</p>
										</td>
									</tr>
								</tbody>
							</table>
						` : ``}

					</div>
					<div class="clearDiv"></div>
					<p class="totalHucksterItemsText">Total face up items: <span class="totalHucksterItemsVal">0</span></p>
				</div>
				<div class="clearDiv"></div>
			</div>
		`;

		$('.civBonus #incomeAutomaCiv').append(civBonusHTML);
		$('#incomeLayer #incomeInformation .civBonus #incomeAutomaCiv .tapestryActionContainer').addClass('collapsedContainer');
		$('.civBonus #incomeAutomaCiv .actionInformationPanel').fadeIn();
		$("#incomeButton").addClass('redBtn func-nextIncomeStep').removeClass("greyBtn");

		game.automaInfo.firstCivSpecs.huckstersStats[`${huckstersItem}Num`]++;
		generateHuckstersItemCounts();

	} else if(game.automaInfo.firstCivSpecs.civID == 'iconoclasts') {

		game.automaInfo.incomeBonusVPs.amount = 0;
		game.automaInfo.incomeBonusVPs.multiplier = 3;
		game.automaInfo.incomeBonusVPs.total = 0;

		let civBonusHTML = ``;
		
		if(game.automaInfo.scoringLandmarks == 0) {
			civBonusHTML += `
			<div class="incomeActionInformationPanel">
					<p><span class="bold">Iconoclasts Civ:</span> The Automa removes each landmark it has, gaining <img class="gameIcon" src="img/icons/rollScienceDie.png"> & 3 VP for each. Any new landmarks gained from advancing are included.</p>
					<p id="iconoclastsTotalLandmarks" landmarks="0">Current Landmarks: 
						<span class="landmarksNum">0</span>
						<span class="landmarksNumAdj"></span>
					</p>
				<p>Due to the Automa not possessing any landmarks it skips this step and goes straight to scoring.</p>`;
		} else {
			civBonusHTML += `
			<div class="incomeActionInformationPanel">
				<div class="iconoclastsLeftInfo">
					<p class="iconoclastsCivBonusInfoText"><span class="bold">Iconoclasts Civ:</span> The Automa removes each landmark it has, gaining <img class="gameIcon" src="img/icons/rollScienceDie.png"> & 3 VP for each. Any new landmarks gained from advancing are included.</p>
				</div>
				<div class="iconoclastsRightInfo">
					<div class="iconoclastsScienceDieRoll">
						<div class="iconoclastsCivBonusDie scienceDieToRoll activeScienceDie">
							<img class="dice-face scienceDie benefitsRoll" src="img/dice/blank.png" />
							<div class="diceResults">
								<img class="dice-face noResult" src="img/dice/blank.png" />
								<img class="dice-face explorationResult" src="img/dice/exploration.png" />
								<img class="dice-face militaryResult" src="img/dice/military.png" />
								<img class="dice-face technologyResult" src="img/dice/technology.png" />
								<img class="dice-face scienceResult" src="img/dice/science.png" />
								<img class="dice-face artsResult" src="img/dice/arts.png" />
							</div>
						</div>
						<div class="clearDiv"></div>
						<a id="iconoclastsCivBonusScienceDieRollBtn" href="#" class="btn greenBtn actionScienceDice func-iconoclastsCivBonusScienceDieRoll">Roll Die</a>
					</div>
				</div>
				<div class="clearDiv"></div>
				<p id="iconoclastsTotalLandmarks" landmarks="${game.automaInfo.scoringLandmarks}">
					Current Landmarks:
					<span class="landmarksNum">${game.automaInfo.scoringLandmarks}</span>
					<span class="landmarksNumAdj"></span>
				</p>
			`;
		}

		civBonusHTML += `
				
			</div>
			`;
		
		$('.civBonus #incomeAutomaCiv').append(civBonusHTML);
		$('#incomeLayer #incomeInformation .civBonus #incomeAutomaCiv .tapestryActionContainer').addClass('collapsedContainer');
		$('.civBonus #incomeAutomaCiv .actionInformationPanel').fadeIn();
		$("#incomeButton").addClass('greyBtn').removeClass('redBtn func-nextIncomeStep');

	} else if(game.automaInfo.firstCivSpecs.civID == 'trailblazers') {

		trailblazersTiebreaker = 0;

		let trailblazersCivBonusHTML = `
				<div class="actionInformationPanel">
					<p id="trailblazersCivBonusInfo"><span class="bold">Trailblazers Civ:</span> Verify where your player token is on the Automas favorite track to confirm the placement of the next track outpost.</p>
				</div>
				<div class="clearDiv"></div>
			</div>
		`;

		$('.civBonus #incomeAutomaCiv').append(trailblazersCivBonusHTML);
		$('#incomeLayer #incomeInformation .civBonus #incomeAutomaCiv .tapestryActionContainer').addClass('collapsedContainer');
		$("#incomeButton").addClass('greyBtn').removeClass("redBtn func-nextIncomeStep");

		trailblazersIncomeTrackSetup(game.automaInfo.favTrack, 'favTrack');
	}
}

$(document).on(touchEvent, '.trackContainer.validEqualizerTrack .equalizerCivHumanPosToConfirm', function() {
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`.equalizerCivHumanPosToConfirm touchevent detected`);

	let validTrackForAdvancement = false;

	if($(this).hasClass('oneSpaceAhead')) {
		validTrackForAdvancement = true;
	} else if($(this).hasClass('twoSpacesAhead')) {
		validTrackForAdvancement = true;
	}

	let $thisTrack = $(this).closest('.trackContainer');
	$thisTrack.find('.confirmedHumanPos').removeClass('confirmedHumanPos');
	$(this).addClass('confirmedHumanPos');

	if(!$thisTrack.hasClass('lockedInEqualizerTrack')) $thisTrack.addClass('lockedInEqualizerTrack');
	$thisTrack.removeClass('validHumanPos invalidHumanPos');

	if(validTrackForAdvancement) {
		$thisTrack.addClass('validHumanPos');
	} else if(!validTrackForAdvancement) {
		$thisTrack.addClass('invalidHumanPos');
	}

	if($('.lockedInEqualizerTrack').length == $('.validEqualizerTrack').length) {
		$('#confirmHumanPosButton').removeClass('greyBtn').addClass('redBtn func-confirmEqualizerCivBonus');
	}

});

function confirmEqualizerCivBonus() {

	let validEqualizerTracks = [];
	
	$('.trackContainer.validEqualizerTrack.validHumanPos').each(function(){
		let equalizerTrackID = $(this).attr('id').split('-');
		validEqualizerTracks.push(equalizerTrackID[0])
	});

	$('.validEqualizerTrack').removeClass('validEqualizerTrack');

	if(validEqualizerTracks.length == 0) {

		game.automaInfo.incomeBonusVPs.amount = 5;
		game.automaInfo.incomeBonusVPs.total = 5;

		$('#equalizerBottomSection').html('<p>Due to there being no valid tracks for the Equalizers to advance on, the Automa instead gains <span class="bold">5 VP</span> during the income scoring phase (next screen).</p>');
		$("#incomeButton").addClass('redBtn func-nextIncomeStep').removeClass("greyBtn");

	} else {

		let finalEqualizerTrack = '';

		if(validEqualizerTracks.length == 1) {
			finalEqualizerTrack = validEqualizerTracks[0];

		} else if(validEqualizerTracks.length > 1) {
			for (let i = 0; i < game.firstCardInfo.trackTiebreakers.length; i++) {
				let thisTrack = game.firstCardInfo.trackTiebreakers[i];
				if(thisTrack == 'favorite') thisTrack = game.automaInfo.favTrack;
				if(validEqualizerTracks.indexOf(thisTrack) != -1) {
					finalEqualizerTrack = thisTrack;
					break;
				};
			}
		}

		let $finalAdvance = $(`#${finalEqualizerTrack}-equalizerTrack .trackImageContainer .equalizerCivHumanPosToConfirm.confirmedHumanPos`);
		$(`#${finalEqualizerTrack}-equalizerTrack`).addClass('finalizedEqualizerTrack');
		let moveNums = 0;
		let moveNumsText = '';

		if($finalAdvance.hasClass('oneSpaceAhead')) {
			moveNums = 1;
			moveNumsText = 'one space'
		} else if($finalAdvance.hasClass('twoSpacesAhead')) {
			moveNums = 2;
			moveNumsText = 'two spaces'
		}

		$(`.trackContainer:not(.finalizedEqualizerTrack) .trackImageContainer .equalizerCivHumanPosToConfirm`).remove();
		$(`.trackContainer.finalizedEqualizerTrack .trackImageContainer .equalizerCivHumanPosToConfirm:not(.confirmedHumanPos)`).remove();

		$('#equalizerBottomSection').html(`<p>The Automa advances <span class="bold">${moveNumsText}</span> on the <span class="bold">${capitalizeFirstLetter(finalEqualizerTrack)}</span> track.</p>`);

		setTimeout(function(){

			$('#incomeLayer #incomeInformation .civBonus #incomeAutomaCiv.equalizersCivContainer .actionInformationPanel').fadeOut('slow');

			setTimeout(function(){ 
				$('#incomeLayer #incomeInformation .civBonus #incomeAutomaCiv.equalizersCivContainer .actionInformationPanel').remove();

				if($('.civBonus').length || $('.dualCivBonus').length) {
					if(DEBUG_GAME) console.log(`$('.civBonus').length || $('.dualCivBonus').length condition met`);
					animateTrackMove('automa', finalEqualizerTrack, 'advance', 'incomeAction', 'true', moveNums);
				}
			}, automaTimeout);

		}, 1500);
	}
};

$(document).on(touchEvent, '.hucksterItemRow .changeItemVal', function() {
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`.hucksterItemRow .changeItemVal triggered`);

	// var $card = $(`${mapID} .cardContainer.activePlacement`);
    // var cardType = $card.attr('cardtype');
    // var thisRow = $card.closest('.mapTileContainer').data('map-row');
    // var thisColumn =  $card.closest('.mapTileContainer').data('map-column');

	let $trigger = $(this);
	let $thisParentItem = $trigger.closest('.hucksterItemRow');
	let thisItem = $thisParentItem.attr('id').split('-');

	let valChanged = false;
	
	if($trigger.hasClass('addOne')) {
		if(game.automaInfo.firstCivSpecs.huckstersStats[`${thisItem[1]}Num`] < 5) {
			game.automaInfo.firstCivSpecs.huckstersStats[`${thisItem[1]}Num`]++;
			valChanged = true;
		}
	} else if($trigger.hasClass('minusOne')) {
		if(game.automaInfo.firstCivSpecs.huckstersStats[`${thisItem[1]}Num`] > 0) {
			game.automaInfo.firstCivSpecs.huckstersStats[`${thisItem[1]}Num`]--;
			valChanged = true;
		}
	};

	if(valChanged) generateHuckstersItemCounts();

});

function generateHuckstersItemCounts(){
	let tapestryCards = game.automaInfo.firstCivSpecs.huckstersStats.tapestryCardNum;
	let techCards = game.automaInfo.firstCivSpecs.huckstersStats.techCardNum;
	let explorationTiles = game.automaInfo.firstCivSpecs.huckstersStats.explorationTileNum;
	let spaceTiles = game.automaInfo.firstCivSpecs.huckstersStats.spaceTileNum;

	$('#hucksterTotal-tapestryCard .itemImgAndAmount .itemAmount .itemVal').html(tapestryCards);
	$('#hucksterTotal-techCard .itemImgAndAmount .itemAmount .itemVal').html(techCards);
	$('#hucksterTotal-explorationTile .itemImgAndAmount .itemAmount .itemVal').html(explorationTiles);
	$('#hucksterTotal-spaceTile .itemImgAndAmount .itemAmount .itemVal').html(spaceTiles);

	if(aaExp) {
		let masterpieceCards = game.automaInfo.firstCivSpecs.huckstersStats.masterpieceCardNum;
		$('#hucksterTotal-masterpieceCard .itemImgAndAmount .itemAmount .itemVal').html(masterpieceCards);
	}

	let totalItems = totalHuckstersItems();

	game.automaInfo.incomeBonusVPs.amount = parseInt(totalItems);
	game.automaInfo.incomeBonusVPs.multiplier = parseInt(game.difficultySpecs.automaMat.eraBonuses[parseInt(game.era - 2)].landmarks);
	game.automaInfo.incomeBonusVPs.total = game.automaInfo.incomeBonusVPs.amount * game.automaInfo.incomeBonusVPs.multiplier;

	$('.totalHucksterItemsText .totalHucksterItemsVal').html(totalItems);
}

function totalHuckstersItems(){
	let tapestryCards = game.automaInfo.firstCivSpecs.huckstersStats.tapestryCardNum;
	let techCards = game.automaInfo.firstCivSpecs.huckstersStats.techCardNum;
	let explorationTiles = game.automaInfo.firstCivSpecs.huckstersStats.explorationTileNum;
	let spaceTiles = game.automaInfo.firstCivSpecs.huckstersStats.spaceTileNum;

	let totalHuckstersItemsCount = tapestryCards + techCards + explorationTiles + spaceTiles;

	if(aaExp) {
		let masterpieceCards = game.automaInfo.firstCivSpecs.huckstersStats.masterpieceCardNum;
		totalHuckstersItemsCount = totalHuckstersItemsCount + masterpieceCards;
	}

	return totalHuckstersItemsCount;
}

var automaHexesWithOneOutpostArray = [];

function conquerorsIncomeScreen(mode) {
	showLayer('income');
	$('#mapLayer.conquerorsMapSetup').removeClass('conquerorsMapSetup');

	let thisEra = game.era;
	let automaHexes = calculateAutomasConqueredHexes();

	let automaMilitaryCivBonusIncome = `<ul>`;

	if(mode == 'setup') {
		if(automaHexes < thisEra) {
			automaMilitaryCivBonusIncome += `
				<li class="goToMapBtnPreceedingItem">Due to the Automa controlling fewer territories than the current era (<span class="bold">${automaHexes} territories</span>), it performs a conquer action.</li>
				<li class="goToMapBtnListItem"><a href="#" id="goToMapBtn" class="btn blueBtn func-conquerorsCivBonusMapMode-conquer">Map - Conquer</a></li>
			`;
		} else {
	
			if(automaHexes == thisEra) {
				automaMilitaryCivBonusIncome += `
					<li>Due to the Automa controlling the same amount of territories than the current era (<span class="bold">${automaHexes} territories</span>), it <span class="bold italic">does not</span> perform a conquer action.</li>
				`;
			} else if(automaHexes > thisEra) {
				automaMilitaryCivBonusIncome += `
					<li>Due to the Automa controlling more territories than the current era (<span class="bold">${automaHexes} territories</span>), it <span class="bold italic">does not</span> perform a conquer action.</li>
				`;
			}
	
			automaHexesWithOneOutpostArray = calculateAutomasHexesWithOneOutpost();
			let automaHexesWithOneOutpostNum = automaHexesWithOneOutpostArray.length;
	
			if(automaHexesWithOneOutpostNum > 2) {
				automaMilitaryCivBonusIncome += `
					<li class="goToMapBtnPreceedingItem">The Automa has more than 2 territories with only 1 token (<span class="bold">${automaHexesWithOneOutpostNum} territories</span>), so it places a toppled Shadow Empire outpost on one of them.</li>
					<li class="goToMapBtnListItem"><a href="#" id="goToMapBtn" class="btn blueBtn func-conquerorsCivBonusMapMode-placeToppledSE">Map - SE Placement</a></li>
				`;
			} else {
				automaMilitaryCivBonusIncome += `
					<li>The Automa does not have more than 2 territories with 1 token (<span class="bold">${automaHexesWithOneOutpostNum} territories</span>), so it <span class="bold italic">does not</span> place a toppled Shadow Empire outpost.</li>
				`;

				$("#incomeButton").addClass('redBtn func-nextIncomeStep').removeClass("greyBtn");
			}
		}
	} else if(mode == 'checkAutomaSingleOutposts') {

		automaHexesWithOneOutpostArray = calculateAutomasHexesWithOneOutpost();
		let automaHexesWithOneOutpostNum = automaHexesWithOneOutpostArray.length;

		if(automaHexesWithOneOutpostNum > 2) {
			automaMilitaryCivBonusIncome += `
				<li class="goToMapBtnPreceedingItem">The Automa has more than 2 territories with only 1 token (<span class="bold">${automaHexesWithOneOutpostNum} territories</span>), so it places a toppled Shadow Empire outpost on one of them.</li>
				<li class="goToMapBtnListItem"><a href="#" id="goToMapBtn" class="btn blueBtn func-conquerorsCivBonusMapMode-placeToppledSE">Map - SE Placement</a></li>
			`;
		} else {
			automaMilitaryCivBonusIncome += `
				<li>The Automa does not have more than 2 territories with 1 token (<span class="bold">${automaHexesWithOneOutpostNum} territories</span>), so it <span class="bold italic">does not</span> place a toppled Shadow Empire outpost.</li>
			`;
			$("#incomeButton").addClass('redBtn func-nextIncomeStep').removeClass("greyBtn");
		}
	}

	automaMilitaryCivBonusIncome += `</ul>`;

	$('.civBonus #incomeAutomaCiv .nonActionInformationPanel').html(automaMilitaryCivBonusIncome);
	$('.civBonus #incomeAutomaCiv .nonActionInformationPanel').fadeIn();
	$('.civBonus #incomeAutomaCiv #incomeAutomaCivImg').addClass('nonActionCiv');
}

function conquerorsCivBonusMapMode(mode) {
	showLayer('map');
	showMapScreen(mode);
	buildMap();
	if(mode == 'conquer') {
		$('#mapLayer').addClass('conquerorsConquerMode');
	} else if(mode == 'placeToppledSE') {
		$('#mapLayer').addClass('conquerorsToppledSEMode');
	}
	
}

function dualCivBonusIncomeFunction() {

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`dualCivBonusIncomeFunction() func triggered`);
	if(DEBUG_GAME) console.log(`game.automaInfo.secondCivSpecs.civID => '${game.automaInfo.secondCivSpecs.civID}'`);
	if(DEBUG_GAME) console.log(`game.era => '${game.era}'`);

	var dualCivBonusIncomeStepHTML = `
		<div id="incomeAutomaCiv" class="${game.automaInfo.secondCivSpecs.civID}CivContainer">
	`;

	if(game.automaInfo.secondCivSpecs.civID == 'explorers' || game.automaInfo.secondCivSpecs.civID == 'scientists') {
		if(DEBUG_GAME) console.log(`game.automaInfo.secondCivSpecs.civID == 'explorers' || game.automaInfo.secondCivSpecs.civID == 'scientists' condition met'`);
		dualCivBonusIncomeStepHTML += `
		<div class="tapestryActionContainer collapsedContainer"></div>
		`;
	}

	dualCivBonusIncomeStepHTML += `
		<div class="clearDiv"></div>
		</div>
	`;

	$('#incomeLayer #incomeInformation .dualCivBonus').html(dualCivBonusIncomeStepHTML)

	if(game.automaInfo.secondCivSpecs.civID == 'explorers') {
		if(DEBUG_GAME) console.log(`game.automaInfo.secondCivSpecs.civID == 'explorers' condition met'`);
		var thisMove = `
			<p class="bold italic">Civilization Income Turn Bonus (Exploration)</p>
		`;
		recordMove(thisMove, 'custom', 'add');

		if(game.era == 2 || game.era == 4) {
			if(DEBUG_GAME) console.log(`game.era == 2 || game.era == 4 condition met'`);
			animateTrackMove('automa', 'exploration', 'advance', 'incomeAction', 'true', 1);
		} else if(game.era == 3 || game.era == 5) {
			if(DEBUG_GAME) console.log(`game.era == 3 || game.era == 5 condition met'`);
			animateTrackMove('automa', 'military', 'advance', 'incomeAction', 'true', 1);
		}

		setTimeout(function(){
			$("#incomeButton").addClass('redBtn func-nextIncomeStep').removeClass("greyBtn");
		}, 2500)

	} else if(game.automaInfo.secondCivSpecs.civID == 'scientists') {
		if(DEBUG_GAME) console.log(`game.automaInfo.secondCivSpecs.civID == 'scientists' condition met'`);
		var thisMove = `
			<p class="bold italic">Civilization Income Turn Bonus (Science)</p>
		`;
		recordMove(thisMove, 'custom', 'add');

		let automaScienceSecondCivBonusIncome = `
				<div class="actionInformationPanel scienceDiceBenefitsActionMove">
					<div class="mainActionArea">
						<div class="scienceDieToRoll activeScienceDie">
							<img class="dice-face scienceDie benefitsRoll" src="img/dice/blank.png" />
							<div class="diceResults">
								<img class="dice-face noResult" src="img/dice/blank.png" />
								<img class="dice-face explorationResult" src="img/dice/exploration.png" />
								<img class="dice-face militaryResult" src="img/dice/military.png" />
								<img class="dice-face technologyResult" src="img/dice/technology.png" />
								<img class="dice-face scienceResult" src="img/dice/science.png" />
								<img class="dice-face artsResult" src="img/dice/arts.png" />
							</div>
						</div>
						<p class="actionDescription">The Automa rolls and advances on the indicated track, receiving any benefits.</p>
					</div>
					<div class="clearDiv"></div>
					<a href="#" tracks="all" class="btn greenBtn actionScienceDice func-scienceDieActionSelection-scientistsCivBonus+advance+true" style="margin: 10px auto 0px;">Roll Die</a>
				</div>
				<div class="clearDiv"></div>
			</div>
		`;

		$('.dualCivBonus #incomeAutomaCiv').append(automaScienceSecondCivBonusIncome);
		$('#incomeLayer #incomeInformation .dualCivBonus #incomeAutomaCiv .tapestryActionContainer').addClass('collapsedContainer');
		$('.dualCivBonus #incomeAutomaCiv .actionInformationPanel').fadeIn();

   	} else if(game.automaInfo.secondCivSpecs.civID == 'engineers') {
		if(DEBUG_GAME) console.log(`game.automaInfo.secondCivSpecs.civID == 'engineers' condition met'`);
		if(DEBUG_GAME) console.log(`game.automaInfo.landmarks.length => '${game.automaInfo.landmarks.length}'`);

		let automaTechnologySecondCivBonusIncome = `
			<div class="nonActionInformationPanel">
				<p>The bots have collected <span class="bold">${game.automaInfo.landmarks.length}</span> Landmark<span style="display:none;" class="plural">s</span>, giving the Automa <span class="bold">${game.automaInfo.landmarks.length}</span> point<span style="display:none;" class="plural">s</span> this Income Turn. <span class="bold underline red">(calculated on scoring screen)</span></p>
			</div>
		`;

		$('.dualCivBonus #incomeAutomaCiv').append(automaTechnologySecondCivBonusIncome);

		if(game.automaInfo.landmarks.length != 1) {
			if(DEBUG_GAME) console.log(`game.automaInfo.landmarks.length != 1 condition met'`);
			$('.dualCivBonus #incomeAutomaCiv .nonActionInformationPanel .plural').css('display', 'inline-block');
		}

		$('.dualCivBonus #incomeAutomaCiv .nonActionInformationPanel').fadeIn();
		$('.dualCivBonus #incomeAutomaCiv #incomeAutomaCivImg').addClass('nonActionCiv')
		$("#incomeButton").addClass('redBtn func-nextIncomeStep').removeClass("greyBtn");

	} else if(game.automaInfo.secondCivSpecs.civID == 'conquerors') {
		if(DEBUG_GAME) console.log(`game.automaInfo.secondCivSpecs.civID == 'conquerors' condition met'`);

		let automaMilitarySecondCivBonusIncome = `
			<div class="nonActionInformationPanel">
				<ul>
					<li>If the Automa controls fewer th territories, it performs a conquer action.</li>
					<li class="goToMapBtnListItem"><a href="#" id="goToMapBtn" class="btn blueBtn func-showLayer-map func-showMapScreen-conquer func-buildMap">Map - Conquer</a></li>
					<li>If more than 2 territories controlled by the Automa have only 1 token, place a toppled Shadow Empire outpost on one of those (click "View Cards" if hex tiebreaker is required).</li>					
				</ul>
			</div>
		`;

		$('.dualCivBonus #incomeAutomaCiv').append(automaMilitarySecondCivBonusIncome);
		$('.dualCivBonus #incomeAutomaCiv .nonActionInformationPanel').fadeIn();
		$('.dualCivBonus #incomeAutomaCiv #incomeAutomaCivImg').addClass('nonActionCiv')
		// $("#incomeButton").addClass('redBtn func-nextIncomeStep').removeClass("greyBtn");

	}

}
	
function vpPointsScoringIncomeFunction() {

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`vpPointsScoringIncomeFunction() func triggered`);

	var civAbility = 'false';
	let incomeScoringInfo = '';

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`/-----------FIRST TO REACH NEW ERA----------/`);
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);

	var vpPointsScoringIncomeStepHTML = `
		<table class="automaPointsIncome">`;

		if(game.automaInfo.firstCivSpecs.civID == 'iconoclasts' || game.automaInfo.firstCivSpecs.civID == 'hucksters' || game.automaInfo.firstCivSpecs.civID == 'equalizers') {

			if(game.automaInfo.incomeBonusVPs.total > 0) {
				civAbility = 'true';

				vpPointsScoringIncomeStepHTML += `
				<tr class="civAbilityBonusSection">
					<td class="scoringIcon"><img src="img/income/civBonusScoring.png" /></td>
					<td class="numInput">${game.automaInfo.incomeBonusVPs.amount > 0 ? game.automaInfo.incomeBonusVPs.amount : ``}</td>
					<td class="multiplier">${game.automaInfo.incomeBonusVPs.multiplier > 0 ? `<span class="multiplierCross">x</span>${game.automaInfo.incomeBonusVPs.multiplier}` : ``}</td>
					<td class="equalsSign">${game.automaInfo.incomeBonusVPs.total > 0 ? `=` : ``}</td>
					<td class="vpOutput">${game.automaInfo.incomeBonusVPs.total > 0 ? `<span class="vps">${game.automaInfo.incomeBonusVPs.total}<span class="asterix blueAsterix">*</span></span>` : ``}</td>
					<td class="scoringCategory"><p>Automa Civ VPs</p></td>
				</tr>
				`;
			}
		}

		vpPointsScoringIncomeStepHTML += `
			<tr class="passingFirstBonusSection">
			<td class="scoringIcon">
				<img src="img/income/firstNeighbourhoodBonus.png" />
			</td>
		`;
		if(game.firstToReachEra == 'true') {
			if(DEBUG_GAME) console.log(`game.firstToReachEra == 'true' condition met'`);
			vpPointsScoringIncomeStepHTML += `
			<td class="numInput">${game.difficultySpecs.automaMat.eraBonuses[parseInt(game.era - 2)].startEraFirstVPs}</td>
			`;
		} else if(game.firstToReachEra == 'false') {
			if(DEBUG_GAME) console.log(`game.firstToReachEra == 'false' condition met'`);
			vpPointsScoringIncomeStepHTML += `
			<td class="numInput">0</td>
			`;
		}
		
		vpPointsScoringIncomeStepHTML += `
			<td class="multiplier"></td>
			<td class="equalsSign">=</td>
		`;

		if(game.firstToReachEra == 'true') {
			if(DEBUG_GAME) console.log(`game.firstToReachEra == 'true' condition met'`);
			vpPointsScoringIncomeStepHTML += `
				<td class="vpOutput"><span class="vps">${game.difficultySpecs.automaMat.eraBonuses[parseInt(game.era - 2)].startEraFirstVPs}</span></td>
				
			`;
		} else if(game.firstToReachEra == 'false') {
			if(DEBUG_GAME) console.log(`game.firstToReachEra == 'false' condition met'`);
			vpPointsScoringIncomeStepHTML += `
				<td class="vpOutput"><span class="vps">0</span></td>
			`;
		}

		vpPointsScoringIncomeStepHTML += `
				<td class="scoringCategory"><p>First to Era VPs</p></td>
			`;


		if(DEBUG_GAME) console.log(`/---------------------------------/`);
		if(DEBUG_GAME) console.log(`/------------LANDMARKS------------/`);
		if(DEBUG_GAME) console.log(`/---------------------------------/`);

		let landmarkValToScore = 0;

		if(game.automaInfo.firstCivSpecs.civID != 'iconoclasts') {
			landmarkValToScore = parseInt(game.automaInfo.landmarks.length);
		}


		if(DEBUG_GAME) console.log(`game.automaInfo.landmarks.length => '${game.automaInfo.landmarks.length}'`);

		vpPointsScoringIncomeStepHTML += `
		</tr>
		<tr class="landmarkIncomeSection">
			<td class="scoringIcon">
				<img src="img/income/landmark.png" />
			</td>
			<td class="numInput">
				${landmarkValToScore}
			</td>
		`;

		if(game.difficultyLevelNum !='0') {
			if(DEBUG_GAME) console.log(`game.difficultyLevelNum !='0' condition met'`);
			if(game.difficultyLevelNum != '5') {
				if(DEBUG_GAME) console.log(`game.difficultyLevelNum != '5' condition met'`);
				if(game.automaInfo.firstCivSpecs.civID == 'engineers') {
					if(DEBUG_GAME) console.log(`game.automaInfo.firstCivSpecs.civID == 'engineers' condition met'`);
					civAbility = 'true';
					vpPointsScoringIncomeStepHTML += `
						<td class="multiplier">
							<span class="red bold"><span class="multiplierCross">x</span>${game.difficultySpecs.automaMat.eraBonuses[parseInt(game.era - 2)].landmarks}<span class="asterix">*</span></span>
						</td>
					`;
				} else {
					if(DEBUG_GAME) console.log(`game.automaInfo.firstCivSpecs.civID != 'engineers' condition met'`);
					vpPointsScoringIncomeStepHTML += `
						<td class="multiplier">
						<span class="multiplierCross">x</span>${game.difficultySpecs.automaMat.eraBonuses[parseInt(game.era - 2)].landmarks}
						</td>
					`;
				}
			} else {
				if(DEBUG_GAME) console.log(`game.difficultyLevelNum == '5' condition met'`);
				if(game.automaInfo.firstCivSpecs.civID == 'engineers' || game.automaInfo.secondCivSpecs.civID == 'engineers') {
					if(DEBUG_GAME) console.log(`game.automaInfo.firstCivSpecs.civID == 'engineers' || game.automaInfo.secondCivSpecs.civID == 'engineers' condition met'`);
					civAbility = 'true';
					vpPointsScoringIncomeStepHTML += `
						<td class="multiplier">
							<span class="red bold"><span class="multiplierCross">x</span>${game.difficultySpecs.automaMat.eraBonuses[parseInt(game.era - 2)].landmarks}<span class="asterix">*</span></span>
						</td>
					`;
				} else {
					if(DEBUG_GAME) console.log(`game.automaInfo.firstCivSpecs.civID != 'engineers' && game.automaInfo.secondCivSpecs.civID != 'engineers' condition met'`);
					vpPointsScoringIncomeStepHTML += `
						<td class="multiplier">
						<span class="multiplierCross">x</span>${game.difficultySpecs.automaMat.eraBonuses[parseInt(game.era - 2)].landmarks}
						</td>
					`;
				}
			}

		} else {
			if(DEBUG_GAME) console.log(`game.difficultyLevelNum =='0' condition met'`);
			vpPointsScoringIncomeStepHTML += `
				<td class="multiplier">
				<span class="multiplierCross">x</span>${game.difficultySpecs.automaMat.eraBonuses[parseInt(game.era - 2)].landmarks}
				</td>
			`;
		}

		vpPointsScoringIncomeStepHTML += `
				<td class="equalsSign">=</td>
					<td class="vpOutput"><span class="vps">${(landmarkValToScore * parseInt(game.difficultySpecs.automaMat.eraBonuses[parseInt(game.era - 2)].landmarks))}</span></td>
					<td class="scoringCategory"><p>Landmarks VPs</p></td>
				</tr>
				<tr class="militaryTrackIncomeSection">
					<td class="scoringIcon"><img src="img/income/military.png" /></td>
					<td class="numInput">${game.automaInfo.trackPos[1]}</td>
					<td class="multiplier"><span class="multiplierCross">x</span>${game.difficultySpecs.automaMat.eraBonuses[parseInt(game.era - 2)].military}</td>
					<td class="equalsSign">=</td>
					<td class="vpOutput"><span class="vps">${(parseInt(game.automaInfo.trackPos[1]) * parseInt(game.difficultySpecs.automaMat.eraBonuses[parseInt(game.era - 2)].military))}</span></td>
					<td class="scoringCategory"><p>Military Track VPs</p></td>
				</tr>
				<tr class="scienceTrackIncomeSection">
					<td class="scoringIcon"><img src="img/income/science.png" /></td>
					<td class="numInput">${game.automaInfo.trackPos[3]}</td>
					<td class="multiplier"><span class="multiplierCross">x</span>${game.difficultySpecs.automaMat.eraBonuses[parseInt(game.era - 2)].science}</td>
					<td class="equalsSign">=</td>
					<td class="vpOutput"><span class="vps">${(parseInt(game.automaInfo.trackPos[3]) * parseInt(game.difficultySpecs.automaMat.eraBonuses[parseInt(game.era - 2)].science))}</span></td>
					<td class="scoringCategory"><p>Science Track VPs</p></td>
				</tr>
				<tr class="technologyTrackIncomeSection">
					<td class="scoringIcon"><img src="img/income/technology.png" /></td>
					<td class="numInput">${game.automaInfo.trackPos[0]}</td>
					<td class="multiplier"><span class="multiplierCross">x</span>${game.difficultySpecs.automaMat.eraBonuses[parseInt(game.era - 2)].technology}</td>
					<td class="equalsSign">=</td>
					<td class="vpOutput"><span class="vps">${(parseInt(game.automaInfo.trackPos[0]) * parseInt(game.difficultySpecs.automaMat.eraBonuses[parseInt(game.era - 2)].technology))}</span></td>
					<td class="scoringCategory"><p>Technology Track VPs</p></td>
				</tr>
				<tr class="explorationTrackIncomeSection">
					<td class="scoringIcon"><img src="img/income/exploration.png" /></td>
					<td class="numInput">${game.automaInfo.trackPos[2]}</td>
					<td class="multiplier"><span class="multiplierCross">x</span>${game.difficultySpecs.automaMat.eraBonuses[parseInt(game.era - 2)].exploration}</td>
					<td class="equalsSign">=</td>
					<td class="vpOutput"><span class="vps">${(parseInt(game.automaInfo.trackPos[2]) * parseInt(game.difficultySpecs.automaMat.eraBonuses[parseInt(game.era - 2)].exploration))}</span></td>
					<td class="scoringCategory"><p>Exploration Track VPs</p></td>
				</tr>
				${aaExp ? `
					<tr class="artsTrackIncomeSection">
						<td class="scoringIcon"><img src="img/income/arts.png" /></td>
						<td class="numInput">${game.automaInfo.trackPos[4]}</td>
						<td class="multiplier"><span class="multiplierCross">x</span>${game.difficultySpecs.automaMat.eraBonuses[parseInt(game.era - 2)].arts}</td>
						<td class="equalsSign">=</td>
						<td class="vpOutput"><span class="vps">${(parseInt(game.automaInfo.trackPos[4]) * parseInt(game.difficultySpecs.automaMat.eraBonuses[parseInt(game.era - 2)].arts))}</span></td>
						<td class="scoringCategory"><p>Arts Track VPs</p></td>
					</tr>
				` : ``}
				<tr class="conqueredHexesIncomeSection">
				<td class="scoringIcon">
					<img src="img/income/conqueredHexes.png" />
				</td>
				<td class="numInput">
					<input autocomplete="off" type="number" id="conqueredHexesInput" inputmode="numeric" pattern="[0-9]*" type="text" name="conqueredHexes" class="inactiveConqueredHexes">
					<span class="asterix orangeAsterix">*</span>
				</td>
		`;

		if(DEBUG_GAME) console.log(`/---------------------------------------/`);
		if(DEBUG_GAME) console.log(`/------------CONQUERED HEXES------------/`);
		if(DEBUG_GAME) console.log(`/---------------------------------------/`);

		if(game.difficultyLevelNum !='0') {
			if(DEBUG_GAME) console.log(`game.difficultyLevelNum !='0' condition met'`);
			if(game.automaInfo.firstCivSpecs.civID == 'conquerors' || game.difficultyLevelNum == '5' && game.automaInfo.secondCivSpecs.civID == 'conquerors') {
				if(DEBUG_GAME) console.log(`game.difficultyLevelNum != '5' condition met'`);

				if(game.automaInfo.firstCivSpecs.civID == 'conquerors') {
					civAbility = 'true';
					vpPointsScoringIncomeStepHTML += `
						<td class="multiplier"><span class="red bold">
							<span class="multiplierCross">x</span>${game.difficultySpecs.automaMat.eraBonuses[parseInt(game.era - 2)].controlledTerritories}<span class="asterix">*</span></span>
						</td>
					`;

				} else {
					if(DEBUG_GAME) console.log(`game.difficultyLevelNum =='0' condition met'`);
					vpPointsScoringIncomeStepHTML += `
						<td class="multiplier">
							<span class="multiplierCross">x</span>${game.difficultySpecs.automaMat.eraBonuses[parseInt(game.era - 2)].controlledTerritories}
						</td>
					`;
				}
	
			} else {
				if(DEBUG_GAME) console.log(`game.difficultyLevelNum =='0' condition met'`);
				vpPointsScoringIncomeStepHTML += `
					<td class="multiplier">
						<span class="multiplierCross">x</span>${game.difficultySpecs.automaMat.eraBonuses[parseInt(game.era - 2)].controlledTerritories}
					</td>
				`;
			}

		} else {
			if(DEBUG_GAME) console.log(`game.difficultyLevelNum =='0' condition met'`);
			vpPointsScoringIncomeStepHTML += `
				<td class="multiplier">
					<span class="multiplierCross">x</span>${game.difficultySpecs.automaMat.eraBonuses[parseInt(game.era - 2)].controlledTerritories}
				</td>
			`;
		}

		if(civAbility == 'true') {
			if(game.automaInfo.firstCivSpecs.civID == 'hucksters') {
				if(DEBUG_GAME) console.log(`civAbility == 'true' condition met'`);
				let huckstersItems = totalHuckstersItems();
				incomeScoringInfo += `<p class="civBonusText"><span class="asterix blueAsterix">*</span>${huckstersItems} face up item${huckstersItems == 1 ? `` : `s`} with current era landmark scoring multiplier applied</p>`;
			} else if(game.automaInfo.firstCivSpecs.civID == 'equalizers') {
				if(DEBUG_GAME) console.log(`civAbility == 'true' condition met'`);
				incomeScoringInfo += `<p class="civBonusText"><span class="asterix blueAsterix">*</span>5 VP gained due to no valid tracks for the Equalizers to advance on</p>`;
			} else if(game.automaInfo.firstCivSpecs.civID == 'iconoclasts') {
				let prevLandmarks = game.automaInfo.incomeBonusVPs.total / 3;
				if(DEBUG_GAME) console.log(`civAbility == 'true' condition met'`);
				incomeScoringInfo += `<p class="civBonusText"><span class="asterix blueAsterix">*</span>The Iconoclasts removed ${prevLandmarks} landmark${prevLandmarks == 1 ? `` : `s`} for 3 VP each</p>`;
			} else {
				if(DEBUG_GAME) console.log(`civAbility == 'true' condition met'`);
				incomeScoringInfo += `<p class="civBonusText"><span class="asterix redAsterix">*</span>Civ ability applied (+1 multiplier)</p>`;
			}
		}

		incomeScoringInfo += `<p class="conqueredTerritoriesReminder"><span class="asterix orangeAsterix">*</span>Estimated from the last map update. Manually update if required.</p>`;

		vpPointsScoringIncomeStepHTML += `
					<td class="equalsSign">=</td>
					<td class="vpOutput"><span class="vps">0</span></td>
					<td class="scoringCategory"><p>Conquered Territories VPs</p></td>
				</tr>
			</table>
		
			<p id="totalScore" class="underline">Total Income: <span class="bold"><span class="totalIncomeValue"></span> VP</span></p>
			<div id="incomeScoringTableBottomSection">${incomeScoringInfo}</div>
		`;

		// game.automaInfo.incomeBonusVPs.amount
		// game.automaInfo.incomeBonusVPs.multiplier
		// game.automaInfo.incomeBonusVPs.total

	$('#incomeLayer #incomeInformation .vpPointsScoring').html(vpPointsScoringIncomeStepHTML);

	var automaHexesNum = calculateAutomasConqueredHexes();
	$('#conqueredHexesInput').val(automaHexesNum);
	calculateAutomaTotalIncomeVPs();

}

function calculateAutomasConqueredHexes() {
	var automaConqueredHexes = 0;

	for (let l = 0; l < game.map.tiles.length; l++) {
		if(game.map.tiles[l].control == 'automa') {
			if(DEBUG_GAME) console.log(`game.map.tiles[l].control == 'automa' condition met'`);
			automaConqueredHexes++;
		}
	}

	return automaConqueredHexes;

}

function calculateAutomasHexesWithOneOutpost() {
	var hexesWithOneOutpost = [];
	for (let l = 0; l < game.map.tiles.length; l++) {
		if(game.map.tiles[l].control == 'automa' && game.map.tiles[l].twoOutposts == 'false') {
			if(DEBUG_GAME) console.log(`game.map.tiles[l].control == 'automa' && game.map.tiles[l].twoOutposts == 'false' condition met'`);
			hexesWithOneOutpost.push(l);
		}
	}
	return hexesWithOneOutpost;
}

function automaPointsReminder(){

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`automaPointsReminder() func triggered`);
	if(DEBUG_GAME) console.log(`currentAutomaPoints => '${currentAutomaPoints}'`);

	$('.func-automaPointsReminder').removeClass('func-automaPointsReminder');

	var automaPointsReminderHTML = `
		<div class="confirmationBox alertEl actionTypeAlertBox automaPointsReminder">
			<p>The Automa receives <span class="bold underline">${currentAutomaPoints} VP</span><br />for the current income turn.</p>
			<p style="text-align:center;margin: 30px 0px;">New score: <span class="bold underline">${game.incomePoints.total} VP</p>
			<div class="buttons" btns="1">
				<a href="#" class="btn redBtn">Close</a>
			</div>
		</div>
	`;

	$(automaPointsReminderHTML).appendTo('body');
	$('.confirmationBox.automaPointsReminder').fadeIn();
	$('#resetOverlay').fadeIn();
	$('#resetOverlay').addClass('keepOpen');

	deactivateMenu();
}






function calculateAutomaTotalIncomeVPs() {

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`calculateAutomaTotalIncomeVPs() func triggered`);

	var value = $('#conqueredHexesInput').val();

	if(DEBUG_GAME) console.log(`value => '${value}'`);
    
    if ((value !== '') && (value.indexOf('e') === -1)) {
        if(DEBUG_GAME) console.log(`(value !== '') && (value.indexOf('e') === -1) condition met'`);
        $('#conqueredHexesInput').val(Math.max(Math.min(value, 8), -8));
    } else {
		if(DEBUG_GAME) console.log(`(value !== '') && (value.indexOf('e') === -1) condition NOT met'`);
		$('#conqueredHexesInput').val('');
	}

	if(DEBUG_GAME) {
		console.log(`parseInt($('#conqueredHexesInput').val()) => '${parseInt($('#conqueredHexesInput').val())}'`);

	}

	$('.conqueredHexesIncomeSection .vpOutput').html(`<span class="vps">${parseInt($('#conqueredHexesInput').val()) * game.difficultySpecs.automaMat.eraBonuses[parseInt(game.era - 2)].controlledTerritories}</span>`)

	var allValues = [];

	$('.vpOutput .vps').each(function() {
		allValues.push(parseInt($(this).html()));
	});

	currentAutomaPoints = 0;
	for (var i = 0; i < allValues.length; i++) {
		currentAutomaPoints += allValues[i]
	}

	game.incomePoints[`era${game.era}`] = currentAutomaPoints;
	game.incomePoints.total = game.incomePoints.total + currentAutomaPoints;

	if(DEBUG_GAME) console.log(`currentAutomaPoints => '${currentAutomaPoints}'`);

	$('#totalScore .totalIncomeValue').html(currentAutomaPoints)

	if(game.era == 5) {
		if(DEBUG_GAME) console.log(`game.era == 5 condition met'`);
		if(game.automaInfo.firstCivSpecs.civID == 'trailblazers' || game.difficultyLevelNum == '5' && game.automaInfo.secondCivSpecs.civID == 'trailblazers') {
			$("#incomeButton").addClass('redBtn func-automaPointsReminder func-trailblazersEndGameProcess').removeClass("greyBtn");
		} else {
			$("#incomeButton").addClass('redBtn func-automaPointsReminder func-endGameProcess').removeClass("greyBtn");
		}
		$('#incomeButton').text('End Game');
	} else {
		if(DEBUG_GAME) console.log(`game.era != 5 condition met'`);
		$("#incomeButton").addClass('redBtn func-automaPointsReminder func-nextIncomeStep').removeClass("greyBtn");
	}

	game.automaInfo.incomeBonusVPs.amount = 0;
	game.automaInfo.incomeBonusVPs.multiplier = 0;
	game.automaInfo.incomeBonusVPs.total = 0;
	game.automaInfo.scoringLandmarks = 0;
}

function addNoExtraCardsIncomeFunction() {
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`addNoExtraCardsIncomeFunction() func triggered`);
	addCards(0);
}

function addTwoExtraCardsIncomeFunction() {
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`addTwoExtraCardsIncomeFunction() func triggered`);
	addCards(2);
}

function addFourExtraCardsIncomeFunction() {
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`addFourExtraCardsIncomeFunction() func triggered`);
	addCards(4);
}

function addSixExtraCardsIncomeFunction() {
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`addSixExtraCardsIncomeFunction() func triggered`);
	addCards(6);
}

function startNextEra() {

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`startNextEra() func triggered`);

	if($('.firstEraIncomeAndSetup').length) $('.firstEraIncomeAndSetup').removeClass('firstEraIncomeAndSetup');

	game.currentMode = 'game';

	showLayer('game');

	gameButtonDisplay('nextAction', true);
	gameButtonDisplay('incomeTurn', false);
	gameButtonDisplay('draw', false);
	gameButtons();

	game.firstToReachEra = 'false';

	$('.tapestryActionContainer').html('');
	$('#incomeLayer').remove();

	if(DEBUG_GAME) console.log(`game.era => '${game.era}'`);

	if(game.era == 1) {
		if(DEBUG_GAME) console.log(`game.era == 1 condition met'`);
		gameStartImportant();
	} else {
		if(DEBUG_GAME) console.log(`game.era != 1 condition met'`);
		landmarkReminder();
	}

	var thisMove = `<h2>Era ${game.era}</h2>`;
	recordMove(thisMove, 'custom', 'add');

	updateGame();

}

function gameStartImportant() {

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`gameStartImportant() func triggered`);
	
	var gameStartImportantHTML = `
		<div class="confirmationBox alertEl actionTypeAlertBox gameStartImportant">
			<p><span class="red bold">IMPORTANT:</span> For this Automa helper to correctly work you will need to make sure you record in the app when you take any landmarks associated with the advancement tracks. </p>
			<p>You can do this by clicking the <span class="bold">"Landmarks"</span> button and then selecting which landmark you've taken to log it as being unavailable for the Automa + Shadow Empire.</p>
			<div class="buttons" btns="1">
				<a href="#" class="btn redBtn ${game.automaInfo.firstCivSpecs.civID == "hucksters" || game.difficultyLevelNum == "5" && game.automaInfo.secondCivSpecs.civID == "hucksters" ? 'func-hucksterCivReminder' : 'func-landmarkReminder'}">Close</a>
			</div>
		</div>
	`;

	$(gameStartImportantHTML).appendTo('body');
	$('.confirmationBox.gameStartImportant').fadeIn();
	$('#resetOverlay').fadeIn();
	$('#resetOverlay').addClass('keepOpen');

	deactivateMenu();
}

function hucksterCivReminder() {

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`hucksterCivReminder() func triggered`);
	
	var hucksterCivReminderHTML = `
		<div class="confirmationBox alertEl actionTypeAlertBox hucksterCivReminder">
			<p>Remember when playing against the Hucksters Civ that whenever you gain...</p>
			<div id="validHucksterItems">
			<p><img class="gameIcon" src="img/icons/tapestryCard.png" /> / <img class="gameIcon" src="img/icons/techCard.png" /> / <img class="gameIcon" src="img/icons/explorationTile.png" /> / <img class="gameIcon" src="img/icons/spaceTile.png" />${aaExp ? ` / <img class="gameIcon" src="img/icons/masterpieceCard.png" />` : ``}</p>
			</div>
			<p>...you can take that item from the Automas <span class="bold underline">face up pool</span> instead of the normal supply (if available).</p>
			<div class="buttons" btns="1">
				<a href="#" class="btn redBtn func-landmarkReminder">Close</a>
			</div>
		</div>
	`;

	setTimeout(function(){
		$(hucksterCivReminderHTML).appendTo('body');
		$('.confirmationBox.hucksterCivReminder').fadeIn();
		$('#resetOverlay').fadeIn();
		$('#resetOverlay').addClass('keepOpen');
	}, 200);

	deactivateMenu();
}

function shadowEmpireStartImportant() {

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`shadowEmpireStartImportant() func triggered`);
	
	var shadowEmpireStartImportantHTML = `
		<div class="confirmationBox alertEl actionTypeAlertBox shadowEmpireStartImportant">
		<p><span class="red bold">IMPORTANT:</span> For this Automa helper to correctly work you will need to make sure you record in the app when you take any landmarks associated with the advancement tracks.</p>
		<p>You can do this by clicking the <span class="bold">"Landmarks"</span> button and then selecting which landmark you've taken to log it as being unavailable for the Automa + Shadow Empire.</p>
			<div class="buttons" btns="1">
				<a href="#" class="btn redBtn func-landmarkReminder">Close</a>
			</div>
		</div>
	`;

	$(shadowEmpireStartImportantHTML).appendTo('body');
	$('.confirmationBox.shadowEmpireStartImportant').fadeIn();
	$('#resetOverlay').fadeIn();
	$('#resetOverlay').addClass('keepOpen');

	deactivateMenu();
}

function trailblazersEndGameProcess() {

	// game.humanInfo.trackPos = [5, 5, 5, 5, 5];

	// game.automaInfo.trailblazersOutposts = [
	// 	[2, 7, 8, 9],
	// 	[],
	// 	[],
	// 	[],
	// 	[2]
	// ];

	// game.incomePoints.era2 = 36;
	// game.incomePoints.era3 = 72;
	// game.incomePoints.era4 = 108;
	// game.incomePoints.era5 = 144;

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`trailblazersEndGameProcess() func triggered`);

	var trailblazersEndGameHTML = `
		<h2>End of Game Civ Bonus</h2>
		<p id="trailblazersEndOfGameInfoText"><span class="bold">Trailblazers Civ:</span> Once you have also finished the game (if you haven't already), confirm whether you advanced passed each track outpost by clicking the <span class="bold redText">left-hand side of each track container if you haven't</span>, or the <span class="bold greenText">right-hand side if you have</span>.</p>
		<p id="trailblazersEndOfGameExtraInfoText">Any containers that are already showing you passed the track outpost is based on your previously confirmed track placements during the Automas income turns.</p>
		<div id="trailblazersEndOfGameParentContainer">
		<ul class="allTrailblazerEndGameContainers">
	`;

	let trackOutpostsNotPassed = 0;

	for (let trackIndex = 0; trackIndex < game.automaInfo.trailblazersOutposts.length; trackIndex++) {
		if(game.automaInfo.trailblazersOutposts[trackIndex].length != 0) {

			var trackName = game.tracks[trackIndex];
			var humanPos = game.humanInfo.trackPos[trackIndex];

			for (let j = 0; j < game.automaInfo.trailblazersOutposts[trackIndex].length; j++) {

				let trackOutpostPos = game.automaInfo.trailblazersOutposts[trackIndex][j];
				let trackOutpostPassedCondition = '';

				if(humanPos > trackOutpostPos) {
					trackOutpostPassedCondition = 'true';
				} else {
					trackOutpostPassedCondition = 'false';
					trackOutpostsNotPassed++;
				}

				trailblazersEndGameHTML += `
					<li trackoutpostpassed="${trackOutpostPassedCondition}" class="trailblazerEndGameContainer-li">
						
						<div class="trackOutpostStatusContainer${trackOutpostPos == 12 ? `` : ` trackOutpostLocked`}">
							<div class="trackOutpostStatusOption trackOutpost-false">
								<p class="trackOutpostArrow falseArrow">&#8592;</p>
								<p class="falseLine">|</p></div>
							<div class="trackOutpostStatusOption trackOutpost-${trackOutpostPos == 12 ? `locked` : `true`}">
								${trackOutpostPos == 12 ? `
									<ion-icon class="trackOutpostLockedIcon" name="lock-closed-outline"></ion-icon>
									<ion-icon class="trackOutpostLockedIconShadow" name="lock-closed-outline"></ion-icon>
								` : `
									<p class="trackOutpostArrow trueArrow">&#8594;</p>
								`}
							</div>
						</div>
						<div class="trailblazerEndGameContainer currentSpace-${trackOutpostPos}">
							<img class="trackIcon" src="img/tracks/${trackName}Icon.png" />
							<img class="trackOutpost" src="img/outposts/${game.automaInfo.trailblazerOutpostColor}.png" />
							<div class="trackImageContainer">
								<div class="trackImagePosContainer">
									<img class="trackImg" src="img/fullTracks/${trackName}-landmarks.jpg" />
								</div>
							</div>
						</div>

					</li>
				`;
			}
		}
	}

	trailblazersEndGameHTML += `
			</ul>
			<div id="trailblazersEndGameCivTotalsContainer">
				<p id="trailblazersEndGameCivTotalAmountText" class="trailblazersSummaryText">Track outposts not passed = <span class="trailblazersfinalTotalNumber bold underline"></span> <span class="bold underline">outposts</span></p>
			</div>

			<div id="confirmTrailblazersTrackOutposts">
				<a id="confirmTrailblazersTrackOutpostsBtn" href="#" class="btn redBtn func-endGameTrailblazersVPsPopup func-endGameProcess">Confirm</a>
			</div>
    `;

	$('#incomeLayer').html(trailblazersEndGameHTML);

	calculateEndGameTrailblazersVPs();
}

$(document).on(touchEvent, '.trackOutpostStatusContainer .trackOutpostStatusOption:not(.activeTrackOutpostOption)', function() {

    if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
    if(DEBUG_GAME) console.log(`.trackOutpostStatusContainer .trackOutpostStatusOption:not(.activeTrackOutpostOption) touchevent triggered`);

	let $thisOutpost = $(this);
	let $outpostContainer = $(this).closest('.trailblazerEndGameContainer-li');
	$outpostContainer.find('.activeTrackOutpostOption').removeClass('activeTrackOutpostOption');
	$thisOutpost.addClass('activeTrackOutpostOption');

	
	if($thisOutpost.hasClass('trackOutpost-true')) {
		$outpostContainer.attr('trackoutpostpassed', 'true');
	} else if($thisOutpost.hasClass('trackOutpost-false')) {
		$outpostContainer.attr('trackoutpostpassed', 'false');

	}

	calculateEndGameTrailblazersVPs();

})

function calculateEndGameTrailblazersVPs() {

	let trailblazersTotalNumber = 0; 
	let trailblazersTotalScore = 0;

	$('.trailblazerEndGameContainer-li').each(function(){
		let outpostPassed = $(this).attr('trackoutpostpassed');
		if(outpostPassed == 'false') {
			trailblazersTotalNumber++;
			trailblazersTotalScore = trailblazersTotalScore + 10;
		}
	});

	let newTrailblazersSummaryHTML = `
		<div id="trailblazersEndGameCivTotalsContainer">
			<p id="trailblazersEndGameCivTotalAmountText" class="trailblazersSummaryText">Track outposts not passed = <span class="trailblazersfinalTotalNumber bold underline">${trailblazersTotalNumber}</span> <span class="bold underline">outpost${trailblazersTotalNumber == 1 ? `` : `s`}</span> (x 10 VP = ${trailblazersTotalScore} VP)</p>
		</div>
	`;

	$('#trailblazersEndGameCivTotalsContainer').html(newTrailblazersSummaryHTML);

	game.automaInfo.incomeBonusVPs.amount = trailblazersTotalNumber;
	game.automaInfo.incomeBonusVPs.multiplier = 10;
	game.automaInfo.incomeBonusVPs.total = trailblazersTotalScore;

}


function endGameTrailblazersVPsPopup(){

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`endGameTrailblazersVPs() func triggered`);
	if(DEBUG_GAME) console.log(`currentAutomaPoints => '${currentAutomaPoints}'`);

	$('.func-endGameTrailblazersVPs').removeClass('func-endGameTrailblazersVPs');
	
	game.incomePoints.total = game.incomePoints.total + game.automaInfo.incomeBonusVPs.total;

	var endGameTrailblazersVPsHTML = `
		<div class="confirmationBox alertEl actionTypeAlertBox endGameTrailblazersVPs">

			${game.automaInfo.incomeBonusVPs.total != 0 ? `
				<p>The Automa receives <span class="bold">${game.automaInfo.incomeBonusVPs.total} VP</span> for its end game bonus as the Trailblazers Civ.</p>
				<p style="text-align:center;margin: 30px 0px;">New score: <span class="bold underline">${game.incomePoints.total} VP</p>
			` : `
				<p>The Automa <span class="bold underline">does not receive any VP</span> for its end game bonus as the Trailblazers Civ.</p>
			`}

			<div class="buttons" btns="1">
				<a href="#" class="btn redBtn">Close</a>
			</div>
		</div>
	`;

	$(endGameTrailblazersVPsHTML).appendTo('body');
	$('.confirmationBox.endGameTrailblazersVPs').fadeIn();
	$('#resetOverlay').fadeIn();
	$('#resetOverlay').addClass('keepOpen');

	deactivateMenu();
}




function endGameProcess() {

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`endGameProcess() func triggered`);

	var totalIncomePoints = game.incomePoints.era2 + game.incomePoints.era3 + game.incomePoints.era4 + game.incomePoints.era5;

	for (let i = 0; i < game.achievements.length; i++) {
		const element = game.achievements[i];
	}

	let automaAchievementsVPs = [];
	let totalAutomaAchievementsVPs = 0;

	const allAchievements = Object.keys(game.achievements);
	for (const thisAchievement of allAchievements) {
		if(game.achievements[thisAchievement][0] == 'automa') {
			automaAchievementsVPs.push(10);
			totalAutomaAchievementsVPs += 10;
		} else if(game.achievements[thisAchievement][1] == 'automa') {
			automaAchievementsVPs.push(5);
			totalAutomaAchievementsVPs += 5;
		} else {
			automaAchievementsVPs.push('-');
		}
	}

	var totalPoints = game.incomePoints.total;

	if(DEBUG_GAME) {
		console.log(`game.incomePoints.era2 => '${game.incomePoints.era2}'`);
		console.log(`game.incomePoints.era3 => '${game.incomePoints.era3}'`);
		console.log(`game.incomePoints.era4 => '${game.incomePoints.era4}'`);
		console.log(`game.incomePoints.era5 => '${game.incomePoints.era5}'`);
		console.log(`totalPoints => '${totalPoints}'`);
	} 

	var endGameHTML = `
		<h2>Final Automa Score</h2>
		<div id="finalAutomaScoreContainer">
			<table class="automaIncomeSummary">
				<tbody>
					<tr>
						<th class="titleColumn">Income Turn</th>
						<th class="vpColumn">VPs</th>
					</tr>
					<tr>
						<td class="titleColumn">2</td>
						<td class="vpColumn">${game.incomePoints.era2}</td>
					</tr>
					<tr>
						<td class="titleColumn">3</td>
						<td class="vpColumn">${game.incomePoints.era3}</td>
					</tr>
					<tr>
						<td class="titleColumn">4</td>
						<td class="vpColumn">${game.incomePoints.era4}</td>
					</tr>
					<tr>
						<td class="titleColumn">5</td>
						<td class="vpColumn">${game.incomePoints.era5}</td>
					</tr>
					<tr class="subtotalRow">
						<td class="titleColumn">Subtotal</td>
						<td class="vpColumn">${totalIncomePoints}</td>
					</tr>
				</tbody>
			</table>

			<table class="automaAchievementsSummary">
				<tbody>
					<tr>
						<th class="titleColumn">Achievement</th>
						<th class="vpColumn">VPs</th>
					</tr>
					<tr>
						<td class="achievementText titleColumn">Complete Any<br />Advancement Track</td>
						<td class="vpColumn">${automaAchievementsVPs[0]}</td>
					</tr>
					<tr>
						<td class="achievementText titleColumn">Topple Two<br />Opponent Outposts</td>
						<td class="vpColumn">${automaAchievementsVPs[1]}</td>
					</tr>
					<tr>
						<td class="achievementText titleColumn">Conquer<br />Middle Island</td>
						<td class="vpColumn">${automaAchievementsVPs[2]}</td>
					</tr>
					<tr class="subtotalRow">
						<td class="titleColumn">Subtotal</td>
						<td class="vpColumn">${totalAutomaAchievementsVPs}</td>
					</tr>
				</tbody>
			</table>

			<div class="clearDiv"></div>

			${
				game.automaInfo.firstCivSpecs.civID == 'trailblazers' || game.difficultyNum == '5' && game.automaInfo.secondCivSpecs.civID == 'trailblazers' ? `
				<table class="automaEndGameVPSummary">
					<tbody>
						<tr>
							<th class="titleColumn">Automa Civ Bonus</th>
							<th class="vpColumn">VPs</th>
						</tr>
						<tr>
							<td class="titleColumn">Trailblazers Civ<br />(${game.automaInfo.incomeBonusVPs.amount} track outposts x 10 VP)</td>
							<td class="vpColumn">${game.automaInfo.incomeBonusVPs.total}</td>
						</tr>
					</tbody>
				</table>
				` : ``
			}

			<p id="finalTotalPoints">Final Score: <span id="finalTotalPointsVal">${game.automaInfo.firstCivSpecs.civID == 'trailblazers' || game.difficultyNum == '5' && game.automaInfo.secondCivSpecs.civID == 'trailblazers' ? totalPoints + game.automaInfo.incomeBonusVPs.total : totalPoints} VP</span></p>

			<p style="text-align:center!important;">Log your score <a href="https://docs.google.com/forms/d/e/1FAIpQLSdB5suEf0YgwTwUVNd9yIlqMeuPqrIBasM-j-pRYDPwXwfYNw/viewform" target="_blank">here</a>.</p>
			<div class="buttons" btns="1">
				<a id="newGameButton" href="#" class="btn redBtn func-newGame">New Game</a>
			</div>
		</div>
	`;

	$('#incomeLayer').html(endGameHTML)


	// resetGame();
}

function generateAllHTML(){

	// <div id="shadowEmpireOnlyColorChoiceContainer" class="shadowEmpireOnlyInfoContainer">
	// <div id="shadowEmpireOnlyTrackChoiceContainer" class="shadowEmpireOnlyInfoContainer">

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`generateAllHTML() func triggered`);

	var shadowEmpireInstructionsHTML = `
		<div id="shadowEmpireAutomatedSystemLayer" class="layer extraSetupScreen">
			<h2 class="roundGameGoalsTitle">Shadow Empire Opponent</h2>
			<div class="shadowEmpireOnlyInstructions">
				<ol>
					<li>Choose a color for the Shadow Empire.</li>
					<li>Place 1 of its <span class="bold shadowEmpireColorReplace"></span> player tokens at the starting space of each advancement track and set 1 additional token aside.</li>
				</ol>
			</div>

			<div class="shadowEmpireOnlyOpponentInfo">
				<div id="shadowEmpireOnlyColorChoiceContainer" class="shadowEmpireOnlyColor chooseColorContainer shadowEmpireOnlyInfoContainer">
					<p>Shadow Empire Color</p>
					<img class="color-blue shadowEmpireOnlyOutpostChoice outpostColor" src="img/outposts/blue.png" />
					<img class="color-red shadowEmpireOnlyOutpostChoice outpostColor" src="img/outposts/red.png" />
					<img class="color-green shadowEmpireOnlyOutpostChoice outpostColor" src="img/outposts/green.png" />
					<img class="color-yellow shadowEmpireOnlyOutpostChoice outpostColor" src="img/outposts/yellow.png" />
					<img class="color-grey shadowEmpireOnlyOutpostChoice outpostColor" src="img/outposts/grey.png" />
				</div>
				<div id="shadowEmpireOnlyTrackChoiceContainer" class="shadowEmpireOnlyInfoContainer">
					<p>Favorite Track</p>
					<div class="labelAndSelectContainer">
						<div class="favTrackIcons"></div>
						<select id="shadowEmpireOnlyFavTrackSelectID" name="shadowEmpireOnlyFavTrackList" class="shadowEmpireOnlyFavTrackList">
							<option value="exploration" selected>Exploration</option>
							<option value="military">Military</option>
							<option value="science">Science</option>
							<option value="technology">Technology</option>
						</select>
					</div>
				</div>
				<div class="clearDiv"></div>
			</div>
			<div class="buttons">
				<a href="#" class="btn redBtn func-showLayer-start">Back</a>
				<a href="#" class="btn blueBtn func-chooseRandomShadowEmpireOnlyFavTrack">Random</a>
				<a href="#" class="btn greenBtn func-showLayer-game func-gameButtons func-initActionArea func-shadowEmpireStartImportant">Next</a>
			</div>
		</div>
	`;

	$(shadowEmpireInstructionsHTML).appendTo('#container');

	var humanCivsAndCityMatChoice = `
		<div id="fullAutomaChooseCivsLayer" class="layer extraSetupScreen">
			<h2 class="roundGameGoalsTitle">Human Civ + Map Randomizer</h2>
			<p id="humanCivsText">Choose one of the following Civilizations to play as, applying any adjustments at the start of the game.</p>
			<div class="allCivOptionContainer">
				<div id="civOption1" class="civOptionContainer"></div>
				<div id="civOption2" class="civOptionContainer"></div>
				<div class="clearDiv"></div>
				<p id="humanCityMatText">Capital City Mats<span class="bold">*</span> - <span id="capitalCityMatInfo" class="bold"></span></p>
				<p id="humanCityMatTextExtraInfo"><span class="bold">*</span> No matter which city mat you use, you'll still position your two starting outposts on the map hex labeled <span class="bold underline">2/4</span></p>
			</div>
			
			<div class="buttons">
				<a href="#" class="btn redBtn func-showLayer-start">Back</a>
				<a id="randomizeHumanCivChoicesButton" href="#" class="btn blueBtn func-randomizeHumanCivChoices">Random</a>
				<a href="#" class="btn greenBtn func-showLayer-fullAutomaConfigColorChoice">Next</a>
			</div>
		</div>
	`;

	$(humanCivsAndCityMatChoice).appendTo('#container');

	var humanAndAIColorsHTML = `
		<div id="fullAutomaConfigColorChoiceLayer" class="layer extraSetupScreen">
		<h2 class="roundGameGoalsTitle">Player Colors</h2>
			<p>Click on the outposts to change the player colors.</p>
			<div class="humanColor chooseColorContainer">
				<p>Human</p>
				<img class="color-blue humanOutpostChoice outpostColor" src="img/outposts/blue.png" />
				<img class="color-red humanOutpostChoice outpostColor" src="img/outposts/red.png" />
				<img class="color-green humanOutpostChoice outpostColor" src="img/outposts/green.png" />
				<img class="color-yellow humanOutpostChoice outpostColor" src="img/outposts/yellow.png" />
				<img class="color-grey humanOutpostChoice outpostColor" src="img/outposts/grey.png" />
				<div class="clearDiv"></div>
			</div>
			<div class="automaColor chooseColorContainer">
				<p>Automa</p>
				<img class="color-blue automaOutpostChoice outpostColor" src="img/outposts/blue.png" />
				<img class="color-red automaOutpostChoice outpostColor" src="img/outposts/red.png" />
				<img class="color-green automaOutpostChoice outpostColor" src="img/outposts/green.png" />
				<img class="color-yellow automaOutpostChoice outpostColor" src="img/outposts/yellow.png" />
				<img class="color-grey automaOutpostChoice outpostColor" src="img/outposts/grey.png" />
				<div class="clearDiv"></div>
			</div>
			<div class="shadowEmpireColor chooseColorContainer">
				<p>Shadow Empire</p>
				<img class="color-blue shadowEmpireOutpostChoice outpostColor" src="img/outposts/blue.png" />
				<img class="color-red shadowEmpireOutpostChoice outpostColor" src="img/outposts/red.png" />
				<img class="color-green shadowEmpireOutpostChoice outpostColor" src="img/outposts/green.png" />
				<img class="color-yellow shadowEmpireOutpostChoice outpostColor" src="img/outposts/yellow.png" />
				<img class="color-grey shadowEmpireOutpostChoice outpostColor" src="img/outposts/grey.png" />
				<div class="clearDiv"></div>
			</div>
			<div class="clearDiv"></div>
			<div class="buttons">
				<a href="#" class="btn redBtn func-showLayer-fullAutomaChooseCivs">Back</a>
				<a href="#" class="btn greenBtn func-checkAIColors">Next</a>
			</div>
		</div>
	`;

	$(humanAndAIColorsHTML).appendTo('#container');

	var AICivChoiceHTML = `
		<div id="fullAutomaConfigTrackChoiceLayer" class="layer extraSetupScreen">
			<h2 class="roundGameGoalsTitle">Automa Civs & Favorite Tracks</h2>
			<div id="automaCivChoiceContainer">
				<p>Automa Civ:</p>
				<select id="automaCivSelectID" name="automaCivList" class="automaCivList"></select>
				<div class="clearDiv"></div>
			</div>
			<div id="automaCiv"></div>

			<!--div id="automaTrackChoiceContainer">
				<div class="labelAndSelectContainer">
					<select id="automaFavTrackSelectID" name="automaFavTrackList" class="automaFavTrackList">
					</select>
					<img class="heartIcon" src="img/automaFavTrack-blank.png" />
					<p>Automa</p>
					<div class="clearDiv"></div>
				</div>
				<div class="favTrackIcons"></div>
				<div class="clearDiv"></div>
			</div>
			<div id="shadowEmpireTrackChoiceContainer">
				<div class="labelAndSelectContainer">
					<select id="shadowEmpireFavTrackSelectID" name="shadowEmpireFavTrackList" class="shadowEmpireFavTrackList">
					</select>
					<img class="heartIcon" src="img/shadowEmpireFavTrack-blank.png" />
					<p>Shadow Empire</p>
					<div class="clearDiv"></div>
				</div>
				<div class="favTrackIcons"></div>
				<div class="clearDiv"></div>
			</div>
			<div class="clearDiv"></div-->

			<div id="automaAndShadowEmpireTrackChoiceAndRandomTrackContainer">
				<div id="automaAndShadowEmpireTrackChoiceContainer">
					<div id="automaTrackChoiceContainer">
						<div class="labelAndSelectContainer">
							<select id="automaFavTrackSelectID" name="automaFavTrackList" class="automaFavTrackList"></select>
							<img class="heartIcon" src="img/automaFavTrack-blank.png">
							<p>Automa</p>
							<div class="clearDiv"></div>
						</div>
						<div class="clearDiv"></div>
					</div>
					<div id="shadowEmpireTrackChoiceContainer">
							<div class="labelAndSelectContainer">
							<select id="shadowEmpireFavTrackSelectID" name="shadowEmpireFavTrackList" class="shadowEmpireFavTrackList"></select>
							<img class="heartIcon" src="img/shadowEmpireFavTrack-blank.png">
							<p>Shadow Empire</p>
							<div class="clearDiv"></div>
						</div>
					</div>
					<div class="clearDiv"></div>
				</div>
				<div id="randomTrackChoiceContainer">
					<p id="automaFavTrackArrow" class="randomFavTrackArrow">&#10553;</p>
					<p id="shadowEmpireFavTrackArrow" class="randomFavTrackArrow">&#10552;</p>
					<p validbots="both" id="randomizeFavTrackText">Randomize</p>
				</div>
				<div class="clearDiv"></div>
			</div>

			<div class="buttons">
				<a href="#" class="btn redBtn func-showLayer-fullAutomaConfigColorChoice">Back</a>
				<a id="rollFavTracksButton" href="#" class="btn blueBtn func-randomizeAutomaData">Random Civ</a>
				<a href="#" class="btn greenBtn func-showLayer-fullAutomaSetupInstructions">Next</a>
			</div>
		</div>
	`;

	$(AICivChoiceHTML).appendTo('#container');
	
	var fullAutomaSetupInstructions = `
		<div id="fullAutomaSetupInstructionsLayer" class="layer extraSetupScreen">
			<h2 class="roundGameGoalsTitle">Automa Setup</h2>
			<p>Set up as you would for a 3-player game except that you always start on the territory hex labeled <span class="bold underline">2/4</span> no matter which capital city mat you're using.</p>
			<ol>
				<li>Give the Automa all of the following components:</li>
				<ol>
					<li type="a">All <span class="bold automaColorReplace"></span> outposts. Place 2 of them on the territory hex labeled <span class="bold underline">3/5</span>.</li>
					<li type="a">All <span class="bold automaColorReplace"></span> player tokens: Place 1 on 0 VP and 1 on the starting space of each advancement track.</li>
				</ol>
				<li>Give the Shadow Empire the following components:</li>
				<ol>
					<li type="a">All <span class="bold shadowEmpireColorReplace"></span> outposts.</li>
					<li type="a">Five <span class="bold shadowEmpireColorReplace"></span> player tokens. Place 1 on the starting space of each advancement track. Set 1 aside.</li>
				</ol>
			</ol>
			<p class="italic bold">Due to not needing the Automa mat, designate somewhere to put any Tapestry cards and Landmarks that the bots accumulate.</p>
			<div class="buttons">
					<a href="#" class="btn redBtn func-showLayer-fullAutomaConfigTrackChoice">Back</a>
					<a id="cardStartButton" href="#" class="btn greenBtn func-showLayer-difficultyLevel">Next</a>
			</div>
		</div>
	`;

	$(fullAutomaSetupInstructions).appendTo('#container');

	var difficultySliderHTML = `
		<div slidermoved="false" id="difficultyLevelLayer" class="layer extraSetupScreen">
			<h2 class="roundGameGoalsTitle">Automa Difficulty</h2>
			<input type="range" min="0" max="5" value="0" class="slider" id="myRange">
			<div id="automaDifficultyContent" class="instructionOverlay"></div>
			<div id="difficultyInstructions">
				<img class="difficultyArrow" src="img/arrow.png">
				<p>Use the slider to select the Automas difficulty level.</p>
			</div>
			<div class="buttons">
					<a href="#" class="btn redBtn func-showLayer-fullAutomaSetupInstructions">Back</a>
					<a id="fullAutomaStartButton" href="#" class="btn greyBtn">Next</a>
			</div>
		</div>
	`;

	$(difficultySliderHTML).appendTo('#container');

	// let expansionSettingsHTML = `
	// 	<div id="expansionSettingsLayer" class="layer extraSetupScreen">
	// 		<h2 class="roundGameGoalsTitle">Expansion Settings</h2>
	// 		<div id="plansPloysCheckboxContainer" class="customCheckboxContainer">
	// 			<div class="customCheckbox">
	// 				<input type="checkbox" value="1" id="plansPloysCheckbox">
	// 				<label for="plansPloysCheckbox"></label>
	// 			</div>
	// 			<p>Plans & Ploys Expansion</p>
	// 			<div style="clear:both;"></div>
	// 		</div>

	// 		<div id="artsArchitectureCheckboxContainer" class="customCheckboxContainer">
	// 			<div class="customCheckbox">
	// 				<input type="checkbox" value="1" id="artsArchitectureCheckbox">
	// 				<label for="artsArchitectureCheckbox"></label>
	// 			</div>
	// 			<p>Arts & Architecture Expansion</p>
	// 			<div style="clear:both;"></div>
	// 		</div>
	// 	</div>
	// `;

	// $(expansionSettingsHTML).appendTo('#container');

	let expansionCheckboxHTML = `
		<div id="expansionsCheckboxContainer">
			<div id="plansPloysCheckboxContainer" class="customCheckboxContainer">
				<div class="customCheckbox">
					<input type="checkbox" value="1" id="plansPloysCheckbox">
					<label for="plansPloysCheckbox"></label>
				</div>
				<p>Plans & Ploys Expansion</p>
				<div style="clear:both;"></div>
			</div>

			<div id="artsArchitectureCheckboxContainer" class="customCheckboxContainer">
				<div class="customCheckbox">
					<input type="checkbox" value="1" id="artsArchitectureCheckbox">
					<label for="artsArchitectureCheckbox"></label>
				</div>
				<p>Arts & Architecture Expansion</p>
				<div style="clear:both;"></div>
			</div>
			<div style="clear:both;"></div>
		</div>
	`;

	$(expansionCheckboxHTML).insertBefore('#startLayer .buttons');
	
	let quickStartContainerHTML = `
		<div id="quickStartLayer" class="layer">
			<h2 class="factionSelectionCategory">Automa Quick Start</h2>
			<div id="quickStartOptions">
			<div class="quickStartOption">
				<p class="quickstartHumanPlayerDetails">Human Civs: <span id="quickStartHumanCivs" class="bold"></span></p>
				<div class="clearDiv"></div>
			</div>
			<div class="quickStartOption">
				<p class="quickstartHumanPlayerDetails">Capital City Mats: <span id="quickStartCityMat" class="bold"></span></p>
				<div class="clearDiv"></div>
			</div>
			<div class="quickStartOption">
				<p class="quickStartLabel">Human Color:</p>
				<select id="quickStartHumanColorSelectID" name="humanColorList" class="quickstartSelectOption">
				</select>
				<div class="clearDiv"></div>
			</div>

			<div class="quickStartOption">
				<p class="quickStartLabel">Automa Color:</p>
				<select id="quickStartAutomaColorSelectID" name="automaColorList" class="quickstartSelectOption">
				</select>
				<div class="clearDiv"></div>
			</div>

			<div class="quickStartOption">
				<p class="quickStartLabel">SE Color:</p>
				<select id="quickStartShadowEmpireColorSelectID" name="shadowEmpireColorList" class="quickstartSelectOption">
				</select>
				<div class="clearDiv"></div>
			</div>

			<div class="quickStartOption">
				<p class="quickStartLabel">Automa Civ:</p>
				<select id="quickStartAutomaCivSelectID" name="quickStartAutomaFavTrackList" class="quickstartSelectOption">
				</select>
				<div class="clearDiv"></div>
			</div>

			<div class="quickStartOption">
				<p class="quickStartLabel">Automa Fav Track:</p>
				<select id="quickStartAutomaFavTrackSelectID" name="quickStartAutomaFavTrackList" class="quickstartSelectOption">
				</select>
				<div class="clearDiv"></div>
			</div>

			<div class="quickStartOption">
				<p class="quickStartLabel">SE Fav Track:</p>
				<select id="quickStartShadowEmpireFavTrackSelectID" name="shadowEmpireFavTrackList" class="quickstartSelectOption">
				</select>
				<div class="clearDiv"></div>
			</div>

			<div class="quickStartOption">
				<p class="quickStartLabel">Automa Difficulty:</p>
				<select id="quickStartAutomaDifficultySelectID" name="automaDifficultyList" class="quickstartSelectOption">
					<option value="0" selected>Level 1</option>
					<option value="1">Level 2</option>
					<option value="2">Level 3</option>
					<option value="3">Level 4</option>
					<option value="4">Level 5</option>
					<option value="5">Level 6</option>
				</select>
				<div class="clearDiv"></div>
			</div>
			<div class="quickStartOption automaSecondCiv">
				<p class="quickStartLabel">Automas Second Civ:</p>
				<select id="quickStartAutomaSecondCivSelectID" name="automaSecondCivList" class="quickstartSelectOption">
				</select>
				<div class="clearDiv"></div>
			</div>
		</div>
		<div class="buttons">
			<a href="#" class="btn redBtn func-showLayer-start">Back</a>
			<a id="quickStartRandomTracks" href="#" class="btn blueBtn func-randomizeHumanCivChoices func-randomizeAutomaData">Random</a>
			<a id="quickStartButton" href="#" class="btn greenBtn func-quickStartUpdate func-showLayer-game func-gameButtons func-updateGame func-fullAutomaAutomatedSystem func-initActionArea func-automaIncome1Setup">Start</a>
		</div>
	 `;

	$(quickStartContainerHTML).appendTo('#container');

	initColorOptions();

	if(localStorage.getItem('tp-expansions') !== null && localStorage.getItem('tp-expansions') !== '') {
		if(DEBUG_GAME) console.log(`$localStorage.getItem('tp-expansions') !== null && localStorage.getItem('tp-expansions') !== '' condition met`);
		game.expansions = JSON.parse(localStorage.getItem('tp-expansions'));
		if(game.expansions.includes('plansPloys')) $('#plansPloysCheckbox').prop('checked', true);
		if(game.expansions.includes('artsArchitecture')) {
			aaExp = true;
			$('#artsArchitectureCheckbox').prop('checked', true);
		} else {
			aaExp = false;
		}

		artsExpansionConfig(aaExp, true);
	}

	initAutomaCivOptions();
	initFavTrackOptions();
	checkSavedDifficultyLevel();
	randomizeHumanCivChoices();
	updateAvailableAutomaCivs();
}

function initColorOptions() {
	let colorOptionsHTML =  '';
	for (let i = 0; i < game.playerColors.length; i++) {
		colorOptionsHTML += `<option value="${game.playerColors[i]}">${capitalizeFirstLetter(game.playerColors[i])}</option>`;
	}
	$('#quickStartHumanColorSelectID').html(colorOptionsHTML);
	$('#quickStartAutomaColorSelectID').html(colorOptionsHTML);
	$('#quickStartShadowEmpireColorSelectID').html(colorOptionsHTML);
}

function initAutomaCivOptions() {
	updateAvailableAutomaCivs();
}

function initFavTrackOptions() {
	let favTrackOptionsHTML =  '';
	for (let i = 0; i < game.tracks.length; i++) {
		favTrackOptionsHTML += `<option value="${game.tracks[i]}">${capitalizeFirstLetter(game.tracks[i])}</option>`;
	}
	$(`#automaFavTrackSelectID`).html(favTrackOptionsHTML);
	$(`#quickStartAutomaFavTrackSelectID`).html(favTrackOptionsHTML);
	$(`#shadowEmpireFavTrackSelectID`).html(favTrackOptionsHTML);
	$(`#quickStartShadowEmpireFavTrackSelectID`).html(favTrackOptionsHTML);
}


function loadData(mode, thisData) {

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`loadData() func triggered`);

	$(`#quickStartHumanColorSelectID option[value="${thisData.humanInfo.color}"]`).prop('selected', true);
	updateAvailableAutomaColors();

	if(mode == 'savedData') {
		game.humanInfo.color = thisData.humanInfo.color;
		game.automaInfo.color = thisData.automaInfo.color;
		game.shadowEmpireInfo.color = thisData.shadowEmpireInfo.color;
		game.shadowEmpireOnlyInfo.color = thisData.shadowEmpireOnlyInfo.color;
	}

	showDefaultColorSelections();

	if(!thisData.automaInfo.favTrack) {
		randomizeAutomaData();
	} else {
		game.automaInfo.firstCivSpecs = JSON.parse(JSON.stringify(thisData.automaInfo.firstCivSpecs));
		game.automaInfo.secondCivSpecs = JSON.parse(JSON.stringify(thisData.automaInfo.secondCivSpecs));
		game.automaInfo.favTrack = thisData.automaInfo.favTrack;
		game.automaInfo.originalFavTrack = thisData.automaInfo.originalFavTrack;
		game.shadowEmpireInfo.favTrack = thisData.shadowEmpireInfo.favTrack;
		game.shadowEmpireInfo.originalFavTrack = thisData.shadowEmpireInfo.originalFavTrack;
		updateAICivAndFavTracksInfo();
		updateAutomaAvailableSecondCivOptions();
		finalizeChosenAutomaFavTrack('all', game.automaInfo.favTrack);
		finalizeChosenShadowEmpireFavTrack('all', game.shadowEmpireInfo.favTrack);
		chooseRandomShadowEmpireOnlyFavTrack();
	}

}

function quickStartUpdate() {

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`quickStartUpdate() func triggered`);

	game.humanInfo.color = $('#quickStartHumanColorSelectID').val();
	game.automaInfo.color = $('#quickStartAutomaColorSelectID').val();
	game.shadowEmpireInfo.color = $('#quickStartShadowEmpireColorSelectID').val();
	game.automaInfo.firstCivSpecs = JSON.parse(JSON.stringify(civAbilities[$('#quickStartAutomaCivSelectID').val()]));
	game.automaInfo.favTrack = $('#quickStartAutomaFavTrackSelectID').val();
	game.automaInfo.originalFavTrack = $('#quickStartAutomaFavTrackSelectID').val();
	game.shadowEmpireInfo.favTrack = $('#quickStartShadowEmpireFavTrackSelectID').val();
	game.shadowEmpireInfo.originalFavTrack = $('#quickStartShadowEmpireFavTrackSelectID').val();
	game.difficultyLevelNum = $('#quickStartAutomaDifficultySelectID').val();

	if(game.difficultyLevelNum == '5') {
		game.automaInfo.secondCivSpecs = JSON.parse(JSON.stringify(civAbilities[$('#quickStartAutomaSecondCivSelectID').val()]));
	}

	if(DEBUG_GAME) {
		console.log(`game`);
		console.log(game);
	}

	updateGame();
}

$(document).on(touchEvent, '.cardCombination', function() {

    if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
    if(DEBUG_GAME) console.log(`.cardCombination touchevent triggered`);

    var cardCombination = $(this).attr('cards').split('-');

    if(DEBUG_GAME) console.log(`cardCombination[0] => '${cardCombination[0]}'`);
    if(DEBUG_GAME) console.log(`cardCombination[1] => '${cardCombination[1]}'`);

    showCurrentAutomaCardsMoveHistory(cardCombination[0], cardCombination[1]);
})

function trackIndex(thisTrack){
	return game.tracks.indexOf(thisTrack);
}


function artsExpansionConfig(mode, onload) {
	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`artsExpansionConfig() func triggered`);
	if(DEBUG_GAME) console.log(`mode = "${mode}"`);

	if(mode) {
		if(DEBUG_GAME) console.log(`mode condition met`);
		game.tracks.push('arts');
		game.automaLevel6Tracks.push('arts');
		game.humanInfo.trackPos.push(0);
		game.humanInfo.toEndTrack.push(12);
		game.automaInfo.trackPos.push(0);
		game.automaInfo.toEndTrack.push(12);
		game.shadowEmpireInfo.trackPos.push(0);
		game.shadowEmpireInfo.toEndTrack.push(12);
		game.shadowEmpireOnlyInfo.trackPos.push(0);
		game.shadowEmpireOnlyInfo.toEndTrack.push(12);

		for (const cardNum in artsTiebreakers) {
			if(DEBUG_GAME) console.log(`artsTiebreakers[${cardNum}] = "${artsTiebreakers[cardNum]}"`);

			let cardIndex = parseInt(cardNum) - 1;
			let artsPos = artsTiebreakers[cardNum];
			cards[cardIndex].cardImg = `${cardNum}-aa`;
			if(artsPos == 'top') {
				cards[cardIndex].trackTiebreakers.unshift('arts');
				cards[cardIndex].shadowEmpireTiebreakers.push('arts');
			} else if(artsPos == 'bottom') {
				cards[cardIndex].trackTiebreakers.push('arts');
				cards[cardIndex].shadowEmpireTiebreakers.unshift('arts');
			}
		}

		if($('#automaFavTrackSelectID option[value="arts"]').length == 0) $('#automaFavTrackSelectID').append(`<option value="arts">Arts</option>`);
		if($('#quickStartAutomaFavTrackSelectID option[value="arts"]').length == 0) $('#quickStartAutomaFavTrackSelectID').append(`<option value="arts">Arts</option>`);
		if($('#shadowEmpireOnlyFavTrackSelectID option[value="arts"]').length == 0) $('#shadowEmpireOnlyFavTrackSelectID').append(`<option value="arts">Arts</option>`);
		if($('#mobileLandmarkSelector .landmarkIconContainer.landmarkCategory-arts').length == 0) $('#mobileLandmarkSelector').append(`<div class="landmarkIconContainer inactiveLandmarkIcon landmarkCategory-arts"></div>`);
		if($('#mobileLandmarkSelector .landmarkIconContainer.landmarkCategory-arts').length == 0) $('#mobileLandmarkSelector').append(`<div class="landmarkIconContainer inactiveLandmarkIcon landmarkCategory-arts"></div>`);
		if($('#humanAdvancedCityMatText').length == 0) $('#humanCityMatText').after(`<p id="humanAdvancedCityMatText"></p>`);
		if($('#difficultyLevelLayer').attr('slidermoved') == 'true') updateDifficultyLevel(game.difficultyLevelNum, 'slider');

	} else if(!mode && !onload) {

		if(DEBUG_GAME) console.log(`!mode && !onload condition met`);
		game.tracks.pop();
		game.automaLevel6Tracks.pop();
		game.humanInfo.trackPos.pop();
		game.humanInfo.toEndTrack.pop();
		game.automaInfo.trackPos.pop();
		game.automaInfo.toEndTrack.pop();
		game.shadowEmpireInfo.trackPos.pop();
		game.shadowEmpireInfo.toEndTrack.pop();
		game.shadowEmpireOnlyInfo.trackPos.pop();
		game.shadowEmpireOnlyInfo.toEndTrack.pop();

		for (const cardNum in artsTiebreakers) {
			if(DEBUG_GAME) console.log(`artsTiebreakers[${cardNum}] = "${artsTiebreakers[cardNum]}"`);
			let cardIndex = parseInt(cardNum) - 1;
			let artsPos = artsTiebreakers[cardNum];
			cards[cardIndex].cardImg = `${cardNum}`;
			if(artsPos == 'top') {
				cards[cardIndex].trackTiebreakers.shift();
				cards[cardIndex].shadowEmpireTiebreakers.pop();
			} else if(artsPos == 'bottom') {
				cards[cardIndex].trackTiebreakers.pop();
				cards[cardIndex].shadowEmpireTiebreakers.shift();
			}
		}

		if($('#automaFavTrackSelectID option[value="arts"]').length != 0) $('#automaFavTrackSelectID option[value="arts"]').remove();
		if($('#quickStartAutomaFavTrackSelectID option[value="arts"]').length != 0) $('#quickStartAutomaFavTrackSelectID option[value="arts"]').remove();
		if($('#shadowEmpireOnlyFavTrackSelectID option[value="arts"]').length != 0) $('#shadowEmpireOnlyFavTrackSelectID option[value="arts"]').remove();
		if($('#mobileLandmarkSelector .landmarkIconContainer.landmarkCategory-arts').length != 0) $('#mobileLandmarkSelector .landmarkIconContainer.landmarkCategory-arts').remove();
		if($('#humanAdvancedCityMatText').length != 0) $('#humanAdvancedCityMatText').remove();
		if($('#difficultyLevelLayer').attr('slidermoved') == 'true') updateDifficultyLevel(game.difficultyLevelNum, 'slider');
	}


	if(DEBUG_GAME) console.log(`game = `, game);
}

function consoleLogGame() {
	console.log(game);
}
