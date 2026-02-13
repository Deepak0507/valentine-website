// Configuration - You can still edit the default message here
const EMAIL_CONFIG = {
    subject: 'Someone Said YES to Being Your Valentine! 💕',
    message: `
🌹 You have a Valentine! 🌹

Your Man just said YES to being your Valentine!

I couldn't resist saying yes to you. 
Get ready for a Valentine's Day filled with love and happiness! 💖

✨ Our Special Valentine’s Plan ✨

We’ll begin our beautiful day with blessings at the temple:
🙏 Temple Visit:
https://maps.app.goo.gl/xad6xJrb8ioY8Har9

After that, we’ll roam hand in hand through the vibrant streets of Pondy Bazaar,
soaking in the lights, the laughter, the little shops, and stealing cute moments together. 🛍️✨

And to end our perfect day, we’ll enjoy a romantic meal at:
🍽️ Valentine Dinner Spot:
https://maps.app.goo.gl/ETCHy4vJYNFr4cGo6

A peaceful start, a fun little adventure, and a cozy dinner —
all with you right beside me. 💕

What more could I possibly ask for? 💖

With all the love in the world,
Your Biggest Admirer💕

I Love You💖
    `.trim()
};

// Store the user's email
let userEmail = '';

// Create floating hearts background
function createFloatingHearts() {
    const container = document.getElementById('floatingHearts');
    const heartSymbols = ['💕', '💗', '💖', '💝', '💘', '❤️'];
    
    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 10 + 10) + 's';
        heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
        
        container.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 15000);
    }, 500);
}

// Make the "No" button run away from cursor
const noBtn = document.getElementById('noBtn');
let isNoButtonMoving = false;

function moveNoButton() {
    if (isNoButtonMoving) return;
    
    isNoButtonMoving = true;
    
    const container = document.querySelector('.content');
    const containerRect = container.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    
    // Calculate available space
    const maxX = containerRect.width - btnRect.width;
    const maxY = containerRect.height - btnRect.height;
    
    // Generate random position
    let newX = Math.random() * maxX;
    let newY = Math.random() * maxY;
    
    // Ensure button stays within visible area
    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));
    
    noBtn.style.position = 'absolute';
    noBtn.style.left = newX + 'px';
    noBtn.style.top = newY + 'px';
    
    setTimeout(() => {
        isNoButtonMoving = false;
    }, 300);
}

// Event listeners for No button
noBtn.addEventListener('mouseenter', moveNoButton);
noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveNoButton();
});

noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    moveNoButton();
});

// Hearts explosion animation
function createHeartsExplosion() {
    const container = document.getElementById('heartsExplosion');
    const heartSymbols = ['💕', '💗', '💖', '💝', '💘', '❤️', '💗', '💕'];
    const numberOfHearts = 30;
    
    for (let i = 0; i < numberOfHearts; i++) {
        const heart = document.createElement('div');
        heart.className = 'explosion-heart';
        heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        
        // Random angle and distance
        const angle = (Math.PI * 2 * i) / numberOfHearts;
        const distance = Math.random() * 300 + 200;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        heart.style.setProperty('--tx', tx + 'px');
        heart.style.setProperty('--ty', ty + 'px');
        heart.style.left = '50%';
        heart.style.top = '50%';
        heart.style.animationDelay = (Math.random() * 0.3) + 's';
        
        container.appendChild(heart);
    }
}

// Send email function - FOR NETLIFY
async function sendEmail(recipientEmail) {
    try {
        const response = await fetch('/.netlify/functions/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                recipientEmail: recipientEmail,
                subject: EMAIL_CONFIG.subject,
                message: EMAIL_CONFIG.message
            })
        });

        const data = await response.json();
        
        if (data.success) {
            console.log('Email sent successfully!');
            return true;
        } else {
            console.error('Email failed:', data.error);
            return false;
        }
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}

// Show email popup
function showEmailPopup() {
    const popup = document.getElementById('emailPopup');
    popup.classList.add('active');
    
    // Focus on email input after animation
    setTimeout(() => {
        document.getElementById('emailInput').focus();
    }, 300);
}

// Hide email popup
function hideEmailPopup() {
    const popup = document.getElementById('emailPopup');
    popup.classList.remove('active');
}

// Show success screen
function showSuccessScreen(email) {
    // Hide question screen
    document.getElementById('questionScreen').classList.remove('active');
    
    // Show success screen
    setTimeout(() => {
        document.getElementById('successScreen').classList.add('active');
        document.getElementById('emailHint').textContent = email;
        createHeartsExplosion();
    }, 300);
}

// Yes button click handler - Show popup
document.getElementById('yesBtn').addEventListener('click', () => {
    showEmailPopup();
});

// Email form submit handler
document.getElementById('emailForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const emailInput = document.getElementById('emailInput');
    userEmail = emailInput.value.trim();
    
    if (!userEmail) {
        alert('Please enter your email address! 💕');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
        alert('Please enter a valid email address! 💕');
        return;
    }
    
    // Hide popup
    hideEmailPopup();
    
    // Show success screen
    showSuccessScreen(userEmail);
    
    // Send email
    setTimeout(() => {
        sendEmail(userEmail);
    }, 1000);
});

// Initialize floating hearts
createFloatingHearts();

// Add some decorative hearts that appear on page load
window.addEventListener('load', () => {
    const container = document.getElementById('floatingHearts');
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.textContent = ['💕', '💗', '💖'][Math.floor(Math.random() * 3)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.animationDuration = (Math.random() * 10 + 10) + 's';
            container.appendChild(heart);
        }, i * 200);
    }
});

// Close popup if clicking outside
document.getElementById('emailPopup').addEventListener('click', (e) => {
    if (e.target.id === 'emailPopup') {
        // Don't close - make them enter email or refresh page
        const emailInput = document.getElementById('emailInput');
        emailInput.classList.add('shake');
        setTimeout(() => {
            emailInput.classList.remove('shake');
        }, 500);
    }
});

// Add shake animation for validation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
    .shake {
        animation: shake 0.3s ease-in-out;
    }
`;
document.head.appendChild(style);
