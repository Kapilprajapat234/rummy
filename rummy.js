// Modal functionality
const modalBtns = {
    loginBtn: document.getElementById('loginBtn'),
    registerBtn: document.getElementById('registerBtn'),
    depositBtn: document.getElementById('depositBtn'),
    withdrawBtn: document.getElementById('withdrawBtn'),
    helpBtn: document.getElementById('helpBtn')
};

const modals = {
    loginModal: document.getElementById('loginModal'),
    registerModal: document.getElementById('registerModal'),
    depositModal: document.getElementById('depositModal'),
    withdrawModal: document.getElementById('withdrawModal'),
    helpModal: document.getElementById('helpModal')
};

// User balance (in-memory for demo)
let userBalance = 0.00;
let loggedIn = false;
let currentUsername = "";

// Update balance display
function updateBalanceDisplay() {
    const balanceDisplay = document.getElementById('balanceDisplay');
    if(balanceDisplay) {
        balanceDisplay.textContent = `₹${userBalance.toFixed(2)}`;
    }
}

// Initial balance update
document.addEventListener('DOMContentLoaded', () => {
    updateBalanceDisplay();
});

// Open modals
Object.keys(modalBtns).forEach(key => {
    const btn = modalBtns[key];
    const modalName = key.replace('Btn', 'Modal');
    const modal = modals[modalName];
    
    if (btn && modal) {
        btn.addEventListener('click', () => {
            modal.style.display = 'block';
        });
    }
});

// Close modals
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        Object.values(modals).forEach(modal => {
            modal.style.display = 'none';
        });
        // Hide QR code when deposit modal is closed
        document.getElementById('qrCodeSection').style.display = 'none';
        document.getElementById('depositFormSection').style.display = 'block';
    });
});

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    Object.values(modals).forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
            // Hide QR code when deposit modal is closed
            document.getElementById('qrCodeSection').style.display = 'none';
            document.getElementById('depositFormSection').style.display = 'block';
        }
    });
});

// Login form submission
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // In a real app, you would verify credentials with backend
    if (username && password) {
        loggedIn = true;
        currentUsername = username;
        document.getElementById('loginBtn').textContent = username;
        document.getElementById('loginModal').style.display = 'none';
        
        // Show welcome message
        alert(`Welcome back, ${username}!`);
        document.getElementById('loginForm').reset();
    } else {
        alert('Please enter both username and password.');
    }
});

// Register form submission
document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('newUsername').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const phone = document.getElementById('phoneNumber').value;
    
    // Password validation
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address!');
        return;
    }
    
    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
        alert('Please enter a valid 10-digit phone number!');
        return;
    }
    
    // Send OTP for verification (simulated)
    const otp = Math.floor(1000 + Math.random() * 9000); // 4-digit OTP
    document.getElementById('otpSection').style.display = 'block';
    document.getElementById('registerFormFields').style.display = 'none';
    
    // Store OTP in session (in a real app this would be server-side)
    window.sessionStorage.setItem('currentOTP', otp.toString());
    alert(`Your OTP is: ${otp} (In a real app, this would be sent to your phone)`);
});

// OTP verification
document.getElementById('verifyOtpBtn').addEventListener('click', () => {
    const enteredOtp = document.getElementById('otpInput').value;
    const storedOtp = window.sessionStorage.getItem('currentOTP');
    
    if (enteredOtp === storedOtp) {
        alert('Registration successful! You can now login.');
        
        // Reset register form and close modal
        document.getElementById('registerForm').reset();
        document.getElementById('otpSection').style.display = 'none';
        document.getElementById('registerFormFields').style.display = 'block';
        document.getElementById('registerModal').style.display = 'none';
    } else {
        alert('Invalid OTP. Please try again.');
    }
});

// Deposit form submission
document.getElementById('depositForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = document.getElementById('amount').value;
    const paymentMethod = document.getElementById('paymentMethod').value;
    
    if (!loggedIn) {
        alert('Please login first to make a deposit.');
        return;
    }
    
    if (amount < 100) {
        alert('Minimum deposit amount is ₹100');
        return;
    }
    
    // Show QR code for payment
    document.getElementById('depositFormSection').style.display = 'none';
    document.getElementById('qrCodeSection').style.display = 'block';
    document.getElementById('depositAmount').textContent = `₹${amount}`;
});

// Confirm deposit (after QR code scan)
document.getElementById('confirmDeposit').addEventListener('click', () => {
    const amount = parseFloat(document.getElementById('amount').value);
    
    // In a real app, you would verify payment with backend
    // For demo purposes, we'll just add the amount to balance
    userBalance += amount;
    updateBalanceDisplay();
    
    alert(`Deposit of ₹${amount} successful! Your new balance is ₹${userBalance.toFixed(2)}`);
    
    // Reset form and close modal
    document.getElementById('depositForm').reset();
    document.getElementById('qrCodeSection').style.display = 'none';
    document.getElementById('depositFormSection').style.display = 'block';
    document.getElementById('depositModal').style.display = 'none';
});

// Withdraw form submission
document.getElementById('withdrawForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('withdrawAmount').value);
    const upiId = document.getElementById('upiId').value;
    
    if (!loggedIn) {
        alert('Please login first to make a withdrawal.');
        return;
    }
    
    if (amount < 100) {
        alert('Minimum withdrawal amount is ₹100');
        return;
    }
    
    if (amount > userBalance) {
        alert('Insufficient balance for withdrawal');
        return;
    }
    
    // UPI ID validation
    const upiRegex = /^[\w\.\-]+@[\w\-]+$/;
    if (!upiRegex.test(upiId)) {
        alert('Please enter a valid UPI ID');
        return;
    }
    
    // In a real app, you would process withdrawal with backend
    // For demo purposes, we'll just subtract the amount from balance
    userBalance -= amount;
    updateBalanceDisplay();
    
    alert(`Withdrawal request of ₹${amount} to ${upiId} has been processed! Your new balance is ₹${userBalance.toFixed(2)}`);
    
    // Reset form and close modal
    document.getElementById('withdrawForm').reset();
    document.getElementById('withdrawModal').style.display = 'none';
});

// Help form submission
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('contactEmail').value;
    const message = document.getElementById('message').value;
    
    // In a real app, you would send this to backend
    alert('Your message has been sent! Our support team will contact you soon.');
    
    // Reset form
    document.getElementById('contactForm').reset();
});

// Aviator Game
const aviatorGameInterface = document.getElementById('aviatorGameInterface');
const placeBetBtn = document.getElementById('placeBetBtn');
const cashoutBtn = document.getElementById('cashoutBtn');
const airplane = document.querySelector('.airplane');
const multiplierDisplay = document.querySelector('.multiplier');

function playAviator() {
    if (!loggedIn) {
        alert('Please login to play games');
        document.getElementById('loginModal').style.display = 'block';
        return;
    }
    
    window.open('aviater.html', '_blank');
}

document.querySelector('#aviatorGameInterface .close-game').addEventListener('click', () => {
    aviatorGameInterface.style.display = 'none';
    resetAviatorGame();
});

placeBetBtn.addEventListener('click', startAviatorGame);
cashoutBtn.addEventListener('click', cashoutAviator);

let aviatorInterval;
let currentMultiplier = 1.0;
let gameActive = false;
let currentBet = 0;

function startAviatorGame() {
    if (gameActive) return;
    
    // Get bet amount
    currentBet = parseFloat(document.getElementById('betAmount').value);
    
    // Check if bet is valid
    if (isNaN(currentBet) || currentBet <= 0) {
        alert('Please enter a valid bet amount');
        return;
    }
    
    // Check if player has enough balance
    if (currentBet > userBalance) {
        alert('Insufficient balance');
        return;
    }
    
    // Deduct bet from balance
    userBalance -= currentBet;
    updateBalanceDisplay();
    
    gameActive = true;
    
    // Reset
    currentMultiplier = 1.0;
    multiplierDisplay.textContent = currentMultiplier.toFixed(2) + 'x';
    airplane.style.transform = 'translate(0, 0)';
    
    // Disable bet button, enable cashout
    placeBetBtn.disabled = true;
    cashoutBtn.disabled = false;
    
    // Start the game
    aviatorInterval = setInterval(() => {
        // Random crash point between 1.00x and 10.00x
        const crashPoint = 1 + Math.random() * 9;
        
        // Increase multiplier and move plane
        currentMultiplier += 0.01;
        multiplierDisplay.textContent = currentMultiplier.toFixed(2) + 'x';
        
        // Move airplane up and right
        const xMove = (currentMultiplier - 1) * 10;
        const yMove = (currentMultiplier - 1) * -10;
        airplane.style.transform = `translate(${xMove}px, ${yMove}px)`;
        
        // Check if game should crash
        if (currentMultiplier >= crashPoint) {
            crashAviator();
        }
    }, 100);
}

function cashoutAviator() {
    if (!gameActive) return;
    
    // Calculate winnings
    const winnings = currentBet * currentMultiplier;
    
    // Add winnings to balance
    userBalance += winnings;
    updateBalanceDisplay();
    
    alert(`Cashed out at ${currentMultiplier.toFixed(2)}x! You won ₹${winnings.toFixed(2)}`);
    
    // Update history
    updateAviatorHistory(currentMultiplier);
    
    // Reset game
    resetAviatorGame();
}

function crashAviator() {
    clearInterval(aviatorInterval);
    gameActive = false;
    
    // Visual indication of crash
    multiplierDisplay.style.color = 'red';
    
    alert(`Crashed at ${currentMultiplier.toFixed(2)}x! You lost ₹${currentBet.toFixed(2)}`);
    
    // Update history
    updateAviatorHistory(currentMultiplier);
    
    // Reset after delay
    setTimeout(() => {
        resetAviatorGame();
    }, 1000);
}

function resetAviatorGame() {
    clearInterval(aviatorInterval);
    gameActive = false;
    currentMultiplier = 1.0;
    multiplierDisplay.textContent = currentMultiplier.toFixed(2) + 'x';
    multiplierDisplay.style.color = '#f1c40f';
    placeBetBtn.disabled = false;
    cashoutBtn.disabled = true;
    airplane.style.transform = 'translate(0, 0)';
}

function updateAviatorHistory(value) {
    const historyItems = document.querySelector('.history-items');
    const newHistoryItem = document.createElement('span');
    newHistoryItem.className = 'history-item';
    newHistoryItem.textContent = value.toFixed(2) + 'x';
    
    // Add to beginning and remove oldest if more than 5
    historyItems.prepend(newHistoryItem);
    if (historyItems.children.length > 5) {
        historyItems.removeChild(historyItems.lastChild);
    }
}

// Mine Game
const mineGameInterface = document.getElementById('mineGameInterface');
const mineGrid = document.querySelector('.mine-grid');
const startMineGameBtn = document.getElementById('startMineGameBtn');
const cashoutMineBtn = document.getElementById('cashoutMineBtn');
const currentMultiplierDisplay = document.getElementById('currentMultiplier');

function playMineGame() {
    if (!loggedIn) {
        alert('Please login to play games');
        document.getElementById('loginModal').style.display = 'block';
        return;
    }
    
    window.open('minegame.html', '_blank');
}

document.querySelector('#mineGameInterface .close-game').addEventListener('click', () => {
    mineGameInterface.style.display = 'none';
    resetMineGame();
});

startMineGameBtn.addEventListener('click', startMineGame);
cashoutMineBtn.addEventListener('click', cashoutMineGame);

let mineGameActive = false;
let minePositions = [];
let revealedCells = 0;
let mineMultiplier = 1.0;
let mineBet = 0;

function setupMineGame() {
    // Clear previous grid
    mineGrid.innerHTML = '';
    
    // Create 5x5 grid
    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.className = 'mine-cell';
        cell.dataset.index = i;
        cell.addEventListener('click', () => revealCell(i));
        mineGrid.appendChild(cell);
    }
    
    resetMineGame();
}

function startMineGame() {
    if (mineGameActive) return;
    
    // Get bet amount and mines count
    mineBet = parseFloat(document.getElementById('mineBetAmount').value);
    const minesCount = parseInt(document.getElementById('minesCount').value);
    
    // Check if bet is valid
    if (isNaN(mineBet) || mineBet <= 0) {
        alert('Please enter a valid bet amount');
        return;
    }
    
    // Check if player has enough balance
    if (mineBet > userBalance) {
        alert('Insufficient balance');
        return;
    }
    
    // Deduct bet from balance
    userBalance -= mineBet;
    updateBalanceDisplay();
    
    // Reset game state
    mineGameActive = true;
    revealedCells = 0;
    mineMultiplier = 1.0;
    currentMultiplierDisplay.textContent = mineMultiplier.toFixed(2) + 'x';
    
    // Place mines randomly
    minePositions = [];
    while (minePositions.length < minesCount) {
        const position = Math.floor(Math.random() * 25);
        if (!minePositions.includes(position)) {
            minePositions.push(position);
        }
    }
    
    // Reset grid
    document.querySelectorAll('.mine-cell').forEach(cell => {
        cell.textContent = '';
        cell.style.backgroundColor = '#16213e';
        cell.style.color = '#fff';
    });
    
    // Update buttons
    startMineGameBtn.disabled = true;
    cashoutMineBtn.disabled = false;
}

function revealCell(index) {
    if (!mineGameActive) return;
    
    const cell = document.querySelector(`.mine-cell[data-index="${index}"]`);
    
    // Check if cell already revealed
    if (cell.textContent !== '') return;
    
    // Check if cell contains mine
    if (minePositions.includes(index)) {
        // Game over - hit a mine
        cell.textContent = '💣';
        cell.style.backgroundColor = '#e74c3c';
        
        // Reveal all mines
        minePositions.forEach(pos => {
            const mineCell = document.querySelector(`.mine-cell[data-index="${pos}"]`);
            mineCell.textContent = '💣';
            mineCell.style.backgroundColor = '#e74c3c';
        });
        
        alert(`You hit a mine! You lost ₹${mineBet.toFixed(2)}`);
        
        // End game
        mineGameActive = false;
        startMineGameBtn.disabled = false;
        cashoutMineBtn.disabled = true;
    } else {
        // Safe cell - reveal gem
        cell.textContent = '💎';
        cell.style.backgroundColor = '#2ecc71';
        
        // Increase multiplier
        revealedCells++;
        updateMineMultiplier();
    }
}

function updateMineMultiplier() {
    // Calculate new multiplier based on revealed cells and mine count
    const totalCells = 25;
    const safeCells = totalCells - minePositions.length;
    const multiplierStep = 0.2; // Increase per revealed cell
    
    mineMultiplier = 1 + (revealedCells * multiplierStep);
    currentMultiplierDisplay.textContent = mineMultiplier.toFixed(2) + 'x';
    
    // Check if all safe cells are revealed
    if (revealedCells >= safeCells) {
        cashoutMineGame();
    }
}

function cashoutMineGame() {
    if (!mineGameActive) return;
    
    // Calculate winnings
    const winnings = mineBet * mineMultiplier;
    
    // Add winnings to balance
    userBalance += winnings;
    updateBalanceDisplay();
    
    alert(`Cashed out at ${mineMultiplier.toFixed(2)}x! You won ₹${winnings.toFixed(2)}`);
    
    // End game
    mineGameActive = false;
    startMineGameBtn.disabled = false;
    cashoutMineBtn.disabled = true;
}

function resetMineGame() {
    mineGameActive = false;
    minePositions = [];
    revealedCells = 0;
    mineMultiplier = 1.0;
    currentMultiplierDisplay.textContent = mineMultiplier.toFixed(2) + 'x';
    
    // Reset grid
    document.querySelectorAll('.mine-cell').forEach(cell => {
        cell.textContent = '';
        cell.style.backgroundColor = '#16213e';
    });
    
    // Reset buttons
    startMineGameBtn.disabled = false;
    cashoutMineBtn.disabled = true;
}