const memory = (function() {
    // Positioning cards on the game board
    const deckArray = [],

    // Created string for DOM access
    DOM = {
        scorePanel: '.score-panel',
        stars: '.stars',
        moves: '.moves',
        restartBtn: '.restart',
        deck: '.deck',
        card: '.card',
        match: '.match',
        timer: '.timer',
        btnStart: '.btn-start',
        btnRestart: '.btn-restart',
        resultMoves: '.result-moves',
        resultStars: '.result-stars',
        resultTime: '.result-time',
    },

    // symbols for the cards in array
    cards = [
        'fa-diamond',
        'fa-anchor',
        'fa-bolt',
        'fa-leaf',
        'fa-cube',
        'fa-bicycle',
        'fa-bomb',
        'fa-paper-plane-o'
    ];
	
	// Disable main state /deleting body/ and starting the game
    const hideMain = function(type) {
        const body = document.querySelector('body');
        body.classList.remove('main');
        body.classList.remove(type);
        startGame();
    };
	
	// Function for stars, depending on clicks
    const updateStars = function() {
        if(stars === 1 || moves <= deckArray.length) return;
        
        // For every 6 moves over the amount of cards in the deck, there will be minus half star
        if((moves - deckArray.length) % 6 === 0) {
            stars -= 0.5;
            displayStars();
        }
    };
	
	/* 
     * variables for game state
     * ---------------------
     * firstCard: Node of the first card revealed that has been revealed in a turn
     * freezeGame: Flag to freeze the game - if true, no other elements can be clicked, this is to avoid cards being revealed while the turning cards animation is still in process
     * moves: status block for keeping the number of moves
     * startTime: needed for the function runTimer()
     * timerInterval: it is required for stopTimer();
     * totalTime: keeping track of the time
     */
    let firstCard,
    freezeGame = false,
    moves = 0,
    stars = 3,
    startTime = 0,
    timerInterval,
    totalTime = 0;

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/**
     * @function formatTime
     * @description Converts milliseconds to an object separated as minutes and seconds (if seconds < 10, then it has a preceding 0)
     * @param {number} ms - Time to convert to an object
     * @returns {Object} with two properties (minutes, seconds)
     */
    const formatTime = function(ms) {
        // Convert ms to s
        const unformattedSeconds = Math.floor(ms / 1000);
        // If applies, extract amount of minutes
        const minutes = unformattedSeconds >= 60 ? Math.floor(unformattedSeconds / 60) : 0;
        // Removing the minutes and get the rest of the time as seconds
        const seconds = minutes > 0 ? unformattedSeconds - (minutes * 60) : unformattedSeconds;
        
        return {
            minutes,
            seconds: seconds < 10 ? '0' + seconds : seconds
        };
    };
	
// Function for showing the time in the block
    const runTimer = function() {
        startTime = Date.now(); 
        timerInterval = setInterval(function() {
            totalTime = Date.now() - startTime;
            displayTimer(totalTime);
        }, 1000);
    };
	