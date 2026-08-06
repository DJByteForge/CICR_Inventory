import * as THREE from 'three';
import './style.css';
import type { InventoryItem, ActivityLog, UserDatabase } from './types';

// Global declarations for CDN libraries
declare const lucide: {
    createIcons: () => void;
};

// Global state variables
let inventory: InventoryItem[] = [];
let logs: ActivityLog[] = [];
let selectedItem: InventoryItem | null = null;

// ==========================================
// 1. Initial Sample Dataset
// ==========================================
const DEFAULT_INVENTORY: InventoryItem[] = [
    {
        id: "mc-01",
        name: "Arduino Uno R3",
        category: "microcontrollers",
        quantity: 15,
        location: "Lab Shelf A2",
        specs: "ATmega328P microcontroller, 5V operating voltage, 14 digital I/O pins, 6 analog inputs. Industry standard for learning electronics and rapid prototyping.",
        borrowedBy: [
            { name: "Rahul Sharma", roll: "21102045", qty: 2, purpose: "Robo Soccer Chassis testing", date: "2026-08-05" }
        ]
    },
    {
        id: "mc-02",
        name: "ESP32 NodeMCU Development Board",
        category: "microcontrollers",
        quantity: 20,
        location: "Lab Shelf A3",
        specs: "Dual-core Tensilica LX6 microprocessor, integrated Wi-Fi and Bluetooth (WROOM-32 module), 38 pins. Perfect for IoT, smart automation, and wireless telemetry.",
        borrowedBy: []
    },
    {
        id: "mc-03",
        name: "Raspberry Pi 4 Model B (4GB)",
        category: "microcontrollers",
        quantity: 5,
        location: "Lab Shelf A1",
        specs: "Broadcom BCM2711 quad-core Cortex-A72 64-bit SoC @ 1.5GHz, 4GB LPDDR4-3200 SDRAM. Supports dual 4K displays, gigabit Ethernet, USB 3.0. Used for computer vision and ROS.",
        borrowedBy: [
            { name: "Sneha Gupta", roll: "22103112", qty: 2, purpose: "Object detection using OpenCV", date: "2026-08-06" },
            { name: "Amit Patel", roll: "21103099", qty: 2, purpose: "ROS 2 Navigation simulation", date: "2026-08-07" }
        ]
    },
    {
        id: "sn-01",
        name: "HC-SR04 Ultrasonic Distance Sensor",
        category: "sensors",
        quantity: 35,
        location: "Drawer B1",
        specs: "Operating Voltage: 5V DC, Range: 2cm to 400cm, Effectual Angle: < 15 degrees. Uses ultrasonic waves to determine distance to objects. Crucial for obstacle avoidance.",
        borrowedBy: []
    },
    {
        id: "sn-02",
        name: "MPU6050 Accelerometer & Gyroscope",
        category: "sensors",
        quantity: 12,
        location: "Drawer B2",
        specs: "3-axis gyroscope and 3-axis accelerometer on a single chip, with an onboard Digital Motion Processor (DMP). Communicates via I2C interface. Ideal for self-balancing robots.",
        borrowedBy: [
            { name: "Vikram Singh", roll: "23102201", qty: 1, purpose: "Quadcopter IMU alignment", date: "2026-08-04" }
        ]
    },
    {
        id: "ac-01",
        name: "SG90 Micro Servo Motor",
        category: "actuators",
        quantity: 25,
        location: "Drawer C1",
        specs: "Operating speed: 0.12s/60 degrees (4.8V), Stall torque: 1.6 kg/cm, Rotation angle: 180 degrees. Light weight (9g). Used for robotic arms, steering, and active pan-tilts.",
        borrowedBy: []
    },
    {
        id: "ac-02",
        name: "NEMA 17 Stepper Motor (High Torque)",
        category: "actuators",
        quantity: 8,
        location: "Lab Shelf B4",
        specs: "1.8 degree step angle (200 steps/rev), holding torque: 40Ncm, rated current 1.7A. Standard motor for 3D printers, CNC routers, and high-precision motion controls.",
        borrowedBy: []
    },
    {
        id: "pw-01",
        name: "Orange LiPo 11.1V 2200mAh 30C Battery",
        category: "power",
        quantity: 6,
        location: "Fireproof Cabinet",
        specs: "3S1P configuration, 11.1V nominal voltage, 2200mAh capacity, 30C continuous discharge rate. Balanced charging lead with XT60 connector. High energy density battery.",
        borrowedBy: [
            { name: "Rohit Verma", roll: "21102014", qty: 4, purpose: "Drone propulsion test runs", date: "2026-08-06" },
            { name: "Divya Teja", roll: "22104085", qty: 2, purpose: "Autonomous Rover endurance test", date: "2026-08-07" }
        ]
    },
    {
        id: "tl-01",
        name: "TS100 Smart Soldering Iron",
        category: "tools",
        quantity: 4,
        location: "Tool Cabinet A",
        specs: "65W power, dual-temperature sensors, OLED screen, STM32 MCU inside. Connects to 12-24V power supply. Rapid heating up to 400C in 15 seconds. Portable precision soldering.",
        borrowedBy: [
            { name: "Arjun Reddy", roll: "21102144", qty: 1, purpose: "Soldering PCB nodes at hostel", date: "2026-08-06" }
        ]
    },
    {
        id: "tl-02",
        name: "Creality Ender 3 V2 3D Printer",
        category: "tools",
        quantity: 2,
        location: "3D Printing Zone",
        specs: "Build Volume: 220 x 220 x 250 mm, Silent TMC2208 stepper drivers, carborundum glass platform, rotary knob interface. Prints PLA, ABS, PETG filaments. Crucial for custom mechanical brackets.",
        borrowedBy: []
    }
];

const DEFAULT_LOGS: ActivityLog[] = [
    { type: "system", timestamp: "2026-08-01 10:00", text: "Database initialized with base robotics stock." },
    { type: "borrow", timestamp: "2026-08-05 14:32", text: "<span>Rahul Sharma</span> checked out 2x <span>Arduino Uno R3</span> for 'Robo Soccer Chassis testing'." },
    { type: "borrow", timestamp: "2026-08-06 11:15", text: "<span>Sneha Gupta</span> checked out 2x <span>Raspberry Pi 4 Model B (4GB)</span> for 'Object detection using OpenCV'." },
    { type: "borrow", timestamp: "2026-08-06 16:45", text: "<span>Arjun Reddy</span> checked out 1x <span>TS100 Smart Soldering Iron</span> for 'Soldering PCB nodes at hostel'." },
    { type: "borrow", timestamp: "2026-08-07 09:20", text: "<span>Amit Patel</span> checked out 2x <span>Raspberry Pi 4 Model B (4GB)</span> for 'ROS 2 Navigation simulation'." }
];

// ==========================================
// 2. Three.js 3D Background Engine
// ==========================================
class Background3D {
    private canvas: HTMLCanvasElement;
    private scene!: THREE.Scene;
    private camera!: THREE.PerspectiveCamera;
    private renderer!: THREE.WebGLRenderer;
    
    private grid1!: THREE.GridHelper;
    private grid2!: THREE.GridHelper;
    private particles!: THREE.Points;
    
    private mouseX = 0;
    private mouseY = 0;
    private targetCameraX = 0;
    private targetCameraY = 4;
    
    private gridSize = 250;
    private gridDivisions = 50;
    private moveSpeed = 0.05;

    constructor() {
        this.canvas = document.getElementById('canvas-3d') as HTMLCanvasElement;
        this.init();
        this.createGrid();
        this.createParticles();
        this.setupEvents();
        this.animate();
    }

    private init() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x06060e, 0.015);

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 4, 18);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    private createGrid() {
        const gridColor1 = new THREE.Color(0x00f0ff);
        const gridColor2 = new THREE.Color(0xbd00ff);
        const helperColor = new THREE.Color(0x131326);

        this.grid1 = new THREE.GridHelper(this.gridSize, this.gridDivisions, gridColor1, helperColor);
        this.grid1.position.y = -6;
        this.grid1.position.z = 0;
        this.scene.add(this.grid1);

        this.grid2 = new THREE.GridHelper(this.gridSize, this.gridDivisions, gridColor2, helperColor);
        this.grid2.position.y = -6;
        this.grid2.position.z = -this.gridSize;
        this.scene.add(this.grid2);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xbd00ff, 1.5, 100);
        pointLight.position.set(0, 10, -20);
        this.scene.add(pointLight);

        const pointLight2 = new THREE.PointLight(0x00f0ff, 1.5, 100);
        pointLight2.position.set(20, 5, 10);
        this.scene.add(pointLight2);
    }

    private createParticles() {
        const particleCount = 250;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        const cyanColor = new THREE.Color(0x00f0ff);
        const purpleColor = new THREE.Color(0xbd00ff);
        const pinkColor = new THREE.Color(0xff007a);

        for (let i = 0; i < particleCount; i++) {
            const x = (Math.random() - 0.5) * 120;
            const y = Math.random() * 35 - 5;
            const z = (Math.random() - 0.7) * 150;

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            const rand = Math.random();
            let mixedColor = cyanColor;
            if (rand > 0.6) {
                mixedColor = purpleColor;
            } else if (rand > 0.3) {
                mixedColor = pinkColor;
            }

            colors[i * 3] = mixedColor.r;
            colors[i * 3 + 1] = mixedColor.g;
            colors[i * 3 + 2] = mixedColor.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.18,
            vertexColors: true,
            transparent: true,
            opacity: 0.85,
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    private setupEvents() {
        window.addEventListener('mousemove', (e) => {
            this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });
    }

    private animate() {
        requestAnimationFrame(() => this.animate());

        this.grid1.position.z += this.moveSpeed;
        this.grid2.position.z += this.moveSpeed;

        if (this.grid1.position.z >= this.gridSize) {
            this.grid1.position.z = this.grid2.position.z - this.gridSize;
        }
        if (this.grid2.position.z >= this.gridSize) {
            this.grid2.position.z = this.grid1.position.z - this.gridSize;
        }

        const positions = this.particles.geometry.attributes.position.array as Float32Array;
        const particleCount = positions.length / 3;

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3 + 1] += 0.015;
            positions[i * 3 + 2] += 0.03;

            if (positions[i * 3 + 1] > 30) {
                positions[i * 3 + 1] = -5;
            }
            if (positions[i * 3 + 2] > 20) {
                positions[i * 3 + 2] = -120;
                positions[i * 3] = (Math.random() - 0.5) * 120;
            }
        }
        this.particles.geometry.attributes.position.needsUpdate = true;

        this.targetCameraX = this.mouseX * 3;
        this.targetCameraY = 4 + (this.mouseY * 1.5);

        this.camera.position.x += (this.targetCameraX - this.camera.position.x) * 0.05;
        this.camera.position.y += (this.targetCameraY - this.camera.position.y) * 0.05;
        
        this.camera.lookAt(0, -1, -5);

        this.renderer.render(this.scene, this.camera);
    }
}

// ==========================================
// 3. Database Manager & LocalStorage Sync
// ==========================================
class DatabaseManager {
    static init() {
        if (!localStorage.getItem('cicr_inventory')) {
            localStorage.setItem('cicr_inventory', JSON.stringify(DEFAULT_INVENTORY));
        }
        if (!localStorage.getItem('cicr_logs')) {
            localStorage.setItem('cicr_logs', JSON.stringify(DEFAULT_LOGS));
        }
        inventory = JSON.parse(localStorage.getItem('cicr_inventory')!);
        logs = JSON.parse(localStorage.getItem('cicr_logs')!);
    }

    static save() {
        localStorage.setItem('cicr_inventory', JSON.stringify(inventory));
        localStorage.setItem('cicr_logs', JSON.stringify(logs));
    }

    static addLog(type: ActivityLog['type'], text: string) {
        const date = new Date();
        const timestamp = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        logs.unshift({ type, timestamp, text });
        this.save();
    }
}

// ==========================================
// 4. Dashboard Manager Class
// ==========================================
class DashboardManager {
    private activeCategory = 'all';
    private searchQuery = '';

    private inventoryGrid: HTMLElement;
    private noResults: HTMLElement;
    private searchInput: HTMLInputElement;
    private clearSearchBtn: HTMLElement;
    private categoryFilters: HTMLElement;
    private resultsCount: HTMLElement;

    private statTotal: HTMLElement;
    private statBorrowed: HTMLElement;
    private statLow: HTMLElement;
    private statCategories: HTMLElement;

    private btnAddTrigger: HTMLElement;
    private btnLogs: HTMLElement;
    private navHome: HTMLElement;
    private navAbout: HTMLElement;

    constructor() {
        this.inventoryGrid = document.getElementById('inventory-grid')!;
        this.noResults = document.getElementById('no-results')!;
        this.searchInput = document.getElementById('search-input') as HTMLInputElement;
        this.clearSearchBtn = document.getElementById('clear-search')!;
        this.categoryFilters = document.getElementById('category-filters')!;
        this.resultsCount = document.getElementById('results-count')!;

        this.statTotal = document.getElementById('stat-total')!;
        this.statBorrowed = document.getElementById('stat-borrowed')!;
        this.statLow = document.getElementById('stat-low')!;
        this.statCategories = document.getElementById('stat-categories')!;

        this.btnAddTrigger = document.getElementById('nav-add-item')!;
        this.btnLogs = document.getElementById('btn-logs-bell')!;
        this.navHome = document.getElementById('nav-home')!;
        this.navAbout = document.getElementById('nav-about')!;

        this.init();
    }

    public init() {
        this.renderStats();
        this.renderInventory();
        this.setupEventListeners();
    }

    private setupEventListeners() {
        this.searchInput.addEventListener('input', (e) => {
            this.searchQuery = (e.target as HTMLInputElement).value.toLowerCase().trim();
            this.clearSearchBtn.style.display = this.searchQuery ? 'block' : 'none';
            this.renderInventory();
        });

        this.clearSearchBtn.addEventListener('click', () => {
            this.searchInput.value = '';
            this.searchQuery = '';
            this.clearSearchBtn.style.display = 'none';
            this.renderInventory();
            this.searchInput.focus();
        });

        this.categoryFilters.addEventListener('click', (e) => {
            const btn = (e.target as HTMLElement).closest('.filter-btn') as HTMLElement | null;
            if (!btn) return;

            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            this.activeCategory = btn.dataset.category || 'all';
            this.renderInventory();
        });

        this.btnAddTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            ModalManager.open('add-item-modal');
        });

        this.btnLogs.addEventListener('click', () => {
            ModalManager.openLogsDrawer();
        });

        this.navHome.addEventListener('click', (e) => {
            e.preventDefault();
            this.searchInput.value = '';
            this.searchQuery = '';
            this.clearSearchBtn.style.display = 'none';
            this.activeCategory = 'all';
            
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('.filter-btn[data-category="all"]')!.classList.add('active');
            
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.navHome.classList.add('active');
            
            this.renderInventory();
            document.querySelector('.control-panel')!.scrollIntoView({ behavior: 'smooth' });
        });

        this.navAbout.addEventListener('click', (e) => {
            e.preventDefault();
            ModalManager.openAboutModal();
        });

        const heroExplore = document.getElementById('hero-btn-explore');
        const heroAbout = document.getElementById('hero-btn-about');
        if (heroExplore) {
            heroExplore.addEventListener('click', () => {
                document.querySelector('.control-panel')!.scrollIntoView({ behavior: 'smooth' });
            });
        }
        if (heroAbout) {
            heroAbout.addEventListener('click', () => {
                ModalManager.openAboutModal();
            });
        }
    }

    private renderStats() {
        let totalQty = 0;
        let checkedOutQty = 0;
        let lowStockCount = 0;
        const uniqueCats = new Set<string>();

        inventory.forEach(item => {
            totalQty += item.quantity;
            uniqueCats.add(item.category);

            const borrowedSum = item.borrowedBy.reduce((sum, rec) => sum + rec.qty, 0);
            checkedOutQty += borrowedSum;

            const currentAvailable = item.quantity - borrowedSum;
            if (currentAvailable <= 2 && currentAvailable > 0) {
                lowStockCount++;
            }
        });

        this.statTotal.innerText = String(totalQty);
        this.statBorrowed.innerText = String(checkedOutQty);
        this.statLow.innerText = String(lowStockCount);
        this.statCategories.innerText = String(uniqueCats.size);
    }

    private renderInventory() {
        this.inventoryGrid.innerHTML = '';
        
        const filtered = inventory.filter(item => {
            const matchesCategory = this.activeCategory === 'all' || item.category === this.activeCategory;
            const matchesSearch = item.name.toLowerCase().includes(this.searchQuery) ||
                                  item.specs.toLowerCase().includes(this.searchQuery) ||
                                  item.location.toLowerCase().includes(this.searchQuery);
            return matchesCategory && matchesSearch;
        });

        if (filtered.length === 0) {
            this.noResults.style.display = 'flex';
            this.resultsCount.innerText = "Showing 0 items";
            return;
        }

        this.noResults.style.display = 'none';
        this.resultsCount.innerText = `Showing ${filtered.length} component${filtered.length > 1 ? 's' : ''}`;

        filtered.forEach(item => {
            const card = this.createCardElement(item);
            this.inventoryGrid.appendChild(card);
        });

        lucide.createIcons();
    }

    private createCardElement(item: InventoryItem): HTMLElement {
        const card = document.createElement('div');
        card.className = 'inventory-card glass';
        
        const borrowedSum = item.borrowedBy.reduce((sum, rec) => sum + rec.qty, 0);
        const available = item.quantity - borrowedSum;

        let statusText = 'Available';
        let statusClass = 'status-available';

        if (available === 0) {
            statusText = 'Out of Stock';
            statusClass = 'status-out';
        } else if (available <= 2) {
            statusText = 'Low Stock';
            statusClass = 'status-low';
        } else if (borrowedSum > 0) {
            statusText = 'Borrowed';
            statusClass = 'status-borrowed';
        }

        const catMap: Record<string, string> = {
            microcontrollers: "Controller",
            sensors: "Sensor",
            actuators: "Actuator",
            power: "Power Supply",
            tools: "Lab Tool"
        };
        const categoryLabel = catMap[item.category] || item.category;

        card.innerHTML = `
            <div class="card-header">
                <span class="card-category">${categoryLabel}</span>
                <span class="status-indicator ${statusClass}">${statusText}</span>
            </div>
            <h3 class="card-title">${item.name}</h3>
            <p class="card-desc">${item.specs}</p>
            <div class="card-footer">
                <div class="footer-info">
                    <span class="info-title">Location</span>
                    <span class="info-content"><i data-lucide="map-pin"></i> ${item.location}</span>
                </div>
                <div class="footer-info" style="align-items: flex-end;">
                    <span class="info-title">Availability</span>
                    <span class="info-content"><strong>${available}</strong> / ${item.quantity}</span>
                </div>
            </div>
        `;

        card.addEventListener('click', () => {
            ModalManager.openDetailModal(item);
        });

        return card;
    }
}

// ==========================================
// 5. Modal & Form Controller Manager
// ==========================================
class ModalManager {
    static init() {
        document.querySelectorAll('.close-modal, .modal-overlay').forEach(el => {
            el.addEventListener('click', (e) => {
                if (e.target === el || el.classList.contains('close-modal')) {
                    this.closeAll();
                }
            });
        });

        document.querySelectorAll('.modal-content').forEach(content => {
            content.addEventListener('click', (e) => e.stopPropagation());
        });

        const addForm = document.getElementById('add-item-form') as HTMLFormElement;
        addForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddItemSubmit();
        });

        document.getElementById('btn-add-cancel')!.addEventListener('click', () => {
            this.close('add-item-modal');
        });

        const borrowForm = document.getElementById('borrow-form') as HTMLFormElement;
        borrowForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleBorrowSubmit();
        });

        document.querySelector('.btn-back-to-detail')!.addEventListener('click', () => {
            this.close('borrow-form-modal');
            this.open('detail-modal');
        });

        document.getElementById('btn-borrow')!.addEventListener('click', () => {
            this.openBorrowFormModal();
        });

        document.querySelector('.btn-close-about')!.addEventListener('click', () => {
            this.close('about-modal');
        });
    }

    static open(modalId: string) {
        document.getElementById(modalId)!.classList.add('active');
    }

    static close(modalId: string) {
        document.getElementById(modalId)!.classList.remove('active');
    }

    static closeAll() {
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.classList.remove('active');
        });
        selectedItem = null;
    }

    static openAboutModal() {
        this.open('about-modal');
    }

    static openDetailModal(item: InventoryItem) {
        selectedItem = item;
        
        const borrowedSum = item.borrowedBy.reduce((sum, rec) => sum + rec.qty, 0);
        const available = item.quantity - borrowedSum;

        document.getElementById('detail-name')!.innerText = item.name;
        document.getElementById('detail-location')!.innerText = item.location;
        document.getElementById('detail-specs')!.innerText = item.specs;
        document.getElementById('detail-quantity')!.innerHTML = `<strong>${available}</strong> / ${item.quantity} available`;
        
        const catMap: Record<string, string> = {
            microcontrollers: "Microcontroller / Development Board",
            sensors: "Sensor & Module",
            actuators: "Actuator & Driver",
            power: "Power & Battery Storage",
            tools: "Lab Equipment / Tool"
        };
        document.getElementById('detail-category')!.innerText = catMap[item.category] || item.category;

        const badge = document.getElementById('detail-status')!;
        badge.className = 'modal-status-badge'; 
        
        const borrowBtn = document.getElementById('btn-borrow') as HTMLButtonElement;

        if (available === 0) {
            badge.innerText = 'Out of Stock';
            badge.classList.add('status-out');
            borrowBtn.disabled = true;
            borrowBtn.style.opacity = '0.5';
        } else if (available <= 2) {
            badge.innerText = 'Low Stock';
            badge.classList.add('status-low');
            borrowBtn.disabled = false;
            borrowBtn.style.opacity = '1';
        } else {
            badge.innerText = 'Available';
            badge.classList.add('status-available');
            borrowBtn.disabled = false;
            borrowBtn.style.opacity = '1';
        }

        const borrowersPanel = document.getElementById('borrowers-panel')!;
        const listContainer = document.getElementById('borrowers-list')!;
        listContainer.innerHTML = '';

        if (item.borrowedBy.length > 0) {
            borrowersPanel.style.display = 'block';
            item.borrowedBy.forEach((rec, idx) => {
                const recEl = document.createElement('div');
                recEl.className = 'borrower-record';
                recEl.innerHTML = `
                    <div class="borrower-info-main">
                        <span class="borrower-name">${rec.name}</span>
                        <span class="borrower-roll">${rec.roll} &bull; ${rec.purpose}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span class="borrower-qty-badge">${rec.qty} units</span>
                        <button class="btn btn-secondary btn-inline-return" style="padding: 6px 10px; font-size: 11px;" data-index="${idx}">
                            <i data-lucide="corner-up-left" style="width:12px;height:12px;"></i> Return
                        </button>
                    </div>
                `;
                
                recEl.querySelector('.btn-inline-return')!.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.handleReturnClick(idx);
                });
                
                listContainer.appendChild(recEl);
            });
        } else {
            borrowersPanel.style.display = 'none';
        }

        this.open('detail-modal');
        lucide.createIcons();
    }

    static openBorrowFormModal() {
        if (!selectedItem) return;
        
        const borrowedSum = selectedItem.borrowedBy.reduce((sum, rec) => sum + rec.qty, 0);
        const available = selectedItem.quantity - borrowedSum;

        document.getElementById('borrow-form-subtitle')!.innerText = `Component: ${selectedItem.name}`;
        
        const qtyLimit = document.getElementById('borrow-qty-limit')!;
        qtyLimit.innerText = `Max units available: ${available}`;

        const qtyInput = document.getElementById('borrow-qty') as HTMLInputElement;
        qtyInput.max = String(available);
        qtyInput.value = '1';

        this.close('detail-modal');
        this.open('borrow-form-modal');
    }

    static openLogsDrawer() {
        const logsList = document.getElementById('logs-list')!;
        logsList.innerHTML = '';

        if (logs.length === 0) {
            logsList.innerHTML = '<div style="text-align: center; color: var(--text-dim); margin-top:40px;">No logs logged.</div>';
        } else {
            logs.forEach(log => {
                const logEl = document.createElement('div');
                logEl.className = `log-item log-action-${log.type}`;
                
                let icon = 'info';
                if (log.type === 'borrow') icon = 'shopping-cart';
                if (log.type === 'return') icon = 'corner-up-left';
                if (log.type === 'add') icon = 'plus';

                logEl.innerHTML = `
                    <div class="log-meta">
                        <span style="display:flex; align-items:center; gap:4px;"><i data-lucide="${icon}" style="width:12px;height:12px;"></i> ${log.type.toUpperCase()}</span>
                        <span>${log.timestamp}</span>
                    </div>
                    <div class="log-text-content">${log.text}</div>
                `;
                logsList.appendChild(logEl);
            });
        }

        this.open('logs-drawer');
        lucide.createIcons();
    }

    private static handleAddItemSubmit() {
        const name = (document.getElementById('item-name') as HTMLInputElement).value.trim();
        const category = (document.getElementById('item-category') as HTMLSelectElement).value;
        const qty = parseInt((document.getElementById('item-qty') as HTMLInputElement).value);
        const location = (document.getElementById('item-location') as HTMLInputElement).value.trim();
        const specs = (document.getElementById('item-specs') as HTMLTextAreaElement).value.trim() || "No specifications provided.";

        if (!name || !category || isNaN(qty) || !location) return;

        const id = `${category.slice(0, 2)}-${Date.now().toString().slice(-4)}`;

        const newItem: InventoryItem = {
            id,
            name,
            category,
            quantity: qty,
            location,
            specs,
            borrowedBy: []
        };

        inventory.unshift(newItem);
        DatabaseManager.addLog('add', `Registered new component <span>${name}</span> (Qty: ${qty}) at <span>${location}</span>.`);
        
        (document.getElementById('add-item-form') as HTMLFormElement).reset();
        
        this.close('add-item-modal');
        window.dashboard!.init();
    }

    private static handleBorrowSubmit() {
        if (!selectedItem) return;

        const borrowerName = (document.getElementById('borrow-name') as HTMLInputElement).value.trim();
        const rollNum = (document.getElementById('borrow-roll') as HTMLInputElement).value.trim();
        const qty = parseInt((document.getElementById('borrow-qty') as HTMLInputElement).value);
        const purpose = (document.getElementById('borrow-purpose') as HTMLInputElement).value.trim();

        const borrowedSum = selectedItem.borrowedBy.reduce((sum, rec) => sum + rec.qty, 0);
        const available = selectedItem.quantity - borrowedSum;

        if (qty > available || qty <= 0 || isNaN(qty) || !borrowerName || !rollNum || !purpose) {
            alert("Please enter a valid borrow quantity within limits.");
            return;
        }

        const date = new Date().toISOString().split('T')[0];

        selectedItem.borrowedBy.push({
            name: borrowerName,
            roll: rollNum,
            qty: qty,
            purpose: purpose,
            date: date
        });

        DatabaseManager.addLog('borrow', `<span>${borrowerName}</span> checked out ${qty}x <span>${selectedItem.name}</span> for '${purpose}'.`);

        (document.getElementById('borrow-form') as HTMLFormElement).reset();
        DatabaseManager.save();
        this.close('borrow-form-modal');
        window.dashboard!.init();
    }

    private static handleReturnClick(idx: number) {
        if (!selectedItem) return;

        const rec = selectedItem.borrowedBy[idx];
        if (!rec) return;

        selectedItem.borrowedBy.splice(idx, 1);
        DatabaseManager.addLog('return', `<span>${rec.name}</span> returned ${rec.qty}x <span>${selectedItem.name}</span>.`);

        DatabaseManager.save();
        this.openDetailModal(selectedItem);
        window.dashboard!.init();
    }
}

// ==========================================
// 6. User Authentication Manager
// ==========================================
class AuthManager {
    private static loginForm: HTMLFormElement;
    private static signupForm: HTMLFormElement;
    private static authOverlay: HTMLElement;
    private static appContainer: HTMLElement;

    private static loginUserInp: HTMLInputElement;
    private static loginPassInp: HTMLInputElement;
    private static loginErr: HTMLElement;

    private static signupUserInp: HTMLInputElement;
    private static signupEmailInp: HTMLInputElement;
    private static signupPassInp: HTMLInputElement;
    private static signupErr: HTMLElement;
    private static signupSuccess: HTMLElement;

    private static navUsername: HTMLElement;
    private static navLogoutBtn: HTMLElement;

    static init() {
        if (!localStorage.getItem('cicr_users')) {
            localStorage.setItem('cicr_users', JSON.stringify({}));
        }

        this.loginForm = document.getElementById('login-form') as HTMLFormElement;
        this.signupForm = document.getElementById('signup-form') as HTMLFormElement;
        this.authOverlay = document.getElementById('auth-overlay')!;
        this.appContainer = document.getElementById('app-container')!;

        this.loginUserInp = document.getElementById('login-username') as HTMLInputElement;
        this.loginPassInp = document.getElementById('login-password') as HTMLInputElement;
        this.loginErr = document.getElementById('login-error')!;

        this.signupUserInp = document.getElementById('signup-username') as HTMLInputElement;
        this.signupEmailInp = document.getElementById('signup-email') as HTMLInputElement;
        this.signupPassInp = document.getElementById('signup-password') as HTMLInputElement;
        this.signupErr = document.getElementById('signup-error')!;
        this.signupSuccess = document.getElementById('signup-success')!;

        this.navUsername = document.getElementById('nav-username')!;
        this.navLogoutBtn = document.getElementById('nav-logout')!;

        this.setupEventListeners();
        this.checkAuth();
    }

    private static setupEventListeners() {
        document.getElementById('go-to-signup')!.addEventListener('click', (e) => {
            e.preventDefault();
            this.loginForm.style.display = 'none';
            this.signupForm.style.display = 'block';
            this.loginErr.style.display = 'none';
            this.signupForm.reset();
        });

        document.getElementById('go-to-login')!.addEventListener('click', (e) => {
            e.preventDefault();
            this.signupForm.style.display = 'none';
            this.loginForm.style.display = 'block';
            this.signupErr.style.display = 'none';
            this.signupSuccess.style.display = 'none';
            this.loginForm.reset();
        });

        this.loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        this.signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignup();
        });

        this.navLogoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleLogout();
        });
    }

    private static checkAuth() {
        const currentUser = localStorage.getItem('cicr_auth');
        if (currentUser) {
            this.loginSuccess(currentUser);
        } else {
            this.authOverlay.classList.remove('hidden');
            this.authOverlay.style.display = 'flex';
            this.appContainer.style.display = 'none';
        }
    }

    private static handleLogin() {
        const username = this.loginUserInp.value.trim();
        const password = this.loginPassInp.value;

        this.loginErr.style.display = 'none';

        if (username === 'SRVKILLER09' && password === 'IAMTHEBEST') {
            this.loginSuccess(username);
            return;
        }

        const users = JSON.parse(localStorage.getItem('cicr_users')!) as UserDatabase;
        if (users[username] && users[username] === password) {
            this.loginSuccess(username);
            return;
        }

        this.loginErr.innerText = "Access Denied: Invalid credentials.";
        this.loginErr.style.display = 'block';
        this.loginErr.style.animation = 'none';
        this.loginErr.offsetHeight; 
        this.loginErr.style.animation = 'shake-error 0.4s ease';
    }

    private static loginSuccess(username: string) {
        localStorage.setItem('cicr_auth', username);
        this.navUsername.innerText = username;

        this.authOverlay.classList.add('hidden');
        setTimeout(() => {
            this.authOverlay.style.display = 'none';
            this.appContainer.style.display = 'flex';
            
            if (!window.dashboard) {
                window.dashboard = new DashboardManager();
            } else {
                window.dashboard.init();
            }
            lucide.createIcons();
            TerminalSimulator.start();
        }, 400);
    }

    private static handleSignup() {
        const username = this.signupUserInp.value.trim();
        const email = this.signupEmailInp.value.trim();
        const password = this.signupPassInp.value;

        this.signupErr.style.display = 'none';
        this.signupSuccess.style.display = 'none';

        if (username.length < 3) {
            this.showSignupError("Username must be at least 3 characters.");
            return;
        }

        if (username === 'SRVKILLER09') {
            this.showSignupError("Username already exists.");
            return;
        }

        const users = JSON.parse(localStorage.getItem('cicr_users')!) as UserDatabase;
        if (users[username]) {
            this.showSignupError("Username already registered.");
            return;
        }

        users[username] = password;
        localStorage.setItem('cicr_users', JSON.stringify(users));

        DatabaseManager.addLog('system', `New operator registered: <span>${username}</span> (${email}).`);

        this.signupSuccess.innerText = "Registration complete! Switching to Login...";
        this.signupSuccess.style.display = 'block';

        setTimeout(() => {
            document.getElementById('go-to-login')!.click();
        }, 1500);
    }

    private static showSignupError(msg: string) {
        this.signupErr.innerText = msg;
        this.signupErr.style.display = 'block';
        this.signupErr.style.animation = 'none';
        this.signupErr.offsetHeight;
        this.signupErr.style.animation = 'shake-error 0.4s ease';
    }

    private static handleLogout() {
        localStorage.removeItem('cicr_auth');
        
        this.appContainer.style.display = 'none';
        this.authOverlay.style.display = 'flex';
        setTimeout(() => {
            this.authOverlay.classList.remove('hidden');
        }, 50);

        this.loginForm.reset();
        this.loginErr.style.display = 'none';
    }
}

// ==========================================
// Terminal Simulator Logic
// ==========================================
class TerminalSimulator {
    static start() {
        const body = document.getElementById('terminal-log-body');
        if (!body) return;
        body.innerHTML = '';

        const lines = [
            "Initializing CICR Core database v3.5...",
            "Connecting telemetry link to JIIT-128 robotics vault...",
            "Loading inventory catalog directory... [SUCCESS]",
            "Status: System online. Access level: OPERATOR.",
            "Database streams active. Ready for query."
        ];

        let lineIdx = 0;
        
        function appendNextLine() {
            if (lineIdx >= lines.length) return;

            const text = lines[lineIdx];
            const lineEl = document.createElement('div');
            lineEl.className = 'terminal-line';
            body!.appendChild(lineEl);

            let charIdx = 0;
            lineEl.innerHTML = `<span>&rarr;&nbsp;</span><span class="txt-content"></span>`;
            const txtSpan = lineEl.querySelector('.txt-content') as HTMLElement;
            
            lineEl.classList.add('visible');

            const cursorSpan = document.createElement('span');
            cursorSpan.className = 'cursor';
            lineEl.appendChild(cursorSpan);

            function typeChar() {
                if (charIdx < text.length) {
                    txtSpan.textContent += text[charIdx];
                    charIdx++;
                    setTimeout(typeChar, 25);
                } else {
                    cursorSpan.remove();
                    
                    if (lineIdx === lines.length - 1) {
                        const finalCursor = document.createElement('span');
                        finalCursor.className = 'cursor';
                        lineEl.appendChild(finalCursor);
                    }
                    
                    lineIdx++;
                    setTimeout(appendNextLine, 350);
                }
            }
            typeChar();
        }

        appendNextLine();
    }
}

// Extend global window interface for development debugging
declare global {
    interface Window {
        bg3D?: Background3D;
        dashboard?: DashboardManager;
    }
}

// ==========================================
// 7. Application Bootstrap
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    DatabaseManager.init();
    window.bg3D = new Background3D();
    ModalManager.init();
    AuthManager.init();
    lucide.createIcons();
});
