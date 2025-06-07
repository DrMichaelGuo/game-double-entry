/**
 * Journal Journey Game JavaScript
 * Record transactions in proper journal entry format
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
    const journalRows = document.getElementById('journal-rows');
    const addRowBtn = document.getElementById('add-row');
    const totalDebitsDisplay = document.getElementById('total-debits');
    const totalCreditsDisplay = document.getElementById('total-credits');
    const journalBalancedDisplay = document.getElementById('journal-balanced');
    const checkAnswerBtn = document.getElementById('check-answer');
    const nextTransactionBtn = document.getElementById('next-transaction');
    const resetTransactionBtn = document.getElementById('reset-transaction');
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
        journalEntries: [],
        totalDebits: 0,
        totalCredits: 0
    };    // Available accounts by difficulty
    const accountLists = {
        easy: [
            "Cash", 
            "Trade Receivables", 
            "Inventory", 
            "Supplies", 
            "Prepaid Insurance", 
            "Equipment", 
            "Furniture", 
            "Trade Payables", 
            "Loans Payable", 
            "Deferred Income", 
            "Ordinary Shares", 
            "Owner's Capital", 
            "Retained Profits", 
            "Service Revenue", 
            "Sales Revenue", 
            "Rent Expense", 
            "Utilities Expense", 
            "Wages Expense", 
            "Supplies Expense", 
            "Insurance Expense"
        ],        medium: [
            "Cash", 
            "Trade Receivables", 
            "Provision for Doubtful Debts", 
            "Inventory", 
            "Supplies", 
            "Prepaid Insurance", 
            "Prepaid Rent", 
            "Equipment", 
            "Accumulated Depreciation - Equipment", 
            "Vehicles", 
            "Accumulated Depreciation - Vehicles", 
            "Buildings", 
            "Accumulated Depreciation - Buildings", 
            "Land", 
            "Trade Payables", 
            "Wages Payable", 
            "Interest Payable", 
            "Deferred Income", 
            "Loans Payable", 
            "Mortgage Payable", 
            "Ordinary Shares", 
            "Preference Shares", 
            "Share Premium", 
            "Retained Profits", 
            "Dividends", 
            "Service Revenue", 
            "Sales Revenue", 
            "Interest Revenue", 
            "Rent Revenue", 
            "Cost of Sales", 
            "Rent Expense", 
            "Utilities Expense", 
            "Wages Expense", 
            "Supplies Expense", 
            "Insurance Expense", 
            "Depreciation Expense", 
            "Interest Expense", 
            "Bad Debt Expense"
        ],        hard: [
            "Cash", 
            "Short-term Investments", 
            "Treasury Bills", 
            "Trading Securities", 
            "Trade Receivables", 
            "Provision for Doubtful Debts", 
            "Bills Receivable", 
            "Interest Receivable", 
            "Inventory", 
            "Supplies", 
            "Prepaid Insurance", 
            "Prepaid Rent", 
            "Prepaid Advertising", 
            "Equipment", 
            "Accumulated Depreciation - Equipment", 
            "Vehicles", 
            "Accumulated Depreciation - Vehicles", 
            "Buildings", 
            "Accumulated Depreciation - Buildings", 
            "Land", 
            "Land Improvements", 
            "Accumulated Depreciation - Land Improvements", 
            "Patents", 
            "Goodwill", 
            "Trademark", 
            "Copyright", 
            "Trade Payables", 
            "Wages Payable", 
            "Interest Payable", 
            "Corporation Tax Payable", 
            "Deferred Income", 
            "Loans Payable", 
            "Debentures Payable", 
            "Debenture Discount", 
            "Debenture Premium", 
            "Mortgage Payable", 
            "Deferred Tax Liability", 
            "Ordinary Shares", 
            "Preference Shares", 
            "Share Premium", 
            "Retained Profits", 
            "Treasury Shares", 
            "Dividends", 
            "Service Revenue", 
            "Sales Revenue", 
            "Interest Revenue", 
            "Dividend Revenue", 
            "Rent Revenue", 
            "Profit on Sale of Assets", 
            "Cost of Sales", 
            "Rent Expense", 
            "Utilities Expense", 
            "Wages Expense", 
            "Payroll Tax Expense", 
            "Supplies Expense", 
            "Insurance Expense", 
            "Depreciation Expense", 
            "Amortisation Expense", 
            "Interest Expense", 
            "Corporation Tax Expense", 
            "Bad Debt Expense", 
            "Advertising Expense", 
            "Loss on Sale of Assets"
        ]
    };

    // Transaction data by difficulty
    const transactionData = {
        easy: [            {
                description: "Purchased equipment for £10,000, paying £4,000 in cash and financing the remainder with a loan payable.",
                solution: [
                    { account: "Equipment", debit: 10000, credit: 0 },
                    { account: "Cash", debit: 0, credit: 4000 },
                    { account: "Loans Payable", debit: 0, credit: 6000 }
                ]
            },
            {
                description: "Received £3,500 cash from clients for services performed.",
                solution: [
                    { account: "Cash", debit: 3500, credit: 0 },
                    { account: "Service Revenue", debit: 0, credit: 3500 }
                ]
            },
            {
                description: "Paid £1,200 for rent for the current month.",
                solution: [
                    { account: "Rent Expense", debit: 1200, credit: 0 },
                    { account: "Cash", debit: 0, credit: 1200 }
                ]
            },
            {
                description: "Purchased £800 of supplies on account.",
                solution: [
                    { account: "Supplies", debit: 800, credit: 0 },
                    { account: "Trade Payables", debit: 0, credit: 800 }
                ]
            },
            {
                description: "Owner invested £20,000 cash in the business.",
                solution: [
                    { account: "Cash", debit: 20000, credit: 0 },
                    { account: "Owner's Capital", debit: 0, credit: 20000 }
                ]
            }
        ],        medium: [
            {
                description: "Purchased a delivery vehicle for £35,000, making a down payment of £10,000 in cash and signing a loan agreement for the balance.",
                solution: [
                    { account: "Vehicles", debit: 35000, credit: 0 },
                    { account: "Cash", debit: 0, credit: 10000 },
                    { account: "Loans Payable", debit: 0, credit: 25000 }
                ]
            },
            {
                description: "Recorded £2,500 of depreciation expense for equipment.",
                solution: [
                    { account: "Depreciation Expense", debit: 2500, credit: 0 },
                    { account: "Accumulated Depreciation - Equipment", debit: 0, credit: 2500 }
                ]
            },
            {
                description: "Paid £5,000 for a two-year insurance policy.",
                solution: [
                    { account: "Prepaid Insurance", debit: 5000, credit: 0 },
                    { account: "Cash", debit: 0, credit: 5000 }
                ]
            },
            {
                description: "Billed clients £8,500 for services performed on account.",
                solution: [
                    { account: "Trade Receivables", debit: 8500, credit: 0 },
                    { account: "Service Revenue", debit: 0, credit: 8500 }
                ]
            },
            {
                description: "Collected £4,200 from clients on account.",
                solution: [
                    { account: "Cash", debit: 4200, credit: 0 },
                    { account: "Trade Receivables", debit: 0, credit: 4200 }
                ]
            }
        ],        hard: [
            {
                description: "Issued 5,000 ordinary shares at £20 per share, for a total of £100,000.",
                solution: [
                    { account: "Cash", debit: 100000, credit: 0 },
                    { account: "Ordinary Shares", debit: 0, credit: 50000 },
                    { account: "Share Premium", debit: 0, credit: 50000 }
                ]
            },
            {
                description: "Issued debentures with a face value of £200,000 for £195,000, reflecting a debenture discount.",
                solution: [
                    { account: "Cash", debit: 195000, credit: 0 },
                    { account: "Debenture Discount", debit: 5000, credit: 0 },
                    { account: "Debentures Payable", debit: 0, credit: 200000 }
                ]
            },
            {
                description: "Recorded the adjusting entry for bad debt expense, estimating that 2% of the current trade receivables balance of £150,000 will be uncollectible.",
                solution: [
                    { account: "Bad Debt Expense", debit: 3000, credit: 0 },
                    { account: "Provision for Doubtful Debts", debit: 0, credit: 3000 }
                ]
            },
            {
                description: "Sold equipment that originally cost £25,000 with accumulated depreciation of £18,000 for £9,000 cash.",
                solution: [
                    { account: "Cash", debit: 9000, credit: 0 },
                    { account: "Accumulated Depreciation - Equipment", debit: 18000, credit: 0 },
                    { account: "Equipment", debit: 0, credit: 25000 },
                    { account: "Profit on Sale of Assets", debit: 0, credit: 2000 }
                ]
            },
            {
                description: "Received payment of £20,000 for services to be provided over the next 12 months.",
                solution: [
                    { account: "Cash", debit: 20000, credit: 0 },
                    { account: "Deferred Income", debit: 0, credit: 20000 }
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
        addRowBtn.addEventListener('click', addJournalRow);
        checkAnswerBtn.addEventListener('click', checkAnswer);
        nextTransactionBtn.addEventListener('click', nextTransaction);
        resetTransactionBtn.addEventListener('click', resetCurrentTransaction);
        continueGameBtn.addEventListener('click', continueAfterFeedback);
        playAgainBtn.addEventListener('click', resetGame);
    }

    // Reset/start game
    function resetGame() {
        // Reset game state
        gameState.score = 0;
        gameState.timer = 0;
        gameState.currentTransactionIndex = 0;
        gameState.journalEntries = [];
        gameState.totalDebits = 0;
        gameState.totalCredits = 0;

        // Reset UI displays
        scoreDisplay.textContent = '0';
        timerDisplay.textContent = '00:00';
        totalDebitsDisplay.textContent = '$0';
        totalCreditsDisplay.textContent = '$0';
        journalBalancedDisplay.textContent = 'Not Balanced';
        journalBalancedDisplay.style.color = '#86868b';
        
        gameInterface.style.display = 'block';
        gameFeedback.classList.add('hidden');
        gameComplete.classList.add('hidden');
        nextTransactionBtn.disabled = true;

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

        // Clear previous journal rows
        journalRows.innerHTML = '';
        gameState.journalEntries = [];
        gameState.totalDebits = 0;
        gameState.totalCredits = 0;

        // Add initial rows (2 rows by default)
        addJournalRow();
        addJournalRow();
        
        updateTotals();
    }

    // Add a new journal entry row
    function addJournalRow() {
        const rowIndex = gameState.journalEntries.length;
        
        // Create row
        const row = document.createElement('div');
        row.className = 'journal-row';
        row.setAttribute('data-row-index', rowIndex);
        
        // Create account select
        const accountCell = document.createElement('div');
        accountCell.className = 'journal-cell';
        const accountSelect = document.createElement('select');
        accountSelect.className = 'account-select';
        accountSelect.setAttribute('data-row-index', rowIndex);
        
        // Add empty option
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = '-- Select Account --';
        accountSelect.appendChild(emptyOption);
        
        // Add account options based on difficulty
        const accounts = accountLists[gameState.difficulty];
        accounts.forEach(account => {
            const option = document.createElement('option');
            option.value = account;
            option.textContent = account;
            accountSelect.appendChild(option);
        });
        
        accountCell.appendChild(accountSelect);
        
        // Create debit input
        const debitCell = document.createElement('div');
        debitCell.className = 'journal-cell';
        const debitInput = document.createElement('input');
        debitInput.type = 'text';
        debitInput.className = 'amount-input debit-input';
        debitInput.setAttribute('placeholder', '0.00');
        debitInput.setAttribute('data-row-index', rowIndex);
        debitCell.appendChild(debitInput);
        
        // Create credit input
        const creditCell = document.createElement('div');
        creditCell.className = 'journal-cell';
        const creditInput = document.createElement('input');
        creditInput.type = 'text';
        creditInput.className = 'amount-input credit-input';
        creditInput.setAttribute('placeholder', '0.00');
        creditInput.setAttribute('data-row-index', rowIndex);
        creditCell.appendChild(creditInput);
        
        // Remove button
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-row-btn';
        removeBtn.innerHTML = '&times;';
        removeBtn.setAttribute('data-row-index', rowIndex);
        removeBtn.addEventListener('click', (e) => {
            const rowIndex = e.target.getAttribute('data-row-index');
            removeJournalRow(rowIndex);
        });
        
        // Append all to row
        row.appendChild(accountCell);
        row.appendChild(debitCell);
        row.appendChild(creditCell);
        row.appendChild(removeBtn);
        
        // Append row to journal
        journalRows.appendChild(row);
        
        // Add entry to game state
        gameState.journalEntries.push({
            account: '',
            debit: 0,
            credit: 0
        });
        
        // Add event listeners
        accountSelect.addEventListener('change', updateJournalEntry);
        debitInput.addEventListener('input', (e) => {
            // Clear credit input if debit is filled
            const rowIndex = e.target.getAttribute('data-row-index');
            const creditInput = document.querySelector(`.credit-input[data-row-index="${rowIndex}"]`);
            if (e.target.value && creditInput.value) {
                creditInput.value = '';
            }
            updateJournalEntry(e);
        });
        
        creditInput.addEventListener('input', (e) => {
            // Clear debit input if credit is filled
            const rowIndex = e.target.getAttribute('data-row-index');
            const debitInput = document.querySelector(`.debit-input[data-row-index="${rowIndex}"]`);
            if (e.target.value && debitInput.value) {
                debitInput.value = '';
            }
            updateJournalEntry(e);
        });
    }

    // Remove a journal entry row
    function removeJournalRow(rowIndex) {
        // Remove from DOM
        const row = document.querySelector(`.journal-row[data-row-index="${rowIndex}"]`);
        if (row) {
            row.remove();
        }
        
        // Remove from game state
        gameState.journalEntries[rowIndex] = {
            account: '',
            debit: 0,
            credit: 0
        };
        
        updateTotals();
    }

    // Update journal entry in game state
    function updateJournalEntry(e) {
        const rowIndex = e.target.getAttribute('data-row-index');
        const row = document.querySelector(`.journal-row[data-row-index="${rowIndex}"]`);
        
        if (row) {
            const accountSelect = row.querySelector('.account-select');
            const debitInput = row.querySelector('.debit-input');
            const creditInput = row.querySelector('.credit-input');
            
            const account = accountSelect.value;
            const debitValue = parseFloat(debitInput.value) || 0;
            const creditValue = parseFloat(creditInput.value) || 0;
            
            gameState.journalEntries[rowIndex] = {
                account: account,
                debit: debitValue,
                credit: creditValue
            };
            
            updateTotals();
        }
    }

    // Update totals and check if journal is balanced
    function updateTotals() {
        let totalDebits = 0;
        let totalCredits = 0;
        
        gameState.journalEntries.forEach(entry => {
            totalDebits += entry.debit;
            totalCredits += entry.credit;
        });
        
        gameState.totalDebits = totalDebits;
        gameState.totalCredits = totalCredits;
        
        totalDebitsDisplay.textContent = formatCurrency(totalDebits);
        totalCreditsDisplay.textContent = formatCurrency(totalCredits);
        
        // Check if balanced
        if (totalDebits > 0 && totalDebits === totalCredits) {
            journalBalancedDisplay.textContent = 'Balanced!';
            journalBalancedDisplay.style.color = '#34c759';
        } else {
            journalBalancedDisplay.textContent = 'Not Balanced';
            journalBalancedDisplay.style.color = '#86868b';
        }
    }    // Format currency values
    function formatCurrency(value) {
        return '£' + value.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // Check if the provided answer is correct
    function checkAnswer() {
        const currentTransaction = gameState.transactions[gameState.currentTransactionIndex];
        const solution = currentTransaction.solution;
        
        if (gameState.totalDebits === 0 || gameState.totalCredits === 0) {
            feedbackContent.innerHTML = `
                <h2>Incomplete Entry</h2>
                <p>Please enter values for both debits and credits.</p>
            `;
            gameFeedback.classList.remove('hidden');
            return;
        }
        
        if (gameState.totalDebits !== gameState.totalCredits) {
            feedbackContent.innerHTML = `
                <h2>Journal Not Balanced</h2>
                <p>Your debits and credits must be equal.</p>
                <div class="feedback-detail">
                    <p>Total Debits: ${formatCurrency(gameState.totalDebits)}</p>
                    <p>Total Credits: ${formatCurrency(gameState.totalCredits)}</p>
                </div>
            `;
            gameFeedback.classList.remove('hidden');
            return;
        }
        
        // Filter out empty entries
        const userEntries = gameState.journalEntries.filter(entry => 
            entry.account && (entry.debit > 0 || entry.credit > 0)
        );
        
        // Check if the correct accounts are used
        let correctAccounts = true;
        let correctAmounts = true;
        let accountsMatched = 0;
        
        // Clone solution for marking off matched entries
        const solutionCopy = JSON.parse(JSON.stringify(solution));
        
        userEntries.forEach(userEntry => {
            // Find matching account in solution
            let matchFound = false;
            
            for (let i = 0; i < solutionCopy.length; i++) {
                const solutionEntry = solutionCopy[i];
                
                if (solutionEntry.account === userEntry.account && 
                    solutionEntry.debit === userEntry.debit && 
                    solutionEntry.credit === userEntry.credit) {
                    // Exact match found
                    solutionCopy.splice(i, 1); // Remove matched solution entry
                    matchFound = true;
                    accountsMatched++;
                    break;
                }
            }
            
            if (!matchFound) {
                // Check if at least account matches
                let accountMatched = false;
                for (let i = 0; i < solutionCopy.length; i++) {
                    if (solutionCopy[i].account === userEntry.account) {
                        accountMatched = true;
                        correctAmounts = false;
                        break;
                    }
                }
                
                if (!accountMatched) {
                    correctAccounts = false;
                }
            }
        });
        
        // Check if all solution entries were matched
        if (solutionCopy.length > 0) {
            correctAccounts = false;
        }
        
        // Update score and provide feedback
        if (correctAccounts && correctAmounts) {
            gameState.score += 100;
            scoreDisplay.textContent = gameState.score;
            
            feedbackContent.innerHTML = `
                <h2>Perfect Journal Entry!</h2>
                <p>You've correctly recorded the transaction. You've earned 100 points.</p>
                <div class="feedback-detail">
                    <p>Your journal entry matches the correct solution exactly.</p>
                </div>
            `;
        } else if (correctAccounts && !correctAmounts) {
            gameState.score += 50;
            scoreDisplay.textContent = gameState.score;
            
            feedbackContent.innerHTML = `
                <h2>Partially Correct</h2>
                <p>You've used the correct accounts but some amounts are incorrect. You've earned 50 points.</p>
                <div class="feedback-detail">
                    <h3>Correct Journal Entry:</h3>
                    ${formatSolutionHTML(solution)}
                </div>
            `;
        } else if (gameState.totalDebits === gameState.totalCredits && accountsMatched > 0) {
            gameState.score += 25;
            scoreDisplay.textContent = gameState.score;
            
            feedbackContent.innerHTML = `
                <h2>On the Right Track</h2>
                <p>Your entry is balanced but uses some incorrect accounts. You've earned 25 points.</p>
                <div class="feedback-detail">
                    <h3>Correct Journal Entry:</h3>
                    ${formatSolutionHTML(solution)}
                </div>
            `;
        } else {
            feedbackContent.innerHTML = `
                <h2>Try Again</h2>
                <p>Your journal entry needs improvement.</p>
                <div class="feedback-detail">
                    <h3>Correct Journal Entry:</h3>
                    ${formatSolutionHTML(solution)}
                </div>
            `;
        }
        
        gameFeedback.classList.remove('hidden');
        checkAnswerBtn.disabled = true;
        nextTransactionBtn.disabled = false;
    }

    // Format solution as HTML for feedback
    function formatSolutionHTML(solution) {
        let html = '<table class="solution-table"><tr><th>Account</th><th>Debit</th><th>Credit</th></tr>';
        
        solution.forEach(entry => {
            html += `<tr>
                <td>${entry.account}</td>
                <td>${entry.debit > 0 ? formatCurrency(entry.debit) : ''}</td>
                <td>${entry.credit > 0 ? formatCurrency(entry.credit) : ''}</td>
            </tr>`;
        });
        
        html += '</table>';
        return html;
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
            checkAnswerBtn.disabled = false;
        }
    }

    // Reset the current transaction
    function resetCurrentTransaction() {
        // Hide any feedback
        gameFeedback.classList.add('hidden');
        
        // Reset button states
        checkAnswerBtn.disabled = false;
        nextTransactionBtn.disabled = true;
        
        // Reload the current transaction to reset journal entries
        loadTransaction(gameState.currentTransactionIndex);
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

    // Add some additional CSS for the journal game
    const style = document.createElement('style');
    style.textContent = `
        .journal-table {
            width: 100%;
            margin-top: 2rem;
            border-collapse: collapse;
        }
        
        .journal-header {
            display: grid;
            grid-template-columns: 3fr 1fr 1fr 30px;
            gap: 0.8rem;
            padding: 1rem 0;
            border-bottom: 2px solid var(--secondary-color);
            font-weight: 600;
        }
        
        .journal-row {
            display: grid;
            grid-template-columns: 3fr 1fr 1fr 30px;
            gap: 0.8rem;
            padding: 0.8rem 0;
            border-bottom: 1px solid #eee;
        }
        
        .journal-cell {
            display: flex;
            align-items: center;
        }
        
        .account-select {
            width: 100%;
            padding: 0.8rem;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 1.5rem;
        }
        
        .amount-input {
            width: 100%;
            padding: 0.8rem;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 1.5rem;
            text-align: right;
        }
        
        .remove-row-btn {
            width: 30px;
            height: 30px;
            background: #ff3b30;
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 1.6rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
        }
        
        #add-row {
            margin-top: 1.6rem;
        }
        
        .journal-balance {
            display: flex;
            justify-content: flex-end;
            margin: 1.6rem 0;
            font-size: 1.6rem;
            font-weight: 600;
            gap: 2.4rem;
        }
        
        .solution-table {
            width: 100%;
            margin: 1.6rem 0;
            border-collapse: collapse;
        }
        
        .solution-table th,
        .solution-table td {
            padding: 0.8rem;
            text-align: left;
            border-bottom: 1px solid #eee;
        }
        
        .solution-table th:nth-child(2),
        .solution-table th:nth-child(3),
        .solution-table td:nth-child(2),
        .solution-table td:nth-child(3) {
            text-align: right;
        }
    `;
    document.head.appendChild(style);

    // Start the game
    initGame();
});
