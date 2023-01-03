import '../style/style.css'
import officeModel from '../models/office/scene.gltf?url';
import bedModel from '../models/bed/scene.gltf?url';
import catModel from '../models/cat/scene.gltf?url';
import puffModel from '../models/jigglypuff/scene.gltf?url';
import parquet from '../textures/parquet.png?url';
import wallap from '../textures/TexturesCom_ConcreteStucco0134_1_seamless_S.jpg?url';

import * as THREE from 'three'
import {TWEEN} from "three/addons/libs/tween.module.min.js";
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from "three/addons/controls/TransformControls.js";

const debug = false;

/* THREE JS */

    window.addEventListener('resize', () => {
        window.location.reload();
    });

    const cameraPositions = {
        'about': {
            'position': {
                x: -9.77,
                y: 3.75,
                z: 5.42
            },
            'rotation': {
                x: -0.57,
                y: 0.72,
                z: 0.60
            }
        },
        'projects': {
            'position': {
                x: 1,
                y: 1.5,
                z: -8
            },
            'rotation': {
                x: 0,
                y: -0.3,
                z: 0
            }
        },
        'contacts': {
            'position': {
                x: 0,
                y: 0,
                z: 0
            },
            'rotation': {
                x: 0,
                y: 0,
                z: 0
            }
        },
        'build': {
            'position': {
                x: 15,
                y: 15,
                z: 50
            },
            'rotation': {
                x: 0,
                y: 0,
                z: 0
            }
        }
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xD7EAA2);

    const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(cameraPositions.about.position.x, cameraPositions.about.position.y, cameraPositions.about.position.z);
    camera.rotation.set(cameraPositions.about.rotation.x, cameraPositions.about.rotation.y, cameraPositions.about.rotation.z);

    if (debug) {
        camera.position.set(cameraPositions.build.position.x, cameraPositions.build.position.y, cameraPositions.build.position.z);
        camera.rotation.set(cameraPositions.build.rotation.x, cameraPositions.build.rotation.y, cameraPositions.build.rotation.z);
    }


    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#bg'),
    });

    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.render( scene, camera );

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff);
    ambientLight.intensity = 0.1;
    scene.add(ambientLight);

    const screenLight = new THREE.PointLight(0xA7DDF5);
    screenLight.position.set(4, 3, -20);
    scene.add(screenLight);

    const bedLight = new THREE.PointLight(0xffffff);
    bedLight.position.set(-15, 1, 3);
    bedLight.intensity = 0.4;
    scene.add(bedLight);

    // 3D
    const loader = new GLTFLoader();

    const ModelControls = new TransformControls(camera, renderer.domElement);

        // Particles
        const particles = [];

        function addAmbientParticle() {
            const geometry = new THREE.SphereGeometry(0.015, 24, 24);
            const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const particle = new THREE.Mesh(geometry, material);

            const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(50));

            particle.position.set(x, y, z);
            scene.add(particle);

            particles.push(particle);
        }

        Array(200).fill().forEach(addAmbientParticle);

        // Office
        loader.load(
            officeModel,
            function ( gltf ) {
                gltf.scene.children[0].scale.set(0.1, 0.1, 0.1);
                gltf.scene.position.set(5, -5, -20);
                gltf.scene.rotation.set(0, 5, 0);
                scene.add( gltf.scene );
                animate();
            }, undefined, function ( error ) {
                console.error( error );
            }
        );

        // Jigglypuff
        let puff
        loader.load(
            puffModel,
            function ( gltf ) {
                gltf.scene.children[0].scale.set(0.002, 0.002, 0.002);
                gltf.scene.position.set(-1.2, 0.2, -17.6);
                gltf.scene.rotation.set(-0.41, 0.53, 0.47);

                puff = gltf.scene;

                scene.add( gltf.scene );
                animate();
            }
        );

        // Walls

        const wallTexture = new THREE.TextureLoader().load(wallap);
        wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
        wallTexture.repeat.set( 10, 10 );

        const roomBackWall = new THREE.Mesh(
            new THREE.BoxGeometry(200, 200, 1),
            new THREE.MeshStandardMaterial({ map: wallTexture})
        );

        roomBackWall.position.set(-3, 13, -23);
        roomBackWall.rotation.set(0, 0.28, 0);

        const roomRightSideWall = new THREE.Mesh(
            new THREE.BoxGeometry(1, 200, 200),
            new THREE.MeshStandardMaterial({ map: wallTexture})
        );

        roomRightSideWall.position.set(13, 13, -23);
        roomRightSideWall.rotation.set(0, 0.28, 0);


        const roomLeftSideWall = new THREE.Mesh(
            new THREE.BoxGeometry(1, 200, 200),
            new THREE.MeshStandardMaterial({ map: wallTexture})
        );

        roomLeftSideWall.position.set(-40, 13, -23);
        roomLeftSideWall.rotation.set(0, 0.28, 0);

        const floorTexture = new THREE.TextureLoader().load(parquet);
        floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
        floorTexture.repeat.set( 3, 3 );

        const roomFloor = new THREE.Mesh(
            new THREE.BoxGeometry(100, 1, 100),
            new THREE.MeshStandardMaterial({ map: floorTexture })
        );

        roomFloor.position.set(-15, -6.7, 30);
        roomFloor.rotation.set(0, 0.28, 0);

        scene.add(roomBackWall, roomRightSideWall, roomLeftSideWall, roomFloor);

        // Bed
        loader.load(
            bedModel,
            function ( gltf ) {
                gltf.scene.children[0].scale.set(0.1, 0.1, 0.1);
                gltf.scene.position.set(-22.5, -6.3, -6);
                gltf.scene.rotation.set(0, 0.3, 0);
                scene.add( gltf.scene );
                animate();
            },
        );

        // Cat
        let cat
        loader.load(
            catModel,
            function ( gltf ) {
                gltf.scene.children[0].scale.set(0.25, 0.25, 0.25);
                gltf.scene.position.set(-19.23, -2, 3.15);
                gltf.scene.rotation.set(-0.05, -0.88, 0.06);

                cat = gltf.scene;

                scene.add( gltf.scene );
                animate();
            }
        );

        ModelControls.addEventListener('change', () => {
            // console.log(puff.position, puff.rotation, puff.scale);
        });

    scene.add(ModelControls);

    window.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'w':
                ModelControls.setMode('translate');
                break;
            case 'e':
                ModelControls.setMode('rotate');
                break;
            case 'r':
                ModelControls.setMode('scale');
                break;
        }
    });

    // Camera
    function tweenCamera(camera, position, rotation, duration) {
        new TWEEN.Tween(camera.position).to({
            x: position[0],
            y: position[1],
            z: position[2]
        }, duration)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();

        new TWEEN.Tween(camera.rotation).to({
            x: rotation[0],
            y: rotation[1],
            z: rotation[2]
        }, duration)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();
    }

    function moveCamera(dest) {
        switch (dest) {
            case 'about':
                tweenCamera(
                    camera,
                    [cameraPositions.about.position.x, cameraPositions.about.position.y, cameraPositions.about.position.z],
                    [cameraPositions.about.rotation.x, cameraPositions.about.rotation.y, cameraPositions.about.rotation.z],
                    1000
                );
                break;
            case 'projects':
                tweenCamera(
                    camera,
                    [cameraPositions.projects.position.x, cameraPositions.projects.position.y, cameraPositions.projects.position.z],
                    [cameraPositions.projects.rotation.x, cameraPositions.projects.rotation.y, cameraPositions.projects.rotation.z],
                    1000
                );
                break;
            case 'contacts':
                tweenCamera(
                    camera,
                    [cameraPositions.contacts.position.x, cameraPositions.contacts.position.y, cameraPositions.contacts.position.z],
                    [cameraPositions.contacts.rotation.x, cameraPositions.contacts.rotation.y, cameraPositions.contacts.rotation.z],
                    1000
                );
                break;
            default:
                break;
        }
    }

    document.body.onscroll = moveCamera;
    moveCamera();

    // Helpers
    if (debug) {
        const controls = new OrbitControls(camera, renderer.domElement);
        const screenLightHelper = new THREE.PointLightHelper(screenLight)
        const bedLightHelper = new THREE.PointLightHelper(bedLight)

        scene.add(screenLightHelper, bedLightHelper);
    }

    const stats = Stats();
    document.body.appendChild(stats.dom);

    function animate() {
        requestAnimationFrame( animate );

        particles.forEach(particle => {
            particle.rotation.x += 0.002;
            particle.rotation.y += 0.002;
            particle.rotation.z += 0.002;

            particle.position.x += 0.01;
            particle.position.y += 0.01;
            particle.position.z += 0.01;

            if (particle.position.x > 50 || particle.position.y > 50 || particle.position.z > 50) {
                const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

                particle.position.set(x, y, z);
            }
        });

        TWEEN.update();
        stats.update();
        renderer.render( scene, camera );

        if (debug) {
            console.log(camera.position, camera.rotation);
            // controls.update();
        }
    }

    animate();

/* END THREE JS */

/* TABS */
    function openTab(evt, tabName) {
        let i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById(tabName).style.display = "grid";
        evt.currentTarget.className += " active";

        moveCamera(tabName);
    }

    const tabLinks = document.querySelectorAll(".tablinks");
    tabLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            openTab(e, link.dataset.tab);
        });
    });

    document.getElementById("defaultOpen").click();
/* END TABS */
