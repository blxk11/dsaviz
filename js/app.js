/* ========================================
   DSA Visualizer — App Router & Navigation
   ======================================== */

const App = {
  init() {
    this.bindNavigation();
    this.initHeroAnimation();

    // Initialize all visualizers
    SortingVisualizer.init();
    SearchingVisualizer.init();
    StackQueueVisualizer.init();
    LinkedListVisualizer.init();
    TreeVisualizer.init();
    GraphVisualizer.init();
    CodePlayground.init();
  },

  bindNavigation() {
    // Smooth scroll for nav links and CTA buttons
    document.querySelectorAll('[data-page], [data-navigate]').forEach(link => {
      link.addEventListener('click', (e) => {
        // Only prevent default if it's an anchor link
        if (link.tagName.toLowerCase() === 'a') {
          e.preventDefault();
        }
        
        const targetId = link.dataset.page || link.dataset.navigate;
        const targetEl = document.getElementById(`${targetId}-page`) || document.getElementById(targetId);
        
        if (targetEl) {
          // Adjust scroll position for sticky header
          const headerOffset = 60; // Approximate height of .top-nav
          const elementPosition = targetEl.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      });
    });
  },

  initHeroAnimation() {
    const container = document.getElementById('hero-bg-animation');
    if (!container) return;

    // Create translucent bars
    const numBars = Math.floor(window.innerWidth / 30);
    const bars = [];
    
    for (let i = 0; i < numBars; i++) {
      const bar = document.createElement('div');
      bar.className = 'hero-bar';
      const height = Math.random() * 80 + 20; // 20% to 100%
      bar.style.height = `${height}%`;
      bar.style.width = '20px';
      bar.style.backgroundColor = 'var(--accent-cyan)';
      bar.style.opacity = '0.4';
      bar.style.borderRadius = '3px 3px 0 0';
      bar.style.transition = 'height 0.3s ease, background-color 0.3s ease';
      
      container.appendChild(bar);
      bars.push(bar);
    }

    // Continuous bubble sort like animation
    setInterval(() => {
      const i = Math.floor(Math.random() * (numBars - 1));
      const b1 = bars[i];
      const b2 = bars[i + 1];
      
      b1.style.backgroundColor = 'var(--accent-orange)';
      b2.style.backgroundColor = 'var(--accent-orange)';

      setTimeout(() => {
        const h1 = b1.style.height;
        const h2 = b2.style.height;
        
        if (parseFloat(h1) > parseFloat(h2)) {
          b1.style.height = h2;
          b2.style.height = h1;
        }

        b1.style.backgroundColor = 'var(--accent-cyan)';
        b2.style.backgroundColor = 'var(--accent-cyan)';
      }, 300);
    }, 400);
  }
};

// Boot
document.addEventListener('DOMContentLoaded', () => App.init());
