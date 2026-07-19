/* ========================================
   DSA Visualizer — Binary Search Tree
   ======================================== */

const TreeVisualizer = {
  root: null,
  currentTraversal: 'inorder',

  info: {
    inorder: { name: 'Inorder (LNR)', description: 'Left → Node → Right: Visits nodes in ascending order for BST.' },
    preorder: { name: 'Preorder (NLR)', description: 'Node → Left → Right: Useful for creating a copy of the tree.' },
    postorder: { name: 'Postorder (LRN)', description: 'Left → Right → Node: Useful for deleting the tree.' },
    levelorder: { name: 'Level Order (BFS)', description: 'Visits nodes level by level from top to bottom.' }
  },

  // BST Node class
  createNode(val) {
    return { val, left: null, right: null };
  },

  insertNode(node, val) {
    if (!node) return this.createNode(val);
    if (val < node.val) node.left = this.insertNode(node.left, val);
    else if (val > node.val) node.right = this.insertNode(node.right, val);
    return node;
  },

  deleteNode(node, val) {
    if (!node) return null;
    if (val < node.val) node.left = this.deleteNode(node.left, val);
    else if (val > node.val) node.right = this.deleteNode(node.right, val);
    else {
      if (!node.left) return node.right;
      if (!node.right) return node.left;
      let minNode = node.right;
      while (minNode.left) minNode = minNode.left;
      node.val = minNode.val;
      node.right = this.deleteNode(node.right, minNode.val);
    }
    return node;
  },

  // Compute positions for rendering
  computePositions(node, x, y, spread, positions = []) {
    if (!node) return positions;
    positions.push({ val: node.val, x, y, left: node.left?.val, right: node.right?.val });
    this.computePositions(node.left, x - spread, y + 60, spread * 0.55, positions);
    this.computePositions(node.right, x + spread, y + 60, spread * 0.55, positions);
    return positions;
  },

  render(states = {}) {
    const svg = document.getElementById('tree-svg');
    if (!svg) return;

    if (!this.root) {
      svg.innerHTML = '<text x="50%" y="50%" text-anchor="middle" fill="#4e4e6a" font-size="14" font-family="Inter">Insert a value to build the tree</text>';
      return;
    }

    const width = svg.clientWidth || 800;
    const positions = this.computePositions(this.root, width / 2, 40, width / 5);
    const posMap = {};
    positions.forEach(p => posMap[p.val] = p);

    let edgesHTML = '';
    let nodesHTML = '';

    positions.forEach(p => {
      // Draw edges
      if (p.left !== undefined && posMap[p.left]) {
        const child = posMap[p.left];
        const edgeCls = (states.highlightEdges && states.highlightEdges.includes(`${p.val}-${p.left}`)) ? 'tree-edge tree-edge--highlight' : 'tree-edge';
        edgesHTML += `<line class="${edgeCls}" x1="${p.x}" y1="${p.y}" x2="${child.x}" y2="${child.y}"/>`;
      }
      if (p.right !== undefined && posMap[p.right]) {
        const child = posMap[p.right];
        const edgeCls = (states.highlightEdges && states.highlightEdges.includes(`${p.val}-${p.right}`)) ? 'tree-edge tree-edge--highlight' : 'tree-edge';
        edgesHTML += `<line class="${edgeCls}" x1="${p.x}" y1="${p.y}" x2="${child.x}" y2="${child.y}"/>`;
      }

      // Draw node
      let nodeCls = 'tree-node';
      if (states.highlight === p.val) nodeCls += ' tree-node--highlight';
      else if (states.visited && states.visited.includes(p.val)) nodeCls += ' tree-node--visited';
      else if (states.found === p.val) nodeCls += ' tree-node--found';

      nodesHTML += `
        <g class="${nodeCls}" transform="translate(${p.x}, ${p.y})">
          <circle r="22"/>
          <text>${p.val}</text>
        </g>
      `;
    });

    svg.innerHTML = edgesHTML + nodesHTML;
  },

  insert() {
    const input = document.getElementById('tree-value');
    const val = parseInt(input.value);
    if (isNaN(val)) return;
    this.root = this.insertNode(this.root, val);
    input.value = '';
    this.render();
    this.showMessage(`Inserted <strong>${val}</strong> into BST.`);
  },

  delete() {
    const input = document.getElementById('tree-value');
    const val = parseInt(input.value);
    if (isNaN(val)) return;
    this.root = this.deleteNode(this.root, val);
    input.value = '';
    this.render();
    this.showMessage(`Deleted <strong>${val}</strong> from BST.`);
  },

  searchNode() {
    const input = document.getElementById('tree-value');
    const val = parseInt(input.value);
    if (isNaN(val)) return;

    const steps = [];
    let node = this.root;
    while (node) {
      steps.push({ highlight: node.val, description: `Visiting node <strong>${node.val}</strong>` });
      if (val === node.val) {
        steps.push({ found: node.val, description: `✅ Found <strong>${val}</strong>!` });
        break;
      } else if (val < node.val) {
        steps.push({ highlight: node.val, description: `<strong>${val}</strong> < <strong>${node.val}</strong>, going left` });
        node = node.left;
      } else {
        steps.push({ highlight: node.val, description: `<strong>${val}</strong> > <strong>${node.val}</strong>, going right` });
        node = node.right;
      }
    }
    if (!steps.some(s => s.found !== undefined)) {
      steps.push({ description: `❌ <strong>${val}</strong> not found.` });
    }
    this.runAnimation(steps);
  },

  // Traversal step generators
  inorderSteps(node, steps = [], visited = []) {
    if (!node) return;
    this.inorderSteps(node.left, steps, visited);
    visited.push(node.val);
    steps.push({ highlight: node.val, visited: [...visited], description: `Visit <strong>${node.val}</strong> (In-order)` });
    this.inorderSteps(node.right, steps, visited);
  },

  preorderSteps(node, steps = [], visited = []) {
    if (!node) return;
    visited.push(node.val);
    steps.push({ highlight: node.val, visited: [...visited], description: `Visit <strong>${node.val}</strong> (Pre-order)` });
    this.preorderSteps(node.left, steps, visited);
    this.preorderSteps(node.right, steps, visited);
  },

  postorderSteps(node, steps = [], visited = []) {
    if (!node) return;
    this.postorderSteps(node.left, steps, visited);
    this.postorderSteps(node.right, steps, visited);
    visited.push(node.val);
    steps.push({ highlight: node.val, visited: [...visited], description: `Visit <strong>${node.val}</strong> (Post-order)` });
  },

  levelorderSteps() {
    if (!this.root) return [];
    const steps = [];
    const visited = [];
    const queue = [this.root];
    while (queue.length) {
      const node = queue.shift();
      visited.push(node.val);
      steps.push({ highlight: node.val, visited: [...visited], description: `Visit <strong>${node.val}</strong> (Level-order)` });
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    return steps;
  },

  traverse(type) {
    this.currentTraversal = type;
    const steps = [];
    if (type === 'inorder') this.inorderSteps(this.root, steps, []);
    else if (type === 'preorder') this.preorderSteps(this.root, steps, []);
    else if (type === 'postorder') this.postorderSteps(this.root, steps, []);
    else {
      const lvl = this.levelorderSteps();
      steps.push(...lvl);
    }
    if (steps.length === 0) {
      this.showMessage('Tree is empty. Insert some nodes first.');
      return;
    }
    steps.push({ visited: steps[steps.length - 1]?.visited || [], description: `✅ ${this.info[type].name} traversal complete! Order: [${(steps[steps.length - 1]?.visited || []).join(', ')}]` });
    this.runAnimation(steps);
  },

  runAnimation(steps) {
    const controls = {
      playBtn: document.getElementById('tree-play'),
      pauseBtn: document.getElementById('tree-pause'),
      stepFwdBtn: document.getElementById('tree-step-fwd'),
      stepBackBtn: document.getElementById('tree-step-back'),
      resetBtn: document.getElementById('tree-reset'),
      progressFill: document.getElementById('tree-progress-fill'),
      stepLabel: document.getElementById('tree-step-label'),
      speedSlider: document.getElementById('tree-speed'),
      speedLabel: document.getElementById('tree-speed-label'),
      stepDescription: document.getElementById('tree-step-desc')
    };

    window.animationEngine.init(
      steps,
      controls,
      (step) => this.render(step),
      null,
      () => this.render()
    );
  },

  generateSampleTree() {
    this.root = null;
    const values = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45];
    values.forEach(v => this.root = this.insertNode(this.root, v));
    this.render();
    this.showMessage('Generated sample BST with values: ' + values.join(', '));
  },

  clearTree() {
    this.root = null;
    window.animationEngine.stop();
    this.render();
    this.showMessage('Tree cleared!');
  },

  showMessage(msg) {
    const el = document.getElementById('tree-message');
    if (el) el.innerHTML = msg;
  },

  init() {
    this.generateSampleTree();

    document.getElementById('tree-insert')?.addEventListener('click', () => this.insert());
    document.getElementById('tree-delete')?.addEventListener('click', () => this.delete());
    document.getElementById('tree-search')?.addEventListener('click', () => this.searchNode());
    document.getElementById('tree-generate')?.addEventListener('click', () => this.generateSampleTree());
    document.getElementById('tree-clear')?.addEventListener('click', () => this.clearTree());

    document.querySelectorAll('#tree-page .algo-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('#tree-page .algo-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.traverse(tab.dataset.algo);
      });
    });

    document.getElementById('tree-value')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.insert();
    });
  }
};
