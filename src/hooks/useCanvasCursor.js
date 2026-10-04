import { useEffect } from 'react';

const useCanvasCursor = () => {
  useEffect(() => {
    const canvas = document.getElementById('canvas');
    if (!(canvas instanceof HTMLCanvasElement)) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const pos = { x: 0, y: 0 };
    const config = {
      friction: 0.5,
      trails: 20,
      size: 30,
      dampening: 0.25,
      tension: 0.98,
    };

    let lines = [];
    let frameId = 0;
    let running = false;
    let initialized = false;
    let phase = Math.random() * 2 * Math.PI;

    function Node() {
      this.x = 0;
      this.y = 0;
      this.vx = 0;
      this.vy = 0;
    }

    function Line(options) {
      this.spring = options.spring + 0.1 * Math.random() - 0.02;
      this.friction = config.friction + 0.01 * Math.random() - 0.002;
      this.nodes = [];

      for (let index = 0; index < config.size; index += 1) {
        const node = new Node();
        node.x = pos.x;
        node.y = pos.y;
        this.nodes.push(node);
      }
    }

    Line.prototype.update = function update() {
      let spring = this.spring;
      let node = this.nodes[0];

      node.vx += (pos.x - node.x) * spring;
      node.vy += (pos.y - node.y) * spring;

      for (let index = 0; index < this.nodes.length; index += 1) {
        node = this.nodes[index];

        if (index > 0) {
          const previous = this.nodes[index - 1];
          node.vx += (previous.x - node.x) * spring;
          node.vy += (previous.y - node.y) * spring;
          node.vx += previous.vx * config.dampening;
          node.vy += previous.vy * config.dampening;
        }

        node.vx *= this.friction;
        node.vy *= this.friction;
        node.x += node.vx;
        node.y += node.vy;
        spring *= config.tension;
      }
    };

    Line.prototype.draw = function draw() {
      let x = this.nodes[0].x;
      let y = this.nodes[0].y;

      ctx.beginPath();
      ctx.moveTo(x, y);

      let index = 1;
      for (; index < this.nodes.length - 2; index += 1) {
        const node = this.nodes[index];
        const next = this.nodes[index + 1];
        x = 0.5 * (node.x + next.x);
        y = 0.5 * (node.y + next.y);
        ctx.quadraticCurveTo(node.x, node.y, x, y);
      }

      const node = this.nodes[index];
      const next = this.nodes[index + 1];
      ctx.quadraticCurveTo(node.x, node.y, next.x, next.y);
      ctx.stroke();
      ctx.closePath();
    };

    const createLines = () => {
      lines = [];
      for (let index = 0; index < config.trails; index += 1) {
        lines.push(
          new Line({ spring: 0.4 + (index / config.trails) * 0.025 }),
        );
      }
    };

    const render = () => {
      if (!running) return;

      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.globalCompositeOperation = 'lighter';

      phase += 0.0015;
      const hue = 285;
      ctx.strokeStyle = `hsla(${hue}, 50%, 50%, 0.2)`;
      ctx.lineWidth = 7;

      for (let index = 0; index < config.trails; index += 1) {
        lines[index].update();
        lines[index].draw();
      }

      frameId = window.requestAnimationFrame(render);
    };

    const movePointer = (event) => {
      pos.x = event.clientX;
      pos.y = event.clientY;

      if (!initialized) {
        initialized = true;
        running = true;
        createLines();
        render();
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth - 20;
      canvas.height = window.innerHeight;
    };

    const pause = () => {
      running = false;
      window.cancelAnimationFrame(frameId);
    };

    const resume = () => {
      if (!initialized || running) return;
      running = true;
      render();
    };

    resizeCanvas();
    document.addEventListener('mousemove', movePointer, { passive: true });
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('blur', pause);
    window.addEventListener('focus', resume);

    return () => {
      running = false;
      window.cancelAnimationFrame(frameId);
      document.removeEventListener('mousemove', movePointer);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('blur', pause);
      window.removeEventListener('focus', resume);
    };
  }, []);
};

export default useCanvasCursor;
