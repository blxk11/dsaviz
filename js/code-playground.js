/* ========================================
   DSA Visualizer — Code Playground
   Pattern detection engine for user code
   ======================================== */

const CodePlayground = {
  editor: null,
  detectedAlgorithm: null,
  detectedValues: null,

  complexityData: {
    bubble: { 
      best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', 
      opt: 'Bubble Sort is O(n²) on average. You can optimize this to O(n log n) by switching to Quick Sort or Merge Sort.',
      explanation: 'Bubble Sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. This pass through the list is repeated until the list is sorted. It is simple but slow for large lists.'
    },
    selection: { 
      best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', 
      opt: 'Selection Sort is always O(n²). Switch to Quick Sort or Merge Sort for O(n log n) average performance.',
      explanation: 'Selection Sort divides the input list into two parts: a sorted sublist at the left and an unsorted sublist at the right. It repeatedly finds the smallest element in the unsorted sublist and swaps it with the leftmost unsorted element, growing the sorted sublist.'
    },
    insertion: { 
      best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', 
      opt: 'Insertion Sort is efficient for small or nearly sorted arrays, but O(n²) on average. Use Merge Sort for O(n log n) worst-case.',
      explanation: 'Insertion Sort builds the final sorted array one item at a time. It iterates through the input list, removing one element and inserting it back into its correct position relative to the already sorted elements.'
    },
    merge: { 
      best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)', 
      opt: 'Merge Sort is optimal at O(n log n) time complexity, but uses O(n) auxiliary space. Quick Sort can reduce space to O(log n).',
      explanation: 'Merge Sort is a Divide-and-Conquer algorithm. It recursively splits the array into two halves, sorts each half individually, and then merges the sorted halves back together in sorted order.'
    },
    quick: { 
      best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)', 
      opt: 'Quick Sort is O(n log n) average, but can degrade to O(n²) worst-case with poor pivots. Consider randomized pivoting or Merge Sort.',
      explanation: 'Quick Sort is a Divide-and-Conquer algorithm. It selects a "pivot" element and partitions the array around it, placing smaller elements to its left and larger elements to its right, then recursively sorts the sub-arrays.'
    },
    linear: { 
      best: 'O(1)', avg: 'O(n)', worst: 'O(n)', space: 'O(1)', 
      opt: 'Linear Search scans everything. If the data is sorted, you can optimize to Binary Search O(log n).',
      explanation: 'Linear Search sequentially checks each element of the list in order until a match is found or the end of the list is reached. It is simple but inefficient for large datasets.'
    },
    binary: { 
      best: 'O(1)', avg: 'O(log n)', worst: 'O(log n)', space: 'O(1)', 
      opt: 'Binary Search is highly optimized at O(log n). Ensure your input array is sorted before running.',
      explanation: 'Binary Search operates on a sorted array by repeatedly dividing the search space in half. It compares the target to the middle element, narrowing the search to either the lower or upper half depending on the comparison.'
    },
    bfs: { 
      best: 'O(V + E)', avg: 'O(V + E)', worst: 'O(V + E)', space: 'O(V)', 
      opt: 'BFS is optimal for finding the shortest path in unweighted graphs.',
      explanation: 'Breadth-First Search (BFS) explores nodes level-by-level, visiting all immediate neighbors of a node before moving deeper. It uses a queue (First-In, First-Out) to keep track of nodes to explore next.'
    },
    dfs: { 
      best: 'O(V + E)', avg: 'O(V + E)', worst: 'O(V + E)', space: 'O(V)', 
      opt: 'DFS is ideal for exploring all paths, but not suited for finding the shortest path on unweighted graphs (use BFS).',
      explanation: 'Depth-First Search (DFS) explores as deep as possible along each branch before backtracking. It uses a stack (or recursion) to store nodes and explore the most recently discovered nodes first.'
    },
    dijkstra: { 
      best: 'O((V + E) log V)', avg: 'O((V + E) log V)', worst: 'O((V + E) log V)', space: 'O(V)', 
      opt: "Dijkstra's is optimal for shortest paths in weighted graphs with non-negative weights.",
      explanation: "Dijkstra's Algorithm finds the shortest path from a starting node to all other nodes in a weighted graph. It tracks the minimum tentative distance to each node and visits unvisited nodes greedily, updating neighbor distances."
    },
    stack: { 
      best: 'O(1)', avg: 'O(1)', worst: 'O(1)', space: 'O(n)', 
      opt: 'Stack operations (Push/Pop/Peek) are highly optimized at O(1) time.',
      explanation: 'A Stack is a linear data structure that restricts insertion and deletion to one end (the top). It follows the Last-In, First-Out (LIFO) principle, where the last added item is the first one removed.'
    },
    queue: { 
      best: 'O(1)', avg: 'O(1)', worst: 'O(1)', space: 'O(n)', 
      opt: 'Queue operations (Enqueue/Dequeue) are highly optimized at O(1) time.',
      explanation: 'A Queue is a linear data structure that follows the First-In, First-Out (FIFO) principle. Elements are added at the rear (enqueue) and removed from the front (dequeue), resembling a real-world waiting line.'
    },
    tree_insert: { 
      best: 'O(log n)', avg: 'O(log n)', worst: 'O(n)', space: 'O(n)', 
      opt: 'BST insertions can degrade to O(n) in unbalanced trees. Consider a self-balancing tree like AVL or Red-Black Tree.',
      explanation: 'BST Insertion compares the new value with the current node. If it is smaller, it recursively traverses left; if larger, it traverses right. It inserts the node when it reaches an empty child slot (null).'
    },
    tree_traversal: { 
      best: 'O(n)', avg: 'O(n)', worst: 'O(n)', space: 'O(n)', 
      opt: 'Tree traversal requires visiting every node, so O(n) is optimal.',
      explanation: 'Tree Traversal visits every node in the binary tree exactly once. Common traversal patterns are Inorder (Left, Root, Right), Preorder (Root, Left, Right), and Postorder (Left, Right, Root).'
    },
    linked_list: { 
      best: 'O(1)', avg: 'O(n)', worst: 'O(n)', space: 'O(1)', 
      opt: 'Linked list indexing is O(n). To optimize lookups, consider using an Array or Hash Map.',
      explanation: 'A Linked List stores elements in nodes, where each node contains data and a pointer reference to the next node in the sequence. Navigating to an index requires traversing nodes sequentially from the head.'
    }
  },

  patterns: {
    bubble: {
      name: 'Bubble Sort',
      category: 'sorting',
      structural: [
        /for[\s\S]*?for[\s\S]*?(?:>|<)[\s\S]*?(?:swap|temp|\[.*?\]\s*=)/i,
        /for[\s\S]*?for[\s\S]*?\[.*?(\+|-)\s*1?\][\s\S]*?(swap|temp|\[.*?\]\s*=)/i
      ]
    },
    selection: {
      name: 'Selection Sort',
      category: 'sorting',
      structural: [
        /for[\s\S]*?for[\s\S]*?(?:min|max)[\s\S]*?(?:swap|temp|\[.*?\]\s*=)/i,
        /min(?:idx|index|_idx)?\s*=\s*.*?[\s\S]*?for[\s\S]*?for[\s\S]*?(?:swap|temp)/i
      ]
    },
    insertion: {
      name: 'Insertion Sort',
      category: 'sorting',
      structural: [
        /for[\s\S]*?while[\s\S]*?(?:>|<)[\s\S]*?\[.*?\+\s*1\]\s*=/i,
        /while[\s\S]*?>=[\s\S]*?\[.*?\+\s*1\]\s*=\s*\[.*?\]/i,
        /key\s*=\s*\w+\[/i,
      ]
    },
    merge: {
      name: 'Merge Sort',
      category: 'sorting',
      structural: [
        /merge[\s\S]*?(?:mid|half)\s*=\s*.*?\/.*?2/i,
        /(?:mid|half)\s*=\s*.*?\/.*?2[\s\S]*?(?:mergeSort|sort)[\s\S]*?(?:mergeSort|sort)[\s\S]*?merge/i,
        /left[\s\S]*?right[\s\S]*?merge\s*\(/i
      ]
    },
    quick: {
      name: 'Quick Sort',
      category: 'sorting',
      structural: [
        /partition[\s\S]*?pivot/i,
        /pivot\s*=[\s\S]*?partition/i
      ]
    },
    binary: {
      name: 'Binary Search',
      category: 'searching',
      structural: [
        /\b(?:low|left|lo|start|l)\b[\s\S]*?\b(?:high|right|hi|end|r)\b[\s\S]*?while[\s\S]*?mid/i,
        /while[\s\S]*?mid[\s\S]*?(?:\/|>>)\s*2/i
      ]
    },
    linear: {
      name: 'Linear Search',
      category: 'searching',
      structural: [
        /for[\s\S]*?(?:==|===|equals)[\s\S]*?(?:return|found|break)/i
      ]
    },
    bfs: {
      name: 'Breadth-First Search',
      category: 'graph',
      structural: [
        /queue[\s\S]*?visited[\s\S]*?while[\s\S]*?(?:shift|poll|pop\(0\)|dequeue|queue\.length)/i,
        /visited[\s\S]*?queue[\s\S]*?while/i
      ]
    },
    dfs: {
      name: 'Depth-First Search',
      category: 'graph',
      structural: [
        /(?:stack|recursive|dfs)[\s\S]*?visited[\s\S]*?(?:neighbor|for)/i,
        /visited[\s\S]*?(?:stack|recursive|dfs)[\s\S]*?(?:neighbor|for)/i
      ]
    },
    linked_list: {
      name: 'Linked List',
      category: 'linked-list',
      structural: [
        /(?:class|struct)\s+(?:Node|ListNode)[\s\S]*?(?:next|next_node)/i
      ]
    },
    tree: {
      name: 'Binary Search Tree',
      category: 'tree',
      structural: [
        /(?:class|struct)\s+(?:Node|TreeNode)[\s\S]*?left[\s\S]*?right/i
      ]
    }
  },

  detect(code) {
    if (!code || code.trim().length < 10) return null;

    for (const [key, pattern] of Object.entries(this.patterns)) {
      for (const struct of pattern.structural) {
        if (struct.test(code)) {
          return { algorithm: key, name: pattern.name, category: pattern.category, confidence: 'high', method: 'structural' };
        }
      }
    }

    return null;
  },

  isDSACode(code) {
    const dsaRegex = /(?:for|while|class|def|function|struct|\[\]|Node|array|list)/i;
    return dsaRegex.test(code);
  },

  extractArrayValues(code) {
    // Try to find array literal declarations
    const patterns = [
      /\[([0-9,\s]+)\]/,              // [1, 2, 3]
      /\{([0-9,\s]+)\}/,              // {1, 2, 3} (C/C++/Java)
      /=\s*\[([0-9,\s]+)\]/,          // arr = [1, 2, 3]
      /Arrays?\.\s*(?:of|asList)\(([0-9,\s]+)\)/i,
    ];

    for (const pat of patterns) {
      const match = code.match(pat);
      if (match) {
        const nums = match[1].split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        if (nums.length >= 2) return nums;
      }
    }
    return null;
  },

  extractTarget(code) {
    const patterns = [
      /target\s*=\s*(\d+)/i,
      /key\s*=\s*(\d+)/i,
      /search.*?(\d+)/i,
      /find.*?(\d+)/i,
    ];
    for (const pat of patterns) {
      const match = code.match(pat);
      if (match) return parseInt(match[1]);
    }
    return null;
  },

  visualize(code) {
    const result = this.detect(code);
    const badge = document.getElementById('playground-badge');
    const vizContainer = document.getElementById('playground-viz');

    if (!result) {
      const isDSA = this.isDSACode(code);
      badge.className = 'detection-badge detection-badge--warning';
      
      const errorMsg = isDSA 
        ? 'No DSA algorithm detected in your code. Try pasting a bubble sort, binary search, or BFS implementation.'
        : 'This doesn\'t look like a DSA algorithm. Paste sorting, searching, or graph traversal code.';
        
      badge.innerHTML = '⚠️ ' + errorMsg;
      
      vizContainer.innerHTML = `
        <div class="empty-state" style="padding: 2rem">
          <div class="empty-state__icon">🤔</div>
          <div class="empty-state__title">Algorithm Not Detected</div>
          <div class="empty-state__desc" style="margin-bottom: 1.5rem">
            ${errorMsg}
          </div>
        </div>
      `;
      return;
    }

    this.detectedAlgorithm = result;
    badge.className = 'detection-badge detection-badge--success';
    badge.innerHTML = `✅ Detected: <strong>${result.name}</strong> (${result.confidence} confidence via ${result.method} match)`;

    // Extract values if possible
    const values = this.extractArrayValues(code);
    const target = this.extractTarget(code);

    // Navigate to appropriate visualizer and set values
    this.launchVisualizer(result, values, target);
  },

  launchVisualizer(result, values, target) {
    const vizContainer = document.getElementById('playground-viz');

    let vizHTML = '';
    switch (result.category) {
      case 'sorting':
        vizHTML = this.createMiniSortViz();
        break;
      case 'searching':
        vizHTML = this.createMiniSearchViz();
        break;
      default:
        // For other categories, navigate to the page
        vizHTML = `
          <div class="empty-state" style="padding: 2rem; margin-bottom: 1rem;">
            <div class="empty-state__icon">🎯</div>
            <div class="empty-state__title">Detected: ${result.name}</div>
            <div class="empty-state__desc" style="margin-bottom: 1rem">
              Click below to see this in the full interactive visualizer
            </div>
            <button class="btn btn--primary" onclick="window.location.hash='${result.category}'"
                    id="playground-go-viz">
              Open ${result.name} Visualizer →
            </button>
          </div>
        `;
    }

    const complexityHTML = this.createComplexityCardHTML(result.algorithm);
    vizContainer.innerHTML = vizHTML + complexityHTML;

    if (result.category === 'sorting') {
      this.runMiniSort(result.algorithm, values);
    } else if (result.category === 'searching') {
      this.runMiniSearch(result.algorithm, values, target);
    }
    return true;
  },

  createComplexityCardHTML(algo) {
    const data = this.complexityData[algo];
    if (!data) return '';

    return `
      <div class="pg-breakdown-card animate-fade-in">
        <!-- Header -->
        <div class="pg-breakdown-header">
          <span class="pg-breakdown-icon">⏱️</span>
          <h3 class="pg-breakdown-title">Algorithm Breakdown</h3>
        </div>

        <!-- Big-O Grid -->
        <div class="pg-complexity-row">
          <div class="pg-complexity-cell pg-complexity-cell--best">
            <div class="pg-complexity-label">Best</div>
            <div class="pg-complexity-value">${data.best}</div>
          </div>
          <div class="pg-complexity-cell pg-complexity-cell--avg">
            <div class="pg-complexity-label">Average</div>
            <div class="pg-complexity-value">${data.avg}</div>
          </div>
          <div class="pg-complexity-cell pg-complexity-cell--worst">
            <div class="pg-complexity-label">Worst</div>
            <div class="pg-complexity-value">${data.worst}</div>
          </div>
          <div class="pg-complexity-cell pg-complexity-cell--space">
            <div class="pg-complexity-label">Space</div>
            <div class="pg-complexity-value">${data.space}</div>
          </div>
        </div>

        <!-- How It Works -->
        <div class="pg-how-it-works">
          <h4 class="pg-section-title">📖 How it Works</h4>
          <p class="pg-section-body">${data.explanation}</p>
        </div>

        <!-- Optimization Tip -->
        <div class="pg-opt-tip">
          <strong>💡 Optimisation Tip:</strong> ${data.opt}
        </div>
      </div>
    `;
  },

  createMiniSortViz() {
    return `
      <div class="pg-viz-section">
        <div class="pg-bars-wrap">
          <div id="playground-sort-bars" class="sort-bars"></div>
        </div>
        <div class="pg-controls">
          <div class="playback-bar__controls">
            <button class="playback-btn" id="pg-step-back" title="Step Back">⏮</button>
            <button class="playback-btn" id="pg-play" title="Play">▶</button>
            <button class="playback-btn" id="pg-pause" title="Pause" style="display:none">⏸</button>
            <button class="playback-btn" id="pg-step-fwd" title="Step Forward">⏭</button>
            <button class="playback-btn" id="pg-reset" title="Reset">↺</button>
          </div>
          <div class="playback-bar__progress">
            <div class="progress-track"><div class="progress-fill" id="pg-progress-fill"></div></div>
            <span class="progress-step-label" id="pg-step-label">0 / 0</span>
          </div>
          <div class="speed-control">
            <span class="speed-label" id="pg-speed-label">1x</span>
            <input type="range" id="pg-speed" min="100" max="1000" value="600">
          </div>
        </div>
        <div class="step-description" id="pg-step-desc">Press <strong>Play</strong> to begin the visualization.</div>
      </div>
    `;
  },

  createMiniSearchViz() {
    return `
      <div class="pg-viz-section">
        <div class="pg-search-wrap">
          <div id="playground-search-array" class="search-array"></div>
        </div>
        <div class="pg-controls">
          <div class="playback-bar__controls">
            <button class="playback-btn" id="pg-step-back" title="Step Back">⏮</button>
            <button class="playback-btn" id="pg-play" title="Play">▶</button>
            <button class="playback-btn" id="pg-pause" title="Pause" style="display:none">⏸</button>
            <button class="playback-btn" id="pg-step-fwd" title="Step Forward">⏭</button>
            <button class="playback-btn" id="pg-reset" title="Reset">↺</button>
          </div>
          <div class="playback-bar__progress">
            <div class="progress-track"><div class="progress-fill" id="pg-progress-fill"></div></div>
            <span class="progress-step-label" id="pg-step-label">0 / 0</span>
          </div>
          <div class="speed-control">
            <span class="speed-label" id="pg-speed-label">1x</span>
            <input type="range" id="pg-speed" min="100" max="1000" value="600">
          </div>
        </div>
        <div class="step-description" id="pg-step-desc">Press <strong>Play</strong> to begin the visualization.</div>
      </div>
    `;
  },

  runMiniSort(algo, values) {
    const arr = values || Array.from({ length: 20 }, () => Math.floor(Math.random() * 95) + 5);
    const container = document.getElementById('playground-sort-bars');
    const maxVal = Math.max(...arr);

    const renderBars = (array, states = {}) => {
      container.innerHTML = array.map((val, i) => {
        let cls = 'sort-bar sort-bar--default';
        if (states.sorted && states.sorted.includes(i)) cls = 'sort-bar sort-bar--sorted';
        else if (states.swapping && states.swapping.includes(i)) cls = 'sort-bar sort-bar--swapping';
        else if (states.pivot === i) cls = 'sort-bar sort-bar--pivot';
        else if (states.comparing && states.comparing.includes(i)) cls = 'sort-bar sort-bar--comparing';
        else if (states.active && states.active.includes(i)) cls = 'sort-bar sort-bar--active';
        else if (states.merged && states.merged.includes(i)) cls = 'sort-bar sort-bar--merged';
        return `<div class="${cls}" style="height: ${(val / maxVal) * 260}px" data-value="${val}"></div>`;
      }).join('');
    };

    renderBars(arr);

    // Generate steps
    let steps;
    const sortViz = SortingVisualizer;
    switch (algo) {
      case 'bubble': steps = sortViz.bubbleSort(arr); break;
      case 'selection': steps = sortViz.selectionSort(arr); break;
      case 'insertion': steps = sortViz.insertionSort(arr); break;
      case 'merge': steps = sortViz.mergeSort(arr); break;
      case 'quick': steps = sortViz.quickSort(arr); break;
      default: steps = sortViz.bubbleSort(arr);
    }

    const controls = {
      playBtn: document.getElementById('pg-play'),
      pauseBtn: document.getElementById('pg-pause'),
      stepFwdBtn: document.getElementById('pg-step-fwd'),
      stepBackBtn: document.getElementById('pg-step-back'),
      resetBtn: document.getElementById('pg-reset'),
      progressFill: document.getElementById('pg-progress-fill'),
      stepLabel: document.getElementById('pg-step-label'),
      speedSlider: document.getElementById('pg-speed'),
      speedLabel: document.getElementById('pg-speed-label'),
      stepDescription: document.getElementById('pg-step-desc')
    };

    window.animationEngine.init(
      steps,
      controls,
      (step) => renderBars(step.array, step),
      null,
      () => renderBars(arr)
    );
  },

  runMiniSearch(algo, values, target) {
    let arr = values || Array.from({ length: 16 }, () => Math.floor(Math.random() * 99) + 1);
    arr = [...new Set(arr)].sort((a, b) => a - b);
    if (!target) target = arr[Math.floor(Math.random() * arr.length)];

    const container = document.getElementById('playground-search-array');

    const renderCells = (states = {}) => {
      container.innerHTML = arr.map((val, i) => {
        let cls = 'search-cell';
        if (states.found === i) cls += ' search-cell--found';
        else if (states.checking === i) cls += ' search-cell--checking';
        else if (states.mid === i) cls += ' search-cell--mid';
        else if (states.eliminated && states.eliminated.includes(i)) cls += ' search-cell--eliminated';
        else if (states.range && i >= states.range[0] && i <= states.range[1]) cls += ' search-cell--range';
        return `<div class="${cls}"><span>${val}</span><span class="search-cell__index">${i}</span></div>`;
      }).join('');
    };

    renderCells();

    const searchViz = SearchingVisualizer;
    const steps = algo === 'binary'
      ? searchViz.binarySearch(arr, target)
      : searchViz.linearSearch(arr, target);

    const controls = {
      playBtn: document.getElementById('pg-play'),
      pauseBtn: document.getElementById('pg-pause'),
      stepFwdBtn: document.getElementById('pg-step-fwd'),
      stepBackBtn: document.getElementById('pg-step-back'),
      resetBtn: document.getElementById('pg-reset'),
      progressFill: document.getElementById('pg-progress-fill'),
      stepLabel: document.getElementById('pg-step-label'),
      speedSlider: document.getElementById('pg-speed'),
      speedLabel: document.getElementById('pg-speed-label'),
      stepDescription: document.getElementById('pg-step-desc')
    };

    window.animationEngine.init(
      steps,
      controls,
      (step) => renderCells(step),
      null,
      () => renderCells()
    );
  },



  loadSample(type) {
    const samples = {
      bubble_python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]

arr = [64, 34, 25, 12, 22, 11, 90]
bubble_sort(arr)
print(arr)`,
      binary_java: `public static int binarySearch(int[] arr, int target) {
    int low = 0, high = arr.length - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
      quick_cpp: `int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
      bfs_js: `function bfs(graph, start) {
    const visited = new Set();
    const queue = [start];
    visited.add(start);

    while (queue.length > 0) {
        const node = queue.shift();
        console.log(node);

        for (const neighbor of graph[node]) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
            }
        }
    }
}`,
      merge_python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result`
    };

    const textarea = document.getElementById('code-input');
    if (samples[type]) {
      if (this.editor) {
        this.editor.setValue(samples[type]);
      } else if (textarea) {
        textarea.value = samples[type];
      }
    }
  },

  init() {
    const textarea = document.getElementById('code-input');
    if (textarea && window.CodeMirror) {
      this.editor = CodeMirror.fromTextArea(textarea, {
        lineNumbers: true,
        mode: "javascript",
        theme: "dracula",
        viewportMargin: Infinity
      });
      
      let timeout;
      this.editor.on("change", () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          const code = this.editor.getValue();
          if (code.trim()) {
            this.visualize(code);
          }
        }, 800); // 800ms debounce
      });
    }

    const visualizeBtn = document.getElementById('playground-visualize');
    if (visualizeBtn) {
      visualizeBtn.addEventListener('click', () => {
        const code = this.editor ? this.editor.getValue() : document.getElementById('code-input').value;
        if (!code.trim()) return;
        this.visualize(code);
      });
    }

    // Sample code buttons
    document.querySelectorAll('[data-sample]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.loadSample(btn.dataset.sample);
      });
    });

    // Clear button
    document.getElementById('playground-clear')?.addEventListener('click', () => {
      if (this.editor) {
        this.editor.setValue('');
      } else {
        document.getElementById('code-input').value = '';
      }
      document.getElementById('playground-badge').className = 'detection-badge hidden';
      document.getElementById('playground-viz').innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">💻</div>
          <div class="empty-state__title">Paste Your Code</div>
          <div class="empty-state__desc">Paste any DSA code on the left, and we'll detect the algorithm and visualize it for you.</div>
        </div>
      `;
    });
  }
};
