/**
 * Balance Builder Game JavaScript
 * Create balanced financial statements by categorizing accounts
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
    const companyDescription = document.getElementById('company-description');
    const accountsList = document.getElementById('accounts-list');
    const assetsDropzone = document.getElementById('assets-dropzone');
    const liabilitiesDropzone = document.getElementById('liabilities-dropzone');
    const equityDropzone = document.getElementById('equity-dropzone');
    const totalAssetsDisplay = document.getElementById('total-assets');
    const totalLiabEquityDisplay = document.getElementById('total-liab-equity');
    const balanceResultDisplay = document.getElementById('balance-result');
    const checkAnswerBtn = document.getElementById('check-answer');
    const nextProblemBtn = document.getElementById('next-problem');
    const resetProblemBtn = document.getElementById('reset-problem');
    const continueGameBtn = document.getElementById('continue-game');
    const playAgainBtn = document.getElementById('play-again');
    const difficultyBtns = document.querySelectorAll('.difficulty-btn');

    // Game state
    let gameState = {
        score: 0,
        timer: 0,
        currentProblemIndex: 0,
        problems: [],
        difficulty: 'easy',
        timerInterval: null,
        draggingElement: null,
        assetAccounts: [],
        liabilityAccounts: [],
        equityAccounts: [],
        totalAssets: 0,
        totalLiabEquity: 0
    };

    // Problem data by difficulty
    const problemData = {
        easy: [
            {                company: "ABC Company is preparing its financial statements for the year ended 31 December 2025.",
                accounts: [
                    { name: "Cash", value: 15000, type: "asset" },
                    { name: "Trade Receivables", value: 8500, type: "asset" },
                    { name: "Inventory", value: 12000, type: "asset" },
                    { name: "Equipment", value: 25000, type: "asset" },
                    { name: "Trade Payables", value: 7500, type: "liability" },
                    { name: "Long-term Loans", value: 15000, type: "liability" },
                    { name: "Ordinary Shares", value: 20000, type: "equity" },
                    { name: "Retained Profits", value: 18000, type: "equity" }
                ]
            },
            {                company: "XYZ Corporation is finalising its year-end financial statements for 2025.",
                accounts: [
                    { name: "Cash", value: 22000, type: "asset" },
                    { name: "Investments", value: 15000, type: "asset" },
                    { name: "Office Equipment", value: 30000, type: "asset" },
                    { name: "Trade Payables", value: 12000, type: "liability" },
                    { name: "Loans Payable", value: 25000, type: "liability" },
                    { name: "Ordinary Shares", value: 15000, type: "equity" },
                    { name: "Retained Profits", value: 15000, type: "equity" }
                ]
            },
            {                company: "123 Services Ltd is preparing its financial statements for Q2 2025.",
                accounts: [
                    { name: "Cash", value: 18500, type: "asset" },
                    { name: "Trade Receivables", value: 9500, type: "asset" },
                    { name: "Supplies", value: 2000, type: "asset" },
                    { name: "Trade Payables", value: 5500, type: "liability" },
                    { name: "Wages Payable", value: 4500, type: "liability" },
                    { name: "Owner's Capital", value: 20000, type: "equity" }
                ]
            }
        ],
        medium: [
            {                company: "Global Innovations plc is preparing its financial statements for fiscal year 2025.",
                accounts: [
                    { name: "Cash", value: 35000, type: "asset" },
                    { name: "Short-term Investments", value: 22000, type: "asset" },
                    { name: "Trade Receivables", value: 18000, type: "asset" },
                    { name: "Inventory", value: 43000, type: "asset" },
                    { name: "Prepaid Insurance", value: 7000, type: "asset" },
                    { name: "Equipment", value: 65000, type: "asset" },
                    { name: "Accumulated Depreciation", value: 15000, type: "contra-asset" },
                    { name: "Trade Payables", value: 24000, type: "liability" },
                    { name: "Deferred Income", value: 12000, type: "liability" },
                    { name: "Long-term Loans", value: 50000, type: "liability" },
                    { name: "Ordinary Shares", value: 40000, type: "equity" },
                    { name: "Share Premium", value: 15000, type: "equity" },
                    { name: "Retained Profits", value: 34000, type: "equity" }
                ]
            },
            {                company: "Tech Solutions Ltd. is finalising its quarterly statements for Q3 2025.",
                accounts: [
                    { name: "Cash", value: 28000, type: "asset" },
                    { name: "Trade Receivables", value: 34000, type: "asset" },
                    { name: "Provision for Doubtful Debts", value: 5000, type: "contra-asset" },
                    { name: "Inventory", value: 42000, type: "asset" },
                    { name: "Buildings", value: 120000, type: "asset" },
                    { name: "Accumulated Depreciation - Buildings", value: 25000, type: "contra-asset" },
                    { name: "Equipment", value: 85000, type: "asset" },
                    { name: "Accumulated Depreciation - Equipment", value: 30000, type: "contra-asset" },
                    { name: "Trade Payables", value: 32000, type: "liability" },
                    { name: "Wages Payable", value: 18000, type: "liability" },
                    { name: "Debentures Payable", value: 75000, type: "liability" },
                    { name: "Ordinary Shares", value: 50000, type: "equity" },
                    { name: "Retained Profits", value: 74000, type: "equity" }
                ]
            }
        ],
        hard: [
            {                company: "Multinational Holdings plc is preparing its consolidated financial statements for fiscal year 2025.",
                accounts: [
                    { name: "Cash", value: 125000, type: "asset" },
                    { name: "Short-term Investments", value: 87000, type: "asset" },
                    { name: "Trade Receivables", value: 142000, type: "asset" },
                    { name: "Provision for Doubtful Debts", value: 28000, type: "contra-asset" },
                    { name: "Inventory", value: 195000, type: "asset" },
                    { name: "Prepaid Expenses", value: 34000, type: "asset" },
                    { name: "Land", value: 350000, type: "asset" },
                    { name: "Buildings", value: 780000, type: "asset" },
                    { name: "Accumulated Depreciation - Buildings", value: 210000, type: "contra-asset" },
                    { name: "Equipment", value: 425000, type: "asset" },
                    { name: "Accumulated Depreciation - Equipment", value: 155000, type: "contra-asset" },
                    { name: "Patents", value: 180000, type: "asset" },
                    { name: "Goodwill", value: 250000, type: "asset" },
                    { name: "Trade Payables", value: 86000, type: "liability" },
                    { name: "Accrued Expenses", value: 47000, type: "liability" },
                    { name: "Corporation Tax Payable", value: 65000, type: "liability" },
                    { name: "Deferred Income", value: 53000, type: "liability" },
                    { name: "Loans Payable", value: 175000, type: "liability" },
                    { name: "Debentures Payable", value: 450000, type: "liability" },
                    { name: "Deferred Tax Liability", value: 72000, type: "liability" },
                    { name: "Ordinary Shares", value: 500000, type: "equity" },
                    { name: "Share Premium", value: 325000, type: "equity" },
                    { name: "Treasury Shares", value: 120000, type: "contra-equity" },
                    { name: "Retained Profits", value: 422000, type: "equity" }
                ]
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
        nextProblemBtn.addEventListener('click', nextProblem);
        resetProblemBtn.addEventListener('click', resetCurrentProblem);
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
        gameState.currentProblemIndex = 0;
        gameState.assetAccounts = [];
        gameState.liabilityAccounts = [];
        gameState.equityAccounts = [];
        gameState.totalAssets = 0;
        gameState.totalLiabEquity = 0;        // Reset UI displays
        scoreDisplay.textContent = '0';
        timerDisplay.textContent = '00:00';
        totalAssetsDisplay.textContent = '£0';
        totalLiabEquityDisplay.textContent = '£0';
        balanceResultDisplay.textContent = 'Not Balanced';
        balanceResultDisplay.style.color = '#86868b';
        
        gameInterface.style.display = 'block';
        gameFeedback.classList.add('hidden');
        gameComplete.classList.add('hidden');
        nextProblemBtn.disabled = true;

        // Reset dropzones
        resetDropzones();

        // Clear any existing timer
        if (gameState.timerInterval) {
            clearInterval(gameState.timerInterval);
        }

        // Start timer
        gameState.timerInterval = setInterval(updateTimer, 1000);

        // Shuffle and set problems
        gameState.problems = shuffleArray([...problemData[gameState.difficulty]]);
        
        // Load first problem
        loadProblem(0);
    }

    // Load a problem
    function loadProblem(index) {
        const problem = gameState.problems[index];
        companyDescription.textContent = problem.company;

        // Clear previous accounts
        accountsList.innerHTML = '';

        // Create and add account elements
        shuffleArray([...problem.accounts]).forEach(account => {
            const formattedValue = formatCurrency(account.value);
            const accountItem = document.createElement('div');
            accountItem.className = 'account-item';
            accountItem.textContent = `${account.name}: ${formattedValue}`;
            
            // Store account data as attributes
            accountItem.setAttribute('data-name', account.name);
            accountItem.setAttribute('data-value', account.value);
            accountItem.setAttribute('data-type', account.type);
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
        assetsDropzone.innerHTML = '<p class="placeholder">Drag asset accounts here</p>';
        liabilitiesDropzone.innerHTML = '<p class="placeholder">Drag liability accounts here</p>';
        equityDropzone.innerHTML = '<p class="placeholder">Drag equity accounts here</p>';
        
        gameState.assetAccounts = [];
        gameState.liabilityAccounts = [];
        gameState.equityAccounts = [];
        
        updateTotals();
    }

    // Update the total calculations
    function updateTotals() {
        let assetTotal = calculateTotal(gameState.assetAccounts);
        let liabilityTotal = calculateTotal(gameState.liabilityAccounts);
        let equityTotal = calculateTotal(gameState.equityAccounts);
        
        gameState.totalAssets = assetTotal;
        gameState.totalLiabEquity = liabilityTotal + equityTotal;
        
        totalAssetsDisplay.textContent = formatCurrency(assetTotal);
        totalLiabEquityDisplay.textContent = formatCurrency(gameState.totalLiabEquity);
        
        // Check if balanced
        if (gameState.totalAssets > 0 && gameState.totalAssets === gameState.totalLiabEquity) {
            balanceResultDisplay.textContent = 'Balanced!';
            balanceResultDisplay.style.color = '#34c759';
        } else {
            balanceResultDisplay.textContent = 'Not Balanced';
            balanceResultDisplay.style.color = '#86868b';
        }
    }

    // Calculate total value for an array of accounts
    function calculateTotal(accounts) {
        return accounts.reduce((total, account) => {
            // Handle contra accounts (subtract instead of add)
            if (account.type.includes('contra')) {
                return total - account.value;
            }
            return total + account.value;
        }, 0);
    }    // Format currency values
    function formatCurrency(value) {
        return '£' + value.toLocaleString('en-GB');
    }

    // Check if the provided solution is correct
    function checkAnswer() {
        const currentProblem = gameState.problems[gameState.currentProblemIndex];
        
        if (gameState.assetAccounts.length === 0 || 
            (gameState.liabilityAccounts.length === 0 && gameState.equityAccounts.length === 0)) {
            feedbackContent.innerHTML = `
                <h2>Incomplete Solution</h2>
                <p>Please categorize all accounts before submitting.</p>
            `;
            gameFeedback.classList.remove('hidden');
            return;
        }
        
        // Verify if accounts are correctly categorized
        let correctCategories = true;
        let misplacedAccounts = [];

        // Check assets
        gameState.assetAccounts.forEach(account => {
            if (account.type !== 'asset' && account.type !== 'contra-asset') {
                correctCategories = false;
                misplacedAccounts.push({
                    name: account.name,
                    placed: 'Assets',
                    correct: account.type.includes('liability') ? 'Liabilities' : 'Equity'
                });
            }
        });

        // Check liabilities
        gameState.liabilityAccounts.forEach(account => {
            if (account.type !== 'liability') {
                correctCategories = false;
                misplacedAccounts.push({
                    name: account.name,
                    placed: 'Liabilities',
                    correct: account.type.includes('asset') ? 'Assets' : 'Equity'
                });
            }
        });

        // Check equity
        gameState.equityAccounts.forEach(account => {
            if (account.type !== 'equity' && account.type !== 'contra-equity') {
                correctCategories = false;
                misplacedAccounts.push({
                    name: account.name,
                    placed: 'Equity',
                    correct: account.type.includes('asset') ? 'Assets' : 'Liabilities'
                });
            }
        });

        const isBalanced = gameState.totalAssets === gameState.totalLiabEquity;
        
        // Update score and provide feedback
        if (correctCategories && isBalanced) {
            gameState.score += 100;
            scoreDisplay.textContent = gameState.score;
            
            feedbackContent.innerHTML = `
                <h2>Correct!</h2>
                <p>Perfect balance sheet! You've earned 100 points.</p>
                <div class="feedback-detail">
                    <p>Total Assets = Total Liabilities + Equity</p>
                    <p>${formatCurrency(gameState.totalAssets)} = ${formatCurrency(gameState.totalLiabEquity)}</p>
                </div>
            `;
        } else if (isBalanced && !correctCategories) {
            gameState.score += 50;
            scoreDisplay.textContent = gameState.score;
            
            let misplacedText = '<ul>';
            misplacedAccounts.forEach(account => {
                misplacedText += `<li>${account.name} should be in ${account.correct}, not ${account.placed}</li>`;
            });
            misplacedText += '</ul>';
            
            feedbackContent.innerHTML = `
                <h2>Partially Correct</h2>
                <p>The balance sheet balances, but some accounts are miscategorized. You've earned 50 points.</p>
                <div class="feedback-detail">
                    <p>Issues to fix:</p>
                    ${misplacedText}
                </div>
            `;
        } else if (!isBalanced && correctCategories) {
            gameState.score += 25;
            scoreDisplay.textContent = gameState.score;
            
            feedbackContent.innerHTML = `
                <h2>Almost There</h2>
                <p>Accounts are correctly categorized, but the balance sheet doesn't balance. You've earned 25 points.</p>
                <div class="feedback-detail">
                    <p>Total Assets: ${formatCurrency(gameState.totalAssets)}</p>
                    <p>Total Liabilities + Equity: ${formatCurrency(gameState.totalLiabEquity)}</p>
                </div>
            `;
        } else {
            feedbackContent.innerHTML = `
                <h2>Needs Improvement</h2>
                <p>The balance sheet isn't balanced, and some accounts are miscategorized.</p>
                <div class="feedback-detail">
                    <p>Remember: Assets = Liabilities + Equity</p>
                </div>
            `;
        }
        
        gameFeedback.classList.remove('hidden');
        checkAnswerBtn.disabled = true;
        nextProblemBtn.disabled = false;
    }

    // Continue after feedback is shown
    function continueAfterFeedback() {
        gameFeedback.classList.add('hidden');
    }

    // Move to the next problem
    function nextProblem() {
        gameState.currentProblemIndex++;
        
        if (gameState.currentProblemIndex >= gameState.problems.length) {
            // Game complete
            endGame();
        } else {
            // Load next problem
            loadProblem(gameState.currentProblemIndex);
            nextProblemBtn.disabled = true;
            checkAnswerBtn.disabled = false;
        }
    }

    // Reset the current problem
    function resetCurrentProblem() {
        // Reset dropzones and clear all placed accounts
        resetDropzones();
        
        // Hide any feedback
        gameFeedback.classList.add('hidden');
        
        // Reset button states
        checkAnswerBtn.disabled = false;
        nextProblemBtn.disabled = true;
        
        // Reload the current problem to reset draggable accounts
        loadProblem(gameState.currentProblemIndex);
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
        [assetsDropzone, liabilitiesDropzone, equityDropzone].forEach(dropzone => {
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
        
        if (gameState.draggingElement) {
            const accountName = gameState.draggingElement.getAttribute('data-name');
            const accountValue = parseInt(gameState.draggingElement.getAttribute('data-value'));
            const accountType = gameState.draggingElement.getAttribute('data-type');
            
            // Create account object
            const account = {
                name: accountName,
                value: accountValue,
                type: accountType
            };
            
            // Remove placeholder if it exists (but keep other content)
            const placeholder = this.querySelector('.placeholder');
            if (placeholder) {
                placeholder.remove();
            }
            
            // If the account is already placed elsewhere, remove it
            removeAccountFromAllCategories(accountName);
            
            // Add to the appropriate category
            if (this === assetsDropzone) {
                gameState.assetAccounts.push(account);
            } else if (this === liabilitiesDropzone) {
                gameState.liabilityAccounts.push(account);
            } else if (this === equityDropzone) {
                gameState.equityAccounts.push(account);
            }
            
            // Create and append the account element in the dropzone
            const accountItem = document.createElement('div');
            accountItem.className = 'account-item placed-account';
            accountItem.textContent = gameState.draggingElement.textContent;
            accountItem.setAttribute('data-name', accountName);
            
            // Add double-click to remove
            accountItem.addEventListener('dblclick', function() {
                removeAccount(accountItem);
            });
            
            this.appendChild(accountItem);
            
            // Update totals
            updateTotals();
        }
        
        return false;
    }

    // Remove account from all categories
    function removeAccountFromAllCategories(accountName) {
        gameState.assetAccounts = gameState.assetAccounts.filter(a => a.name !== accountName);
        gameState.liabilityAccounts = gameState.liabilityAccounts.filter(a => a.name !== accountName);
        gameState.equityAccounts = gameState.equityAccounts.filter(a => a.name !== accountName);
        
        // Remove from DOM
        document.querySelectorAll('.placed-account').forEach(item => {
            if (item.getAttribute('data-name') === accountName) {
                item.remove();
            }
        });
        
        // Add placeholders if categories are empty
        if (gameState.assetAccounts.length === 0) {
            assetsDropzone.innerHTML = '<p class="placeholder">Drag asset accounts here</p>';
        }
        
        if (gameState.liabilityAccounts.length === 0) {
            liabilitiesDropzone.innerHTML = '<p class="placeholder">Drag liability accounts here</p>';
        }
        
        if (gameState.equityAccounts.length === 0) {
            equityDropzone.innerHTML = '<p class="placeholder">Drag equity accounts here</p>';
        }
    }

    // Remove account when double-clicked
    function removeAccount(accountElement) {
        const accountName = accountElement.getAttribute('data-name');
        removeAccountFromAllCategories(accountName);
        updateTotals();
    }

    // Start the game
    initGame();
});
