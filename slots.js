// Deposit funds
// Determine number of lines
// Collect a bet amount
// spin slot machine
// check if user won
// give user winnings
// play again

// Deposit funds
const prompt = require("prompt-sync")();

// create slots
const ROWS = 3
const COLS = 3

const SYMBOLS_COUNT = {
    A: 3,
    B: 6,
    C: 9,
    D: 9,
    E: 6,
    F: 12
};

const SYMBOLS_VALUE = {
    A: 10,
    B: 5,
    C: 4,
    D: 4,
    E: 5,
    F: 2
};

const depositFunds = () => {
    while (true) {
        const depositAmount = prompt("Enter a deposit amount: ");
        const depostNumber = parseFloat(depositAmount);
        if (isNaN(depostNumber) || depostNumber <= 0) {
            console.log("Enter A Valid Amount!");
        } else {
            return depostNumber
        }
    }
};

// Determine number of lines
const bettingLines = () => {
    while (true) {
        const chosenLines = prompt("Enter a number of lines: ");
        const numberOfLines = parseInt(chosenLines);
        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines >= 3) {
            console.log("Enter A Valid number of lines!");
        }
        else if (chosenLines == "q") {
            break;
        } else {
            return numberOfLines;
        }
    }
};

// Collect a bet amount
const getBet = (balance, lines) => {
    while (true) {
        const betAmount = prompt("Enter a betting amount per line: ");
        const betNumber = parseFloat(betAmount);
        if (isNaN(betNumber) || betNumber <= 0 || betNumber > balance / lines) {
            console.log("Enter A Valid Bet!");
        }
        else if (betAmount == "q") {
            break;
        } else {
            return betNumber
        }
    }
};

// spin slot machine
const spinMachine = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let _ = 0; _ < count; _++) {
            symbols.push(symbol);
        }
    };
    const reels = [];
    for (let col = 0; col < COLS; col++) {
        reels.push([]);
        const reelsSymbols = [...symbols];
        for (let row = 0; row < ROWS; row++) {
            const randomIndex = Math.floor(Math.random() * reelsSymbols.length);
            const selectedSymbol = reelsSymbols[randomIndex];
            reels[col].push(selectedSymbol);
            reelsSymbols.splice(randomIndex, 1);
        }
    };
    return reels;
};

const transpose = (reels) => {
    const rows = [];
    for (let row = 0; row < ROWS; row++) {
        rows.push([]);
        for (let col = 0; col < COLS; col++) {
            rows[row].push(reels[col][row]);
        }
    };
    return rows;
};

const showSlots = (rows) => {
    for (const row of rows) {
        let rowString = "A"
        for (const [idx, symbol] of row.entries()) {
            rowString += symbol
            if (idx != row.length - 1) {
                rowString += " | "
            }
        }
        return rowString
    }
};

// check if user won
const getWinnings = (rows, bet, lines) => {
    let winnings = 0;
    for (let thisRow = 0; thisRow <= lines; thisRow++) {
        const symbols = rows[thisRow];
        let won = true;

        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                won = false;
                break;
            }
        }
        if (won) {
            winnings += bet * SYMBOLS_VALUE[symbols[0]]
        }
    }
    return winnings
};

const getNewBalance = (balance) => {
    console.log("New balance:\n$" + balance);
};

const recharge = (balance) => {
    const additional = depositFunds();
    balance += additional
    getNewBalance(balance)
    return balance
};


const playGame = () => {
    let play = true;
    let balance = depositFunds();
    while (play) {
        console.log("Current Balance: $" + balance)
        
        let start = prompt("'ENTER' to start/continue; 'q' to quit; 'd' to deposit more funds: ")
        if (start.toLowerCase() == "q") {
            play = false;
            return play;
        }
        else if (start.toLowerCase() == "d") {
            balance = recharge(balance);
        };

        const currentLines = bettingLines();
        const betValue = getBet(balance, currentLines);
        balance -= betValue * currentLines;
        getNewBalance(balance);
        const reels = spinMachine();
        const rows = transpose(reels);
        const spin = showSlots(rows);
        const winnings = getWinnings(rows, betValue, currentLines);
        console.log(spin);

        if (winnings > 0) {
            console.log("Congrats! You Won $" + winnings);
            balance += winnings;
            getNewBalance(balance);
        };

        if (balance <= 0) {
            console.log("You're out of funds.\nBalance: $" + balance);
            const quit = prompt("\nTo continue type:\n'd' to deposit more funds");
            if (quit.toLowerCase() == "d") {
                balance = recharge(balance);
            } else {
                play = false;
                return play;
            }
        }
    }
};

playGame();