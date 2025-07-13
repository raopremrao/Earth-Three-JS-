import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import getStarfield from "./src/getStarfield.js";
import { getFresnelMat } from "./src/getFresnelMat.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.01, 1000 );
camera.position.z = 3;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180;
scene.add(earthGroup);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;


const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, 12);
const material = new THREE.MeshStandardMaterial({
  map: loader.load("./textures/8081_earthmap10k.jpg"),
}); 
const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh);

const lightsMat = new THREE.MeshBasicMaterial({
  // color: 0x00ff00,
  // transparent: true,
  // opacity: 0.6,
  map: loader.load("./textures/8081_earthlights10k.jpg"),
  blending: THREE.AdditiveBlending,
})
const lightsMesh = new THREE.Mesh(geometry, lightsMat)
earthGroup.add(lightsMesh)

const cloudMat = new THREE.MeshStandardMaterial({
  // map: loader.load("./textures/8k_earth_clouds.jpg"),
  map: loader.load("./textures/8k_earth_clouds.jpg"),
  transparent: true,
  opacity: 0.6,
  blendinqg: THREE.AdditiveBlending,
});
const cloudMesh = new THREE.Mesh(geometry, cloudMat);
cloudMesh.scale.setScalar(1.005) 
earthGroup.add(cloudMesh);

const fresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geometry, fresnelMat);
glowMesh.scale.setScalar(1.01);
earthGroup.add(glowMesh);

const stars = getStarfield({numStars: 3000});
scene.add(stars)



// const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444)
// scene.add(hemiLight)
const sunLight = new THREE.DirectionalLight(0xffffff, 3);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);


function animate() {
  requestAnimationFrame (animate)

  earthMesh.rotation.y += 0.002;
  lightsMesh.rotation.y += 0.002;
  cloudMesh.rotation.y += 0.0023;
  glowMesh.rotation.y += 0.002;
  renderer.render(scene, camera);
  controls.update();
}

animate()