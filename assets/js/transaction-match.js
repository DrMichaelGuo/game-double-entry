/**
 * Transaction Match Game JavaScript
 * Match debit and credit entries for accounting transactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const gameInterface = document.getElementById('game-interface');
    const gameFeedback = document.getElementById('game-feedback');
    const gameComplete = document.getElementById('game-complete');
    const feedbackContent = document.getElementById('feedback-content');
    const scoreDisplay = document.getElementById('score');
    const timerDisplay = document.getElementById('timer');
    const finalScoreDisplay = document.getElementById('final-score');
    const finalTimeDisplay = document.getElementById('final-time');
    const transactionDescription = document.getElementById('transaction-description');
    const accountsList = document.getElementById('accounts-list');
    const debitDropzone = document.getElementById('debit-dropzone');
    const creditDropzone = document.getElementById('credit-dropzone');
    const checkAnswerBtn = document.getElementById('check-answer');
    const nextTransactionBtn = document.getElementById('next-transaction');
    const continueGameBtn = document.getElementById('continue-game');
    const playAgainBtn = document.getElementById('play-again');
    const difficultyBtns = document.querySelectorAll('.difficulty-btn');

    // Game state
    let gameState = {
        score: 0,
        timer: 0,
        currentTransactionIndex: 0,
        transactions: [],
        difficulty: 'easy',
        timerInterval: null,
        draggingElement: null,
        debitSelection: null,
        creditSelection: null
    };

    // Transaction data by difficulty
    const transactionData = {
        easy: [
            {                description: "Purchased office equipment for £5,000 in cash.",
                correctDebit: "Office Equipment",
                correctCredit: "Cash",
                accounts: ["Office Equipment", "Cash", "Trade Payables", "Office Supplies", "Equipment Expense"]
            },
            {
                description: "Received £3,000 cash from clients for services performed.",
                correctDebit: "Cash",
                correctCredit: "Service Revenue",
                accounts: ["Cash", "Service Revenue", "Trade Receivables", "Deferred Income", "Sales"]
            },
            {
                description: "Paid £1,200 rent for the current month.",
                correctDebit: "Rent Expense",
                correctCredit: "Cash",
                accounts: ["Rent Expense", "Cash", "Trade Payables", "Prepaid Rent", "Office Expense"]
            },
            {
                description: "Owner invested £10,000 cash into the business.",
                correctDebit: "Cash",
                correctCredit: "Owner's Capital",
                accounts: ["Cash", "Owner's Capital", "Ordinary Shares", "Investment Revenue", "Loans Payable"]
            },
            {
                description: "Purchased £800 of office supplies on account.",
                correctDebit: "Office Supplies",
                correctCredit: "Trade Payables",
                accounts: ["Office Supplies", "Trade Payables", "Cash", "Supplies Expense", "Prepaid Expenses"]
            }
        ],
        medium: [
            {                description: "Paid £2,500 to settle trade payables from previous purchase.",
                correctDebit: "Trade Payables",
                correctCredit: "Cash",
                accounts: ["Trade Payables", "Cash", "Trade Receivables", "Loans Payable", "Accrued Expenses"]
            },
            {
                description: "Billed clients £4,500 for services rendered on account.",
                correctDebit: "Trade Receivables",
                correctCredit: "Service Revenue",
                accounts: ["Trade Receivables", "Service Revenue", "Cash", "Deferred Income", "Sales"]
            },
            {
                description: "Received £1,800 advance payment from customer for services to be provided next month.",
                correctDebit: "Cash",
                correctCredit: "Deferred Income",
                accounts: ["Cash", "Deferred Income", "Service Revenue", "Trade Receivables", "Prepaid Expenses"]
            },
            {
                description: "Recorded depreciation of £1,200 on equipment.",
                correctDebit: "Depreciation Expense",
                correctCredit: "Accumulated Depreciation",
                accounts: ["Depreciation Expense", "Accumulated Depreciation", "Equipment", "Cash", "Accrued Expenses"]
            },
            {
                description: "Paid £3,200 for a two-year insurance policy in advance.",
                correctDebit: "Prepaid Insurance",
                correctCredit: "Cash",
                accounts: ["Prepaid Insurance", "Cash", "Insurance Expense", "Trade Payables", "Accrued Expenses"]
            }
        ],
        hard: [
            {                description: "Recorded adjusting entry for £600 of accrued wages at month-end.",
                correctDebit: "Wage Expense",
                correctCredit: "Wages Payable",
                accounts: ["Wage Expense", "Wages Payable", "Cash", "Prepaid Wages", "Accrued Expenses"]
            },
            {
                description: "Sold equipment with original cost of £8,000 and accumulated depreciation of £5,000 for £2,500 cash.",
                correctDebit: "Cash, Accumulated Depreciation",
                correctCredit: "Equipment, Loss on Sale",
                accounts: ["Cash", "Accumulated Depreciation", "Equipment", "Loss on Sale", "Gain on Sale"]
            },
            {
                description: "Recognised £1,500 of previously deferred income upon completion of services.",
                correctDebit: "Deferred Income",
                correctCredit: "Service Revenue",
                accounts: ["Deferred Income", "Service Revenue", "Cash", "Trade Receivables", "Deferred Revenue"]
            },
            {
                description: "Issued debentures with par value of £50,000 for £48,000 cash (discount).",
                correctDebit: "Cash, Debenture Discount",
                correctCredit: "Debentures Payable",
                accounts: ["Cash", "Debenture Discount", "Debentures Payable", "Debenture Premium", "Interest Expense"]
            },
            {
                description: "Recognised £1,200 of previously prepaid rent expense that has now expired.",
                correctDebit: "Rent Expense",
                correctCredit: "Prepaid Rent",
                accounts: ["Rent Expense", "Prepaid Rent", "Cash", "Trade Payables", "Accrued Expenses"]
            }
        ]
    };

    // Initialize the game
    function initGame() {
        // Set up difficulty selection
        difficultyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                difficultyBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                gameState.difficulty = btn.dataset.level;
                resetGame();
            });
        });

        // Set up initial game
        resetGame();

        // Event listeners for game controls
        checkAnswerBtn.addEventListener('click', checkAnswer);
        nextTransactionBtn.addEventListener('click', nextTransaction);
        continueGameBtn.addEventListener('click', continueAfterFeedback);
        playAgainBtn.addEventListener('click', resetGame);

        // Set up drag and drop
        setupDragAndDrop();
    }

    // Reset/start game
    function resetGame() {
        // Reset game state
        gameState.score = 0;
        gameState.timer = 0;
        gameState.currentTransactionIndex = 0;
        gameState.debitSelection = null;
        gameState.creditSelection = null;

        // Reset UI displays
        scoreDisplay.textContent = '0';
        timerDisplay.textContent = '00:00';
        gameInterface.style.display = 'block';
        gameFeedback.classList.add('hidden');
        gameComplete.classList.add('hidden');
        nextTransactionBtn.disabled = true;

        // Reset dropzones
        resetDropzones();

        // Clear any existing timer
        if (gameState.timerInterval) {
            clearInterval(gameState.timerInterval);
        }

        // Start timer
        gameState.timerInterval = setInterval(updateTimer, 1000);

        // Shuffle and set transactions
        gameState.transactions = shuffleArray([...transactionData[gameState.difficulty]]);
        
        // Load first transaction
        loadTransaction(0);
    }

    // Load a transaction
    function loadTransaction(index) {
        const transaction = gameState.transactions[index];
        transactionDescription.textContent = transaction.description;

        // Clear previous accounts
        accountsList.innerHTML = '';

        // Create and add account elements
        shuffleArray([...transaction.accounts]).forEach(account => {
            const accountItem = document.createElement('div');
            accountItem.className = 'account-item';
            accountItem.textContent = account;
            accountItem.setAttribute('draggable', 'true');
            accountsList.appendChild(accountItem);

            // Set up drag events
            accountItem.addEventListener('dragstart', handleDragStart);
            accountItem.addEventListener('dragend', handleDragEnd);
        });

        // Reset dropzones
        resetDropzones();
    }

    // Reset dropzones to initial state
    function resetDropzones() {
        debitDropzone.innerHTML = '<p class="placeholder">Drag account here</p>';
        creditDropzone.innerHTML = '<p class="placeholder">Drag account here</p>';
        gameState.debitSelection = null;
        gameState.creditSelection = null;
        checkAnswerBtn.disabled = false;
        nextTransactionBtn.disabled = true;
    }

    // Check if the provided answer is correct
    function checkAnswer() {
        const currentTransaction = gameState.transactions[gameState.currentTransactionIndex];
        
        if (!gameState.debitSelection || !gameState.creditSelection) {
            feedbackContent.innerHTML = `
                <h2>Incomplete Entry</h2>
                <p>Please drag accounts to both debit and credit positions.</p>
            `;
            gameFeedback.classList.remove('hidden');
            return;
        }
        
        const debitCorrect = gameState.debitSelection === currentTransaction.correctDebit;
        const creditCorrect = gameState.creditSelection === currentTransaction.correctCredit;

        // Add visual indicators
        const debitAccount = debitDropzone.querySelector('.account-item');
        const creditAccount = creditDropzone.querySelector('.account-item');
        
        if (debitAccount) {
            debitAccount.classList.add(debitCorrect ? 'correct-answer' : 'incorrect-answer');
        }
        
        if (creditAccount) {
            creditAccount.classList.add(creditCorrect ? 'correct-answer' : 'incorrect-answer');
        }

        // Update score and provide feedback
        if (debitCorrect && creditCorrect) {
            gameState.score += 100;
            scoreDisplay.textContent = gameState.score;
            
            feedbackContent.innerHTML = `
                <h2>Correct!</h2>
                <p>Perfect double entry! You've earned 100 points.</p>
                <div class="feedback-detail">
                    <p><strong>Debit:</strong> ${currentTransaction.correctDebit}</p>
                    <p><strong>Credit:</strong> ${currentTransaction.correctCredit}</p>
                </div>
            `;
        } else if (debitCorrect || creditCorrect) {
            gameState.score += 50;
            scoreDisplay.textContent = gameState.score;
            
            feedbackContent.innerHTML = `
                <h2>Partially Correct</h2>
                <p>You got one side right! You've earned 50 points.</p>
                <div class="feedback-detail">
                    <p><strong>Correct Debit:</strong> ${currentTransaction.correctDebit}</p>
                    <p><strong>Correct Credit:</strong> ${currentTransaction.correctCredit}</p>
                </div>
            `;
        } else {
            feedbackContent.innerHTML = `
                <h2>Incorrect</h2>
                <p>Let's review the correct accounting entry:</p>
                <div class="feedback-detail">
                    <p><strong>Debit:</strong> ${currentTransaction.correctDebit}</p>
                    <p><strong>Credit:</strong> ${currentTransaction.correctCredit}</p>
                </div>
            `;
        }
        
        gameFeedback.classList.remove('hidden');
        checkAnswerBtn.disabled = true;
        nextTransactionBtn.disabled = false;
    }

    // Continue after feedback is shown
    function continueAfterFeedback() {
        gameFeedback.classList.add('hidden');
    }

    // Move to the next transaction
    function nextTransaction() {
        gameState.currentTransactionIndex++;
        
        if (gameState.currentTransactionIndex >= gameState.transactions.length) {
            // Game complete
            endGame();
        } else {
            // Load next transaction
            loadTransaction(gameState.currentTransactionIndex);
            nextTransactionBtn.disabled = true;
        }
    }

    // End the game and show final score
    function endGame() {
        clearInterval(gameState.timerInterval);
        
        finalScoreDisplay.textContent = gameState.score;
        finalTimeDisplay.textContent = formatTime(gameState.timer);
        
        gameInterface.style.display = 'none';
        gameComplete.classList.remove('hidden');
    }

    // Update timer display
    function updateTimer() {
        gameState.timer++;
        timerDisplay.textContent = formatTime(gameState.timer);
    }

    // Format time as MM:SS
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    }

    // Shuffle array (Fisher-Yates algorithm)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Set up drag and drop functionality
    function setupDragAndDrop() {
        // Dropzone event listeners
        [debitDropzone, creditDropzone].forEach(dropzone => {
            dropzone.addEventListener('dragover', handleDragOver);
            dropzone.addEventListener('dragenter', handleDragEnter);
            dropzone.addEventListener('dragleave', handleDragLeave);
            dropzone.addEventListener('drop', handleDrop);
        });
    }

    // Drag start handler
    function handleDragStart(e) {
        gameState.draggingElement = this;
        this.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', this.textContent);
    }

    // Drag end handler
    function handleDragEnd() {
        this.classList.remove('dragging');
        gameState.draggingElement = null;
    }

    // Drag over handler
    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.dataTransfer.dropEffect = 'move';
        return false;
    }

    // Drag enter handler
    function handleDragEnter(e) {
        this.classList.add('drag-over');
    }

    // Drag leave handler
    function handleDragLeave(e) {
        this.classList.remove('drag-over');
    }

    // Drop handler
    function handleDrop(e) {
        e.stopPropagation();
        
        this.classList.remove('drag-over');
        
        // Check if already has an account
        if (this.querySelector('.account-item') && gameState.draggingElement.parentNode !== this) {
            return false;
        }

        const isDebitZone = this === debitDropzone;
        const isCreditZone = this === creditDropzone;
        
        if ((isDebitZone || isCreditZone) && gameState.draggingElement) {
            // If dragged from another dropzone, restore the placeholder
            if (gameState.draggingElement.parentNode === debitDropzone) {
                debitDropzone.innerHTML = '<p class="placeholder">Drag account here</p>';
                gameState.debitSelection = null;
            } else if (gameState.draggingElement.parentNode === creditDropzone) {
                creditDropzone.innerHTML = '<p class="placeholder">Drag account here</p>';
                gameState.creditSelection = null;
            }
            
            // Clear the dropzone and add the dragged element
            this.innerHTML = '';
            const accountItem = gameState.draggingElement.cloneNode(true);
            accountItem.setAttribute('draggable', 'false');
            this.appendChild(accountItem);
            
            // Update the selection in game state
            if (isDebitZone) {
                gameState.debitSelection = accountItem.textContent;
            } else if (isCreditZone) {
                gameState.creditSelection = accountItem.textContent;
            }
        }
        
        return false;
    }

    // Start the game
    initGame();
});
