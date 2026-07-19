/* ========================================
   DSA Visualizer — App Router & Navigation
   ======================================== */

const App = {
  currentPage: 'home',

  pages: ['home', 'sorting', 'searching', 'stack-queue', 'linked-list', 'tree', 'graph', 'playground'],

  init() {
    this.bindNavigation();
    this.handleRoute();
    window.addEventListener('hashchange', () => this.handleRoute());

    // Mobile sidebar
    const toggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    toggle?.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('open');
    });

    overlay?.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
    });

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
    document.querySelectorAll('.nav-link[data-page]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        window.location.hash = page;
      });
    });

    // Category card clicks on home page
    document.querySelectorAll('.category-card[data-page]').forEach(card => {
      card.addEventListener('click', () => {
        window.location.hash = card.dataset.page;
      });
    });

    // Hero CTA buttons
    document.querySelectorAll('[data-navigate]').forEach(el => {
      el.addEventListener('click', () => {
        window.location.hash = el.dataset.navigate;
      });
    });
  },

  handleRoute() {
    const hash = window.location.hash.replace('#', '') || 'home';
    this.navigateTo(hash);
  },

  navigateTo(page) {
    if (!this.pages.includes(page)) page = 'home';

    // Stop any running animations
    window.animationEngine.stop();

    // Hide all pages
    document.querySelectorAll('.page-section').forEach(p => {
      p.classList.remove('active');
    });

    // Show target page
    const targetPage = document.getElementById(`${page}-page`);
    if (targetPage) {
      targetPage.classList.add('active');
    }

    // Update nav
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.dataset.page === page) {
        link.classList.add('active');
      }
    });

    // Close mobile sidebar
    document.getElementById('sidebar')?.classList.remove('open');
    document.getElementById('sidebar-overlay')?.classList.remove('open');

    // Scroll to top
    window.scrollTo(0, 0);

    this.currentPage = page;

    // Re-render SVGs after page is visible (they need clientWidth)
    if (page === 'tree') {
      setTimeout(() => TreeVisualizer.render(), 50);
    } else if (page === 'graph') {
      setTimeout(() => GraphVisualizer.render(), 50);
    }
  }
};

// Boot
document.addEventListener('DOMContentLoaded', () => App.init());
