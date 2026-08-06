# CICR | Robotics Inventory Hub 🤖✨

Welcome to the official **Creative & Innovative Cell in Robotics (CICR)** Student Club Inventory Hub! This web application is a premium, high-fidelity single-page web app built with a futuristic cyberpunk neon aesthetic, featuring an **interactive 3D wireframe grid background**.

It is designed to manage laboratory components, tools, microcontrollers, and actuators while offering student members a seamless borrowing and return workflow.

---

## 🌟 Key Features

*   **Interactive 3D Background Engine**: Leverages **Three.js** to render an infinite scrolling neon floor grid and a starry particle field drifting into the horizon. Features subtle mouse-parallax camera rotations.
*   **Aesthetic Glassmorphism UI**: Uses modern CSS variables, backdrop-filter blurs, neon-styled box-shadows, and elegant glowing animations to overlay a clean, intuitive inventory dashboard.
*   **Search & Filtering System**: Real-time typing index searching across component names, tags, and locations. Tab filters classify items by category (Controllers, Sensors, Actuators, Power, Tools).
*   **Interactive Inventory Actions**:
    *   **Detailed View**: Click any card to inspect parts, storage positions, available stock, specific parameters, and live borrowing queues.
    *   **Add Components**: Add new stock items with custom parameters that are automatically categorized.
    *   **Borrowing Flow**: Log when members borrow items by requesting name, roll number, quantity, and purpose, which limits checkout bounds.
    *   **Inline Returns**: Return items directly from the detailed borrower logs to replenish active stock levels.
*   **Live Transaction Auditing**: Displays a detailed transaction panel to audit logs for checking out, returning, and registration histories.
*   **Persistent Storage**: Saves the entire dataset state locally within the user's browser `localStorage`, ensuring data persists between session refreshes.

---

## 📂 Project Structure

The project consists of three core front-end files created directly in the workspace repository:

```text
CICR_Inventory/
├── index.html   # Main application structure, modals, drawers, and CDNs
├── style.css    # Neon-dark design token layout rules, variables, and responsive breakpoints
├── app.js       # Three.js 3D renderer and core JavaScript database actions
└── README.md    # Project documentation and quick-start guide (this file)
```

---

## 🚀 How to Run Locally

Since this application is developed as a zero-dependency static page, it is extremely easy to launch without complex package installs:

### Option A: Direct Launch (Easiest)
Simply navigate to your repository folder and **double-click** [index.html](file:///c:/Users/HP/CICR_Inventory/CICR_Inventory/index.html) (or right-click and open it with your favorite web browser).

### Option B: Local Static Server
To avoid local browser file-scheme restrictions, you can serve the directory using simple server commands in your terminal:

*   **Python**:
    ```bash
    python -m http.server 8000
    ```
    Then visit `http://localhost:8000` in your browser.

*   **NodeJS (npm)**:
    ```bash
    npx serve
    ```
    Then visit the printed port (usually `http://localhost:3000` or `5000`).

---

## 🎨 Customizing the 3D Engine

You can easily adjust the parameters of the 3D grid and particles in [app.js](file:///c:/Users/HP/CICR_Inventory/CICR_Inventory/app.js):

*   **Adjust Grid Movement Speed**: Modify `this.moveSpeed = 0.05;` inside the `Background3D` constructor.
*   **Change Grid Colors**: Modify the Hex color values in `createGrid()`:
    *   `new THREE.Color(0x00f0ff)` (Neon Cyan)
    *   `new THREE.Color(0xbd00ff)` (Neon Purple)
*   **Particle Count**: Change `const particleCount = 250;` inside `createParticles()` to increase or decrease star density.

---

## 📜 Credits & License
Created for the **Creative & Innovative Cell in Robotics (CICR)** student chapter. Designed with love to aid builders, hackers, and robotics engineers in maintaining a clean lab workspace.

*Enjoy building!* 🚀🔧
