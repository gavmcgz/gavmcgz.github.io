var thisMove = '';

var firstCard = 'true';
// var incomeTurn = 'false';

var incomeTurn = 'false';

var endOfTrackAchievement = [];

function initActionArea(){
    if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
    if(DEBUG_GAME) console.log(`tapestry.js => initActionArea() func triggered`);
    if(DEBUG_GAME) console.log(`game.lastOpponent => '${game.lastOpponent}'`);
    if(game.lastOpponent == 'shadowEmpire') {
        if(DEBUG_GAME) console.log(`game.lastOpponent == 'shadowEmpire' condition met`);
        var actionTemplateHTML = `<div class="tapestryActionContainer shadowEmpireAutomated"></div>`;

        $(actionTemplateHTML).appendTo('#cardArea');
        $('#roundMarkerTable1').css('display', 'none');
    
    } else if(game.lastOpponent == 'automaShadowEmpire') {
        if(DEBUG_GAME) console.log(`game.lastOpponent == 'automaShadowEmpire' condition met`);
        var actionTemplate = `<div class="tapestryActionContainer"></div>`;
    
        $(actionTemplate).appendTo('#cardArea');

        if(DEBUG_GAME) console.log(`game.difficultyLevelNum => '${game.difficultyLevelNum}'`);
        
        for (let i = 0; i < game.difficultySpecs.incomeTurnSteps.length; i++) {
            console.log(`game.difficultySpecs.incomeTurnSteps[i].action => '${game.difficultySpecs.incomeTurnSteps[i].action}'`);
            if(game.difficultySpecs.incomeTurnSteps[i].action == 'civBonus') {
                if(DEBUG_GAME) console.log(`game.difficultySpecs.incomeTurnSteps[i].action == 'civBonus' condition met`);
                game.difficultySpecs.incomeTurnSteps[i].eras = [];
                game.difficultySpecs.incomeTurnSteps[i].eras = game.automaInfo.firstCivSpecs.allIncomeTurns.slice();
                game.difficultySpecs.incomeTurnSteps[i].actionRequired = game.automaInfo.firstCivSpecs.actionRequired;
            }
        }

        if(game.difficultyLevelNum == "5") {
            if(DEBUG_GAME) console.log(`game.difficultyLevelNum == "5" condition met`);
            for (let i = 0; i < game.difficultySpecs.incomeTurnSteps.length; i++) {
                console.log(`game.difficultySpecs.incomeTurnSteps[i].action => '${game.difficultySpecs.incomeTurnSteps[i].action}'`);
                if(game.difficultySpecs.incomeTurnSteps[i].action == 'dualCivBonus') {
                    if(DEBUG_GAME) console.log(`game.difficultySpecs.incomeTurnSteps[i].action == 'dualCivBonus' condition met`);
                    game.difficultySpecs.incomeTurnSteps[i].eras = [];
                    game.difficultySpecs.incomeTurnSteps[i].eras = game.automaInfo.secondCivSpecs.allIncomeTurns.slice();
                    game.difficultySpecs.incomeTurnSteps[i].actionRequired = game.automaInfo.secondCivSpecs.actionRequired;
                }
            }
        }
    }

    var landmarkLayer = `
        <div id="landmarksLayer" class="layer">
            <div id="landmarksTitleAndButton">
                <h2>Landmarks</h2>
                <p class="mobileLandmarkInstruction">Click on a track icon to show the associated Landmarks, and then click on a landmark to take it / put it back.</p>
                <p class="tabletDesktopLandmarkInstruction">Click on a Landmark to take it / put it back.</p>
                <div id="landmarkKey">
                    <p class="landmarkKeyHuman">Human Landmark</p>
                    <p class="landmarkKeyAutoma">Automa Landmark</p>
                    <div class="clearDiv"></div>
                </div>
                <div class="buttons">
                    <a href="#" class="btn redBtn func-showLayer-game">Back</a>
                </div>
            </div>
            <div id="mobileLandmarkSelector">
                <div class="landmarkIconContainer activeLandmarkIcon landmarkCategory-technology"></div>
                <div class="landmarkIconContainer inactiveLandmarkIcon landmarkCategory-military"></div>
                <div class="landmarkIconContainer inactiveLandmarkIcon landmarkCategory-exploration"></div>
                <div class="landmarkIconContainer inactiveLandmarkIcon landmarkCategory-science"></div>
                ${aaExp ? `     
                    <div class="landmarkIconContainer inactiveLandmarkIcon landmarkCategory-arts"></div>
                ` : ``}
            </div>
            <div id="landmarkContainer">
            </div>
        </div>
    `;

    $(landmarkLayer).appendTo('#container');
}

$(document).on(touchEvent, '#landmarksLayer #mobileLandmarkSelector .landmarkIconContainer.inactiveLandmarkIcon', function() {

    if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
    if(DEBUG_GAME) console.log(`#landmarksLayer #mobileLandmarkSelector .landmarkIconContainer.inactiveLandmarkIcon touchevent triggered`);

    $('.activeLandmarkIcon').addClass('inactiveLandmarkIcon').removeClass('activeLandmarkIcon');
    $(this).removeClass('inactiveLandmarkIcon').addClass('activeLandmarkIcon');
    var thisTrack = classProcessor($(this), 'landmarkCategory', 'split');

    if(DEBUG_GAME) console.log(`thisTrack[1] => '${thisTrack[1]}'`);

    $('.landmarkTrackContainer').css('display', 'none');
    $(`#${thisTrack[1]}Landmarks`).css('display', 'block');
})

function updateLandmarks() {

    if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
    if(DEBUG_GAME) console.log(`updateLandmarks() func triggered`);

    $('.activeLandmarkIcon').addClass('inactiveLandmarkIcon').removeClass('activeLandmarkIcon');
    $('#landmarksLayer #mobileLandmarkSelector .landmarkIconContainer:first-child').removeClass('inactiveLandmarkIcon').addClass('activeLandmarkIcon');

    $('#landmarkContainer').html('');
    var landmarksHTML = '';

    for (let i = 0; i < game.landmarks.length; i++) {

        if(!aaExp && game.landmarks[i].track == 'arts') continue;

        landmarksHTML += `
            <div id="${game.landmarks[i].track}Landmarks" class="landmarkTrackContainer">
                <img class="landmarkTrackIcon ${game.landmarks[i].track}LandmarkTrackIcon" src="img/tracks/${game.landmarks[i].track}Icon.png" />
        `;

        for (let j = 0; j < game.landmarks[i].details.length; j++) {

            landmarksHTML += `
                <div class="landmark ${game.landmarks[i].details[j].buildingClass}-landmark">
            `;

            if(game.landmarks[i].details[j].available == 'true') {
                if(DEBUG_GAME) console.log(`game.landmarks[i].details[j].available == 'true' condition met`);
                landmarksHTML += `
                    <img id="${game.landmarks[i].details[j].buildingClass}" class="${game.landmarks[i].details[j].buildingClass}Image ${game.landmarks[i].details[j].buildingHeight}Building availableLandmark" src="img/sculpts/${game.landmarks[i].details[j].imageName}.png" />
                `;

            }

            console.log(`game.landmarks[i].details[j].buildingClass => '${game.landmarks[i].details[j].buildingClass}'`);
            
            if(game.automaInfo.landmarks.indexOf(game.landmarks[i].details[j].buildingClass) !== -1) {
                if(DEBUG_GAME) console.log(`game.automaInfo.landmarks.indexOf(game.landmarks[i].details[j].buildingClass) !== -1 condition met`);
                landmarksHTML += `
                    <img id="${game.landmarks[i].details[j].buildingClass}--unavailable" class="${game.landmarks[i].details[j].buildingClass}Image ${game.landmarks[i].details[j].buildingHeight}Building unavailableLandmark" src="img/sculpts/${game.landmarks[i].details[j].imageName}-inactive-automa.png" />
                `;

            } else {
                if(DEBUG_GAME) console.log(`game.automaInfo.landmarks.indexOf(game.landmarks[i].details[j].buildingClass) === -1 (DOES NOT EXIST) condition met`);
                landmarksHTML += `
                    <img id="${game.landmarks[i].details[j].buildingClass}--unavailable" class="${game.landmarks[i].details[j].buildingClass}Image ${game.landmarks[i].details[j].buildingHeight}Building unavailableLandmark" src="img/sculpts/${game.landmarks[i].details[j].imageName}-inactive-human.png" />
                `;

            }

            landmarksHTML += `</div>`;
        }

        landmarksHTML += `
            <div class="clearDiv"></div>
            </div>
        `;
    }

    landmarksHTML += `<div class="clearDiv"></div>`;

    $(landmarksHTML).appendTo('#landmarkContainer');
}

$(document).on(touchEvent, '#landmarkContainer .landmarkTrackContainer .landmark .availableLandmark', function() {
    if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
    if(DEBUG_GAME) console.log(`#landmarkContainer .landmarkTrackContainer .landmark .availableLandmark touchevent triggered`);

    var targLandmark = $(this).attr('id');
    var currentTrack = targLandmark.split('-');

    var landmarkDets;

    if(DEBUG_GAME) console.log(`currentTrack[0] => '${currentTrack[0]}'`);
    if(DEBUG_GAME) console.log(`targLandmark => '${targLandmark}'`);

    for (let i = 0; i < game.landmarks.length; i++) {
        if(DEBUG_GAME) console.log(`game.landmarks[i].track => '${game.landmarks[i].track}'`);
        if(game.landmarks[i].track == currentTrack[0]) {
            if(DEBUG_GAME) console.log(`match detected! ('${game.landmarks[i].track}')`);
            for (let j = 0; j < game.landmarks[i].details.length; j++) {
                if(DEBUG_GAME) console.log(`game.landmarks[i].details[j].buildingClass => '${game.landmarks[i].details[j].buildingClass}'`);
                if(game.landmarks[i].details[j].buildingClass == targLandmark) {
                    if(DEBUG_GAME) console.log(`match detected! ('${game.landmarks[i].details[j].buildingClass}')`);
                    landmarkDets = JSON.parse(JSON.stringify(game.landmarks[i].details[j]));
                    break;
                }
            }
            break;
        }
    }

    if(DEBUG_GAME) console.log(`landmarkDets.buildingName => '${landmarkDets.buildingName}'`);
    if(DEBUG_GAME) console.log(`landmarkDets.buildingHeight => '${landmarkDets.buildingHeight}'`);
    if(DEBUG_GAME) console.log(`landmarkDets.imageName => '${landmarkDets.imageName}'`);
    if(DEBUG_GAME) console.log(`landmarkDets.buttonClass => '${landmarkDets.buttonClass}'`);
    if(DEBUG_GAME) console.log(`currentTrack[0] => '${currentTrack[0]}'`);

	var takeLandmarkConfirmationHTML = `
        <div class="confirmationBox alertEl takeLandmarkConfirmationBox">
            <p>Are you sure you want to take the <span class="bold">${landmarkDets.buildingName}</span> Landmark?</p>
            <img class="${landmarkDets.buildingHeight}Building" src="img/sculpts/${landmarkDets.imageName}.png" />
            <div class="buttons" btns="2">
                <a href="#" id="cancel" class="btn redBtn">Cancel</a>
                <a href="#" class="btn greenBtn func-confirmTakeLandmark-${landmarkDets.buttonClass}+${currentTrack[0]}">Confirm</a>
            </div>
        </div>
    `;

	$(takeLandmarkConfirmationHTML).appendTo('body');
	$('.confirmationBox.shadowEmpireActionType').fadeIn();
    $('#resetOverlay').fadeIn();
    deactivateMenu();

})

function confirmTakeLandmark(thisLandmark, thisTrack) {
    if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
    if(DEBUG_GAME) console.log(`confirmTakeLandmark() func triggered`);
    if(DEBUG_GAME) console.log(`thisLandmark => '${thisLandmark}'`);
    if(DEBUG_GAME) console.log(`thisTrack => '${thisTrack}'`);

    var thisLandmarkID = '';
    var thisLandmarkImg = '';

    for (let i = 0; i < game.landmarks.length; i++) {
        if(game.landmarks[i].track == thisTrack) {
            for (let j = 0; j < game.landmarks[i].details.length; j++) {
                if(DEBUG_GAME) console.log(`game.landmarks[i].details[j].buttonClass => '${game.landmarks[i].details[j].buttonClass}'`);
                if(game.landmarks[i].details[j].buttonClass == thisLandmark) {
                    if(DEBUG_GAME) console.log(`match detected! ('${game.landmarks[i].details[j].buttonClass}')`);
                    game.landmarks[i].details[j].available = 'false';
                    thisLandmarkID = game.landmarks[i].details[j].buildingClass;
                    thisLandmarkImg = game.landmarks[i].details[j].imageName;
                    break;
                }
            }
            break;
        }
    }

    if(DEBUG_GAME) console.log(`thisLandmarkID => '${thisLandmarkID}'`);
    if(DEBUG_GAME) console.log(`thisLandmarkImg => '${thisLandmarkImg}'`);

    $(`#landmarksLayer #landmarkContainer #${thisLandmarkID}`).addClass('takenlandmark');
    setTimeout(function(){
        $(`#landmarksLayer #landmarkContainer #${thisLandmarkID}`).remove();
    }, 2000)

}

$(document).on(touchEvent, '#landmarkContainer .landmarkTrackContainer .landmark .unavailableLandmark', function() {

    if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
    if(DEBUG_GAME) console.log(`#landmarkContainer .landmarkTrackContainer .landmark .unavailableLandmark touchevent triggered`);

    var targLandmark = $(this).attr('id');
    var currentTrack = targLandmark.split('-');
    var finalTargLandmark = targLandmark.split('--');

    if(DEBUG_GAME) console.log(`finalTargLandmark[0] => '${finalTargLandmark[0]}'`);

    var landmarkDets;

    for (let i = 0; i < game.landmarks.length; i++) {
        if(game.landmarks[i].track == currentTrack[0]) {
            for (let j = 0; j < game.landmarks[i].details.length; j++) {
                if(DEBUG_GAME) console.log(`game.landmarks[i].details[j].buildingClass => '${game.landmarks[i].details[j].buildingClass}'`);
                if(game.landmarks[i].details[j].buildingClass == finalTargLandmark[0]) {
                    if(DEBUG_GAME) console.log(`match detected! ('${game.landmarks[i].details[j].buildingClass}')`);
                    landmarkDets = JSON.parse(JSON.stringify(game.landmarks[i].details[j]));
                    break;
                }
            }
            break;
        }
    }

    if(DEBUG_GAME) console.log(`landmarkDets.buildingName => '${landmarkDets.buildingName}'`);
    if(DEBUG_GAME) console.log(`landmarkDets.buildingHeight => '${landmarkDets.buildingHeight}'`);
    if(DEBUG_GAME) console.log(`landmarkDets.imageName => '${landmarkDets.imageName}'`);
    if(DEBUG_GAME) console.log(`landmarkDets.buttonClass => '${landmarkDets.buttonClass}'`);
    if(DEBUG_GAME) console.log(`currentTrack[0] => '${currentTrack[0]}'`);

    var takeLandmarkConfirmationHTML = `
        <div class="confirmationBox alertEl takeLandmarkConfirmationBox">
            <p>Are you sure you want to put back the <span class="bold">${landmarkDets.buildingName}</span> Landmark?</p>
    `;

    if(game.automaInfo.landmarks.indexOf(finalTargLandmark[0]) !== -1) {
        if(DEBUG_GAME) console.log(`game.automaInfo.landmarks.indexOf(finalTargLandmark[0]) !== -1 (ELEMENT EXISTS!) condition met`);
        takeLandmarkConfirmationHTML += `
            <p class="automaLandmarkMessage">Important! The Automa reached this Landmark first! Only put back if this was due to an error as this cannot be undone!</p>
        `;
    }

    takeLandmarkConfirmationHTML += `
            <img class="${landmarkDets.buildingHeight}Building" src="img/sculpts/${landmarkDets.imageName}.png" />
            <div class="buttons" btns="2">
                <a href="#" id="cancel" class="btn redBtn">Cancel</a>
                <a href="#" class="btn greenBtn func-confirmPutBackLandmark-${landmarkDets.buttonClass}+${currentTrack[0]}">Confirm</a>
            </div>
        </div>
    `;

	$(takeLandmarkConfirmationHTML).appendTo('body');
	$('.confirmationBox.shadowEmpireActionType').fadeIn();
    $('#resetOverlay').fadeIn();

    deactivateMenu();

})


function confirmPutBackLandmark(thisLandmark, thisTrack) {

    if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
    if(DEBUG_GAME) console.log(`confirmPutBackLandmark() func triggered`);
    if(DEBUG_GAME) console.log(`thisLandmark => '${thisLandmark}'`);
    if(DEBUG_GAME) console.log(`thisTrack => '${thisTrack}'`);

    var thisLandmarkID = '';
    var thisLandmarkImg = '';

    for (let i = 0; i < game.landmarks.length; i++) {
        if(game.landmarks[i].track == thisTrack) {
            for (let j = 0; j < game.landmarks[i].details.length; j++) {
                if(DEBUG_GAME) console.log(`game.landmarks[i].details[j].buttonClass => '${game.landmarks[i].details[j].buttonClass}'`);
                if(game.landmarks[i].details[j].buttonClass == thisLandmark) {

                    if(DEBUG_GAME) console.log(`match detected! ('${game.landmarks[i].details[j].buttonClass}')`);

                    game.landmarks[i].details[j].available = 'true';

                    if(DEBUG_GAME) console.log(`game.landmarks[i].details[j].buildingClass => '${game.landmarks[i].details[j].buildingClass}'`);
                    if(DEBUG_GAME) console.log(`game.landmarks[i].details[j].buildingHeight => '${game.landmarks[i].details[j].buildingHeight}'`);
                    if(DEBUG_GAME) console.log(`game.landmarks[i].details[j].imageName => '${game.landmarks[i].details[j].imageName}'`);

                    let currentImg = `
                        <img id="${game.landmarks[i].details[j].buildingClass}" class="${game.landmarks[i].details[j].buildingClass}Image putBackLandmark ${game.landmarks[i].details[j].buildingHeight}Building availableLandmark" src="img/sculpts/${game.landmarks[i].details[j].imageName}.png" />
                    `;

                    let currentLandmark = `.${game.landmarks[i].details[j].buildingClass}-landmark`;
                   
                    $(currentImg).appendTo(currentLandmark);

                    thisLandmarkID = game.landmarks[i].details[j].buildingClass;
                    thisLandmarkImg = game.landmarks[i].details[j].imageName;
                    
                    break;
                }
            }
            break;
        }
    }

    if(DEBUG_GAME) console.log(`thisLandmarkID => '${thisLandmarkID}'`);
    if(DEBUG_GAME) console.log(`thisLandmarkImg => '${thisLandmarkImg}'`);

    var automaLandmarkIndex = game.automaInfo.landmarks.indexOf(thisLandmarkID);
    if(DEBUG_GAME) console.log(`automaLandmarkIndex => '${automaLandmarkIndex}'`);

    if(automaLandmarkIndex !== -1) game.automaInfo.landmarks.splice(automaLandmarkIndex, 1);

    setTimeout(function(){

        $('.putBackLandmark').addClass('startingSpecs');

        setTimeout(function(){
            $('.putBackLandmark').removeClass('putBackLandmark');
            $('.startingSpecs').removeClass('startingSpecs');
            $(`#${thisLandmarkID}--unavailable`).attr('src', `img/sculpts/${thisLandmarkImg}-inactive-human.png`);
        }, 2000)

    }, 100)

}

var automaStartTimeout = 0;
var automaTimeout = 500;
var shadowEmpireStartTimeout = 2600;
var shadowEmpireTimeout = 3200;
var fullAnimationTime = 0;

var firstCardOfEra = 'false';
var firstShadowMove = 'false';

// function tapestry('savedGame')

function continueTapestryGame(){

    automaCivTrackActionChanges();

    if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
    if(DEBUG_GAME) console.log(`continueTapestryGame() func triggered`);
    
    initActionArea();

    if(DEBUG_GAME) console.log(`game.lastOpponent => '${game.lastOpponent}'`);
    if(DEBUG_GAME) console.log(`game.currentMode => '${game.currentMode}'`);
    if(DEBUG_GAME) console.log(`game.cardsDrawn => '${game.cardsDrawn}'`);

    if(DEBUG_GAME) console.log(`game.era => '${game.era}'`);
    if(DEBUG_GAME) console.log(`game.currentIncomeStep => '${game.currentIncomeStep}'`);

    if(game.lastOpponent == 'automaShadowEmpire') {
        if(DEBUG_GAME) console.log(`game.lastOpponent == 'automaShadowEmpire' condition met`);

        if(game.currentMode == 'game') {
            if(DEBUG_GAME) console.log(`game.currentMode == 'game' condition met`);

            showLayer('game');

            if(game.cardsDrawn != 0) {
                if(DEBUG_GAME) console.log(`game.cardsDrawn != 0 condition met`);

                var automaCurrentTrackSpace = game.tracks.indexOf(game.automaInfo.lastTrack);
                var shadowEmpireCurrentTrackSpace = game.tracks.indexOf(game.shadowEmpireInfo.lastTrack);

                if(DEBUG_GAME) console.log(`automaCurrentTrackSpace => '${automaCurrentTrackSpace}'`);
                if(DEBUG_GAME) console.log(`shadowEmpireCurrentTrackSpace => '${shadowEmpireCurrentTrackSpace}'`);
                if(DEBUG_GAME) console.log(`game.automaInfo.lastTrack => '${game.automaInfo.lastTrack}'`);
                if(DEBUG_GAME) console.log(`game.automaInfo.trackPos[automaCurrentTrackSpace] => '${game.automaInfo.trackPos[automaCurrentTrackSpace]}'`);
                if(DEBUG_GAME) console.log(`game.automaInfo.color => '${game.automaInfo.color}'`);

                var trackImageContainerHTML = `
                    <div id="automaMove" class="trackContainer ${game.automaInfo.lastTrack}Move currentSpace-${game.automaInfo.trackPos[automaCurrentTrackSpace]}">
                        <p>Automa</p>
                        <div class="trackImageContainer">
                            <img class="trackIcon" src="img/tracks/${game.automaInfo.lastTrack}Icon.png" />
                            <img class="trackImg" src="img/fullTracks/${game.automaInfo.lastTrack}.jpg" />
                            <img class="cubeImg" src="img/cubes/${game.automaInfo.color}.png" />
                `;

                for (let i = 0; i < game.landmarks.length; i++) {

                    if(DEBUG_GAME) console.log(`game.landmarks[i].track => '${game.landmarks[i].track}'`);

                    if(game.landmarks[i].track == game.automaInfo.lastTrack) {

                        if(DEBUG_GAME) console.log(`match detected! ('${game.landmarks[i].track}')`);

                        for (let j = 0; j < game.landmarks[i].details.length; j++) {

                            if(DEBUG_GAME) console.log(`game.landmarks[i].details[j].buildingClass => '${game.landmarks[i].details[j].buildingClass}'`);
                            if(DEBUG_GAME) console.log(`game.landmarks[i].details[j].trackNum => '${game.landmarks[i].details[j].trackNum}'`);
                            if(DEBUG_GAME) console.log(`game.landmarks[i].details[j].buildingHeight => '${game.landmarks[i].details[j].buildingHeight}'`);
                            if(DEBUG_GAME) console.log(`game.landmarks[i].details[j].imageName => '${game.landmarks[i].details[j].imageName}'`);
                            if(DEBUG_GAME) console.log(`game.landmarks[i].details[j].available => '${game.landmarks[i].details[j].available}'`);

                            if(game.landmarks[i].details[j].available == 'true') {

                                trackImageContainerHTML += `
                                    <img id="${game.landmarks[i].details[j].buildingClass}" class="trackLandmark landmarkTrackSpace${game.landmarks[i].details[j].trackNum} ${game.landmarks[i].details[j].buildingClass}Image ${game.landmarks[i].details[j].buildingHeight}Building availableLandmark" src="img/sculpts/${game.landmarks[i].details[j].imageName}.png" />
                                `;
                            }

                            trackImageContainerHTML += `
                                <img class="trackLandmark landmarkTrackSpace${game.landmarks[i].details[j].trackNum} ${game.landmarks[i].details[j].buildingClass}Image ${game.landmarks[i].details[j].buildingHeight}Building" src="img/sculpts/${game.landmarks[i].details[j].imageName}-inactive.png" />
                            `;
                        }
                    }

                }

                if(DEBUG_GAME) console.log(`game.automaInfo.lastTrack => '${game.automaInfo.lastTrack}'`);
                if(DEBUG_GAME) console.log(`game.shadowEmpireInfo.trackPos[shadowEmpireCurrentTrackSpace] => '${game.shadowEmpireInfo.trackPos[shadowEmpireCurrentTrackSpace]}'`);
                if(DEBUG_GAME) console.log(`game.shadowEmpireInfo.lastTrack => '${game.shadowEmpireInfo.lastTrack}'`);
                if(DEBUG_GAME) console.log(`game.shadowEmpireInfo.color => '${game.shadowEmpireInfo.color}'`);

                trackImageContainerHTML += `
                        </div>
                    </div>
                    <div id="shadowEmpireMove" class="trackContainer ${game.automaInfo.lastTrack}Move currentSpace-${game.shadowEmpireInfo.trackPos[shadowEmpireCurrentTrackSpace]}">
                        <p>Shadow Empire</p>
                        <div class="trackImageContainer">
                            <img class="trackIcon" src="img/tracks/${game.shadowEmpireInfo.lastTrack}Icon.png" />
                            <img class="trackImg" src="img/fullTracks/${game.shadowEmpireInfo.lastTrack}.jpg" />
                            <img class="cubeImg" src="img/cubes/${game.shadowEmpireInfo.color}.png" />
                `;

                for (let i = 0; i < game.landmarks.length; i++) {

                    if(DEBUG_GAME) console.log(`game.landmarks[i].track => '${game.landmarks[i].track}'`);

                    if(game.landmarks[i].track == game.shadowEmpireInfo.lastTrack) {

                        if(DEBUG_GAME) console.log(`match detected! ('${game.landmarks[i].track}')`);

                        for (let j = 0; j < game.landmarks[i].details.length; j++) {

                            if(DEBUG_GAME) console.log(`game.landmarks[i].details[j].buildingClass => '${game.landmarks[i].details[j].buildingClass}'`);
                            if(DEBUG_GAME) console.log(`game.landmarks[i].details[j].trackNum => '${game.landmarks[i].details[j].trackNum}'`);
                            if(DEBUG_GAME) console.log(`game.landmarks[i].details[j].buildingHeight => '${game.landmarks[i].details[j].buildingHeight}'`);
                            if(DEBUG_GAME) console.log(`game.landmarks[i].details[j].imageName => '${game.landmarks[i].details[j].imageName}'`);
                            if(DEBUG_GAME) console.log(`game.landmarks[i].details[j].available => '${game.landmarks[i].details[j].available}'`);

                            if(game.landmarks[i].details[j].available == 'true') {
                                trackImageContainerHTML += `
                                    <img id="${game.landmarks[i].details[j].buildingClass}" class="trackLandmark landmarkTrackSpace${game.landmarks[i].details[j].trackNum} ${game.landmarks[i].details[j].buildingClass}Image ${game.landmarks[i].details[j].buildingHeight}Building availableLandmark" src="img/sculpts/${game.landmarks[i].details[j].imageName}.png" />
                                    `;
                            }

                            trackImageContainerHTML += `
                                <img class="trackLandmark landmarkTrackSpace${game.landmarks[i].details[j].trackNum} ${game.landmarks[i].details[j].buildingClass}Image ${game.landmarks[i].details[j].buildingHeight}Building" src="img/sculpts/${game.landmarks[i].details[j].imageName}-inactive.png" />
                            `;
                        }
                    }
                }

                trackImageContainerHTML += `
                            </div>
                        </div>
                    <div class="clearDiv"></div>
                `;

                $('.tapestryActionContainer').append(trackImageContainerHTML);

                var currentAction = '';
    
                for (let i = 0; i < actionSpaces.length; i++) {
                    if(DEBUG_GAME) console.log(`actionSpaces[i].track => '${actionSpaces[i].track}'`);

                    if(actionSpaces[i].track == game.automaInfo.lastTrack){
                        if(DEBUG_GAME) console.log(`match detected! ('${actionSpaces[i].track}')`);

                        for (let j = 0; j < actionSpaces[i].details.length; j++) {
                            if(DEBUG_GAME) console.log(`actionSpaces[i].details[j].trackNum => '${actionSpaces[i].details[j].trackNum}'`);

                            if(actionSpaces[i].details[j].trackNum == game.automaInfo.trackPos[automaCurrentTrackSpace]) {
                                if(DEBUG_GAME) console.log(`match detected! ('${actionSpaces[i].details[j].trackNum}')`);

                                for (let k = 0; k < actionInfo.length; k++) {
                                    if(DEBUG_GAME) console.log(`actionInfo[k].actionClass => '${actionInfo[k].actionClass}'`);

                                    if(actionInfo[k].actionClass == actionSpaces[i].details[j].actionClass) {
                                        if(DEBUG_GAME) console.log(`match detected! ('${actionInfo[k].actionClass}')`);

                                        currentAction = JSON.parse(JSON.stringify(actionInfo[k]));

                                    }
                                }
                                if(currentAction != '') break;
                            }
                        }
                        if(currentAction != '') break;
                    }
                }

                if(DEBUG_GAME) console.log(`currentAction.actionClass => '${currentAction.actionClass}'`);
                if(DEBUG_GAME) console.log(`currentAction.actionDesc => '${currentAction.actionDesc}'`);
                if(DEBUG_GAME) console.log(`game.scienceDieMove => '${game.scienceDieMove}'`);

                if(DEBUG_GAME) console.log(`game.automaInfo.favTrack => '${game.automaInfo.favTrack}'`);
                
                if(DEBUG_GAME) console.log(`game.firstCardInfo:`);
                if(DEBUG_GAME) console.log(game.firstCardInfo);

                if(DEBUG_GAME) console.log(`game.secondCardInfo:`);
                if(DEBUG_GAME) console.log(game.secondCardInfo);

                var delayActiveButtons = 'false';
    
                if(currentAction != '' && game.scienceDieMove == 'false') {
                    if(DEBUG_GAME) console.log(`currentAction != '' && game.scienceDieMove == 'false' condition met`);

                    let tapestryActionContainerHTML = `
                        <div class="actionInformationPanel ${currentAction.actionClass}Move${game.automaInfo.firstCivSpecs.civID == "hucksters" || game.difficultyLevelNum == "5" && game.automaInfo.secondCivSpecs.civID == "hucksters" ? ' huckstersAutomaCivMode' : ''}">
                            ${currentAction.actionDesc}
                            <div class="clearDiv"></div>
                        </div>
                    `;

                    $('.tapestryActionContainer').append(tapestryActionContainerHTML);
                    
                    if(currentAction.actionClass == 'exploreAction' || currentAction.actionClass == 'exploreAnywhereAction' || currentAction.actionClass == 'conquerAction' || currentAction.actionClass == 'conquerAnywhereAction' || currentAction.actionClass == 'conquerAndTapestryAction') {
                        if(DEBUG_GAME) console.log(`currentAction.actionClass == '${currentAction.actionClass}' condition met`);
                        $('.extraTiebreakers .mapTiebreaker').append(`<img src="img/mapTiebreaker/${game.firstCardInfo.mapTiebreaker}.png" />`);
                    }

                    if(currentAction.actionClass == 'exploreAction' || currentAction.actionClass == 'exploreAnywhereAction') {
                        if(DEBUG_GAME) console.log(`currentAction.actionClass == '${currentAction.actionClass}' condition met`);
                        $('.extraTiebreakers .favTrackDecider').html(`<img class="favTrackImg" src="img/automaFavTrack.png"><p class="bold"> = </p><img class="favTrackIconImg" src="img/tracks/${game.automaInfo.favTrack}Icon.png" />`);
                    }

                    if(currentAction.actionClass == 'conquerAction' || currentAction.actionClass == 'conquerAnywhereAction' || currentAction.actionClass == 'conquerAndTapestryAction') {
                        if(DEBUG_GAME) console.log(`currentAction.actionClass == '${currentAction.actionClass}' condition met`);
                        if(game.firstCardInfo.topple == 'true') {
                            if(DEBUG_GAME) console.log(`game.firstCardInfo.topple == 'true' condition met`);
                            $('.extraTiebreakers .toppleIndicator').append('<img src="img/topple.png" />')
                        } else if(game.firstCardInfo.topple == 'false') {
                            if(DEBUG_GAME) console.log(`game.firstCardInfo.topple == 'false' condition met`);
                            $('.extraTiebreakers .toppleIndicator').append('<img src="img/toppleNone.png" />')
                        }
                    }

                    if(currentAction.actionClass == 'scienceDiceNoBenefitsAction' || currentAction.actionClass == 'scienceDiceBenefitsAction' || currentAction.actionClass == 'advanceMilitaryTechnologyExplorationAction' || currentAction.actionClass == 'regressMilitaryTechnologyAction' || currentAction.actionClass == 'advanceTwiceMilitaryTechnologyExplorationAction' || currentAction.actionClass == 'advanceMilitaryTechnologyExplorationScienceAction') {
                        if(DEBUG_GAME) console.log(`currentAction.actionClass == '${currentAction.actionClass}' condition met`);
                        delayActiveButtons = 'true';
                    }
    
                } else if(currentAction != '' && game.scienceDieMove == 'true') {
                    if(DEBUG_GAME) console.log(`currentAction != '' && game.scienceDieMove == 'true' condition met`);
                    let noBenefitsFromMoveHTML = `
                        <div class="actionInformationPanel noBenefitsMove">
                            <div class="mainActionArea">
                                <img class="actionImage" src="img/actions/diceNoBenefits.png" />
                                <p class="actionDescription">The Automa <span class="bold">does not</span> receive the benefits from this move.</p>
                                <div class="clearDiv"></div>
                            </div>
                    `;

                    $('.tapestryActionContainer').append(noBenefitsFromMoveHTML)
    
                } else {
                    if(DEBUG_GAME) console.log(`currentAction != '' && game.scienceDieMove == 'false' condition met (NEEDS CLARIFICATION)`);
                    let automaIgnoresBenefitHTML = `
                        <div class="actionInformationPanel noAutomaMove">
                            <div class="mainActionArea">
                                <p class="actionDescription">The Automa ignores the benefits<br />of this action space.</p>
                                <div class="clearDiv"></div>
                            </div>
                    `;

                    $('.tapestryActionContainer').append(automaIgnoresBenefitHTML)
                }
    
                $('.actionInformationPanel').show();
                $('.tapestryActionContainer .trackContainer').fadeIn('fast')

                if(DEBUG_GAME) console.log(`game.deckSize => '${game.deckSize}'`);
                if(DEBUG_GAME) console.log(`game.cardsDrawn => '${game.cardsDrawn}'`);

                if(game.deckSize - game.cardsDrawn == 0) {
                    if(DEBUG_GAME) console.log(`game.deckSize - game.cardsDrawn == 0 condition met`);

                    if(game.secondCardInfo.income == 'true') {
                        if(DEBUG_GAME) console.log(`game.secondCardInfo.income == 'true' condition met`);

                        var passAlert = `
                            <div id="passInstructions">
                                <p>The Automa proceeds to the next Income Phase without taking an advance action.</p>
                                <div class="incomeContainer">
                                    <img src="img/income.png">
                                </div>
                            </div>
                        `;
                        $(passAlert).appendTo('.tapestryActionContainer');
                        $('#passInstructions').fadeIn();
                    }
                    
                    gameButtonDisplay('nextAction', false);
                    gameButtonDisplay('incomeTurn', true);
                    gameButtonDisplay('draw', false);

                }

                if(DEBUG_GAME) console.log(`delayActiveButtons => '${delayActiveButtons}'`);

                setTimeout(function(){
                    $('#automaInfo').removeClass('greyBtn').addClass('greenBtn func-showAutomaInfo');
                    if(delayActiveButtons == 'true') {
                        $('#nextAction').removeClass('redBtn func-drawCard func-lockNextActionBtn').addClass('greyBtn');
                        console.log(`PING 1`)
                        $('#incomeButton').removeClass('redBtn func-nextIncomeStep').addClass('greyBtn');          
                    }
                }, 50)

            }

        } else if(game.currentMode == 'income') {
            if(DEBUG_GAME) console.log(`game.currentMode == 'income' condition met`);

            game.era--;
            game.currentIncomeStep = 1;
            incomeSetup(game.firstToReachEra);
        }

    } else if(game.lastOpponent == 'shadowEmpire') {
        if(DEBUG_GAME) console.log(`game.lastOpponent == 'shadowEmpire' condition met`);

        if(DEBUG_GAME) console.log(`game.shadowEmpireInfo.lastTrack => '${game.shadowEmpireInfo.lastTrack}'`);

        showLayer('game');

        if(game.cardsDrawn != 0) {
            if(DEBUG_GAME) console.log(`game.cardsDrawn != 0 condition met`);

            shadowEmpireContainerUpdate();
            setTimeout(function(){
                $(`.shadowEmpireMove.${game.shadowEmpireInfo.lastTrack}Move`).addClass('shadowEmpireChosenTrack');
                $('#automaInfo').removeClass('greyBtn').addClass('greenBtn func-showAutomaInfo');
            }, 100);
        }
    }
}

function equalizersIncomeTrackSetup(){

    if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
    if(DEBUG_GAME) console.log(`equalizersTrackSetup() func triggered`);

    var allTracksEqualizerCivView = '';

    for (let k = 0; k < game.tracks.length; k++) {

        allTracksEqualizerCivView += `
            <div id="${game.tracks[k]}-equalizerTrack" class="trackContainer ${game.tracks[k]}Move currentSpace-${game.automaInfo.trackPos[k]} ${game.automaInfo.trackPos[k] == 12 ? `invalidEqualizerTrack` : `validEqualizerTrack`}">
                ${game.automaInfo.trackPos[k] == 12 ? `
                    <div class="equalizersEndOfTrack"><p>The Automa is at the end of the<br />${capitalizeFirstLetter(game.tracks[k])} track and cannot advance.</p></div>
                ` : ``}
                <div class="trackImageContainer">
                    <img class="trackIcon" src="img/tracks/${game.tracks[k]}Icon.png" />
                    <img class="trackImg" src="img/fullTracks/${game.tracks[k]}-landmarks.jpg" />
                    <img class="automaCubeImg" src="img/cubes/${game.automaInfo.color}.png" />
                    <div class="equalizerCivHumanPosToConfirm oneSpaceAhead">
                    <img class="humanCubeImg" src="img/cubes/${game.humanInfo.color}.png" />
                    <div class="humanPosToSelect"></div>
                    </div>
                    <div class="equalizerCivHumanPosToConfirm twoSpacesAhead">
                    <img class="humanCubeImg" src="img/cubes/${game.humanInfo.color}.png" />
                    <div class="humanPosToSelect"></div>
                    </div>
                </div>
                <div class="equalizerCivHumanPosToConfirm anotherSpace">
                    ${game.automaInfo.trackPos[k] == 12 ? `
                        <div class="equalizersEndOfTrackAnotherSpace"></div>
                    ` : ``}
                    <p>Another<br />space</p>
                   <img class="humanCubeImg" src="img/cubes/${game.humanInfo.color}.png" />
                    <div class="humanPosToSelect"></div>
                </div>
            </div>${k == 3 ? `<div class="clearDiv"></div>` : ``}
        `;

    }
    allTracksEqualizerCivView += `
        <div id="equalizerBottomSection">
            <a id="confirmHumanPosButton" href="#" class="btn greyBtn">Confirm</a>
        </div>
    `;

    $('#incomeLayer #incomeInformation .civBonus #incomeAutomaCiv.equalizersCivContainer .actionInformationPanel').append(allTracksEqualizerCivView);

    if($('.trackContainer.invalidEqualizerTrack').length == 4) {
        game.automaInfo.incomeBonusVPs.amount = 5;
		game.automaInfo.incomeBonusVPs.total = 5;

		$('#equalizerBottomSection').html('<p>Due to there being no valid tracks for the Equalizers to advance on, the Automa instead gains <span class="bold">5 VP</span> during the income scoring phase (next screen).</p>');
		$('#incomeButton').addClass('redBtn func-nextIncomeStep').removeClass("greyBtn");
        $('#equalizersCivBonusInfo').remove();
    }

}


function trailblazersIncomeTrackSetup(thisTrack, mode){

    if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
    if(DEBUG_GAME) console.log(`trailblazersTrackSetup() func triggered`);

    if(mode != 'favTrack') {
        $('.actionInformationPanel #trailblazersCivBonusInfo').html(`
            <span class="bold">Trailblazers Civ:</span> Verify where your player token is on the ${capitalizeFirstLetter(thisTrack)} track to confirm the placement of the next track outpost. 
        `);
    }

    let thisIndex = trackIndex(thisTrack);

    var allTracksTrailblazersCivView =  `
            <div favtrack="${thisTrack == game.automaInfo.favTrack ? `true` : `false`}" track="${thisTrack}" id="${thisTrack}-trailblazerTrack" class="trackContainer ${thisTrack}Move currentSpace-${game.humanInfo.trackPos[thisIndex]}">
                ${game.humanInfo.trackPos[thisIndex] != 0 ? `` : ``}
                <div class="trailblazersTrackArrowContainer leftTrailblazersArrow ${game.humanInfo.trackPos[thisIndex] != 0 ? `activeArrow` : `inactiveArrow`}">
                    <p>&#60;</p>
                </div>
                ${thisTrack == game.automaInfo.favTrack ? `<img class="trailblazersFavTrack" src="img/automaFavTrack.png" />` : ``}
                <img class="trackIcon" src="img/tracks/${thisTrack}Icon.png" />
                <div class="trackImageContainer">
                    <div class="trackImagePosContainer">
                        <img class="trackImg" src="img/fullTracks/${thisTrack}-landmarks.jpg" />
                        <!--img class="automaCubeImg cubePos-${game.automaInfo.trackPos[thisIndex]}" src="img/cubes/${game.automaInfo.color}.png" /-->
                        <!--img class="shadowEmpireCubeImg cubePos-${game.shadowEmpireInfo.trackPos[thisIndex]}" src="img/cubes/${game.shadowEmpireInfo.color}.png" /-->
                    </div>
                    <div class="trailblazersCivHumanPosToConfirm">
                        <img class="humanCubeImg" src="img/cubes/${game.humanInfo.color}.png" />
                    </div>
                </div>
                <div class="trailblazersTrackArrowContainer rightTrailblazersArrow ${game.humanInfo.trackPos[thisIndex] != 12 ? `activeArrow` : `inactiveArrow`}">
                    <p>&#62;</p>
                </div>
            </div>
            <div class="clearDiv"></div>
        <div id="trailblazerBottomSection">
            <a id="confirmHumanPosButton" href="#" class="btn redBtn func-chooseNextTrackOutpostPos-${thisTrack}+${mode}">Confirm</a>
        </div>
    `;

    $('#incomeLayer #incomeInformation .civBonus #incomeAutomaCiv.trailblazersCivContainer .actionInformationPanel').append(allTracksTrailblazersCivView);

    // add any existing track outposts to generated tracks in the income screen
    for (let i = 0; i < game.automaInfo.trailblazersOutposts.length; i++) {
        if(game.automaInfo.trailblazersOutposts[i].length != 0) {
            for (let j = 0; j < game.automaInfo.trailblazersOutposts[i].length; j++) {
                $(`#incomeLayer #incomeInformation .civBonus #incomeAutomaCiv.trailblazersCivContainer .actionInformationPanel #${game.tracks[i]}-trailblazerTrack .trackImageContainer .trackImagePosContainer`).append(`
                    <img class="trackOutpost trackOutpostPos-${game.automaInfo.trailblazersOutposts[i][j]}" src="img/outposts/${game.automaInfo.trailblazerOutpostColor}.png" />
                `);
            }
        }
    }

    setTimeout(function(){
        $('#incomeLayer #incomeInformation .civBonus #incomeAutomaCiv.trailblazersCivContainer .actionInformationPanel').fadeIn('fast');
    }, 50);
    
}

function chooseNextTrackOutpostPos(currentTrack, thisMode) {
    if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
    if(DEBUG_GAME) console.log(`chooseNextTrackOutpostPos() func triggered`);

    updateHumanPosition(currentTrack);

    let chosenTrackAndOutpostSpace = checkTrackOutpostAndHumanPos(currentTrack);

    if(!chosenTrackAndOutpostSpace) {
        if(DEBUG_GAME) console.log(`if chosenTrackAndOutpostSpace == false condition met`);
        
        if(thisMode != 'favTrack') trailblazersTiebreaker++;
        nextTrailblazerTiebreaker();

        if(trailblazersTiebreaker != 5) {
            if(DEBUG_GAME) console.log(`if trailblazersTiebreaker != 5 condition met`);
            $('#trailblazerBottomSection').html(`
                <p id="trailblazerTrackOutpostTiebreakerMsg">No valid track outpost placements available.<br />Track tiebreaker invoked.</p>
            `);

            setTimeout(function(){
                $('#incomeLayer #incomeInformation .civBonus #incomeAutomaCiv.trailblazersCivContainer .actionInformationPanel').fadeOut('fast');
            }, 2000);   
    
            setTimeout(function(){
                $('#incomeLayer #incomeInformation .civBonus #incomeAutomaCiv.trailblazersCivContainer .actionInformationPanel .trackContainer').remove();
                $('#incomeLayer #incomeInformation .civBonus #incomeAutomaCiv.trailblazersCivContainer .actionInformationPanel #trailblazerBottomSection').remove();
                trailblazersIncomeTrackSetup(game.firstCardInfo.trackTiebreakers[trailblazersTiebreaker], 'trackTiebreaker');
            }, 2400);
        } else {
            if(DEBUG_GAME) console.log(`if trailblazersTiebreaker == 5 condition met`);
            $('#trailblazerBottomSection').html(`
                <p id="trailblazerTrackOutpostTiebreakerMsg">No valid track outpost placements available for all tracks so no new track outpost is placed.</p>
            `);
            setTimeout(function(){
                $('#incomeButton').removeClass('greyBtn').addClass('redBtn func-nextIncomeStep');
            }, 1000);
        }
    } else {
        if(DEBUG_GAME) console.log(`if chosenTrackAndOutpostSpace == true condition met`);
        $('#incomeLayer #incomeInformation .civBonus #incomeAutomaCiv.trailblazersCivContainer .actionInformationPanel').fadeOut('fast');
        generateChosenTrackOutpostHTML(chosenTrackAndOutpostSpace);
    }

}

function nextTrailblazerTiebreaker() {

    if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
    if(DEBUG_GAME) console.log(`nextTrailblazerTiebreaker() func triggered`);

    let nextValidTrailblazersTrack = false;

    let loopIteration = 0;

    while (!nextValidTrailblazersTrack) {
        if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
        if(DEBUG_GAME) console.log(`loopIteration = "${loopIteration}"`);
        
        if(DEBUG_GAME) console.log(`trailblazersTiebreaker = "${trailblazersTiebreaker}"`);
        if(nextValidTrailblazersTrack == 5) break;

        if(DEBUG_GAME) console.log(`game.firstCardInfo.trackTiebreakers[trailblazersTiebreaker] = "${game.firstCardInfo.trackTiebreakers[trailblazersTiebreaker]}"`);
        if(DEBUG_GAME) console.log(`game.automaInfo.favTrack = "${game.automaInfo.favTrack}"`);

        if(game.firstCardInfo.trackTiebreakers[trailblazersTiebreaker] != 'favorite') {
            if(DEBUG_GAME) console.log(`if game.firstCardInfo.trackTiebreakers[trailblazersTiebreaker] != 'favorite' condition met`);
            if(game.firstCardInfo.trackTiebreakers[trailblazersTiebreaker] != game.automaInfo.favTrack) {
                if(DEBUG_GAME) console.log(`if game.firstCardInfo.trackTiebreakers[trailblazersTiebreaker] != game.automaInfo.favTrack condition met`);
                nextValidTrailblazersTrack = true;
            } else {
                trailblazersTiebreaker++;
            }
        } else {
            trailblazersTiebreaker++;
        }
    }

    return trailblazersTiebreaker;
}

function checkTrackOutpostAndHumanPos(thisTrack) {

    if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
    if(DEBUG_GAME) console.log(`checkTrackOutpostAndHumanPos() func triggered`);
    if(DEBUG_GAME) console.log(`thisTrack = "${thisTrack}"`);

    let trackIndex = game.tracks.indexOf(thisTrack);
    if(DEBUG_GAME) console.log(`trackIndex = "${trackIndex}"`);

    let trackHumanPos = parseInt(game.humanInfo.trackPos[trackIndex]);
    if(DEBUG_GAME) console.log(`trackHumanPos = "${trackHumanPos}"`);

    let humanPos = parseInt(game.humanInfo.trackPos[trackIndex]);
    if(DEBUG_GAME) console.log(`humanPos = "${humanPos}"`);

    let furthestCubeOrOutpost = 0;
    let furthestItem = '';

    if(game.automaInfo.trailblazersOutposts[trackIndex].length == 0) {
        if(DEBUG_GAME) console.log(`game.automaInfo.trailblazersOutposts[trackIndex].length == 0 condition met`);

        if(humanPos <= 10) {
            if(DEBUG_GAME) console.log(`humanPos <= 10 condition met`);

            let nextOutpostPos = game.humanInfo.trackPos[trackIndex] + 2;
            if(DEBUG_GAME) console.log(`nextOutpostPos = "${nextOutpostPos}"`);
            furthestItem = 'your player token';

            return [thisTrack, nextOutpostPos, furthestItem];
        } else {
            if(DEBUG_GAME) console.log(`humanPos > 10 condition met`);
            return false;
        }

    } else {
        if(DEBUG_GAME) console.log(`game.automaInfo.trailblazersOutposts[trackIndex].length != 0 condition met`);

        if(DEBUG_GAME) console.log(`(game.automaInfo.trailblazersOutposts[trackIndex] = "${game.automaInfo.trailblazersOutposts[trackIndex]}"`);
        if(DEBUG_GAME) console.log(`(game.automaInfo.trailblazersOutposts[trackIndex].length = "${game.automaInfo.trailblazersOutposts[trackIndex].length}"`);

        let lastOutpostIndex = parseInt(game.automaInfo.trailblazersOutposts[trackIndex].length) - 1;
        if(DEBUG_GAME) console.log(`lastOutpostIndex = "${lastOutpostIndex}"`);

        let furthestTrackOutpost = parseInt(game.automaInfo.trailblazersOutposts[trackIndex][lastOutpostIndex]);
        if(DEBUG_GAME) console.log(`furthestTrackOutpost = "${furthestTrackOutpost}"`);

        if(DEBUG_GAME) console.log(`humanPos = "${humanPos}"`);
        if(DEBUG_GAME) console.log(`furthestTrackOutpost = "${furthestTrackOutpost}"`);

        if(humanPos >= furthestTrackOutpost) {
            if(DEBUG_GAME) console.log(`humanPos >= furthestTrackOutpost condition met`);
            furthestItem = 'your player token';
            furthestCubeOrOutpost = humanPos;
        } else if(humanPos < furthestTrackOutpost) {
            if(DEBUG_GAME) console.log(`humanPos < furthestTrackOutpost`);
            furthestItem = 'the furthest track outpost';
            furthestCubeOrOutpost = furthestTrackOutpost;
        }

        if(DEBUG_GAME) console.log(`furthestCubeOrOutpost = "${furthestCubeOrOutpost}"`);

        if(furthestCubeOrOutpost <= 10) {
            if(DEBUG_GAME) console.log(`humanPos <= 10 condition met`);

            let nextOutpostPos = furthestCubeOrOutpost + 2;
            if(DEBUG_GAME) console.log(`nextOutpostPos = "${nextOutpostPos}"`);

            return [thisTrack, nextOutpostPos, furthestItem];
        } else {
            if(DEBUG_GAME) console.log(`humanPos > 10 condition met`);
            return false;
        }
    }
}

function generateChosenTrackOutpostHTML(chosenTrackOutpost) {

	if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
	if(DEBUG_GAME) console.log(`generateChosenTrackOutpostHTML() func triggered`);
    if(DEBUG_GAME) console.log(`chosenTrackOutpost = "${chosenTrackOutpost}"`);

    // Example:
    // chosenTrackOutpost = ['technology', 8, 'your player token']
    // chosenTrackOutpost = ['science', 4, 'the furthest track outpost']

    let thisTrackIndex = game.tracks.indexOf(chosenTrackOutpost[0]);
    if(DEBUG_GAME) console.log(`thisTrackIndex = "${thisTrackIndex}"`);

    setTimeout(function(){
        $('#incomeLayer #incomeInformation .civBonus #incomeAutomaCiv.trailblazersCivContainer .actionInformationPanel').html(`
            <div class="trailblazersNewOutpostPlacement">
                <p class="trailblazersNewOutpostPlacementText">Place an outpost of an unused color two spaces ahead of ${chosenTrackOutpost[2]} on the <span class="bold">${capitalizeFirstLetter(chosenTrackOutpost[0])}</span> track.</p>
                <div id="${chosenTrackOutpost[0]}-trailblazerIncomeTrack" class="trailblazerNewOutpostTrackContainer ${chosenTrackOutpost[0]}Move currentSpace-${chosenTrackOutpost[1]}">
                    <div class="trackImageContainer">
                        <img class="trackIcon" src="img/tracks/${chosenTrackOutpost[0]}Icon.png" />
                        <div class="trackImagePosContainer">
                            <img class="trackImg" src="img/fullTracks/${chosenTrackOutpost[0]}-landmarks.jpg" />
                        </div>
                        ${chosenTrackOutpost[2] == `your player token` ? `
                            <div class="trailblazersCivHumanPosToConfirm">
                                <img class="humanCubeImg" src="img/cubes/${game.humanInfo.color}.png" />
                            </div>
                        ` : ``}
                    </div>
                </div>
            </div>
        `);

        setTimeout(function(){
            if(game.automaInfo.trailblazersOutposts[thisTrackIndex].length != 0) {
                let existingTrackOutpostsHTML = ``;
                for (let i = 0; i < game.automaInfo.trailblazersOutposts[thisTrackIndex].length; i++) {
                    existingTrackOutpostsHTML += `<img class="trackOutpost trackOutpostPos-${game.automaInfo.trailblazersOutposts[thisTrackIndex][i]}" src="img/outposts/${game.automaInfo.trailblazerOutpostColor}.png" />`;
                }
                $(`#incomeLayer #incomeInformation .civBonus #incomeAutomaCiv.trailblazersCivContainer .actionInformationPanel #${chosenTrackOutpost[0]}-trailblazerIncomeTrack .trackImageContainer .trackImagePosContainer`).append(existingTrackOutpostsHTML);
            }
        }, 50);

        setTimeout(function(){
            $('#incomeLayer #incomeInformation .civBonus #incomeAutomaCiv.trailblazersCivContainer .actionInformationPanel').fadeIn('fast');
        }, 100);

        setTimeout(function(){
            $('#incomeAutomaCiv.trailblazersCivContainer .actionInformationPanel .trailblazersNewOutpostPlacement .trailblazerNewOutpostTrackContainer .trackImageContainer .trackImagePosContainer').append(`<img class="trailblazerTrackOutpost animateNewTrackOutpost trackOutpostPos-${chosenTrackOutpost[1]}" src="img/outposts/${game.automaInfo.trailblazerOutpostColor}.png" />`);
		    game.automaInfo.trailblazersOutposts[thisTrackIndex].push(parseInt(chosenTrackOutpost[1]));
        }, 500);

        setTimeout(function(){
            $('#incomeButton').removeClass('greyBtn').addClass('redBtn func-nextIncomeStep');
        }, 2500);

    }, 400);
}


function updateHumanPosition(thisTrack) {

    if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
    if(DEBUG_GAME) console.log(`updateHumanPositions() func triggered`);

    let $thisTrack = $(`#incomeAutomaCiv.trailblazersCivContainer .actionInformationPanel #${thisTrack}-trailblazerTrack`);
    let currentSpaceSplit = classProcessor($thisTrack, 'currentSpace', 'split');
    if(DEBUG_GAME) console.log(`currentSpaceSplit:`, currentSpaceSplit);   

    let humanPos = parseInt(currentSpaceSplit[1]);
    if(DEBUG_GAME) console.log(`humanPos = "${humanPos}"`);   
    
    let thisTrackIndex = trackIndex(thisTrack);
    if(DEBUG_GAME) console.log(`trackIndex = "${thisTrackIndex}"`);
    
    game.humanInfo.trackPos[thisTrackIndex] = humanPos;
}

$(document).on(touchEvent, '#incomeAutomaCiv.trailblazersCivContainer .trackContainer .trailblazersTrackArrowContainer.activeArrow', function() {

    let $thisTrack = $(this).parent();    

    let currentSpaceSplit = classProcessor($thisTrack, 'currentSpace', 'split');
    if(DEBUG_GAME) console.log(`currentSpaceSplit:`, currentSpaceSplit);   

    let humanPos = parseInt(currentSpaceSplit[1]);
    if(DEBUG_GAME) console.log(`humanPos = "${humanPos}"`);  

    let newHumanSpace = 0;

    if($(this).hasClass('leftTrailblazersArrow')) {
        if(DEBUG_GAME) console.log(`$(this).hasClass('leftTrailblazersArrow') condition met`);   
        newHumanSpace = humanPos - 1;                        
    } else if($(this).hasClass('rightTrailblazersArrow')) {      
        if(DEBUG_GAME) console.log(`$(this).hasClass('rightTrailblazersArrow') condition met`);             
        newHumanSpace = humanPos + 1;                        
    }

    if(DEBUG_GAME) console.log(`humanPos = "${humanPos}"`);
    
    $thisTrack.find('.inactiveArrow').addClass('activeArrow').removeClass('inactiveArrow');

    if(newHumanSpace == 0) {                
        if(DEBUG_GAME) console.log(`newHumanSpace == 0`);      
        $thisTrack.find('.leftTrailblazersArrow').addClass('inactiveArrow').removeClass('activeArrow');
    } else if(newHumanSpace < 0) {      
        if(DEBUG_GAME) console.log(`newHumanSpace < 0`);                
        newHumanSpace = 0;
        $thisTrack.find('.leftTrailblazersArrow').addClass('inactiveArrow').removeClass('activeArrow');
    } else if(newHumanSpace == 12) {    
        if(DEBUG_GAME) console.log(`newHumanSpace == 12`);                  
        $thisTrack.find('.rightTrailblazersArrow').addClass('inactiveArrow').removeClass('activeArrow');
    } else if(newHumanSpace > 12) {       
        if(DEBUG_GAME) console.log(`newHumanSpace > 12`);               
        newHumanSpace = 12;
        $thisTrack.find('.rightTrailblazersArrow').addClass('inactiveArrow').removeClass('activeArrow');
    }

    $thisTrack.addClass(`currentSpace-${newHumanSpace}`).removeClass(`currentSpace-${humanPos}`);
})

function tapestry(mode){

    // reset end of track achievement array ready for calculating if the automa or shadow empire will reach the end of a track

    $('.scienceDieToRoll.activeScienceDie').removeClass('activeScienceDie');
    
    if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
    if(DEBUG_GAME) console.log(`tapestry(mode) func triggered`);
    if(DEBUG_GAME) console.log(`mode => '${mode}'`);

    if(DEBUG_GAME) console.log(`game.lastOpponent => '${game.lastOpponent}'`);
    if(DEBUG_GAME) console.log(`game.moveNum => '${game.moveNum}'`);

    if(DEBUG_GAME) console.log(`game.usedCards:`);
    if(DEBUG_GAME) console.log(game.usedCards);

    if(game.lastOpponent == 'shadowEmpire' && !$('.tapestryActionContainer.shadowEmpireAutomated .shadowEmpireMove').length) {
        if(DEBUG_GAME) console.log(`game.lastOpponent == 'shadowEmpire' && !$('.tapestryActionContainer.shadowEmpireAutomated .shadowEmpireMove').length condition met`);

        firstShadowMove = 'true';
        shadowEmpireContainerUpdate();
    } 

    $('#automaInfo').removeClass('greyBtn').addClass('greenBtn func-showAutomaInfo');

    if($('.tapestryActionContainer .trackContainer').length) {
        if(DEBUG_GAME) console.log(`$('.tapestryActionContainer .trackContainer').length condition met`);

        fullAnimationTime = automaTimeout + shadowEmpireTimeout + 1900;
        firstCardOfEra = 'false';
	} else {
        if(DEBUG_GAME) console.log(`!$('.tapestryActionContainer .trackContainer').length (DOES NOT EXIST) condition met`);

        fullAnimationTime = automaStartTimeout + shadowEmpireStartTimeout + 2500;
        firstCardOfEra = 'true';
	}

    if(mode == 'game') {
        if(DEBUG_GAME) console.log(`mode == 'game' condition met`);

        game.currentMode = 'game';
        if(firstCard == 'true') {
            if(DEBUG_GAME) console.log(`firstCard == 'true' condition met`);
            firstCard = 'false';
            game.moveNum--;
            for (let i = 0; i < deck.length; i++) {
                if (deck[i].card == game.usedCards[0]) {
                    game.firstCardInfo = JSON.parse(JSON.stringify(deck[i]));
                    break;
                }
            }
            drawCard();
        } else {
            if(DEBUG_GAME) console.log(`firstCard != 'true' condition met`);

            firstCard = 'true';
            for (let i = 0; i < deck.length; i++) {
                if (deck[i].card == game.usedCards[0]) {
                    game.secondCardInfo = JSON.parse(JSON.stringify(deck[i]));
                    break;
                }
            }

            if(DEBUG_GAME) console.log(`game.moveNum => '${game.moveNum}'`);
            if(DEBUG_GAME) console.log(`game.secondCardInfo.card => '${game.secondCardInfo.card}'`);
            if(DEBUG_GAME) console.log(`game.firstCardInfo.card => '${game.firstCardInfo.card}'`);
 
            var cardCombinationMoveHTML = `
                <p>
                    Move ${game.moveNum} : <a class="cardCombination" cards="${game.secondCardInfo.card}-${game.firstCardInfo.card}" href="#">Card ${game.secondCardInfo.card} + Card ${game.firstCardInfo.card}</a>
                </p>
            `;

            recordMove(cardCombinationMoveHTML, 'custom', 'add');

            setTimeout(function(){
                if(firstShadowMove != 'true') {
                    if(DEBUG_GAME) console.log(`firstShadowMove != 'true' condition met`);

                    // Automa moves first
                    determineChosenTrack();
                } else {
                    if(DEBUG_GAME) console.log(`firstShadowMove == 'true' condition met`);

                    // Shadow Empire moves second
                    setTimeout(function(){
                        determineChosenTrack();
                    }, 1200)
                    firstShadowMove = 'false';
                }
            }, 10)
        }
    }

    updateGame();
}

function determineChosenTrack() {

    if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
    if(DEBUG_GAME) console.log(`determineChosenTrack() func triggered`);

    if(DEBUG_GAME) console.log(`game.lastOpponent => '${game.lastOpponent}'`);
    if(DEBUG_GAME) console.log(`game.deckSize => '${game.deckSize}'`);
    if(DEBUG_GAME) console.log(`game.cardsDrawn => '${game.cardsDrawn}'`);
    if(DEBUG_GAME) console.log(`game.secondCardInfo.income => '${game.secondCardInfo.income}'`);

    if(game.lastOpponent == 'automaShadowEmpire') {
        if(DEBUG_GAME) console.log(`game.lastOpponent == 'automaShadowEmpire' condition met`);
        
        if(game.deckSize - game.cardsDrawn == 0 && game.secondCardInfo.income == 'true') {
            if(DEBUG_GAME) console.log(`game.deckSize - game.cardsDrawn == 0 && game.secondCardInfo.income == 'true' condition met`);

            var passAlert = `
                <div id="passInstructions">
                    <p>The Automa proceeds to the next Income Phase without taking an advance action.</p>
                    <div class="incomeContainer">
                        <img src="img/income.png">
                    </div>
                </div>
            `;

            $(passAlert).appendTo('.tapestryActionContainer');
            $('#passInstructions').fadeIn();
    
            gameButtonDisplay('nextAction', false);
            gameButtonDisplay('incomeTurn', true);
            gameButtonDisplay('draw', false);

            $('#automaInfo').removeClass('greyBtn').addClass('greenBtn func-showAutomaInfo');

            var thisMove = `
                <p class="tapestryMoveTrack">
                    Due to the deck being empty and an income symbol being present, the bots skip their advance action and go straight to their income turn.
                </p>
            `;

	        recordMove(thisMove, 'custom', 'add');
            return;
        }
    
        var finalizedAutomaTrack = '';

        if(DEBUG_GAME) console.log(`game.secondCardInfo.automa => '${game.secondCardInfo.automa}'`);
    
        if(game.secondCardInfo.automa == 'automaAll') {
            if(DEBUG_GAME) console.log(`game.secondCardInfo.automa == 'automaAll' condition met`);

    
            var tiebreakerNum = 0;
            var tiebreakerIndex = 0;
            var thisTrackPos = 12;
    
            while (thisTrackPos == 12) {
                if(game.firstCardInfo.trackTiebreakers[tiebreakerNum] == 'favorite') {
                    finalizedAutomaTrack = game.automaInfo.favTrack;
                } else {
                    finalizedAutomaTrack = game.firstCardInfo.trackTiebreakers[tiebreakerNum];
                }

                if(DEBUG_GAME) console.log(`finalizedAutomaTrack => '${finalizedAutomaTrack}'`);
    
                tiebreakerIndex = game.tracks.indexOf(finalizedAutomaTrack);
                if(DEBUG_GAME) console.log(`tiebreakerIndex => '${tiebreakerIndex}'`);

                thisTrackPos = game.automaInfo.trackPos[tiebreakerIndex];
                if(DEBUG_GAME) console.log(`thisTrackPos => '${thisTrackPos}'`);

                if(thisTrackPos == 12) tiebreakerNum++;
            }
    
            if($('.tapestryActionContainer #automaMove.trackContainer').length) {
                if(DEBUG_GAME) console.log(`$('.tapestryActionContainer #automaMove.trackContainer').length condition met`);

                $('.tapestryActionContainer #automaMove.trackContainer').fadeOut('slow');
                $('.tapestryActionContainer .actionInformationPanel').fadeOut('slow');

                setTimeout(function(){
                    $('.tapestryActionContainer').html('');
                    if(DEBUG_GAME) console.log(`finalizedAutomaTrack => '${finalizedAutomaTrack}'`);
                    animateTrackMove('automa', finalizedAutomaTrack, 'advance', 'normal', 'true', 1);
                }, automaTimeout);

            } else {
                if(DEBUG_GAME) console.log(`!$('.tapestryActionContainer #automaMove.trackContainer').length (DOES NOT EXIST) condition met`);

                setTimeout(function(){
                    if(DEBUG_GAME) console.log(`finalizedAutomaTrack => '${finalizedAutomaTrack}'`);
                    animateTrackMove('automa', finalizedAutomaTrack, 'advance', 'normal', 'true', 1);
                }, automaStartTimeout);

            }
            
        } else if(game.secondCardInfo.automa == 'automaEnd') {
            if(DEBUG_GAME) console.log(`game.secondCardInfo.automa == 'automaEnd' condition met`);
    
            var tempTrackPos = game.automaInfo.trackPos.slice();

            if(DEBUG_GAME) console.log(`tempTrackPos => '${tempTrackPos}'`);

            for (var i = 0; i < tempTrackPos.length; i++) {
                if(tempTrackPos[i] == 12){
                    tempTrackPos.splice(i, 1);
                    i--;
                }
            }
    
            var highestTrack = Math.max.apply(null, tempTrackPos);
            if(DEBUG_GAME) console.log(`highestTrack => '${highestTrack}'`);
            var matchedTracks = [];
            
            for (let i = 0; i < game.automaInfo.trackPos.length; i++) {
                if(game.automaInfo.trackPos[i] == highestTrack) matchedTracks.push(i);
            }
    
            if(matchedTracks.length == 1) {
                if(DEBUG_GAME) console.log(`matchedTracks.length == 1 condition met`);

                finalizedAutomaTrack = game.tracks[matchedTracks[0]];
                if(DEBUG_GAME) console.log(`finalizedAutomaTrack => '${finalizedAutomaTrack}'`);

                if($('.tapestryActionContainer #automaMove.trackContainer').length) {
                    if(DEBUG_GAME) console.log(`$('.tapestryActionContainer #automaMove.trackContainer').length condition met`);

                    $('.tapestryActionContainer #automaMove.trackContainer').fadeOut('slow');
                    $('.tapestryActionContainer .actionInformationPanel').fadeOut('slow');

                    setTimeout(function(){ 
                        $('.tapestryActionContainer').html('');                    
                        animateTrackMove('automa', finalizedAutomaTrack, 'advance', 'normal', 'true', 1);
                    }, automaTimeout);

                } else {
                    if(DEBUG_GAME) console.log(`!$('.tapestryActionContainer #automaMove.trackContainer').length (DOES NOT EXIST) condition met`);

                    setTimeout(function(){ 
                        animateTrackMove('automa', finalizedAutomaTrack, 'advance', 'normal', 'true', 1);
                    }, automaStartTimeout);

                }

            } else if(matchedTracks.length > 1) {    
                if(DEBUG_GAME) console.log(`matchedTracks.length > 1 condition met`);

                if(DEBUG_GAME) console.log(`matchedTracks:`);
                if(DEBUG_GAME) console.log(matchedTracks);

                for (let i = 0; i < game.firstCardInfo.trackTiebreakers.length; i++) {

                    let currentTiebreaker = '';

                    if(game.firstCardInfo.trackTiebreakers[i] == 'favorite') {
                        if(DEBUG_GAME) console.log(`game.firstCardInfo.trackTiebreakers[i] == 'favorite' condition met`);
                        currentTiebreaker = game.automaInfo.favTrack;
                    } else {
                        if(DEBUG_GAME) console.log(`game.firstCardInfo.trackTiebreakers[i] != 'favorite' condition met`);
                        currentTiebreaker = game.firstCardInfo.trackTiebreakers[i];
                    }

                    if(DEBUG_GAME) console.log(`currentTiebreaker => '${currentTiebreaker}'`);
    
                    for (let j = 0; j < matchedTracks.length; j++) {
                        if(DEBUG_GAME) console.log(`game.tracks[matchedTracks[j]] => '${game.tracks[matchedTracks[j]]}'`);

                        if(game.tracks[matchedTracks[j]] == currentTiebreaker) {
                            if(DEBUG_GAME) console.log(`match detected! ('${game.tracks[matchedTracks[j]]}')`);

                            finalizedAutomaTrack = game.tracks[matchedTracks[j]];

                            if(DEBUG_GAME) console.log(`finalizedAutomaTrack => '${finalizedAutomaTrack}'`);

                            if($('.tapestryActionContainer #automaMove.trackContainer').length) {

                                $('.tapestryActionContainer #automaMove.trackContainer').fadeOut('slow');
                                $('.tapestryActionContainer .actionInformationPanel').fadeOut('slow');

                                setTimeout(function(){ 
                                    $('.tapestryActionContainer').html('');                              
                                    animateTrackMove('automa', finalizedAutomaTrack, 'advance', 'normal', 'true', 1);
                                }, automaTimeout);

                            } else {

                                setTimeout(function(){ 
                                    animateTrackMove('automa', finalizedAutomaTrack, 'advance', 'normal', 'true', 1);
                                }, automaStartTimeout);

                            }
                            break;
                        }
                    }
                    if(finalizedAutomaTrack != '') break;
                }
            }
        } else if(game.secondCardInfo.automa == 'automaEndLandmark') {
            if(DEBUG_GAME) console.log(`game.secondCardInfo.automa == 'automaEndLandmark' condition met`);

            var landmarkDistances = [12, 12, 12, 12];
            if(aaExp) landmarkDistances.push(12);    
    
            for (let i = 0; i < game.landmarks.length; i++) {
                for (let j = 0; j < game.landmarks[i].details.length; j++) {
                    if(DEBUG_GAME) console.log(`game.automaInfo.trackPos[i] => '${game.automaInfo.trackPos[i]}'`);
                    if(game.automaInfo.trackPos[i] < game.landmarks[i].details[j].trackNum && game.landmarks[i].details[j].available == 'true') {
                        if(DEBUG_GAME) console.log(`match detected! ('${game.automaInfo.trackPos[i]} < ${game.landmarks[i].details[j].trackNum} && ${game.landmarks[i].details[j].available} == 'true'')`);
                        var landmarkTrackIndex = game.tracks.indexOf(game.landmarks[i].track);
                        if(DEBUG_GAME) console.log(`landmarkTrackIndex => '${landmarkTrackIndex}'`);

                        landmarkDistances[landmarkTrackIndex] = parseInt(game.landmarks[i].details[j].trackNum - game.automaInfo.trackPos[landmarkTrackIndex]);
                        if(DEBUG_GAME) console.log(`landmarkDistances[landmarkTrackIndex] => '${landmarkDistances[landmarkTrackIndex]}'`);
                        break;
                    }
                }
            }
    
            var allDifferences = game.automaInfo.toEndTrack.concat(landmarkDistances);
    
            for (let i = 0; i < allDifferences.length; i++) {
                if(allDifferences[i] == 0) allDifferences[i] = 12;
            }
    
            var smallestDif = Math.min.apply(null, allDifferences);
            var matchedTracks = [];

            if(DEBUG_GAME) console.log(`smallestDif => '${smallestDif}'`);

            let modifierNum = 0;
            aaExp ? modifierNum = 5 : modifierNum = 4;
    
            for (let j = 0; j < allDifferences.length; j++) {
                if(DEBUG_GAME) console.log(`allDifferences[j] => '${allDifferences[j]}'`);

                if(allDifferences[j] == smallestDif) {
                    if(DEBUG_GAME) console.log(`match detected! ('${allDifferences[j]}')`);
                    if(j < modifierNum) {
                        if(DEBUG_GAME) console.log(`j < ${modifierNum} condition met`);
                        matchedTracks.push(j);
                    } else if(j >= modifierNum) {
                        if(DEBUG_GAME) console.log(`j >= ${modifierNum} condition met`);
                        matchedTracks.push(j - modifierNum);
                    }
                }

            }
            
            if(matchedTracks.length == 1) {
                if(DEBUG_GAME) console.log(`matchedTracks.length == 1 condition met`);

    
                finalizedAutomaTrack = game.tracks[matchedTracks[0]];
                if(DEBUG_GAME) console.log(`finalizedAutomaTrack => '${finalizedAutomaTrack}'`);
    
                if($('.tapestryActionContainer #automaMove.trackContainer').length) {
                    if(DEBUG_GAME) console.log(`$('.tapestryActionContainer #automaMove.trackContainer').length condition met`);

                    $('.tapestryActionContainer #automaMove.trackContainer').fadeOut('slow');
                    $('.tapestryActionContainer .actionInformationPanel').fadeOut('slow');

                    setTimeout(function(){ 
                        $('.tapestryActionContainer').html('');                    
                        animateTrackMove('automa', finalizedAutomaTrack, 'advance', 'normal', 'true', 1);
                    }, automaTimeout);

                } else {
                    if(DEBUG_GAME) console.log(`$('.tapestryActionContainer #automaMove.trackContainer').length (DOES NOT EXIST) condition met`);

                    setTimeout(function(){ 
                        animateTrackMove('automa', finalizedAutomaTrack, 'advance', 'normal', 'true', 1);
                    }, automaStartTimeout);

                }
            } else if(matchedTracks.length > 1) {
                if(DEBUG_GAME) console.log(`matchedTracks.length > 1 condition met`);

                if(DEBUG_GAME) console.log(`matchedTracks:`);
                if(DEBUG_GAME) console.log(matchedTracks);

                for (let i = 0; i < game.firstCardInfo.trackTiebreakers.length; i++) {

                    let currentTiebreaker = '';

                    if(game.firstCardInfo.trackTiebreakers[i] == 'favorite') {
                        if(DEBUG_GAME) console.log(`game.firstCardInfo.trackTiebreakers[i] == 'favorite' condition met`);
                        currentTiebreaker = game.automaInfo.favTrack;
                    } else {
                        if(DEBUG_GAME) console.log(`game.firstCardInfo.trackTiebreakers[i] != 'favorite' condition met`);
                        currentTiebreaker = game.firstCardInfo.trackTiebreakers[i];
                    }

                    if(DEBUG_GAME) console.log(`currentTiebreaker => '${currentTiebreaker}'`);
    
                    for (let j = 0; j < matchedTracks.length; j++) {
                        if(DEBUG_GAME) console.log(`game.tracks[matchedTracks[j]] => '${game.tracks[matchedTracks[j]]}'`);

                        if(game.tracks[matchedTracks[j]] == currentTiebreaker) {
                            if(DEBUG_GAME) console.log(`match detected! ('${game.tracks[matchedTracks[j]]}')`);

                            finalizedAutomaTrack = game.tracks[matchedTracks[j]];

                            if($('.tapestryActionContainer #automaMove.trackContainer').length) {
                                $('.tapestryActionContainer #automaMove.trackContainer').fadeOut('slow');
                                $('.tapestryActionContainer .actionInformationPanel').fadeOut('slow');

                                setTimeout(function(){ 
                                    $('.tapestryActionContainer').html('');                              
                                    animateTrackMove('automa', finalizedAutomaTrack, 'advance', 'normal', 'true', 1);
                                }, automaTimeout);

                            } else {

                                setTimeout(function(){ 
                                    animateTrackMove('automa', finalizedAutomaTrack, 'advance', 'normal', 'true', 1);
                                }, automaStartTimeout);

                            }

                            break;
                        }
                    }
                    if(finalizedAutomaTrack != '') break;
                }
            }
            matchedTracks = matchedTracks.filter( onlyUnique ); // returns ['a', 1, 2, '1']

            if(DEBUG_GAME) console.log(`matchedTracks`);
            if(DEBUG_GAME) console.log(matchedTracks);
        }
    }

    // var automaStartTimeout = 0;
    // var automaTimeout = 500;
    // var shadowEmpireStartTimeout = 2600;
    // var shadowEmpireTimeout = 3200;
    // var fullAnimationTime = 0;


    var finalizedShadowEmpireTrack = '';

    if(game.lastOpponent == 'automaShadowEmpire') {
        if(DEBUG_GAME) console.log(`game.lastOpponent == 'automaShadowEmpire' condition met`);

        var currentTimeout = 0;

        if($('.tapestryActionContainer #shadowEmpireMove.trackContainer').length) {
            if(DEBUG_GAME) console.log(`$('.tapestryActionContainer #shadowEmpireMove.trackContainer').length condition met`);
            currentTimeout = shadowEmpireTimeout;
            $('.tapestryActionContainer #shadowEmpireMove.trackContainer').fadeOut('slow');
        } else {
            if(DEBUG_GAME) console.log(`!$('.tapestryActionContainer #shadowEmpireMove.trackContainer').length (DOES NOT EXIST) condition met`);
            currentTimeout = shadowEmpireStartTimeout;
        }

        setTimeout(function(){ 

            if(DEBUG_GAME) console.log(`game.secondCardInfo.shadowEmpire => '${game.secondCardInfo.shadowEmpire}'`);

            if(game.secondCardInfo.shadowEmpire == 'shadowEmpireAll') {
                if(DEBUG_GAME) console.log(`game.secondCardInfo.shadowEmpire == 'shadowEmpireAll' condition met`);

                var tiebreakerNum = 0;
                var tiebreakerIndex = 0;
                var thisTrackPos = 12;

                while (thisTrackPos == 12) {

                    if(game.firstCardInfo.shadowEmpireTiebreakers[tiebreakerNum] == 'favorite') {
                        finalizedShadowEmpireTrack = uncapitalizeFirstLetter(game.shadowEmpireInfo.favTrack);
                    } else {
                        finalizedShadowEmpireTrack = game.firstCardInfo.shadowEmpireTiebreakers[tiebreakerNum];
                    }

                    if(DEBUG_GAME) console.log(`finalizedShadowEmpireTrack => '${finalizedShadowEmpireTrack}'`);

                    tiebreakerIndex = game.tracks.indexOf(finalizedShadowEmpireTrack);
                    if(DEBUG_GAME) console.log(`tiebreakerIndex => '${tiebreakerIndex}'`);

                    thisTrackPos = game.shadowEmpireInfo.trackPos[tiebreakerIndex];
                    if(DEBUG_GAME) console.log(`thisTrackPos => '${thisTrackPos}'`);

                    if(thisTrackPos == 12) tiebreakerNum++;
                }

                animateTrackMove('shadowEmpire', finalizedShadowEmpireTrack, 'advance', 'normal', 'true', 1);

            } else if(game.secondCardInfo.shadowEmpire == 'shadowEmpireEnd') {
                if(DEBUG_GAME) console.log(`game.secondCardInfo.shadowEmpire == 'shadowEmpireEnd' condition met`);

                var tempTrackPos = game.shadowEmpireInfo.trackPos.slice();
                if(DEBUG_GAME) console.log(`tempTrackPos => '${tempTrackPos}'`);

                for (var i = 0; i < tempTrackPos.length; i++) {
                    if(tempTrackPos[i] == 12){
                        tempTrackPos.splice(i, 1);
                        i--;
                    }
                }

                var highestTrack = Math.max.apply(null, tempTrackPos);
                var matchedTracks = [];

                if(DEBUG_GAME) console.log(`highestTrack => '${highestTrack}'`);

                for (let i = 0; i < game.shadowEmpireInfo.trackPos.length; i++) {
                    if(DEBUG_GAME) console.log(`game.shadowEmpireInfo.trackPos[i] => '${game.shadowEmpireInfo.trackPos[i]}'`);

                    if(game.shadowEmpireInfo.trackPos[i] == highestTrack) {
                        if(DEBUG_GAME) console.log(`match detected! ('${game.shadowEmpireInfo.trackPos[i]}')`);
                        matchedTracks.push(i);
                    }
                }

                if(matchedTracks.length == 1) {
                    if(DEBUG_GAME) console.log(`matchedTracks.length == 1 condition met`);

                    finalizedShadowEmpireTrack = game.tracks[matchedTracks[0]];
                    if(DEBUG_GAME) console.log(`finalizedShadowEmpireTrack => '${finalizedShadowEmpireTrack}'`);

                    animateTrackMove('shadowEmpire', finalizedShadowEmpireTrack, 'advance', 'normal', 'true', 1)
                } else if(matchedTracks.length > 1) {
                    if(DEBUG_GAME) console.log(`matchedTracks.length > 1 condition met`);

                    for (let i = 0; i < game.firstCardInfo.shadowEmpireTiebreakers.length; i++) {
                        let currentTiebreaker = '';

                        if(game.firstCardInfo.shadowEmpireTiebreakers[i] == 'favorite') {
                            currentTiebreaker = uncapitalizeFirstLetter(game.shadowEmpireInfo.favTrack);
                        } else {
                            currentTiebreaker = game.firstCardInfo.shadowEmpireTiebreakers[i];
                        }

                        if(DEBUG_GAME) console.log(`currentTiebreaker => '${currentTiebreaker}'`);

                        for (let j = 0; j < matchedTracks.length; j++) {
                            if(DEBUG_GAME) console.log(`game.tracks[matchedTracks[j]] => '${game.tracks[matchedTracks[j]]}'`);

                            if(game.tracks[matchedTracks[j]] == currentTiebreaker) {
                                if(DEBUG_GAME) console.log(`match detected! ('${game.tracks[matchedTracks[j]]}')`);

                                finalizedShadowEmpireTrack = game.tracks[matchedTracks[j]];

                                if(DEBUG_GAME) console.log(`finalizedShadowEmpireTrack => '${finalizedShadowEmpireTrack}'`);

                                animateTrackMove('shadowEmpire', finalizedShadowEmpireTrack, 'advance', 'normal', 'true', 1);
                                break;
                            }
                        }
                        if(finalizedShadowEmpireTrack != '') break;
                    }
                }
            } else if(game.secondCardInfo.shadowEmpire == 'shadowEmpireEndLandmark') {
                if(DEBUG_GAME) console.log(`game.secondCardInfo.shadowEmpire == 'shadowEmpireEndLandmark' condition met`);

                var landmarkDistances = [12, 12, 12, 12];
                if(aaExp) landmarkDistances.push(12);    

                for (let i = 0; i < game.landmarks.length; i++) {

                    for (let j = 0; j < game.landmarks[i].details.length; j++) {
                        if(DEBUG_GAME) console.log(`game.shadowEmpireInfo.trackPos[i] => '${game.shadowEmpireInfo.trackPos[i]}'`);

                        if(game.shadowEmpireInfo.trackPos[i] < game.landmarks[i].details[j].trackNum && game.landmarks[i].details[j].available == 'true') {
                            if(DEBUG_GAME) console.log(`match detected! ('${game.shadowEmpireInfo.trackPos[i]} < ${game.landmarks[i].details[j].trackNum} && ${game.landmarks[i].details[j].available} == 'true'')`);

                            var landmarkTrackIndex = game.tracks.indexOf(game.landmarks[i].track);
                            if(DEBUG_GAME) console.log(`landmarkTrackIndex => '${landmarkTrackIndex}'`);

                            landmarkDistances[landmarkTrackIndex] = parseInt(game.landmarks[i].details[j].trackNum - game.shadowEmpireInfo.trackPos[landmarkTrackIndex]);
                            if(DEBUG_GAME) console.log(`landmarkDistances[landmarkTrackIndex] => '${landmarkDistances[landmarkTrackIndex]}'`);

                            break;
                        }
                    }
                }

                var allDifferences = game.shadowEmpireInfo.toEndTrack.concat(landmarkDistances);

                if(DEBUG_GAME) console.log(`allDifferences:`);
                if(DEBUG_GAME) console.log(allDifferences);

                for (let i = 0; i < allDifferences.length; i++) {
                    if(allDifferences[i] == 0) allDifferences[i] = 12;
                }

                var smallestDif = Math.min.apply(null, allDifferences);
                var matchedTracks = [];

                if(DEBUG_GAME) console.log(`smallestDif => '${smallestDif}'`);

                let modifierNum = 0;
                aaExp ? modifierNum = 5 : modifierNum = 4;

                for (let j = 0; j < allDifferences.length; j++) {
                    if(DEBUG_GAME) console.log(`allDifferences[j] => '${allDifferences[j]}'`);
                    if(allDifferences[j] == smallestDif) {
                        if(DEBUG_GAME) console.log(`match detected! ('${allDifferences[j]}')`);
                        if(j < modifierNum) {
                            if(DEBUG_GAME) console.log(`j < ${modifierNum} condition met`);
                            matchedTracks.push(j);
                        } else {
                            if(DEBUG_GAME) console.log(`j >= ${modifierNum} condition met`);
                            matchedTracks.push(j - modifierNum);
                        }
                    }
                }

                if(matchedTracks.length == 1) {
                    if(DEBUG_GAME) console.log(`matchedTracks.length == 1 condition met`);

                    finalizedShadowEmpireTrack = game.tracks[matchedTracks[0]];
                    if(DEBUG_GAME) console.log(`finalizedShadowEmpireTrack => '${finalizedShadowEmpireTrack}'`);

                    animateTrackMove('shadowEmpire', finalizedShadowEmpireTrack, 'advance', 'normal', 'true', 1);

                } else if(matchedTracks.length > 1) {
                    if(DEBUG_GAME) console.log(`matchedTracks.length > 1 condition met`);

                    matchedTracks = matchedTracks.filter( onlyUnique ); // returns ['a', 1, 2, '1']

                    if(DEBUG_GAME) console.log(`matchedTracks:`);
                    if(DEBUG_GAME) console.log(matchedTracks);

                    for (let i = 0; i < game.firstCardInfo.shadowEmpireTiebreakers.length; i++) {

                        let currentTiebreaker = '';

                        if(game.firstCardInfo.shadowEmpireTiebreakers[i] == 'favorite') {
                            if(DEBUG_GAME) console.log(`game.firstCardInfo.shadowEmpireTiebreakers[i] == 'favorite' condition met`);
                            currentTiebreaker = uncapitalizeFirstLetter(game.shadowEmpireInfo.favTrack);
                        } else {
                            if(DEBUG_GAME) console.log(`game.firstCardInfo.shadowEmpireTiebreakers[i] != 'favorite' condition met`);
                            currentTiebreaker = game.firstCardInfo.shadowEmpireTiebreakers[i];
                        }

                        if(DEBUG_GAME) console.log(`currentTiebreaker => '${currentTiebreaker}'`);

                        for (let j = 0; j < matchedTracks.length; j++) {
                            if(DEBUG_GAME) console.log(`game.tracks[matchedTracks[j]] => '${game.tracks[matchedTracks[j]]}'`);
                            if(game.tracks[matchedTracks[j]] == currentTiebreaker) {
                                if(DEBUG_GAME) console.log(`match detected! ('${game.tracks[matchedTracks[j]]}')`);

                                finalizedShadowEmpireTrack = game.tracks[matchedTracks[j]];
                                if(DEBUG_GAME) console.log(`finalizedShadowEmpireTrack => '${finalizedShadowEmpireTrack}'`);
                                animateTrackMove('shadowEmpire', finalizedShadowEmpireTrack, 'advance', 'normal', 'true', 1);
                                break;

                            }

                        }

                        if(finalizedShadowEmpireTrack != '') break;
                    }
                }
            }
        }, currentTimeout);

    } else if(game.lastOpponent == 'shadowEmpire') {
        if(DEBUG_GAME) console.log(`game.lastOpponent == 'shadowEmpire' condition met`);

        if(DEBUG_GAME) console.log(`game.secondCardInfo.shadowEmpire => '${game.secondCardInfo.shadowEmpire}'`);

        if(game.secondCardInfo.shadowEmpire == 'shadowEmpireAll') {
            if(DEBUG_GAME) console.log(`game.secondCardInfo.shadowEmpire == 'shadowEmpireAll' condition met`);

            var tiebreakerNum = 0;
            var tiebreakerIndex = 0;
            var thisTrackPos = 12;

            while (thisTrackPos == 12) {

                if(game.firstCardInfo.shadowEmpireTiebreakers[tiebreakerNum] == 'favorite') {
                    finalizedShadowEmpireTrack = uncapitalizeFirstLetter(game.shadowEmpireInfo.favTrack);
                } else {
                    finalizedShadowEmpireTrack = game.firstCardInfo.shadowEmpireTiebreakers[tiebreakerNum];
                }

                if(DEBUG_GAME) console.log(`finalizedShadowEmpireTrack => '${finalizedShadowEmpireTrack}'`);

                tiebreakerIndex = game.tracks.indexOf(finalizedShadowEmpireTrack);
                thisTrackPos = game.shadowEmpireInfo.trackPos[tiebreakerIndex];

                if(DEBUG_GAME) console.log(`tiebreakerIndex => '${tiebreakerIndex}'`);
                if(DEBUG_GAME) console.log(`thisTrackPos => '${thisTrackPos}'`);

                if(thisTrackPos == 12) tiebreakerNum++;
            }

            animateShadowEmpireTrackMove(finalizedShadowEmpireTrack);

        } else if(game.secondCardInfo.shadowEmpire == 'shadowEmpireEnd') {
            if(DEBUG_GAME) console.log(`game.secondCardInfo.shadowEmpire == 'shadowEmpireEnd' condition met`);

            var tempTrackPos = game.shadowEmpireInfo.trackPos.slice();

            if(DEBUG_GAME) console.log(`tempTrackPos => '${tempTrackPos}'`);

            for (var i = 0; i < tempTrackPos.length; i++) {
                if(tempTrackPos[i] == 12){
                    tempTrackPos.splice(i, 1);
                    i--;
                }
            }

            var highestTrack = Math.max.apply(null, tempTrackPos);
            var matchedTracks = [];

            if(DEBUG_GAME) console.log(`highestTrack => '${highestTrack}'`);

            for (let i = 0; i < game.shadowEmpireInfo.trackPos.length; i++) {
                if(DEBUG_GAME) console.log(`game.shadowEmpireInfo.trackPos[i] => '${game.shadowEmpireInfo.trackPos[i]}'`);

                if(game.shadowEmpireInfo.trackPos[i] == highestTrack) {
                    if(DEBUG_GAME) console.log(`match detected! ('${game.shadowEmpireInfo.trackPos[i]}')`);
                    matchedTracks.push(i);
                }

            }

            if(matchedTracks.length == 1) {
                if(DEBUG_GAME) console.log(`matchedTracks.length == 1 condition met`);

                finalizedShadowEmpireTrack = game.tracks[matchedTracks[0]];
                if(DEBUG_GAME) console.log(`finalizedShadowEmpireTrack => '${finalizedShadowEmpireTrack}'`);

                animateShadowEmpireTrackMove(finalizedShadowEmpireTrack);

            } else if(matchedTracks.length > 1) {
                if(DEBUG_GAME) console.log(`matchedTracks.length > 1 condition met`);

                for (let i = 0; i < game.firstCardInfo.shadowEmpireTiebreakers.length; i++) {
                    let currentTiebreaker = '';

                    
                    if(game.firstCardInfo.shadowEmpireTiebreakers[i] == 'favorite') {
                        if(DEBUG_GAME) console.log(`game.firstCardInfo.shadowEmpireTiebreakers[i] == 'favorite' condition met`);
                        currentTiebreaker = uncapitalizeFirstLetter(game.shadowEmpireInfo.favTrack);
                    } else {
                        if(DEBUG_GAME) console.log(`game.firstCardInfo.shadowEmpireTiebreakers[i] != 'favorite' condition met`);
                        currentTiebreaker = game.firstCardInfo.shadowEmpireTiebreakers[i];
                    }

                    if(DEBUG_GAME) console.log(`currentTiebreaker => '${currentTiebreaker}'`);

                    for (let j = 0; j < matchedTracks.length; j++) {
                        if(DEBUG_GAME) console.log(`game.tracks[matchedTracks[j]] => '${game.tracks[matchedTracks[j]]}'`);
                        
                        if(game.tracks[matchedTracks[j]] == currentTiebreaker) {
                            if(DEBUG_GAME) console.log(`match detected! ('${game.tracks[matchedTracks[j]]}')`);

                            finalizedShadowEmpireTrack = game.tracks[matchedTracks[j]];
                            if(DEBUG_GAME) console.log(`finalizedShadowEmpireTrack => '${finalizedShadowEmpireTrack}'`);

                            animateShadowEmpireTrackMove(finalizedShadowEmpireTrack);
                        }

                    }

                    if(finalizedShadowEmpireTrack != '') break;
                }
            }

        } else if(game.secondCardInfo.shadowEmpire == 'shadowEmpireEndLandmark') {

            if(DEBUG_GAME) console.log(`game.secondCardInfo.shadowEmpire == 'shadowEmpireEndLandmark' condition met`);
            
            var landmarkDistances = [12, 12, 12, 12];
            if(aaExp) landmarkDistances.push(12);    

            for (let i = 0; i < game.landmarks.length; i++) {

                for (let j = 0; j < game.landmarks[i].details.length; j++) {
                    if(DEBUG_GAME) console.log(`game.shadowEmpireInfo.trackPos[i] => '${game.shadowEmpireInfo.trackPos[i]}'`);
                    if(game.shadowEmpireInfo.trackPos[i] < game.landmarks[i].details[j].trackNum && game.landmarks[i].details[j].available == 'true') {
                        if(DEBUG_GAME) console.log(`match detected! ('${game.shadowEmpireInfo.trackPos[i]} < ${game.landmarks[i].details[j].trackNum} && ${game.landmarks[i].details[j].available} == 'true'')`);
                        var landmarkTrackIndex = game.tracks.indexOf(game.landmarks[i].track);
                        if(DEBUG_GAME) console.log(`landmarkTrackIndex => '${landmarkTrackIndex}'`);

                        landmarkDistances[landmarkTrackIndex] = parseInt(game.landmarks[i].details[j].trackNum - game.shadowEmpireInfo.trackPos[landmarkTrackIndex]);
                        if(DEBUG_GAME) console.log(`landmarkDistances[landmarkTrackIndex] => '${landmarkDistances[landmarkTrackIndex]}'`);

                        break;
                    }

                }

            }

            var allDifferences = game.shadowEmpireInfo.toEndTrack.concat(landmarkDistances);

            for (let i = 0; i < allDifferences.length; i++) {
                if(allDifferences[i] == 0) allDifferences[i] = 12;
            }

            var smallestDif = Math.min.apply(null, allDifferences);
            var matchedTracks = [];

            if(DEBUG_GAME) console.log(`smallestDif => '${smallestDif}'`);

            let modifierNum = 0;
            aaExp ? modifierNum = 5 : modifierNum = 4;

            for (let j = 0; j < allDifferences.length; j++) {
                if(DEBUG_GAME) console.log(`allDifferences[j] => '${allDifferences[j]}'`);
                if(allDifferences[j] == smallestDif) {
                    if(DEBUG_GAME) console.log(`match detected! ('${allDifferences[j]}')`);
                    if(j < modifierNum) {
                        if(DEBUG_GAME) console.log(`j < ${modifierNum} condition met`);
                        matchedTracks.push(j);
                    } else {
                        if(DEBUG_GAME) console.log(`j >= ${modifierNum} condition met`);
                        matchedTracks.push(j - modifierNum);
                    }
                }
            }

            if(matchedTracks.length == 1) {
                if(DEBUG_GAME) console.log(`matchedTracks.length == 1 condition met`);
                finalizedShadowEmpireTrack = game.tracks[matchedTracks[0]]
                if(DEBUG_GAME) console.log(`finalizedShadowEmpireTrack => '${finalizedShadowEmpireTrack}'`);

                animateShadowEmpireTrackMove(finalizedShadowEmpireTrack);

            } else if(matchedTracks.length > 1) {
                if(DEBUG_GAME) console.log(`matchedTracks.length > 1 condition met`);

                matchedTracks = matchedTracks.filter( onlyUnique ); // returns ['a', 1, 2, '1']

                if(DEBUG_GAME) console.log(`matchedTracks`);
                if(DEBUG_GAME) console.log(matchedTracks);

                for (let i = 0; i < game.firstCardInfo.shadowEmpireTiebreakers.length; i++) {

                    let currentTiebreaker = '';

                    if(game.firstCardInfo.shadowEmpireTiebreakers[i] == 'favorite') {
                        if(DEBUG_GAME) console.log(`game.firstCardInfo.shadowEmpireTiebreakers[i] == 'favorite' condition met`);
                        currentTiebreaker = uncapitalizeFirstLetter(game.shadowEmpireInfo.favTrack);
                    } else {
                        if(DEBUG_GAME) console.log(`game.firstCardInfo.shadowEmpireTiebreakers[i] != 'favorite' condition met`);
                        currentTiebreaker = game.firstCardInfo.shadowEmpireTiebreakers[i];
                    }

                    if(DEBUG_GAME) console.log(`currentTiebreaker => '${currentTiebreaker}'`);

                    for (let j = 0; j < matchedTracks.length; j++) {
                        if(DEBUG_GAME) console.log(`game.tracks[matchedTracks[j]] => '${game.tracks[matchedTracks[j]]}'`);
                        if(game.tracks[matchedTracks[j]] == currentTiebreaker) {
                            if(DEBUG_GAME) console.log(`match detected! ('${game.tracks[matchedTracks[j]]}')`);

                            finalizedShadowEmpireTrack = game.tracks[matchedTracks[j]];
                            if(DEBUG_GAME) console.log(`finalizedShadowEmpireTrack => '${finalizedShadowEmpireTrack}'`);

                            animateShadowEmpireTrackMove(finalizedShadowEmpireTrack);
                            break;
                        }
                    }
                    if(finalizedShadowEmpireTrack != '') break;
                }
            }
        }
    }
}

function shadowEmpireContainerUpdate() {
    if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
    if(DEBUG_GAME) console.log(`shadowEmpireContainerUpdate() func triggered`);
    var shadowEmpireContainerUpdateHTML = '';

    for (let i = 0; i < game.tracks.length; i++) {
        if(DEBUG_GAME) console.log(`game.shadowEmpireInfo.favTrack => '${game.shadowEmpireInfo.favTrack}'`)
        if(DEBUG_GAME) console.log(`game.tracks[i] => '${game.tracks[i]}'`);
        if(DEBUG_GAME) console.log(`game.shadowEmpireInfo.trackPos[i] => '${game.shadowEmpireInfo.trackPos[i]}'`);
        if(DEBUG_GAME) console.log(`capitalizeFirstLetter(game.tracks[i]) => '${capitalizeFirstLetter(game.tracks[i])}'`);

        shadowEmpireContainerUpdateHTML += `
            <div class="shadowEmpireMove trackContainer ${game.tracks[i]}Move currentSpace-${game.shadowEmpireInfo.trackPos[i]}">
                <p>${capitalizeFirstLetter(game.tracks[i])}
                    <span class="shadowEmpirefavTrackIcon">
        `;

        if(uncapitalizeFirstLetter(game.shadowEmpireInfo.favTrack) == game.tracks[i]) {
            if(DEBUG_GAME) console.log(`uncapitalizeFirstLetter(game.shadowEmpireInfo.favTrack) == game.tracks[i] condition met`);
            shadowEmpireContainerUpdateHTML += `<img src="img/shadowEmpireFavTrackBlank.png" />`;
        }

        if(DEBUG_GAME) console.log(`game.shadowEmpireInfo.color => '${game.shadowEmpireInfo.color}'`);
        
        shadowEmpireContainerUpdateHTML += `
                </span>
            </p>
        <div class="trackImageContainer">
            <img class="trackIcon" src="img/tracks/${game.tracks[i]}Icon.png" />
            <img class="trackImg" src="img/fullTracks/${game.tracks[i]}.jpg" />
            <img class="cubeImg" src="img/cubes/${game.shadowEmpireInfo.color}.png" />
        `;

        for (let j = 0; j < game.landmarks.length; j++) {
            if(game.landmarks[j].track == game.tracks[i]) {
                for (let k = 0; k < game.landmarks[j].details.length; k++) {

                    if(DEBUG_GAME) console.log(`game.landmarks[j].details[k].buildingClass => '${game.landmarks[j].details[k].buildingClass}'`);
                    if(DEBUG_GAME) console.log(`game.landmarks[j].details[k].trackNum => '${game.landmarks[j].details[k].trackNum}'`);
                    if(DEBUG_GAME) console.log(`game.landmarks[j].details[k].buildingHeight => '${game.landmarks[j].details[k].buildingHeight}'`);
                    if(DEBUG_GAME) console.log(`game.landmarks[j].details[k].imageName => '${game.landmarks[j].details[k].imageName}'`);
                    if(DEBUG_GAME) console.log(`game.landmarks[j].details[k].available => '${game.landmarks[j].details[k].available}'`);

                    if(game.landmarks[j].details[k].available == 'true') {
                        
                        shadowEmpireContainerUpdateHTML += `
                            <img id="${game.landmarks[j].details[k].buildingClass}" class="trackLandmark landmarkTrackSpace${game.landmarks[j].details[k].trackNum} ${game.landmarks[j].details[k].buildingClass}Image ${game.landmarks[j].details[k].buildingHeight}Building availableLandmark" src="img/sculpts/${game.landmarks[j].details[k].imageName}.png" />
                        `;
                    }

                    shadowEmpireContainerUpdateHTML += `
                        <img class="trackLandmark landmarkTrackSpace${game.landmarks[j].details[k].trackNum} ${game.landmarks[j].details[k].buildingClass}Image ${game.landmarks[j].details[k].buildingHeight}Building" src="img/sculpts/${game.landmarks[j].details[k].imageName}-inactive.png" />
                    `;
                }
            }

        }

        shadowEmpireContainerUpdateHTML += `
                </div>
            </div>
        `;
    }

    $(shadowEmpireContainerUpdateHTML).appendTo('#cardArea .tapestryActionContainer.shadowEmpireAutomated');
    $('#cardArea .tapestryActionContainer.shadowEmpireAutomated .shadowEmpireMove.trackContainer').fadeIn('slow');

}

function animateShadowEmpireTrackMove(thisTrack) { 
    if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
    if(DEBUG_GAME) console.log(`animateShadowEmpireTrackMove() func triggered`);
    if(DEBUG_GAME) console.log(`thisTrack => '${thisTrack}'`);

    game.shadowEmpireInfo.lastTrack = thisTrack;
    var shadowEmpireTrackIndex = game.tracks.indexOf(thisTrack);
    var previousShadowEmpirePos = game.shadowEmpireInfo.trackPos[shadowEmpireTrackIndex];
    var newShadowEmpirePos = game.shadowEmpireInfo.trackPos[shadowEmpireTrackIndex] + 1;

    
    if(DEBUG_GAME) console.log(`game.shadowEmpireInfo.lastTrack => '${game.shadowEmpireInfo.lastTrack}'`);
    if(DEBUG_GAME) console.log(`shadowEmpireTrackIndex => '${shadowEmpireTrackIndex}'`);
    if(DEBUG_GAME) console.log(`previousShadowEmpirePos => '${previousShadowEmpirePos}'`);
    if(DEBUG_GAME) console.log(`newShadowEmpirePos => '${newShadowEmpirePos}'`);
    
    $(`.tapestryActionContainer.shadowEmpireAutomated .${thisTrack}Move`).addClass(`currentSpace-${newShadowEmpirePos}`).removeClass(`currentSpace-${previousShadowEmpirePos}`);

    if(DEBUG_GAME) console.log(`game.shadowEmpireInfo.trackPos[shadowEmpireTrackIndex] => '${game.shadowEmpireInfo.trackPos[shadowEmpireTrackIndex]}'`);
    if(DEBUG_GAME) console.log(`game.shadowEmpireInfo.toEndTrack[shadowEmpireTrackIndex] => '${game.shadowEmpireInfo.toEndTrack[shadowEmpireTrackIndex]}'`);

    game.shadowEmpireInfo.trackPos[shadowEmpireTrackIndex]++;
    game.shadowEmpireInfo.toEndTrack[shadowEmpireTrackIndex]--;

    if(DEBUG_GAME) console.log(`game.shadowEmpireInfo.trackPos[shadowEmpireTrackIndex] => '${game.shadowEmpireInfo.trackPos[shadowEmpireTrackIndex]}'`);
    if(DEBUG_GAME) console.log(`game.shadowEmpireInfo.toEndTrack[shadowEmpireTrackIndex] => '${game.shadowEmpireInfo.toEndTrack[shadowEmpireTrackIndex]}'`);

    $('.shadowEmpireChosenTrack').removeClass('shadowEmpireChosenTrack');
    $(`.tapestryActionContainer.shadowEmpireAutomated .${thisTrack}Move`).addClass('shadowEmpireChosenTrack');
    $(`.tapestryActionContainer.shadowEmpireAutomated .${thisTrack}Move .cubeImg`).addClass('leapFrog');

    setTimeout(function(){
        $(`.tapestryActionContainer.shadowEmpireAutomated .${thisTrack}Move .cubeImg`).removeClass('leapFrog');
    }, 1000);   

    var landmarkSpace = game.landmarkSpaces.indexOf(newShadowEmpirePos);

    if(DEBUG_GAME) console.log(`landmarkSpace => '${landmarkSpace}'`);

    if(landmarkSpace != -1) {

        if(DEBUG_GAME) console.log(`landmarkSpace != -1 condition met`);

        setTimeout(function(){
            for (let i = 0; i < game.landmarks.length; i++) {
                if(DEBUG_GAME) console.log(`game.landmarks[i].track => '${game.landmarks[i].track}'`);

                if(game.landmarks[i].track == thisTrack) {
                    if(DEBUG_GAME) console.log(`match detected! ('${game.landmarks[i].track}')`);

                    for (let j = 0; j < game.landmarks[i].details.length; j++) {
                        if(DEBUG_GAME) console.log(`game.landmarks[i].details[j].trackNum => '${game.landmarks[i].details[j].trackNum}'`);
                        if(game.landmarks[i].details[j].trackNum == newShadowEmpirePos && game.landmarks[i].details[j].available == 'true') {
                            if(DEBUG_GAME) console.log(`match detected! ('${game.landmarks[i].details[j].trackNum}')`);

                            $(`.tapestryActionContainer.shadowEmpireAutomated .${thisTrack}Move .trackImageContainer #${game.landmarks[i].details[j].buildingClass}`).addClass('takenlandmark');

                            setTimeout(function(){
                                $(`.tapestryActionContainer.shadowEmpireAutomated .${thisTrack}Move .trackImageContainer #${game.landmarks[i].details[j].buildingClass}`).remove();
                            }, 2000)

                            game.landmarks[i].details[j].available = 'false';
                            game.automaInfo.landmarks.push(game.landmarks[i].details[j].buildingClass);
                            game.automaInfo.scoringLandmarks++;
                            break;
                        }
                    }
                    break;
                }
            }
            updateGame();
        }, 2000)

    }

    setTimeout(function(){
        $('#nextAction').removeClass('greyBtn').addClass('redBtn func-drawCard func-lockNextActionBtn');
        console.log(`PING 2`)
        $('#shuffleShadowDeck').removeClass('greyBtn').addClass('redBtn func-nextIncomeStep');

        if(DEBUG_GAME) console.log(`game.cardsDrawn => '${game.cardsDrawn}'`);
        if(DEBUG_GAME) console.log(`deck.length => '${deck.length}'`);

        if(game.cardsDrawn == deck.length) {
            gameButtonDisplay('nextAction', false);
            gameButtonDisplay('shuffleShadowDeck', true);
            $('#automaInfo').removeClass('greyBtn').addClass('greenBtn func-showAutomaInfo');
        }

        updateGame();
    }, 2000);
}

function shadowEmpirefavoriteTrackAssessment() {
    if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
    if(DEBUG_GAME) console.log(`shadowEmpirefavoriteTrackAssessment() func triggered`);

	var shadowEmpireFavTrack = uncapitalizeFirstLetter(game.shadowEmpireInfo.favTrack);
	var shadowEmpireFavTrackIndex = game.tracks.indexOf(shadowEmpireFavTrack);

    if(DEBUG_GAME) console.log(`shadowEmpireFavTrack => '${shadowEmpireFavTrack}'`);
    if(DEBUG_GAME) console.log(`shadowEmpireFavTrackIndex => '${shadowEmpireFavTrackIndex}'`);

    var favoriteTrackAssessmentIncomeStepHTML = `
        <div id="shadowEmpireFavTrackContainer" class="confirmationBox alertEl shadowEmpireFavTrackContainer">
            <h2>Shadow Empire Fav Track</h2>
            <div class="shadowEmpireFavoriteTrack favoriteTracks">
                <img class="favTrackImg" src="img/shadowEmpireFavTrack.png">
                <p class="bold"> = </p>
                <img class="favTrackIconImg" src="img/tracks/${shadowEmpireFavTrack}Icon.png" />
                <div class="clearDiv"></div>
            </div>
            <p>Is another players marker ahead of the <span class="underline">Shadow Empire</span> on the <span class="bold">${game.shadowEmpireInfo.favTrack}</span> track?</p>
            <div class="newTrackContainer"></div>
            <div class="buttons">
                <a href="#" class="btn redBtn keepOpen func-automatedShadowEmpireFavTrackNoChange">No</a>
                <a href="#" class="btn greenBtn keepOpen func-findNewShadowEmpireFavTrack">Yes</a>
            </div>
            <div class="clearDiv"></div>
            <a id="closeFavTrackAssessment" href="#" class="btn greyBtn keepOpen">Next</a>
        </div>
    `;

	$(favoriteTrackAssessmentIncomeStepHTML).appendTo('body');
	$('.confirmationBox.chooseSecondCiv').fadeIn();
    $('#resetOverlay').fadeIn();
    $('#resetOverlay').addClass('keepOpen');

    deactivateMenu();
}

function automatedShadowEmpireFavTrackNoChange() {
    if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
    if(DEBUG_GAME) console.log(`automatedShadowEmpireFavTrackNoChange() func triggered`);
	
	$('#shadowEmpireFavTrackContainer .buttons').fadeOut();
	setTimeout(function(){

		var newFavTrackHTML = `
            <img class="favTrackArrow" src="img/arrow.png">
            <div class="shadowEmpireFavoriteTrack newFavoriteTrack">
                <p class="noChange">No Change</p>
            </div>
        `;
		
		$('#shadowEmpireFavTrackContainer .newTrackContainer').html(newFavTrackHTML);
        $('#shadowEmpireFavTrackContainer .newTrackContainer').fadeIn();
        $('#closeFavTrackAssessment').removeClass('keepOpen greyBtn').addClass('greenBtn func-automatedShadowEmpireRoundCleanup');
	}, 400);

}

function animateTrackMove(opponent, thisTrack, direction, mode, benefits, spacesToMove) {

    // mode = incomeAction => iconoclastsIncomeAction
    
    if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
    if(DEBUG_GAME) console.log(`animateTrackMove() func triggered`);

    if(DEBUG_GAME) console.log(`opponent => '${opponent}'`);
    if(DEBUG_GAME) console.log(`thisTrack => '${thisTrack}'`);
    if(DEBUG_GAME) console.log(`direction => '${direction}'`);
    if(DEBUG_GAME) console.log(`mode => '${mode}'`);
    if(DEBUG_GAME) console.log(`benefits => '${benefits}'`);

    $('.collapsedContainer').removeClass('collapsedContainer');

    var track = thisTrack.toLowerCase();
    var trackIndex = game.tracks.indexOf(track);
    var currentSpace;
    var newSpace;
    var cubeColor;
    var fullOpponent;
    game.scienceDieMove = 'false';

    if(opponent == 'shadowEmpire') {
        if(DEBUG_GAME) console.log(`opponent == 'shadowEmpire' condition met`);
        currentSpace = game.shadowEmpireInfo.trackPos[trackIndex];
        cubeColor = game.shadowEmpireInfo.color;
        fullOpponent = 'Shadow Empire';
        game.shadowEmpireInfo.lastTrack = track;
    } else if(opponent == 'automa') {
        if(DEBUG_GAME) console.log(`opponent == 'automa' condition met`);
        currentSpace = game.automaInfo.trackPos[trackIndex];
        cubeColor = game.automaInfo.color;
        fullOpponent = 'Automa';
        game.automaInfo.lastTrack = track;
    }

    if(DEBUG_GAME) console.log(`currentSpace => '${currentSpace}'`);
    if(DEBUG_GAME) console.log(`cubeColor => '${cubeColor}'`);
    if(DEBUG_GAME) console.log(`fullOpponent => '${fullOpponent}'`);
    if(DEBUG_GAME) console.log(`game.shadowEmpireInfo.lastTrack => '${game.shadowEmpireInfo.lastTrack}'`);
    if(DEBUG_GAME) console.log(`game.automaInfo.lastTrack => '${game.automaInfo.lastTrack}'`);

    var recordedMoveDetails = '';

    if(currentSpace == 11 && direction == 'advance' && spacesToMove == 1 || currentSpace == 10 && direction == 'advance' && spacesToMove == 2) {

        if(DEBUG_GAME) console.log(`End of Track reached - check for achievement`);
        if(DEBUG_GAME) console.log(`game.achievements.endOfTrack[0] = "${game.achievements.endOfTrack[0]}"`);
        if(DEBUG_GAME) console.log(`game.achievements.endOfTrack[1] = "${game.achievements.endOfTrack[1]}"`);

        if(game.achievements.endOfTrack[0] == 'available') {
            if(endOfTrackAchievement.length == 0) {
                if(DEBUG_GAME) console.log(`endOfTrackAchievement.length == 0 condition met`);
                endOfTrackAchievement.push(`first-${opponent}-${thisTrack}`);
            } else {
                if(DEBUG_GAME) console.log(`endOfTrackAchievement.length != 0 condition met`);
                // if the Automa already reached the end of a track this turn and the function is now handling the shadow empire, who also reaches the end of a track at the same time, then the shadow empire will be the second player in line for an achievement
                endOfTrackAchievement.push(`second-${opponent}-${thisTrack}`);
            }
        } else if(game.achievements.endOfTrack[0] != opponent && game.achievements.endOfTrack[1] == 'available') {

            if(DEBUG_GAME) console.log(`opponent == "${opponent}"`);
            if(DEBUG_GAME) console.log(`game.achievements.endOfTrack[0] != opponent && game.achievements.endOfTrack[1] == 'available'`);

            // if the Automa already reached the end of a track this turn and the function is now handling the shadow empire, who also reaches the end of a track at the same time, then the shadow empire will be the second player in line for an achievement
            endOfTrackAchievement.push(`second-${opponent}-${thisTrack}`);
        }
    }

    if(DEBUG_GAME) console.log(`endOfTrackAchievement.length == "${endOfTrackAchievement.length}"`);
    
    if(currentSpace == 12 && direction == 'advance') {
        if(DEBUG_GAME) console.log(`currentSpace == 12 && direction == 'advance' condition met`);

        if(opponent == 'automa') {
            if(DEBUG_GAME) console.log(`opponent == 'automa' condition met`);
            var trackImageContainerHTML = `
                <div id="${opponent}Move" class="trackContainer ${track}Move currentSpace-${currentSpace}">
                    <p>${fullOpponent}</p>
                    <div class="trackImageContainer">
                        <img class="trackIcon" src="img/tracks/${track}Icon.png" />
                        <img class="trackImg" src="img/fullTracks/${track}.jpg" />
                        <img class="cubeImg" src="img/cubes/${cubeColor}.png" />
            `;

            for (let i = 0; i < game.landmarks.length; i++) {

                if(DEBUG_GAME) console.log(`game.landmarks[i].track => '${game.landmarks[i].track}'`);

                if(game.landmarks[i].track == track) {
                    if(DEBUG_GAME) console.log(`game.landmarks[i].track == track condition met`);

                    if(DEBUG_GAME) console.log(`match detected! ('${game.landmarks[i].track}')`);

                    for (let j = 0; j < game.landmarks[i].details.length; j++) {

                        if(DEBUG_GAME) console.log(`game.landmarks[i].details[j].buildingClass => '${game.landmarks[i].details[j].buildingClass}'`);
                        if(DEBUG_GAME) console.log(`game.landmarks[i].details[j].trackNum => '${game.landmarks[i].details[j].trackNum}'`);
                        if(DEBUG_GAME) console.log(`game.landmarks[i].details[j].buildingHeight => '${game.landmarks[i].details[j].buildingHeight}'`);
                        if(DEBUG_GAME) console.log(`game.landmarks[i].details[j].imageName => '${game.landmarks[i].details[j].imageName}'`);
                        if(DEBUG_GAME) console.log(`game.landmarks[i].details[j].available => '${game.landmarks[i].details[j].available}'`);

                        if(game.landmarks[i].details[j].available == 'true') {
                            if(DEBUG_GAME) console.log(`game.landmarks[i].details[j].available == 'true' condition met`);

                            trackImageContainerHTML += `
                                <img id="${game.landmarks[i].details[j].buildingClass}" class="trackLandmark landmarkTrackSpace${game.landmarks[i].details[j].trackNum} ${game.landmarks[i].details[j].buildingClass}Image ${game.landmarks[i].details[j].buildingHeight}Building availableLandmark" src="img/sculpts/${game.landmarks[i].details[j].imageName}.png" />
                            `;

                        }

                        trackImageContainerHTML += `
                            <img class="trackLandmark landmarkTrackSpace${game.landmarks[i].details[j].trackNum} ${game.landmarks[i].details[j].buildingClass}Image ${game.landmarks[i].details[j].buildingHeight}Building" src="img/sculpts/${game.landmarks[i].details[j].imageName}-inactive.png" />
                        `;

                    }
                }
            }

            trackImageContainerHTML += `
                    </div>
                </div>
            `;

            if(mode == 'normal' || mode == 'difficultySetup' || mode == 'incomeAction' || mode == 'iconoclastsIncomeAction') {
                if(DEBUG_GAME) console.log(`mode == '${mode}' condition met`);
                $('.tapestryActionContainer').append(trackImageContainerHTML);
            } else if(mode == 'extraAction') {
                if(DEBUG_GAME) console.log(`mode == '${mode}' condition met`);
                $('.tapestryActionContainer').prepend(trackImageContainerHTML);
            }

            $('.tapestryActionContainer .trackContainer').fadeIn('fast');
            
            var endOfTrackTimeout = 0;

            if(mode == 'normal') {
                if(DEBUG_GAME) console.log(`mode == '${mode}' condition met`);

                if(DEBUG_GAME) console.log(`firstCardOfEra => '${firstCardOfEra}'`);

                if(firstCardOfEra == 'true') {
                    if(DEBUG_GAME) console.log(`firstCardOfEra == 'true' condition met`);
                    endOfTrackTimeout = 200;
                } else if(firstCardOfEra == 'false') {
                    if(DEBUG_GAME) console.log(`firstCardOfEra == 'false' condition met`);
                    endOfTrackTimeout = 500;
                }

            } else if(mode == 'extraAction' || mode == 'incomeAction' || mode == 'iconoclastsIncomeAction') {
                if(DEBUG_GAME) console.log(`mode == '${mode}' condition met`);
                endOfTrackTimeout = 0;
            }
            
            setTimeout(function(){

                let automaEndOfTrackHTML = `
                    <div class="actionInformationPanel">
                        <p style="text-align:center;">The Automa is at the end of the<br /><span class="bold">${capitalizeFirstLetter(thisTrack)}</span> track and does nothing.</p>
                    </div>
                `;

                $('.tapestryActionContainer').append(automaEndOfTrackHTML);
                $('.tapestryActionContainer .actionInformationPanel').fadeIn();

            }, endOfTrackTimeout);

            if(DEBUG_GAME) console.log(`game.automaInfo.color => '${game.automaInfo.color}'`);
            if(DEBUG_GAME) console.log(`capitalizeFirstLetter(thisTrack) => '${capitalizeFirstLetter(thisTrack)}'`);
            
            recordedMoveDetails += `
                <p class="tapestryMoveTrack">
                    <span class="color-${game.automaInfo.color}">Automa</span> - End of ${capitalizeFirstLetter(thisTrack)} track
                 </p>
            `;

            $('#nextAction').removeClass('greyBtn').addClass('redBtn func-drawCard func-lockNextActionBtn');
            console.log(`PING 3`)

            if($('#incomeAutomaCiv.iconoclastsCivContainer.iconoclastsActiveDiceRoll').length) {
                let landmarksLeft = parseInt($('#incomeAutomaCiv.iconoclastsCivContainer.iconoclastsActiveDiceRoll .incomeActionInformationPanel .iconoclastsLeftInfo #iconoclastsTotalLandmarks').attr('landmarks'));
                if(landmarksLeft == 0) {
                    $('#incomeButton').removeClass('greyBtn').addClass('redBtn func-nextIncomeStep');
                    game.automaInfo.scoringLandmarks = 0;
                } else {
                    $('#iconoclastsCivBonusScienceDieRollBtn').removeClass('greyBtn').addClass('greenBtn actionScienceDice func-iconoclastsCivBonusScienceDieRoll');
                }
            
            } else {
                $('#incomeButton').removeClass('greyBtn').addClass('redBtn func-nextIncomeStep');
            }

            if(DEBUG_GAME) console.log(`game.cardsDrawn => '${game.cardsDrawn}'`);
            if(DEBUG_GAME) console.log(`deck.length => '${deck.length}'`);

            if(game.cardsDrawn == deck.length) {
                if(DEBUG_GAME) console.log(`game.cardsDrawn == deck.length condition met`);
                gameButtonDisplay('nextAction', false);
                gameButtonDisplay('incomeTurn', true);
                $('#automaInfo').removeClass('greyBtn').addClass('greenBtn func-showAutomaInfo');
            }

            if(game.currentMode == 'game') updateGame();

        }

    } else {
        if(DEBUG_GAME) console.log(`currentSpace != 12 && direction != 'advance' condition met`);
        if(DEBUG_GAME) console.log(`currentSpace => '${currentSpace}'`);
        if(DEBUG_GAME) console.log(`direction => '${direction}'`);

        if(opponent == 'shadowEmpire') {
            if(DEBUG_GAME) console.log(`opponent == 'shadowEmpire' condition met`);

            if(direction == 'advance') {
                if(DEBUG_GAME) console.log(`direction == 'advance' condition met`);

                newSpace = currentSpace + 1;
                if(DEBUG_GAME) console.log(`newSpace => '${newSpace}'`);

                if(DEBUG_GAME) console.log(`BEFORE => game.shadowEmpireInfo.trackPos[trackIndex] => '${game.shadowEmpireInfo.trackPos[trackIndex]}'`);
                if(DEBUG_GAME) console.log(`BEFORE => game.shadowEmpireInfo.toEndTrack[trackIndex] => '${game.shadowEmpireInfo.toEndTrack[trackIndex]}'`);

                game.shadowEmpireInfo.trackPos[trackIndex] = game.shadowEmpireInfo.trackPos[trackIndex] + spacesToMove;
                game.shadowEmpireInfo.toEndTrack[trackIndex] = game.shadowEmpireInfo.toEndTrack[trackIndex] - spacesToMove;

                if(DEBUG_GAME) console.log(`AFTER => game.shadowEmpireInfo.trackPos[trackIndex] => '${game.shadowEmpireInfo.trackPos[trackIndex]}'`);
                if(DEBUG_GAME) console.log(`AFTER => game.shadowEmpireInfo.toEndTrack[trackIndex] => '${game.shadowEmpireInfo.toEndTrack[trackIndex]}'`);

                recordedMoveDetails += `
                    <p class="tapestryMoveTrack">
                        <span class="bold color-${game.shadowEmpireInfo.color}">Shadow Empire</span> - Advances on ${capitalizeFirstLetter(thisTrack)} track
                    </p>
                `;
            } else if(direction == 'regress') {
                if(DEBUG_GAME) console.log(`direction == 'regress' condition met`);

                newSpace = currentSpace - 1;
                if(DEBUG_GAME) console.log(`newSpace => '${newSpace}'`);

                if(DEBUG_GAME) console.log(`BEFORE => game.shadowEmpireInfo.trackPos[trackIndex] => '${game.shadowEmpireInfo.trackPos[trackIndex]}'`);
                if(DEBUG_GAME) console.log(`BEFORE => game.shadowEmpireInfo.toEndTrack[trackIndex] => '${game.shadowEmpireInfo.toEndTrack[trackIndex]}'`);

                game.shadowEmpireInfo.trackPos[trackIndex] = game.shadowEmpireInfo.trackPos[trackIndex] - spacesToMove;
                game.shadowEmpireInfo.toEndTrack[trackIndex] = game.shadowEmpireInfo.toEndTrack[trackIndex] + spacesToMove;

                if(DEBUG_GAME) console.log(`AFTER => game.shadowEmpireInfo.trackPos[trackIndex] => '${game.shadowEmpireInfo.trackPos[trackIndex]}'`);
                if(DEBUG_GAME) console.log(`AFTER => game.shadowEmpireInfo.toEndTrack[trackIndex] => '${game.shadowEmpireInfo.toEndTrack[trackIndex]}'`);

                recordedMoveDetails += `
                    <p class="tapestryMoveTrack">
                        <span class="bold color-${game.shadowEmpireInfo.color}">Shadow Empire</span> - Regresses on ${capitalizeFirstLetter(thisTrack)} track
                    </p>
                `;
            }
        } else if(opponent == 'automa') {
            if(DEBUG_GAME) console.log(`opponent == 'automa' condition met`);

            if(direction == 'advance') {

                if(DEBUG_GAME) console.log(`direction == 'advance' condition met`);

                newSpace = currentSpace + parseInt(spacesToMove);
                game.automaInfo.trackPos[trackIndex] = game.automaInfo.trackPos[trackIndex] + parseInt(spacesToMove);
                game.automaInfo.toEndTrack[trackIndex] = game.automaInfo.toEndTrack[trackIndex] - parseInt(spacesToMove);

                recordedMoveDetails += `
                    <p class="tapestryMoveTrack">
                        <span class="bold color-${game.automaInfo.color}">Automa</span> - Advances on ${capitalizeFirstLetter(thisTrack)} track - 
                `;
            } else if(direction == 'regress') {
                if(DEBUG_GAME) console.log(`direction == 'regress' condition met`);

                newSpace = currentSpace - parseInt(spacesToMove);
                if(DEBUG_GAME) console.log(`newSpace => '${newSpace}'`);

                if(newSpace >= 0) {
                    if(DEBUG_GAME) console.log(`newSpace >= 0 condition met`);

                    if(DEBUG_GAME) console.log(`BEFORE => game.automaInfo.trackPos[trackIndex] => '${game.automaInfo.trackPos[trackIndex]}'`);
                    if(DEBUG_GAME) console.log(`BEFORE => game.automaInfo.toEndTrack[trackIndex] => '${game.automaInfo.toEndTrack[trackIndex]}'`);

                    game.automaInfo.trackPos[trackIndex] = game.automaInfo.trackPos[trackIndex] - parseInt(spacesToMove);
                    game.automaInfo.toEndTrack[trackIndex] = game.automaInfo.toEndTrack[trackIndex] + parseInt(spacesToMove);

                    if(DEBUG_GAME) console.log(`AFTER => game.automaInfo.trackPos[trackIndex] => '${game.automaInfo.trackPos[trackIndex]}'`);
                    if(DEBUG_GAME) console.log(`AFTER => game.automaInfo.toEndTrack[trackIndex] => '${game.automaInfo.toEndTrack[trackIndex]}'`);

                }

                recordedMoveDetails += `
                    <p class="tapestryMoveTrack">
                        <span class="bold color-${game.automaInfo.color}">Automa</span> - Regresses on ${capitalizeFirstLetter(thisTrack)} track - 
                `;
            }
        }

        if(DEBUG_GAME) console.log(`opponent => '${opponent}'`);
        if(DEBUG_GAME) console.log(`track => '${track}'`);
        if(DEBUG_GAME) console.log(`currentSpace => '${currentSpace}'`);
        if(DEBUG_GAME) console.log(`cubeColor => '${cubeColor}'`);
        
        var trackImageContainerHTML = `
            <div id="${opponent}Move" class="trackContainer ${track}Move currentSpace-${currentSpace}">
            <p>${fullOpponent}</p>
                <div class="trackImageContainer">
                    <img class="trackIcon" src="img/tracks/${track}Icon.png" />
                    <img class="trackImg" src="img/fullTracks/${track}.jpg" />
                    <img class="cubeImg" src="img/cubes/${cubeColor}.png" />
        `;

        for (let i = 0; i < game.landmarks.length; i++) {
            if(DEBUG_GAME) console.log(`game.landmarks[i].track => '${game.landmarks[i].track}'`);

            if(game.landmarks[i].track == track) {
                if(DEBUG_GAME) console.log(`match detected! ('${game.landmarks[i].track}')`);

                for (let j = 0; j < game.landmarks[i].details.length; j++) {

                    if(DEBUG_GAME) console.log(`game.landmarks[i].details[j].buildingClass => '${game.landmarks[i].details[j].buildingClass}'`);
                    if(DEBUG_GAME) console.log(`game.landmarks[i].details[j].trackNum => '${game.landmarks[i].details[j].trackNum}'`);
                    if(DEBUG_GAME) console.log(`game.landmarks[i].details[j].buildingHeight => '${game.landmarks[i].details[j].buildingHeight}'`);
                    if(DEBUG_GAME) console.log(`game.landmarks[i].details[j].imageName => '${game.landmarks[i].details[j].imageName}'`);
                    if(DEBUG_GAME) console.log(`game.landmarks[i].details[j].available => '${game.landmarks[i].details[j].available}'`);

                    if(game.landmarks[i].details[j].available == 'true') {
                        trackImageContainerHTML += `
                            <img id="${game.landmarks[i].details[j].buildingClass}" class="trackLandmark landmarkTrackSpace${game.landmarks[i].details[j].trackNum} ${game.landmarks[i].details[j].buildingClass}Image ${game.landmarks[i].details[j].buildingHeight}Building availableLandmark" src="img/sculpts/${game.landmarks[i].details[j].imageName}.png" />
                        `;
                    }

                    trackImageContainerHTML += `
                        <img class="trackLandmark landmarkTrackSpace${game.landmarks[i].details[j].trackNum} ${game.landmarks[i].details[j].buildingClass}Image ${game.landmarks[i].details[j].buildingHeight}Building" src="img/sculpts/${game.landmarks[i].details[j].imageName}-inactive.png" />
                    `;
                }
            }

        }

        trackImageContainerHTML += `
                </div>
            </div>
        `;

        if(DEBUG_GAME) console.log(`mode => '${mode}'`);

        if(mode == 'normal' || mode == 'difficultySetup' || mode == 'incomeAction' || mode == 'iconoclastsIncomeAction') {
            if(DEBUG_GAME) console.log(`mode = '${mode}' condition met`);
            $('.tapestryActionContainer').append(trackImageContainerHTML);
        } else if(mode == 'extraAction') {
            if(DEBUG_GAME) console.log(`mode = '${mode}' condition met`);
            $('.tapestryActionContainer').prepend(trackImageContainerHTML);
        }

        $('.tapestryActionContainer .trackContainer').fadeIn('fast');

        if(opponent == 'shadowEmpire'){
            if(DEBUG_GAME) console.log(`IFSTATEMENT condition met`);
            $('.tapestryActionContainer').append('<div class="clearDiv"></div>');
        }

        if(DEBUG_GAME) console.log(`opponent => '${opponent}'`);
        if(DEBUG_GAME) console.log(`newSpace => '${newSpace}'`);

        if(newSpace >= 0) {
            if(DEBUG_GAME) console.log(`newSpace >= 0 condition met`);

            setTimeout(function(){
                $(`.tapestryActionContainer #${opponent}Move.trackContainer`).addClass(`currentSpace-${newSpace}`).removeClass(`currentSpace-${currentSpace}`);
            }, 500);   

            setTimeout(function(){
                $(`.tapestryActionContainer #${opponent}Move.trackContainer .cubeImg`).addClass('leapFrog');

                setTimeout(function(){
                    $(`.tapestryActionContainer #${opponent}Move.trackContainer .cubeImg`).removeClass('leapFrog');
                }, 1000);   

            }, 500);

        }

        var landmarkSpace = game.landmarkSpaces.indexOf(newSpace);
        if(DEBUG_GAME) console.log(`landmarkSpace => '${landmarkSpace}'`);

        if(landmarkSpace != -1) {
            if(DEBUG_GAME) console.log(`landmarkSpace != -1 condition met`);

            setTimeout(function(){
                for (let i = 0; i < game.landmarks.length; i++) {
                    if(DEBUG_GAME) console.log(`game.landmarks[i].track => '${game.landmarks[i].track}'`);

                    if(game.landmarks[i].track == track) {
                        if(DEBUG_GAME) console.log(`match detected! ('${game.landmarks[i].track}')`);
                        
                        for (let j = 0; j < game.landmarks[i].details.length; j++) {
                            if(DEBUG_GAME) console.log(`game.landmarks[i].details[j].trackNum => '${game.landmarks[i].details[j].trackNum}'`);

                            if(game.landmarks[i].details[j].trackNum == newSpace && game.landmarks[i].details[j].available == 'true') {
                                if(DEBUG_GAME) console.log(`match detected! ('${game.landmarks[i].details[j].trackNum}')`);

                                if(DEBUG_GAME) console.log(`game.landmarks[i].details[j].buildingClass => '${game.landmarks[i].details[j].buildingClass}'`);

                                $(`.tapestryActionContainer .trackContainer .trackImageContainer #${game.landmarks[i].details[j].buildingClass}`).addClass('takenlandmark');

                                if($('#incomeAutomaCiv.iconoclastsCivContainer.iconoclastsActiveDiceRoll').length) iconoclastsCivBonusLandmarkAdj('add');

                                setTimeout(function(){
                                    $(`.tapestryActionContainer .trackContainer .trackImageContainer #${game.landmarks[i].details[j].buildingClass}`).remove();
                                }, 2000)

                                game.landmarks[i].details[j].available = 'false';
                                game.automaInfo.landmarks.push(game.landmarks[i].details[j].buildingClass);
                                game.automaInfo.scoringLandmarks++;
                                // recordedMoveDetails += '<p class="tapestryMoveLandmark">The ' + game.landmarks[i].details[j].buildingName + ' Landmark is reached on the ' + capitalizeFirstLetter(thisTrack) + ' track</p>';
                                break;
                            }
                        }
                        break;
                    }
                }

               if(game.currentMode == 'game') updateGame();

            }, 2500)
        }

        if(DEBUG_GAME) console.log(`newSpace => '${newSpace}'`);

        if(newSpace < 0) {
            if(DEBUG_GAME) console.log(`newSpace < 0 condition met`);

            $('#nextAction').removeClass('greyBtn').addClass('redBtn func-drawCard func-lockNextActionBtn');
            console.log(`PING 4`)

            if($('#incomeAutomaCiv.iconoclastsCivContainer.iconoclastsActiveDiceRoll').length) {
                let landmarksLeft = parseInt($('#incomeAutomaCiv.iconoclastsCivContainer.iconoclastsActiveDiceRoll .incomeActionInformationPanel .iconoclastsLeftInfo #iconoclastsTotalLandmarks').attr('landmarks'));
                if(landmarksLeft == 0) {
                    $('#incomeButton').removeClass('greyBtn').addClass('redBtn func-nextIncomeStep');
                    game.automaInfo.scoringLandmarks = 0;
                } else {
                    $('#iconoclastsCivBonusScienceDieRollBtn').removeClass('greyBtn').addClass('greenBtn actionScienceDice func-iconoclastsCivBonusScienceDieRoll');
                }
            } else {
                $('#incomeButton').removeClass('greyBtn').addClass('redBtn func-nextIncomeStep');
            }

            if(DEBUG_GAME) console.log(`game.cardsDrawn => '${game.cardsDrawn}'`);
            if(DEBUG_GAME) console.log(`deck.length => '${deck.length}'`);

            if(game.cardsDrawn == deck.length) {
                if(DEBUG_GAME) console.log(`game.cardsDrawn == deck.length condition met`);
                gameButtonDisplay('nextAction', false);
                gameButtonDisplay('incomeTurn', true);
                $('#automaInfo').removeClass('greyBtn').addClass('greenBtn func-showAutomaInfo');
            }

            let automaUnableToRegressHTML = '';

            if(DEBUG_GAME) console.log(`capitalizeFirstLetter(track) => '${capitalizeFirstLetter(track)}'`);

            if(mode == 'incomeAction' || mode == 'iconoclastsIncomeAction') {
                if(DEBUG_GAME) console.log(`mode == 'incomeAction' || mode == 'iconoclastsIncomeAction' condition met`);
                
                if($('.civBonus').length) {
                    if(DEBUG_GAME) console.log(`$('.civBonus').length condition met`);

                    automaUnableToRegressHTML = `
                        <div class="actionInformationPanel">
                            <p>The Automa cannot regress on the <span class="bold">${capitalizeFirstLetter(track)}</span> track so it does nothing.</p>
                            <div class="clearDiv"></div>
                        </div>
                    `;

                    $('.civBonus #incomeAutomaCiv').append(automaUnableToRegressHTML);

                } else if($('.dualCivBonus').length) {
                    if(DEBUG_GAME) console.log(`$('.dualCivBonus').length condition met`);

                    automaUnableToRegressHTML = `
                        <div class="actionInformationPanel">
                            <p>The Automa cannot regress on the <span class="bold">${capitalizeFirstLetter(track)}</span> track so it does nothing.</p>
                            <div class="clearDiv"></div>
                        </div>
                    `;

                    $('.dualCivBonus #incomeAutomaCiv').append(automaUnableToRegressHTML);

                }
            } else {
                if(DEBUG_GAME) console.log(`mode != 'incomeAction' || mode == 'iconoclastsIncomeAction' condition met`);

                automaUnableToRegressHTML = `
                    <div class="actionInformationPanel">
                        <p>The Automa cannot regress on the <span class="bold">${capitalizeFirstLetter(track)}</span> track so it does nothing.</p>
                        <div class="clearDiv"></div>
                    </div>
                `;

                $('.tapestryActionContainer').append(automaUnableToRegressHTML);

            }

            $('.actionInformationPanel').fadeIn();
            if(game.currentMode == 'game') updateGame();
            return;

        }

        if(DEBUG_GAME) console.log(`opponent => '${opponent}'`);

        if(opponent == 'automa') {
            if(DEBUG_GAME) console.log(`opponent == 'automa' condition met`);

            var currentAction = '';

            for (let i = 0; i < actionSpaces.length; i++) {
                if(DEBUG_GAME) console.log(`actionSpaces[i].track => '${actionSpaces[i].track}'`);
                if(actionSpaces[i].track == track){
                    if(DEBUG_GAME) console.log(`match detected! ('${actionSpaces[i].track}')`);
                    for (let j = 0; j < actionSpaces[i].details.length; j++) {
                        if(DEBUG_GAME) console.log(`actionSpaces[i].details[j].trackNum => '${actionSpaces[i].details[j].trackNum}'`);

                        // the code checks to see if an authorized action for the Automa is tied to the new space, and if not, to generate a message to say the Automa does not receive any benefits from the new space

                        if(actionSpaces[i].details[j].trackNum == newSpace) {
                            if(DEBUG_GAME) console.log(`match detected! ('${actionSpaces[i].details[j].trackNum}')`);
                            for (let k = 0; k < actionInfo.length; k++) {
                                if(DEBUG_GAME) console.log(`actionInfo[k].actionClass => '${actionInfo[k].actionClass}'`);
                                if(actionInfo[k].actionClass == actionSpaces[i].details[j].actionClass) {
                                    if(DEBUG_GAME) console.log(`match detected! ('${actionInfo[k].actionClass}')`);
                                    currentAction = JSON.parse(JSON.stringify(actionInfo[k]));
                                    if(DEBUG_GAME) console.log(`currentAction => '${currentAction}'`);
                                }
                            }
                            if(currentAction != '') break;
                        }
                    }
                    if(currentAction != '') break;
                }
            }

            if(DEBUG_GAME) console.log(`mode => '${mode}'`);
            if(DEBUG_GAME) console.log(`game.difficultyLevelNum => '${game.difficultyLevelNum}'`);

            if(DEBUG_GAME) console.log(`currentAction:`);
            if(DEBUG_GAME) console.log(currentAction);

            if(mode == 'normal' || mode == 'difficultySetup') {
                if(DEBUG_GAME) console.log(`mode == 'normal' || mode == 'difficultySetup' condition met`);

                if(currentAction == '' || currentAction.actionClass == 'exploreAction' || currentAction.actionClass == 'exploreAnywhereAction' || currentAction.actionClass == 'conquerAction' || currentAction.actionClass == 'conquerAnywhereAction' || currentAction.actionClass == 'tapestryCard' || currentAction.actionClass == 'conquerAndTapestryAction' || currentAction.actionClass == 'technologyCardAction' || currentAction.actionClass == 'masterpieceAction') {
                    if(DEBUG_GAME) console.log(`currentAction.actionClass == '${currentAction.actionClass}' condition met`);

                    setTimeout(function(){
                        $('#nextAction').removeClass('greyBtn').addClass('redBtn func-drawCard func-lockNextActionBtn');
                        console.log(`PING 5`)

                        if(mode == 'difficultySetup') {
                            if(DEBUG_GAME) console.log(`mode == 'difficultySetup' condition met`);
                            if(game.difficultyLevelNum != '5'){
                                if(DEBUG_GAME) console.log(`game.difficultyLevelNum != '5' condition met`);
                                if($('#incomeAutomaCiv.iconoclastsCivContainer.iconoclastsActiveDiceRoll').length) {
                                    let landmarksLeft = parseInt($('#incomeAutomaCiv.iconoclastsCivContainer.iconoclastsActiveDiceRoll .incomeActionInformationPanel .iconoclastsLeftInfo #iconoclastsTotalLandmarks').attr('landmarks'));
                                    if(landmarksLeft == 0) {
                                        $('#incomeButton').removeClass('greyBtn').addClass('redBtn func-nextIncomeStep');
                                    } else {
                                        $('#iconoclastsCivBonusScienceDieRollBtn').removeClass('greyBtn').addClass('greenBtn actionScienceDice func-iconoclastsCivBonusScienceDieRoll');
                                    }
                                
                                } else {
                                    $('#incomeButton').removeClass('greyBtn').addClass('redBtn func-nextIncomeStep');
                                }
                            }
                        } else {
                            if(DEBUG_GAME) console.log(`mode != 'difficultySetup' condition met`);
                            if($('#incomeAutomaCiv.iconoclastsCivContainer.iconoclastsActiveDiceRoll').length) {
                                let landmarksLeft = parseInt($('#incomeAutomaCiv.iconoclastsCivContainer.iconoclastsActiveDiceRoll .incomeActionInformationPanel .iconoclastsLeftInfo #iconoclastsTotalLandmarks').attr('landmarks'));
                                if(landmarksLeft == 0) {
                                    $('#incomeButton').removeClass('greyBtn').addClass('redBtn func-nextIncomeStep');
                                } else {
                                    $('#iconoclastsCivBonusScienceDieRollBtn').removeClass('greyBtn').addClass('greenBtn actionScienceDice func-iconoclastsCivBonusScienceDieRoll');
                                }
                            
                            } else {
                                $('#incomeButton').removeClass('greyBtn').addClass('redBtn func-nextIncomeStep');
                            }
                        }

                        if(DEBUG_GAME) console.log(`game.cardsDrawn => '${game.cardsDrawn}'`);
                        if(DEBUG_GAME) console.log(`deck.length => '${deck.length}'`);
        
                        if(game.cardsDrawn == deck.length) {
                            if(DEBUG_GAME) console.log(`game.cardsDrawn == deck.length condition met`);
                            gameButtonDisplay('nextAction', false);
                            gameButtonDisplay('incomeTurn', true);
                            $('#automaInfo').removeClass('greyBtn').addClass('greenBtn func-showAutomaInfo');
                        }

                       if(game.currentMode == 'game') updateGame();

                       if(endOfTrackAchievement.length != 0) {
                            if(DEBUG_GAME) console.log(`endOfTrackAchievement.length != 0 condition met`);                            
                            checkEndOfTrackAchievementPopup();
                        }
            
                    }, fullAnimationTime - 100);

                }
            }

            var actionInformationPanelTime = 0;

            if(mode == 'normal' || mode == 'difficultySetup') {
                if(DEBUG_GAME) console.log(`mode == 'normal' || mode == 'difficultySetup' condition met`);

                if(DEBUG_GAME) console.log(`firstCardOfEra => '${firstCardOfEra}'`);

                if(firstCardOfEra == 'true') {
                    if(DEBUG_GAME) console.log(`firstCardOfEra == 'true' condition met`);
                    actionInformationPanelTime = 2700;
                } else if(firstCardOfEra == 'false') {
                    if(DEBUG_GAME) console.log(`firstCardOfEra == 'false' condition met`);
                    actionInformationPanelTime = 3000;
                }

            } else if(mode == 'extraAction' || mode == 'incomeAction' || mode == 'iconoclastsIncomeAction') {
                if(DEBUG_GAME) console.log(`mode == 'extraAction' || mode == 'incomeAction' || mode == 'iconoclastsIncomeAction' condition met`);

                if(DEBUG_GAME) console.log(`currentAction.actionClass => '${currentAction.actionClass}'`);

                if(currentAction == '' || currentAction.actionClass == 'exploreAction' || currentAction.actionClass == 'exploreAnywhereAction' || currentAction.actionClass == 'conquerAction' || currentAction.actionClass == 'conquerAnywhereAction' || currentAction.actionClass == 'tapestryCard' || currentAction.actionClass == 'conquerAndTapestryAction' || currentAction.actionClass == 'technologyCardAction' || currentAction.actionClass == 'masterpieceAction') {
                    if(DEBUG_GAME) console.log(`currentAction.actionClass == '${currentAction.actionClass}' condition met`);

                    actionInformationPanelTime = 2700;
                    setTimeout(function(){
                        $('#nextAction').removeClass('greyBtn').addClass('redBtn func-drawCard func-lockNextActionBtn');
                        console.log(`PING 6`)

                        if($('#incomeAutomaCiv.iconoclastsCivContainer.iconoclastsActiveDiceRoll').length) {

                            let landmarksLeft = parseInt($('#incomeAutomaCiv.iconoclastsCivContainer.iconoclastsActiveDiceRoll .incomeActionInformationPanel .iconoclastsLeftInfo #iconoclastsTotalLandmarks').attr('landmarks'));

                            if(landmarksLeft == 0) {
                                $('#incomeButton').removeClass('greyBtn').addClass('redBtn func-nextIncomeStep');
                            } else {
                                $('#iconoclastsCivBonusScienceDieRollBtn').removeClass('greyBtn').addClass('greenBtn actionScienceDice func-iconoclastsCivBonusScienceDieRoll');
                            }

                        } else {
                            $('#incomeButton').removeClass('greyBtn').addClass('redBtn func-nextIncomeStep');
                        }

                        if(DEBUG_GAME) console.log(`game.cardsDrawn => '${game.cardsDrawn}'`);
                        if(DEBUG_GAME) console.log(`deck.length => '${deck.length}'`);

                        if(game.cardsDrawn == deck.length) {
                            if(DEBUG_GAME) console.log(`game.cardsDrawn == deck.length condition met`);
                            gameButtonDisplay('nextAction', false);
                            gameButtonDisplay('incomeTurn', true);
                            $('#automaInfo').removeClass('greyBtn').addClass('greenBtn func-showAutomaInfo');
                        }

                       if(game.currentMode == 'game') updateGame();

                        if(endOfTrackAchievement.length != 0) {
                            if(DEBUG_GAME) console.log(`endOfTrackAchievement.length != 0 condition met`);                            
                            checkEndOfTrackAchievementPopup();
                        }

                    }, actionInformationPanelTime);
                }

            }

            if(currentAction != '') {
                if(DEBUG_GAME) console.log(`currentAction != '' condition met`);

                if(DEBUG_GAME) console.log(`benefits => '${benefits}'`);
                if(DEBUG_GAME) console.log(`currentAction.actionName => '${currentAction.actionName}'`);

                if(benefits == 'true') {
                    if(DEBUG_GAME) console.log(`benefits == 'true' condition met`);
                    recordedMoveDetails += `<span class="italic">${currentAction.actionName}</span></p>`;
                } else if(benefits == 'false') {
                    if(DEBUG_GAME) console.log(`benefits == 'false' condition met`);
                    recordedMoveDetails += `<span class="italic">No Benefits</span></p>`;
                }

                setTimeout(function(){
                    
                    if(DEBUG_GAME) console.log(`benefits => '${benefits}'`);
                    if(DEBUG_GAME) console.log(`currentAction.actionName => '${currentAction.actionName}'`);
                    if(DEBUG_GAME) console.log(`currentAction.actionClass => '${currentAction.actionClass}'`);
                    if(DEBUG_GAME) console.log(`currentAction.actionDesc => '${currentAction.actionDesc}'`);

                    if(benefits == 'true') {
                        if(DEBUG_GAME) console.log(`benefits == 'true' condition met`);
                        
                        if(mode == 'incomeAction' || mode == 'iconoclastsIncomeAction') {
                            if(DEBUG_GAME) console.log(`mode == 'incomeAction' condition met`);
                            if($('.civBonus').length) {
                                if(DEBUG_GAME) console.log(`$('.civBonus').length condition met`);
                                $('.civBonus #incomeAutomaCiv').append(`
                                <div class="actionInformationPanel ${currentAction.actionClass}Move${game.automaInfo.firstCivSpecs.civID == "hucksters" || game.difficultyLevelNum == "5" && game.automaInfo.secondCivSpecs.civID == "hucksters" ? ' huckstersAutomaCivMode' : ''}">
                                    ${currentAction.actionDesc}
                                    <div class="clearDiv"></div>
                                </div>`
                                );
                            } else if($('.dualCivBonus').length) {
                                if(DEBUG_GAME) console.log(`$('.dualCivBonus').length condition met`);
                                $('.dualCivBonus #incomeAutomaCiv').append(`
                                <div class="actionInformationPanel ${currentAction.actionClass}Move${game.automaInfo.firstCivSpecs.civID == "hucksters" || game.difficultyLevelNum == "5" && game.automaInfo.secondCivSpecs.civID == "hucksters" ? ' huckstersAutomaCivMode' : ''}">
                                    ${currentAction.actionDesc}
                                    <div class="clearDiv"></div>
                                </div>`
                                );
                            }
                        } else {
                            if(DEBUG_GAME) console.log(`mode != 'incomeAction' || mode != 'iconoclastsIncomeAction' condition met`);
                            $('.tapestryActionContainer').append(`
                            <div class="actionInformationPanel ${currentAction.actionClass}Move${game.automaInfo.firstCivSpecs.civID == "hucksters" || game.difficultyLevelNum == "5" && game.automaInfo.secondCivSpecs.civID == "hucksters" ? ' huckstersAutomaCivMode' : ''}">
                                ${currentAction.actionDesc}
                                <div class="clearDiv"></div>
                            </div>`
                            );
                        }

                        if(currentAction.actionClass == 'exploreAction' || currentAction.actionClass == 'exploreAnywhereAction' || currentAction.actionClass == 'conquerAction' || currentAction.actionClass == 'conquerAnywhereAction' || currentAction.actionClass == 'conquerAndTapestryAction') {
                            if(DEBUG_GAME) console.log(`currentAction.actionClass = '${currentAction.actionClass}' condition met`);
                            if(mode != 'difficultySetup') {
                                if(DEBUG_GAME) console.log(`mode != 'difficultySetup' condition met`);
                                $('.extraTiebreakers .mapTiebreaker').append(`<img src="img/mapTiebreaker/${game.firstCardInfo.mapTiebreaker}.png" />`);
                            } else {
                                if(DEBUG_GAME) console.log(`mode == 'difficultySetup' condition met`);
                                let tiebreakerCardResult = Math.floor(Math.random()*21);
                                if(DEBUG_GAME) console.log(`tiebreakerCardResult => '${tiebreakerCardResult}'`);

                                game.firstCardInfo = JSON.parse(JSON.stringify(cards[tiebreakerCardResult]));    
                                if(DEBUG_GAME) console.log(`cards[tiebreakerCardResult].mapTiebreaker => '${cards[tiebreakerCardResult].mapTiebreaker}'`);
                                if(DEBUG_GAME) console.log(`parseInt(tiebreakerCardResult + 1) => '${parseInt(tiebreakerCardResult + 1)}'`);

                                $('.extraTiebreakers .mapTiebreaker').append(`<img src="img/mapTiebreaker/${cards[tiebreakerCardResult].mapTiebreaker}.png" />`);
                                $('.militaryExtraTiebreakers.extraTiebreakers').prepend(`<p style="text-align:center!important;">Decision Card #${parseInt(tiebreakerCardResult + 1)}</p>`);

                                if(DEBUG_GAME) console.log(`cards[tiebreakerCardResult].topple => '${cards[tiebreakerCardResult].topple}'`);

                                if(cards[tiebreakerCardResult].topple == 'true') {
                                    if(DEBUG_GAME) console.log(`cards[tiebreakerCardResult].topple == 'true' condition met`);
                                    $('.extraTiebreakers .toppleIndicator').append('<img src="img/topple.png" />');
                                } else if(cards[tiebreakerCardResult].topple == 'false') {
                                    if(DEBUG_GAME) console.log(`cards[tiebreakerCardResult].topple == 'false' condition met`);
                                    $('.extraTiebreakers .toppleIndicator').append('<img src="img/toppleNone.png" />');
                                }
                            }
                        }

                        if(currentAction.actionClass == 'exploreAction' || currentAction.actionClass == 'exploreAnywhereAction') {
                            if(DEBUG_GAME) console.log(`currentAction.actionClass == '${currentAction.actionClass}' condition met`);

                            if(DEBUG_GAME) console.log(`currentAction.actionClass => '${currentAction.actionClass}'`);
                            if(DEBUG_GAME) console.log(`game.automaInfo.favTrack => '${game.automaInfo.favTrack}'`);

                            $('.extraTiebreakers .favTrackDecider').html(`<img class="favTrackImg" src="img/automaFavTrack.png"><p class="bold"> = </p><img class="favTrackIconImg" src="img/tracks/${game.automaInfo.favTrack}Icon.png" />`);
                        }

                        if(currentAction.actionClass == 'conquerAction' || currentAction.actionClass == 'conquerAnywhereAction' || currentAction.actionClass == 'conquerAndTapestryAction') {
                            if(DEBUG_GAME) console.log(`currentAction.actionClass == '${currentAction.actionClass}' condition met`);

                            if(DEBUG_GAME) console.log(`currentAction.actionClass => '${currentAction.actionClass}'`);

                            if(DEBUG_GAME) console.log(`mode => '${mode}'`);
                            if(DEBUG_GAME) console.log(`game.firstCardInfo.topple => '${game.firstCardInfo.topple}'`);

                            if(mode != 'difficultySetup') {
                                if(DEBUG_GAME) console.log(`mode != 'difficultySetup' condition met`);
                                if(game.firstCardInfo.topple == 'true') {
                                    if(DEBUG_GAME) console.log(`game.firstCardInfo.topple == 'true' condition met`);
                                    $('.extraTiebreakers .toppleIndicator').append('<img src="img/topple.png" />');
                                } else if(game.firstCardInfo.topple == 'false') {
                                    if(DEBUG_GAME) console.log(`game.firstCardInfo.topple == 'false' condition met`);
                                    $('.extraTiebreakers .toppleIndicator').append('<img src="img/toppleNone.png" />');
                                }
                            }   
                        }

                        // if(currentAction.actionClass == 'scienceDiceNoBenefitsAction' || currentAction.actionClass == 'scienceDiceBenefitsAction' || currentAction.actionClass == 'advanceMilitaryTechnologyExplorationAction' || currentAction.actionClass == 'regressMilitaryTechnologyAction' || currentAction.actionClass == 'advanceTwiceMilitaryTechnologyExplorationAction') {
                        //     setTimeout(function(){
                            
                        //         $('#nextAction').removeClass('redBtn func-drawCard func-lockNextActionBtn').addClass('greyBtn')
                        console.log(`PING 7`)
                        //         $('#incomeTurn').removeClass('redBtn func-shuffleDeck-game func-manualActionRoundCleanup').addClass('greyBtn')
                        //     }, 100)
                        // }

                    } else if(benefits == 'false') {
                        if(DEBUG_GAME) console.log(`benefits == 'false' condition met`);

                        game.scienceDieMove = 'true';

                        let automaIgnoresBenefitsHTML = `
                            <div class="actionInformationPanel noBenefitsMove">
                                <div class="mainActionArea">
                                    <img class="actionImage" src="img/actions/diceNoBenefits.png" />
                                    <p class="actionDescription">The Automa <span class="bold">does not</span> receive the benefits from this move.</p>
                                    <div class="clearDiv"></div>
                                </div>
                        `;

                        $('.tapestryActionContainer').append(automaIgnoresBenefitsHTML);
                    }

                    $('.actionInformationPanel').fadeIn();
                    if(game.currentMode == 'game') updateGame();
                    
                    if(mode == 'extraAction' || mode == 'incomeAction' || mode == 'iconoclastsIncomeAction') {
                        if(endOfTrackAchievement.length != 0) {
                            if(DEBUG_GAME) console.log(`endOfTrackAchievement.length != 0 condition met`);                        
                            checkEndOfTrackAchievementPopup();
                        }
                    }

                }, actionInformationPanelTime);

            } else {
                if(DEBUG_GAME) console.log(`currentAction == '' condition met`);

                recordedMoveDetails += '<span class="italic">No Action</span></p>';

                setTimeout(function(){

                    if(mode == 'incomeAction' || mode == 'iconoclastsIncomeAction') {
                        if(DEBUG_GAME) console.log(`mode == 'incomeAction' condition met`);

                        if($('.civBonus').length) {
                            if(DEBUG_GAME) console.log(`$('.civBonus').length condition met`);

                            let automaIgnoresBenefitsHTML = `
                                <div class="actionInformationPanel noAutomaMove">
                                    <div class="mainActionArea">
                                        <p class="actionDescription">The Automa ignores the benefits<br />of this action space.</p>
                                        <div class="clearDiv"></div>
                                    </div>
                            `;

                            $('.civBonus #incomeAutomaCiv').append(automaIgnoresBenefitsHTML);

                        } else if($('.dualCivBonus').length) {
                            if(DEBUG_GAME) console.log(`$('.dualCivBonus').length condition met`);

                            let automaIgnoresBenefitsHTML = `
                                <div class="actionInformationPanel noAutomaMove">
                                    <div class="mainActionArea">
                                        <p class="actionDescription">The Automa ignores the benefits<br />of this action space.</p>
                                        <div class="clearDiv"></div>
                                    </div>
                            `;

                            $('.dualCivBonus #incomeAutomaCiv').append(automaIgnoresBenefitsHTML);

                        }
                    } else {
                        if(DEBUG_GAME) console.log(`mode != 'incomeAction' || mode != 'iconoclastsIncomeAction' condition met`);

                        let automaIgnoresBenefitsHTML = `
                            <div class="actionInformationPanel noAutomaMove">
                                <div class="mainActionArea">
                                    <p class="actionDescription">The Automa ignores the benefits<br />of this action space.</p>
                                    <div class="clearDiv"></div>
                                </div>
                        `;

                        $('.tapestryActionContainer').append(automaIgnoresBenefitsHTML);
                    }

                    $('.actionInformationPanel').fadeIn();

                    if(game.currentMode == 'game') updateGame();

                    if(mode == 'incomeAction' || mode == 'extraAction' || mode == 'iconoclastsIncomeAction') {
                        if(endOfTrackAchievement.length != 0) {
                            if(DEBUG_GAME) console.log(`endOfTrackAchievement.length != 0 condition met`);                        
                            checkEndOfTrackAchievementPopup();
                        }
                    }

                }, actionInformationPanelTime);
            }
        } // end of opponent == 'automa'

        if(DEBUG_GAME) console.log(`opponent == '${opponent}'`);
        if(DEBUG_GAME) console.log(`mode == '${mode}'`);

        if(opponent == 'automa') {
            if(DEBUG_GAME) console.log(`opponent == 'automa' condition met`);

            if(mode == 'extraAction' || mode == 'incomeAction' || mode == 'iconoclastsIncomeAction') {
                if(DEBUG_GAME) console.log(`mode == 'extraAction' || mode == 'incomeAction' || mode == 'iconoclastsIncomeAction' condition met`);
                setTimeout(function(){
                    if(endOfTrackAchievement.length != 0) {
                        if(DEBUG_GAME) console.log(`endOfTrackAchievement.length != 0 condition met`);                        
                        checkEndOfTrackAchievementPopup();
                    }
                }, 2500);
            }

        } else if(opponent == 'shadowEmpire') {
            if(DEBUG_GAME) console.log(`opponent == 'shadowEmpire' condition met`);
            if(mode == 'normal') {
                if(DEBUG_GAME) console.log(`mode == 'normal' condition met`);
                setTimeout(function(){
                    if(endOfTrackAchievement.length != 0) {
                        if(DEBUG_GAME) console.log(`endOfTrackAchievement.length != 0 condition met`);                        
                        checkEndOfTrackAchievementPopup();
                    }
                }, 2500);
            }
        }

    }
    recordMove(recordedMoveDetails, 'custom', 'add');
}

function checkEndOfTrackAchievementPopup() {
    // CLEAR ARRAY TO AVOID FALSE NOTIFICATIONS!!
    // endOfTrackAchievement = [];

    if(DEBUG_GAME) console.log(`endOfTrackAchievement[0] = "${endOfTrackAchievement[0]}"`);

    let positionAndOpponentSplit = endOfTrackAchievement[0].split('-');

    let thisPosition = positionAndOpponentSplit[0];
    if(DEBUG_GAME) console.log(`thisPosition = "${thisPosition}"`);


    let thisOpponent = `${positionAndOpponentSplit[1] == 'shadowEmpire' ? 'Shadow Empire' : 'Automa'}`;
    if(DEBUG_GAME) console.log(`thisOpponent = "${thisOpponent}"`);

    let thisTrackName = `${capitalizeFirstLetter(positionAndOpponentSplit[2])}`;

    var checkEndOfTrackAchievementPopupHTML = `
        <div class="confirmationBox alertEl actionTypeAlertBox checkEndOfTrackAchievementPopup">
            <p>The ${thisOpponent} has reached the end of the <span class="bold">${thisTrackName}</span> track.</p>
            <p>Do they gain <span class="bold">${thisPosition}</span> place for the end of track achievement?</p>
            <div class="buttons" btns="2">
                <a href="#" class="btn redBtn keepOpen func-confirmEndOfTrackAchievement-false+${thisPosition}+${positionAndOpponentSplit[1]}">No</a>
                <a href="#" class="btn greenBtn keepOpen func-confirmEndOfTrackAchievement-true+${thisPosition}+${positionAndOpponentSplit[1]}">Yes</a>
            </div>
        </div>
    `;

    $(checkEndOfTrackAchievementPopupHTML).appendTo('body');
    $('.confirmationBox.actionTypeAlertBox.checkEndOfTrackAchievementPopup').fadeIn();
    $('#resetOverlay').fadeIn();
    $('#resetOverlay').addClass('keepOpen');
}

function confirmEndOfTrackAchievement(result, position, opponent) {

    if(DEBUG_GAME) console.log(`result = "${result}"`);
    if(DEBUG_GAME) console.log(`position = "${position}"`);
    if(DEBUG_GAME) console.log(`opponent = "${opponent}"`);

    $('.confirmationBox.actionTypeAlertBox.checkEndOfTrackAchievementPopup').fadeOut();

    setTimeout(function(){
        $('.confirmationBox.actionTypeAlertBox.checkEndOfTrackAchievementPopup').remove();
    }, 600);

    if(result == 'true') {
        if(DEBUG_GAME) console.log(`result == 'true' condition met`);
        if(position == 'first') {
            if(DEBUG_GAME) console.log(`position == 'first' condition met`);
            game.achievements.endOfTrack[0] = opponent;
        } else if(position == 'second') {
            if(DEBUG_GAME) console.log(`position == 'second' condition met`);
            game.achievements.endOfTrack[1] = opponent;
        }
        endOfTrackBotAchievementPopup(opponent, position);
    } else if(result == 'false') {
        if(DEBUG_GAME) console.log(`result == 'false' condition met`);
        if(position == 'first') {
            if(DEBUG_GAME) console.log(`position == 'first' condition met`);
            game.achievements.endOfTrack[0] = 'human';
            game.achievements.endOfTrack[1] = opponent;
            endOfTrackBotAchievementPopup(opponent, 'second');
        } else {
            if(DEBUG_GAME) console.log(`position != 'first' condition met`);
            game.achievements.endOfTrack[1] = 'human';
            endOfTrackAchievement = [];
            closeOverlays();
        }
    }
}

function endOfTrackBotAchievementPopup(opponent, position) {

    if(DEBUG_GAME) console.log(`position = "${position}"`);
    if(DEBUG_GAME) console.log(`opponent = "${opponent}"`);

    var endOfTrackAIAchievementInfoHTML = '';
    if(position == 'first') {
        if(DEBUG_GAME) console.log(`position == 'first' condition met`);
        if(opponent == 'automa') {
            if(DEBUG_GAME) console.log(`opponent == 'automa' condition met`);
            game.achievements.endOfTrack[0] = 'automa';
            if(endOfTrackAchievement.length == 1) {
                if(DEBUG_GAME) console.log(`endOfTrackAchievement.length == 1 condition met`);
                game.incomePoints.total = game.incomePoints.total + 10;
                
                endOfTrackAIAchievementInfoHTML = `
                    <div class="confirmationBox alertEl actionTypeAlertBox endOfTrackAIAchievementInfo">
                        <p>Place one of the Automas cubes on <span class="bold">1st place</span> for the <span class="bold">"Complete any advancement track"</span> achievement & add <span class="bold underline">10 VP</span> to its current score.</p>
                        <p style="text-align:center;margin: 30px 0px;">New score: <span class="bold underline">${game.incomePoints.total} VP</p>
                        <p class="italic">Remember, the Shadow Empire can still qualify for second position, but doesn't receive any VP by doing so.</p>
                        <div class="buttons" btns="1">
                            <a href="#" class="btn redBtn">Close</a>
                        </div>
                    </div>
                `;
            } else if(endOfTrackAchievement.length == 2) {
                if(DEBUG_GAME) console.log(`endOfTrackAchievement.length == 2 condition met`);
                game.incomePoints.total = game.incomePoints.total + 10;

                game.achievements.endOfTrack[1] = 'shadowEmpire';
                endOfTrackAIAchievementInfoHTML = `
                    <div class="confirmationBox alertEl actionTypeAlertBox endOfTrackAIAchievementInfo">
                        <p>Place one of the Automas cubes on <span class="bold">1st place</span> for the <span class="bold">"Complete any advancement track"</span> achievement & add <span class="bold underline">10 VP</span> to its current score.</p>
                        <p style="text-align:center;margin: 30px 0px;">New score: <span class="bold underline">${game.incomePoints.total} VP</p>
                        <p>Then place one of the Shadow Empires cubes on <span class="bold">2nd place</span> but <span class="underline">don't</span> give it any VP.</p>
                        <div class="buttons" btns="1">
                            <a href="#" class="btn redBtn">Close</a>
                        </div>
                    </div>
                `;
            }

        } else if(opponent == 'shadowEmpire') {
            if(DEBUG_GAME) console.log(`opponent == 'shadowEmpire' condition met`);
            game.achievements.endOfTrack[0] = 'shadowEmpire';
            endOfTrackAIAchievementInfoHTML = `
                <div class="confirmationBox alertEl actionTypeAlertBox endOfTrackAIAchievementInfo">
                <p>Place one of the Shadow Empires cubes on <span class="bold">1st place</span> for the <span class="bold">"Complete any advancement track"</span> achievement but <span class="underline">don't</span> give it any VP.</p>
                    <div class="buttons" btns="1">
                        <a href="#" class="btn redBtn">Close</a>
                    </div>
                </div>
            `;
        }
    } else if(position == 'second') {
        if(DEBUG_GAME) console.log(`position == 'second' condition met`);
        if(opponent == 'automa') {
            game.achievements.endOfTrack[1] = 'automa';
            game.incomePoints.total = game.incomePoints.total + 5;
            endOfTrackAIAchievementInfoHTML = `
                <div class="confirmationBox alertEl actionTypeAlertBox endOfTrackAIAchievementInfo">
                <p>Place one of the Automas cubes on <span class="bold">2nd place</span> for the <span class="bold">"Complete any advancement track"</span> achievement & add <span class="bold underline">5 VP</span> to its current score.</p>
                <p style="text-align:center;margin: 30px 0px;">New score: <span class="bold underline">${game.incomePoints.total} VP</p>
                    <div class="buttons" btns="1">
                        <a href="#" class="btn redBtn">Close</a>
                    </div>
                </div>
            `;
        } else if(opponent == 'shadowEmpire') {
            if(DEBUG_GAME) console.log(`opponent == 'shadowEmpire' condition met`);
            game.achievements.endOfTrack[1] = 'shadowEmpire';
            endOfTrackAIAchievementInfoHTML = `
                <div class="confirmationBox alertEl actionTypeAlertBox endOfTrackAIAchievementInfo">
                <p>Place one of the Shadow Empires cubes on <span class="bold">2nd place</span> for the <span class="bold">"Complete any advancement track"</span> achievement but <span class="underline">don't</span> give it any VP.</p>
                    <div class="buttons" btns="1">
                        <a href="#" class="btn redBtn">Close</a>
                    </div>
                </div>
            `;
        }
    }

    setTimeout(function(){
        $(endOfTrackAIAchievementInfoHTML).appendTo('body');
        $('.confirmationBox.actionTypeAlertBox.endOfTrackAIAchievementInfo').fadeIn();
    }, 300);

    setTimeout(function(){
        endOfTrackAchievement = [];
    }, 400);
    
}

function iconoclastsCivBonusLandmarkAdj(mode) {

    if(DEBUG_GAME) console.log(`mode = "${mode}"`);
    
    // mode == add / remove
    let landmarksNum = parseInt($('#iconoclastsTotalLandmarks').attr(`landmarks`));

    if(DEBUG_GAME) console.log(`landmarksNum = "${landmarksNum}"`);

    let newLandmarksNum = 0;

    mode == `remove` ? newLandmarksNum = landmarksNum - 1 : newLandmarksNum = landmarksNum + 1;

    if(DEBUG_GAME) console.log(`newLandmarksNum = "${newLandmarksNum}"`);

    $('#iconoclastsTotalLandmarks').attr(`landmarks`, newLandmarksNum);

    $('#iconoclastsTotalLandmarks .landmarksNumAdj').html(`${mode == `remove` ? `-` : `+`}1`);
    $('#iconoclastsTotalLandmarks .landmarksNumAdj').addClass(`${mode}LandmarkColor`);

    setTimeout(function(){
        $('#iconoclastsTotalLandmarks .landmarksNumAdj').addClass(`${mode}Landmark`);
    }, 60);

    setTimeout(function(){
        $('#iconoclastsTotalLandmarks .landmarksNum').html(newLandmarksNum);
    }, 1000);

    setTimeout(function(){
        $('#iconoclastsTotalLandmarks .landmarksNumAdj').removeClass(`addLandmark removeLandmark`);
    }, 1300);

    setTimeout(function(){
        $('#iconoclastsTotalLandmarks .landmarksNumAdj').removeClass(`addLandmarkColor removeLandmarkColor`);
    }, 2500);
}

function iconoclastsCivBonusScienceDieRoll() {
    
    if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
    if(DEBUG_GAME) console.log(`iconoclastsCivBonusScienceDieRoll() func triggered`);

    let $iconoclastsScienceDie = $('#incomeAutomaCiv.iconoclastsCivContainer .incomeActionInformationPanel .iconoclastsRightInfo .iconoclastsScienceDieRoll .scienceDieToRoll');

    game.automaInfo.incomeBonusVPs.amount++;
	game.automaInfo.incomeBonusVPs.total = game.automaInfo.incomeBonusVPs.total + 3;

    if(DEBUG_GAME) console.log(`game.automaInfo.incomeBonusVPs.amount = "${game.automaInfo.incomeBonusVPs.amount}"`);
    if(DEBUG_GAME) console.log(`game.automaInfo.incomeBonusVPs.total = "${game.automaInfo.incomeBonusVPs.total}"`);

    if(!$('.iconoclastsActiveDiceRoll').length) {
        if(DEBUG_GAME) console.log(`if $('.iconoclastsActiveDiceRoll').length == false condition met`);
        $('#incomeAutomaCiv.iconoclastsCivContainer .incomeActionInformationPanel').append()
        $('#incomeAutomaCiv.iconoclastsCivContainer').addClass('iconoclastsActiveDiceRoll');
        $('#incomeAutomaCiv.iconoclastsCivContainer .iconoclastsLeftInfo').html('');
        $('#iconoclastsTotalLandmarks').appendTo('#incomeAutomaCiv.iconoclastsCivContainer .iconoclastsLeftInfo');
        $('#incomeAutomaCiv.iconoclastsCivContainer.iconoclastsActiveDiceRoll .incomeActionInformationPanel').after('<div id="iconoclastsChosenTrack"></div><div class="tapestryActionContainer"></div>');
    } else {
        if(DEBUG_GAME) console.log(`if $('.iconoclastsActiveDiceRoll').length == true condition met`);
        $('#incomeAutomaCiv.iconoclastsCivContainer .tapestryActionContainer').fadeOut();
        $('#incomeAutomaCiv.iconoclastsCivContainer .actionInformationPanel').fadeOut();
        $iconoclastsScienceDie.removeClass('animateDice');
        $iconoclastsScienceDie.offsetWidth = $iconoclastsScienceDie.offsetWidth; // triggers reflow
        $iconoclastsScienceDie.removeClass('rollDice');
    }

    var allTracksValid = false;
    let validIconoclastTracks = [];

    $('#iconoclastsCivBonusScienceDieRollBtn').removeClass('greenBtn actionScienceDice func-iconoclastsCivBonusScienceDieRoll').addClass('greyBtn');

    // check tracks that Automa hasnt reached the end of
    for (let i = 0; i < game.automaInfo.trackPos.length; i++) {
        if(game.automaInfo.trackPos[i] != 12) {
            validIconoclastTracks.push(game.tracks[i]);
            if(DEBUG_GAME) console.log(`Valid track = ${game.tracks[i]}`);
        }
    }

    if(validIconoclastTracks.length == 4) {
        if(DEBUG_GAME) console.log(`if validIconoclastTracks.length == 4 condition met`);
        allTracksValid = true;
    }

    iconoclastsCivBonusLandmarkAdj('remove');

    setTimeout(function(){
        $iconoclastsScienceDie.addClass('animateDice');
        setTimeout(function(){
            $iconoclastsScienceDie.addClass('rollDice');
        }, 50);
        
        setTimeout(function(){

            if(allTracksValid) {

                if(DEBUG_GAME) console.log(`allTracksValid == true condition met`);

                let dieResult = Math.floor(Math.random() * game.tracks.length);
                let chosenTrack = game.tracks[dieResult];
                $iconoclastsScienceDie.removeClass('noFavTrack explorationFavTrack militaryFavTrack technologyFavTrack scienceFavTrack artsFavTrack').addClass(`${chosenTrack}FavTrack`);

                $('#incomeAutomaCiv.iconoclastsCivContainer.iconoclastsActiveDiceRoll #iconoclastsChosenTrack').html(`
                    <p>The <span class="bold">${capitalizeFirstLetter(chosenTrack)}</span> track has been rolled!</p>
                `);

                $('#incomeAutomaCiv.iconoclastsCivContainer.iconoclastsActiveDiceRoll #iconoclastsChosenTrack').fadeIn();

                $('.actionDescription').html();
                
                setTimeout(function(){
                    $('#incomeAutomaCiv.iconoclastsCivContainer.iconoclastsActiveDiceRoll #iconoclastsChosenTrack').fadeOut();
                    $('#automaMove.trackContainer').fadeOut();
                    $('.actionInformationPanel').fadeOut();
                    setTimeout(function(){ 
                        $('#automaMove.trackContainer').remove();
                        $('.actionInformationPanel').remove();
                        animateTrackMove('automa', chosenTrack, 'advance', 'iconoclastsIncomeAction', 'true', 1);
                    }, automaTimeout);
                    setTimeout(function(){ 
                        $('#incomeAutomaCiv.iconoclastsCivContainer .tapestryActionContainer').fadeIn();
                    }, automaTimeout + 50);

                }, 1200)

            } else if(!allTracksValid){
                if(DEBUG_GAME) console.log(`allTracksValid == false condition met`);
                
                let multipleTrackIndexes = [];

                for (let i = 0; i < validIconoclastTracks.length; i++) {
                    multipleTrackIndexes.push(game.tracks.indexOf(validIconoclastTracks[i]));
                }

                var dieResult = 'none';

                while(dieResult == 'none'){  
                    var dieRoll = Math.floor(Math.random() * game.tracks.length);
                    if(multipleTrackIndexes.includes(dieRoll)) dieResult = dieRoll;
                }

                $('.scienceDieToRoll.rollDice').removeClass('noFavTrack explorationFavTrack militaryFavTrack technologyFavTrack scienceFavTrack artsFavTrack').addClass(`${game.tracks[dieResult]}FavTrack`);
                if(DEBUG_GAME) console.log(`game.tracks[dieResult] => '${game.tracks[dieResult]}'`);

                var chosenTrack = game.tracks[dieResult];
                if(DEBUG_GAME) console.log(`chosenTrack => '${chosenTrack}'`);

                $('#incomeAutomaCiv.iconoclastsCivContainer.iconoclastsActiveDiceRoll #iconoclastsChosenTrack').html(`
                    <p>The <span class="bold">${capitalizeFirstLetter(chosenTrack)}</span> track has been rolled!</p>
                `);

                $('#incomeAutomaCiv.iconoclastsCivContainer.iconoclastsActiveDiceRoll #iconoclastsChosenTrack').fadeIn();

                setTimeout(function(){
                    $('#incomeAutomaCiv.iconoclastsCivContainer.iconoclastsActiveDiceRoll #iconoclastsChosenTrack').fadeOut();
                    $('#automaMove.trackContainer').fadeOut();
                    $('.actionInformationPanel').fadeOut();
                    setTimeout(function(){ 
                        $('#automaMove.trackContainer').remove();
                        $('.actionInformationPanel').remove();
                        animateTrackMove('automa', chosenTrack, 'advance', 'iconoclastsIncomeAction', 'true', 1);
                    }, automaTimeout);
                    setTimeout(function(){ 
                        $('#incomeAutomaCiv.iconoclastsCivContainer .tapestryActionContainer').fadeIn();
                    }, automaTimeout + 50);
                }, 1200);
            };
            
        }, 700);

    }, 2400)

}

function scienceDieActionSelection(mode, direction, benefits) {

    // modes :
    //     scientistsCivBonus -> (1st / 2nd Civ)
    //     iconoclastsCivBonus -> (1st / 2nd Civ)
    //     scienceDieNoBenefits
    //     scienceDieBenefits
    //     advanceMilitaryTechnologyExploration
    //     advanceMilitaryTechnology
    //     advanceMilitaryTechnologyExploration


    if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
    if(DEBUG_GAME) console.log(`scienceDieActionSelection() func triggered`);

    if(DEBUG_GAME) console.log(`direction => '${direction}'`);
    if(DEBUG_GAME) console.log(`benefits => '${benefits}'`);

    var availableTracks = $('.actionScienceDice').attr('tracks')
    var multipleTracks = [];

    if(availableTracks != 'all') multipleTracks = availableTracks.split(' ');

    $('.btn.greenBtn.actionScienceDice').remove();

    setTimeout(function(){

        $('.scienceDieToRoll:not(.iconoclastsCivBonusDie)').addClass('animateDice');
        setTimeout(function(){
            $('.scienceDieToRoll:not(.iconoclastsCivBonusDie)').addClass('rollDice');
        }, 10);

        setTimeout(function(){

            if(availableTracks == 'all') {
                if(DEBUG_GAME) console.log(`availableTracks == 'all' condition met`);

                let dieResult = Math.floor(Math.random() * game.tracks.length);
                if(DEBUG_GAME) console.log(`dieResult => '${dieResult}'`);
                
                $('.scienceDieToRoll.rollDice:not(.iconoclastsCivBonusDie)').removeClass('noFavTrack explorationFavTrack militaryFavTrack technologyFavTrack scienceFavTrack artsFavTrack').addClass(`${game.tracks[dieResult]}FavTrack`);

                if(DEBUG_GAME) console.log(`game.tracks[dieResult] => '${game.tracks[dieResult]}'`);

                var chosenTrack = capitalizeFirstLetter(game.tracks[dieResult]);
                if(DEBUG_GAME) console.log(`chosenTrack => '${chosenTrack}'`);

                // The <span class="bold">Exploration</span> track<br />has been rolled!

                $('.actionDescription').addClass('rollResult');
                $('.actionDescription').html(`The <span class="bold">${chosenTrack}</span> track<br />has been rolled!`);
                
                setTimeout(function(){

                    $('#automaMove.trackContainer').fadeOut('slow');
                    $('.actionInformationPanel').fadeOut('slow');

                    setTimeout(function(){ 
                        $('#automaMove.trackContainer').remove();
                        $('.actionInformationPanel').remove();

                        if(DEBUG_GAME) console.log(`game.tracks[dieResult] => '${game.tracks[dieResult]}'`);
                        if(DEBUG_GAME) console.log(`direction => '${direction}'`);
                        if(DEBUG_GAME) console.log(`benefits => '${benefits}'`);

                        if($('.civBonus').length || $('.dualCivBonus').length) {
                            if(DEBUG_GAME) console.log(`$('.civBonus').length || $('.dualCivBonus').length condition met`);
                            animateTrackMove('automa', game.tracks[dieResult], direction, 'incomeAction', benefits, 1);
                        } else {
                            if(DEBUG_GAME) console.log(`!$('.civBonus').length && !$('.dualCivBonus').length condition met`);
                            animateTrackMove('automa', game.tracks[dieResult], direction, 'extraAction', benefits, 1);
                        }
                    }, automaTimeout);

                }, 1500)

            } else {
                if(DEBUG_GAME) console.log(`availableTracks != 'all' condition met`);
               
                var multipleTrackIndexes = [];

                for (let i = 0; i < multipleTracks.length; i++) {
                    multipleTrackIndexes.push(game.tracks.indexOf(multipleTracks[i]));
                }

                var dieResult = 'none';

                while(dieResult == 'none'){  
                    var dieRoll = Math.floor(Math.random() * game.tracks.length);
                    if(multipleTrackIndexes.includes(dieRoll)) dieResult = dieRoll;
                }

                $('.scienceDieToRoll.rollDice:not(.iconoclastsCivBonusDie)').removeClass('noFavTrack explorationFavTrack militaryFavTrack technologyFavTrack scienceFavTrack artsFavTrack').addClass(`${game.tracks[dieResult]}FavTrack`);
                if(DEBUG_GAME) console.log(`game.tracks[dieResult] => '${game.tracks[dieResult]}'`);

                var chosenTrack = capitalizeFirstLetter(game.tracks[dieResult]);
                if(DEBUG_GAME) console.log(`chosenTrack => '${chosenTrack}'`);

                $('.actionDescription').addClass('rollResult');
                $('.actionDescription').html(`The <span class="bold">${chosenTrack}</span> track has been rolled!`);

                setTimeout(function(){
                    $('.actionInformationPanel').fadeOut('slow');

                    $('#automaMove.trackContainer').fadeOut('slow');
                    $('.actionInformationPanel').fadeOut('slow');
                    setTimeout(function(){ 
                        $('#automaMove.trackContainer').remove();
                        $('.actionInformationPanel').remove();

                        if($('.civBonus').length || $('.dualCivBonus').length) {
                            if(DEBUG_GAME) console.log(`$('.civBonus').length || $('.dualCivBonus').length condition met`);
                            animateTrackMove('automa', game.tracks[dieResult], direction, 'incomeAction', benefits, 1);
                        } else {
                            if(DEBUG_GAME) console.log(`!$('.civBonus').length && !$('.dualCivBonus').length condition met`);
                            animateTrackMove('automa', game.tracks[dieResult], direction, 'extraAction', benefits, 1);
                        }
                        
                    }, automaTimeout);
                }, 1500);
            }
            
        }, 700);

    }, 100)

}

function findNewAutomaFavTrack() {
    if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
    if(DEBUG_GAME) console.log(`findNewAutomaFavTrack() func triggered`);

    var finalizedAutomaTrack = '';
    var landmarkDistances = [12, 12, 12, 12];
    if(aaExp) landmarkDistances.push(12);    

    for (let i = 0; i < game.landmarks.length; i++) {
        for (let j = 0; j < game.landmarks[i].details.length; j++) {
            if(DEBUG_GAME) console.log(`game.automaInfo.trackPos[i] => '${game.automaInfo.trackPos[i]}'`);
            if(game.automaInfo.trackPos[i] < game.landmarks[i].details[j].trackNum && game.landmarks[i].details[j].available == 'true') {
                if(DEBUG_GAME) console.log(`match detected! ('${game.automaInfo.trackPos[i]} < ${game.landmarks[i].details[j].trackNum} && ${game.landmarks[i].details[j].available} == 'true'')`);

                var landmarkTrackIndex = game.tracks.indexOf(game.landmarks[i].track);
                if(DEBUG_GAME) console.log(`landmarkTrackIndex => '${landmarkTrackIndex}'`);

                landmarkDistances[landmarkTrackIndex] = parseInt(game.landmarks[i].details[j].trackNum - game.automaInfo.trackPos[landmarkTrackIndex]);
                if(DEBUG_GAME) console.log(`landmarkDistances[landmarkTrackIndex] => '${landmarkDistances[landmarkTrackIndex]}'`);

                break;
            }
        }
    }

    var allDifferences = game.automaInfo.toEndTrack.concat(landmarkDistances);

    for (let i = 0; i < allDifferences.length; i++) {
        if(allDifferences[i] == 0) allDifferences[i] = 12;
    }

    var smallestDif = Math.min.apply(null, allDifferences);
    var matchedTracks = [];

    if(DEBUG_GAME) console.log(`smallestDif => '${smallestDif}'`);

    let modifierNum = 0;
    aaExp ? modifierNum = 5 : modifierNum = 4;

    for (let j = 0; j < allDifferences.length; j++) {
        if(DEBUG_GAME) console.log(`allDifferences[j] => '${allDifferences[j]}'`);
        if(allDifferences[j] == smallestDif) {
            if(DEBUG_GAME) console.log(`match detected! ('${allDifferences[j]}')`);
            if(j < modifierNum) {
                if(DEBUG_GAME) console.log(`j < ${modifierNum} condition met`);
                matchedTracks.push(j);
            } else if(j >= modifierNum) {
                if(DEBUG_GAME) console.log(`j >= ${modifierNum} condition met`);
                matchedTracks.push(j - modifierNum);
            }
        }
    }

    if(matchedTracks.length == 1) {
        if(DEBUG_GAME) console.log(`matchedTracks.length == 1 condition met`);

        $('#automaFavTrackContainer .buttons').fadeOut();

        setTimeout(function(){

            finalizedAutomaTrack = game.tracks[matchedTracks[0]];

            if(DEBUG_GAME) console.log(`finalizedAutomaTrack => '${finalizedAutomaTrack}'`);

            var newFavTrackHTML = `
                <img class="automaEndLandmarkImg" src="img/trackPriority/automaEndLandmark.png">
                <img class="favTrackArrow" src="img/arrow.png">
                <div class="automaFavoriteTrack newFavoriteTrack">
                    <img class="favTrackImg" src="img/automaFavTrack.png">
                    <p class="bold"> = </p>
                    <img class="favTrackIconImg" src="img/tracks/${finalizedAutomaTrack}Icon.png" />
                    <div class="clearDiv"></div>
                </div>
            `;
            
            $('#automaFavTrackContainer .newTrackContainer').html(newFavTrackHTML);
            $('#automaFavTrackContainer .newTrackContainer').fadeIn();
            
            game.automaInfo.favTrack = finalizedAutomaTrack;

            if(DEBUG_GAME) console.log(`game.automaInfo.favTrack => '${game.automaInfo.favTrack}'`);
            
        }, 1000)

    } else if(matchedTracks.length > 1) {
        if(DEBUG_GAME) console.log(`matchedTracks.length > 1 condition met`);

        for (let i = 0; i < game.firstCardInfo.trackTiebreakers.length; i++) {

            let currentTiebreaker = '';

            if(game.firstCardInfo.trackTiebreakers[i] == 'favorite') {
                if(DEBUG_GAME) console.log(`game.firstCardInfo.trackTiebreakers[i] == 'favorite' condition met`);
                currentTiebreaker = game.automaInfo.favTrack;
            } else {
                if(DEBUG_GAME) console.log(`game.firstCardInfo.trackTiebreakers[i] != 'favorite' condition met`);
                currentTiebreaker = game.firstCardInfo.trackTiebreakers[i];
            }

            if(DEBUG_GAME) console.log(`currentTiebreaker => '${currentTiebreaker}'`);

            for (let j = 0; j < matchedTracks.length; j++) {
                if(DEBUG_GAME) console.log(`game.tracks[matchedTracks[j]] => '${game.tracks[matchedTracks[j]]}'`);
                if(game.tracks[matchedTracks[j]] == currentTiebreaker) {

                    if(DEBUG_GAME) console.log(`match detected! ('${game.tracks[matchedTracks[j]]}')`);

                    finalizedAutomaTrack = game.tracks[matchedTracks[j]];
                    if(DEBUG_GAME) console.log(`finalizedAutomaTrack => '${finalizedAutomaTrack}'`);

                    $('#automaFavTrackContainer .buttons').fadeOut();

                    setTimeout(function(){
                        var newFavTrackHTML = `
                            <img class="automaEndLandmarkImg" src="img/trackPriority/automaEndLandmark.png">
                            <img class="favTrackArrow" src="img/arrow.png">
                            <div class="automaFavoriteTrack newFavoriteTrack">
                                <img class="favTrackImg" src="img/automaFavTrack.png">
                                <p class="bold"> = </p>
                                <img class="favTrackIconImg" src="img/tracks/${finalizedAutomaTrack}Icon.png" />
                                <div class="clearDiv"></div>
                            </div>
                        `;
                        
                        $('#automaFavTrackContainer .newTrackContainer').html(newFavTrackHTML);
                        $('#automaFavTrackContainer .newTrackContainer').fadeIn();
                        
                        game.automaInfo.favTrack = finalizedAutomaTrack;

                        if(DEBUG_GAME) console.log(`game.automaInfo.favTrack => '${game.automaInfo.favTrack}'`);

                    }, 1000)
                }
            }

            if(finalizedAutomaTrack != '') break;
        }
    }

    matchedTracks = matchedTracks.filter( onlyUnique ); // returns ['a', 1, 2, '1']

    if(DEBUG_GAME) console.log(`matchedTracks`);
    if(DEBUG_GAME) console.log(matchedTracks);

    game.automaInfo.incomeAssessment = 'true';

    setTimeout(function(){
		checkBotsFavTrackAssessments();
	}, 100)

}

function findNewShadowEmpireFavTrack() {
    if(DEBUG_GAME) console.log(`/-------------------------------------------/`);
    if(DEBUG_GAME) console.log(`findNewShadowEmpireFavTrack() func triggered`);

    var finalizedShadowEmpireTrack = '';
    var landmarkDistances = [12, 12, 12, 12];
    if(aaExp) landmarkDistances.push(12);    

    if(DEBUG_GAME) console.log(`landmarkDistances: `, landmarkDistances);

    for (let i = 0; i < game.landmarks.length; i++) {
        for (let j = 0; j < game.landmarks[i].details.length; j++) {
            if(DEBUG_GAME) console.log(`game.landmarks[i].details[j].trackNum => '${game.landmarks[i].details[j].trackNum}'`);
            if(DEBUG_GAME) console.log(`game.landmarks[i].details[j].available => '${game.landmarks[i].details[j].available}'`);
            if(game.shadowEmpireInfo.trackPos[i] < game.landmarks[i].details[j].trackNum && game.landmarks[i].details[j].available == 'true') {
                if(DEBUG_GAME) console.log(`match detected! ('${game.shadowEmpireInfo.trackPos[i]} < ${game.landmarks[i].details[j].trackNum} && ${game.landmarks[i].details[j].available} == 'true'')`);
                
                var landmarkTrackIndex = game.tracks.indexOf(game.landmarks[i].track);
                if(DEBUG_GAME) console.log(`landmarkTrackIndex => '${landmarkTrackIndex}'`);

                landmarkDistances[landmarkTrackIndex] = game.landmarks[i].details[j].trackNum - game.shadowEmpireInfo.trackPos[landmarkTrackIndex];
                if(DEBUG_GAME) console.log(`landmarkDistances[landmarkTrackIndex] => '${landmarkDistances[landmarkTrackIndex]}'`);

                break;
            }
        }
    }

    var allDifferences = game.shadowEmpireInfo.toEndTrack.concat(landmarkDistances);

    if(DEBUG_GAME) console.log(`allDifferences: `, allDifferences);

    for (let i = 0; i < allDifferences.length; i++) {
        if(allDifferences[i] == 0) allDifferences[i] = 12;
    }

    var smallestDif = Math.min.apply(null, allDifferences);
    var matchedTracks = [];

    if(DEBUG_GAME) console.log(`smallestDif => '${smallestDif}'`);

    let modifierNum = 0;
    aaExp ? modifierNum = 5 : modifierNum = 4;

    for (let j = 0; j < allDifferences.length; j++) {
        if(DEBUG_GAME) console.log(`allDifferences[j] => '${allDifferences[j]}'`);
        if(allDifferences[j] == smallestDif) {
            if(DEBUG_GAME) console.log(`match detected! ('${allDifferences[j]}')`);
            if(j < modifierNum) {
                if(DEBUG_GAME) console.log(`j < ${modifierNum} condition met`);
                matchedTracks.push(j);
            } else {
                if(DEBUG_GAME) console.log(`j >= ${modifierNum} condition met`);
                matchedTracks.push(j - modifierNum);
            }
        }
    }

    if(DEBUG_GAME) console.log(`matchedTracks: `, matchedTracks);

    if(matchedTracks.length == 1) {
        if(DEBUG_GAME) console.log(`matchedTracks.length == 1 condition met`);

        finalizedShadowEmpireTrack = game.tracks[matchedTracks[0]];
        let previousShadowEmpireTrack = uncapitalizeFirstLetter(game.shadowEmpireInfo.favTrack);

        $('#shadowEmpireFavTrackContainer .buttons').fadeOut();

        if(DEBUG_GAME) console.log(`finalizedShadowEmpireTrack => '${finalizedShadowEmpireTrack}'`);
        
        setTimeout(function(){

            var newFavTrackHTML = '';

            if(finalizedShadowEmpireTrack == previousShadowEmpireTrack) {

                newFavTrackHTML = `
                    <img class="favTrackArrow" src="img/arrow.png">
                    <div class="shadowEmpireFavoriteTrack newFavoriteTrack">
                        <p class="noChange">No Change</p>
                    </div>
                `;
                
            } else if(finalizedShadowEmpireTrack != previousShadowEmpireTrack) {

                game.shadowEmpireInfo.favTrack = finalizedShadowEmpireTrack;
                newFavTrackHTML = `
                    <img class="shadowEmpireEndLandmarkImg" src="img/trackPriority/shadowEmpireEndLandmark.png">
                    <img class="favTrackArrow" src="img/arrow.png">
                    <div class="shadowEmpireFavoriteTrack newFavoriteTrack">
                        <img class="favTrackImg" src="img/shadowEmpireFavTrack.png">
                        <p class="bold"> = </p>
                        <img class="favTrackIconImg" src="img/tracks/${finalizedShadowEmpireTrack}Icon.png" />
                        <div class="clearDiv"></div>
                    </div>
                `;

            }

            $('#shadowEmpireFavTrackContainer .newTrackContainer').html(newFavTrackHTML);
            $('#shadowEmpireFavTrackContainer .newTrackContainer').fadeIn();
            $('#closeFavTrackAssessment').removeClass('keepOpen greyBtn').addClass('greenBtn func-automatedShadowEmpireRoundCleanup');

        }, 1000)

    } else if(matchedTracks.length > 1) {
        if(DEBUG_GAME) console.log(`matchedTracks.length > 1 condition met`);

        matchedTracks = matchedTracks.filter( onlyUnique ); // returns ['a', 1, 2, '1']

        for (let i = 0; i < game.firstCardInfo.shadowEmpireTiebreakers.length; i++) {

            let currentTiebreaker = '';
            if(game.firstCardInfo.shadowEmpireTiebreakers[i] == 'favorite') {
                if(DEBUG_GAME) console.log(`game.firstCardInfo.shadowEmpireTiebreakers[i] == 'favorite' condition met`);
                currentTiebreaker = uncapitalizeFirstLetter(game.shadowEmpireInfo.favTrack);
            } else {
                if(DEBUG_GAME) console.log(`game.firstCardInfo.shadowEmpireTiebreakers[i] != 'favorite' condition met`);
                currentTiebreaker = game.firstCardInfo.shadowEmpireTiebreakers[i];
            }

            if(DEBUG_GAME) console.log(`currentTiebreaker => '${currentTiebreaker}'`);

            for (let j = 0; j < matchedTracks.length; j++) {

                if(DEBUG_GAME) console.log(`game.tracks[matchedTracks[j]] => '${game.tracks[matchedTracks[j]]}'`);
                if(game.tracks[matchedTracks[j]] == currentTiebreaker) {
                    if(DEBUG_GAME) console.log(`match detected! ('${game.tracks[matchedTracks[j]]}')`);

                    finalizedShadowEmpireTrack = game.tracks[matchedTracks[j]];
                    if(DEBUG_GAME) console.log(`finalizedShadowEmpireTrack => '${finalizedShadowEmpireTrack}'`);

                    $('#shadowEmpireFavTrackContainer .buttons').fadeOut();

                    setTimeout(function(){
            
                        var newFavTrackHTML = `
                            <img class="shadowEmpireEndLandmarkImg" src="img/trackPriority/shadowEmpireEndLandmark.png">
                            <img class="favTrackArrow" src="img/arrow.png">
                            <div class="shadowEmpireFavoriteTrack newFavoriteTrack">
                                <img class="favTrackImg" src="img/shadowEmpireFavTrack.png">
                                <p class="bold"> = </p>
                                <img class="favTrackIconImg" src="img/tracks/${finalizedShadowEmpireTrack}Icon.png" />
                                <div class="clearDiv"></div>
                            </div>
                        `;
                        
                        $('#shadowEmpireFavTrackContainer .newTrackContainer').html(newFavTrackHTML);
                        $('#shadowEmpireFavTrackContainer .newTrackContainer').fadeIn();
                        $('.tapestryActionContainer.shadowEmpireAutomated .shadowEmpirefavTrackIcon').html('');
                        $(`.tapestryActionContainer.shadowEmpireAutomated .${finalizedShadowEmpireTrack}Move .shadowEmpirefavTrackIcon`).html('<img src="img/shadowEmpireFavTrackBlank.png">');
                    
                        game.shadowEmpireInfo.favTrack = finalizedShadowEmpireTrack;

                        if(DEBUG_GAME) console.log(`game.shadowEmpireInfo.favTrack => '${game.shadowEmpireInfo.favTrack}'`);

                        if($('#closeFavTrackAssessment').length) {
                            $('#closeFavTrackAssessment').removeClass('keepOpen greyBtn').addClass('greenBtn func-automatedShadowEmpireRoundCleanup');
                        }
                    }, 1000);
                }
            }
            if(finalizedShadowEmpireTrack != '') break;
        }
    }
    game.shadowEmpireInfo.incomeAssessment = 'true';
    setTimeout(function(){
		checkBotsFavTrackAssessments();
	}, 100);
}