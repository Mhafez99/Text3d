import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {FontLoader} from "three/examples/jsm/loaders/FontLoader.js";
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry.js";

const scene = new THREE.Scene();

const canvas = document.querySelector("canvas.webgl");
const textureLoader = new THREE.TextureLoader();
const matcupTexture = textureLoader.load("../textures/matcaps/8.png");
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMap = cubeTextureLoader.load([
  "../Cube/px.png",
  "../Cube/nx.png",
  "../Cube/py.png",
  "../Cube/ny.png",
  "../Cube/pz.png",
  "../Cube/nz.png",
]);
scene.environmentMap = environmentMap;
scene.background = environmentMap;

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * TEXT
 */
const fontLoader = new FontLoader();
fontLoader.load("../font/helvetiker_bold.typeface.json", (font) => {
  const textGeometry = new TextGeometry("Mohamed Hafez\nA Front End Developer\n I use THREEjs\n To Build my website", {
    font,
    size: 2,
    height: 1,
    curveSegments: 10,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.01,
    bevelOffset: 0,
    bevelSegments: 10
  });
  textGeometry.center();
  const textMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcupTexture
  });
  // textMaterial.wireframe = true;
  const text = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(text);
});

const pointsGeometry = new THREE.TetrahedronGeometry(1, 0);

const pointsMaterial = new THREE.MeshMatcapMaterial({matcap: matcupTexture});

const group = new THREE.Group();

for (let i = 0; i < 100; i++) {
  const point = new THREE.Mesh(pointsGeometry, pointsMaterial);
  point.position.x = (Math.random() - .5) * 25;
  point.position.y = (Math.random() - .5) * 20;
  point.position.z = (Math.random() - .5) * 20;

  point.rotation.x = Math.random() * Math.PI;
  point.rotation.y = Math.random() * Math.PI;

  point.scale.set(Math.random(), Math.random(), Math.random());
  group.add(point);
}

scene.add(group);

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 20;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);

const renderer = new THREE.WebGLRenderer({
  canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);


const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  group.children.forEach((mesh) => {
    mesh.rotation.x = Math.PI * elapsedTime * 0.1;
    mesh.rotation.y = Math.PI * elapsedTime * 0.1;
  });
  group.rotation.x = Math.PI * elapsedTime * 0.01;
  group.rotation.y = Math.PI * elapsedTime * 0.01;
  group.rotation.z = Math.PI * elapsedTime * 0.01;
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
