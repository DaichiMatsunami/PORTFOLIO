//three + vRoid

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { VRMLoaderPlugin } from '@pixiv/three-vrm';

// first view

const svg = document.querySelector(".visualizer-svg");

// 各バーの幅
const barWidths = Array.from({ length: 50 }, () =>
    Math.floor(Math.random() * 10) + 1
);

const barHeight = 50;
const minGap = 3;
const maxGap = 10;

// SVGのバーを生成
let x = 0;

barWidths.forEach((width, index) => {
    const rect = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
    );

    rect.setAttribute("x", x);
    rect.setAttribute("width", width);
    rect.setAttribute("height", barHeight);

    rect.classList.add("bar");

    if (index === 1) {
        rect.classList.add("active");
    }

    svg.appendChild(rect);

    // 次のバーとの間隔をランダム生成
    const gap = Math.random() * (maxGap - minGap) + minGap;

    x += width + gap;
});

//activeを切り替える

const bars = svg.querySelectorAll(".bar");

bars.forEach((bar) => {
    bar.addEventListener("mouseover", () => {
        bars.forEach((b) => b.classList.remove("active"));
        bar.classList.add("active");
    });
});

// e:first view

// lenis

const lenis = new Lenis({
    autoRaf: true,
    duration: 1.4,
    smoothWheel: true,
    anchors: true,
});

// e:lenis

//loadFont
const body = document.querySelector('body')
const loadFont = document.getElementById('works');

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            body.classList.add("is-visible");
            observer.unobserve(loadFont);
        }
    });
});

observer.observe(loadFont);

//e:loadfont

// ==============================
// VRM MODEL
// ==============================

const container = document.getElementById('vrm-container');

if (container) {

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
        35,
        container.clientWidth / container.clientHeight,
        0.1,
        100
    );

    camera.position.set(0, 1.4, 1);
<<<<<<< HEAD
    camera.lookAt(0, 1.6, 0);
=======
    camera.lookAt(0, 1.7, 0);
>>>>>>> home

    // Renderer
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);

    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(1, 2, 3);
    scene.add(directionalLight);

    // VRM Loader
    const loader = new GLTFLoader();

    loader.register((parser) => {
        return new VRMLoaderPlugin(parser);
    });

    let currentVrm = null;

<<<<<<< HEAD
    loader.load(
        '/models/model.vrm',
=======
    const modelPath = `${import.meta.env.BASE_URL}models/model.vrm`;

    loader.load(
        modelPath,
>>>>>>> home

        (gltf) => {

            currentVrm = gltf.userData.vrm;

            scene.add(currentVrm.scene);

            // モデルの向きを調整
            currentVrm.scene.rotation.y = 0;

            console.log('VRM loaded!', currentVrm);

        },

        (progress) => {
            console.log(
                'Loading:',
                (progress.loaded / progress.total * 100).toFixed(1),
                '%'
            );
        },

        (error) => {
            console.error('VRM loading error:', error);
        }
    );

    // Animation Loop
    const clock = new THREE.Clock();

    function animate() {

        requestAnimationFrame(animate);

        const delta = clock.getDelta();

        if (currentVrm) {
            currentVrm.update(delta);
        }

        renderer.render(scene, camera);
    }

    animate();

    // Resize
    window.addEventListener('resize', () => {

        const width = container.clientWidth;
        const height = container.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);

    });

}

//videoExpansion

