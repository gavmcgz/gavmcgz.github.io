// TO ACTION - Generate popup to explain map is more of a tool, and might not be 100% correct

// TO ACTION - Change the first "Next" button to either "Explore" or "Conquer" to reflect what action the Automa is taking


// RUN BELOW CODE WHEN VIEWING MAP FOR DEBUG!!!!!!!!!!!!!
// $('#tileLayout .tileContainer').each(function(){
//     let thisID = $(this).attr('id').split('-');
//     $(this).append(`<p class="map-debug">${thisID[1]}</p>`);
// });

// $('.map-debug').css({
//    'position' : 'absolute',
//    'width' : '100%',
//    'font-size' : '38px',
//    'margin' : '11px 0px 0px 0px',
//    'color' : '#efff00',
//    'text-shadow' : '1px 1px black',
//    'z-index' : '2',
//    'font-weight' : 'bold'
// });


const DEBUG_MAP = false;
if(DEBUG_MAP) console.log(`DEBUG_MAP active`);

const DEBUG_TIE_BREAKER = true;
if(DEBUG_TIE_BREAKER) console.log(`DEBUG_TIE_BREAKER active`);

var thisMapMode = '';
var thisChosenHex = 0;
var recordOfValidHexes = [];
var lowestHexRouteDistance;
var closestHexes = [];
var furtherestExploreHexes = [];

$(document).ready(function(){

    if(DEBUG_MAP) console.log(`/-------------------------------------------/`);
	if(DEBUG_MAP) console.log(`$(document).ready func triggered`);

    var fullAutomaConfigColorChoice = `
        <div id="mapLayer" class="layer">

            <div class="normalMapHeadingInfo">
                <h2 class="mapLayerTitle">Map
                    <img class="helpLink helpLink-map" src="../../img/question.png">
                </h2>
                <div class="buttons" mapbtns="3"></div>
            </div>

            <div class="conquerorCivMapHeadingInfo">
                <div class="conquerorsMapTitleAndButtonSection">
                    <h2 class="mapLayerTitle">Map
                        <img class="helpLink helpLink-map" src="../../img/question.png">
                    </h2>
                    <a href="#" id="backToConquerorsIncomeScreenBtn" class="btn greenBtn func-conquerorsIncomeScreen-setup">Continue</a>
                    <div class="clearDiv"></div>
                </div>
                <p id="conquerorsCivSetupBlurb">For the Automa Conqueror Civ, their Civ Bonuses are dependant on the current map state. Make sure it's up-to-date and then click the <span class="bold">"Continue"</span> button.</p>
                <div class="clearDiv"></div>
            </div>

            <div id="exploreConquerSummary"></div>
            <div id="playerTileSelection">
                <p id="mapSelect-human" class="playerMapSelection activePlayerMap">Human</p>
                <p id="mapSelect-automa" class="playerMapSelection">Automa</p>
                <p id="mapSelect-reset" class="playerMapSelection">Neutral</p>
                <div class="clearDiv"></div>
            </div>
            <div id="tileLayout"></div>
        </div>
    `;

    $(fullAutomaConfigColorChoice).appendTo('#container');
    buildMap('setup');
    // Generate full map based on stored info
})

function showMapScreen(mode) {
    if(DEBUG_MAP) console.log(`/-------------------------------------------/`);
    if(DEBUG_MAP) console.log(`showMapScreen() func triggered`);
    if(DEBUG_MAP) console.log(`mode => '${mode}'`);
    thisMapMode = mode;
    $('#nextMapStepBtn').removeClass('func-choseAutomaHex-explore func-choseAutomaHex-conquer func-choseAutomaHex-conquerAnywhere func-choseAutomaHex-placeToppledSE').addClass(`func-choseAutomaHex-${mode}`);
    // Add class to button for code to determine how to handle the map action
    buildMap();
    // Generate full map based on stored info
}

function showMapInfoForConquerorsCiv() {
    if(DEBUG_MAP) console.log(`/-------------------------------------------/`);
    if(DEBUG_MAP) console.log(`showMapUpdateForConquerorsCiv() func triggered`);
    buildMap();
    showLayer('map');
    $('#mapLayer').addClass('conquerorsMapSetup');
}

function buildMap() {
    if(DEBUG_MAP) console.log(`/-------------------------------------------/`);
    if(DEBUG_MAP) console.log(`buildMap() func triggered`);

    if(DEBUG_MAP) console.log(`game.currentMode => '${game.currentMode}'`);
    if(DEBUG_MAP) console.log(`thisMapMode => '${thisMapMode}'`);

    let actionBtnName = '';

    if(thisMapMode == 'conquerAnywhere' || thisMapMode == 'conquer') {
        actionBtnName = 'Conquer';
    } else if(thisMapMode == 'explore') {
        actionBtnName = 'Explore';
    } else if(thisMapMode == 'placeToppledSE') {
        actionBtnName = 'Place SE Outpost';
        // automaHexesWithOneOutpostArray = calculateAutomasHexesWithOneOutpost();
    }

    let mapbtnsHTML = `
        <a href="#" class="btn redBtn func-showLayer-${game.currentMode}">Back</a>
        <a href="#" id="nextMapStepBtn" class="btn greenBtn func-choseAutomaHex-${thisMapMode}">${actionBtnName}</a>
        <a href="#" class="btn blueBtn func-showMapInstructions">Help</a>
    `;

    $('#mapLayer .buttons').html(mapbtnsHTML);
    $('#mapLayer #playerTileSelection').css('display', 'block');
    $('#mapLayer #exploreConquerSummary').css('display', 'none');
    $('#tileLayout').html('');

    $('#mapLayer .buttons').attr('mapbtns', '3');

    var mapTilesHTML = '';

    for (let i = 0; i < game.map.tiles.length; i++) {
        mapTilesHTML += `<div id="tile-${i}" class="tileContainer column${game.map.tiles[i].column} row${game.map.tiles[i].row}`;
        if(game.map.tiles[i].boardTile == 'true') mapTilesHTML += ' boardTile';
        if(game.map.tiles[i].startingTile == 'true') mapTilesHTML += ' startingTile';
        mapTilesHTML += '"></div>';
    }

    $('#tileLayout').html(mapTilesHTML);

    for (let i = 0; i < game.map.tiles.length; i++) {
        buildTile(i, 'setup')
    }
}

function nextMapStep() {

    if(DEBUG_MAP) console.log(`/-------------------------------------------/`);
    if(DEBUG_MAP) console.log(`nextMapStep() func triggered`);

    let nextMapBtns = `
        <a href="#" class="btn redBtn func-previousMapStep">Undo</a>
        <a href="#" class="btn greenBtn func-confirmMapChanges func-finalMapStep">Confirm</a>
    `;

    $('#mapLayer .buttons').html(nextMapBtns);
    $('#mapLayer #playerTileSelection').css('display', 'none');
    $('.tileContainer').addClass('lockedTile')
    $('#mapLayer .buttons').attr('mapbtns', '2');
}

function previousMapStep() {

    if(DEBUG_MAP) console.log(`/-------------------------------------------/`);
    if(DEBUG_MAP) console.log(`previousMapStep() func triggered`);
    if(DEBUG_MAP) console.log(`game.currentMode => '${game.currentMode}'`);
    if(DEBUG_MAP) console.log(`thisMapMode => '${thisMapMode}'`);

    let prevMapBtns = `
        <a href="#" class="btn redBtn func-showLayer-${game.currentMode}">Back</a>
        <a href="#" id="nextMapStepBtn" class="btn greenBtn func-choseAutomaHex-${thisMapMode}">Next</a>
        <a href="#" class="btn blueBtn func-showMapInstructions">Info</a>
    `;

    $('#mapLayer .buttons').html(prevMapBtns);
    $('#mapLayer #playerTileSelection').css('display', 'block');
    $('#mapLayer #exploreConquerSummary').html('');
    $('#mapLayer #exploreConquerSummary').css('display', 'none');
    $('.lockedTile').removeClass('lockedTile')
    $('.chosenHex').remove();
    $('#mapLayer .buttons').attr('mapbtns', '3');
    resetConfirmedHex();
}

function finalMapStep() {

    if(DEBUG_MAP) console.log(`/-------------------------------------------/`);
    if(DEBUG_MAP) console.log(`finalMapStep() func triggered`);
    if(DEBUG_MAP) console.log(`game.currentMode => '${game.currentMode}'`);

    if(game.currentMode == 'income' && $('.conquerorsConquerMode').length) {
        let finalMapBtns = `
        <a id="mapBackToIncomeBtn" href="#" class="btn greenBtn func-conquerorsIncomeScreen-checkAutomaSingleOutposts">Back to income</a>
    `;

    $('#mapLayer .buttons').html(finalMapBtns);
    $('.conquerorsConquerMode').removeClass('conquerorsConquerMode');
    
    } else if(game.currentMode == 'income' && $('.conquerorsToppledSEMode').length) {
        let finalMapBtns = `
        <a id="mapBackToIncomeBtn" href="#" class="btn greenBtn func-showLayer-income func-nextIncomeStep">Back to income</a>
    `;

    $('#mapLayer .buttons').html(finalMapBtns);
    $('.conquerorsToppledSEMode').removeClass('conquerorsToppledSEMode');
    
    } else {
        let finalMapBtns = `
            <a id="mapBackToGameBtn" href="#" class="btn greenBtn func-showLayer-${game.currentMode}">Back to game</a>
        `;

        $('#mapLayer .buttons').html(finalMapBtns);
    }

    
    $('#mapLayer .buttons').attr('mapbtns', '1');
}

function confirmMapChanges() {
    if(DEBUG_MAP) console.log(`/-------------------------------------------/`);
    if(DEBUG_MAP) console.log(`confirmMapChanges() func triggered`);
    if(DEBUG_MAP) console.log(`thisChosenHex => '${thisChosenHex}'`);

    if(thisChosenHex != 'NA') {
        if(DEBUG_MAP) console.log(`thisChosenHex != 'NA' condition met`);
        if(DEBUG_MAP) console.log(`thisMapMode == '${thisMapMode}'`);
        if(thisMapMode == 'explore' || thisMapMode == 'exploreAnywhere') {
            if(DEBUG_MAP) console.log(`thisMapMode == '${thisMapMode}' condition met`);
            game.map.tiles[thisChosenHex].explored = 'true';
        } else if (thisMapMode == 'conquer' || thisMapMode == 'conquerAnywhere') {
            if(DEBUG_MAP) console.log(`thisMapMode == '${thisMapMode}' condition met`);
            if(game.map.tiles[thisChosenHex].control == 'human') {
                if(DEBUG_MAP) console.log(`match detected! ('${game.map.tiles[thisChosenHex].control}')`);
                if(DEBUG_MAP) console.log(`game.map.tiles[thisChosenHex].control == 'human' condition met`);
                conquerHumanOutcome();
                return;
            } else if(game.map.tiles[thisChosenHex].control == 'neutral') {
                if(DEBUG_MAP) console.log(`game.map.tiles[thisChosenHex].control == 'neutral' condition met`);
                game.map.tiles[thisChosenHex].control = 'automa';

                if(game.map.tiles[thisChosenHex].explored == 'false') {
                    if(DEBUG_MAP) console.log(`game.map.tiles[thisChosenHex].explored == 'false' condition met`);
                    game.map.tiles[thisChosenHex].explored = 'true';
                }

                if(game.firstCardInfo.topple == 'true' && thisChosenHex != 16) {
                    if(DEBUG_MAP) console.log(`game.firstCardInfo.topple == 'true' && thisChosenHex != 16 condition met`);
                    game.map.tiles[thisChosenHex].twoOutposts = 'true';
                } else {
                    if(DEBUG_MAP) console.log(`game.firstCardInfo.topple != 'true' || thisChosenHex == 16 condition met`);
                    game.map.tiles[thisChosenHex].twoOutposts = 'false';
                }

                if(thisChosenHex == 16) {
                    if(game.achievements.conquerMiddleIsland[0] != 'automa' && game.achievements.conquerMiddleIsland[1] != 'automa') {
                        setTimeout(function(){
                            console.log('init assessConquerMiddleIslandAchievementPopup');
                            assessConquerMiddleIslandAchievementPopup();
                        }, 50);
                    }
                } else {
                    console.log('init checkForTwoToppledHumanOutposts');
                    checkForTwoToppledHumanOutposts();
                }

            }

        } else if(thisMapMode == 'placeToppledSE') {
            game.map.tiles[thisChosenHex].twoOutposts = 'true';
        }
        if(DEBUG_MAP) console.log(`thisChosenHex => '${thisChosenHex}'`);
        buildTile(thisChosenHex, 'confirmTile');
    }
    updateGame();
}

function conquerHumanOutcome() {
    var conquerHumanOutcomeHTML = `
        <div class="confirmationBox alertEl conquerHumanOutcomeBox">
            <p>Is the Automa successful in conquering your outpost?</p>
            <div class="buttons" btns="2">
                <a href="#" class="btn redBtn func-confirmConquerChanges-fail">No</a>
                <a href="#" class="btn greenBtn func-confirmConquerChanges-success">Yes</a>
            </div>
        </div>
    `;

	$(conquerHumanOutcomeHTML).appendTo('body');
	$('.confirmationBox.conquerHumanOutcomeBox').fadeIn();
    $('#resetOverlay').fadeIn();
    $('#resetOverlay').addClass('keepOpen');

    deactivateMenu();
}

function confirmConquerChanges(outcome) {
    if(DEBUG_MAP) console.log(`/-------------------------------------------/`);
    if(DEBUG_MAP) console.log(`confirmConquerChanges() func triggered`);
    if(DEBUG_MAP) console.log(`outcome => '${outcome}'`);

    if(outcome == 'success') {
        if(DEBUG_MAP) console.log(`outcome == 'success' condition met`);
        game.map.tiles[thisChosenHex].control = 'automa';
        game.map.tiles[thisChosenHex].twoOutposts = 'true';
        game.map.tiles[thisChosenHex].automaConquersHuman = 'true';
        $('#exploreConquerSummary').html('<p>The Automa places its outpost on the hex and topples your outpost.</p>');

        if(thisChosenHex == 16) {
            if(game.achievements.conquerMiddleIsland[0] != 'automa' && game.achievements.conquerMiddleIsland[1] != 'automa') {
                setTimeout(function(){
                    console.log('init assessConquerMiddleIslandAchievementPopup');
                    assessConquerMiddleIslandAchievementPopup();
                }, 50);
            }
        } else {
            checkForTwoToppledHumanOutposts();
        }

    } else if (outcome == 'fail') {
        if(DEBUG_MAP) console.log(`outcome == 'fail' condition met`);
        game.map.tiles[thisChosenHex].control = 'human';
        game.map.tiles[thisChosenHex].twoOutposts = 'true';
        $('#exploreConquerSummary').html('<p>The Automa places a toppled outpost on the hex.</p>');
    }

    if(DEBUG_MAP) console.log(`thisChosenHex => '${thisChosenHex}'`);
    
    buildTile(thisChosenHex, 'confirmTile')
    updateGame();
}

function resetMap() {
    if(DEBUG_MAP) console.log(`/-------------------------------------------/`);
    if(DEBUG_MAP) console.log(`resetMap() func triggered`);

    if(DEBUG_MAP) console.log(`game.currentMode => '${game.currentMode}'`);
    if(DEBUG_MAP) console.log(`thisMapMode => '${thisMapMode}'`);

    let resetMapBtns = `
        <a href="#" class="btn redBtn func-showLayer-${game.currentMode}">Back</a>
        <a href="#" id="nextMapStepBtn" class="btn greenBtn func-choseAutomaHex-${thisMapMode}">Next</a>
        <a href="#" class="btn blueBtn func-showMapInstructions">Info</a>
    `;

    $('#mapLayer .buttons').html('');
    $('#mapLayer #playerTileSelection').css('display', 'block');

    $('#mapLayer #exploreConquerSummary').html('');
    $('#mapLayer #exploreConquerSummary').css('display', 'none');
    
    $('.lockedTile').removeClass('lockedTile')
    $('.chosenHex').remove();
    $('#mapLayer .buttons').attr('mapbtns', '3');
    resetConfirmedHex();
}

function resetConfirmedHex() {
    if(DEBUG_MAP) console.log(`/-------------------------------------------/`);
    if(DEBUG_MAP) console.log(`resetConfirmedHex() func triggered`);
    thisChosenHex = 0;
}

$(document).on(touchEvent, '.tileContainer:not(.startingTile):not(.lockedTile) .mapHex', function() {
    if(DEBUG_MAP) console.log(`.mapHex touchevent triggered`);
    var targID = $(this).parent().attr('id').split('-');
    var mapID = targID[1];
    if(DEBUG_MAP) console.log(`mapID => '${mapID}'`);
    tileSelect(mapID);
})

$(document).on(touchEvent, '.tileContainer:not(.startingTile):not(.lockedTile) .colorOverlay', function() {
    if(DEBUG_MAP) console.log(`.colorOverlay touchevent triggered`);
    var targID = $(this).parent().attr('id').split('-');
    var mapID = targID[1];
    if(DEBUG_MAP) console.log(`mapID => '${mapID}'`);
    tileSelect(mapID);
})

$(document).on(touchEvent, '.tileContainer:not(.startingTile):not(.lockedTile) .mapOutpost', function() {
    if(DEBUG_MAP) console.log(`.mapOutpost touchevent triggered`);
    var targID = $(this).parent().attr('id').split('-');
    var mapID = targID[1];
    if(DEBUG_MAP) console.log(`mapID => '${mapID}'`);
    tileSelect(mapID);
})

$(document).on(touchEvent, '.playerMapSelection', function() {
    if(DEBUG_MAP) console.log(`.playerMapSelection touchevent triggered`);
    $('.activePlayerMap').removeClass('activePlayerMap');
    $(this).addClass('activePlayerMap');
})

function tileSelect(tileNum) {

    if(DEBUG_MAP) console.log(`/-------------------------------------------/`);
    if(DEBUG_MAP) console.log(`tileSelect() func triggered`);
    if(DEBUG_MAP) console.log(`tileNum => '${tileNum}'`);

    var chosenPlayer = $('#mapLayer #playerTileSelection .playerMapSelection.activePlayerMap').attr('id').split('-');
    var thisPlayer = chosenPlayer[1];

    if(DEBUG_MAP) console.log(`thisPlayer => '${thisPlayer}'`);

    if(DEBUG_MAP) console.log(`game.map.tiles[tileNum]:`);
    if(DEBUG_MAP) console.log(game.map.tiles[tileNum]);

    if(thisPlayer == 'reset') {
        if(DEBUG_MAP) console.log(`thisPlayer == 'reset' condition met`);
        game.map.tiles[tileNum].control = 'neutral';
        game.map.tiles[tileNum].twoOutposts = 'false';
        game.map.tiles[tileNum].automaConquersHuman = 'false';

        if(game.map.tiles[tileNum].boardTile == 'false') {
            if(DEBUG_MAP) console.log(`game.map.tiles[tileNum].boardTile == 'false' condition met`);
            game.map.tiles[tileNum].explored = 'false';
        } else {
            if(DEBUG_MAP) console.log(`game.map.tiles[tileNum].boardTile != 'false' condition met`);
            game.map.tiles[tileNum].explored = 'true';
        }
    } else {
        if(DEBUG_MAP) console.log(`thisPlayer != 'reset' condition met`);
        if(game.map.tiles[tileNum].startingTile == 'false') {
            if(DEBUG_MAP) console.log(`game.map.tiles[tileNum].startingTile == 'false' condition met`);
            if(game.map.tiles[tileNum].boardTile == 'false') {
                if(DEBUG_MAP) console.log(`game.map.tiles[tileNum].boardTile == 'false' condition met`);
                if(game.map.tiles[tileNum].explored == 'false') {
                    if(DEBUG_MAP) console.log(`game.map.tiles[tileNum].explored == 'false' condition met`);
                    game.map.tiles[tileNum].explored = 'true';
                } else if(game.map.tiles[tileNum].control == 'neutral') {
                    if(DEBUG_MAP) console.log(`game.map.tiles[tileNum].control == 'neutral' condition met`);
                    game.map.tiles[tileNum].control = thisPlayer;
                } else if(game.map.tiles[tileNum].control == thisPlayer) {
                    if(DEBUG_MAP) console.log(`game.map.tiles[tileNum].control == thisPlayer condition met`);
                    if(game.map.tiles[tileNum].twoOutposts == 'false') {
                        if(DEBUG_MAP) console.log(`game.map.tiles[tileNum].twoOutposts == 'false' condition met`);
                        game.map.tiles[tileNum].twoOutposts = 'true';
                    } else if(game.map.tiles[tileNum].twoOutposts == 'true' && game.map.tiles[tileNum].control == 'automa' && game.map.tiles[tileNum].automaConquersHuman == 'false') {
                        if(DEBUG_MAP) console.log(`game.map.tiles[tileNum].twoOutposts == 'true' && game.map.tiles[tileNum].control == 'automa' && game.map.tiles[tileNum].automaConquersHuman == 'false' condition met`);
                        game.map.tiles[tileNum].automaConquersHuman = 'true';
                    } else if(game.map.tiles[tileNum].twoOutposts == 'true') {
                        if(DEBUG_MAP) console.log(`game.map.tiles[tileNum].twoOutposts == 'true' condition met`);
                        game.map.tiles[tileNum].automaConquersHuman = 'false';
                        game.map.tiles[tileNum].control = 'neutral';
                        game.map.tiles[tileNum].twoOutposts = 'false';
                        game.map.tiles[tileNum].explored = 'false';
                    }
                } else {
                    if(DEBUG_MAP) console.log(`game.map.tiles[tileNum].explored != 'false' && game.map.tiles[tileNum].control != 'neutral' && game.map.tiles[tileNum].control != thisPlayer condition met (POTENTIALLY INACCURATE COMMENT`);
                    game.map.tiles[tileNum].control = 'neutral';
                    game.map.tiles[tileNum].twoOutposts = 'false';
                }
    
            } else {
                if(DEBUG_MAP) console.log(`game.map.tiles[tileNum].boardTile != 'false' condition met`);
                if(game.map.tiles[tileNum].control == 'neutral') {
                    if(DEBUG_MAP) console.log(`game.map.tiles[tileNum].control == 'neutral' condition met`);
                    game.map.tiles[tileNum].control = thisPlayer;
                } else if(game.map.tiles[tileNum].control == thisPlayer) {
                    if(DEBUG_MAP) console.log(`game.map.tiles[tileNum].control == thisPlayer condition met`);
                    if(game.map.tiles[tileNum].twoOutposts == 'false') {
                        if(DEBUG_MAP) console.log(`game.map.tiles[tileNum].twoOutposts == 'false' condition met`);
                        game.map.tiles[tileNum].twoOutposts = 'true';
                    } else if(game.map.tiles[tileNum].twoOutposts == 'true' && game.map.tiles[tileNum].control == 'automa' && game.map.tiles[tileNum].automaConquersHuman == 'false') {
                        if(DEBUG_MAP) console.log(`game.map.tiles[tileNum].twoOutposts == 'true' && game.map.tiles[tileNum].control == 'automa' && game.map.tiles[tileNum].automaConquersHuman == 'false' condition met`);
                        game.map.tiles[tileNum].automaConquersHuman = 'true';
                    } else if(game.map.tiles[tileNum].twoOutposts == 'true') {
                        if(DEBUG_MAP) console.log(`game.map.tiles[tileNum].twoOutposts == 'true' condition met`);
                        game.map.tiles[tileNum].automaConquersHuman = 'false';
                        game.map.tiles[tileNum].control = 'neutral';
                        game.map.tiles[tileNum].twoOutposts = 'false';
                        game.map.tiles[tileNum].explored = 'true';
                    }
                } else {
                    if(DEBUG_MAP) console.log(`game.map.tiles[tileNum].control != 'neutral' && game.map.tiles[tileNum].control != thisPlayer condition met`);
                    game.map.tiles[tileNum].control = 'neutral';
                    game.map.tiles[tileNum].twoOutposts = 'false';
                }
            }
    
        }
    }

    if(DEBUG_MAP) console.log(`tileNum => '${tileNum}'`);
    buildTile(tileNum, 'selection');

}

function lockInTile(thisHex) {

    if(DEBUG_MAP) console.log(`/-------------------------------------------/`);
    if(DEBUG_MAP) console.log(`lockInTile() func triggered`);
    if(DEBUG_MAP) console.log(`thisHex => '${thisHex}'`);

    if(DEBUG_MAP) console.log(`game.map.tiles[thisChosenHex]:`);
    if(DEBUG_MAP) console.log(game.map.tiles[thisChosenHex]);

    $(`#tile-${thisHex}`).prepend(`<img class="chosenHex" src="img/map/selectedHex.png" />`);
    thisChosenHex = thisHex;

    if(thisMapMode == 'explore' || thisMapMode == 'exploreAnywhere') {

        if(DEBUG_MAP) console.log(`thisMapMode == '${thisMapMode}' condition met`);
        $('#exploreConquerSummary').html(`<p>Draw a new exploration tile and place it with a random orientation on the chosen hex.</p>`);

    } else if (thisMapMode == 'conquer' || thisMapMode == 'conquerAnywhere') {

        if(DEBUG_MAP) console.log(`thisMapMode == '${thisMapMode}' condition met`);
        if(DEBUG_MAP) console.log(`game.map.tiles[thisChosenHex].control => '${game.map.tiles[thisChosenHex].control}'`);

        if(game.map.tiles[thisChosenHex].control == 'human') {
            if(DEBUG_MAP) console.log(`game.map.tiles[thisChosenHex].control == 'human' condition met`);
            $('#exploreConquerSummary').html(`<p>The Automa attempts to conquer the chosen humans hex.</p>`);
        } else if(game.map.tiles[thisChosenHex].control == 'neutral') {
            if(DEBUG_MAP) console.log(`game.map.tiles[thisChosenHex].control == 'neutral' condition met`);

            if(DEBUG_MAP) console.log(`game.map.tiles[thisChosenHex].explored => '${game.map.tiles[thisChosenHex].explored}'`);
            if(DEBUG_MAP) console.log(`game.map.tiles[thisChosenHex].boardTile => '${game.map.tiles[thisChosenHex].boardTile}'`);

            if(game.map.tiles[thisChosenHex].explored == 'false' && game.map.tiles[thisChosenHex].boardTile == 'false') {
                if(DEBUG_MAP) console.log(`game.map.tiles[thisChosenHex].explored == 'false' && game.map.tiles[thisChosenHex].boardTile == 'false' condition met`);

                if(DEBUG_MAP) console.log(`game.firstCardInfo.topple => '${game.firstCardInfo.topple}'`);
                if(DEBUG_MAP) console.log(`thisChosenHex => '${thisChosenHex}'`);

                if(game.firstCardInfo.topple == 'true' && thisChosenHex != 16) {
                    if(DEBUG_MAP) console.log(`game.firstCardInfo.topple == 'true' && thisChosenHex != 16 condition met`);
                    $('#exploreConquerSummary').html(`<p>Draw a new exploration tile and place it with a random orientation, as well as an Automa outpost and a toppled Shadow Empire outpost.</p>`);
                } else {
                    if(DEBUG_MAP) console.log(`game.firstCardInfo.topple != 'true' || thisChosenHex == 16 condition met`);
                    $('#exploreConquerSummary').html(`<p>Draw a new exploration tile and place it with a random orientation, as well as an Automa outpost.</p>`);
                }

            } else {

                if(DEBUG_MAP) console.log(`game.map.tiles[thisChosenHex].explored != 'false' || game.map.tiles[thisChosenHex].boardTile != 'false' condition met`);
                if(DEBUG_MAP) console.log(`game.firstCardInfo.topple => '${game.firstCardInfo.topple}'`);
                if(DEBUG_MAP) console.log(`thisChosenHex => '${thisChosenHex}'`);

                if(game.firstCardInfo.topple == 'true' && thisChosenHex != 16) {
                    $('#exploreConquerSummary').html(`<p>Place an Automa outpost and a toppled Shadow Empire outpost on the chosen hex.</p>`);
                } else {
                    $('#exploreConquerSummary').html(`<p>Place an Automa outpost on the chosen hex.</p>`);
                }

            }
        }
    } else if(thisMapMode == 'placeToppledSE') {
        $('#exploreConquerSummary').html(`<p>Place a toppled Shadow Empire outpost on the chosen hex.</p>`);
    }
    $('#exploreConquerSummary').css('display', 'block');
}

// CONQUER MIDDLE ISLAND ACHIEVEMENT

function assessConquerMiddleIslandAchievementPopup() {

    if(DEBUG_MAP) console.log(`/-------------------------------------------/`);
	if(DEBUG_MAP) console.log(`assessConquerMiddleIslandAchievementPopup() func triggered`);

    var conquerHumanOutcomeHTML = `
        <div class="confirmationBox alertEl assessConquerMiddleIslandAchievementBox">
            <p>Does the Automa qualify for the<br /><span class="bold">"Conquer Middle Island"</span> achievement?</p>
            <div class="buttons" btns="3">
            <a href="#" class="btn greenBtn func-conquerMiddleIslandAchievementPopup-first keepOpen">1st Pos</a>
            <a href="#" class="btn orangeBtn func-conquerMiddleIslandAchievementPopup-second keepOpen">2nd Pos</a>
                <a href="#" class="btn redBtn func-checkForTwoToppledHumanOutposts">Cancel</a>
            </div>
        </div>
    `;

	$(conquerHumanOutcomeHTML).appendTo('body');
	$('.confirmationBox.alertEl.assessConquerMiddleIslandAchievementBox').fadeIn();
    $('#resetOverlay').fadeIn();
    $('#resetOverlay').addClass('keepOpen');
    deactivateMenu();
}

function conquerMiddleIslandAchievementPopup(position) {

    if(DEBUG_MAP) console.log(`/-------------------------------------------/`);
	if(DEBUG_MAP) console.log(`conquerMiddleIslandAchievementPopup() func triggered`);

    if(DEBUG_MAP) console.log(`position = "${position}"`);

    $('.confirmationBox.alertEl.assessConquerMiddleIslandAchievementBox').fadeOut();
    var conquerMiddleIslandAIAchievementInfoHTML = '';
    if(position == 'first') {
        game.achievements.conquerMiddleIsland[0] = 'automa';
        game.incomePoints.total = game.incomePoints.total + 10;

        conquerMiddleIslandAIAchievementInfoHTML = `
            <div class="confirmationBox alertEl actionTypeAlertBox conquerMiddleIslandAIAchievementInfo">
                <p>Place one of the Automas player tokens on <span class="bold">1st place</span> for the <span class="bold">"Conquer Middle Island"</span> achievement & add <span class="bold underline">10 points</span> to its current score.</p>
                <p style="text-align:center;">Automas new score: <span class="bold underline">${game.incomePoints.total} VP</p>
                <div class="buttons" btns="1">
                    <a href="#" class="btn redBtn func-checkForTwoToppledHumanOutposts">Close</a>
                </div>
            </div>
        `;
    } else if(position == 'second') {
        game.achievements.conquerMiddleIsland[0] = 'human';
        game.achievements.conquerMiddleIsland[1] = 'automa';
        game.incomePoints.total = game.incomePoints.total + 5;

        conquerMiddleIslandAIAchievementInfoHTML = `
            <div class="confirmationBox alertEl actionTypeAlertBox conquerMiddleIslandAIAchievementInfo">
                <p>Place one of the Automas player tokens on <span class="bold">2nd place</span> for the <span class="bold">"Conquer Middle Island"</span> achievement & add <span class="bold underline">5 points</span> to its current score.</p>
                <p style="text-align:center;">Automas new score: <span class="bold underline">${game.incomePoints.total} VP</p>
                <div class="buttons" btns="1">
                    <a href="#" class="btn redBtn func-checkForTwoToppledHumanOutposts">Close</a>
                </div>
            </div>
        `;
    }

    setTimeout(function(){
        $(conquerMiddleIslandAIAchievementInfoHTML).appendTo('body');
        $('.confirmationBox.actionTypeAlertBox.conquerMiddleIslandAIAchievementInfo').fadeIn();
    }, 400);
}

// TOPPLE TWO OPPONENT OUTPOSTS ACHIEVEMENT

function checkForTwoToppledHumanOutposts() {

    if(DEBUG_MAP) console.log(`/-------------------------------------------/`);
	if(DEBUG_MAP) console.log(`checkForTwoToppledHumanOutposts() func triggered`);

    if(game.achievements.toppleTwoOutposts[0] != 'automa' && game.achievements.toppleTwoOutposts[1] != 'automa') {        
        var toppledOutposts = 0;
        for (let i = 0; i < game.map.tiles.length; i++) {            
            if(game.map.tiles[i].automaConquersHuman == 'true') toppledOutposts++;
            if(toppledOutposts == 2) {
                assessToppleTwoOpponentOutpostsAchievementPopup();
                break;
            }
        }
    }
}

function assessToppleTwoOpponentOutpostsAchievementPopup() {    

    if(DEBUG_MAP) console.log(`/-------------------------------------------/`);
	if(DEBUG_MAP) console.log(`assessToppleTwoOpponentOutpostsAchievementPopup() func triggered`);

    var conquerHumanOutcomeHTML = `
        <div class="confirmationBox alertEl assessToppleTwoOpponentOutpostsAchievementBox">
            <p>Does the Automa qualify for the<br /><span class="bold">"Topple Two Opponent Outposts"</span> achievement?</p>
            <p class="italic">Remember: Only your toppled outposts count for the Automa qualifying for this achievement, not the Shadow Empires.</p>
            <div class="buttons" btns="3">
                <a href="#" class="btn greenBtn func-toppleTwoOpponentOutpostsAchievementPopup-first keepOpen">1st Pos</a>
                <a href="#" class="btn orangeBtn func-toppleTwoOpponentOutpostsAchievementPopup-second keepOpen">2nd Pos</a>
                <a href="#" class="btn redBtn">Cancel</a>
            </div>
        </div>
    `;

    setTimeout(function(){
        $(conquerHumanOutcomeHTML).appendTo('body');
        $('.confirmationBox.alertEl.assessToppleTwoOpponentOutpostsAchievementBox').fadeIn();
        $('#resetOverlay').fadeIn();
        $('#resetOverlay').addClass('keepOpen');
        deactivateMenu();
    }, 300);
}

function toppleTwoOpponentOutpostsAchievementPopup(position) {    

    if(DEBUG_MAP) console.log(`/-------------------------------------------/`);
	if(DEBUG_MAP) console.log(`toppleTwoOpponentOutpostsAchievementPopup() func triggered`);

    $('.confirmationBox.alertEl.assessToppleTwoOpponentOutpostsAchievementBox').fadeOut();
    var toppleTwoOpponentOutpostsAIAchievementInfoHTML = '';
    if(position == 'first') {        
        game.achievements.toppleTwoOutposts[0] = 'automa';
        game.incomePoints.total = game.incomePoints.total + 10;

        toppleTwoOpponentOutpostsAIAchievementInfoHTML = `
            <div class="confirmationBox alertEl actionTypeAlertBox toppleTwoOpponentOutpostsAIAchievementInfo">
            <p>Place one of the Automas player tokens on <span class="bold">1st place</span> for the <span class="bold">"Topple Two Opponent Outposts"</span> achievement & add <span class="bold underline">10 points</span> to its current score.</p>
            <p style="text-align:center;margin: 30px 0px;">New score: <span class="bold underline">${game.incomePoints.total} VP</p>
                <div class="buttons" btns="1">
                    <a href="#" class="btn redBtn">Close</a>
                </div>
            </div>
        `;
    } else if(position == 'second') {        
        game.achievements.toppleTwoOutposts[0] = 'human';
        game.achievements.toppleTwoOutposts[1] = 'automa';
        game.incomePoints.total = game.incomePoints.total + 5;

        toppleTwoOpponentOutpostsAIAchievementInfoHTML = `
            <div class="confirmationBox alertEl actionTypeAlertBox toppleTwoOpponentOutpostsAIAchievementInfo">
                <p>Place one of the Automas player tokens on <span class="bold">2nd place</span> for the <span class="bold">"Topple Two Opponent Outposts"</span> achievement & add <span class="bold underline">5 points</span> to its current score.</p>
                <p style="text-align:center;margin: 30px 0px;">New score: <span class="bold underline">${game.incomePoints.total} VP</p>
                <div class="buttons" btns="1">
                    <a href="#" class="btn redBtn">Close</a>
                </div>
            </div>
        `;
    }

    setTimeout(function(){
        $(toppleTwoOpponentOutpostsAIAchievementInfoHTML).appendTo('body');
        $('.confirmationBox.actionTypeAlertBox.toppleTwoOpponentOutpostsAIAchievementInfo').fadeIn();
    }, 400);
    
}

function buildTile(thisTile, mode) {

    if(DEBUG_MAP) console.log(`/-------------------------------------------/`);
    if(DEBUG_MAP) console.log(`buildTile() func triggered`);

    if(DEBUG_MAP) console.log(`thisTile => '${thisTile}'`);
    if(DEBUG_MAP) console.log(`mode => '${mode}'`);

    $(`#tile-${thisTile}`).html();
    $(`#tile-${thisTile}`).removeAttr('outposts');

    var thisTileHTML = '';

    if(DEBUG_MAP) console.log(`game.map.tiles[thisTile].control => '${game.map.tiles[thisTile].control}'`);
    if(DEBUG_MAP) console.log(`game.automaInfo.color => '${game.automaInfo.color}'`);
    if(DEBUG_MAP) console.log(`game.humanInfo.color => '${game.humanInfo.color}'`);

    if(game.map.tiles[thisTile].control == 'automa') {
        if(DEBUG_MAP) console.log(`game.map.tiles[thisTile].control == 'automa' condition met`);
        thisTileHTML += `<img class="colorOverlay" src="img/map/${game.automaInfo.color}Overlay.png" />`;
    } else if(game.map.tiles[thisTile].control == 'human') {
        if(DEBUG_MAP) console.log(`game.map.tiles[thisTile].control == 'human' condition met`);
        thisTileHTML += `<img class="colorOverlay" src="img/map/${game.humanInfo.color}Overlay.png" />`;
    }

    thisTileHTML += `<img class="mapHex" src="img/map/${thisTile}`;

    if(DEBUG_MAP) console.log(`game.map.tiles[thisTile].boardTile => '${game.map.tiles[thisTile].boardTile}'`);
    if(DEBUG_MAP) console.log(`game.map.tiles[thisTile].explored => '${game.map.tiles[thisTile].explored}'`);

    if(game.map.tiles[thisTile].boardTile == 'true') {
        if(DEBUG_MAP) console.log(`game.map.tiles[thisTile].boardTile == 'true' condition met`);
        thisTileHTML += '-map';
    } else if(game.map.tiles[thisTile].explored == 'false') {
        if(DEBUG_MAP) console.log(`game.map.tiles[thisTile].explored == 'false' condition met`);
        thisTileHTML += 'a';
    } else if(game.map.tiles[thisTile].explored == 'true') {
        if(DEBUG_MAP) console.log(`game.map.tiles[thisTile].explored == 'true' condition met`);
        thisTileHTML += 'b';
    }

    thisTileHTML += '.png" />';

    if(DEBUG_MAP) console.log(`game.map.tiles[thisTile].startingTile => '${game.map.tiles[thisTile].startingTile}'`);
    
    if(game.map.tiles[thisTile].startingTile == 'true') {

        if(DEBUG_MAP) console.log(`game.map.tiles[thisTile].control => '${game.map.tiles[thisTile].control}'`);

        if(DEBUG_MAP) console.log(`game.map.tiles[thisTile].startingTile == 'true' condition met`);
        if(game.map.tiles[thisTile].control == 'automa') {
            if(DEBUG_MAP) console.log(`game.map.tiles[thisTile].control == 'automa' condition met`);
            thisTileHTML += `<img class="mapOutpost cityOutpost1" src="img/outposts/${game.automaInfo.color}.png" />`;
            thisTileHTML += `<img class="mapOutpost cityOutpost2" src="img/outposts/${game.automaInfo.color}.png" />`;
        } else if(game.map.tiles[thisTile].control == 'human') {
            if(DEBUG_MAP) console.log(`game.map.tiles[thisTile].control == 'human' condition met`);
            thisTileHTML += `<img class="mapOutpost cityOutpost1" src="img/outposts/${game.humanInfo.color}.png" />`;
            thisTileHTML += `<img class="mapOutpost cityOutpost2" src="img/outposts/${game.humanInfo.color}.png" />`;
        }
        
    } else if(game.map.tiles[thisTile].control != 'neutral') {
        if(DEBUG_MAP) console.log(`game.map.tiles[thisTile].control != 'neutral' condition met`);

        if(DEBUG_MAP) console.log(`game.map.tiles[thisTile].control => '${game.map.tiles[thisTile].control}'`);

        if(game.map.tiles[thisTile].control == 'automa') {
            if(DEBUG_MAP) console.log(`game.map.tiles[thisTile].control == 'automa' condition met`);
            thisTileHTML += `<img class="mapOutpost territoryOutpost1" src="img/outposts/${game.automaInfo.color}.png" />`;

            if(DEBUG_MAP) console.log(`game.map.tiles[thisTile].automaConquersHuman => '${game.map.tiles[thisTile].automaConquersHuman}'`);
            if(DEBUG_MAP) console.log(`game.map.tiles[thisTile].twoOutposts => '${game.map.tiles[thisTile].twoOutposts}'`);

            if(game.map.tiles[thisTile].automaConquersHuman == 'true') {
                if(DEBUG_MAP) console.log(`game.map.tiles[thisTile].automaConquersHuman == 'true' condition met`);
                thisTileHTML += `<img class="mapOutpost territoryOutpost2" src="img/outposts/${game.humanInfo.color}.png" />`;
            } else if(game.map.tiles[thisTile].twoOutposts == 'true') {
                if(DEBUG_MAP) console.log(`game.map.tiles[thisTile].twoOutposts == 'true' condition met`);
                thisTileHTML += `<img class="mapOutpost territoryOutpost2" src="img/outposts/${game.shadowEmpireInfo.color}.png" />`;
            }
        } else if(game.map.tiles[thisTile].control == 'human') {
            if(DEBUG_MAP) console.log(`game.map.tiles[thisTile].control == 'human' condition met`);
            thisTileHTML += `<img class="mapOutpost territoryOutpost1" src="img/outposts/${game.humanInfo.color}.png" />`;
            if(game.map.tiles[thisTile].twoOutposts == 'true') {
                if(DEBUG_MAP) console.log(`game.map.tiles[thisTile].twoOutposts == 'true' condition met`);
                thisTileHTML += `<img class="mapOutpost territoryOutpost2" src="img/outposts/${game.automaInfo.color}.png" />`;
            }
        }
    }

    // thisTileHTML += '<p style="position: absolute; left: 30px; top: -26px; z-index: 99; color: #ff00e0; font-weight: bold; font-size: 24px!important; text-shadow: 1px 2px 2px #000;">${thisTile}</p>';

    if(DEBUG_MAP) console.log(`mode => '${mode}'`);

    if(mode == 'confirmTile') {
        if(DEBUG_MAP) console.log(`mode == 'confirmTile' condition met`);
        thisTileHTML += '<img class="chosenHex" src="img/map/selectedHex.png" />';
    }

    $(`#tile-${thisTile}`).html(thisTileHTML);

    if(DEBUG_MAP) console.log(`game.map.tiles[thisTile].startingTile => '${game.map.tiles[thisTile].startingTile}'`);
    if(DEBUG_MAP) console.log(`game.map.tiles[thisTile].control => '${game.map.tiles[thisTile].control}'`);
    if(DEBUG_MAP) console.log(`game.map.tiles[thisTile].twoOutposts => '${game.map.tiles[thisTile].twoOutposts}'`);

    if(game.map.tiles[thisTile].startingTile == 'true' || game.map.tiles[thisTile].control != 'neutral' && game.map.tiles[thisTile].twoOutposts == 'true') {
        if(DEBUG_MAP) console.log(`game.map.tiles[thisTile].startingTile == 'true' || game.map.tiles[thisTile].control != 'neutral' && game.map.tiles[thisTile].twoOutposts == 'true' condition met`);
        $(`#tile-${thisTile}`).attr('outposts', '2');
    } else if(game.map.tiles[thisTile].control != 'neutral' && game.map.tiles[thisTile].twoOutposts == 'false') {
        if(DEBUG_MAP) console.log(`game.map.tiles[thisTile].control != 'neutral' && game.map.tiles[thisTile].twoOutposts == 'false' condition met`);
        $(`#tile-${thisTile}`).attr('outposts', '1');
    }

}

function choseAutomaHex(thisMode) {

    if(DEBUG_MAP) console.log(`/-------------------------------------------/`);
    if(DEBUG_MAP) console.log(`choseAutomaHex() func triggered`);
    if(DEBUG_MAP) console.log(`thisMode => '${thisMode}'`);

    if(thisMode == 'explore') {

        if(DEBUG_MAP) console.log(`thisMode == 'explore' condition met`);

        var explorableHexes = [];
        var finalExplorableHexes = [];
        var finalExplorableHexesDistances = [];
        var humanHexes = [];
        var humanHexObj = {};
        for (let i = 0; i < game.map.tiles.length; i++) {
            if(DEBUG_MAP) console.log(`game.map.tiles[i].control => '${game.map.tiles[i].control}'`);
            if(game.map.tiles[i].control == 'automa') {
                if(DEBUG_MAP) console.log(`game.map.tiles[i].control == 'automa' condition met`);
                if(DEBUG_MAP) console.log(`match detected! ('${game.map.tiles[i].control}')`);
                for (let j = 0; j < game.map.tiles[i].neighbours[0].length; j++) {
                    explorableHexes.push(game.map.tiles[i].neighbours[0][j]);
                }
            }
        }

        var uniqueHexes = explorableHexes.filter(onlyUnique);

        if(DEBUG_MAP) console.log(`uniqueHexes:`);
        if(DEBUG_MAP) console.log(uniqueHexes);

        for (let k = 0; k < uniqueHexes.length; k++) {
            if(game.map.tiles[uniqueHexes[k]].control == 'neutral' && game.map.tiles[uniqueHexes[k]].boardTile == 'false' && game.map.tiles[uniqueHexes[k]].explored == 'false') {
                if(DEBUG_MAP) console.log(`game.map.tiles[uniqueHexes[k]].control == 'neutral' && game.map.tiles[uniqueHexes[k]].boardTile == 'false' && game.map.tiles[uniqueHexes[k]].explored == 'false' condition met`);
                if(DEBUG_MAP) console.log(`uniqueHexes[k] => '${uniqueHexes[k]}'`);
                finalExplorableHexes.push(uniqueHexes[k])
            }
        }

        if(DEBUG_MAP) console.log(`finalExplorableHexes:`);
        if(DEBUG_MAP) console.log(finalExplorableHexes);

        if(finalExplorableHexes.length == 0) {
            if(DEBUG_MAP) console.log(`finalExplorableHexes.length == 0 condition met`);
            thisChosenHex = 'NA';
            $('#exploreConquerSummary').html('<p>The Automa cannot explore anywhere and skips this action.</p>');
            $('#exploreConquerSummary').css('display', 'block');
            setTimeout(function(){
                finalMapStep();
            }, 10);
        } else if(finalExplorableHexes.length == 1) {
            if(DEBUG_MAP) console.log(`finalExplorableHexes.length == 1 condition met`);
            if(DEBUG_MAP) console.log(`finalExplorableHexes[0] => '${finalExplorableHexes[0]}'`);
            // If the Automa can only explore one hex, then explore there
            lockInTile(finalExplorableHexes[0]);
        } else {
            if(DEBUG_MAP) console.log(`finalExplorableHexes.length > 1 condition met`);

            if(DEBUG_MAP) console.log(`game.automaInfo.favTrack => '${game.automaInfo.favTrack}'`);

            if(game.automaInfo.favTrack != 'military') {
                if(DEBUG_MAP) console.log(`game.automaInfo.favTrack != 'military' condition met`);
                for (let l = 0; l < game.map.tiles.length; l++) {
                    if(game.map.tiles[l].control == 'human') {
                        if(DEBUG_MAP) console.log(`game.map.tiles[l].control == 'human' condition met`);
                        humanHexes.push(game.map.tiles[l].tile)
                    }
                }

                var humanTerritories = {};
                var humanTerritoriesHighestDistance = {};

                var explorableTerritories = {};

                for(const key of humanHexes) {
                    humanTerritories[key] = [];
                    humanTerritoriesHighestDistance[key] = 0;
                }

                for(const key of finalExplorableHexes) {
                    explorableTerritories[key] = 0;
                }

                for (let i = 0; i < humanHexes.length; i++) {
                    for (let j = 0; j < game.map.tiles[humanHexes[i]].neighbours.length; j++) {
                        for (let k = 0; k < finalExplorableHexes.length; k++) {
                            if(game.map.tiles[humanHexes[i]].neighbours[j].indexOf(finalExplorableHexes[k]) !== -1) {

                                if(DEBUG_MAP) console.log(`game.map.tiles[humanHexes[i]].neighbours[j].indexOf(finalExplorableHexes[k]) !== -1 condition met`);

                                let thisRow =  classProcessor($(`#tile-${finalExplorableHexes[k]}`), 'row', 'whole');
                                let thisRowFinal = thisRow.split('ow');

                                let thisColumn  = classProcessor($(`#tile-${finalExplorableHexes[k]}`), 'column', 'whole');
                                let thisColumnFinal  = thisColumn.split('olumn');

                                if(DEBUG_MAP) console.log(`finalExplorableHexes[k] => '${finalExplorableHexes[k]}'`);
                                if(DEBUG_MAP) console.log(`thisRowFinal[1] => '${thisRowFinal[1]}'`);
                                if(DEBUG_MAP) console.log(`thisColumnFinal[1] => '${thisColumnFinal[1]}'`);

                                humanTerritories[humanHexes[i]].push({
                                    automaHex: finalExplorableHexes[k],
                                    row: parseInt(thisRowFinal[1]),
                                    column: parseInt(thisColumnFinal[1]),
                                    distance: parseInt(j + 1),
                                    hexPath: []
                                });
                            } 
                        }
                    }
                }

                if(DEBUG_MAP) console.log(`humanTerritories:`);
                if(DEBUG_MAP) console.log(humanTerritories);

                distanceToExploreTile(humanTerritories);

                for (var humanTerritory in humanTerritories) {
                    if (humanTerritories.hasOwnProperty(humanTerritory)) {
                        for (let i = 0; i < humanTerritories[humanTerritory].length; i++) {
                            if(humanTerritories[humanTerritory][i].distance != 0) {
                                if(DEBUG_MAP) console.log(`humanTerritories[humanTerritory][i].distance != 0 condition met`);
                                if(explorableTerritories[humanTerritories[humanTerritory][i].automaHex] == 0) {
                                    if(DEBUG_MAP) console.log(`explorableTerritories[humanTerritories[humanTerritory][i].automaHex] == 0 condition met`);
                                    explorableTerritories[humanTerritories[humanTerritory][i].automaHex] = humanTerritories[humanTerritory][i].distance;
                                } else if(humanTerritories[humanTerritory][i].distance < explorableTerritories[humanTerritories[humanTerritory][i].automaHex]) {
                                    if(DEBUG_MAP) console.log(`humanTerritories[humanTerritory][i].distance < explorableTerritories[humanTerritories[humanTerritory][i].automaHex] condition met`);
                                    explorableTerritories[humanTerritories[humanTerritory][i].automaHex] = humanTerritories[humanTerritory][i].distance;
                                }
                            }
                        }
                    }
                }

                var highestDistanceAway = 0;

                for (var exploreHex in explorableTerritories) {
                    if (explorableTerritories.hasOwnProperty(exploreHex)) {

                        if(DEBUG_MAP) console.log(`explorableTerritories.hasOwnProperty(exploreHex) condition met`);

                        if(DEBUG_MAP) console.log(`explorableTerritories[exploreHex] => '${explorableTerritories[exploreHex]}'`);
                        if(DEBUG_MAP) console.log(`exploreHex => '${exploreHex}'`);

                        if(DEBUG_MAP) console.log(`highestDistanceAway => '${highestDistanceAway}'`);

                        if(highestDistanceAway == 0) {
                            if(DEBUG_MAP) console.log(`highestDistanceAway == 0 condition met`);
                            highestDistanceAway = explorableTerritories[exploreHex];
                            furtherestExploreHexes.push(exploreHex);
                        } else if(explorableTerritories[exploreHex] == highestDistanceAway) {
                            if(DEBUG_MAP) console.log(`explorableTerritories[exploreHex] == highestDistanceAway condition met`);
                            furtherestExploreHexes.push(exploreHex);
                        } else if(explorableTerritories[exploreHex] > highestDistanceAway) {
                            if(DEBUG_MAP) console.log(`explorableTerritories[exploreHex] > highestDistanceAway condition met`);
                            highestDistanceAway = explorableTerritories[exploreHex];
                            furtherestExploreHexes = [];
                            furtherestExploreHexes.push(exploreHex);
                        }
                    }
                }

                if(DEBUG_MAP) console.log(`explorableTerritories:`);
                if(DEBUG_MAP) console.log(explorableTerritories);

                if(DEBUG_MAP) console.log(`furtherestExploreHexes:`);
                if(DEBUG_MAP) console.log(furtherestExploreHexes);

                if(furtherestExploreHexes.length == 1) {
                    if(DEBUG_MAP) console.log(`furtherestExploreHexes.length == 1 condition met`);
                    if(DEBUG_MAP) console.log(`furtherestExploreHexes[0] => '${furtherestExploreHexes[0]}'`);
                    lockInTile(furtherestExploreHexes[0]);
                } else if(furtherestExploreHexes.length > 1) {
                    if(DEBUG_MAP) console.log(`furtherestExploreHexes.length > 1 condition met`);
                    applyMapTiebreaker(furtherestExploreHexes)
                } else if(uniqueChosenHexes.length == 0) {
                    if(DEBUG_MAP) console.log(`uniqueChosenHexes.length == 0 condition met`);
                    thisChosenHex = 'NA';
                    $('#exploreConquerSummary').html('<p>The Automa cannot explore anywhere and skips this action.</p>');
                    $('#exploreConquerSummary').css('display', 'block');
                    setTimeout(function(){
                        finalMapStep();
                    }, 10);
                }
    
            } else {
                if(DEBUG_MAP) console.log(`game.automaInfo.favTrack == 'Military' condition met`);
                if(DEBUG_MAP) console.log(`finalExplorableHexes:`);
                if(DEBUG_MAP) console.log(finalExplorableHexes);

                applyMapTiebreaker(finalExplorableHexes);
            }
        }
       
    } else if(thisMode == 'conquer') {
        if(DEBUG_MAP) console.log(`thisMode == 'conquer' condition met`);

        var conquerableHexes = [];
        var finalConquerableHexes = [];

        var conquerHuman = [];

        var finalConquerableHexesDistances = [];
        var humanHexes = [];
        var humanHexObj = {};

        for (let i = 0; i < game.map.tiles.length; i++) {
            if(game.map.tiles[i].control == 'automa') {
                if(DEBUG_MAP) console.log(`game.map.tiles[i].control == 'automa' condition met`);
                for (let j = 0; j < game.map.tiles[i].neighbours[0].length; j++) {
                    conquerableHexes.push(game.map.tiles[i].neighbours[0][j]);
                }
            }
        }

        if(DEBUG_MAP) console.log(`conquerableHexes:`);
        if(DEBUG_MAP) console.log(conquerableHexes);

        var uniqueHexes = conquerableHexes.filter(onlyUnique);

        if(DEBUG_MAP) console.log(`uniqueHexes:`);
        if(DEBUG_MAP) console.log(uniqueHexes);

        for (let k = 0; k < uniqueHexes.length; k++) {
            if(game.map.tiles[uniqueHexes[k]].control == 'human' && game.map.tiles[uniqueHexes[k]].twoOutposts == 'false') {
                if(DEBUG_MAP) console.log(`game.map.tiles[uniqueHexes[k]].control == 'human' && game.map.tiles[uniqueHexes[k]].twoOutposts == 'false' condition met`);
                conquerHuman.push(uniqueHexes[k])
            } else if(game.map.tiles[uniqueHexes[k]].control == 'neutral') {
                if(DEBUG_MAP) console.log(`game.map.tiles[uniqueHexes[k]].control == 'neutral' condition met`);
                finalConquerableHexes.push(uniqueHexes[k])
            }
        }

        if(DEBUG_MAP) console.log(`conquerHuman:`);
        if(DEBUG_MAP) console.log(conquerHuman);

        if(DEBUG_MAP) console.log(`finalConquerableHexes:`);
        if(DEBUG_MAP) console.log(finalConquerableHexes);

        if(conquerHuman.length != 0) {
            if(DEBUG_MAP) console.log(`conquerHuman.length != 0 condition met`);
            if(conquerHuman.length == 1) {
                if(DEBUG_MAP) console.log(`conquerHuman.length == 1 condition met`);
                lockInTile(conquerHuman[0]);
            } else if(conquerHuman.length > 1) {
                if(DEBUG_MAP) console.log(`conquerHuman.length > 1 condition met`);
                if(DEBUG_MAP) console.log(`game.map.tiles[16].control => '${game.map.tiles[16].control}'`);
                if(game.map.tiles[16].control == 'neutral' || game.map.tiles[16].control == 'human' && game.map.tiles[16].twoOutposts == 'false') {
                    if(DEBUG_MAP) console.log(`game.map.tiles[16].control = ${game.map.tiles[16].control}`);
                    if(conquerHuman.indexOf(16) !== -1) {
                        if(DEBUG_MAP) console.log(`conquerHuman.indexOf(16) !== -1 condition met`);
                        lockInTile(16);
                    } else {
                        if(DEBUG_MAP) console.log(`conquerHuman.indexOf(16) === -1 condition met`);
                        if(DEBUG_MAP) console.log(`conquerHuman => '${conquerHuman}'`);

                        finalConquerableHexes = applyMiddleIslandTiebreaker(conquerHuman, 'conquer')

                        if(DEBUG_MAP) console.log(`finalConquerableHexes:`);9
                        if(DEBUG_MAP) console.log(finalConquerableHexes);

                        if(finalConquerableHexes.length == 1) {
                            if(DEBUG_MAP) console.log(`finalConquerableHexes.length == 1 condition met`);
                            lockInTile(finalConquerableHexes[0]);
                        } else if(finalConquerableHexes.length > 1) {
                            if(DEBUG_MAP) console.log(`finalConquerableHexes.length > 1 condition met`);
                            applyMapTiebreaker(finalConquerableHexes)
                        }
                    }
                } else {
                    if(DEBUG_MAP) console.log(`game.map.tiles[16].control != 'neutral' && game.map.tiles[16].control != 'human' && game.map.tiles[16].twoOutposts != 'false' condition met (POTENTIALLY INACCURATE COMMENT`);
                    if(DEBUG_MAP) console.log(`conquerHuman => '${conquerHuman}'`);
                    applyMapTiebreaker(conquerHuman);
                }

            }

        } else {
            if(DEBUG_MAP) console.log(`conquerHuman.length != 0 condition met`);
            
            // CONQUER NEUTRAL

            var humanNeighbourHexes = [];

            // If Topple Indicator IS NOT present, then find all neighbours of human tiles and take these away from valid tiles

            if(game.firstCardInfo.topple == 'false') {
                if(DEBUG_MAP) console.log(`game.firstCardInfo.topple == 'false' condition met`);

                for (let i = 0; i < game.map.tiles.length; i++) {
                    if(game.map.tiles[i].control == 'human') {
                        if(DEBUG_MAP) console.log(`game.map.tiles[i].control == 'human' condition met`);
                        for (let j = 0; j < game.map.tiles[i].neighbours[0].length; j++) {
                            humanNeighbourHexes.push(game.map.tiles[i].neighbours[0][j]);
                        }
                    }
                }

                if(DEBUG_MAP) console.log(`humanNeighbourHexes:`);
                if(DEBUG_MAP) console.log(humanNeighbourHexes);

                var uniqueHumanHexes = humanNeighbourHexes.filter(onlyUnique);

                if(DEBUG_MAP) console.log(`uniqueHumanHexes:`);
                if(DEBUG_MAP) console.log(uniqueHumanHexes);

                finalConquerableHexes = finalConquerableHexes.filter(function(val) {
                    return uniqueHumanHexes.indexOf(val) == -1;
                });

                if(DEBUG_MAP) console.log(`finalConquerableHexes:`);
                if(DEBUG_MAP) console.log(finalConquerableHexes);

            }

            if(DEBUG_MAP) console.log(`finalConquerableHexes:`);
            if(DEBUG_MAP) console.log(finalConquerableHexes);

            if(finalConquerableHexes.length == 0) {
                if(DEBUG_MAP) console.log(`finalConquerableHexes.length == 0 condition met`);
                // No Explorable tile places
            } else if(finalConquerableHexes.length == 1) {
                if(DEBUG_MAP) console.log(`finalConquerableHexes.length == 1 condition met`);
                if(DEBUG_MAP) console.log(`finalConquerableHexes[0] => '${finalConquerableHexes[0]}'`);
                // If the Automa can only explore one hex, then explore there
                lockInTile(finalConquerableHexes[0]);
            } else {
                if(DEBUG_MAP) console.log(`finalConquerableHexes.length > 1 condition met`);

                if(finalConquerableHexes.indexOf(16) !== -1) {
                    if(DEBUG_MAP) console.log(`finalConquerableHexes.indexOf(16) !== -1 condition met`);
                    lockInTile(16);
                } else {
                    if(DEBUG_MAP) console.log(`finalConquerableHexes.indexOf(16) === -1 condition met (DOES NOT EXIST`);

                    if(DEBUG_MAP) console.log(`game.map.tiles[16].control => '${game.map.tiles[16].control}'`);
                    if(DEBUG_MAP) console.log(`game.map.tiles[16].twoOutposts => '${game.map.tiles[16].twoOutposts}'`);

                    if(game.map.tiles[16].control == 'neutral' || game.map.tiles[16].control == 'human' && game.map.tiles[16].twoOutposts == 'false') {
                        if(DEBUG_MAP) console.log(`game.map.tiles[16].control == 'neutral' || game.map.tiles[16].control == 'human' && game.map.tiles[16].twoOutposts == 'false' condition met`);
                        finalConquerableHexes = applyMiddleIslandTiebreaker(finalConquerableHexes, 'conquer')
                    }

                    if(DEBUG_MAP) console.log(`finalConquerableHexes:`);
                    if(DEBUG_MAP) console.log(finalConquerableHexes);
    
                    if(finalConquerableHexes.length == 1) {
                        if(DEBUG_MAP) console.log(`finalConquerableHexes.length == 1 condition met (DOES NOT EXIST`);
                        if(DEBUG_MAP) console.log(`finalConquerableHexes[0] => '${finalConquerableHexes[0]}'`);
                        lockInTile(finalConquerableHexes[0]);
                    } else if(finalConquerableHexes.length > 1) {
                        if(DEBUG_MAP) console.log(`finalConquerableHexes.length > 1 condition met`);

                        var humanSingleOutposts = [];
                        var humanDoubleOutposts = [];
    
                        var humanHexObj = {};
    
                        for (let i = 0; i < game.map.tiles.length; i++) {
                            if(game.map.tiles[i].control == 'human') {
                                if(DEBUG_MAP) console.log(`game.map.tiles[i].control == 'human' condition met`);
                                if(game.map.tiles[i].twoOutposts == 'false') {
                                    if(DEBUG_MAP) console.log(`game.map.tiles[i].twoOutposts == 'false' condition met`);
                                    humanSingleOutposts.push(parseInt(game.map.tiles[i].tile));
                                } else if(game.map.tiles[i].twoOutposts == 'true') {
                                    if(DEBUG_MAP) console.log(`game.map.tiles[i].twoOutposts == 'true' condition met`);
                                    humanDoubleOutposts.push(parseInt(game.map.tiles[i].tile));
                                }
                            }
                        }

                        var finalSingleOutpostHexes = [];

                        if(humanSingleOutposts.length != 0) {
                            if(DEBUG_MAP) console.log(`humanSingleOutposts.length != 0 condition met`);
                            for (let i = 0; i < humanSingleOutposts.length; i++) {
                                var reachable = 'false';
                                reachable_hex_loop:
                                for (let j = 0; j < game.map.tiles[humanSingleOutposts[i]].nextTo.length; j++) {
                                    var nextToHex = game.map.tiles[humanSingleOutposts[i]].nextTo[j];
                                    if(DEBUG_MAP) console.log(`nextToHex => '${nextToHex}'`);
                                    if(nextToHex != 'NA') {
                                        if(DEBUG_MAP) console.log(`nextToHex != 'NA' condition met`);
                                        if(game.map.tiles[nextToHex].control == 'neutral' || game.map.tiles[nextToHex].control == 'human' && game.map.tiles[nextToHex].twoOutposts == 'false') {
                                            if(DEBUG_MAP) console.log(`game.map.tiles[nextToHex].control == 'neutral' || game.map.tiles[nextToHex].control == 'human' && game.map.tiles[nextToHex].twoOutposts == 'false' condition met`);
                                            reachable = 'true';
                                            break reachable_hex_loop;
                                        }
                                    }
                                }

                                if(DEBUG_MAP) console.log(`reachable => '${reachable}'`);

                                if(reachable == 'true') {
                                    if(DEBUG_MAP) console.log(`reachable == 'true' condition met`);
                                    if(DEBUG_MAP) console.log(`humanSingleOutposts[i] => '${humanSingleOutposts[i]}'`);
                                    finalSingleOutpostHexes.push(humanSingleOutposts[i])
                                }
                            }
                        }

                        if(DEBUG_MAP) console.log(`finalSingleOutpostHexes:`);
                        if(DEBUG_MAP) console.log(finalSingleOutpostHexes);
    
                        if(finalSingleOutpostHexes.length != 0) {
                            if(DEBUG_MAP) console.log(`finalSingleOutpostHexes.length != 0 condition met`);
                            // Conquer Neutral to find closest conquerable hexes to humans single outposts
                            
                            // Loop through neighbours of single outposts to find out how far each conquerable hex is from the human-controlled hexes

                            var singleOutpost = {};

                            for(const key of finalSingleOutpostHexes) {
                                singleOutpost[key] = [];
                            }

                            for (let i = 0; i < finalSingleOutpostHexes.length; i++) {
                                for (let j = 0; j < game.map.tiles[finalSingleOutpostHexes[i]].neighbours.length; j++) {
                                    for (let k = 0; k < finalConquerableHexes.length; k++) {
                                        if(game.map.tiles[finalSingleOutpostHexes[i]].neighbours[j].indexOf(finalConquerableHexes[k]) !== -1) {
                                            if(DEBUG_MAP) console.log(`game.map.tiles[finalSingleOutpostHexes[i]].neighbours[j].indexOf(finalConquerableHexes[k]) !== -1 condition met`);
                                            let thisRow =  classProcessor($(`#tile-${finalConquerableHexes[k]}`), 'row', 'whole');
                                            let thisRowFinal = thisRow.split('ow');

                                            let thisColumn  = classProcessor($(`#tile-${finalConquerableHexes[k]}`), 'column', 'whole');
                                            let thisColumnFinal  = thisColumn.split('olumn');

                                            if(DEBUG_MAP) console.log(`finalConquerableHexes[k] => '${finalConquerableHexes[k]}'`);
                                            if(DEBUG_MAP) console.log(`thisRowFinal[1] => '${thisRowFinal[1]}'`);
                                            if(DEBUG_MAP) console.log(`thisColumnFinal[1] => '${thisColumnFinal[1]}'`);

                                            singleOutpost[finalSingleOutpostHexes[i]].push({
                                                automaHex: finalConquerableHexes[k],
                                                row: parseInt(thisRowFinal[1]),
                                                column: parseInt(thisColumnFinal[1]),
                                                distance: parseInt(j + 1),
                                                hexPath: []
                                            });
                                        } 
                                    }
                                }
                            }

                            if(DEBUG_MAP) console.log(`singleOutpost => '${singleOutpost}'`);

                            distanceToTile(singleOutpost);

                            // Might need to make the singleOutpost object global so the code updates it.

                            // finalConquerHexes = compareConquerHexDistances(finalConquerableHexes, humanSingleOutposts)
                        } else {
                            if(DEBUG_MAP) console.log(`finalSingleOutpostHexes.length == 0 condition met`);
                            var doubleOutpost = {};

                            for(const key of humanDoubleOutposts) {
                                doubleOutpost[key] = [];
                            }

                            for (let i = 0; i < humanDoubleOutposts.length; i++) {
                                for (let j = 0; j < game.map.tiles[humanDoubleOutposts[i]].neighbours.length; j++) {
                                    for (let k = 0; k < finalConquerableHexes.length; k++) {
                                        if(game.map.tiles[humanDoubleOutposts[i]].neighbours[j].indexOf(finalConquerableHexes[k]) !== -1) {

                                            if(DEBUG_MAP) console.log(`game.map.tiles[humanDoubleOutposts[i]].neighbours[j].indexOf(finalConquerableHexes[k]) !== -1 condition met`);

                                            let thisRow =  classProcessor($(`#tile-${finalConquerableHexes[k]}`), 'row', 'whole');
                                            let thisRowFinal = thisRow.split('ow');

                                            let thisColumn  = classProcessor($(`#tile-${finalConquerableHexes[k]}`), 'column', 'whole');
                                            let thisColumnFinal  = thisColumn.split('olumn');

                                            if(DEBUG_MAP) console.log(`finalConquerableHexes[k] => '${finalConquerableHexes[k]}'`);
                                            if(DEBUG_MAP) console.log(`thisRowFinal[1] => '${thisRowFinal[1]}'`);
                                            if(DEBUG_MAP) console.log(`thisColumnFinal[1] => '${thisColumnFinal[1]}'`);

                                            doubleOutpost[humanDoubleOutposts[i]].push({
                                                automaHex: finalConquerableHexes[k],
                                                row: parseInt(thisRowFinal[1]),
                                                column: parseInt(thisColumnFinal[1]),
                                                distance: parseInt(j + 1),
                                                hexPath: []
                                            });
                                        } 
                                    }
                                }
                            }

                            // Automa conquers as close as it can to double outposts
                            if(DEBUG_MAP) console.log(`doubleOutpost => '${doubleOutpost}'`);
                            distanceToTile(doubleOutpost);
                        }

                        if(closestHexes.length == 1) {
                            if(DEBUG_MAP) console.log(`closestHexes.length == 1 condition met`);
                            if(DEBUG_MAP) console.log(`closestHexes[0] => '${closestHexes[0]}'`);
                            lockInTile(closestHexes[0]);
                        } else if(closestHexes.length > 1) {
                            if(DEBUG_MAP) console.log(`closestHexes.length > 1 condition met`);

                            if(DEBUG_MAP) console.log(`closestHexes:`);
                            if(DEBUG_MAP) console.log(closestHexes);

                            applyMapTiebreaker(closestHexes)
                        }
                    }
                }
            }
        }
    } else if(thisMode == 'conquerAnywhere') {

        if(DEBUG_MAP) console.log(`thisMode == 'conquerAnywhere' condition met`);

        var humanSingleOutposts = [];
        var humanDoubleOutposts = [];

        for (let i = 0; i < game.map.tiles.length; i++) {
            if(game.map.tiles[i].control == 'human') {
                if(DEBUG_MAP) console.log(`game.map.tiles[i].control == 'human' condition met`);
                if(game.map.tiles[i].twoOutposts == 'false') {
                    if(DEBUG_MAP) console.log(`game.map.tiles[i].twoOutposts == 'false' condition met`);
                    humanSingleOutposts.push(parseInt(game.map.tiles[i].tile));
                } else if(game.map.tiles[i].twoOutposts == 'true') {
                    if(DEBUG_MAP) console.log(`game.map.tiles[i].twoOutposts == 'true' condition met`);
                    humanDoubleOutposts.push(parseInt(game.map.tiles[i].tile));
                }
            }
        }

        var conquerHexes = [];
        var finalConquerHexes = [];

        if(humanSingleOutposts.length != 0) {
            if(DEBUG_MAP) console.log(`humanSingleOutposts.length != 0 condition met`);

            if(DEBUG_MAP) console.log(`humanSingleOutposts:`);
            if(DEBUG_MAP) console.log(humanSingleOutposts);

            applyMapTiebreaker(humanSingleOutposts);
        } else {
            if(DEBUG_MAP) console.log(`humanSingleOutposts.length == 0 condition met`);
            // Automa conquers as close as it can to double outposts
            if(game.firstCardInfo.topple == 'false') {
                if(DEBUG_MAP) console.log(`game.firstCardInfo.topple == 'false' condition met`);
                for (let i = 0; i < game.map.tiles.length; i++) {
                    if(game.map.tiles[i].control == 'human') {
                        if(DEBUG_MAP) console.log(`game.map.tiles[i].control == 'human' condition met`);
                        for (let j = 0; j < game.map.tiles[i].neighbours[1].length; j++) {
                            if(DEBUG_MAP) console.log(`game.map.tiles[i].neighbours[1][j] => '${game.map.tiles[i].neighbours[1][j]}'`);
                            conquerHexes.push(game.map.tiles[i].neighbours[1][j]);
                        }
                    }
                }
            } else {
                if(DEBUG_MAP) console.log(`game.firstCardInfo.topple != 'false' condition met`);
                for (let i = 0; i < game.map.tiles.length; i++) {
                    if(game.map.tiles[i].control == 'human') {
                        if(DEBUG_MAP) console.log(`game.map.tiles[i].control == 'human' condition met`);
                        for (let j = 0; j < game.map.tiles[i].neighbours[0].length; j++) {
                            if(DEBUG_MAP) console.log(`game.map.tiles[i].neighbours[0][j] => '${game.map.tiles[i].neighbours[0][j]}'`);
                            conquerHexes.push(game.map.tiles[i].neighbours[0][j]);
                        }
                    }
                }
            }

            if(DEBUG_MAP) console.log(`conquerHexes:`);
            if(DEBUG_MAP) console.log(conquerHexes);

            var uniqueConquerHexes = conquerHexes.filter(onlyUnique);

            if(DEBUG_MAP) console.log(`uniqueConquerHexes:`);
            if(DEBUG_MAP) console.log(uniqueConquerHexes);

            for (let i = 0; i < uniqueConquerHexes.length; i++) {
                if(game.map.tiles[uniqueConquerHexes[i]].control == 'neutral') {
                    if(DEBUG_MAP) console.log(`game.map.tiles[uniqueConquerHexes[i]].control == 'neutral' condition met`);
                    finalConquerHexes.push(uniqueConquerHexes[i]);
                }
            }

            if(DEBUG_MAP) console.log(`finalConquerHexes:`);
            if(DEBUG_MAP) console.log(finalConquerHexes);

            if(finalConquerHexes.length == 1) {
                if(DEBUG_MAP) console.log(`finalConquerHexes.length == 1 condition met`);
                if(DEBUG_MAP) console.log(`finalConquerHexes[0] => '${finalConquerHexes[0]}'`);
                lockInTile(finalConquerHexes[0]);
            } else if(finalConquerHexes.length > 1) {
                if(DEBUG_MAP) console.log(`finalConquerHexes.length > 1 condition met`);
                applyMapTiebreaker(finalConquerHexes)
            }
        }
    } else if(thisMode == 'placeToppledSE') {

        let automaHexesArray = calculateAutomasHexesWithOneOutpost();

        applyMapTiebreaker(automaHexesArray);

    }
    nextMapStep();
}

function distanceToExploreTile(hexes) {
    if(DEBUG_MAP) console.log(`/-------------------------------------------/`);
    if(DEBUG_MAP) console.log(`distanceToExploreTile() func triggered`);
    furtherestExploreHexes = [];

    for (var hex in hexes) {
        if (hexes.hasOwnProperty(hex)) {

            if(DEBUG_MAP) console.log(`hex => '${hex}'`);
            if(DEBUG_MAP) console.log(`hexes[hex] => '${hexes[hex]}'`);

            if(DEBUG_MAP) console.log(`hexes[hex]:`);
            if(DEBUG_MAP) console.log(hexes[hex]);

            for (let i = 0; i < hexes[hex].length; i++) {

                if(DEBUG_MAP) console.log(`hexes[hex][i] => '${hexes[hex][i]}'`);

                if(DEBUG_MAP) console.log(`hexes[hex][i]:`);
                if(DEBUG_MAP) console.log(hexes[hex][i]);

                if(DEBUG_MAP) console.log(`hex => '${hex}'`);
                if(DEBUG_MAP) console.log(`hexes[hex][i].automaHex => '${hexes[hex][i].automaHex}'`);

                hexes[hex][i].hexPath = hexRoute(hex, hexes[hex][i].automaHex);
                if(hexes[hex][i].hexPath[0] == 'NA') {
                    if(DEBUG_MAP) console.log(`hexes[hex][i].hexPath[0] == 'NA' condition met`);
                    hexes[hex][i].distance = 0;
                } else {
                    if(DEBUG_MAP) console.log(`hexes[hex][i].hexPath[0] != 'NA' condition met`);
                    if(hexes[hex][i].hexPath.length != 0) {
                        if(DEBUG_MAP) console.log(`hexes[hex][i].hexPath.length != 0 condition met`);
                        if(DEBUG_MAP) console.log(`hexes[hex][i].hexPath.length => '${hexes[hex][i].hexPath.length}'`);
                        hexes[hex][i].distance = hexes[hex][i].hexPath.length;
                    }
                }
            }
        }
    }
}

function distanceToTile(hexes) {

    if(DEBUG_MAP) console.log(`/-------------------------------------------/`);
    if(DEBUG_MAP) console.log(`distanceToTile() func triggered`);

    lowestHexRouteDistance = 999;
    closestHexes = [];

    for (var hex in hexes) {
        if (hexes.hasOwnProperty(hex)) {

            if(DEBUG_MAP) console.log(`hex => '${hex}'`);
            if(DEBUG_MAP) console.log(`hexes[hex] => '${hexes[hex]}'`);

            if(DEBUG_MAP) console.log(`hexes[hex]:`);
            if(DEBUG_MAP) console.log(hexes[hex]);

            for (let i = 0; i < hexes[hex].length; i++) {

                if(DEBUG_MAP) console.log(`hexes[hex][i] => '${hexes[hex][i]}'`);

                if(DEBUG_MAP) console.log(`hexes[hex][i]:`);
                if(DEBUG_MAP) console.log(hexes[hex][i]);

                if(DEBUG_MAP) console.log(`hex => '${hex}'`);
                if(DEBUG_MAP) console.log(`hexes[hex][i].automaHex => '${hexes[hex][i].automaHex}'`);

                hexes[hex][i].hexPath = hexRoute(hex, hexes[hex][i].automaHex);

                if(DEBUG_MAP) console.log(`hexes[hex][i].hexPath => '${hexes[hex][i].hexPath}'`);

                if(hexes[hex][i].hexPath[0] == 'NA') {
                    if(DEBUG_MAP) console.log(`hexes[hex][i].hexPath[0] == 'NA' condition met`);
                    hexes[hex][i].distance = 99;
                } else {
                    if(DEBUG_MAP) console.log(`hexes[hex][i].hexPath[0] != 'NA' condition met`);
                    if(hexes[hex][i].hexPath.length != 0) {
                        if(DEBUG_MAP) console.log(`hexes[hex][i].hexPath.length != 0 condition met`);
                        if(DEBUG_MAP) console.log(`hexes[hex][i].hexPath.length => '${hexes[hex][i].hexPath.length}'`);
                        hexes[hex][i].distance = hexes[hex][i].hexPath.length;
                        if(lowestHexRouteDistance == 999) {
                            if(DEBUG_MAP) console.log(`lowestHexRouteDistance == 999 condition met`);
                            if(DEBUG_MAP) console.log(`hexes[hex][i].automaHex => '${hexes[hex][i].automaHex}'`);
                            closestHexes.push(hexes[hex][i].automaHex)
                            if(DEBUG_MAP) console.log(`hexes[hex][i].hexPath.length => '${hexes[hex][i].hexPath.length}'`);
                            lowestHexRouteDistance = hexes[hex][i].hexPath.length;
                        } else if(hexes[hex][i].hexPath.length < lowestHexRouteDistance) {
                            if(DEBUG_MAP) console.log(`hexes[hex][i].hexPath.length < lowestHexRouteDistance condition met`);
                            if(DEBUG_MAP) console.log(`hexes[hex][i].hexPath.length => '${hexes[hex][i].hexPath.length}'`);
                            lowestHexRouteDistance = hexes[hex][i].hexPath.length;
                            closestHexes = [];
                            if(DEBUG_MAP) console.log(`hexes[hex][i].automaHex => '${hexes[hex][i].automaHex}'`);
                            closestHexes.push(hexes[hex][i].automaHex)
                        } else if(hexes[hex][i].hexPath.length == lowestHexRouteDistance) {
                            if(DEBUG_MAP) console.log(`hexes[hex][i].hexPath.length == lowestHexRouteDistance condition met`);
                            if(DEBUG_MAP) console.log(`hexes[hex][i].automaHex => '${hexes[hex][i].automaHex}'`);
                            closestHexes.push(hexes[hex][i].automaHex)
                        }
                    }
                }
            }
        }
    }

    if(DEBUG_MAP) console.log(`closestHexes:`);
    if(DEBUG_MAP) console.log(closestHexes);

}

var hexRouteCalls = 0;

function hexRoute(startHex, endHex) {

    if(DEBUG_MAP) console.log(`/-------------------------------------------/`);
    if(DEBUG_MAP) console.log(`hexRoute() func triggered`);
    if(DEBUG_MAP) console.log(`startHex => '${startHex}'`);
    if(DEBUG_MAP) console.log(`endHex => '${endHex}'`);

    hexRouteCalls = 0;
    recordOfValidHexes = [];

    var hexPaths = [];
    hexPaths[0] = [parseInt(startHex)];
    recordOfValidHexes.push(parseInt(startHex));

    var currentPathIndex = 0;
    var validPathIndexes = [0];
    var newPathIndexes = [];
    
    while (recordOfValidHexes.indexOf(endHex) === -1) {

        newPathIndexes = [];

        hexRouteCalls += 1;
        if (hexRouteCalls > 50) { debugger; }

        for (let i = 0; i < hexPaths.length; i++) {
            
            if(validPathIndexes.indexOf(i) !== -1) {
                if(DEBUG_MAP) console.log(`validPathIndexes.indexOf(i) !== -1 condition met`);

                if(DEBUG_MAP) console.log(`hexPaths[i][hexPaths[i].length - 1] => '${hexPaths[i][hexPaths[i].length - 1]}'`);
                if(DEBUG_MAP) console.log(`endHex => '${endHex}'`);

                let nextPosHex = columnRowHandler(hexPaths[i][hexPaths[i].length - 1], endHex);

                if(DEBUG_MAP) console.log(`nextPosHex:`);
                if(DEBUG_MAP) console.log(nextPosHex);
                
                if(nextPosHex.length == 1) {
                    if(DEBUG_MAP) console.log(`nextPosHex.length == 1 condition met`);
                    if(DEBUG_MAP) console.log(`nextPosHex[0] => '${nextPosHex[0]}'`);
                    if(nextPosHex[0] == 'NA') {
                        if(DEBUG_MAP) console.log(`nextPosHex[0] == 'NA' condition met`);

                        let thisIndex = validPathIndexes.indexOf(i);
                        if(DEBUG_MAP) console.log(`thisIndex => '${thisIndex}'`);

                        validPathIndexes.splice(thisIndex, 1);
                        if(DEBUG_MAP) console.log(`validPathIndexes => '${validPathIndexes}'`);

                        hexPaths[i].push(nextPosHex[0]);
                        if(DEBUG_MAP) console.log(`hexPaths[i]:`);
                        if(DEBUG_MAP) console.log(hexPaths[i]);
                    } else {
                        if(DEBUG_MAP) console.log(`nextPosHex[0] != 'NA' condition met`);
                        recordOfValidHexes.push(parseInt(nextPosHex[0]));

                        if(DEBUG_MAP) console.log(`recordOfValidHexes:`);
                        if(DEBUG_MAP) console.log(recordOfValidHexes);

                        hexPaths[i].push(parseInt(nextPosHex[0]));

                        if(DEBUG_MAP) console.log(`hexPaths[i]:`);
                        if(DEBUG_MAP) console.log(hexPaths[i]);
                    }

                } else if(nextPosHex.length > 1) {
                    if(DEBUG_MAP) console.log(`nextPosHex.length > 1 condition met`);
                    let thisIndex = validPathIndexes.indexOf(i);
                    if(DEBUG_MAP) console.log(`thisIndex => '${thisIndex}'`);

                    validPathIndexes.splice(thisIndex, 1);
                    if(DEBUG_MAP) console.log(`validPathIndexes => '${validPathIndexes}'`);

                    for (let j = 0; j < nextPosHex.length; j++) {
                        hexPaths.push(hexPaths[i].slice());

                        if(DEBUG_MAP) console.log(`hexPaths:`);
                        if(DEBUG_MAP) console.log(hexPaths);

                        if(DEBUG_MAP) console.log(`nextPosHex[j] => '${nextPosHex[j]}'`);

                        if(nextPosHex[j] != 'NA') {
                            if(DEBUG_MAP) console.log(`nextPosHex[j] != 'NA' condition met`);
                            if(DEBUG_MAP) console.log(`hexPaths.length - 1 => '${hexPaths.length - 1}'`);
                            newPathIndexes.push(hexPaths.length - 1);

                            if(DEBUG_MAP) console.log(`newPathIndexes:`);
                            if(DEBUG_MAP) console.log(newPathIndexes);

                            recordOfValidHexes.push(parseInt(nextPosHex[j]));

                            if(DEBUG_MAP) console.log(`recordOfValidHexes:`);
                            if(DEBUG_MAP) console.log(recordOfValidHexes);

                            hexPaths[hexPaths.length - 1].push(parseInt(nextPosHex[j]));

                            if(DEBUG_MAP) console.log(`hexPaths[i]:`);
                            if(DEBUG_MAP) console.log(hexPaths[i]);

                        } else {
                            if(DEBUG_MAP) console.log(`nextPosHex[j] += 'NA' condition met`);
                            if(DEBUG_MAP) console.log(`nextPosHex[j] => '${nextPosHex[j]}'`);
                            hexPaths[hexPaths.length - 1].push(nextPosHex[j]);

                            if(DEBUG_MAP) console.log(`hexPaths[i]:`);
                            if(DEBUG_MAP) console.log(hexPaths[i]);

                        }
                    }
                }
            }
        }

        if(DEBUG_MAP) console.log(`newPathIndexes:`);
        if(DEBUG_MAP) console.log(newPathIndexes);

        if(newPathIndexes.length > 0) {
            if(DEBUG_MAP) console.log(`newPathIndexes.length > 0 condition met`);
            for (let l = 0; l < newPathIndexes.length; l++) {
                if(DEBUG_MAP) console.log(`newPathIndexes[l] => '${newPathIndexes[l]}'`);
                validPathIndexes.push(newPathIndexes[l]);
            }
        }

        if(DEBUG_MAP) console.log(`validPathIndexes:`);
        if(DEBUG_MAP) console.log(validPathIndexes);

        if(validPathIndexes.length == 0) {
            if(DEBUG_MAP) console.log(`validPathIndexes.length == 0 condition met`);
            return ['NA'];
        }

        var hexPathsGreaterThanShortestPath = 0;

        if(DEBUG_MAP) console.log(`hexPaths:`);
        if(DEBUG_MAP) console.log(hexPaths);

        for (let i = 0; i < hexPaths.length; i++) {
            if(validPathIndexes.indexOf(i) !== -1) {
                if(DEBUG_MAP) console.log(`validPathIndexes.indexOf(i) !== -1 condition met`);

                if(DEBUG_MAP) console.log(`hexPaths[i].length => '${hexPaths[i].length}'`);
                if(DEBUG_MAP) console.log(`lowestHexRouteDistance => '${lowestHexRouteDistance}'`);

                if(hexPaths[i].length > lowestHexRouteDistance) {
                    if(DEBUG_MAP) console.log(`hexPaths[i].length > lowestHexRouteDistance condition met`);
                    hexPathsGreaterThanShortestPath++;
                }
            }
        }

        if(DEBUG_MAP) console.log(`hexPathsGreaterThanShortestPath => '${hexPathsGreaterThanShortestPath}'`);
        if(DEBUG_MAP) console.log(`validPathIndexes.length => '${validPathIndexes.length}'`);
        
        if(hexPathsGreaterThanShortestPath == validPathIndexes.length) {
            if(DEBUG_MAP) console.log(`hexPathsGreaterThanShortestPath == validPathIndexes.length condition met`);
            return ['NA'];
        }
    
    }

    var completedHexPaths = [];
    var finalHexPath = [];
    var shortestPathLength = 0;

    if(DEBUG_MAP) console.log(`endHex => '${endHex}'`);
    
    for (let j = 0; j < hexPaths.length; j++) {
        if(hexPaths[j][hexPaths[j].length - 1] == endHex) {
            if(DEBUG_MAP) console.log(`hexPaths[j][hexPaths[j].length - 1] == endHex condition met`);
            completedHexPaths.push(hexPaths[j])
            if(DEBUG_MAP) console.log(`shortestPathLength => '${shortestPathLength}'`);
            if(shortestPathLength == 0) {
                if(DEBUG_MAP) console.log(`shortestPathLength == 0 condition met`);
                if(DEBUG_MAP) console.log(`hexPaths[j].length => '${hexPaths[j].length}'`);
                shortestPathLength = hexPaths[j].length;
            } else if(hexPaths[j].length < shortestPathLength) {
                if(DEBUG_MAP) console.log(`hexPaths[j].length < shortestPathLength condition met`);
                if(DEBUG_MAP) console.log(`hexPaths[j].length => '${hexPaths[j].length}'`);
                shortestPathLength = hexPaths[j].length;
            }
        }
    }

    for (let k = 0; k < completedHexPaths.length; k++) {
        if(completedHexPaths[k].length == shortestPathLength) {
            if(DEBUG_MAP) console.log(`completedHexPaths[k].length == shortestPathLength condition met`);
            finalHexPath = completedHexPaths[k].slice();
        }
    }

    if(DEBUG_MAP) console.log(`finalHexPath => '${finalHexPath}'`);

    if(DEBUG_MAP) console.log(`finalHexPath:`);
    if(DEBUG_MAP) console.log(finalHexPath);

    return finalHexPath;
}

function columnRowHandler(startHex, endHex) {

    if(DEBUG_MAP) console.log(`/-------------------------------------------/`);
    if(DEBUG_MAP) console.log(`columnRowHandler() func triggered`);

    if(DEBUG_MAP) console.log(`startHex => '${startHex}'`);
    if(DEBUG_MAP) console.log(`endHex => '${endHex}'`);

    let startHexRow = classProcessor($(`#tile-${startHex}`), 'row', 'whole');
    let startHexRowSplit = startHexRow.split('ow');
    let startRow = parseInt(startHexRowSplit[1]);

    let startHexColumn = classProcessor($(`#tile-${startHex}`), 'column', 'whole');
    let startHexColumnSplit = startHexColumn.split('olumn');
    let startColumn = parseInt(startHexColumnSplit[1]);

    let conquerableHexRow = classProcessor($(`#tile-${endHex}`), 'row', 'whole');
    let conquerableHexRowSplit = conquerableHexRow.split('ow');
    let endRow = parseInt(conquerableHexRowSplit[1]);

    let conquerableHexColumn = classProcessor($(`#tile-${endHex}`), 'column', 'whole');
    let conquerableHexColumnSplit = conquerableHexColumn.split('olumn');
    let endColumn = parseInt(conquerableHexColumnSplit[1]);

    if(DEBUG_MAP) console.log(`startRow => '${startRow}'`);
    if(DEBUG_MAP) console.log(`startColumn => '${startColumn}'`);
    if(DEBUG_MAP) console.log(`endRow => '${endRow}'`);
    if(DEBUG_MAP) console.log(`endColumn => '${endColumn}'`);

    let rowDirection = '';
    let columnDirection = '';

    if(startRow > endRow) {
        if(DEBUG_MAP) console.log(`startRow > endRow condition met`);
        if(DEBUG_MAP) console.log(`startRow => '${startRow}'`);
        if(DEBUG_MAP) console.log(`endRow => '${endRow}'`);
        rowDirection = 'bottom-top';
    } else if(startRow < endRow) {
        if(DEBUG_MAP) console.log(`startRow < endRow condition met`);
        if(DEBUG_MAP) console.log(`startRow => '${startRow}'`);
        if(DEBUG_MAP) console.log(`endRow => '${endRow}'`);
        rowDirection = 'top-bottom';
    } else if(startRow == endRow) {
        if(DEBUG_MAP) console.log(`startRow == endRow condition met`);
        if(DEBUG_MAP) console.log(`startRow => '${startRow}'`);
        if(DEBUG_MAP) console.log(`endRow => '${endRow}'`);
        rowDirection = 'same-row';
    }

    if(DEBUG_MAP) console.log(`rowDirection => '${rowDirection}'`);

    if(startColumn > endColumn) {
        if(DEBUG_MAP) console.log(`startColumn > endColumn condition met`);
        if(DEBUG_MAP) console.log(`startColumn => '${startColumn}'`);
        if(DEBUG_MAP) console.log(`endColumn => '${endColumn}'`);
        columnDirection = 'right-left';
    } else if(startColumn < endColumn) {
        if(DEBUG_MAP) console.log(`startColumn < endColumn condition met`);
        if(DEBUG_MAP) console.log(`startColumn => '${startColumn}'`);
        if(DEBUG_MAP) console.log(`endColumn => '${endColumn}'`);
        columnDirection = 'left-right';
    } else if(startColumn == endColumn) {
        if(DEBUG_MAP) console.log(`startColumn == endColumn condition met`);
        if(DEBUG_MAP) console.log(`startColumn => '${startColumn}'`);
        if(DEBUG_MAP) console.log(`endColumn => '${endColumn}'`);
        columnDirection = 'same-column';
    }

    if(DEBUG_MAP) console.log(`columnDirection => '${columnDirection}'`);

    let humanRowDif = Math.abs(startRow - endRow);
    let humanColumnDif = Math.abs(startColumn - endColumn);

    if(DEBUG_MAP) console.log(`humanRowDif => '${humanRowDif}'`);
    if(DEBUG_MAP) console.log(`humanColumnDif => '${humanColumnDif}'`);

    let nextRow = [];
    let nextColumn = [];
    let nextHexes = [];
    let finalHexes = [];

    if(humanRowDif == humanColumnDif) {
        if(DEBUG_MAP) console.log(`humanRowDif == humanColumnDif condition met`);

        if(rowDirection == 'bottom-top') {
            if(DEBUG_MAP) console.log(`rowDirection == 'bottom-top' condition met`);
            if(DEBUG_MAP) console.log(`startRow - 1 => '${startRow - 1}'`);
            nextRow.push(startRow - 1);
        } else if (rowDirection == 'top-bottom') {
            if(DEBUG_MAP) console.log(`rowDirection == 'top-bottom' condition met`);
            if(DEBUG_MAP) console.log(`startRow + 1 => '${startRow + 1}'`);
            nextRow.push(startRow + 1);
        }

        if(columnDirection == 'right-left') {
            if(DEBUG_MAP) console.log(`columnDirection == 'right-left' condition met`);
            if(DEBUG_MAP) console.log(`startColumn - 1 => '${startColumn - 1}'`);
            nextColumn.push(startColumn - 1);
        } else if (columnDirection == 'left-right') {
            if(DEBUG_MAP) console.log(`columnDirection == 'left-right' condition met`);
            if(DEBUG_MAP) console.log(`startColumn + 1 => '${startColumn + 1}'`);
            nextColumn.push(startColumn + 1);
        }
        
    } else if(humanRowDif == 0) {
        if(DEBUG_MAP) console.log(`humanRowDif == 0 condition met`);

        if(DEBUG_MAP) console.log(`startRow + 1 => '${startRow + 1}'`);
        if(DEBUG_MAP) console.log(`startRow - 1 => '${startRow - 1}'`);
        nextRow.push(startRow + 1);
        nextRow.push(startRow - 1);

        if(columnDirection == 'right-left') {
            if(DEBUG_MAP) console.log(`columnDirection == 'right-left' condition met`);
            if(DEBUG_MAP) console.log(`startColumn - 1 => '${startColumn - 1}'`);
            if(DEBUG_MAP) console.log(`startColumn - 1 => '${startColumn - 1}'`);
            nextColumn.push(startColumn - 1);
            nextColumn.push(startColumn - 1);
        } else if (columnDirection == 'left-right') {
            if(DEBUG_MAP) console.log(`columnDirection == 'left-right' condition met`);
            if(DEBUG_MAP) console.log(`startColumn + 1 => '${startColumn + 1}'`);
            if(DEBUG_MAP) console.log(`startColumn + 1 => '${startColumn + 1}'`);
            nextColumn.push(startColumn + 1);
            nextColumn.push(startColumn + 1);
        }

    } else if(humanColumnDif == 0) {
        if(DEBUG_MAP) console.log(`humanColumnDif == 0 condition met`);

        if(rowDirection == 'bottom-top') {
            if(DEBUG_MAP) console.log(`rowDirection == 'bottom-top' condition met`);
            if(DEBUG_MAP) console.log(`startRow - 2 => '${startRow - 2}'`);
            nextRow.push(startRow - 2);
        } else if (rowDirection == 'top-bottom') {
            if(DEBUG_MAP) console.log(`rowDirection == 'top-bottom' condition met`);
            if(DEBUG_MAP) console.log(`startRow + 2 => '${startRow + 2}'`);
            nextRow.push(startRow + 2);
        }

        nextColumn.push(startColumn);

    } else if(columnDirection == 'right-left') {
        if(DEBUG_MAP) console.log(`columnDirection == 'right-left' condition met`);

        if(humanRowDif == 1) {
            if(DEBUG_MAP) console.log(`humanRowDif == 1 condition met`);
            if(DEBUG_MAP) console.log(`startRow - 1 => '${startRow - 1}'`);
            if(DEBUG_MAP) console.log(`startColumn - 1 => '${startColumn - 1}'`);
            if(DEBUG_MAP) console.log(`startRow + 1 => '${startRow + 1}'`);
            if(DEBUG_MAP) console.log(`startColumn - 1 => '${startColumn - 1}'`);
            nextRow.push(startRow - 1);
            nextColumn.push(startColumn - 1);
            nextRow.push(startRow + 1);
            nextColumn.push(startColumn - 1);
        } else if(rowDirection == 'bottom-top') {
            if(DEBUG_MAP) console.log(`rowDirection == 'bottom-top' condition met`);
            if(DEBUG_MAP) console.log(`startRow - 1 => '${startRow - 1}'`);
            if(DEBUG_MAP) console.log(`startColumn - 1 => '${startColumn - 1}'`);
            if(DEBUG_MAP) console.log(`startRow - 2 => '${startRow - 2}'`);
            if(DEBUG_MAP) console.log(`startColumn => '${startColumn}'`);
            nextRow.push(startRow - 1);
            nextColumn.push(startColumn - 1);
            nextRow.push(startRow - 2);
            nextColumn.push(startColumn);
        } else if (rowDirection == 'top-bottom') {
            if(DEBUG_MAP) console.log(`rowDirection == 'top-bottom' condition met`);
            if(DEBUG_MAP) console.log(`startRow + 1 => '${startRow + 1}'`);
            if(DEBUG_MAP) console.log(`startColumn - 1 => '${startColumn - 1}'`);
            if(DEBUG_MAP) console.log(`startRow + 2 => '${startRow + 2}'`);
            if(DEBUG_MAP) console.log(`startColumn => '${startColumn}'`);
            nextRow.push(startRow + 1);
            nextColumn.push(startColumn - 1);
            nextRow.push(startRow + 2);
            nextColumn.push(startColumn);
        }

    } else if(columnDirection == 'left-right') {
        if(DEBUG_MAP) console.log(`columnDirection == 'left-right' condition met`);
        if(humanRowDif == 1) {
            if(DEBUG_MAP) console.log(`humanRowDif == 1 condition met`);
            if(DEBUG_MAP) console.log(`startRow - 1 => '${startRow - 1}'`);
            if(DEBUG_MAP) console.log(`startColumn + 1 => '${startColumn + 1}'`);
            if(DEBUG_MAP) console.log(`startRow + 1 => '${startRow + 1}'`);
            if(DEBUG_MAP) console.log(`startColumn + 1 => '${startColumn + 1}'`);
            nextRow.push(startRow - 1);
            nextColumn.push(startColumn + 1);
            nextRow.push(startRow + 1);
            nextColumn.push(startColumn + 1);
        } else if(rowDirection == 'bottom-top') {
            if(DEBUG_MAP) console.log(`rowDirection == 'bottom-top' condition met`);
            if(DEBUG_MAP) console.log(`startRow - 1 => '${startRow - 1}'`);
            if(DEBUG_MAP) console.log(`startColumn + 1 => '${startColumn + 1}'`);
            if(DEBUG_MAP) console.log(`startRow - 2 => '${startRow - 2}'`);
            if(DEBUG_MAP) console.log(`startColumn => '${startColumn}'`);
            nextRow.push(startRow - 1);
            nextColumn.push(startColumn + 1);
            nextRow.push(startRow - 2);
            nextColumn.push(startColumn);
        } else if (rowDirection == 'top-bottom') {
            if(DEBUG_MAP) console.log(`rowDirection == 'top-bottom' condition met`);
            if(DEBUG_MAP) console.log(`startRow + 1 => '${startRow + 1}'`);
            if(DEBUG_MAP) console.log(`startColumn + 1 => '${startColumn + 1}'`);
            if(DEBUG_MAP) console.log(`startRow + 2 => '${startRow + 2}'`);
            if(DEBUG_MAP) console.log(`startColumn => '${startColumn}'`);
            nextRow.push(startRow + 1);
            nextColumn.push(startColumn + 1);
            nextRow.push(startRow + 2);
            nextColumn.push(startColumn);
        }
    }

    if(DEBUG_MAP) console.log(`nextRow:`);
    if(DEBUG_MAP) console.log(nextRow);

    if(DEBUG_MAP) console.log(`nextColumn:`);
    if(DEBUG_MAP) console.log(nextColumn);

    for (let i = 0; i < nextRow.length; i++) {
        if($(`.row${nextRow[i]}.column${nextColumn[i]}`).length) {
            if(DEBUG_MAP) console.log(`$('.row${nextRow[i]}.column${nextColumn[i]}').length condition met`);
            let nextHexID = $(`.row${nextRow[i]}.column${nextColumn[i]}`).attr('id');
            if(DEBUG_MAP) console.log(`nextHexID => '${nextHexID}'`);
            let nextHexIDSplit = nextHexID.split('-');
            if(DEBUG_MAP) console.log(`nextHexIDSplit[1] => '${nextHexIDSplit[1]}'`);
            nextHexes.push(nextHexIDSplit[1]);
        }
    }

    if(DEBUG_MAP) console.log(`nextHexes:`);
    if(DEBUG_MAP) console.log(nextHexes);

    if(nextHexes.length == 1) {
        if(DEBUG_MAP) console.log(`nextHexes.length == 1 condition met`);
        if(DEBUG_MAP) console.log(`nextHexes[0] => '${nextHexes[0]}'`);
        if(checkIfValidHex(nextHexes[0])) {
            if(DEBUG_MAP) console.log(`checkIfValidHex(nextHexes[0]) condition met`);
            if(recordOfValidHexes.indexOf(nextHexes[0]) === -1) {
                if(DEBUG_MAP) console.log(`recordOfValidHexes.indexOf(nextHexes[0]) === -1 condition met`);
                finalHexes.push(nextHexes[0])
            } else {
                if(DEBUG_MAP) console.log(`recordOfValidHexes.indexOf(nextHexes[0]) !== -1 condition met`);
                if(DEBUG_MAP) console.log(`startHex => '${startHex}'`);
                if(DEBUG_MAP) console.log(`nextHexes[0] => '${nextHexes[0]}'`);
                var rotatedHexes = rotateToNextAvailableHex(startHex, nextHexes[0])
                for (let i = 0; i < rotatedHexes.length; i++) {
                    if(DEBUG_MAP) console.log(`rotatedHexes[i] => '${rotatedHexes[i]}'`);
                    if(rotatedHexes[i] != 'NA') {
                        if(DEBUG_MAP) console.log(`rotatedHexes[i] != 'NA' condition met`);
                        if(recordOfValidHexes.indexOf(rotatedHexes[i]) === -1) {
                            if(DEBUG_MAP) console.log(`recordOfValidHexes.indexOf(rotatedHexes[i]) === -1 condition met`);
                            finalHexes.push(rotatedHexes[i]);
                        }
                    }
                }
            }
        } else {

            if(DEBUG_MAP) console.log(`!checkIfValidHex(nextHexes[0]) condition met`);

            if(DEBUG_MAP) console.log(`startHex => '${startHex}'`);
            if(DEBUG_MAP) console.log(`nextHexes[0] => '${nextHexes[0]}'`);

            var rotatedHexes = rotateToNextAvailableHex(startHex, nextHexes[0]);

            for (let i = 0; i < rotatedHexes.length; i++) {
                if(rotatedHexes[i] != 'NA') {
                    if(DEBUG_MAP) console.log(`rotatedHexes[i] != 'NA' condition met`);
                    if(recordOfValidHexes.indexOf(rotatedHexes[i]) === -1) {
                        if(DEBUG_MAP) console.log(`recordOfValidHexes.indexOf(rotatedHexes[i]) === -1 condition met`);
                        finalHexes.push(rotatedHexes[i]);
                    }
                }
            }

            if(DEBUG_MAP) console.log(`finalHexes:`);
            if(DEBUG_MAP) console.log(finalHexes);

            if(finalHexes.length == 0) {
                if(DEBUG_MAP) console.log(`finalHexes.length == 0 condition met`);
                return ['NA'];
            }
        }
    } else if(nextHexes.length > 1) {
        if(DEBUG_MAP) console.log(`nextHexes.length > 1 condition met`);
        for (let j = 0; j < nextHexes.length; j++) {

            if(recordOfValidHexes.indexOf(parseInt(nextHexes[j])) === -1) {
                if(DEBUG_MAP) console.log(`recordOfValidHexes.indexOf(parseInt(nextHexes[j])) === -1 condition met`);
                if(DEBUG_MAP) console.log(`nextHexes[j] => '${nextHexes[j]}'`);
                if(checkIfValidHex(nextHexes[j])) {
                    if(DEBUG_MAP) console.log(`checkIfValidHex(nextHexes[j]) condition met`);
                    finalHexes.push(nextHexes[j])
                } else {
                    if(DEBUG_MAP) console.log(`!checkIfValidHex(nextHexes[j]) condition met`);
                    if(DEBUG_MAP) console.log(`startHex => '${startHex}'`);
                    if(DEBUG_MAP) console.log(`nextHexes[j] => '${nextHexes[j]}'`);
                    var rotatedHexes = rotateToNextAvailableHex(startHex, nextHexes[j])
                    for (let i = 0; i < rotatedHexes.length; i++) {
                        if(DEBUG_MAP) console.log(`rotatedHexes[i] => '${rotatedHexes[i]}'`);
                        if(rotatedHexes[i] != 'NA') {
                            if(DEBUG_MAP) console.log(`rotatedHexes[i] != 'NA' condition met`);
                            if(recordOfValidHexes.indexOf(rotatedHexes[i]) === -1) {
                                if(DEBUG_MAP) console.log(`recordOfValidHexes.indexOf(rotatedHexes[i]) === -1 condition met`);
                                finalHexes.push(rotatedHexes[i]);
                            }
                        }
                    }
                }
            }
        }

        if(DEBUG_MAP) console.log(`finalHexes:`);
        if(DEBUG_MAP) console.log(finalHexes);

        if(finalHexes.length == 0) {
            if(DEBUG_MAP) console.log(`finalHexes.length == 0 condition met`);
            for (let k = 0; k < nextHexes.length; k++) {
                if(recordOfValidHexes.indexOf(parseInt(nextHexes[k])) === -1) {

                    if(DEBUG_MAP) console.log(`recordOfValidHexes.indexOf(parseInt(nextHexes[k])) === -1 condition met`);

                    if(DEBUG_MAP) console.log(`startHex => '${startHex}'`);
                    if(DEBUG_MAP) console.log(`nextHexes[k] => '${nextHexes[k]}'`);

                    var rotatedHexes = rotateToNextAvailableHex(startHex, nextHexes[k]);

                    if(DEBUG_MAP) console.log(`rotatedHexes:`);
                    if(DEBUG_MAP) console.log(rotatedHexes);

                    for (let i = 0; i < rotatedHexes.length; i++) {
                        if(DEBUG_MAP) console.log(`rotatedHexes[i] => '${rotatedHexes[i]}'`);
                        if(rotatedHexes[i] != 'NA') {
                            if(DEBUG_MAP) console.log(`rotatedHexes[i] != 'NA' condition met`);
                            if(recordOfValidHexes.indexOf(rotatedHexes[i]) === -1) {
                                if(DEBUG_MAP) console.log(`recordOfValidHexes.indexOf(rotatedHexes[i]) === -1 condition met`);
                                finalHexes.push(rotatedHexes[i]);
                            }
                        }
                    }
                }
            }

            if(DEBUG_MAP) console.log(`finalHexes:`);
            if(DEBUG_MAP) console.log(finalHexes);

            if(finalHexes.length == 0) {
                if(DEBUG_MAP) console.log(`finalHexes.length == 0 condition met`);
                return ['NA'];
            }
        }
    }   

    if(DEBUG_MAP) console.log(`finalHexes:`);
    if(DEBUG_MAP) console.log(finalHexes);

    finalHexes = finalHexes.filter(onlyUnique);

    if(DEBUG_MAP) console.log(`finalHexes:`);
    if(DEBUG_MAP) console.log(finalHexes);

    return finalHexes;
}

function checkIfValidHex(hex) {

    if(DEBUG_MAP) console.log(`/-------------------------------------------/`);
    if(DEBUG_MAP) console.log(`checkIfValidHex() func triggered`);
    if(DEBUG_MAP) console.log(`hex => '${hex}'`);

    if(DEBUG_MAP) console.log(`game.map.tiles[hex]:`);
    if(DEBUG_MAP) console.log(game.map.tiles[hex]);

    if(game.map.tiles[hex].control == 'automa' || game.map.tiles[hex].control == 'human' && game.map.tiles[hex].twoOutposts == 'true') {
        if(DEBUG_MAP) console.log(`game.map.tiles[hex].control == '${game.map.tiles[hex].control}' && game.map.tiles[hex].twoOutposts == 'true' condition met`);
        return false;
    }
    return true;
}

var clockwiseCalls = 0;
var counterclockwiseCalls = 0;

function rotateToNextAvailableHex(originalHex, attemptHex) {

    if(DEBUG_MAP) console.log(`/-------------------------------------------/`);
    if(DEBUG_MAP) console.log(`rotateToNextAvailableHex() func triggered`);

    if(DEBUG_MAP) console.log(`originalHex => '${originalHex}'`);
    if(DEBUG_MAP) console.log(`attemptHex => '${attemptHex}'`);

    clockwiseCalls = 0
    counterclockwiseCalls = 0;

    var hexIndex = game.map.tiles[originalHex].nextTo.indexOf(parseInt(attemptHex));

    if(DEBUG_MAP) console.log(`hexIndex => '${hexIndex}'`);

    var rotatedHexes = [];

    var clockwiseHex = false;
    var clockwiseIndex = hexIndex;

    while(!clockwiseHex) {
        clockwiseCalls += 1;
        if (clockwiseCalls > 10) { debugger; }
        clockwiseIndex = rotateIndex(clockwiseIndex, 'clockwise')
        clockwiseHex = nextRotatedHex(originalHex, clockwiseIndex);
    }

    if(DEBUG_MAP) console.log(`clockwiseIndex => '${clockwiseIndex}'`);
    if(DEBUG_MAP) console.log(`clockwiseHex => '${clockwiseHex}'`);

    var counterclockwiseHex = false;
    var counterclockwiseIndex = hexIndex;

    while(!counterclockwiseHex) {
        counterclockwiseCalls += 1;
        if (counterclockwiseCalls > 10) { debugger; }
        counterclockwiseIndex = rotateIndex(counterclockwiseIndex, 'counterclockwise');
        counterclockwiseHex = nextRotatedHex(originalHex, counterclockwiseIndex);
    }

    if(DEBUG_MAP) console.log(`counterclockwiseIndex => '${counterclockwiseIndex}'`);
    if(DEBUG_MAP) console.log(`counterclockwiseHex => '${counterclockwiseHex}'`);

    return [clockwiseHex, counterclockwiseHex];
}

function nextRotatedHex(thisHex, index) {

    if(DEBUG_MAP) console.log(`/-------------------------------------------/`);
    if(DEBUG_MAP) console.log(`nextRotatedHex() func triggered`);

    if(DEBUG_MAP) console.log(`thisHex => '${thisHex}'`);
    if(DEBUG_MAP) console.log(`index => '${index}'`);

    var suggestedHex = game.map.tiles[thisHex].nextTo[index];

    if(DEBUG_MAP) console.log(`suggestedHex => '${suggestedHex}'`);

    if(suggestedHex != 'NA') {
        if(DEBUG_MAP) console.log(`suggestedHex != 'NA' condition met`);
        if(checkIfValidHex(suggestedHex)) {
            if(DEBUG_MAP) console.log(`checkIfValidHex(suggestedHex) condition met`);
            return suggestedHex;
        } else {
            if(DEBUG_MAP) console.log(`!checkIfValidHex(suggestedHex) condition met`);
            return false;
        }
    } else {
        if(DEBUG_MAP) console.log(`suggestedHex == 'NA' condition met`);
        return 'NA';
    }
}

function rotateIndex(index, rotation) {

    if(DEBUG_MAP) console.log(`/-------------------------------------------/`);
    if(DEBUG_MAP) console.log(`rotateIndex() func triggered`);
    if(DEBUG_MAP) console.log(`index => '${index}'`);
    if(DEBUG_MAP) console.log(`rotation => '${rotation}'`);

    if(rotation == 'clockwise') {
        if(DEBUG_MAP) console.log(`rotation == 'clockwise' condition met`);
        if(index == 0) {
            if(DEBUG_MAP) console.log(`index == 0 condition met`);
            return 5;
        } else {
            if(DEBUG_MAP) console.log(`index != 0 condition met`);
            if(DEBUG_MAP) console.log(`index - 1 => '${index - 1}'`);
            return index - 1;
        }
    } else if(rotation == 'counterclockwise') {
        if(DEBUG_MAP) console.log(`rotation == 'counterclockwise' condition met`);
        if(index == 5) {
            if(DEBUG_MAP) console.log(`index == 5 condition met`);
            return 0;
        } else {
            if(DEBUG_MAP) console.log(`index != 5 condition met`);
            if(DEBUG_MAP) console.log(`index + 1 => '${index + 1}'`);
            return index + 1;
        }
    }
}

function applyMapTiebreaker(hexes) {

    if(DEBUG_TIE_BREAKER) console.log(`hexes:`);
    if(DEBUG_TIE_BREAKER) console.log(hexes);

    if(DEBUG_TIE_BREAKER) console.log(`/-------------------------------------------/`);
    if(DEBUG_TIE_BREAKER) console.log(`applyMapTiebreaker() func triggered`);

    if(DEBUG_TIE_BREAKER) console.log(`parseInt(game.firstCardInfo.mapTiebreaker) - 1 => '${parseInt(game.firstCardInfo.mapTiebreaker) - 1}'`);

    var tiebreakerIndex = parseInt(game.firstCardInfo.mapTiebreaker) - 1;
    var hexesIndex = [];

    if(DEBUG_TIE_BREAKER) console.log(`tiebreakerIndex => '${tiebreakerIndex}'`);

    for (let i = 0; i < hexes.length; i++) {
        tiebreaker_loop:
        for (let j = 0; j < game.map.tiebreakers[tiebreakerIndex].length; j++) {
            if(DEBUG_TIE_BREAKER) console.log(`hexes[i] => '${hexes[i]}'`);
            if(game.map.tiebreakers[tiebreakerIndex][j] == hexes[i]) {
                if(DEBUG_TIE_BREAKER) console.log(`game.map.tiebreakers[tiebreakerIndex][j] == hexes[i] condition met`);
                if(DEBUG_TIE_BREAKER) console.log(`game.map.tiebreakers[tiebreakerIndex][j] => '${game.map.tiebreakers[tiebreakerIndex][j]}'`);
                hexesIndex.push(j);
                break tiebreaker_loop;
            }
        }
    }

    if(DEBUG_TIE_BREAKER) console.log(`hexesIndex:`);
    if(DEBUG_TIE_BREAKER) console.log(hexesIndex);

    var firstTiebreaker = Math.min.apply(Math, hexesIndex);
    if(DEBUG_TIE_BREAKER) console.log(`firstTiebreaker => '${firstTiebreaker}'`);

    var firstTiebreakerIndex = hexesIndex.indexOf(firstTiebreaker);
    if(DEBUG_TIE_BREAKER) console.log(`firstTiebreakerIndex => '${firstTiebreakerIndex}'`);

    lockInTile(hexes[firstTiebreakerIndex]);
}

function applyMiddleIslandTiebreaker(hexes, mode) {

    if(DEBUG_MAP) console.log(`/-------------------------------------------/`);
    if(DEBUG_MAP) console.log(`applyMiddleIslandTiebreaker() func triggered`);
    
    if(DEBUG_MAP) console.log(`hexes:`);
    if(DEBUG_MAP) console.log(hexes);

    if(DEBUG_MAP) console.log(`mode => '${mode}'`);

    var middleIslandHexes = [];

    middleIslandHexes_loop:
    for (let j = 0; j < game.map.tiles[16].neighbours.length; j++) {
        for (let i = 0; i < hexes.length; i++) {
            if(game.map.tiles[16].neighbours[j].indexOf(hexes[i]) !== -1) {
                if(DEBUG_MAP) console.log(`game.map.tiles[16].neighbours[j].indexOf(hexes[i]) !== -1 condition met`);
                if(DEBUG_MAP) console.log(`hexes[i] => '${hexes[i]}'`);
                middleIslandHexes.push(hexes[i]);
            }
        }

        if(DEBUG_MAP) console.log(`middleIslandHexes:`);
        if(DEBUG_MAP) console.log(middleIslandHexes);

        if(middleIslandHexes.length > 0) {
            if(DEBUG_MAP) console.log(`middleIslandHexes.length > 0 condition met`);
            break middleIslandHexes_loop;
        }
    }

    if(DEBUG_MAP) console.log(`mode => '${mode}'`);

    if(mode == 'explore') {
        if(DEBUG_MAP) console.log(`mode == 'explore' condition met`);
        if(middleIslandHexes.length == 1) {
            if(DEBUG_MAP) console.log(`middleIslandHexes.length == 1 condition met`);
            if(DEBUG_MAP) console.log(`middleIslandHexes[0] => '${middleIslandHexes[0]}'`);
            lockInTile(middleIslandHexes[0]);
        } else if(middleIslandHexes.length > 1) {
            if(DEBUG_MAP) console.log(`middleIslandHexes.length > 1 condition met`);
            if(DEBUG_MAP) console.log(`middleIslandHexes:`);
            if(DEBUG_MAP) console.log(middleIslandHexes);
            applyMapTiebreaker(middleIslandHexes)
        }
    } else if(mode == 'conquer') {
        if(DEBUG_MAP) console.log(`mode == 'conquer' condition met`);
        if(DEBUG_MAP) console.log(`middleIslandHexes:`);
        if(DEBUG_MAP) console.log(middleIslandHexes);
        return middleIslandHexes;
    }
}

function compareExploreHexDistances(automaHexes, humanHexes, humanObj, mode) {

    if(DEBUG_MAP) console.log(`/-------------------------------------------/`);
    if(DEBUG_MAP) console.log(`compareExploreHexDistances() func triggered`);

    if(DEBUG_MAP) console.log(`automaHexes:`);
    if(DEBUG_MAP) console.log(automaHexes);

    if(DEBUG_MAP) console.log(`humanHexes:`);
    if(DEBUG_MAP) console.log(humanHexes);

    if(DEBUG_MAP) console.log(`humanObj => '${humanObj}'`);
    if(DEBUG_MAP) console.log(`mode => '${mode}'`);

    var selectedHexes = [];
    var finalHexes = [];
    var automaHexIndexes = [];
    
    for (let i = 0; i < automaHexes.length; i++) {
        if(DEBUG_MAP) console.log(`automaHexes[i] => '${automaHexes[i]}'`);
        for (let j = 0; j < humanHexes.length; j++) {
            if(DEBUG_MAP) console.log(`parseInt(humanHexes[j]) => '${parseInt(humanHexes[j])}'`);
            if(automaHexes[i] == parseInt(humanHexes[j])) {
                if(DEBUG_MAP) console.log(`automaHexes[i] == parseInt(humanHexes[j]) condition met`);
                humanObj[humanHexes[j]].push(0)
            } else {
                if(DEBUG_MAP) console.log(`automaHexes[i] != parseInt(humanHexes[j]) condition met`);
                for (let k = 0; k < game.map.tiles[humanHexes[j]].neighbours.length; k++) {
                    if(game.map.tiles[humanHexes[j]].neighbours[k].indexOf(automaHexes[i]) !== -1) {
                        if(DEBUG_MAP) console.log(`game.map.tiles[humanHexes[j]].neighbours[k].indexOf(automaHexes[i]) !== - condition met`);
                        if(DEBUG_MAP) console.log(`k + 1 => '${k + 1}'`);
                        humanObj[humanHexes[j]].push(k + 1);
                    }
                }
            }
        }
    }

    if(DEBUG_MAP) console.log(`mode => '${mode}'`);

    if(mode == 'furtherest') {
        if(DEBUG_MAP) console.log(`mode == 'furtherest' condition met`);
        var highestDistance = [];
        var highestDistance = [];

        for(var hexDistances in humanObj) {
            if(humanObj.hasOwnProperty(hexDistances)) {
                if(DEBUG_MAP) console.log(`hexDistances => '${hexDistances}'`);
                if(DEBUG_MAP) console.log(`humanObj[hexDistances] => '${humanObj[hexDistances]}'`);
                let currentArray = humanObj[hexDistances];
                let largestNum = Math.max.apply(Math, humanObj[hexDistances]);
                if(DEBUG_MAP) console.log(`largestNum => '${largestNum}'`);
                highestDistance.push(largestNum);
            }
        }

        if(DEBUG_MAP) console.log(`highestDistance:`);
        if(DEBUG_MAP) console.log(highestDistance);
        
        let smallestLargestDistance = Math.min.apply(Math, highestDistance);

        if(DEBUG_MAP) console.log(`smallestLargestDistance => '${smallestLargestDistance}'`);

        for(var hex in humanObj) {
            if(humanObj.hasOwnProperty(hex)) {
                if(DEBUG_MAP) console.log(`hex => '${hex}'`);
                if(DEBUG_MAP) console.log(`humanObj[hexDistances] => '${humanObj[hexDistances]}'`);
                if(smallestLargestDistance == Math.max.apply(Math, humanObj[hex])) {
                    if(DEBUG_MAP) console.log(`smallestLargestDistance == Math.max.apply(Math, humanObj[hex]) condition met`);
                    for (let i = 0; i < humanObj[hex].length; i++) {
                        if(humanObj[hex][i] == smallestLargestDistance) {
                            if(DEBUG_MAP) console.log(`humanObj[hex][i] == smallestLargestDistance condition met`);
                            selectedHexes.push(automaHexes[i]);
                        }
                    }
                }
            }
        }
    }

    if(DEBUG_MAP) console.log(`selectedHexes:`);
    if(DEBUG_MAP) console.log(selectedHexes);

    var finalHexesHumanDistances = [];

    for (let j = 0; j < selectedHexes.length; j++) {

        outer_loop:
        for (let k = 0; k < game.map.tiles[selectedHexes[j]].neighbours.length; k++) {
            
            for (let l = 0; l < game.map.tiles[selectedHexes[j]].neighbours[k].length; l++) {
                
                if(game.map.tiles[game.map.tiles[selectedHexes[j]].neighbours[k][l]].control == 'human') {
                    if(DEBUG_MAP) console.log(`game.map.tiles[game.map.tiles[selectedHexes[j]].neighbours[k][l]].control == 'human' condition met`);
                    finalHexesHumanDistances[j] = k + 1;
                    break outer_loop;
                }
            }
        }
    }

    var finalLargestDistance = Math.max.apply(Math, finalHexesHumanDistances);

    if(DEBUG_MAP) console.log(`finalLargestDistance => '${finalLargestDistance}'`);

    if(DEBUG_MAP) console.log(`finalLargestDistance:`);
    if(DEBUG_MAP) console.log(finalLargestDistance);

    for (let m = 0; m < finalHexesHumanDistances.length; m++) {
        if(finalHexesHumanDistances[m] == finalLargestDistance) {
            if(DEBUG_MAP) console.log(`finalHexesHumanDistances[m] == finalLargestDistance condition met`);
            if(DEBUG_MAP) console.log(`selectedHexes[m] => '${selectedHexes[m]}'`);
            finalHexes.push(selectedHexes[m]);
        }
    }
    return finalHexes;
}


function compareConquerHexDistances(automaHexes, humanHexes) {

    if(DEBUG_MAP) console.log(`/-------------------------------------------/`);
    if(DEBUG_MAP) console.log(`compareConquerHexDistances() func triggered`);

    if(DEBUG_MAP) console.log(`automaHexes:`);
    if(DEBUG_MAP) console.log(automaHexes);

    if(DEBUG_MAP) console.log(`humanHexes:`);
    if(DEBUG_MAP) console.log(humanHexes);
    

    var automaExpandHex = [];
    var automaExpandLowestDistance = [];

    var thisAutomaMatch = [];
    var thisOutpost;

    for (let i = 0; i < humanHexes.length; i++) {
        thisOutpost = parseInt(humanHexes[i]);
        if(DEBUG_MAP) console.log(`thisOutpost => '${thisOutpost}'`);
        thisAutomaMatch = [];

        human_neighbours_loop:
        for (let j = 0; j < game.map.tiles[thisOutpost].neighbours.length; j++) {
            var thisOutpostNeighbours = game.map.tiles[parseInt(thisOutpost)].neighbours[j];

            for (let k = 0; k < automaHexes.length; k++) {
                if(thisOutpostNeighbours.indexOf(automaHexes[k]) !== -1) {
                    if(DEBUG_MAP) console.log(`thisOutpostNeighbours.indexOf(automaHexes[k]) !== -1 condition met`);
                    thisAutomaMatch.push(k);
                    if(DEBUG_MAP) console.log(`automaHexes[k] => '${automaHexes[k]}'`);
                    if(automaExpandHex.indexOf(automaHexes[k]) !== -1) {
                        if(DEBUG_MAP) console.log(`automaExpandHex.indexOf(automaHexes[k]) !== -1 condition met`);
                        if(DEBUG_MAP) console.log(`automaHexes[k] => '${automaHexes[k]}'`);
                        var thisHexIndex = automaExpandHex.indexOf(automaHexes[k]);
                        if(DEBUG_MAP) console.log(`thisHexIndex => '${thisHexIndex}'`);
                        if(DEBUG_MAP) console.log(`automaExpandLowestDistance[thisHexIndex] => '${automaExpandLowestDistance[thisHexIndex]}'`);
                        if(DEBUG_MAP) console.log(`j => '${j}'`);
                        if(j < automaExpandLowestDistance[thisHexIndex]) {
                            if(DEBUG_MAP) console.log(`j < automaExpandLowestDistance[thisHexIndex] condition met`);
                            if(DEBUG_MAP) console.log(`j + 1 => '${j + 1}'`);
                            automaExpandLowestDistance[thisHexIndex] = j + 1;
                        }
                    } else {
                        if(DEBUG_MAP) console.log(`j >= automaExpandLowestDistance[thisHexIndex] condition met`);
                        automaExpandHex.push(automaHexes[k])
                        automaExpandLowestDistance.push(j + 1)
                    }
                }
            }

            if(DEBUG_MAP) console.log(`thisAutomaMatch:`);
            if(DEBUG_MAP) console.log(thisAutomaMatch);

            if(thisAutomaMatch.length > 0) {
                if(DEBUG_MAP) console.log(`thisAutomaMatch.length > 0 condition met`);
                break human_neighbours_loop;
            }
        }
    }

    var shortestHexDistance = Math.min.apply(Math, automaExpandLowestDistance);
    if(DEBUG_MAP) console.log(`shortestHexDistance => '${shortestHexDistance}'`);

    var finalConquerHexes = [];

    for (let l = 0; l < automaExpandLowestDistance.length; l++) {
        if(DEBUG_MAP) console.log(`automaExpandLowestDistance[l] => '${automaExpandLowestDistance[l]}'`);
        if(automaExpandLowestDistance[l] == shortestHexDistance){
            if(DEBUG_MAP) console.log(`automaExpandLowestDistance[l] == shortestHexDistance condition met`);
            if(DEBUG_MAP) console.log(`automaExpandHex[l] => '${automaExpandHex[l]}'`);
            finalConquerHexes.push(automaExpandHex[l]);
        }
    }

    if(DEBUG_MAP) console.log(`finalConquerHexes:`);
    if(DEBUG_MAP) console.log(finalConquerHexes);

    return finalConquerHexes;
}

function showMapInstructions() {

    if(DEBUG_MAP) console.log(`/-------------------------------------------/`);
    if(DEBUG_MAP) console.log(`showMapInstructions() func triggered`);
    if(DEBUG_MAP) console.log(`thisMapMode => '${thisMapMode}'`);

    if(DEBUG_MAP) console.log(`game.firstCardInfo:`);
    if(DEBUG_MAP) console.log(game.firstCardInfo);

    if(DEBUG_MAP) console.log(`game.secondCardInfo:`);
    if(DEBUG_MAP) console.log(game.secondCardInfo);

    let toppleIcon = ``;
    if(game.firstCardInfo.topple == 'false') toppleIcon = 'None';

    console.log(`toppleIcon => "${toppleIcon}"`)

    var showMapInstructionsHTML = `
        <div class="confirmationBox alertEl showMapInstructionsBox">
            <h2>Current Move Details</h2>
    `;

    if(thisMapMode == 'explore') {
        if(DEBUG_MAP) console.log(`thisMapMode == 'explore' condition met`);

        showMapInstructionsHTML += `
            <div id="currentExploreMapMoveSummary">
                <p style="text-align:center;" class="italic"><span class="bold">Current action:</span> <a class="helpLink helpLink-explore" href="#">Explore</a></p>
                <img class="mapExploreTiebreakerImg" src="img/mapTiebreaker/${game.firstCardInfo.mapTiebreaker}.png" />
                <div class="exploreMapSummaryFavTrack">
                    <img class="favTrackImg" src="img/automaFavTrack.png"><p class="bold"> = </p><img class="favTrackIconImg" src="img/tracks/${uncapitalizeFirstLetter(game.automaInfo.favTrack)}Icon.png" />
                </div>
        `;

    } else if(thisMapMode == 'placeToppledSE') {
        if(DEBUG_MAP) console.log(`thisMapMode == 'placeToppledSE' condition met`);

        showMapInstructionsHTML += `
            <div id="currentExploreMapMoveSummary">
                <p style="text-align:center;" class="italic"><span class="bold">Current action:</span> Place Toppled Shadow Empire outpost on hex with 1 Automa outpost</p>
                <img class="toppledSETiebreakerImg" src="img/mapTiebreaker/${game.firstCardInfo.mapTiebreaker}.png" />
        `;

    } else if (thisMapMode == 'conquer') {

        if(DEBUG_MAP) console.log(`thisMapMode == 'conquer' condition met`);

        showMapInstructionsHTML += `
            <div id="currentConquerMapMoveSummary">
                <p style="text-align:center;" class="italic"><span class="bold">Current action:</span> <a class="helpLink helpLink-conquer" href="#">Conquer</a></p>
                <img class="mapConquerTiebreakerImg" src="img/mapTiebreaker/${game.firstCardInfo.mapTiebreaker}.png" />
                <img class="mapConquerToppleImg" src="img/topple${toppleIcon}.png" />
        `;

    } else if (thisMapMode == 'conquerAnywhere') {

        if(DEBUG_MAP) console.log(`thisMapMode == 'conquerAnywhere' condition met`);

        showMapInstructionsHTML += `
            <div id="currentConquerAnywhereMapMoveSummary">
                <p style="text-align:center;" class="italic"><span class="bold">Current action:</span> <a class="helpLink helpLink-conquer" href="#">Conquer Anywhere</a></p>
                <img class="mapConquerTiebreakerImg" src="img/mapTiebreaker/${game.firstCardInfo.mapTiebreaker}.png" />
                <img class="mapConquerToppleImg" src="img/topple${toppleIcon}.png" />
        `;

    }

    showMapInstructionsHTML += `
                <div class="clearDiv"></div>
            </div>
            <div class="buttons" btns="1">
                <a href="#" id="cancel" class="btn redBtn">Close</a>
            </div>
        </div>
    `;

	$(showMapInstructionsHTML).appendTo('body');
	$('.confirmationBox.showMapInstructionsBox').fadeIn();
    $('#resetOverlay').fadeIn();

	deactivateMenu();
}