/* ========================================
   DSA Visualizer — Linked List
   ======================================== */

const LinkedListVisualizer = {
  list: [],
  highlightIdx: -1,

  render(states = {}) {
    const container = document.getElementById('ll-visual');
    if (!container) return;

    if (this.list.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-state__icon">🔗</div><div class="empty-state__title">List is Empty</div><div class="empty-state__desc">Insert a node to get started</div></div>';
      return;
    }

    container.innerHTML = `<div class="ll-container">${this.list.map((val, i) => {
      let cls = 'll-node';
      if (i === 0) cls += ' ll-node--head';
      if (states.highlight === i) cls += ' ll-node--highlight';
      if (states.found === i) cls += ' ll-node--found';
      return `
        <div class="${cls}">
          <div class="ll-node__box">
            <div class="ll-node__data">${val}</div>
            <div class="ll-node__ptr">${i < this.list.length - 1 ? '●' : '∅'}</div>
          </div>
          ${i < this.list.length - 1 ? '<div class="ll-node__arrow">→</div>' : '<div class="ll-null">NULL</div>'}
        </div>
      `;
    }).join('')}</div>`;
  },

  insertHead() {
    const val = document.getElementById('ll-value').value.trim();
    if (!val) return;
    this.list.unshift(val);
    document.getElementById('ll-value').value = '';
    this.render();
    this.showMessage(`Inserted <strong>${val}</strong> at head. Size: ${this.list.length}`);
    this.updateStats();
  },

  insertTail() {
    const val = document.getElementById('ll-value').value.trim();
    if (!val) return;
    this.list.push(val);
    document.getElementById('ll-value').value = '';
    this.render();
    this.showMessage(`Inserted <strong>${val}</strong> at tail. Size: ${this.list.length}`);
    this.updateStats();
  },

  insertAt() {
    const val = document.getElementById('ll-value').value.trim();
    const pos = parseInt(document.getElementById('ll-position').value);
    if (!val || isNaN(pos)) {
      this.showMessage('Please enter a value and position.', 'warning');
      return;
    }
    if (pos < 0 || pos > this.list.length) {
      this.showMessage(`Invalid position. Valid range: 0 to ${this.list.length}`, 'error');
      return;
    }
    this.list.splice(pos, 0, val);
    document.getElementById('ll-value').value = '';
    this.render();
    this.showMessage(`Inserted <strong>${val}</strong> at position ${pos}. Size: ${this.list.length}`);
    this.updateStats();
  },

  deleteHead() {
    if (this.list.length === 0) { this.showMessage('List is empty!', 'error'); return; }
    const val = this.list.shift();
    this.render();
    this.showMessage(`Deleted <strong>${val}</strong> from head. Size: ${this.list.length}`);
    this.updateStats();
  },

  deleteTail() {
    if (this.list.length === 0) { this.showMessage('List is empty!', 'error'); return; }
    const val = this.list.pop();
    this.render();
    this.showMessage(`Deleted <strong>${val}</strong> from tail. Size: ${this.list.length}`);
    this.updateStats();
  },

  async search() {
    const val = document.getElementById('ll-value').value.trim();
    if (!val) return;
    window.animationEngine.stop();

    const steps = [];
    for (let i = 0; i < this.list.length; i++) {
      steps.push({
        highlight: i,
        description: `Checking node ${i}: <strong>${this.list[i]}</strong> ${this.list[i] == val ? '== ' : '≠ '} <strong>${val}</strong>`
      });
      if (this.list[i] == val) {
        steps.push({ found: i, description: `✅ Found <strong>${val}</strong> at index <strong>${i}</strong>!` });
        break;
      }
    }
    if (!steps.some(s => s.found !== undefined)) {
      steps.push({ description: `❌ <strong>${val}</strong> not found in the list.` });
    }

    const controls = {
      playBtn: document.getElementById('ll-play'),
      pauseBtn: document.getElementById('ll-pause'),
      stepFwdBtn: document.getElementById('ll-step-fwd'),
      stepBackBtn: document.getElementById('ll-step-back'),
      resetBtn: document.getElementById('ll-reset'),
      progressFill: document.getElementById('ll-progress-fill'),
      stepLabel: document.getElementById('ll-step-label'),
      speedSlider: document.getElementById('ll-speed'),
      speedLabel: document.getElementById('ll-speed-label'),
      stepDescription: document.getElementById('ll-step-desc')
    };

    window.animationEngine.init(
      steps,
      controls,
      (step) => this.render(step),
      null,
      () => this.render()
    );
    window.animationEngine.play();
  },

  async reverse() {
    if (this.list.length < 2) return;
    window.animationEngine.stop();

    const steps = [];
    const arr = [...this.list];
    for (let i = 0; i < Math.floor(arr.length / 2); i++) {
      const j = arr.length - 1 - i;
      steps.push({ highlight: i, description: `Swapping node ${i} (<strong>${arr[i]}</strong>) with node ${j} (<strong>${arr[j]}</strong>)` });
      [arr[i], arr[j]] = [arr[j], arr[i]];
      steps.push({ highlight: j, description: `Swapped! Nodes ${i} and ${j} exchanged.` });
    }
    steps.push({ description: '✅ List reversed successfully!' });

    const controls = {
      playBtn: document.getElementById('ll-play'),
      pauseBtn: document.getElementById('ll-pause'),
      stepFwdBtn: document.getElementById('ll-step-fwd'),
      stepBackBtn: document.getElementById('ll-step-back'),
      resetBtn: document.getElementById('ll-reset'),
      progressFill: document.getElementById('ll-progress-fill'),
      stepLabel: document.getElementById('ll-step-label'),
      speedSlider: document.getElementById('ll-speed'),
      speedLabel: document.getElementById('ll-speed-label'),
      stepDescription: document.getElementById('ll-step-desc')
    };

    window.animationEngine.init(
      steps,
      controls,
      (step, idx) => {
        if (idx === steps.length - 1) {
          this.list = [...arr];
        }
        this.render(step);
      },
      () => { this.list = [...arr]; this.render(); },
      () => this.render()
    );
    window.animationEngine.play();
  },

  clear() {
    this.list = [];
    window.animationEngine.stop();
    this.render();
    this.showMessage('List cleared!');
    this.updateStats();
  },

  showMessage(msg, type = 'info') {
    const el = document.getElementById('ll-message');
    if (!el) return;
    el.innerHTML = msg;
    el.style.borderColor = type === 'error' ? 'rgba(239,68,68,0.3)' :
                           type === 'warning' ? 'rgba(234,179,8,0.3)' :
                           'var(--border-glass)';
  },

  updateStats() {
    const sizeEl = document.getElementById('ll-size');
    if (sizeEl) sizeEl.textContent = this.list.length;
  },

  init() {
    // Start with sample data
    this.list = ['10', '20', '30', '40', '50'];
    this.render();
    this.updateStats();

    document.getElementById('ll-insert-head')?.addEventListener('click', () => this.insertHead());
    document.getElementById('ll-insert-tail')?.addEventListener('click', () => this.insertTail());
    document.getElementById('ll-insert-at')?.addEventListener('click', () => this.insertAt());
    document.getElementById('ll-delete-head')?.addEventListener('click', () => this.deleteHead());
    document.getElementById('ll-delete-tail')?.addEventListener('click', () => this.deleteTail());
    document.getElementById('ll-search')?.addEventListener('click', () => this.search());
    document.getElementById('ll-reverse')?.addEventListener('click', () => this.reverse());
    document.getElementById('ll-clear')?.addEventListener('click', () => this.clear());

    document.getElementById('ll-value')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.insertTail();
    });
  }
};
