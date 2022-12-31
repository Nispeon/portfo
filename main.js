import './style.css'
import officeModel from './assets/models/office/scene.gltf?url';
import parquet from './assets/textures/parquet.png?url';

import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const debug = false;

/* THREE JS */

    window.addEventListener('resize', () => {
        window.location.reload();
    });

    const cameraPositions = {
        'about': {
            'position': {
                x: -3,
                y: 3,
                z: 2
            },
            'rotation': {
                x: 0,
                y: -0.3,
                z: 0
            }
        },
        'projects': {
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
        'contact': {
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
    camera.position.x = cameraPositions.about.position.x;
    camera.position.y = cameraPositions.about.position.y;
    camera.position.z = cameraPositions.about.position.z;

    camera.rotation.x = cameraPositions.about.rotation.x;
    camera.rotation.y = cameraPositions.about.rotation.y;
    camera.rotation.z = cameraPositions.about.rotation.z;

    if (debug) {
        camera.position.x = cameraPositions.build.position.x;
        camera.position.y = cameraPositions.build.position.y;
        camera.position.z = cameraPositions.build.position.z;
        camera.rotation.x = cameraPositions.build.rotation.x;
        camera.rotation.y = cameraPositions.build.rotation.y;
        camera.rotation.z = cameraPositions.build.rotation.z;
    }


    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#bg'),
    });

    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.render( scene, camera );

    // Lights
    // const ambientLight = new THREE.AmbientLight(0xffffff);
    // scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(4, 3, -20);
    scene.add(pointLight);

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

    // Models
    const loader = new GLTFLoader();
        // Office
        loader.load(
            officeModel,
            function ( gltf ) {
                // make model smaller
                gltf.scene.children[0].scale.set(0.1, 0.1, 0.1);
                gltf.scene.position.set(5, -5, -20);
                gltf.scene.rotation.set(0, 5, 0);
                scene.add( gltf.scene );
                animate();
            }, undefined, function ( error ) {
                console.error( error );
            }
        );

        const officeBackWall = new THREE.Mesh(
            new THREE.BoxGeometry(40, 40, 1),
            new THREE.MeshStandardMaterial({ color: 0x083056 })
        );

        officeBackWall.position.set(-3, 13, -23);
        officeBackWall.rotation.set(0, 0.28, 0);

        const officeSideWall = new THREE.Mesh(
            new THREE.BoxGeometry(1, 40, 50),
            new THREE.MeshStandardMaterial({ color: 0x083056 })
        );

        officeSideWall.position.set(13, 13, -23);
        officeSideWall.rotation.set(0, 0.28, 0);

        const floorTexture = new THREE.TextureLoader().load(parquet);
        floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
        floorTexture.repeat.set( 3, 3 );

        const officeFloor = new THREE.Mesh(
            new THREE.BoxGeometry(50, 1, 50),
            new THREE.MeshStandardMaterial({ map: floorTexture })
        );

        officeFloor.position.set(3, -6.7, -20);
        officeFloor.rotation.set(0, 0.28, 0);

        scene.add(officeBackWall, officeSideWall, officeFloor);

    function moveCamera() {
        const t = document.body.getBoundingClientRect().top;

        // camera.position.z = t * -0.01;
        // camera.position.x = t * -0.0002;
        // camera.position.y = t * -0.0002;
    }

    document.body.onscroll = moveCamera;
    moveCamera();

    // Helpers

    if (debug) {
        const controls = new OrbitControls(camera, renderer.domElement);
        const lightHelper = new THREE.PointLightHelper(pointLight)

        scene.add(lightHelper);
    }

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
        document.getElementById(tabName).style.display = "block";
        evt.currentTarget.className += " active";
    }

    const tabLinks = document.querySelectorAll(".tablinks");
    tabLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            openTab(e, link.dataset.tab);
        });
    });

    document.getElementById("defaultOpen").click();
/* END TABS */
