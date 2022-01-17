var debugDraw = false;
var debugShuffle = false;
var debugResetGame = false; // For New / Reset Game
var debugRecordMove = false;
var debugRoundInfo = false;
var debugGameSections = false;

var game = {};
var deck = [];
var thisCard = 0;
var helpTopics = [];
// 'sound' is initially 'off' so that users have to manually turn the sound on through the main menu
var sound = 'off';
var audio = [];

// Array of available sounds
var sounds = [
    {
        // id of audio-object will be '#audio-draw'
        name: 'draw',
        path: '../../audio/card-draw.mp3'
    },{
        // id of audio-object will be '#audio-shuffle'
        name: 'shuffle',
        path: '../../audio/card-shuffle.mp3'
    }
];

// If device is touch capable, use touch as the trigger, otherwise the user is using a desktop computer so use click
var touchEvent = 'ontouchstart' in window ? 'touchstart' : 'click';

// Run function when 'menuItem.sound' is clicked
$(document).on(touchEvent, '.menuItem.sound', function() {
    // when sound == 'off' make it active by setting it as 'on' (play sounds)
    sound == 'off' ? (sound = 'on', playAudio('shuffle')) : sound = 'off';
    // Update the menuItem to reflect the new sound update
    $('.menuItem.sound p').html('Sound ' + sound);
})

var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
if(iOS) $('#container').addClass('iOS');


// $(document).ready(function(){

//     initVars();

//     // If the current game has the functionality to remove cards, then link the relevant JS file to enable this.
//     if(game.onDraw.indexOf("removedCards") > -1) {
//         $('<script>').attr({'type': 'text/javascript', 'src': '../../js/mechanics/removedCards.js'}).appendTo('head');
//     }

//     // Create main heading
//     // The word 'Automa' is in a span to hide it when viewed on a mobile device
    

//     // Initialize the mainCOntent variable
//     var mainContent = '<img src="../../img/menuIcon.png" id="menuIcon"><div id="menu"><div class="menuContainer">';

//     for (let i = 0; i < menu.length; i++) {
//         mainContent += '<div id="' + menu[i].id + '" class="menuItem';

//         for (let j = 0; j < menu[i].classes.length; j++) {
//             mainContent += ' ' + menu[i].classes[j];
//         }

//         mainContent += '"><p>' + menu[i].name + '</p></div>'
//     }

//     mainContent += '</div> <!--eo#menuContainer--></div> <!--eo#menu-->';

//     mainContent += '<h1>' + game.title + '<span class="hideMobile"> Automa</span></h1>';

//     // Open the startLayer and the startButtons container
//     mainContent += '<div id="startLayer" class="layer"><div class="buttons">';

//     // Close the startLayer and create the gameLayer, adding it to the mainContent variable.
//     mainContent += '</div>';

//     if(typeof game.disclaimer !== 'undefined') {
//         mainContent += '<p id="disclaimer">' + game.disclaimer + '</p>';
//     }
    
//     mainContent += '</div><div id="gameLayer" class="layer">';

//     if(typeof game.roundInfo != 'undefined' && typeof game.gameButtons != 'undefined') {
//         mainContent += '<div class="gameActionInfo">';

//         if(typeof game.roundInfo != 'undefined') {
//             mainContent += '<div id="table-container"></div>';
//         }

//         if(typeof game.gameButtons != 'undefined') {
//             mainContent += '<div class="buttons"></div>';
//         }

//         mainContent += '</div>';
//     }

//     mainContent += '<div id="cardArea"></div>';

//     mainContent += '</div>';

//     mainContent += '</div>';

//     // Add all of the templated HTML to the body
//     $(mainContent).appendTo('#container');

//     // Loop through all of the startButtons associated with the current game
//     startButtons();

//     // Link whatever JavaScript file corresponds with the way the cards are to be displayed
//     $('<script>').attr({'type': 'text/javascript', 'src': '../../js/mechanics/' + game.cardDisplay + '.js'}).appendTo('head');

//     // Loop through sounds array to process them into <audio> tags
//     var src = [];
//     for (let i = 0; i < sounds.length; i++) {
//         // Create a new <audio> element under the current index
//         audio[i] = document.createElement('audio');
//         // Set the id based on the name of the currently selected sound
//         audio[i].setAttribute("id", "audio-" + sounds[i].name);
//         // Create a <source> tag and insert it into the currently selected <audio> tag
//         src[i] = document.createElement('source');
//         // Set the "src" based on currently selected audio[i] path
//         src[i].setAttribute("src", sounds[i].path);
//         // Add the <source> element into the <audio> element
//         audio[i].appendChild(src[i]);
//     }
    
//     // Opening the div container to house the trigger titles for the opening sections
//     var summaryTitleContainer = '<div id="summaryTitleContainer">';

//     // creating a new div to inject the HTML into for the latter containers, rather than having to run the loop again
//     var summaryContainer = '';

//     // Running loop for the startContent title and content
//     for (let i = 0; i < startContent.length; i++) {

//         // Generating the titles that will act as triggers on the opening div container
//         summaryTitleContainer += '<h2 id="' + startContent[i].id + '" class="startSummaryTrigger">' + startContent[i].name + '</h2>';

//         // Generating the content containers that will house the content to be displayed
//         summaryContainer += '<div id="' + startContent[i].id + 'Summary" class="startSummary">' + startContent[i].content + '</div>'
//     }

//     // Closing the tag that was opened on line 36
//     summaryTitleContainer += '</div>';

//     // Injecting the content containers into the startArae (doing this first so that then the title triggers can be injected next at the top of the container)
//     $('#startLayer').prepend(summaryContainer);
//     // Next injecting the title triggers so that they're at the top of the code in the most logical spot.
//     $('#startLayer').prepend(summaryTitleContainer);

//     // Adding the activeLink class to the first title to display when the user first visits the page
//     $('.startSummaryTrigger').eq(0).addClass('activeLink');
//     // Showing the first content topic on the start page for when the user first visits the page
//     $('.startSummary').hide().eq(0).show();

//     // Regenerate the btns attribute so that the updated styles can kick in
//     // $('#startLayer .buttons').attr('btns', $("#startLayer .buttons .btn:visible").length);

//     // Generate the roundInfo table
//     if(typeof game.roundInfo != 'undefined') {
//         roundInfoSetup();
//     }

//     // the helpContent is defined and has at least one element then generate the helpContainer
//     if (typeof helpContent !== 'undefined' && helpContent.length > 0) {
//         var helpOverlay = [
//             '<div id="helpOverlay" class="fullScreenOverlay">',
//                 '<img src="../../img/closeHelp.png" id="closeHelp" class="cancel closeOverlay" alt="">',
//                 '<h2>HELP</h2>',
//                 '<div id="helpTextContainer" class="helpHistoryTextContainer"></div>',
//             '</div>',
//             ''
//         ].join('');

//         // Add the helpOverlay container to the body
//         $(helpOverlay).appendTo('body');

//         // Run the loopNestedContent function in order to process all of the help topics that are stored in the "Master-content.js" file into the HTML file
//         loopNestedContent(helpContent);

//         // The looped content has been pushed to the "helpTopics" array, so on the next line we join the content and then inject it into the #helpTextContainer HTML.
//         $('#helpTextContainer').html(helpTopics.join('\n'));

//     } else {
//         // If there is no helpContent then hide the 'Help' menu item
//         $('.menuItem.help').css('display', 'none');
//     }
    
//     // Generate the historyOverlay which will hold all of the previously taken game moves
//     var historyOverlay = [
//         '<div id="historyOverlay" class="fullScreenOverlay">',
//             '<img src="../../img/closeHelp.png" id="closeHistory" class="cancel history closeOverlay" alt="">',
//             '<h2>MOVE HISTORY</h2>',
//             '<div id="historyTextContainer" class="helpHistoryTextContainer gameInfoReset"></div> <!--eo#helpTextContainer-->',
//         '</div> <!--eo#helplyr-->'
//     ].join('');

//     $(historyOverlay).appendTo('body');

//     $('<div id="resetOverlay" class="closeOverlay"></div>').appendTo('body');

//     // BUY ME A COFFEE!!!!

//     // var buyMeACoffeeHTML = `
//     //     <div class="btn-container"><a title="Support me on ko-fi.com" class="kofi-button" style="background-color:#29abe0;" href="https://ko-fi.com/G2G07CQXW" target="_blank"> <span class="kofitext"><img src="https://storage.ko-fi.com/cdn/cup-border.png" alt="Ko-fi donations" class="kofiimg">Support Me on Ko-fi</span></a></div>
//     // `;

//     // setTimeout(function(){
//     //     $(buyMeACoffeeHTML).insertAfter($('#startLayer .buttons'));
//     //     $(buyMeACoffeeHTML).insertAfter($('.menuContainer #exitGame'));
//     // }, 100);

//     var kofiBtnCSS = `
//         <style>img.kofiimg{display: initial!important;vertical-align:middle;height:13px!important;width:20px!important;padding-top:0!important;padding-bottom:0!important;border:none;margin-top:0;margin-right:5px!important;margin-left:0!important;margin-bottom:3px!important;content:url('https://storage.ko-fi.com/cdn/cup-border.png')}.kofiimg:after{vertical-align:middle;height:25px;padding-top:0;padding-bottom:0;border:none;margin-top:0;margin-right:6px;margin-left:0;margin-bottom:4px!important;content:url('https://storage.ko-fi.com/cdn/whitelogo.svg')}.kofi-btn-container{display: block!important;white-space: nowrap;width: 186px;margin: 16px auto 0px;}span.kofitext{color:#fff !important;letter-spacing: -0.15px!important;text-wrap:none;vertical-align:middle;line-height:33px !important;padding:0;text-align:center;text-decoration:none!important; text-shadow: 0 1px 1px rgba(34, 34, 34, 0.05);}.kofitext a{color:#fff !important;text-decoration:none:important;}.kofitext a:hover{color:#fff !important;text-decoration:none}a.kofi-button{box-shadow: 1px 1px 0px rgba(0, 0, 0, 0.2);line-height:36px!important;min-width:150px;display:inline-block!important;background-color:#29abe0;padding:2px 12px !important;text-align:center !important;border-radius:7px;color:#fff;cursor:pointer;overflow-wrap:break-word;vertical-align:middle;border:0 none #fff !important;font-family:'Quicksand',Helvetica,Century Gothic,sans-serif !important;text-decoration:none;text-shadow:none;font-weight:700!important;font-size:14px !important}a.kofi-button:visited{color:#fff !important;text-decoration:none !important}a.kofi-button:hover{opacity:.85;color:#f5f5f5 !important;text-decoration:none !important}a.kofi-button:active{color:#f5f5f5 !important;text-decoration:none !important}.kofitext img.kofiimg {height:15px!important;width:22px!important;display: initial;animation: kofi-wiggle 3s infinite;}@keyframes kofi-wiggle{0%{transform:rotate(0) scale(1)}60%{transform:rotate(0) scale(1)}75%{transform:rotate(0) scale(1.12)}80%{transform:rotate(0) scale(1.1)}84%{transform:rotate(-10deg) scale(1.1)}88%{transform:rotate(10deg) scale(1.1)}92%{transform:rotate(-10deg) scale(1.1)}96%{transform:rotate(10deg) scale(1.1)}100%{transform:rotate(0) scale(1)}}</style>
//     `;

//     $(kofiBtnCSS).appendTo('head');

//     var kofiBtnHTML = `
//         <div class="kofi-btn-container"><a title="Support me on ko-fi.com" class="kofi-button" style="background-color:#29abe0;" href="https://ko-fi.com/G2G07CQXW" target="_blank"> <span class="kofitext"><img src="https://storage.ko-fi.com/cdn/cup-border.png" alt="Ko-fi donations" class="kofiimg">Support Me on Ko-fi</span></a></div>
//     `;

//     $(kofiBtnHTML).insertAfter($('#startLayer .buttons'));
//     $(kofiBtnHTML).insertAfter($('.menuContainer #exitGame'));

//     $('<link>').attr({'href': 'https://fonts.googleapis.com/css?family=Cookie', 'rel': 'stylesheet'}).appendTo('head');

// })

function initiateGameElements() {

    $('#loaderLayer').fadeOut();

    setTimeout(function(){
            
        initVars();

        // If the current game has the functionality to remove cards, then link the relevant JS file to enable this.
        if(game.onDraw.indexOf("removedCards") > -1) {
            $('<script>').attr({'type': 'text/javascript', 'src': '../../js/mechanics/removedCards.js'}).appendTo('head');
        }

        // Create main heading
        // The word 'Automa' is in a span to hide it when viewed on a mobile device
        

        // Initialize the mainCOntent variable
        var mainContent = '<img src="../../img/menuIcon.png" id="menuIcon"><div id="menu"><div class="menuContainer">';

        for (let i = 0; i < menu.length; i++) {
            mainContent += '<div id="' + menu[i].id + '" class="menuItem';

            for (let j = 0; j < menu[i].classes.length; j++) {
                mainContent += ' ' + menu[i].classes[j];
            }

            mainContent += '"><p>' + menu[i].name + '</p></div>'
        }

        mainContent += '</div> <!--eo#menuContainer--></div> <!--eo#menu-->';

        mainContent += '<h1>' + game.title + '<span class="hideMobile"> Automa</span></h1>';

        // Open the startLayer and the startButtons container
        mainContent += '<div id="startLayer" class="layer"><div class="buttons">';

        // Close the startLayer and create the gameLayer, adding it to the mainContent variable.
        mainContent += '</div>';

        if(typeof game.disclaimer !== 'undefined') {
            mainContent += '<p id="disclaimer">' + game.disclaimer + '</p>';
        }
        
        mainContent += '</div><div id="gameLayer" class="layer">';

        if(typeof game.roundInfo != 'undefined' && typeof game.gameButtons != 'undefined') {
            mainContent += '<div class="gameActionInfo">';

            if(typeof game.roundInfo != 'undefined') {
                mainContent += '<div id="table-container"></div>';
            }

            if(typeof game.gameButtons != 'undefined') {
                mainContent += '<div class="buttons"></div>';
            }

            mainContent += '</div>';
        }

        mainContent += '<div id="cardArea"></div>';

        mainContent += '</div>';

        mainContent += '</div>';

        // Add all of the templated HTML to the body
        $(mainContent).appendTo('#container');

        // Loop through all of the startButtons associated with the current game
        startButtons();

        // Link whatever JavaScript file corresponds with the way the cards are to be displayed
        $('<script>').attr({'type': 'text/javascript', 'src': '../../js/mechanics/' + game.cardDisplay + '.js'}).appendTo('head');

        // Loop through sounds array to process them into <audio> tags
        var src = [];
        for (let i = 0; i < sounds.length; i++) {
            // Create a new <audio> element under the current index
            audio[i] = document.createElement('audio');
            // Set the id based on the name of the currently selected sound
            audio[i].setAttribute("id", "audio-" + sounds[i].name);
            // Create a <source> tag and insert it into the currently selected <audio> tag
            src[i] = document.createElement('source');
            // Set the "src" based on currently selected audio[i] path
            src[i].setAttribute("src", sounds[i].path);
            // Add the <source> element into the <audio> element
            audio[i].appendChild(src[i]);
        }
        
        // Opening the div container to house the trigger titles for the opening sections
        var summaryTitleContainer = '<div id="summaryTitleContainer">';

        // creating a new div to inject the HTML into for the latter containers, rather than having to run the loop again
        var summaryContainer = '';

        // Running loop for the startContent title and content
        for (let i = 0; i < startContent.length; i++) {

            // Generating the titles that will act as triggers on the opening div container
            summaryTitleContainer += '<h2 id="' + startContent[i].id + '" class="startSummaryTrigger">' + startContent[i].name + '</h2>';

            // Generating the content containers that will house the content to be displayed
            summaryContainer += '<div id="' + startContent[i].id + 'Summary" class="startSummary">' + startContent[i].content + '</div>'
        }

        // Closing the tag that was opened on line 36
        summaryTitleContainer += '</div>';

        // Injecting the content containers into the startArae (doing this first so that then the title triggers can be injected next at the top of the container)
        $('#startLayer').prepend(summaryContainer);
        // Next injecting the title triggers so that they're at the top of the code in the most logical spot.
        $('#startLayer').prepend(summaryTitleContainer);

        // Adding the activeLink class to the first title to display when the user first visits the page
        $('.startSummaryTrigger').eq(0).addClass('activeLink');
        // Showing the first content topic on the start page for when the user first visits the page
        $('.startSummary').hide().eq(0).show();

        // Regenerate the btns attribute so that the updated styles can kick in
        // $('#startLayer .buttons').attr('btns', $("#startLayer .buttons .btn:visible").length);

        // Generate the roundInfo table
        if(typeof game.roundInfo != 'undefined') {
            roundInfoSetup();
        }

        // the helpContent is defined and has at least one element then generate the helpContainer
        if (typeof helpContent !== 'undefined' && helpContent.length > 0) {
            var helpOverlay = [
                '<div id="helpOverlay" class="fullScreenOverlay">',
                    '<img src="../../img/closeHelp.png" id="closeHelp" class="cancel closeOverlay" alt="">',
                    '<h2>HELP</h2>',
                    '<div id="helpTextContainer" class="helpHistoryTextContainer"></div>',
                '</div>',
                ''
            ].join('');

            // Add the helpOverlay container to the body
            $(helpOverlay).appendTo('body');

            // Run the loopNestedContent function in order to process all of the help topics that are stored in the "Master-content.js" file into the HTML file
            loopNestedContent(helpContent);

            // The looped content has been pushed to the "helpTopics" array, so on the next line we join the content and then inject it into the #helpTextContainer HTML.
            $('#helpTextContainer').html(helpTopics.join('\n'));

        } else {
            // If there is no helpContent then hide the 'Help' menu item
            $('.menuItem.help').css('display', 'none');
        }
        
        // Generate the historyOverlay which will hold all of the previously taken game moves
        var historyOverlay = [
            '<div id="historyOverlay" class="fullScreenOverlay">',
                '<img src="../../img/closeHelp.png" id="closeHistory" class="cancel history closeOverlay" alt="">',
                '<h2>MOVE HISTORY</h2>',
                '<div id="historyTextContainer" class="helpHistoryTextContainer gameInfoReset"></div> <!--eo#helpTextContainer-->',
            '</div> <!--eo#helplyr-->'
        ].join('');

        $(historyOverlay).appendTo('body');

        $('<div id="resetOverlay" class="closeOverlay"></div>').appendTo('body');

        // BUY ME A COFFEE!!!!

        // var buyMeACoffeeHTML = `
        //     <div class="btn-container"><a title="Support me on ko-fi.com" class="kofi-button" style="background-color:#29abe0;" href="https://ko-fi.com/G2G07CQXW" target="_blank"> <span class="kofitext"><img src="https://storage.ko-fi.com/cdn/cup-border.png" alt="Ko-fi donations" class="kofiimg">Support Me on Ko-fi</span></a></div>
        // `;

        // setTimeout(function(){
        //     $(buyMeACoffeeHTML).insertAfter($('#startLayer .buttons'));
        //     $(buyMeACoffeeHTML).insertAfter($('.menuContainer #exitGame'));
        // }, 100);

        var kofiBtnCSS = `
            <style>img.kofiimg{display: initial!important;vertical-align:middle;height:13px!important;width:20px!important;padding-top:0!important;padding-bottom:0!important;border:none;margin-top:0;margin-right:5px!important;margin-left:0!important;margin-bottom:3px!important;content:url('https://storage.ko-fi.com/cdn/cup-border.png')}.kofiimg:after{vertical-align:middle;height:25px;padding-top:0;padding-bottom:0;border:none;margin-top:0;margin-right:6px;margin-left:0;margin-bottom:4px!important;content:url('https://storage.ko-fi.com/cdn/whitelogo.svg')}.kofi-btn-container{display: block!important;white-space: nowrap;width: 186px;margin: 16px auto 0px;}span.kofitext{color:#fff !important;letter-spacing: -0.15px!important;text-wrap:none;vertical-align:middle;line-height:33px !important;padding:0;text-align:center;text-decoration:none!important; text-shadow: 0 1px 1px rgba(34, 34, 34, 0.05);}.kofitext a{color:#fff !important;text-decoration:none:important;}.kofitext a:hover{color:#fff !important;text-decoration:none}a.kofi-button{box-shadow: 1px 1px 0px rgba(0, 0, 0, 0.2);line-height:36px!important;min-width:150px;display:inline-block!important;background-color:#29abe0;padding:2px 12px !important;text-align:center !important;border-radius:7px;color:#fff;cursor:pointer;overflow-wrap:break-word;vertical-align:middle;border:0 none #fff !important;font-family:'Quicksand',Helvetica,Century Gothic,sans-serif !important;text-decoration:none;text-shadow:none;font-weight:700!important;font-size:14px !important}a.kofi-button:visited{color:#fff !important;text-decoration:none !important}a.kofi-button:hover{opacity:.85;color:#f5f5f5 !important;text-decoration:none !important}a.kofi-button:active{color:#f5f5f5 !important;text-decoration:none !important}.kofitext img.kofiimg {height:15px!important;width:22px!important;display: initial;animation: kofi-wiggle 3s infinite;}@keyframes kofi-wiggle{0%{transform:rotate(0) scale(1)}60%{transform:rotate(0) scale(1)}75%{transform:rotate(0) scale(1.12)}80%{transform:rotate(0) scale(1.1)}84%{transform:rotate(-10deg) scale(1.1)}88%{transform:rotate(10deg) scale(1.1)}92%{transform:rotate(-10deg) scale(1.1)}96%{transform:rotate(10deg) scale(1.1)}100%{transform:rotate(0) scale(1)}}</style>
        `;

        $(kofiBtnCSS).appendTo('head');

        var kofiBtnHTML = `
            <div class="kofi-btn-container"><a title="Support me on ko-fi.com" class="kofi-button" style="background-color:#29abe0;" href="https://ko-fi.com/G2G07CQXW" target="_blank"> <span class="kofitext"><img src="https://storage.ko-fi.com/cdn/cup-border.png" alt="Ko-fi donations" class="kofiimg">Support Me on Ko-fi</span></a></div>
        `;

        $(kofiBtnHTML).insertAfter($('#startLayer .buttons'));
        $(kofiBtnHTML).insertAfter($('.menuContainer #exitGame'));

        $('<link>').attr({'href': 'https://fonts.googleapis.com/css?family=Cookie', 'rel': 'stylesheet'}).appendTo('head');

        preloadImgsCallback();
    }, 800);
}

function initVars() {
    // Making a copy of the init object that contains all of the individual information for the Automa currently being accessed
    game = JSON.parse(JSON.stringify(init));
    game.usedCards = [];
    game.moves = [];
    game.cardsDrawn = 0;
    game.moveNum = 0;
}

function loopNestedContent(targContent) {

    //loop through the array that has been passed through to the function (targContent)
    for (let i = 0; i < targContent.length; i++) {
        // First create the help trigger using the name and id parameters
        helpTopics.push('<h3 id="help' + targContent[i].id + '" class="helpInfoTrigger">' + targContent[i].name + '<span>+</span></h3>');

        // Then create the opening div, again with the id parameter to tie it to the heading trigger
        

        if (hasProp(targContent[i], 'classes')) {
            let helpTopicClasses = '<div id="help' + targContent[i].id + 'Info" class="helpInfo';
            for (let j = 0; j < targContent[i].classes.length; j++) {
                helpTopicClasses += ' ' + targContent[i].classes[j] + 'Info';
            }
            helpTopicClasses += '">';
            helpTopics.push(helpTopicClasses);
        } else {
            helpTopics.push('<div id="help' + targContent[i].id + 'Info" class="helpInfo">');
        }

        // Then create the opening div, again with the id parameter to tie it to the heading trigger
        
        
        // Next inject the content
        helpTopics.push(targContent[i].content);
        if (hasProp(targContent[i], 'subsections')) {
            // if the currently targetted help topic has subsections, run the function again to process these as well by parsing through the current level in the array that the loop has reached
            loopNestedContent(targContent[i].subsections);
        }
        // Finally, push the closing div tag
        helpTopics.push('</div>');
    }
}

// When helpInfoTrigger is clicked, run the showHelpInfo function. This not only shows the associated help subject, but ensures the parent help container are extended as well in case the targeted section is a subsection
$(document).on(touchEvent, '.helpHistoryTextContainer .helpInfoTrigger', function() {
    // showHelpInfo(helpGameSetup) etc
    showHelpInfo($(this).attr('id'), 'id')
});


function showHelpInfo(helpTopic, type) {

    type == 'id' ? type = '#' : type = '.';

    // helpTopic = helpGameSetup, id

    // helpTopic = worker, class

    //var thisHelpTopic = $('#helpGameSetupInfo'); etc

    var thisHelpTopic = $(type + helpTopic + 'Info');
    
    var thisDisplay = thisHelpTopic.css('display');

    // Perform a full reset on all of the help boxes and extend symbols
    $('.helpInfo').css('display', 'none');
    $('.helpInfoTrigger').children('span').html('+');

    // Check to see if the helpTopic selected has any parents
    var par = thisHelpTopic.parent();

    // The below code checks to see if the currently selected '.helpTopic' box is a subsection of another '.helpInfo' box
    // If it is, then it makes sure that the parent '.helpInfo' box is also extended, and it's associated '.helpInfoTrigger' span shows the extended symbol of '-'
    
    while (par.hasClass('helpInfo')) {
        // If the above is true, then extend the parent '.helpInfo' box as well and have the associated span be updated to it's extended symbol '-'
        par.css('display', 'block');
        par.prev().children('span').html('-');
        // Update the parent with the new parent of the currently focused '.helpInfo' box in order to run the loop again.
        // This will keep going extending all of the associated '.helpInfo' boxes until all the related parents are extended
        par = par.parent();
    }
    
    if (thisDisplay == 'none') {
        // If the 'thisDisplay' variable equals 'none' then extend the associated helpTopicInfo box, and change the '+' symbol to a '-' to show that it's currently extended
        $(type + helpTopic + 'Info').css('display', 'block');
        thisHelpTopic.prev().children('span').html('-');
        // Cause the div closeHelp scroll down so that the newly extended helpInfo box is within view
        $('#helpTextContainer').animate({scrollTop: $('#helpTextContainer').scrollTop() + ($(type + helpTopic + 'Info').offset().top - $('#helpTextContainer').offset().top - 70)}, 800);
    }
}


// This is the function for the helpIcon on a card which generates a quickLink to the associated topic in the helpBox.

$(document).on(touchEvent, '.helpLink', function() {
    // Check to see what the associated helpTopic is by running the classProcessor function
    // helpID-helpExpand returns  'helpExpand' (as index [1] held in the thisHelpLink var)
    let thisHelpLink = classProcessor($(this), 'helpLink', 'split');
    // run activateOverlay to show resetOverlay, push the z-index of the menu down, and add noscroll to the body
    activateOverlay('helpHistory');
    // Show the helpOverlay
    $('#helpOverlay').css('display', 'block');
    // Run the showHelpInfo function to determine which help content has been activated in order to automatically expand the accordian for the user
    showHelpInfo(thisHelpLink[1], 'class')
});



$(document).on(touchEvent, '#menuIcon', function() {
    if($(this).hasClass('disabled')) return;

    if($(this).hasClass('active')) {
        // If menuIcon hasClass('active), this shows it's been previously clicked, so then run the function to close all of the currently opened overlays and return the menu to an inactive state
        closeOverlays();
    } else{
        activateOverlay('menu');
    }
});

// When clicking one of the '.startSummaryTrigger' elements, show the relevant content and add the '.active' class to the link that's just been clicked.
$(document).on(touchEvent, '.startSummaryTrigger', function() {
    // Hide all '.startSummary' content boxes and then show the one that matches up with the id of the title that has just been clicked.
    $('.startSummary').css('display', 'none');
    $('#' + $(this).attr('id') + 'Summary').css('display', 'block');
    // Remove the '.activeLink' class from all of the titles and then add it to the title that was just clicked.
    $('.activeLink').removeClass('activeLink');
    $(this).addClass('activeLink');
});


// This function is activate if the '#continue' button is pressed
function savedGame() {

    // Update the 'deck' and the 'game' variables with the stored information in localStorage
    deck = JSON.parse(localStorage.getItem(init.code + '-deck'));
    game = JSON.parse(localStorage.getItem(init.code));

    game.resumeGame = true;

    if(game.code == 'gwt') {
        pickCardsGWT('savedGame', localStorage.getItem('gwt-difficulty'))
    }

    if(game.usedCards.length != 0) {
        for (let i = 0; i < deck.length; i++) {
            if(deck[i].card == game.usedCards[0]) {
                thisCard = deck[i];
            }           
        }
    }
    
    if(typeof game.usedCards[0] !== 'undefined') {
        for (let i = 0; i < deck.length; i++) {
            // Check to see if there are any values in the usedCards array. If there are, that means that the user had started to play the previous game, so then run the appropriate function in order to display the last cards played so that the user can pick up from where they left off.
            if (deck[i].card == game.usedCards[0]) {
                callfunction(game.cardDisplay, 'savedGame+' + JSON.stringify(gameSection()));
            }
        }
    }

    if(typeof game.moves[0] !== 'undefined') {
        $('#historyTextContainer').html(game.moves.join('\n'));
    }

    // Run roundInfoSetup() to generate the roundInfo table since the roundInfo values have all now been updated with the values stored in localStorage from the users previous game
    if(typeof game.roundInfo != 'undefined') {
        roundInfoSetup();
    }

    // Generate the buttons
    
    if(typeof game.gameButtons !== 'undefined') gameButtons();

    // The user may have exited the previous game on the last round so run this function to double check in order to update the available game actions as needed.
    if(typeof game.endGame !== 'undefined') checkLastRound();

    // If the user is playing with an automa that has 'removedCards' enabled, then run this function in order to generate the removed cards (if any).
    if(game.onDraw.indexOf("removedCards") > -1) generateRemoved();

    setTimeout(function(){  
        game.resumeGame = false;
    }, 100)
    
}

// This function is activate if the '#continue' button is pressed
function savedSlideGame() {

    // Update the 'deck' and the 'game' variables with the stored information in localStorage
    deck = JSON.parse(localStorage.getItem(init.code + '-deck'));
    game = JSON.parse(localStorage.getItem(init.code));

    game.resumeGame = true;
    
    if(typeof game.usedCards[0] !== 'undefined') {
        for (let i = 0; i < deck.length; i++) {
            // Check to see if there are any values in the usedCards array. If there are, that means that the user had started to play the previous game, so then run the appropriate function in order to display the last cards played so that the user can pick up from where they left off.
            if (deck[i].card == game.usedCards[0]) {
                callfunction(game.cardDisplay, 'savedGame');
            }
        }
    }

    if(typeof game.moves[0] !== 'undefined') {
        $('#historyTextContainer').html(game.moves.join('\n'));
    }

    // Run roundInfoSetup() to generate the roundInfo table since the roundInfo values have all now been updated with the values stored in localStorage from the users previous game
    if(typeof game.roundInfo != 'undefined') {
        roundInfoSetup();
    }

    // Generate the buttons
    gameButtons();

    // The user may have exited the previous game on the last round so run this function to double check in order to update the available game actions as needed.
    if(typeof game.endGame !== 'undefined') checkLastRound();

    // If the user is playing with an automa that has 'removedCards' enabled, then run this function in order to generate the removed cards (if any).
    if(game.onDraw.indexOf("removedCards") > -1) generateRemoved();

    setTimeout(function(){  
        game.resumeGame = false;
    }, 100)
    
}

// This function is activate if the '#continue' button is pressed
function savedTapestryGame() {

    console.log('ping');

    // Update the 'deck' and the 'game' variables with the stored information in localStorage
    deck = JSON.parse(localStorage.getItem(init.code + '-deck'));
    game = JSON.parse(localStorage.getItem(init.code));

    game.resumeGame = true;
    
    if(typeof game.usedCards[0] !== 'undefined') {
        continueTapestryGame();
    }

    if(typeof game.moves[0] !== 'undefined') {
        $('#historyTextContainer').html(game.moves.join('\n'));
    }

    // Run roundInfoSetup() to generate the roundInfo table since the roundInfo values have all now been updated with the values stored in localStorage from the users previous game
    if(typeof game.roundInfo != 'undefined') {
        roundInfoSetup();
    }

    // Generate the buttons
    gameButtons();

    // The user may have exited the previous game on the last round so run this function to double check in order to update the available game actions as needed.
    if(typeof game.endGame !== 'undefined') checkLastRound();

    setTimeout(function(){  
        game.resumeGame = false;
    }, 100)
    
}


// '.lyrBtn' is used to trigger show the activated layer which holds a different part of the automa information (startArea / cardArea etc)
$(document).on(touchEvent, '.btn', function() {

    let classes = $(this).attr('class').split(' ');

    for(var i=0; i<classes.length; i++){
        // Loop through all of the classes in the 'classes' array, until finding the one that starts with the keyword that has been passed through to it
        // Keyword = msg
        
        if(classes[i].startsWith('func-')){
            let thisFunction = classes[i].split('-');
            callfunction(thisFunction[1], thisFunction[2])
        } 
    }

})

$(document).on(touchEvent, '.func', function() {

    let classes = $(this).attr('class').split(' ');

    for(var i=0; i<classes.length; i++){
        // Loop through all of the classes in the 'classes' array, until finding the one that starts with the keyword that has been passed through to it
        // Keyword = msg
        
        if(classes[i].startsWith('func-')){
            let thisFunction = classes[i].split('-');
            callfunction(thisFunction[1], thisFunction[2])
        } 
    }

})

$(document).on(touchEvent, '.overlayBox', function() {
    // Run the activateOverlay function to show the resetOverlay, adjust the z-index on the menuIcon etc
    activateOverlay('helpHistory');
    // Running the classProcessor finds out which overlay needs to be shown
    // If the current element had the class 'overlay-history', then it would return thisOverlay = ['overlay', 'history']
    let thisOverlay = classProcessor($(this), 'overlay-', 'split');
    // Then we target the overlay that startes with thisOverlay[1] = history, resulting in:   $('#historyOverlay').css('display', 'block');
    $('#' + thisOverlay[1] + 'Overlay').css('display', 'block');

    if(thisOverlay[1] == 'history') {
        $("#historyTextContainer").scrollTop($("#historyTextContainer")[0].scrollHeight);
    }

})

// When '.closeOverlay' is clicked, run the 'closeOverlays()' function, which removes the "#resetOverlay" div, as well as hides all overlays. Even '#resetOverlay' has the '.closeOverlay' class so that when it's clicked it closes itself.
$(document).on(touchEvent, '.closeOverlay:not(.keepOpen)', function() {
    closeOverlays();
})

// When '.alert' is clicked, run the 'activateOverlays()' function, which adds the "#resetOverlay" div.
$(document).on(touchEvent, '.alert', function() {
    activateOverlay('alert');
    let thisAlert = classProcessor($(this), 'msg', 'whole');
    // thisAlert = msg-round-3;
    //  generateAlert(msg-round-3);
    // The generateAlert function checks the 'msg' var for the 'round' msg, and then generates the confirmation box with the confirmation message for this msg. The 3 on the end shows which layer will be shown if the user selects 'Yes'.
    generateAlert(thisAlert);
})

// This event listener is triggered when a confirmation box is visible (such as asking if the user wants to start a new game, exit the current game, start a new round etc), and then the user clicks one of the buttons inside, either 'Yes' or 'No'
$(document).on(touchEvent, '.confirmationBox .btn', function() {
    if($(this).attr('id') == 'confirm') {
        // The button with the id of 'confirm' is the 'yes' button. Clicking this will not only close the box and the overlay, but while run the associated function.
        // example of class to be processed:  activate-shuffleDeck-3
        let thisAlert = classProcessor($(this), 'activate', 'split');

        console.clear();
        console.log(thisAlert);

        // activate-newGame-start

        if(typeof thisAlert[1] !== 'undefined') {
             // let thisAlert = ['activate', 'shuffleDeck', '3']
            if(thisAlert[1] != 'none') {
                // callFunction takes the text (in this case 'shuffleDeck') and runs the function with that name.
                // callFunction('shuffleDeck') etc
                callfunction(thisAlert[1]);
                // showLayer(3) etc
                showLayer(thisAlert[2]);
            }
        }

       
    }
    // Run the 'closeOverlays()' function, which removes the "#resetOverlay" div, as well as hides all overlays. This will run no matter if the user clicks 'Yes' or 'No' to the confirmation message, since both actions will close the box and remove the overlays.
    
    let classes = $(this).attr('class').split(' ');
    var keepOpen = false;

    for(var i=0; i<classes.length; i++){
        // Loop through all of the classes in the 'classes' array, until finding the one that starts with the keyword that has been passed through to it
        // Keyword = msg
        if(classes[i].startsWith('keepOpen')){
            keepOpen = true;
        } 
    }

    if(!keepOpen) {
        closeOverlays();
    }
    
})

// Loaded as a function so that the table values can be regenerated whenever one of the values are updated.
function roundInfoSetup() {

    // Delete the existing table element in order to create a new one with the updated values
    $('.roundMarkerTable').remove();

        if(typeof game.roundInfoTable !== 'undefined') {

            var tableNum = 1;
            var newTable = true;
            var roundTable = '';
            var prevTableNum = 0;
            var column = 1;
            
            // Loop through the roundInfo values, generating a new row for each value
            for (let i = 1; i < game.roundInfoTable.length + 1; i++) {

                roundTable += '<table id="roundMarkerTable' + i +'" class="roundMarkerTable">';
                column = 1;

                for (let j = 0; j < game.roundInfo.length; j++) {

                    if (game.roundInfo[j].table.indexOf(i) !== -1) {
                    
                        if(column == 1) {
                            roundTable += '<tr>';
                        }
        
                        roundTable += '<td>'

                        if(typeof game.roundInfo[j].image !== 'undefined') {
                            roundTable += '<img src="' + game.roundInfo[j].image + '" />'
                        } else {
                            roundTable += game.roundInfo[j].name + ':';
                        }

                        roundTable += '</td>';
                        roundTable += '<td class="info rnd rnd-' + game.roundInfo[j].class;

                        if(game.roundInfo[j].animation == 'true') {
                            roundTable += ' rndInfoAnimation';
                        }

                        roundTable += '">';
                        roundTable += game.roundInfo[j].value[0];
                        roundTable += '</td>';
        
                        // If the increments value is programmed as 'plusNum' or 'minusNum', then the value will simply be whats stored as a single value. If the increments value is programmed as 'custom', then there will be multiple values stored in that roundInfo node. Previous code will have shifted the previous first item from the array, so we can target the first value and it should be the new value to be displayed.

                        column++;
                        
                        if(column > game.roundInfoTable[i - 1]) {
                            roundTable += '</tr>';
                            column = 1;
                        }

                    }

                }

                roundTable += '</table>';

            }

     
        } else {

            // Open the table tag.
            var roundTable = '<table class="roundMarkerTable">';
            
            // Loop through the roundInfo values, generating a new row for each value
            for (let i = 0; i < game.roundInfo.length; i++) {

                    roundTable += '<tr><td>'
                    if(typeof game.roundInfo[i].image !== 'undefined') {
                        roundTable += '<img src="' + game.roundInfo[i].image + '" />:'
                    } else {
                        roundTable += game.roundInfo[i].name + ':';
                    }
                    
                    roundTable += '</td><td class="info rnd rnd-' + game.roundInfo[i].class;

                    if(game.roundInfo[i].animation == 'true') {
                        roundTable += ' rndInfoAnimation';
                    }

                    roundTable += '">' + game.roundInfo[i].value[0];

                    roundTable += '</td></tr>';

            }

        }
        // Close the current table

        roundTable += '</table>';

    
        $(roundTable).prependTo('#gameLayer .gameActionInfo #table-container');


}

function drawCard() {

    if($('#draw').hasClass('disabled')) return;
    lockBtn('draw');

    // console.log(deck);

    $('#resetGame').removeClass('hidden');

    $('.gameInfoHide').css('display', 'block');

    if(sound == 'on') playAudio('draw');

        // Increase the moveNum by one - this is used to record the move in the moveContainer.
      game.moveNum++;
      if(debugDraw) console.log('game.moveNum: ' + game.moveNum);

    // Increase the round by one IF the current game has the 'roundPlus' parameter in the 'onDraw' array. (For instance, Clans of Caledonia only increase in Round number on shuffle, not every card drawn so this value wouldn't exist in that config file. Whereas Orleans DOES increase in Round with every card drawn, so that would be true in that case.)
      if (game.onDraw.indexOf("roundPlus") > -1) game.round++;

      // Make an entire copy of the current deck, as we then whittle away the cards that don't meet the current draw card parameters / conditions.
      var tempDeck = Array.from(deck);

      if(debugDraw) console.log('tempDeck:');
      if(debugDraw) console.log(tempDeck);

    // If the 'removedCards' parameter exists in the 'onDraw' array, then loop through the deck, removing cards that have the 'removed' parameter set to true.
    // The loop is done in reverse since with each item that's removed, the indexes change, so to avoid this work from the top down, so that when any items are removed, this will only change the index of any items that have already been checked.
        if(game.onDraw.indexOf("removedCards") > -1) {
            // Loop through the tempDeck array
            for (let i = tempDeck.length - 1; i >= 0; i--) {
                // if removed parameter is set to true, then remove the current card
                if(tempDeck[i].removed == 'true') tempDeck.splice(i, 1);
            }

            if(debugDraw) console.log('removedCards tempDeck:');
            if(debugDraw) console.log(tempDeck);
        }

        // If the 'removexcludeLastCard' parameter exists in the 'onDraw' array run the next code block.
        // This parameter would only be invoked in an Automa where the deck is shuffled every round (Clans of Caledonia). In a normal Automa where each card is consecutively drawn from a face down deck then there wouldn't be any risk of drawing the same card twice.
        if(game.onDraw.indexOf("excludeLastCard") > -1) {
            // First check to see if any cards are in the 'usedCards' array. If not then it is the first round due to no cards being played yet - skip the next code block.
            if(typeof game.usedCards[0] !== 'undefined') {
                // Loop through the tempDeck array
                for (let i = tempDeck.length - 1; i >= 0; i--) {
                    // Whichever card in the tempDeck matches the card at the first index of the 'usedCards' must have been played last round, so we remove it from the tempDeck to ensure there's no chance of it being played 2 rounds in a row.
                    if(tempDeck[i].card == game.usedCards[0]) tempDeck.splice(i, 1);
                }
            }
            if(debugDraw) console.log('excludeLastCard tempDeck:');
            if(debugDraw) console.log(tempDeck);
        }

        if(game.onDraw.indexOf("gameSection") > -1) gameSectionUpdate('draw', game.gameSection);
    
    
    if(game.onDraw.indexOf("shuffle") > -1) {
        // If the 'shuffle' parameter exists in the 'onDraw' parameter, then shuffle the tempDeck
        tempDeck = shuffle(tempDeck);
        // Draw a random card from the cards that are left in the tempDeck array
        // The chosen card value is transferred from tempDeck into the 'thisCard' variable ready to be processed by the card view that is dictated

        if(debugDraw) console.log('shuffle tempDeck:');
        if(debugDraw) console.log(tempDeck);

        thisCard = tempDeck[Math.ceil(Math.random() * tempDeck.length) - 1];

        if(debugDraw) console.log('thisCard:');
        if(debugDraw) console.log(thisCard);

        
    } else {
        // If the 'shuffle' parameter DOES NOT exist in the 'onDraw' parameter, increment the 'cardsDrawn' value by one (since this will dictate the next consecutive card that is drawn)
        game.cardsDrawn++;

        if(debugDraw) console.log('game.cardsDrawn = ' + game.cardsDrawn);

        // The chosen card value is transferred from tempDeck into the 'thisCard' variable ready to be processed by the card view that is dictated.
        // the '- 1' takes into account that an index starts from '0', whereas the cardsDrawn value is always one more to be readable by humans.
        // When one card is drawn at the start, we actually need to target the first card, which is at the '0' index. We do this my subtracting '1' from the cardsDrawn value at that turn, and for all subsequent turns.
        thisCard = tempDeck[game.cardsDrawn - 1];

        if(debugDraw) console.log('thisCard:');
        if(debugDraw) console.log(thisCard);
    }

    if(debugDraw) console.log('game.cardsDrawn = ' + game.cardsDrawn);
    if(debugDraw) console.log('deck.length = ' + deck.length);
    if(debugDraw) console.log('game.round = ' + game.round);

    // Sometimes the deck can be exhausted, but this simply signifies the end of a section of the game, not the game itself.
    // The below code checks to see if the deck is exhausted AND the recorded round is NOT the same as the programmed endRound value.
    // If these two conditions are met, then the deck needs to be shuffled (BUT THERE'S STILL ROUNDS IN THE GAME, so the code hides the draw button and display the shuffle button (if it's currently hidden)



    if(game.cardsDrawn == deck.length) {
        if(game.onDraw.indexOf("automaticShuffle") === -1) {
            if(game.code != 'tp') {
                gameButtonDisplay('draw', false);
                gameButtonDisplay('shuffle', true);
            } else if(game.code == 'tp' && game.cardDisplay == 'tapestryAuto') {
                gameButtonDisplay('draw', false);
                gameButtonDisplay('shuffle', true);
            }
           
        }

    }

    // Run the recordMove function by passing through the currently chosen card in order to generate the current move details. (Primarily the current move number alongside the card name.)

    // console.log(thisCard);

    if(typeof thisCard.mainAction === 'undefined' && typeof game.customMoves === 'undefined' && typeof thisCard.actions != 'undefined') {
        recordMove(thisCard, 'card', 'add');
    }

    // The current chosen card is move to the start of the usedCards array to show that it was the last card picked.
    game.usedCards.unshift(thisCard.card);
    if(debugDraw) console.log('game.usedCards:');
    if(debugDraw) console.log(game.usedCards);

    // If the cardDisplay mode if 'flip', fun the flip function to display the newly chosen card

    if(game.onDraw.indexOf("automaticShuffle") > -1) {
        if(game.cardsDrawn >= deck.length) {
            deck = shuffle(deck);
            game.cardsDrawn = 0;
        }
    }


    callfunction(game.cardDisplay, 'game+' + JSON.stringify(gameSection()));

    // callfunction('flip', 'game')

    if(debugDraw) console.log('game.cardDisplay: ' + game.cardDisplay);
    
    // The roundInfoUpdate is now invoked and passed the parameter of 'draw'.
    // The roundInfoUpdate will do a loop through all of the stored 'roundInfo' objects, and if any have the trigger 'draw' it will then be adjusted according to it's stored 'increment' type. 
    roundInfoUpdate('draw');

    // checkLastRound checks to see if the current round matches the roundCap value. Some games finish on the last round (Orleans) and the code will reflect this by hiding the buttons and generating an end of game message. Other games (Clans of Caledonia allow the user to keep playing on the last round, but the shuffle/round+ button is hidden to stop them increasing the rounds anymore

    if(typeof game.endGame !== 'undefined') checkLastRound();

    if(typeof game.extraCardInfo !== 'undefined' && $('#cardArea .imageDisclaimer').length == 0) $('#cardArea').append(game.extraCardInfo);

    if(game.code == 'ws') localStorage.setItem('ws-savedGame', 'true');


}

function shuffleDeck(mode) {

    if(sound == 'on') playAudio('shuffle');

    // increment round by one on shuffle if 'roundPlus' exists in 'onShuffle' array
    if(game.onShuffle.indexOf("roundPlus") > -1) game.round++;
    // Hide shuffle if 'hideShuffle' exists in the 'onShuffle' array (Orleans only shuffles when deck is exhausted, so all other times the #shuffle button is hidden)

    if(debugShuffle) console.log('game.round:' + game.round);


    if(game.onShuffle.indexOf("hideShuffle") > -1) gameButtonDisplay('shuffle', false);
    // if(game.onShuffle.indexOf("hideShuffle") > -1) $('#shuffle').css('display', 'none');
    // If 'gameSection' exists in the 'onShuffle' array, then increment gameSection by one.

    if(game.onShuffle.indexOf("gameSection") > -1) gameSectionUpdate('shuffle', game.gameSection);
    // If cardDisplay is 'flip' then run the flip() function and pass the 'shuffle' parameter
    // callfunction('flip', 'shuffle')

    callfunction(game.cardDisplay, 'shuffle+' + JSON.stringify(gameSection()));
    // After the shuffle button has been activated, display the #draw button again
    // $('#draw').css('display', 'block');
    gameButtonDisplay('draw', true);

    // Perform the shuffle action on the deck
    deck = shuffle(deck);

    if(debugShuffle) console.log('deck:');
    if(debugShuffle) console.log(deck);

    // Reset the cardsDrawn value, since the deck is completely full again
    game.cardsDrawn = 0;

    if(debugShuffle) console.log('game.cardsDrawn:' + game.cardsDrawn);

    // Run the roundInfoUppdate() functoin, passing through 'shuffle', and if any roundInfo parameters have 'shuffle' as the 'trigger', they'll then have their values updated and the table values updated.
    roundInfoUpdate('shuffle');
    // Run the recordMove() and pass 'shuffle' through to generate the shuffle message in the move list
    recordMove('shuffle', 'shuffle', 'add');
    // updateGame updates the localStorage for game and eck with the new information
    updateGame();
    // checkLastRound checks to see if the current round matches the roundCap value. Some games finish on the last round (Orleans) and the code will reflect this by hiding the buttons and generating an end of game message. Other games (Clans of Caledonia allow the user to keep playing on the last round, but the shuffle/round+ button is hidden to stop them increasing the rounds anymore
    if(typeof game.endGame !== 'undefined') checkLastRound();
    // Load in the last usedCard as 'shuffle' for the purposes of checking to see what the last card played was, so that there's no conflict in the code if it's configured to exclude the last card played from the next available draw.
    game.usedCards.unshift('shuffle');

    if(debugShuffle) console.log('game.usedCards:');
    if(debugShuffle) console.log(game.usedCards);

    $('#gameLayer .gameInfoHide').css('display', 'none');
}


// Generates the currently performed move and injects the HTML into the history box.
function recordMove(card, mode, behaviour){

    var thisMove = '';

    if(mode == 'card' || mode == 'shuffle') {

        if(debugRecordMove) console.log('card:');
        if(debugRecordMove) console.log(card);

        if(card == 'shuffle') {
            // Records tha the deck has been shuffled. Not only does this help with keeping a record of exactly what's happened, but it means that any code that checks to see what the last card drawn is won't mistakenly think that the last card played on the PREVIOUS ROUND is still active.
            
            if(init.code != 'tp') {
                thisMove = '<p><span class="bold italic grey">Deck shuffled!<p>';
            }
        } else {
            // Open the move HTML ready to put the action(s) between the generated <p> tags
            thisMove = '<p><span class="bold italic">Move ' + game.moveNum + ':</span> ';

            var numActions = 0;

            for (let i = 0; i < card.actions.length; i++) {

                if(typeof game.gameSection !== 'undefined') {

                    if(debugRecordMove) console.log('game.gameSection.value:');
                    if(debugRecordMove) console.log(game.gameSection.values);

                    if(debugRecordMove) console.log('card.actions[i].gameSection:');
                    if(debugRecordMove) console.log(card.actions[i].gameSection);

                    if(game.gameSection.type == 'accumulate') {

                        if(game.gameSection.values.includes(card.actions[i].gameSection)) {

                            if(i != 0) {
                                thisMove += '<span class="bold italic moveJoiner"> ' + game.moveSymbol + ' </span>';
                            }

                            thisMove += card.actions[i].desc;
                        }
                        
                    } else if(game.gameSection.type == 'alternate' || game.gameSection.type == 'multiple') {

                        if(card.actions[i].gameSection == game.gameSection.current) {

                            if(numActions != 0) {
                                thisMove += '<span class="bold italic moveJoiner"> ' + game.moveSymbol + ' </span>';
                            }

                            thisMove += card.actions[i].desc;

                            numActions++;
                        }
                    }

                    
                } else {
                    if(i != 0) {
                        thisMove += '<span class="bold italic moveJoiner"> ' + game.moveSymbol + ' </span>';
                    }
                    thisMove += card.actions[i].desc;
                }



            }

            // Close the p tag
            thisMove += '<p>';

            if(debugRecordMove) console.log('thisMove:');
            if(debugRecordMove) console.log(thisMove);

        }
        

    } else if(mode == 'custom') {
        thisMove = card;
    }

    // Update the #historyTextContainer html with the new HTML that includes the current move

    if(behaviour == 'replace') {
        $('#historyTextContainer p').last().remove();
    }

    if(thisMove != ''){
        $('#historyTextContainer').append(thisMove);
    }

    // Store the newest move in the moves array
    game.moves.push(thisMove);

    if(debugRecordMove) console.log('game.moves:');
    if(debugRecordMove) console.log(game.moves);
    // updateGame updates the localStorage for game and eck with the new information

    if(init.code != 'tp') {
        updateGame();
    }

}


// This function is run every time that a significant action takes place, and if any of the roundInfo values matches that trigger, then the value is updated in the code, as well as in the roundInfo table
function roundInfoUpdate(thisTrigger) {

    // 'draw'
    // thisTrigger = 'shuffle', 'draw'
    // Loop through all of the values in the 'roundInfo' array

        for (let i = 0; i < game.roundInfo.length; i++){

            if(typeof game.roundInfo[i].ignoreFirst !== 'undefined') {
                delete game.roundInfo[i].ignoreFirst;
            } else {

                if(debugRoundInfo) console.log('game.roundInfo:');
                if(debugRoundInfo) console.log(game.roundInfo);

                if(init.code == 'lg') {
                    game.roundInfo[i].trigger == 'turnNum' && game.moveNum % 4 == 0
                } else {
                    game.roundInfo[i].trigger == 'turnNum' && game.moveNum % 3 == 0
                }

                // All roundInfo values are loaded with a trigger that signifies when it's value is to automatically be update
                // If the current trigger matches the configured trigger for the current roundInfo parameter, then run the next code block

                if(game.roundInfo[i].trigger == thisTrigger) {
                    roundInfoUpdateCode(game.roundInfo[i], i);
                }

                if(init.code == 'lg') {
                    if(game.roundInfo[i].trigger == 'turnNum') {
                        if(game.moveNum !== 1 && ((game.moveNum - 1) % 4 ) == 0) {
                            roundInfoUpdateCode(game.roundInfo[i], i);
                        }
                    }
                } else {
                    if(game.roundInfo[i].trigger == 'turnNum') {
                        if(game.moveNum !== 1 && ((game.moveNum - 1) % 3 ) == 0) {
                            roundInfoUpdateCode(game.roundInfo[i], i);
                        }
                    }
                }

               
                
                // Some values are updated when 'draw' activated, but then they may revert to their initial state when 'shuffle' is activated.
                // For this there is a spcific 'reset' value loaded against each of the roundInfo objects.
                if(thisTrigger == game.roundInfo[i].reset) {
                    // Update the value of the roundInfo value with it's initial value found in the init config variable
                    
                    game.roundInfo[i].value[0] = JSON.parse(JSON.stringify(init.roundInfo[i].value[0]));

                    if(debugRoundInfo) console.log('game.roundInfo (reset):' + game.roundInfo[i].value[0]);
                } else if(thisTrigger == 'onFinish') {
                    // if(thisGameSection.type == 'splitVersion') {
                    //     for (let i = 0; i < thisGameSection.options.length; i++) {
                    //         if(thisGameSection.options[i].name == game.gameSection.version) gameSectionUpdate(thisTrigger, thisGameSection.options[i])        
                    //     }
                    //     return;
                    // } else {
                    //     game.roundInfo[i].value = Array.from(init.roundInfo[i].value);
                    // }
                    game.roundInfo[i].value = Array.from(init.roundInfo[i].value);
                }

                if(debugRoundInfo) console.log('game.roundInfo[i].class:' + game.roundInfo[i].class);
                if(debugRoundInfo) console.log('game.roundInfo[i].value[0]:' + game.roundInfo[i].value[0]);
        }

    }
    // updateGame updates the localStorage for game and deck with the new information
    roundInfoTableUpdate('game');
}

function roundInfoTableUpdate(mode){
    for (let i = 0; i < game.roundInfo.length; i++){

        var roundInfoTableInfo = game.roundInfo[i].value[0];

        if(game.roundInfo[i].updateTrigger.includes(mode)) {
            $('.roundMarkerTable .rnd-' + game.roundInfo[i].class).html(roundInfoTableInfo);
        }

    }
    updateGame();
}

function roundInfoUpdateCode(thisRoundInfo, index) {

    if(typeof thisRoundInfo.ignoreFirst === 'undefined') {
            // The increments value shows what is to happen to the value now that a change has been triggered.
        if(thisRoundInfo.increments == 'plusNum') {          
            // For the roundInfo that is loaded with 'plusNum', that value is incremented by one when triggered.     
            // This is commonly for recording and displaying the current round number, since that will always increase.
            thisRoundInfo.value[0]++;

            if(debugRoundInfo) console.log('game.roundInfo (plusNum):' + thisRoundInfo.value[0]);

        } else if(thisRoundInfo.increments == 'minusNum') {           
            // For the roundInfo that is loaded with 'minusNum', that value is decreased by one when triggered.   
            // This is commonly for recording and displaying the cards that are currently left in the deck, since they will diminish as the game keeps running
            thisRoundInfo.value[0]--;

            if(debugRoundInfo) console.log('game.roundInfo (minusNum):' + thisRoundInfo.value[0]);

        } else if(thisRoundInfo.increments == 'custom') {               
            // For the roundInfo that is loaded with 'custom', that is when the game has a unique set of values that can't simply be increased / decreased by one.

            // For instance - the Clans of Caledonia automa has specific Contract Cost amounts that need to be displayed each time the shuffle button is pressed

            // If the custom trigger has been activated, then the value at the 0 index is spliced (removed), which will enable the 2nd value to be the new value to be displayed. This way the code whittles through all of the custom information based on it's corresponding trigger

            // For instance:
            // value: ['+ $10', '$0', '- $10', '- $10', '- $10']

            // becomes

            // value: ['$0', '- $10', '- $10', '- $10']
            
            var lastOption = thisRoundInfo.value.splice(0, 1);        
            thisRoundInfo.value.push(lastOption[0]);

            if(debugRoundInfo) console.log('game.roundInfo (custom):' + thisRoundInfo.value[0]);
        } else if(thisRoundInfo.increments == 'special') {     
            var specialFunction = game.code + thisRoundInfo.class;
            callfunction(specialFunction);
        }
    }

}

function gameSection() {

        if(typeof game.gameSection != 'undefined') {
            if(game.gameSection.type == 'splitVersion') {
                for (let i = 0; i < game.gameSection.options.length; i++) {
                    if(game.gameSection.options[i].name == game.gameSection.version) return game.gameSection.options[i];
                }
            } else {
                return game.gameSection;
            }
        } else {
            return 'noGameSection';
        }
    

}

// This function is run every time that a significant action takes place, and if any of the gameSection values matches that trigger, then the value is updated in the code
function gameSectionUpdate(thisTrigger, thisGameSection) {
    // thisTrigger = 'shuffle', 'draw'

    if(debugGameSections) console.log('game.gameSection.type:' + thisGameSection.type);

    if(thisGameSection.type == 'splitVersion') {
        for (let i = 0; i < thisGameSection.options.length; i++) {
            if(thisGameSection.options[i].name == game.gameSection.version) gameSectionUpdate(thisTrigger, thisGameSection.options[i])        
        }

        return;
    }

    if(thisTrigger == thisGameSection.trigger) {
        if(debugGameSections) console.log('thisGameSection.trigger:' + thisGameSection.trigger);

        if(thisGameSection.type == 'accumulate') thisGameSection.values.unshift(thisGameSection.values[0] + 1);

        if(thisGameSection.type == 'plusSection') thisGameSection.values[0]++;

        if(thisGameSection.type == 'minusSection') thisGameSection.values[0]--;

        if(thisGameSection.type == 'alternate' || thisGameSection.type == 'multiple' || thisGameSection.type == 'alternateMultiple') {
            var index = thisGameSection.values.indexOf(thisGameSection.current);
            if(debugGameSections) console.log('thisGameSection.current:' + thisGameSection.current);
            if(debugGameSections) console.log('index:' + index);
            if(debugGameSections) console.log('thisGameSection.values.length - 1:' + parseInt(thisGameSection.values.length - 1));
            if(game.moveNum != 1) {
                index == thisGameSection.values.length - 1 ? index = 0 : index = index + 1;
            }
            if(debugGameSections) console.log('index:' + index);
            thisGameSection.current = thisGameSection.values[index];
            if(debugGameSections) console.log('gameSection.current:' + thisGameSection.current);
            
        } else {
            if(debugGameSections) console.log('thisGameSection.values[0]:' + thisGameSection.values[0]);
        }

    }

    // updateGame updates the localStorage for game and deck with the new information
    updateGame();
}

// This function is run every time that a significant action takes place, and if any of the gameSection values matches that trigger, then the value is updated in the code
function generateGameSections(side, firstCard, thisGameSection, mode) {

    if(debugGameSections) console.log('side:' + side);    
    if(debugGameSections) console.log('firstCard:' + firstCard);

    if(thisGameSection.type == 'splitVersion') {
        for (let i = 0; i < thisGameSection.options.length; i++) {
            if(thisGameSection.options[i].name == game.gameSection.version) generateGameSections(side, firstCard, thisGameSection.options[i], mode);    
        }
        return;
    }

    var time;
    firstCard ? time = 0 : time = 160;

    if(debugGameSections) console.log('time:' + time);    

    if(debugGameSections) console.log('thisGameSection:');
    if(debugGameSections) console.log(thisGameSection);

    if(debugGameSections) console.log('thisGameSection.current:');
    if(debugGameSections) console.log(thisGameSection.current);

    setTimeout(function(){
        $('.gameSection').remove();

        let gameSectionsHTML = '';        
        
        if(thisGameSection.type == 'accumulate') {
            if(debugGameSections) console.log('thisGameSection.max:' + thisGameSection.max);
            for (let i = 1; i < thisGameSection.max + 1; i++) {
                if(!thisGameSection.values.includes(thisGameSection.values[i - 1])) {
                    if(debugGameSections) console.log('thisGameSection.values:' + thisGameSection.values);
                    gameSectionsHTML += '<div id="gameSection' + i + '" class="gameSection"></div>';                
                }
            }
        } else if(thisGameSection.type == 'alternate') {

            if(debugGameSections) console.log('thisGameSection.current:' + thisGameSection.current);
            gameSectionsHTML += '<div id="gameSection' + thisGameSection.current + 'Active" class="gameSection"></div>';

        } else if(thisGameSection.type == 'multiple') {

            if(debugGameSections) console.log('thisGameSection.current:' + thisGameSection.current);
            
            for (let i = 0; i < thisGameSection.values.length; i++) {
                
                if(i != thisGameSection.values.indexOf(thisGameSection.current)) {
                    if(init.code != 'lg') {
                        gameSectionsHTML += '<div class="gameSection gameSection' + (i + 1) + '"></div>';
                    } else if(init.code == 'lg') {
                        if(thisGameSection.values.indexOf(thisGameSection.current) == 1 && i == 2) {
    
                        } else if(thisGameSection.values.indexOf(thisGameSection.current) == 2 && i == 1) {
                           
                        } else if(thisGameSection.values.indexOf(thisGameSection.current) == 0 && i == 1 || thisGameSection.values.indexOf(thisGameSection.current) == 3 && i == 1) {
                           
                        } else {
                            gameSectionsHTML += '<div class="gameSection gameSection' + (i + 1) + '"></div>';
                        }
                    }
                }
                
            }

        } else if(thisGameSection.type == 'alternateMultiple') {

            var recordedMove = '';
            var fullRecordedMove =  '';

            for (let i = 0; i < thisCard.actions.length; i++) {

                if(fullRecordedMove == '') {
                    fullRecordedMove = '<p><span class="bold ' + thisGameSection.current + 'Color">' + capitalizeFirstLetter(thisGameSection.current) + ':</span>&nbsp;&nbsp;';
                }

                if(thisCard.actions[i][game.gameSection.version + 'GameSection'] != thisGameSection.current || !thisCard.actions[i][game.gameSection.version]) {

                    gameSectionsHTML += '<div class="gameSection gameSection' + (i + 1) + 'Active ' + thisCard.actions[i].color + 'BackgroundColor">';

                    if(typeof thisCard.actions[i].extraGameSectionInfo != 'undefined') {
                        gameSectionsHTML += thisCard.actions[i].extraGameSectionInfo;
                     }
                    
                    gameSectionsHTML += '</div>';
                    
                } else {
                    if(recordedMove == '') {
                        recordedMove += thisCard.actions[i].desc;
                    } else {
                        recordedMove += '<span class="moveSymbol">&nbsp;&nbsp;' + game.moveSymbol + '&nbsp;&nbsp;</span>' + thisCard.actions[i].desc;
                    }
                }
            }

            if(recordedMove != '') {
                fullRecordedMove += recordedMove + '</p>';
            } else {
                fullRecordedMove += ' <span class="grey italic">No available moves</span></p>';
            }

            if(!game.resumeGame){
                recordMove(fullRecordedMove, 'custom', 'add');
            }
            
            if(debugGameSections) console.log('thisGameSection.current:' + thisGameSection.current);

        }

        $(gameSectionsHTML).appendTo('#' + side + 'CardPic');
    }, time)

}


function checkLastRound() {

    // If the current round is the same as the programmed 'endRound' value, then the lastRound code is activated.

    if (game.endGame.condition == 'round') {
        // Some games it's possible to keep performing actions on the last round (Clans of Caledonia)

        if(game.round == game.endGame.num) {
            if(game.endGame.lastRoundPlayable) {
                // If 'lastRoundPlayable' == true, just hide the shuffle button to avoid activating the next round
                gameButtonDisplay('shuffle', false);
    
            } else if(!game.lastRoundPlayable) {
                // If 'lastRoundPlayable' = false, then deactivate all buttons by replacing the HTML of the '#gameLayer .buttons' container with a note to say it's the last round.
              $('#gameLayer .buttons').html('<p class="lastRound">' + game.endGame.message + '</p>');
            // DeveloperNote: Check to see if resetGame() should be called here
            // Will need to check with Orleans, since previously had problems with the game exiting on the last round and then the user continuing from that point.
            //   resetGame();
            }
        }

    } else if (game.endGame.condition == 'move') {

        if(game.moveNum == game.endGame.num) {
            $('#gameLayer .buttons').html('<p class="lastRound">' + game.endGame.message + '</p>');
        }

    }
}

// If the newGame confirmation box button is clicked, or the '#start' button, then run this function to start
function resetGame(){

    thisCard = 0;

    // Remove the two localStorage variables so that there's no stored saved game
    localStorage.removeItem(game.code);
    localStorage.removeItem(game.code + '-deck');
    localStorage.removeItem(game.code + '-savedGame');

    // All elements with the class '.gameInfoReset' to be purged of their HTML.`
    // Examples of this are the History/Move container, as well as the containers that hold card information
    $('.gameInfoReset').html('');

    // All elements with the class '.gameInfoHide' are to be hidden
    // Examples of this are the flipCard container.
    $('.gameInfoHide').css('display', 'none');

    $('#resetGame').addClass('hidden');

    callfunction(game.cardDisplay, 'shuffle+' + JSON.stringify(gameSection()));

    initVars();
    
    if(typeof game.onReset != 'undefined') {
        for (let i = 0; i < game.onReset.length; i++) {
            callfunction(game.onReset[i]);
        }
    }

    // Run roundInfoSetup() to generate the roundInfo table since the roundInfo values have all now been updated with the values stored in localStorage from the users previous game
    if(typeof game.roundInfo != 'undefined') {
        roundInfoSetup();
    }
    

    if(game.onDraw.indexOf("removedCards") > -1) addRemovedCardsButton();

    startButtons();
    gameButtons();

    if(debugResetGame) console.log('deck:' + deck);

    updateGame();

}


//DeveloperNote: Maybe isolate this into a seperate script that's added to index.html during the initialize part of the script if the 'cardDisplay' value is 'flip'


function generateAlert(thisMsg) {
    // thisMsg = msg-noCards-3  (etc)

    // Set a timeout in order for any other layer adding / removal scripts to take action, so that there's no risk of code conflict with this associated code layer to be removed.
    setTimeout(function(){
        // thisMsg = ['msg', 'noCards', '3']
        thisMsg = thisMsg.split('-');

        // Loop through all of the stored messages in the 'alerts.js' file that sits on the top layer.
        for (let i = 0; i < msg.length; i++) {
            // thisMsg[1] = noCards  (etc)
            if (msg[i].name == thisMsg[1]) {
                // When there's match from the name of the activated alert with the name of an alert, generate the following code for a popup box and then display it:
                if(msg[i].type == 'confirm') {
                    // A msg.type with 'confirm' generates a confirmation box with a 'yes' or 'no' option. 
                    // The 'confirm' / 'yes' button is loaded with information that will be actioned when it's pushed, which involves running a function and then showing a layer and all of the associated elements with that new layer.
                    $('<div class="confirmationBox alertEl"><p>' + msg[i].msg + '</p><div class="buttons"><a href="#" id="confirm" class="btn redBtn activate-' + msg[i].success + '-' + thisMsg[2] +'">Yes</a><a href="#" id="cancel" class="btn redBtn">No</a></div></div>').appendTo('body');
                } else if(msg[i].type == 'alert') {
                    // A msg.type with 'alert' generates a confirmation box with only an 'ok' button that the user has to click in order to acknowledge the alert, such as a message to say that there's not enough cards in the deck to perform an action such as removing a card.
                    $('<div class="confirmationBox alertEl"><p>' + msg[i].msg + '</p><div class="buttons"><a href="#" id="cancel" class="btn redBtn">Ok</a></div></div>').appendTo('body');
                }

                $('.confirmationBox .buttons').attr('btns', $(".confirmationBox .buttons .btn:visible").length);

                // In addition to creating the relevant confirmation box and adding it to the body, fadeIn the #resetOverlay element.
                $('#resetOverlay').fadeIn(200);

                deactivateMenu();
                
            }
        }
    }, 100)
    
}

// When the showLayer is called, it should be passed through the layer to show as a singular number.
function showLayer(layer) {
    // layer = 3  (etc)

    // Hide all of the '.box' elements
    $('.layer').css('display', 'none');

    // Show the currently targeted layer, as well as all parents that also contain the '.box' class.
    $('#' + layer + 'Layer').css('display', 'block');

    // checkLastRound() is called, since the buttons associated with the triggered layer will always be shown, even if they've previously been hidden by the last round trigger, so each time a new layer is shown we run this function again to make sure all the relevant buttons are still hidden.
    if(typeof game.endGame !== 'undefined') checkLastRound();

    $('.buttons').each(function(){
        $(this).attr('btns', $(this).children('.btn:visible').length);
    })
}

// This function is used to call other variable functions which may be stored in text format, such as in the 'alert' array.
// Have parameter = noArgs if there is no extra information, but pass through the extra information if it needs to be passed through to the new function
function callfunction(funcName, parameter) {

    if(typeof parameter === 'undefined'){
        eval(funcName+"()");
    } else {
        if(parameter.indexOf("+") !== -1) {
            var allParameters = parameter.split('+');
            var parameterContent = '\'' + allParameters[0] + '\'';
            for (let i = 1; i < allParameters.length; i++) {
                parameterContent += ',\'' + allParameters[i] + '\''
            }
            eval(funcName+"(" + parameterContent + ")");
        } else {
            eval(funcName+"('" + parameter + "')");
        }

    }

}

// This function is called on any button that is subject to click spamming
function lockBtn(lockID){
    // Add the '.disabled' class to the activated button
    $('#' + lockID).addClass('disabled');

    var lockTime = 500;

    if(typeof game.lockBtn != 'undefined') {
        for (let i = 0; i < game.lockBtn.length; i++) {
            if(lockID == game.lockBtn[i].name) {
                lockTime = game.lockBtn[i].time;
            }            
        }
    }
    
    // Add a suitable timeout delay that will dictate when the user can next activate the button
    setTimeout(function(){
        // After the timeout is finished, removed the '.disabled' class, enabling the user to be able to click the function again
        $('.disabled').removeClass('disabled');
    }, lockTime);
}

// The shuffle function has arrays passed through to it, and it returns the same array but with the information shuffled up with new indexes
function shuffle(o){ 
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

function newGame(){
    localStorage.removeItem(game.code);
    localStorage.removeItem(game.code + '-deck');
    localStorage.removeItem(game.code + '-savedGame');
    document.location.reload(true);
}

// The update game function overrides all of the existing information held in localStorage with the updated values.
// This is usually called whenever any value is updated, such as in the 'draw()' or 'shuffle()' functions.
function updateGame(){
    localStorage.setItem(game.code, JSON.stringify(game));

    if(game.code != 'swor') {
        localStorage.setItem(game.code + '-deck', JSON.stringify(deck));
    }

    
}


// If the confirmation button in the "exitGame" alert is pressed, then run the below function to update the browser URL with the base URL for the user.
function exitGame(){
    // url = https://myautoma.github.io/games/clansofcaledonia/index.html"
    var url = window.location.href;

    // url = ['https://myautoma.github.io', 'clansofcaledonia/index.html']
    url = url.split('/games/');

    //url[0] = 'https://myautoma.github.io'
    window.top.location.href = url[0];
}

// Function to see if the the targeted object has the passed property
// An example of this being used is when generating the helpInfo content, and checking to see if the currently targeted 'helpInfo' section has 'subsections' present, and if it does, running the function again to process the next layer down in the stored content.
function hasProp(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

// This function is used to return a selected class from a inputted element, by passing through a keyword that the class you want retuned starts with
function classProcessor(element, keyword, mode) {
    //mode = 'split' or 'whole'

    // element = <a href="#" id="shuffle" class="btn blue lyr-3-btn alert msg-round-3"><span class="bold">+</span> Round</a> 
    // keyword = msg
    // mode = split

    // Split all of the classes with a space in order to seperate them all into an array

    let classes = element.attr('class').split(' ');
    // classes = ['btn', 'blue', 'lyr-3-btn', 'alert', 'msg-round-3']


    var thisClass = '';
    for(var i=0; i<classes.length; i++){
        // Loop through all of the classes in the 'classes' array, until finding the one that starts with the keyword that has been passed through to it
        // Keyword = msg
        if(classes[i].indexOf(keyword) !== -1){
            // classes[i] = msg-round-3;
            mode == 'split' ? thisClass = classes[i].split('-') : thisClass = classes[i]
            //if mode = split:
            // thisClass = ['msg', 'round', '3']

            //if mode = whole:
            // thisClass = 'msg-round-3'
        } 
    }

    // See above for the potential results that are returned from this function
    return thisClass;
}


// activateOverlay('helpQuickLink');
function activateOverlay(mode) {
    //mode = 'helpHistory, 'menu', 'alert'
    if(mode != 'menu') {
        deactivateMenu()
     } else {
        // Add an active class to activate the spin transition
        $('#menuIcon').addClass('active').removeClass('inactive');
        // Change the image of the menuIcon to it's active state, which represents a close icon
        $('#menuIcon').attr('src', '../../img/menuClose.png');
        // Show the menu content
        $('#menu').fadeIn(200);
     }

    // Add the 'noScroll' class to the body so that users cannot scroll the underlying page with viewing the overlay content
    $('body').addClass('noScroll');
    // Fade the '#resetOverlay' element in
    $('#resetOverlay').fadeIn(200);
}

function gameButtonDisplay(btnId, btnDisplay) {
    for (let i = 0; i < game.gameButtons.length; i++) {
        if(game.gameButtons[i].id == btnId) {
            game.gameButtons[i].display = btnDisplay;
        }
    }
    gameButtons();
}

function startButtons() {

    let startButtonsCode = '';

    for (let i = 0; i < game.startButtons.length; i++) {

        startButtonsCode += '<a href="#" id="' + game.startButtons[i].id + '" class="btn';
        
        // Loop through all of the associated classed on each button to add them to the newly created HTML element
        if (hasProp(game.startButtons[i], 'classes')) {
            for (let j = 0; j < game.startButtons[i].classes.length; j++) {
                startButtonsCode += ' ' + game.startButtons[i].classes[j];
            }
        }
        
        startButtonsCode += '">' + game.startButtons[i].name + '</a>';
    }

    $('#startLayer .buttons').html(startButtonsCode);
    
    // Runs function to check if the game code is stored in localstorage - if so show "Continue" buttons

    if(init.code != 'ws' && init.code != 'tp' && init.code != 'swor') {
        for (var i = 0; i < localStorage.length; i++){
            if(localStorage.key(i).startsWith(init.code+'-deck')) {
                // Show the continue button if there's a saved games stored
                $('#startLayer #continue').removeClass('hidden').addClass('activeBtn');
            }
        }
    } else if(init.code == 'ws') {
        for (var i = 0; i < localStorage.length; i++){
            if(localStorage.key(i).startsWith(init.code+'-savedGame')) {
                // Show the continue button if there's a saved games stored
                $('#startLayer #continue').removeClass('hidden').addClass('activeBtn');
            }
        }
    } else if(init.code == 'tp') {
        if(localStorage.getItem(init.code) !== null) {
            var gameDetails = JSON.parse(localStorage.getItem(init.code));
            if(gameDetails.usedCards.length > 0){
                $('#startLayer #continue').removeClass('hidden').addClass('activeBtn');
            }
        }
    } else if(init.code == 'swor') {
        if(localStorage.getItem(init.code) !== null) {
            $('#startLayer #continue').removeClass('hidden').addClass('activeBtn');
        }
    }

    // Check to see how many buttons are visible, updating the 'btns' attribute on the container so the relevant styles can kick in
    $('.buttons').each(function(){
        $(this).attr('btns', $(this).children('.btn:visible').length);
    })

}

function gameButtons() {

    let gameButtonsCode = '';

    for (let i = 0; i < game.gameButtons.length; i++) {
        if(game.gameButtons[i].display) {

            gameButtonsCode += '<a href="#" id="' + game.gameButtons[i].id + '" class="btn';
            
            if (hasProp(game.gameButtons[i], 'classes')) {
                for (let j = 0; j < game.gameButtons[i].classes.length; j++) {
                    gameButtonsCode += ' ' + game.gameButtons[i].classes[j];
                }
            }
            
            gameButtonsCode += '">' + game.gameButtons[i].name + '</a>';

        }  
    }

    $('#gameLayer .buttons').html(gameButtonsCode);
    $('#gameLayer .buttons').attr('btns', $("#gameLayer .buttons .btn").length);
}


function closeOverlays() {

    $('.keepOpen').removeClass('keepOpen');
    
    activateMenu();
    // Scroll the '#helpTextContainer' back to the top ready for the next 'helpInfoTrigger' to be clicked
    $('#helpTextContainer').scrollTop(0);
    // This hides any '.fullScreenOverlay' elements that may have previously been activated
    $('.fullScreenOverlay').css('display', 'none');
    // Close all of the '.helpInfo' boxes that may have been extended
    $('.helpInfo').css('display', 'none');
    // Change all of the active '-' symbols to their inactive state of '+'
    $('.helpInfoTrigger').children('span').html('+');
    // Remove the '.noScroll' class so that the main page can be scrollable again
    $('.noScroll').removeClass('noScroll');
    // Remove any elements with the '.alertEl' class (typically, any confirmation boxes that have previously been created)
    $('.alertEl').remove();
    // FadeOut the '#resetOverlay' element
    $('#resetOverlay').fadeOut(200);
}

function activateMenu() {
    if($('#resetOverlay2').css('display') != 'block') {
        // Hide the '#menu' content
        $('#menu').css('display', 'none');
        // Change the menuIcon image back to the deactivated icon image and change the z-index back to 4 (just in case it was last set to 2 to put it under the #resetOverlay)
        $('#menuIcon').css('z-index', '9').attr('src', '../../img/menuIcon.png');
        // Remove the '.active' state from the '#menuIcon' element in order to deactivate it
        $('.active').removeClass('active').addClass('inactive');
    }
}

function deactivateMenu() {
    
        // Push the menu z-index down so that it's under the z-index for the resetOverlay so that users can't click it.
        $('#menu').css('display', 'none');
        $('#menuIcon').css('z-index', '2');
        // Remove the '.active' state from the '#menuIcon' element in order to deactivate it
        $('.active').removeClass('active').addClass('inactive');
        // Change the menuIcon image back to the deactivated icon image and change the z-index back to 4 (just in case it was last set to 2 to put it under the #resetOverlay)
        $('#menuIcon').attr('src', '../../img/menuIcon.png');
    
}

function playAudio(sound) {
    for (let i = 0; i < audio.length; i++) {
        audio[i].pause();
        audio[i].currentTime = 0;
        if($(audio[i]).attr('id') == 'audio-' + sound) audio[i].play();
    }
}

function orientationChange() {
    setTimeout(function() {

        if (window.innerWidth < window.innerHeight) {
            console.log('Portrait');

        } else {
            console.log('Landscape');
        }

    }, 200);
}

function isTouchDevice() {
    return /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}
function isAppleDevice() {
    return /iPhone|iPod/.test(navigator.userAgent)
}
function isiPad() {
    return /iPad/.test(navigator.userAgent)
}

var percentColors = [
    { pct: 0.0, color: { r: 0xff, g: 0x00, b: 0 } },
    { pct: 0.5, color: { r: 0xff, g: 0xff, b: 0 } },
	{ pct: 1.0, color: { r: 0x00, g: 0xff, b: 0 } }
];
	

var getColorForPercentage = function(pct) {
    for (var i = 1; i < percentColors.length - 1; i++) {
        if (pct < percentColors[i].pct) {
            break;
        }
    }
    var lower = percentColors[i - 1];
    var upper = percentColors[i];
    var range = upper.pct - lower.pct;
    var rangePct = (pct - lower.pct) / range;
    var pctLower = 1 - rangePct;
    var pctUpper = rangePct;
    var color = {
        r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
        g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
        b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
    };
    return 'rgba(' + [color.r, color.g, color.b].join(',') + ', 0.6)';
    // or output as hex if preferred
}  

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function uncapitalizeFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1).toLowerCase();
}

function numberIntoText(num) {
    var nums = [1, 2, 3, 4, 5, 6];
    var text = ['one', 'two', 'three', 'four', 'five', 'six'];
    var pos = nums.indexOf(parseInt(num));
    return text[pos];
}

function numberIntoChoice(num) {
    var nums = [1, 2, 3, 4, 5, 6];
    var text = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth'];
    var pos = nums.indexOf(parseInt(num));
    return text[pos];
}


function numberIntoLetter(num) {
    var nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    var letter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
    var pos = nums.indexOf(parseInt(num));
    return letter[pos];
}

function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for(var i = 1; i < arr.length; i++) {
        if(arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }
    return maxIndex;
}


function emptyObj(value) {
    Object.keys(value).length === 0
      && value.constructor === Object; // 👈 constructor check
  }