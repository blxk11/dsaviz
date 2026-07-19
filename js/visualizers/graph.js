/* ========================================
   DSA Visualizer — Graph Algorithms
   ======================================== */

const GraphVisualizer = {
  nodes: [],
  edges: [],
  adjList: {},
  currentAlgorithm: 'bfs',

  info: {
    bfs: {
      name: 'Breadth-First Search',
      complexity: { time: 'O(V + E)', space: 'O(V)' },
      description: 'Explores all neighbors at current depth before moving to the next depth level. Uses a queue.'
    },
    dfs: {
      name: 'Depth-First Search',
      complexity: { time: 'O(V + E)', space: 'O(V)' },
      description: 'Explores as far as possible along each branch before backtracking. Uses a stack.'
    },
    dijkstra: {
      name: "Dijkstra's Shortest Path",
      complexity: { time: 'O(V² or E log V)', space: 'O(V)' },
      description: 'Finds the shortest path from source to all vertices in a weighted graph using a priority queue.'
    }
  },

  generateSampleGraph() {
    // Create a nice graph layout
    const cx = 400, cy = 190;
    this.nodes = [
      { id: 0, label: 'A', x: cx, y: cy - 140 },
      { id: 1, label: 'B', x: cx - 160, y: cy - 50 },
      { id: 2, label: 'C', x: cx + 160, y: cy - 50 },
      { id: 3, label: 'D', x: cx - 200, y: cy + 70 },
      { id: 4, label: 'E', x: cx - 60, y: cy + 70 },
      { id: 5, label: 'F', x: cx + 60, y: cy + 70 },
      { id: 6, label: 'G', x: cx + 200, y: cy + 70 },
      { id: 7, label: 'H', x: cx, y: cy + 160 },
    ];

    this.edges = [
      { from: 0, to: 1, weight: 4 },
      { from: 0, to: 2, weight: 3 },
      { from: 1, to: 3, weight: 2 },
      { from: 1, to: 4, weight: 5 },
      { from: 2, to: 5, weight: 6 },
      { from: 2, to: 6, weight: 1 },
      { from: 3, to: 7, weight: 7 },
      { from: 4, to: 7, weight: 3 },
      { from: 5, to: 7, weight: 8 },
      { from: 4, to: 5, weight: 2 },
      { from: 1, to: 2, weight: 5 },
    ];

    // Build adjacency list
    this.adjList = {};
    this.nodes.forEach(n => this.adjList[n.id] = []);
    this.edges.forEach(e => {
      this.adjList[e.from].push({ to: e.to, weight: e.weight });
      this.adjList[e.to].push({ to: e.from, weight: e.weight });
    });

    this.render();
    this.updateStartNodeSelect();
  },

  updateStartNodeSelect() {
    const select = document.getElementById('graph-start');
    if (!select) return;
    select.innerHTML = this.nodes.map(n => `<option value="${n.id}">${n.label} (${n.id})</option>`).join('');
  },

  render(states = {}) {
    const svg = document.getElementById('graph-svg');
    if (!svg) return;

    const width = svg.clientWidth || 800;
    const scaleX = width / 800;

    let edgesHTML = '';
    let weightsHTML = '';
    let nodesHTML = '';

    // Draw edges
    this.edges.forEach(e => {
      const from = this.nodes[e.from];
      const to = this.nodes[e.to];
      const edgeKey1 = `${e.from}-${e.to}`;
      const edgeKey2 = `${e.to}-${e.from}`;
      let cls = 'graph-edge';
      if (states.visitedEdges && (states.visitedEdges.includes(edgeKey1) || states.visitedEdges.includes(edgeKey2))) {
        cls += ' graph-edge--visited';
      }
      edgesHTML += `<line class="${cls}" x1="${from.x * scaleX}" y1="${from.y}" x2="${to.x * scaleX}" y2="${to.y}"/>`;

      // Weight labels
      const mx = ((from.x + to.x) / 2) * scaleX;
      const my = (from.y + to.y) / 2;
      weightsHTML += `<text class="graph-edge-weight" x="${mx}" y="${my - 6}">${e.weight}</text>`;
    });

    // Draw nodes
    this.nodes.forEach(n => {
      let cls = 'graph-node';
      if (states.current === n.id) cls += ' graph-node--current';
      else if (states.visited && states.visited.includes(n.id)) cls += ' graph-node--visited';
      else if (states.queued && states.queued.includes(n.id)) cls += ' graph-node--queued';

      let distLabel = '';
      if (states.distances && states.distances[n.id] !== undefined) {
        const d = states.distances[n.id];
        distLabel = `<text y="32" font-size="10" fill="#8b8ba8" text-anchor="middle" font-family="JetBrains Mono">${d === Infinity ? '∞' : d}</text>`;
      }

      nodesHTML += `
        <g class="${cls}" transform="translate(${n.x * scaleX}, ${n.y})">
          <circle r="22"/>
          <text>${n.label}</text>
          ${distLabel}
        </g>
      `;
    });

    svg.innerHTML = edgesHTML + weightsHTML + nodesHTML;
  },

  updateInfo() {
    const info = this.info[this.currentAlgorithm];
    const desc = document.getElementById('graph-algo-desc');
    if (desc) desc.textContent = info.description;
  },

  bfsSteps(startId) {
    const steps = [];
    const visited = new Set();
    const visitedEdges = [];
    const queue = [startId];
    visited.add(startId);

    steps.push({
      current: startId,
      visited: [...visited],
      queued: [...queue],
      visitedEdges: [...visitedEdges],
      description: `Starting BFS from node <strong>${this.nodes[startId].label}</strong>. Added to queue.`
    });

    while (queue.length > 0) {
      const nodeId = queue.shift();
      steps.push({
        current: nodeId,
        visited: [...visited],
        queued: [...queue],
        visitedEdges: [...visitedEdges],
        description: `Dequeued <strong>${this.nodes[nodeId].label}</strong>. Exploring neighbors...`
      });

      for (const neighbor of this.adjList[nodeId]) {
        if (!visited.has(neighbor.to)) {
          visited.add(neighbor.to);
          queue.push(neighbor.to);
          visitedEdges.push(`${nodeId}-${neighbor.to}`);
          steps.push({
            current: nodeId,
            visited: [...visited],
            queued: [...queue],
            visitedEdges: [...visitedEdges],
            description: `Discovered <strong>${this.nodes[neighbor.to].label}</strong>. Added to queue.`
          });
        }
      }
    }

    steps.push({
      visited: [...visited],
      visitedEdges: [...visitedEdges],
      description: `✅ BFS complete! Visited order: [${[...visited].map(id => this.nodes[id].label).join(', ')}]`
    });
    return steps;
  },

  dfsSteps(startId) {
    const steps = [];
    const visited = new Set();
    const visitedEdges = [];

    const dfs = (nodeId) => {
      visited.add(nodeId);
      steps.push({
        current: nodeId,
        visited: [...visited],
        visitedEdges: [...visitedEdges],
        description: `Visiting <strong>${this.nodes[nodeId].label}</strong> (DFS)`
      });

      for (const neighbor of this.adjList[nodeId]) {
        if (!visited.has(neighbor.to)) {
          visitedEdges.push(`${nodeId}-${neighbor.to}`);
          steps.push({
            current: nodeId,
            visited: [...visited],
            visitedEdges: [...visitedEdges],
            description: `Exploring edge ${this.nodes[nodeId].label} → ${this.nodes[neighbor.to].label}`
          });
          dfs(neighbor.to);
        }
      }
    };

    dfs(startId);
    steps.push({
      visited: [...visited],
      visitedEdges: [...visitedEdges],
      description: `✅ DFS complete! Visited order: [${[...visited].map(id => this.nodes[id].label).join(', ')}]`
    });
    return steps;
  },

  dijkstraSteps(startId) {
    const steps = [];
    const dist = {};
    const visited = new Set();
    const visitedEdges = [];
    this.nodes.forEach(n => dist[n.id] = Infinity);
    dist[startId] = 0;

    steps.push({
      current: startId,
      visited: [],
      visitedEdges: [],
      distances: { ...dist },
      description: `Starting Dijkstra from <strong>${this.nodes[startId].label}</strong>. Distance = 0, all others = ∞`
    });

    for (let i = 0; i < this.nodes.length; i++) {
      // Find min distance unvisited node
      let minDist = Infinity, u = -1;
      this.nodes.forEach(n => {
        if (!visited.has(n.id) && dist[n.id] < minDist) {
          minDist = dist[n.id];
          u = n.id;
        }
      });

      if (u === -1) break;
      visited.add(u);

      steps.push({
        current: u,
        visited: [...visited],
        visitedEdges: [...visitedEdges],
        distances: { ...dist },
        description: `Selected <strong>${this.nodes[u].label}</strong> (dist=${dist[u]}). Relaxing edges...`
      });

      for (const neighbor of this.adjList[u]) {
        if (!visited.has(neighbor.to)) {
          const newDist = dist[u] + neighbor.weight;
          if (newDist < dist[neighbor.to]) {
            dist[neighbor.to] = newDist;
            visitedEdges.push(`${u}-${neighbor.to}`);
            steps.push({
              current: u,
              visited: [...visited],
              visitedEdges: [...visitedEdges],
              distances: { ...dist },
              description: `Updated <strong>${this.nodes[neighbor.to].label}</strong>: ${dist[u]} + ${neighbor.weight} = ${newDist}`
            });
          }
        }
      }
    }

    const distStr = this.nodes.map(n => `${n.label}=${dist[n.id]}`).join(', ');
    steps.push({
      visited: [...visited],
      visitedEdges: [...visitedEdges],
      distances: { ...dist },
      description: `✅ Dijkstra complete! Shortest distances: ${distStr}`
    });
    return steps;
  },

  start(algorithm) {
    if (algorithm) this.currentAlgorithm = algorithm;
    this.updateInfo();
    const startId = parseInt(document.getElementById('graph-start')?.value) || 0;

    let steps;
    if (this.currentAlgorithm === 'bfs') steps = this.bfsSteps(startId);
    else if (this.currentAlgorithm === 'dfs') steps = this.dfsSteps(startId);
    else steps = this.dijkstraSteps(startId);

    const controls = {
      playBtn: document.getElementById('graph-play'),
      pauseBtn: document.getElementById('graph-pause'),
      stepFwdBtn: document.getElementById('graph-step-fwd'),
      stepBackBtn: document.getElementById('graph-step-back'),
      resetBtn: document.getElementById('graph-reset'),
      progressFill: document.getElementById('graph-progress-fill'),
      stepLabel: document.getElementById('graph-step-label'),
      speedSlider: document.getElementById('graph-speed'),
      speedLabel: document.getElementById('graph-speed-label'),
      stepDescription: document.getElementById('graph-step-desc')
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
    this.generateSampleGraph();
    this.updateInfo();

    document.querySelectorAll('#graph-page .algo-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('#graph-page .algo-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        window.animationEngine.stop();
        this.currentAlgorithm = tab.dataset.algo;
        this.updateInfo();
        this.render();
      });
    });

    document.getElementById('graph-start-btn')?.addEventListener('click', () => this.start());
    document.getElementById('graph-regenerate')?.addEventListener('click', () => {
      window.animationEngine.stop();
      this.generateSampleGraph();
    });
  }
};
