import * as THREE from 'https://unpkg.com/three@0.130.1/build/three.module.js';

// --- Setup Scene, Camera, and Renderer ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0x333333); // Dark background

// --- Add Lighting ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// --- Create Objects ---

// 1. The main cube with standard material for lighting
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x48dbfb });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 2. A sheared cube using a Matrix4
const shearGeometry = new THREE.BoxGeometry(1, 1, 1);
const shearMatrix = new THREE.Matrix4();
// Matrix for shearing. Adjust values to change the shear effect.
// Shear along X-axis based on Z-coordinate
shearMatrix.set(
    1, 0, 0, 0,
    0, 1, 0, 0,
    0.5, 0, 1, 0, // <-- '0.5' is the shear factor
    0, 0, 0, 1
);
shearGeometry.applyMatrix4(shearMatrix);

const shearMaterial = new THREE.MeshStandardMaterial({ color: 0xff6b6b });
const shearedCube = new THREE.Mesh(shearGeometry, shearMaterial);
shearedCube.position.set(2, 0, 0); // Position it next to the main cube
scene.add(shearedCube);

// 3. A cube with perspective-based movement
const perspectiveCube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0xffc857 })
);
perspectiveCube.position.set(-2, 0, 0);
scene.add(perspectiveCube);

// --- Camera Position ---
camera.position.z = 5;

// --- Animation Loop ---
function animate() {
    requestAnimationFrame(animate);

    const time = Date.now() * 0.001;
    const sine = Math.sin(time);

    // Basic rotation for the main cube
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // Reflection effect (using object rotation and position)
    // The sheared cube will "reflect" the main cube's rotation
    shearedCube.rotation.x = -cube.rotation.x;
    shearedCube.rotation.y = -cube.rotation.y;

    // Perspective movement for the third cube
    // This cube will move closer and further based on perspective
    perspectiveCube.position.z = 2 * sine;

    renderer.render(scene, camera);
}
animate();

// --- Handle Window Resizing ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});