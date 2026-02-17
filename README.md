# 🐙 Robotic Tentacles (Inverse Kinematics)

**Robotic Tentacles** is a procedural animation experiment that simulates organic, snake-like movement using **Inverse Kinematics (IK)**.

Unlike standard animations where movement is pre-defined, these tentacles react in real-time. They calculate the precise angle and position of every segment to smoothly reach toward the mouse cursor while remaining anchored to a central base.

## ✨ Features

* **Real-Time Inverse Kinematics:** Implements a "Drag-and-Reach" IK algorithm often used in video game character animation and robotics.
* **Procedural Swarm:** Generates 40+ independent tentacles that move organically without pre-rendered sprites.
* **Neon Aesthetics:** Features a glowing, cyber-punk visual style using dynamic HSL color generation.
* **Performance:** Optimized rendering loop using the HTML5 Canvas API and `requestAnimationFrame`.

## 🚀 How to Run

This project is built with **Vanilla JavaScript**, so no build tools or servers are required.

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/yourusername/robotic-tentacles.git](https://github.com/yourusername/robotic-tentacles.git)
    ```
2.  **Open the project**
    Navigate to the folder and double-click `index.html` to open it in your browser.
3.  **Interact**
    Move your mouse across the screen and watch the swarm follow you!

## 🧠 How It Works

The simulation relies on a custom `Segment` class and a two-pass calculation system:

1.  **Forward Pass (Reaching):** Starting from the tip of the tentacle, each segment calculates the angle (`Math.atan2`) needed to point at the target (the mouse or the previous segment) and moves to touch it.
2.  **Backward Pass (Anchoring):** Because the forward pass pulls the tentacle off its base, we run a backward pass. We force the base segment back to the center coordinates `(x, y)` and adjust all subsequent segments to maintain their length and relative angles.

### The Math
The core logic utilizes trigonometry to calculate rotation:
```javascript
// Calculate angle between current segment and target
this.angle = Math.atan2(targetY - this.y, targetX - this.x);

// Calculate new position based on fixed length
this.x = targetX - Math.cos(this.angle) * this.length;
this.y = targetY - Math.sin(this.angle) * this.length;