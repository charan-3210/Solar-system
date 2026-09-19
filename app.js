import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const canvas = document.getElementById("space");

/* =========================
   RENDERER
========================= */

const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance"
});

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, 1.5)
);

renderer.setSize(
    window.innerWidth,
    window.innerHeight,
    false
);

renderer.setClearColor(0x01030a, 1);

renderer.outputColorSpace = THREE.SRGBColorSpace;


/* =========================
   SCENE
========================= */

const scene = new THREE.Scene();

scene.background =
    new THREE.Color(0x01030a);


/* =========================
   CAMERA
========================= */

const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.01,
    10000
);

camera.position.set(
    0,
    12,
    30
);


/* =========================
   CONTROLS
========================= */

const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;
controls.dampingFactor = 0.06;

controls.enableZoom = true;
controls.enablePan = true;

controls.minDistance = 2;
controls.maxDistance = 5000;

controls.target.set(0, 0, 0);


/* =========================
   LIGHT
========================= */

const ambient =
    new THREE.AmbientLight(
        0xffffff,
        1.5
    );

scene.add(ambient);

const sunLight =
    new THREE.PointLight(
        0xffffff,
        3000,
        1000
    );

sunLight.position.set(
    0,
    0,
    0
);

scene.add(sunLight);


/* =========================
   SUN
========================= */

const sun =
    new THREE.Mesh(
        new THREE.SphereGeometry(
            3,
            32,
            32
        ),
        new THREE.MeshBasicMaterial({
            color: 0xffb52e
        })
    );

scene.add(sun);


/* =========================
   STAR FIELD
========================= */

const starCount =
    window.innerWidth < 700
        ? 2500
        : 6000;

const starPositions =
    new Float32Array(
        starCount * 3
    );

for (let i = 0; i < starCount; i++) {

    const radius =
        150 +
        Math.random() * 1500;

    const theta =
        Math.random() *
        Math.PI * 2;

    const phi =
        Math.acos(
            2 * Math.random() - 1
        );

    starPositions[i * 3] =
        radius *
        Math.sin(phi) *
        Math.cos(theta);

    starPositions[i * 3 + 1] =
        radius *
        Math.cos(phi);

    starPositions[i * 3 + 2] =
        radius *
        Math.sin(phi) *
        Math.sin(theta);
}

const starGeometry =
    new THREE.BufferGeometry();

starGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
        starPositions,
        3
    )
);

const starMaterial =
    new THREE.PointsMaterial({
        color: 0xffffff,
        size:
            window.innerWidth < 700
                ? 1.2
                : 1.5,
        sizeAttenuation: true
    });

const stars =
    new THREE.Points(
        starGeometry,
        starMaterial
    );

scene.add(stars);


/* =========================
   PLANETS
========================= */

const planetData = [
    {
        name: "Mercury",
        radius: 0.35,
        distance: 5,
        color: 0x999999,
        period: 88
    },
    {
        name: "Venus",
        radius: 0.65,
        distance: 7,
        color: 0xd49a55,
        period: 225
    },
    {
        name: "Earth",
        radius: 0.75,
        distance: 9,
        color: 0x247cff,
        period: 365
    },
    {
        name: "Mars",
        radius: 0.55,
        distance: 11,
        color: 0xc94b35,
        period: 687
    },
    {
        name: "Jupiter",
        radius: 2.2,
        distance: 16,
        color: 0xc89a70,
        period: 4333
    },
    {
        name: "Saturn",
        radius: 1.8,
        distance: 23,
        color: 0xd5bd8d,
        period: 10759
    },
    {
        name: "Uranus",
        radius: 1.2,
        distance: 30,
        color: 0x72cddd,
        period: 30687
    },
    {
        name: "Neptune",
        radius: 1.15,
        distance: 37,
        color: 0x4168e5,
        period: 60190
    }
];

const planets = [];


/* =========================
   ORBIT CREATOR
========================= */

function createOrbit(radius) {

    const points = [];

    for (
        let i = 0;
        i <= 128;
        i++
    ) {

        const angle =
            (i / 128) *
            Math.PI *
            2;

        points.push(
            new THREE.Vector3(
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius
            )
        );
    }

    const geometry =
        new THREE.BufferGeometry()
            .setFromPoints(points);

    const material =
        new THREE.LineBasicMaterial({
            color: 0x416080,
            transparent: true,
            opacity: 0.4
        });

    return new THREE.Line(
        geometry,
        material
    );
}


/* =========================
   CREATE PLANETS
========================= */

for (const data of planetData) {

    scene.add(
        createOrbit(
            data.distance
        )
    );

    const planet =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                data.radius,
                24,
                24
            ),
            new THREE.MeshStandardMaterial({
                color: data.color,
                roughness: 0.8
            })
        );

    planet.userData = data;

    scene.add(planet);

    planets.push({
        mesh: planet,
        data
    });

    /* Saturn ring */

    if (data.name === "Saturn") {

        const ring =
            new THREE.Mesh(
                new THREE.RingGeometry(
                    2.5,
                    4,
                    64
                ),
                new THREE.MeshBasicMaterial({
                    color: 0xb9a77e,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.7
                })
            );

        ring.rotation.x =
            Math.PI / 2;

        planet.add(ring);
    }
}


/* =========================
   POSITION PLANETS
========================= */

function updatePlanets() {

    const now =
        Date.now();

    const days =
        now /
        86400000;

    for (const planet of planets) {

        const data =
            planet.data;

        const angle =
            (days / data.period) *
            Math.PI *
            2;

        planet.mesh.position.set(
            Math.cos(angle) *
                data.distance,

            0,

            Math.sin(angle) *
                data.distance
        );
    }
}

updatePlanets();


/* =========================
   GALAXY
========================= */

function createGalaxy(
    x,
    y,
    z,
    size
) {

    const geometry =
        new THREE.BufferGeometry();

    const count = 900;

    const positions =
        new Float32Array(
            count * 3
        );

    for (let i = 0; i < count; i++) {

        const angle =
            Math.random() *
            Math.PI *
            2;

        const radius =
            Math.pow(
                Math.random(),
                0.65
            ) * size;

        positions[i * 3] =
            Math.cos(angle) *
            radius;

        positions[i * 3 + 1] =
            (Math.random() - 0.5) *
            size *
            0.15;

        positions[i * 3 + 2] =
            Math.sin(angle) *
            radius;
    }

    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            positions,
            3
        )
    );

    const material =
        new THREE.PointsMaterial({
            color: 0x9cbcff,
            size: 0.12,
            transparent: true,
            opacity: 0.75
        });

    const galaxy =
        new THREE.Points(
            geometry,
            material
        );

    galaxy.position.set(
        x,
        y,
        z
    );

    scene.add(galaxy);
}


/* Deep-space galaxies are delayed */

setTimeout(() => {

    createGalaxy(
        250,
        80,
        -200,
        35
    );

    createGalaxy(
        -350,
        -100,
        -300,
        45
    );

    createGalaxy(
        500,
        180,
        -500,
        30
    );

}, 1200);


/* =========================
   RESIZE
========================= */

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight,
            false
        );
    }
);


/* =========================
   RENDER
========================= */

function animate() {

    requestAnimationFrame(
        animate
    );

    controls.update();

    stars.rotation.y +=
        0.00003;

    sun.rotation.y +=
        0.001;

    renderer.render(
        scene,
        camera
    );
}

animate();


/* =========================
   STATUS
========================= */

const statusText =
    document.getElementById(
        "statusText"
    );

if (statusText) {

    statusText.textContent =
        "3D ENGINE ONLINE";
}
