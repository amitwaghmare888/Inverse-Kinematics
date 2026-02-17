const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const tentacles = [];
const maxTentacles = 40; // Number of arms
const segmentsPerTentacle = 30; // Length of each arm

let mouse = { x: canvas.width / 2, y: canvas.height / 2 };

// 1. The Segment Class (One piece of a tentacle)
class Segment {
    constructor(parent, length, angle, first) {
        this.parent = parent; // The segment this one follows
        this.x = 0;
        this.y = 0;
        if (first) {
            this.x = parent.x;
            this.y = parent.y;
        }
        this.length = length;
        this.angle = angle;
        this.targetAngle = angle;
    }

    update(targetX, targetY) {
        // Calculate angle to point at target
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        this.targetAngle = Math.atan2(dy, dx);
        
        // Smooth rotation (Linear Interpolation)
        this.angle = this.targetAngle;

        // Determine new position based on angle
        // This is the "Inverse Kinematics" step
        targetX = targetX - Math.cos(this.angle) * this.length;
        targetY = targetY - Math.sin(this.angle) * this.length;
        
        return { x: targetX, y: targetY };
    }

    setPos(x, y) {
        this.x = x;
        this.y = y;
    }

    draw(ctx, color) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(this.length, 0);
        ctx.stroke();
        
        ctx.restore();
    }
}

// 2. The Tentacle Class (A chain of segments)
class Tentacle {
    constructor(x, y, length, n, color) {
        this.segments = [];
        this.baseX = x;
        this.baseY = y;
        this.color = color;
        
        // Create the chain
        let parent = { x: x, y: y };
        for (let i = 0; i < n; i++) {
            const segment = new Segment(parent, length, 0, i === 0);
            this.segments.push(segment);
            parent = segment;
        }
    }

    update(targetX, targetY) {
        // Inverse Kinematics: Calculate from the TIP backwards to the BASE
        let currentTarget = { x: targetX, y: targetY };
        
        // Pass 1: Drag segments towards mouse
        for (let i = this.segments.length - 1; i >= 0; i--) {
            currentTarget = this.segments[i].update(currentTarget.x, currentTarget.y);
        }

        // Pass 2: Anchor the base so it doesn't fly away
        // We force the first segment back to the base position
        let pos = { x: this.baseX, y: this.baseY };
        for (let i = 0; i < this.segments.length; i++) {
            const segment = this.segments[i];
            segment.setPos(pos.x, pos.y);
            
            // Calculate where the NEXT segment starts
            pos.x += Math.cos(segment.angle) * segment.length;
            pos.y += Math.sin(segment.angle) * segment.length;
        }
    }

    draw(ctx) {
        this.segments.forEach(s => s.draw(ctx, this.color));
    }
}

// 3. Initialize Swarm
function init() {
    tentacles.length = 0;
    
    // Create tentacles in a circle around the center
    for (let i = 0; i < maxTentacles; i++) {
        const angle = (Math.PI * 2 * i) / maxTentacles;
        const x = canvas.width / 2 + Math.cos(angle) * 100;
        const y = canvas.height / 2 + Math.sin(angle) * 100;
        
        // Random neon colors
        const hue = (i * 360 / maxTentacles);
        const color = `hsl(${hue}, 100%, 50%)`;
        
        tentacles.push(new Tentacle(x, y, 10, segmentsPerTentacle, color));
    }
}

// 4. Animation Loop
function animate() {
    // Trail effect (slow fade)
    ctx.fillStyle = 'rgba(5, 5, 5, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    tentacles.forEach(t => {
        t.update(mouse.x, mouse.y);
        t.draw(ctx);
    });

    requestAnimationFrame(animate);
}

// Event Listeners
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// Start
init();
animate();