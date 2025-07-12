// Instantiate Scene, PerspectiveCamera, and WebGLRenderer, and render the empty scene once.

import * as THREE from 'three';

const app = document.getElementById('app');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

if (app) {
  app.innerHTML = '';
  // Append the renderer to the app element
  app.appendChild(renderer.domElement);
} else {
    console.error('App element not found');
}

// Create a black background
scene.background = new THREE.Color(0x000000);

// Render the scene
function animate() {
  renderer.render(scene, camera);
}

animate();
