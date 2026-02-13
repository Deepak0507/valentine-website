// Configuration - EDIT THIS SECTION
const EMAIL_CONFIG = {
    recipientEmail: 'deepdeepak613@gmail.com',
    subject: 'Someone Said YES to Being Your Valentine! 💕',
    message: `
🌹 You have a Valentine! 🌹

Someone special just said YES to being your Valentine!

They couldn't resist saying yes to you. 
Get ready for a Valentine's Day filled with love and happiness! 💖

With all the love in the world,
Your Biggest Admirer 💕

P.S. - You better check who sent this! 😉
    `.trim()
};

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
async function sendEmail() {
    try {
        const response = await fetch('/.netlify/functions/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                recipientEmail: EMAIL_CONFIG.recipientEmail,
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

// Yes button click handler
document.getElementById('yesBtn').addEventListener('click', async () => {
    // Hide question screen
    document.getElementById('questionScreen').classList.remove('active');
    
    // Show success screen
    setTimeout(() => {
        document.getElementById('successScreen').classList.add('active');
        createHeartsExplosion();
    }, 300);
    
    // Send email
    setTimeout(() => {
        sendEmail();
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