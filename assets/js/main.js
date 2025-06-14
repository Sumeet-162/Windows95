// Main JavaScript for Portfolio Website
// ===================================

// DOM Elements
const navbar = document.querySelector('.navbar');
const windows = document.querySelectorAll('.win98-window');
const resumeButton = document.querySelector('.resume-button');
const startButton = document.getElementById('startButton');
const startMenu = document.getElementById('startMenu');

// Start Menu Behavior
if (startButton && startMenu) {
  let isStartMenuOpen = false;

  // Toggle Start Menu
  startButton.addEventListener('click', (e) => {
    e.stopPropagation();
    isStartMenuOpen = !isStartMenuOpen;
    startMenu.classList.toggle('active', isStartMenuOpen);
  });

  // Close Start Menu when clicking outside
  document.addEventListener('click', (e) => {
    if (isStartMenuOpen && !startMenu.contains(e.target) && e.target !== startButton) {
      isStartMenuOpen = false;
      startMenu.classList.remove('active');
    }
  });

  // Close Start Menu on scroll
  window.addEventListener('scroll', () => {
    if (isStartMenuOpen) {
      isStartMenuOpen = false;
      startMenu.classList.remove('active');
    }
  });
}

// Make Windows Draggable
class DraggableWindow {
  constructor(element) {
    this.element = element;
    this.titlebar = element.querySelector('.win98-titlebar');
    this.isDragging = false;
    this.currentX = 0;
    this.currentY = 0;
    this.initialX = 0;
    this.initialY = 0;
    this.xOffset = 0;
    this.yOffset = 0;

    this.init();
  }

  init() {
    this.titlebar.addEventListener('mousedown', this.dragStart.bind(this));
    document.addEventListener('mousemove', this.drag.bind(this));
    document.addEventListener('mouseup', this.dragEnd.bind(this));
  }

  dragStart(e) {
    this.initialX = e.clientX - this.xOffset;
    this.initialY = e.clientY - this.yOffset;

    if (e.target === this.titlebar) {
      this.isDragging = true;
      this.element.style.zIndex = 1000;
    }
  }

  drag(e) {
    if (this.isDragging) {
      e.preventDefault();
      
      this.currentX = e.clientX - this.initialX;
      this.currentY = e.clientY - this.initialY;

      this.xOffset = this.currentX;
      this.yOffset = this.currentY;

      this.setTranslate(this.currentX, this.currentY, this.element);
    }
  }

  dragEnd() {
    this.initialX = this.currentX;
    this.initialY = this.currentY;
    this.isDragging = false;
  }

  setTranslate(xPos, yPos, el) {
    el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
  }
}

// Initialize Draggable Windows
windows.forEach(window => {
  new DraggableWindow(window);
});

// Resume Download Handler
if (resumeButton) {
  resumeButton.addEventListener('click', () => {
    // Create a Windows 98-style download dialog
    const dialog = document.createElement('div');
    dialog.className = 'win98-window';
    dialog.style.position = 'fixed';
    dialog.style.top = '50%';
    dialog.style.left = '50%';
    dialog.style.transform = 'translate(-50%, -50%)';
    dialog.style.zIndex = '2000';

    dialog.innerHTML = `
      <div class="win98-titlebar">
        <span>Download Resume</span>
        <button class="win98-button" style="padding: 2px 8px;">×</button>
      </div>
      <div class="win98-content">
        <p>Your resume will begin downloading shortly...</p>
        <div class="win98-loading mt-2"></div>
      </div>
    `;

    document.body.appendChild(dialog);

    // Close button functionality
    const closeBtn = dialog.querySelector('button');
    closeBtn.addEventListener('click', () => {
      dialog.remove();
    });

    // Trigger download
    const link = document.createElement('a');
    link.href = '/pdf/resume.pdf';
    link.download = 'resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Remove dialog after 2 seconds
    setTimeout(() => {
      dialog.remove();
    }, 2000);
  });
}

// Smooth Scroll for Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Navbar Scroll Effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll <= 0) {
    navbar.classList.remove('scroll-up');
    return;
  }
  
  if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
    // Scroll Down
    navbar.classList.remove('scroll-up');
    navbar.classList.add('scroll-down');
  } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
    // Scroll Up
    navbar.classList.remove('scroll-down');
    navbar.classList.add('scroll-up');
  }
  lastScroll = currentScroll;
});

// Add Windows 98/XP Sound Effects
const playSound = (type) => {
  const sounds = {
    click: 'https://www.soundjay.com/buttons/sounds/button-09.mp3',
    hover: 'https://www.soundjay.com/buttons/sounds/button-10.mp3',
    error: 'https://www.soundjay.com/buttons/sounds/button-21.mp3'
  };

  const audio = new Audio(sounds[type]);
  audio.volume = 0.2;
  audio.play().catch(() => {}); // Ignore autoplay restrictions
};

// Add sound effects to buttons
document.querySelectorAll('.win98-button').forEach(button => {
  button.addEventListener('mouseenter', () => playSound('hover'));
  button.addEventListener('click', () => playSound('click'));
});

// Easter Egg: Konami Code
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
  if (e.key === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      // Trigger easter egg
      document.body.style.background = 'url("https://i.imgur.com/8TqXG.gif")';
      playSound('click');
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});

function showNotification(message, type) {
  const notif = document.createElement('div');
  notif.className = 'win98-dialog';
  notif.innerHTML = `
    <div class="win98-titlebar">
      <img src="https://win98icons.alexmeub.com/icons/png/info_bubble-0.png" class="pixel-icon" alt="Info">
      <span>Notification</span>
    </div>
    <div class="win98-content">
      <p>${message}</p>
    </div>
  `;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 1500);
}

function setupDownloadResume() {
  const downloadBtn = document.getElementById('download-resume');
  if (!downloadBtn) return;

  downloadBtn.addEventListener('click', () => {
    // Create a temporary link element to trigger download
    const link = document.createElement('a');
    link.href = 'pdf/resume.pdf'; // Path to your resume file
    link.download = 'Sumeet_K_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show retro notification
    showNotification('Resume download started!', 'success');

    // Add download animation
    downloadBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
      downloadBtn.style.transform = 'scale(1)';
    }, 150);
  });
}

document.addEventListener('DOMContentLoaded', setupDownloadResume); 