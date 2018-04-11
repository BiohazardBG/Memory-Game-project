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
	
	//Shuffle function
	
    const shuffleCards = function(cards, times) {
        for(let i = 0; i < times; i++) {
            let currentIndex = cards.length, temporaryValue, randomIndex;
                while (currentIndex !== 0) {
                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex -= 1;
                    temporaryValue = cards[currentIndex];
                    cards[currentIndex] = cards[randomIndex];
                    cards[randomIndex] = temporaryValue;
                }
        }
        return cards;
    };
	
	/**
     * @function formatTime
     * @description Converts milliseconds to an object separated as minutes and seconds (if seconds < 10, then it has a preceding 0)
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

    
    /* GAME STATE FUNCTIONS */

    // Returning true if selectedCard matches with firstCard
    const cardsMatch = function(selectedCard) {
        return deckArray[firstCard.dataset.index] === deckArray[selectedCard.dataset.index];
    };

    // Releases frozen game state and start the next turn
     
    const finishTurn = function() {
        firstCard = null;
        freezeGame = false;
    };

    // Returning true when game is finished
    const isGameWon = function() {
        return document.querySelectorAll(DOM.card).length === document.querySelectorAll(DOM.match).length;
    };

    
    // Stopping the timer
    const stopTimer = function() {
        clearInterval(timerInterval);
    };

    

    /**
     * @function updateMoves
     * @description Increments move by 1 and updates the UI
     */
    const updateMoves = function() {
        moves++;
        displayMoveCounter();
    };


    /* User interface */

    /**
     * @function gameWon
     * @description Stops the timer and displays results main when game is won
     */
    const gameWon = function() {
        stopTimer();
        displayMain('finished');
    };

    /**
     * @function toggleCardStyle
     * @description Toggles a class to two provided DOM Nodes
     */
    const toggleCardsStyle = function(cardOne, cardTwo, className) {
        cardOne.classList.toggle(className);
        cardTwo.classList.toggle(className);
    };

    

    /**
     * @function displayMain
     * @description Controls the main container and prepares the body to display main windows
     */
    const displayMain = function(type) {
        const body = document.querySelector('body');
        body.classList.add('main');
        body.classList.add(type);
        
        if(type === 'finished') {
            displayResults();
        }
    };

    /**
     * @function displayResults
     * @description Renders the result main window on the screen when game is won
     */
    const displayResults = function() {
        const formattedTime = formatTime(totalTime);
        const minutes = formattedTime.minutes;
        const seconds = formattedTime.seconds;

        let timeString = minutes > 0 ? (minutes > 1 ? minutes + ' minutes ' : minutes + ' minute ') : '';
        timeString += seconds + ' seconds';

        document.querySelector(DOM.resultMoves).textContent = moves;
        document.querySelector(DOM.resultStars).textContent = stars;
        document.querySelector(DOM.resultTime).textContent = timeString;
    };

    /**
     * @function displayTimer
     * @description Renders the time on UI in format 00:00 (MM:SS)
     */
    const displayTimer = function(ms) {
        const formattedTime = formatTime(ms);
        document.querySelector(DOM.timer).textContent = `${formattedTime.minutes}:${formattedTime.seconds}`;
    };

    /**
     * @function resetTimer
     * @description Resets the timer display to 00:00
     */
    const resetTimer = function() {
        displayTimer(0);
    };

    /**
     * @function displayStars
     * @description Renders stars on the user interface
     */
    const displayStars = function() {
        let html = '';
        for(let i = 0; i < 3; i++) {
            if(stars > i) {
                if(stars === i + 0.5) {
                    html += '<i class="fa fa-star-half-o"></i>';
                } else {
                    html += '<i class="fa fa-star"></i>';
                }
            } else {
                html += '<i class="fa fa-star-o"></i>';
            }
        }

        document.querySelector(DOM.stars).innerHTML = html;
    };

    /**
     * @function displayMoveCounter
     * @description Displays number of moves
     */
    const displayMoveCounter = function() {
        document.querySelector(DOM.moves).textContent = moves;
    };

    /**
     * @function createListItem
     * @description Takes Font-Awesome icon code and create a <li> with the attribute data-index={index}
     */
    const createListItem = function(icon, index) {
        return `<li class="card" data-index="${index}"><i class="fa ${icon}"></i></li>`;
    };

    /**
     * @function generateDeck
     * @description Displays cards on the deck
     */
    const generateDeck = function() {
        let html = deckArray.map(function(icon, index) {
            return createListItem(icon, index);
        }).join('');

        document.querySelector(DOM.deck).innerHTML = html;
    };

    /**
     * @function render
     * @description Central function to load UI components
     */
    const render = function() {
        generateDeck();
        displayMoveCounter();
        displayStars();
    };


    /* GAMING CONTROL */

    // Controls the behavior of the game when cards are being uncovered
   
    const showCards = function(evt) {
        if(evt.target.tagName !== 'LI' || evt.target.classList.contains('open') || freezeGame) return;
        
        const selectedCard = evt.target;
        selectedCard.classList.add('open');

        // Updating moves based on increment
        updateMoves();
        updateStars();

        // Check if it is the second shown card in this turn
        if(firstCard) {
            // Check if cards match
            freezeGame = true;
            if(cardsMatch(selectedCard)) {
                setTimeout(function() {
                    toggleCardsStyle(firstCard, selectedCard, 'match');
                    finishTurn();
                    
                    // check for game won
                    if(isGameWon()) {
                        gameWon();
                    }
                }, 200);
            } else {
                setTimeout(function() {
                    toggleCardsStyle(firstCard, selectedCard, 'mismatch');
                    
                    // Hide cards after mismatch
                    setTimeout(function() {
                        toggleCardsStyle(firstCard, selectedCard, 'open');
                        toggleCardsStyle(firstCard, selectedCard, 'mismatch');
                        finishTurn();
                    }, 500);
                }, 200)
            }
        } else {
            firstCard = selectedCard;
        }
    };

    // Registers event handlers on the game interface
    const setEventHandler = function() {
        document.querySelector(DOM.deck).addEventListener('click', showCards);
        document.querySelector(DOM.restartBtn).addEventListener('click', startGame);
        document.querySelector(DOM.btnStart).addEventListener('click', function() {
            hideMain('start');
        });
        document.querySelector(DOM.btnRestart).addEventListener('click', function() {
            hideMain('finished');
        });
    };

    // Reset the game and start a new one
    const startGame = function() {
        moves = 0;
        stars = 3;
        totalTime = 0;
        deckArray.splice(0, deckArray.length);
        deckArray.push(...shuffleCards([...cards, ...cards], 3));
        resetTimer();
        runTimer();
        render();
    };

    // Start the game and shuffles the cards
    const init = function() {
        deckArray.push(...shuffleCards([...cards, ...cards], 3));
        render();
        setEventHandler();
    };

    return {
        init,
    };
})();

memory.init();