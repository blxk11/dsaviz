/* ========================================
   DSA Visualizer — Searching Algorithms
   ======================================== */

const SearchingVisualizer = {
  algorithms: {
    linear: { name: 'Linear Search' },
    binary: { name: 'Binary Search' }
  },

  currentAlgorithm: 'linear',
  array: [],
  target: null,

  info: {
    linear: {
      complexity: { best: 'O(1)', avg: 'O(n)', worst: 'O(n)', space: 'O(1)' },
      pseudocode: `linearSearch(arr, target):\n  for i = 0 to n-1:\n    if arr[i] == target:\n      return i\n  return -1`,
      description: 'Sequentially checks each element until the target is found or the list ends.'
    },
    binary: {
      complexity: { best: 'O(1)', avg: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
      pseudocode: `binarySearch(arr, target):\n  low = 0, high = n-1\n  while low <= high:\n    mid = (low + high) / 2\n    if arr[mid] == target: return mid\n    else if arr[mid] < target: low = mid + 1\n    else: high = mid - 1\n  return -1`,
      description: 'Efficiently searches a sorted array by repeatedly dividing the search interval in half.'
    }
  },

  generateArray(size = 16) {
    const set = new Set();
    while (set.size < size) {
      set.add(Math.floor(Math.random() * 99) + 1);
    }
    this.array = [...set].sort((a, b) => a - b);
    this.target = this.array[Math.floor(Math.random() * this.array.length)];
    document.getElementById('search-target').value = this.target;
    this.render();
  },

  render(states = {}) {
    const container = document.getElementById('search-array');
    if (!container) return;
    container.innerHTML = this.array.map((val, i) => {
      let cls = 'search-cell';
      if (states.found === i) cls += ' search-cell--found';
      else if (states.checking === i) cls += ' search-cell--checking';
      else if (states.mid === i) cls += ' search-cell--mid';
      else if (states.eliminated && states.eliminated.includes(i)) cls += ' search-cell--eliminated';
      else if (states.range && i >= states.range[0] && i <= states.range[1]) cls += ' search-cell--range';
      return `<div class="${cls}"><span>${val}</span><span class="search-cell__index">${i}</span></div>`;
    }).join('');
  },

  updateInfo() {
    const info = this.info[this.currentAlgorithm];
    const pseudo = document.getElementById('search-pseudocode');
    const comp = document.getElementById('search-complexity');
    if (pseudo) pseudo.textContent = info.pseudocode;
    if (comp) {
      comp.innerHTML = `
        <div class="complexity-item"><div class="complexity-item__label">Best</div><div class="complexity-item__value">${info.complexity.best}</div></div>
        <div class="complexity-item"><div class="complexity-item__label">Average</div><div class="complexity-item__value">${info.complexity.avg}</div></div>
        <div class="complexity-item"><div class="complexity-item__label">Worst</div><div class="complexity-item__value">${info.complexity.worst}</div></div>
        <div class="complexity-item"><div class="complexity-item__label">Space</div><div class="complexity-item__value">${info.complexity.space}</div></div>
      `;
    }
  },

  linearSearch(arr, target) {
    const steps = [];
    for (let i = 0; i < arr.length; i++) {
      steps.push({ checking: i, description: `Checking index <strong>${i}</strong>: is <strong>${arr[i]}</strong> equal to <strong>${target}</strong>?` });
      if (arr[i] === target) {
        steps.push({ found: i, description: `✅ Found <strong>${target}</strong> at index <strong>${i}</strong>!` });
        return steps;
      }
    }
    steps.push({ description: `❌ <strong>${target}</strong> not found in the array.` });
    return steps;
  },

  binarySearch(arr, target) {
    const steps = [];
    let low = 0, high = arr.length - 1;
    const eliminated = [];

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      steps.push({ range: [low, high], mid, eliminated: [...eliminated], description: `Range [${low}, ${high}], mid = <strong>${mid}</strong>, value = <strong>${arr[mid]}</strong>` });

      if (arr[mid] === target) {
        steps.push({ found: mid, eliminated: [...eliminated], description: `✅ Found <strong>${target}</strong> at index <strong>${mid}</strong>!` });
        return steps;
      } else if (arr[mid] < target) {
        for (let i = low; i <= mid; i++) eliminated.push(i);
        steps.push({ range: [mid + 1, high], eliminated: [...eliminated], description: `<strong>${arr[mid]}</strong> < <strong>${target}</strong>, searching right half` });
        low = mid + 1;
      } else {
        for (let i = mid; i <= high; i++) eliminated.push(i);
        steps.push({ range: [low, mid - 1], eliminated: [...eliminated], description: `<strong>${arr[mid]}</strong> > <strong>${target}</strong>, searching left half` });
        high = mid - 1;
      }
    }
    steps.push({ eliminated: [...eliminated], description: `❌ <strong>${target}</strong> not found in the array.` });
    return steps;
  },

  start(algorithm) {
    if (algorithm) this.currentAlgorithm = algorithm;
    this.target = parseInt(document.getElementById('search-target').value) || this.target;
    this.updateInfo();

    const steps = this.currentAlgorithm === 'linear'
      ? this.linearSearch([...this.array], this.target)
      : this.binarySearch([...this.array], this.target);

    const controls = {
      playBtn: document.getElementById('search-play'),
      pauseBtn: document.getElementById('search-pause'),
      stepFwdBtn: document.getElementById('search-step-fwd'),
      stepBackBtn: document.getElementById('search-step-back'),
      resetBtn: document.getElementById('search-reset'),
      progressFill: document.getElementById('search-progress-fill'),
      stepLabel: document.getElementById('search-step-label'),
      speedSlider: document.getElementById('search-speed'),
      speedLabel: document.getElementById('search-speed-label'),
      stepDescription: document.getElementById('search-step-desc')
    };

    window.animationEngine.init(
      steps,
      controls,
      (step) => this.render(step),
      null,
      () => this.render()
    );
  },

  init() {
    this.generateArray(16);
    this.updateInfo();

    document.querySelectorAll('#searching-page .algo-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('#searching-page .algo-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        window.animationEngine.stop();
        this.currentAlgorithm = tab.dataset.algo;
        this.updateInfo();
        this.render();
      });
    });

    const genBtn = document.getElementById('search-generate');
    if (genBtn) genBtn.addEventListener('click', () => {
      window.animationEngine.stop();
      this.generateArray(16);
    });

    const startBtn = document.getElementById('search-start');
    if (startBtn) startBtn.addEventListener('click', () => this.start());
  }
};
