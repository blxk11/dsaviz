/* ========================================
   DSA Visualizer — Animation Engine
   Shared controller for all visualizations
   ======================================== */

class AnimationEngine {
  constructor() {
    this.steps = [];
    this.currentStep = -1;
    this.isPlaying = false;
    this.speed = 500; // ms between steps
    this.timer = null;
    this.onStep = null;     // callback(step, index, total)
    this.onComplete = null; // callback()
    this.onReset = null;    // callback()

    // DOM references (set by visualizer)
    this.playBtn = null;
    this.pauseBtn = null;
    this.stepFwdBtn = null;
    this.stepBackBtn = null;
    this.resetBtn = null;
    this.progressFill = null;
    this.stepLabel = null;
    this.speedSlider = null;
    this.speedLabel = null;
    this.stepDescription = null;
  }

  /**
   * Load steps and bind controls
   * @param {Array} steps - Array of step objects
   * @param {Object} controls - DOM element references
   * @param {Function} onStep - Callback(step, index, total)
   * @param {Function} onComplete - Callback when all steps done
   * @param {Function} onReset - Callback on reset
   */
  init(steps, controls, onStep, onComplete = null, onReset = null) {
    this.stop();
    this.steps = steps;
    this.currentStep = -1;
    this.onStep = onStep;
    this.onComplete = onComplete;
    this.onReset = onReset;

    // Bind DOM
    if (controls) {
      this.playBtn = controls.playBtn;
      this.pauseBtn = controls.pauseBtn;
      this.stepFwdBtn = controls.stepFwdBtn;
      this.stepBackBtn = controls.stepBackBtn;
      this.resetBtn = controls.resetBtn;
      this.progressFill = controls.progressFill;
      this.stepLabel = controls.stepLabel;
      this.speedSlider = controls.speedSlider;
      this.speedLabel = controls.speedLabel;
      this.stepDescription = controls.stepDescription;

      this._bindEvents(controls);
    }

    this._updateUI();
  }

  _bindEvents(controls) {
    // Remove old listeners by cloning
    const clone = (el) => {
      if (!el) return null;
      const c = el.cloneNode(true);
      el.parentNode.replaceChild(c, el);
      return c;
    };

    if (this.playBtn) {
      this.playBtn = clone(this.playBtn);
      this.playBtn.addEventListener('click', () => this.play());
      if (controls.playBtn !== this.playBtn) controls.playBtn = this.playBtn;
    }
    if (this.pauseBtn) {
      this.pauseBtn = clone(this.pauseBtn);
      this.pauseBtn.addEventListener('click', () => this.pause());
    }
    if (this.stepFwdBtn) {
      this.stepFwdBtn = clone(this.stepFwdBtn);
      this.stepFwdBtn.addEventListener('click', () => this.stepForward());
    }
    if (this.stepBackBtn) {
      this.stepBackBtn = clone(this.stepBackBtn);
      this.stepBackBtn.addEventListener('click', () => this.stepBack());
    }
    if (this.resetBtn) {
      this.resetBtn = clone(this.resetBtn);
      this.resetBtn.addEventListener('click', () => this.reset());
    }
    if (this.speedSlider) {
      this.speedSlider = clone(this.speedSlider);
      this.speedSlider.addEventListener('input', (e) => {
        let val = parseInt(e.target.value);



        this.speed = 1100 - val;
        if (this.speedLabel) {
          this.speedLabel.textContent = this._speedText();
        }
        if (this.isPlaying) {
          this.pause();
          this.play();
        }
      });
    }
  }

  play() {
    if (this.isPlaying) return;
    if (this.currentStep >= this.steps.length - 1) {
      this.reset();
    }
    this.isPlaying = true;
    this._updatePlayState();
    this._tick();
  }

  pause() {
    this.isPlaying = false;
    clearTimeout(this.timer);
    this._updatePlayState();
  }

  stop() {
    this.isPlaying = false;
    clearTimeout(this.timer);
  }

  stepForward() {
    if (this.currentStep < this.steps.length - 1) {
      this.pause();
      this.currentStep++;
      this._executeStep();
    }
  }

  stepBack() {
    if (this.currentStep > 0) {
      this.pause();
      this.currentStep--;
      this._executeStep();
    } else if (this.currentStep === 0) {
      this.reset();
    }
  }

  reset() {
    this.stop();
    this.currentStep = -1;
    this._updateUI();
    if (this.onReset) this.onReset();
  }

  _tick() {
    if (!this.isPlaying) return;
    if (this.currentStep >= this.steps.length - 1) {
      this.isPlaying = false;
      this._updatePlayState();
      if (this.onComplete) this.onComplete();
      return;
    }
    this.currentStep++;
    this._executeStep();
    this.timer = setTimeout(() => this._tick(), this.speed);
  }

  _executeStep() {
    const step = this.steps[this.currentStep];
    if (this.onStep) {
      this.onStep(step, this.currentStep, this.steps.length);
    }
    this._updateUI();
  }

  _updateUI() {
    const total = this.steps.length;
    const current = this.currentStep + 1;
    const pct = total > 0 ? (current / total) * 100 : 0;

    if (this.progressFill) {
      this.progressFill.style.width = `${pct}%`;
    }
    if (this.stepLabel) {
      this.stepLabel.textContent = total > 0 ? `${Math.max(current, 0)} / ${total}` : '0 / 0';
    }
    if (this.stepDescription && this.currentStep >= 0 && this.currentStep < total) {
      this.stepDescription.innerHTML = this.steps[this.currentStep].description || '';
    } else if (this.stepDescription && this.currentStep < 0) {
      this.stepDescription.innerHTML = 'Press <strong>Play</strong> or <strong>Step Forward</strong> to begin.';
    }
  }

  _updatePlayState() {
    if (this.playBtn) {
      this.playBtn.style.display = this.isPlaying ? 'none' : 'flex';
    }
    if (this.pauseBtn) {
      this.pauseBtn.style.display = this.isPlaying ? 'flex' : 'none';
    }
  }

  _speedText() {
    if (this.speed < 200) return '4x';
    if (this.speed < 400) return '2x';
    if (this.speed < 600) return '1x';
    if (this.speed < 800) return '0.5x';
    return '0.25x';
  }

  getProgress() {
    return {
      current: this.currentStep + 1,
      total: this.steps.length,
      percent: this.steps.length > 0 ? ((this.currentStep + 1) / this.steps.length) * 100 : 0
    };
  }
}

// Global instance
window.animationEngine = new AnimationEngine();
