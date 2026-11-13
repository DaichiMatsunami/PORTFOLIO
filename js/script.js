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
    const lookAtTarget = new THREE.Object3D();
    lookAtTarget.position.set(0, 1.3, 5);
    scene.add(lookAtTarget);

    // Camera
    const camera = new THREE.PerspectiveCamera(
        35,
        container.clientWidth / container.clientHeight,
        0.1,
        100
    );

    camera.position.set(2, 1.8, 4);
    camera.lookAt(0, 1.3, 0);

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

    //マウス位置取得(視線追従)
    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = (event.clientY / window.innerHeight) * 2 - 1;
    });

    //頭の角度初期設定
    let head = null;
    let headBaseRotation = {
        x: 0,
        y: 0
    };

    //首の角度初期設定
    let neck = null;
    let neckBaseRotation = {
        x: 0,
        y: 0
    };

    // 体育座り用ボーン
    let hips = null;
    let spine = null;

    let leftUpperLeg = null;
    let rightUpperLeg = null;

    let leftLowerLeg = null;
    let rightLowerLeg = null;

    let hipsBasePosition = null;

    let currentVrm = null;

    //まばたき時間初期設定
    let elapsedTime = 0;
    let nextBlinkTime = 2;
    let blinkStartTime = -1;

    const blinkDuration = 0.16;

    //VRM読み込み
    loader.load(
        `${import.meta.env.BASE_URL}models/model.vrm`,
        (gltf) => {

            currentVrm = gltf.userData.vrm;

            scene.add(currentVrm.scene);

            // ==============================
            // 体育座り用ボーン取得
            // ==============================

            hips = currentVrm.humanoid.getNormalizedBoneNode('hips');
            spine = currentVrm.humanoid.getNormalizedBoneNode('spine');

            leftUpperLeg = currentVrm.humanoid.getNormalizedBoneNode('leftUpperLeg');
            rightUpperLeg = currentVrm.humanoid.getNormalizedBoneNode('rightUpperLeg');

            leftLowerLeg = currentVrm.humanoid.getNormalizedBoneNode('leftLowerLeg');
            rightLowerLeg = currentVrm.humanoid.getNormalizedBoneNode('rightLowerLeg');

            hipsBasePosition = hips.position.clone();

            // ==============================
            // 体育座り：太ももの動作テスト
            // ==============================

            // 太ももだけを回転
            leftUpperLeg.rotation.x = -1.0;
            rightUpperLeg.rotation.x = -1.0;

            // 膝を曲げる
            leftLowerLeg.rotation.x = 1.3;
            rightLowerLeg.rotation.x = 1.3;

            // 腰を下げる
            hips.position.y = hipsBasePosition.y - 0.3;
            spine.rotation.x = -0.15;

            // 上半身は初期状態
            spine.rotation.set(0, 0, 0);

            // 頭のボーンを取得
            head = currentVrm.humanoid.getNormalizedBoneNode('head');

            // 初期角度を保存
            headBaseRotation = {
                x: head.rotation.x,
                y: head.rotation.y
            };

            // 首のボーンを取得
            neck = currentVrm.humanoid.getNormalizedBoneNode('neck');

            // 首の初期角度を保存
            if (neck) {
                neckBaseRotation = {
                    x: neck.rotation.x,
                    y: neck.rotation.y
                };
            }

            // 右腕のボーンを取得
            // rightUpperArm = currentVrm.humanoid.getNormalizedBoneNode('rightUpperArm');
            // rightLowerArm = currentVrm.humanoid.getNormalizedBoneNode('rightLowerArm');
            // rightHand = currentVrm.humanoid.getNormalizedBoneNode('rightHand');
            // if (rightUpperArm && rightLowerArm && rightHand) {

            //     rightArmBase = {
            //         upper: {
            //             x: rightUpperArm.rotation.x,
            //             y: rightUpperArm.rotation.y,
            //             z: rightUpperArm.rotation.z
            //         },
            //         lower: {
            //             x: rightLowerArm.rotation.x,
            //             y: rightLowerArm.rotation.y,
            //             z: rightLowerArm.rotation.z
            //         },
            //         hand: {
            //             x: rightHand.rotation.x,
            //             y: rightHand.rotation.y,
            //             z: rightHand.rotation.z
            //         }
            //     };

            // }

            // モデルの向きを調整
            currentVrm.scene.rotation.y = 0;

            if (currentVrm.lookAt) {
                currentVrm.lookAt.target = lookAtTarget;
            }

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
        elapsedTime += delta;

        // ==============================
        // 視線追従
        // ==============================
        lookAtTarget.position.x = mouseX * 2;
        lookAtTarget.position.y = 1.3 - mouseY * 1.5;

        // ==============================
        // 顔の追従
        // ==============================

        // マウスの位置に応じて目標角度を計算
        const targetHeadY = headBaseRotation.y + mouseX * 0.3;
        const targetHeadX = headBaseRotation.x + mouseY * 0.15;

        // 滑らかに回転させる
        if (currentVrm && head) {
            head.rotation.y = THREE.MathUtils.lerp(
                head.rotation.y,
                targetHeadY,
                0.08
            );

            head.rotation.x = THREE.MathUtils.lerp(
                head.rotation.x,
                targetHeadX,
                0.08
            );
        }

        // ==============================
        // 首の追従
        // ==============================

        if (neck) {

            const targetNeckY = neckBaseRotation.y + mouseX * 0.12;
            const targetNeckX = neckBaseRotation.x + mouseY * 0.06;

            neck.rotation.y = THREE.MathUtils.lerp(
                neck.rotation.y,
                targetNeckY,
                0.08
            );

            neck.rotation.x = THREE.MathUtils.lerp(
                neck.rotation.x,
                targetNeckX,
                0.08
            );
        }

        // ==============================
        // まばたき
        // ==============================

        // 次のまばたきタイミング
        if (elapsedTime >= nextBlinkTime) {
            blinkStartTime = elapsedTime;
            nextBlinkTime = elapsedTime + 2.5 + Math.random() * 3.5;
        }

        let blinkValue = 0;

        if (blinkStartTime >= 0) {
            const progress = (elapsedTime - blinkStartTime) / blinkDuration;

            if (progress < 1) {
                blinkValue = progress < 0.5
                    ? progress * 2
                    : (1 - progress) * 2;
            } else {
                blinkStartTime = -1;
            }
        }

        // ==============================
        // VRM更新
        // ==============================
        if (currentVrm) {
            currentVrm.expressionManager?.setValue('blink', blinkValue);
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

