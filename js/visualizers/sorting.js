/* ========================================
   DSA Visualizer — Sorting Algorithms
   ======================================== */

const SortingVisualizer = {
  algorithms: {
    bubble: { name: 'Bubble Sort', fn: 'bubbleSort' },
    selection: { name: 'Selection Sort', fn: 'selectionSort' },
    insertion: { name: 'Insertion Sort', fn: 'insertionSort' },
    merge: { name: 'Merge Sort', fn: 'mergeSort' },
    quick: { name: 'Quick Sort', fn: 'quickSort' }
  },

  currentAlgorithm: 'bubble',
  array: [],

  info: {
    bubble: {
      complexity: { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
      pseudocode: `for i = 0 to n-1:\n  for j = 0 to n-i-2:\n    if arr[j] > arr[j+1]:\n      swap(arr[j], arr[j+1])`,
      description: 'Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.'
    },
    selection: {
      complexity: { best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
      pseudocode: `for i = 0 to n-1:\n  minIdx = i\n  for j = i+1 to n:\n    if arr[j] < arr[minIdx]:\n      minIdx = j\n  swap(arr[i], arr[minIdx])`,
      description: 'Divides the array into sorted and unsorted regions, repeatedly selecting the minimum element from the unsorted region.'
    },
    insertion: {
      complexity: { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
      pseudocode: `for i = 1 to n:\n  key = arr[i]\n  j = i - 1\n  while j >= 0 and arr[j] > key:\n    arr[j+1] = arr[j]\n    j -= 1\n  arr[j+1] = key`,
      description: 'Builds the sorted array one element at a time by inserting each element into its correct position.'
    },
    merge: {
      complexity: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
      pseudocode: `mergeSort(arr, l, r):\n  if l < r:\n    mid = (l + r) / 2\n    mergeSort(arr, l, mid)\n    mergeSort(arr, mid+1, r)\n    merge(arr, l, mid, r)`,
      description: 'Divides the array into halves, recursively sorts them, and merges the sorted halves back together.'
    },
    quick: {
      complexity: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' },
      pseudocode: `quickSort(arr, low, high):\n  if low < high:\n    pi = partition(arr, low, high)\n    quickSort(arr, low, pi - 1)\n    quickSort(arr, pi + 1, high)`,
      description: 'Picks a pivot, partitions the array around it, and recursively sorts the sub-arrays.'
    }
  },

  generateArray(size = 30) {
    this.array = Array.from({ length: size }, () => Math.floor(Math.random() * 95) + 5);
    this.render();
  },

  render(states = {}) {
    const container = document.getElementById('sort-bars');
    if (!container) return;
    const maxVal = Math.max(...this.array, 1);
    container.innerHTML = this.array.map((val, i) => {
      let cls = 'sort-bar sort-bar--default';
      if (states.sorted && states.sorted.includes(i)) cls = 'sort-bar sort-bar--sorted';
      else if (states.swapping && states.swapping.includes(i)) cls = 'sort-bar sort-bar--swapping';
      else if (states.pivot === i) cls = 'sort-bar sort-bar--pivot';
      else if (states.comparing && states.comparing.includes(i)) cls = 'sort-bar sort-bar--comparing';
      else if (states.active && states.active.includes(i)) cls = 'sort-bar sort-bar--active';
      else if (states.merged && states.merged.includes(i)) cls = 'sort-bar sort-bar--merged';
      return `<div class="${cls}" style="height: ${(val / maxVal) * 260}px" data-value="${val}"></div>`;
    }).join('');
  },

  updateInfo() {
    const info = this.info[this.currentAlgorithm];
    const pseudo = document.getElementById('sort-pseudocode');
    const comp = document.getElementById('sort-complexity');
    const desc = document.getElementById('sort-algo-desc');
    if (pseudo) pseudo.textContent = info.pseudocode;
    if (desc) desc.textContent = info.description;
    if (comp) {
      comp.innerHTML = `
        <div class="complexity-item"><div class="complexity-item__label">Best</div><div class="complexity-item__value">${info.complexity.best}</div></div>
        <div class="complexity-item"><div class="complexity-item__label">Average</div><div class="complexity-item__value">${info.complexity.avg}</div></div>
        <div class="complexity-item"><div class="complexity-item__label">Worst</div><div class="complexity-item__value">${info.complexity.worst}</div></div>
        <div class="complexity-item"><div class="complexity-item__label">Space</div><div class="complexity-item__value">${info.complexity.space}</div></div>
      `;
    }
  },

  // --- Step generators ---
  bubbleSort(arr) {
    const steps = [];
    const a = [...arr];
    const n = a.length;
    const sorted = [];
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        steps.push({ array: [...a], comparing: [j, j + 1], sorted: [...sorted], description: `Comparing <strong>${a[j]}</strong> and <strong>${a[j + 1]}</strong>` });
        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          steps.push({ array: [...a], swapping: [j, j + 1], sorted: [...sorted], description: `Swapped <strong>${a[j]}</strong> and <strong>${a[j + 1]}</strong>` });
        }
      }
      sorted.unshift(n - 1 - i);
    }
    sorted.unshift(0);
    steps.push({ array: [...a], sorted: Array.from({ length: n }, (_, i) => i), description: '✅ Array is sorted!' });
    return steps;
  },

  selectionSort(arr) {
    const steps = [];
    const a = [...arr];
    const n = a.length;
    const sorted = [];
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      steps.push({ array: [...a], active: [i], sorted: [...sorted], description: `Finding minimum starting from index <strong>${i}</strong>` });
      for (let j = i + 1; j < n; j++) {
        steps.push({ array: [...a], comparing: [minIdx, j], active: [i], sorted: [...sorted], description: `Comparing <strong>${a[minIdx]}</strong> (current min) with <strong>${a[j]}</strong>` });
        if (a[j] < a[minIdx]) minIdx = j;
      }
      if (minIdx !== i) {
        [a[i], a[minIdx]] = [a[minIdx], a[i]];
        steps.push({ array: [...a], swapping: [i, minIdx], sorted: [...sorted], description: `Swapped <strong>${a[i]}</strong> to position ${i}` });
      }
      sorted.push(i);
    }
    sorted.push(n - 1);
    steps.push({ array: [...a], sorted: Array.from({ length: n }, (_, i) => i), description: '✅ Array is sorted!' });
    return steps;
  },

  insertionSort(arr) {
    const steps = [];
    const a = [...arr];
    const n = a.length;
    const sorted = [0];
    for (let i = 1; i < n; i++) {
      const key = a[i];
      let j = i - 1;
      steps.push({ array: [...a], active: [i], sorted: [...sorted], description: `Inserting <strong>${key}</strong> into sorted portion` });
      while (j >= 0 && a[j] > key) {
        steps.push({ array: [...a], comparing: [j, j + 1], sorted: [...sorted], description: `<strong>${a[j]}</strong> > <strong>${key}</strong>, shifting right` });
        a[j + 1] = a[j];
        j--;
        steps.push({ array: [...a], swapping: [j + 1, j + 2], sorted: [...sorted], description: `Shifted element to position ${j + 2}` });
      }
      a[j + 1] = key;
      sorted.push(i);
      steps.push({ array: [...a], active: [j + 1], sorted: [...sorted], description: `Placed <strong>${key}</strong> at position ${j + 1}` });
    }
    steps.push({ array: [...a], sorted: Array.from({ length: n }, (_, i) => i), description: '✅ Array is sorted!' });
    return steps;
  },

  mergeSort(arr) {
    const steps = [];
    const a = [...arr];

    const merge = (a, l, m, r) => {
      const left = a.slice(l, m + 1);
      const right = a.slice(m + 1, r + 1);
      let i = 0, j = 0, k = l;
      const mergedIndices = [];

      while (i < left.length && j < right.length) {
        steps.push({ array: [...a], comparing: [l + i, m + 1 + j], merged: [...mergedIndices], description: `Comparing <strong>${left[i]}</strong> and <strong>${right[j]}</strong>` });
        if (left[i] <= right[j]) {
          a[k] = left[i]; i++;
        } else {
          a[k] = right[j]; j++;
        }
        mergedIndices.push(k);
        k++;
        steps.push({ array: [...a], merged: [...mergedIndices], description: `Placed <strong>${a[k - 1]}</strong> at position ${k - 1}` });
      }
      while (i < left.length) { a[k] = left[i]; mergedIndices.push(k); i++; k++; steps.push({ array: [...a], merged: [...mergedIndices], description: `Copied remaining element <strong>${a[k - 1]}</strong>` }); }
      while (j < right.length) { a[k] = right[j]; mergedIndices.push(k); j++; k++; steps.push({ array: [...a], merged: [...mergedIndices], description: `Copied remaining element <strong>${a[k - 1]}</strong>` }); }
    };

    const sort = (a, l, r) => {
      if (l < r) {
        const m = Math.floor((l + r) / 2);
        steps.push({ array: [...a], active: Array.from({ length: r - l + 1 }, (_, i) => l + i), description: `Dividing subarray [${l}..${r}], mid = ${m}` });
        sort(a, l, m);
        sort(a, m + 1, r);
        merge(a, l, m, r);
      }
    };

    sort(a, 0, a.length - 1);
    steps.push({ array: [...a], sorted: Array.from({ length: a.length }, (_, i) => i), description: '✅ Array is sorted!' });
    return steps;
  },

  quickSort(arr) {
    const steps = [];
    const a = [...arr];

    const partition = (a, low, high) => {
      const pivot = a[high];
      steps.push({ array: [...a], pivot: high, active: Array.from({ length: high - low + 1 }, (_, i) => low + i), description: `Pivot = <strong>${pivot}</strong> at index ${high}` });
      let i = low - 1;
      for (let j = low; j < high; j++) {
        steps.push({ array: [...a], comparing: [j, high], pivot: high, description: `Comparing <strong>${a[j]}</strong> with pivot <strong>${pivot}</strong>` });
        if (a[j] < pivot) {
          i++;
          [a[i], a[j]] = [a[j], a[i]];
          if (i !== j) steps.push({ array: [...a], swapping: [i, j], pivot: high, description: `Swapped <strong>${a[i]}</strong> and <strong>${a[j]}</strong>` });
        }
      }
      [a[i + 1], a[high]] = [a[high], a[i + 1]];
      steps.push({ array: [...a], swapping: [i + 1, high], description: `Pivot <strong>${pivot}</strong> placed at position ${i + 1}` });
      return i + 1;
    };

    const sort = (a, low, high) => {
      if (low < high) {
        const pi = partition(a, low, high);
        sort(a, low, pi - 1);
        sort(a, pi + 1, high);
      }
    };

    sort(a, 0, a.length - 1);
    steps.push({ array: [...a], sorted: Array.from({ length: a.length }, (_, i) => i), description: '✅ Array is sorted!' });
    return steps;
  },

  start(algorithm) {
    if (algorithm) this.currentAlgorithm = algorithm;
    this.updateInfo();
    const fn = this[this.algorithms[this.currentAlgorithm].fn];
    const steps = fn.call(this, [...this.array]);

    const controls = {
      playBtn: document.getElementById('sort-play'),
      pauseBtn: document.getElementById('sort-pause'),
      stepFwdBtn: document.getElementById('sort-step-fwd'),
      stepBackBtn: document.getElementById('sort-step-back'),
      resetBtn: document.getElementById('sort-reset'),
      progressFill: document.getElementById('sort-progress-fill'),
      stepLabel: document.getElementById('sort-step-label'),
      speedSlider: document.getElementById('sort-speed'),
      speedLabel: document.getElementById('sort-speed-label'),
      stepDescription: document.getElementById('sort-step-desc')
    };

    window.animationEngine.init(
      steps,
      controls,
      (step) => {
        this.array = [...step.array];
        this.render(step);
      },
      () => { /* complete */ },
      () => {
        this.generateArray(this.array.length);
      }
    );
  },

  init() {
    this.generateArray(30);
    this.updateInfo();

    // Tab listeners
    document.querySelectorAll('#sorting-page .algo-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('#sorting-page .algo-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        window.animationEngine.stop();
        this.currentAlgorithm = tab.dataset.algo;
        this.generateArray(this.array.length);
        this.updateInfo();
      });
    });

    // Generate button
    const genBtn = document.getElementById('sort-generate');
    if (genBtn) genBtn.addEventListener('click', () => {
      window.animationEngine.stop();
      const size = parseInt(document.getElementById('sort-size').value) || 30;
      this.generateArray(Math.min(Math.max(size, 5), 80));
    });

    // Size slider
    const sizeInput = document.getElementById('sort-size');
    if (sizeInput) sizeInput.addEventListener('change', () => {
      window.animationEngine.stop();
      this.generateArray(Math.min(Math.max(parseInt(sizeInput.value) || 30, 5), 80));
    });

    // Start button
    const startBtn = document.getElementById('sort-start');
    if (startBtn) startBtn.addEventListener('click', () => {
      this.start();
    });
  }
};
