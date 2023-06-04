import * as THREE from 'three';
import "./style.css" 
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { Light } from 'three';

// Create the scene
const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('/prev.avif');

scene.background = texture;

// Create the sphere geometry
const geometry = new THREE.SphereGeometry(3, 64, 64);

// Create the material
const material = new THREE.MeshStandardMaterial({
  color: "#00ff83"
});

// Create the mesh
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

// Create the camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000);
camera.position.z = 20;
scene.add(camera);

// Create a directional light
const directionalLight = new THREE.PointLight(0xffffff, 1, 100);
directionalLight.position.set(0, 10, 10); // Set the light position
directionalLight.intensity = 1.25
scene.add(directionalLight);

const listener = new THREE.AudioListener();
camera.add( listener );

// create a global audio source
const sound = new THREE.Audio( listener );

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load('/vaporwave.mp3', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true );
	sound.setVolume( 0.5 );
	sound.play();
});

// Create the renderer
const canvas = document.querySelector(".webgl")
const renderer = new THREE.WebGL1Renderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.render(scene,camera)

// Append the renderer's canvas to the container element

// Create OrbitControls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 7;

// Add a resize event listener to update the camera and renderer size when the window is resized
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

// Render the scene with the camera
const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};
loop();


//timeline

const tl = gsap.timeline({defaults: {duration: 1}})
tl.fromTo(mesh.scale,{z:0, x:0, y:0},{z:1, x:1, y:1})
tl.fromTo("nav",{y:"-100%"},{ y: "0%"})
tl.fromTo(".title",{opacity: 0},{ opacity: 1})

//mouse animation colorr
let mouseDown = false
let rgb = []
window.addEventListener("mousedown", () => (mouseDown = true))
window.addEventListener("mouseup", () => (mouseDown = false))

window.addEventListener('mousemove', (e) => {
  if(mouseDown){
    rgb = [
        Math.round((e.pageX / sizes.width) * 255),
        Math.round((e.pageY / sizes.height) * 255),
        150
    ]
    //animation
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
      gsap.to(mesh.material.color, {r: newColor.r, g:newColor.g, b:newColor.b})
  }
});

