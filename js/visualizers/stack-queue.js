/* ========================================
   DSA Visualizer — Stack & Queue
   ======================================== */

const StackQueueVisualizer = {
  currentDS: 'stack',
  stack: [],
  queue: [],
  maxSize: 10,

  render() {
    if (this.currentDS === 'stack') this.renderStack();
    else this.renderQueue();
  },

  renderStack() {
    const container = document.getElementById('sq-visual');
    if (!container) return;
    if (this.stack.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-state__icon">📦</div><div class="empty-state__title">Stack is Empty</div><div class="empty-state__desc">Push an element to get started</div></div>';
      return;
    }
    container.innerHTML = `
      <div class="stack-visual">
        ${[...this.stack].reverse().map((val, i) => {
          const isTop = i === 0;
          return `<div class="stack-element ${isTop ? 'stack-element--top' : ''}">${val}${isTop ? ' ← TOP' : ''}</div>`;
        }).join('')}
      </div>
    `;
  },

  renderQueue() {
    const container = document.getElementById('sq-visual');
    if (!container) return;
    if (this.queue.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-state__icon">📦</div><div class="empty-state__title">Queue is Empty</div><div class="empty-state__desc">Enqueue an element to get started</div></div>';
      return;
    }
    container.innerHTML = `
      <div class="queue-visual">
        ${this.queue.map((val, i) => {
          return `<div class="queue-element">${val}</div>`;
        }).join('')}
      </div>
    `;
  },

  push() {
    const input = document.getElementById('sq-value');
    const val = input.value.trim();
    if (!val) return;
    if (this.stack.length >= this.maxSize) {
      this.showMessage('Stack Overflow! Maximum size reached.', 'error');
      return;
    }
    this.stack.push(val);
    input.value = '';
    this.render();
    this.showMessage(`Pushed <strong>${val}</strong> to stack. Size: ${this.stack.length}`, 'success');
    this.updateStats();
  },

  pop() {
    if (this.stack.length === 0) {
      this.showMessage('Stack Underflow! Stack is empty.', 'error');
      return;
    }
    const val = this.stack.pop();
    this.render();
    this.showMessage(`Popped <strong>${val}</strong> from stack. Size: ${this.stack.length}`, 'success');
    this.updateStats();
  },

  peek() {
    if (this.stack.length === 0) {
      this.showMessage('Stack is empty — nothing to peek.', 'warning');
      return;
    }
    this.showMessage(`Top element: <strong>${this.stack[this.stack.length - 1]}</strong>`, 'info');
  },

  enqueue() {
    const input = document.getElementById('sq-value');
    const val = input.value.trim();
    if (!val) return;
    if (this.queue.length >= this.maxSize) {
      this.showMessage('Queue is full! Maximum size reached.', 'error');
      return;
    }
    this.queue.push(val);
    input.value = '';
    this.render();
    this.showMessage(`Enqueued <strong>${val}</strong>. Size: ${this.queue.length}`, 'success');
    this.updateStats();
  },

  dequeue() {
    if (this.queue.length === 0) {
      this.showMessage('Queue is empty — nothing to dequeue.', 'error');
      return;
    }
    const val = this.queue.shift();
    this.render();
    this.showMessage(`Dequeued <strong>${val}</strong>. Size: ${this.queue.length}`, 'success');
    this.updateStats();
  },

  front() {
    if (this.queue.length === 0) {
      this.showMessage('Queue is empty.', 'warning');
      return;
    }
    this.showMessage(`Front element: <strong>${this.queue[0]}</strong>`, 'info');
  },

  clear() {
    this.stack = [];
    this.queue = [];
    this.render();
    this.showMessage('Cleared!', 'info');
    this.updateStats();
  },

  showMessage(msg, type = 'info') {
    const el = document.getElementById('sq-message');
    if (!el) return;
    el.innerHTML = msg;
    el.className = 'step-description';
    if (type === 'error') el.style.borderColor = 'rgba(239,68,68,0.3)';
    else if (type === 'success') el.style.borderColor = 'rgba(34,197,94,0.3)';
    else if (type === 'warning') el.style.borderColor = 'rgba(234,179,8,0.3)';
    else el.style.borderColor = 'var(--border-glass)';
  },

  updateStats() {
    const sizeEl = document.getElementById('sq-size');
    const isEmptyEl = document.getElementById('sq-is-empty');
    const ds = this.currentDS === 'stack' ? this.stack : this.queue;
    if (sizeEl) sizeEl.textContent = ds.length;
    if (isEmptyEl) isEmptyEl.textContent = ds.length === 0 ? 'Yes' : 'No';
  },

  switchDS(ds) {
    this.currentDS = ds;
    const stackBtns = document.getElementById('stack-ops');
    const queueBtns = document.getElementById('queue-ops');
    if (stackBtns) stackBtns.style.display = ds === 'stack' ? 'flex' : 'none';
    if (queueBtns) queueBtns.style.display = ds === 'queue' ? 'flex' : 'none';
    this.render();
    this.updateStats();
    this.showMessage(`Switched to ${ds === 'stack' ? 'Stack (LIFO)' : 'Queue (FIFO)'}`, 'info');
  },

  init() {
    this.render();
    this.updateStats();

    document.querySelectorAll('#stack-queue-page .algo-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('#stack-queue-page .algo-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.switchDS(tab.dataset.algo);
      });
    });

    // Stack operations
    document.getElementById('sq-push')?.addEventListener('click', () => this.push());
    document.getElementById('sq-pop')?.addEventListener('click', () => this.pop());
    document.getElementById('sq-peek')?.addEventListener('click', () => this.peek());

    // Queue operations
    document.getElementById('sq-enqueue')?.addEventListener('click', () => this.enqueue());
    document.getElementById('sq-dequeue')?.addEventListener('click', () => this.dequeue());
    document.getElementById('sq-front')?.addEventListener('click', () => this.front());

    document.getElementById('sq-clear')?.addEventListener('click', () => this.clear());

    // Enter key
    document.getElementById('sq-value')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        if (this.currentDS === 'stack') this.push();
        else this.enqueue();
      }
    });
  }
};
