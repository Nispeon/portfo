import './style.css'
import * as THREE from 'three'


/* THREE JS */
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xD7EAA2);

    const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );

    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#bg'),
    });

    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    // camera.position.setZ(30);
    // camera.position.setX(-3);
    renderer.render( scene, camera );

    // Lights

    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    function addAmbientParticle() {
        const geometry = new THREE.SphereGeometry(0.10, 24, 24);
        const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const star = new THREE.Mesh(geometry, material);

        const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

        star.position.set(x, y, z);
        scene.add(star);
    }

    Array(200).fill().forEach(addAmbientParticle);

    function moveCamera() {
        const t = document.body.getBoundingClientRect().top;

        // camera.position.z = t * -0.01;
        // camera.position.x = t * -0.0002;
        // camera.position.y = t * -0.0002;
    }

    document.body.onscroll = moveCamera;
    moveCamera();

    function animate() {
        requestAnimationFrame( animate );

        // torus.rotation.x += 0.01;
        // torus.rotation.y += 0.005;
        // torus.rotation.z += 0.01;
        //
        // moon.rotation.x += 0.005;


        renderer.render( scene, camera );
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
