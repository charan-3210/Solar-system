import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.186.0/build/three.module.js";

import { OrbitControls } from
"https://cdn.jsdelivr.net/npm/three@0.186.0/examples/jsm/controls/OrbitControls.js";


/* ============================================================
   COSMOS — FAST START ENGINE
============================================================ */


/* ============================================================
   DEVICE
============================================================ */

const isMobile =
  /Android|iPhone|iPad|iPod/i
    .test(navigator.userAgent);


/* ============================================================
   RENDERER
============================================================ */

const renderer =
  new THREE.WebGLRenderer({

    antialias:
      !isMobile,

    powerPreference:
      "high-performance",

    logarithmicDepthBuffer:
      true

  });


renderer.setPixelRatio(
  Math.min(
    window.devicePixelRatio || 1,
    isMobile ? 1.25 : 1.6
  )
);

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

renderer.outputColorSpace =
  THREE.SRGBColorSpace;

renderer.toneMapping =
  THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure =
  1.15;

document
  .getElementById("app")
  .appendChild(
    renderer.domElement
  );


/* ============================================================
   SCENE
============================================================ */

const scene =
  new THREE.Scene();

scene.background =
  new THREE.Color(
    0x000104
  );


/* ============================================================
   CAMERA
============================================================ */

const camera =
  new THREE.PerspectiveCamera(
    55,
    window.innerWidth /
      window.innerHeight,
    .01,
    150000
  );

camera.position.set(
  0,
  900,
  4200
);


/* ============================================================
   CONTROLS
============================================================ */

const controls =
  new OrbitControls(
    camera,
    renderer.domElement
  );

controls.enableDamping =
  true;

controls.dampingFactor =
  .065;

controls.rotateSpeed =
  .5;

controls.zoomSpeed =
  .85;

controls.panSpeed =
  .55;

controls.enablePan =
  true;

controls.screenSpacePanning =
  true;

controls.minDistance =
  .2;

controls.maxDistance =
  100000;

controls.target.set(
  0,
  0,
  0
);


/* ============================================================
   BASIC HELPERS
============================================================ */

function random(
  min,
  max
) {
  return min +
    Math.random() *
    (max - min);
}

function clamp(
  value,
  min,
  max
) {
  return Math.max(
    min,
    Math.min(max, value)
  );
}


/* ============================================================
   FAST STAR FIELD
============================================================ */

function createStars() {

  const count =
    isMobile
      ? 6500
      : 14000;

  const positions =
    new Float32Array(
      count * 3
    );

  const colors =
    new Float32Array(
      count * 3
    );

  const starColor =
    new THREE.Color();

  for (
    let i = 0;
    i < count;
    i++
  ) {

    const radius =
      9000 *
      Math.pow(
        Math.random(),
        .42
      );

    const theta =
      Math.random() *
      Math.PI * 2;

    const phi =
      Math.acos(
        random(-1, 1)
      );

    positions[i * 3] =
      radius *
      Math.sin(phi) *
      Math.cos(theta);

    positions[i * 3 + 1] =
      radius *
      Math.cos(phi);

    positions[i * 3 + 2] =
      radius *
      Math.sin(phi) *
      Math.sin(theta);


    const temperature =
      Math.random();

    if (
      temperature < .15
    ) {

      starColor.setRGB(
        1,
        .72,
        .5
      );

    } else if (
      temperature < .45
    ) {

      starColor.setRGB(
        1,
        .9,
        .72
      );

    } else if (
      temperature < .82
    ) {

      starColor.setRGB(
        .78,
        .88,
        1
      );

    } else {

      starColor.setRGB(
        .55,
        .7,
        1
      );

    }

    colors[i * 3] =
      starColor.r;

    colors[i * 3 + 1] =
      starColor.g;

    colors[i * 3 + 2] =
      starColor.b;
  }


  const geometry =
    new THREE.BufferGeometry();

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
      positions,
      3
    )
  );

  geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(
      colors,
      3
    )
  );


  const material =
    new THREE.PointsMaterial({

      size:
        isMobile
          ? 1.15
          : 1.4,

      vertexColors:
        true,

      transparent:
        true,

      opacity:
        .78,

      depthWrite:
        false,

      blending:
        THREE.AdditiveBlending

    });


  const points =
    new THREE.Points(
      geometry,
      material
    );

  scene.add(
    points
  );

  return points;
}


/*
  IMPORTANT:
  Stars are created immediately.
*/

const stars =
  createStars();


/* ============================================================
   GLOW TEXTURE
============================================================ */

function createGlowTexture() {

  const canvas =
    document.createElement(
      "canvas"
    );

  canvas.width =
    256;

  canvas.height =
    256;

  const ctx =
    canvas.getContext(
      "2d"
    );

  const gradient =
    ctx.createRadialGradient(
      128,
      128,
      0,
      128,
      128,
      128
    );

  gradient.addColorStop(
    0,
    "rgba(255,255,255,1)"
  );

  gradient.addColorStop(
    .08,
    "rgba(255,255,255,.95)"
  );

  gradient.addColorStop(
    .25,
    "rgba(180,210,255,.5)"
  );

  gradient.addColorStop(
    .55,
    "rgba(80,130,255,.1)"
  );

  gradient.addColorStop(
    1,
    "rgba(0,0,0,0)"
  );

  ctx.fillStyle =
    gradient;

  ctx.fillRect(
    0,
    0,
    256,
    256
  );

  return new THREE.CanvasTexture(
    canvas
  );
}


const glowTexture =
  createGlowTexture();


/* ============================================================
   GALAXY TEXTURES
   ONLY FOUR ARE CREATED.
   They are reused for all galaxies.
============================================================ */

const galaxyTextureCache =
  new Map();


function createGalaxyTexture(
  style
) {

  if (
    galaxyTextureCache.has(
      style
    )
  ) {

    return galaxyTextureCache.get(
      style
    );

  }


  const size =
    isMobile
      ? 384
      : 512;

  const canvas =
    document.createElement(
      "canvas"
    );

  canvas.width =
    size;

  canvas.height =
    size;

  const ctx =
    canvas.getContext(
      "2d"
    );

  const cx =
    size / 2;

  const cy =
    size / 2;


  /* Soft outer glow */

  const glow =
    ctx.createRadialGradient(
      cx,
      cy,
      0,
      cx,
      cy,
      size * .48
    );

  glow.addColorStop(
    0,
    "rgba(230,240,255,.75)"
  );

  glow.addColorStop(
    .15,
    "rgba(180,210,255,.35)"
  );

  glow.addColorStop(
    .4,
    "rgba(100,150,255,.09)"
  );

  glow.addColorStop(
    1,
    "rgba(0,0,0,0)"
  );

  ctx.fillStyle =
    glow;

  ctx.fillRect(
    0,
    0,
    size,
    size
  );


  if (
    style ===
    "elliptical"
  ) {

    const core =
      ctx.createRadialGradient(
        cx,
        cy,
        0,
        cx,
        cy,
        size * .4
      );

    core.addColorStop(
      0,
      "rgba(255,250,230,1)"
    );

    core.addColorStop(
      .2,
      "rgba(255,220,175,.72)"
    );

    core.addColorStop(
      .5,
      "rgba(220,190,150,.2)"
    );

    core.addColorStop(
      1,
      "rgba(0,0,0,0)"
    );

    ctx.fillStyle =
      core;

    ctx.beginPath();

    ctx.ellipse(
      cx,
      cy,
      size * .4,
      size * .22,
      0,
      0,
      Math.PI * 2
    );

    ctx.fill();

  } else {

    const arms =
      style ===
      "barred"
        ? 2
        : 4;


    for (
      let arm = 0;
      arm < arms;
      arm++
    ) {

      ctx.beginPath();

      const offset =
        arm /
        arms *
        Math.PI * 2;

      for (
        let t = 0;
        t < Math.PI * 4.5;
        t += .025
      ) {

        const r =
          t /
          (Math.PI * 4.5) *
          size *
          .42;

        const angle =
          t * 1.65 +
          offset;

        const x =
          cx +
          Math.cos(angle) *
          r;

        const y =
          cy +
          Math.sin(angle) *
          r *
          .46;

        if (
          t === 0
        ) {
          ctx.moveTo(
            x,
            y
          );
        } else {
          ctx.lineTo(
            x,
            y
          );
        }

      }

      ctx.strokeStyle =
        style === "irregular"
          ? "rgba(190,190,255,.18)"
          : "rgba(190,215,255,.3)";

      ctx.lineWidth =
        size * .025;

      ctx.shadowBlur =
        18;

      ctx.shadowColor =
        "rgba(130,180,255,.8)";

      ctx.stroke();

    }


    /* Central bulge */

    const core =
      ctx.createRadialGradient(
        cx,
        cy,
        0,
        cx,
        cy,
        size * .18
      );

    core.addColorStop(
      0,
      "rgba(255,255,245,1)"
    );

    core.addColorStop(
      .2,
      "rgba(255,230,190,.85)"
    );

    core.addColorStop(
      .55,
      "rgba(255,210,160,.15)"
    );

    core.addColorStop(
      1,
      "rgba(0,0,0,0)"
    );

    ctx.fillStyle =
      core;

    ctx.beginPath();

    ctx.arc(
      cx,
      cy,
      size * .19,
      0,
      Math.PI * 2
    );

    ctx.fill();

  }


  const texture =
    new THREE.CanvasTexture(
      canvas
    );

  texture.colorSpace =
    THREE.SRGBColorSpace;

  texture.minFilter =
    THREE.LinearFilter;

  texture.magFilter =
    THREE.LinearFilter;

  galaxyTextureCache.set(
    style,
    texture
  );

  return texture;
}


/* ============================================================
   GALAXY DATA
============================================================ */

const GALAXIES = [

  ["Milky Way",
   "Barred Spiral Galaxy",
   "The galaxy containing our Solar System.",
   [0,0,0],
   180,
   "barred"],

  ["Andromeda Galaxy (M31)",
   "Spiral Galaxy",
   "A large spiral galaxy in the Local Group.",
   [650,120,-250],
   130,
   "spiral"],

  ["Triangulum Galaxy (M33)",
   "Spiral Galaxy",
   "A spiral galaxy and member of the Local Group.",
   [-500,-80,-380],
   85,
   "spiral"],

  ["Large Magellanic Cloud",
   "Irregular Galaxy",
   "An irregular satellite galaxy of the Milky Way.",
   [340,-220,390],
   52,
   "irregular"],

  ["Small Magellanic Cloud",
   "Dwarf Irregular Galaxy",
   "A dwarf irregular galaxy associated with the Milky Way.",
   [430,-270,470],
   38,
   "irregular"],

  ["Whirlpool Galaxy (M51)",
   "Spiral Galaxy",
   "An interacting spiral galaxy system.",
   [-900,350,-650],
   105,
   "spiral"],

  ["Sombrero Galaxy (M104)",
   "Spiral Galaxy",
   "A galaxy known for its bright bulge and prominent dust lane.",
   [1000,-350,-850],
   95,
   "spiral"],

  ["Pinwheel Galaxy (M101)",
   "Spiral Galaxy",
   "A large asymmetric spiral galaxy.",
   [-1000,520,380],
   125,
   "spiral"],

  ["Bode's Galaxy (M81)",
   "Spiral Galaxy",
   "A grand-design spiral galaxy in Ursa Major.",
   [900,600,550],
   90,
   "spiral"],

  ["Cigar Galaxy (M82)",
   "Starburst Galaxy",
   "An actively star-forming galaxy near M81.",
   [850,670,600],
   58,
   "irregular"],

  ["Black Eye Galaxy (M64)",
   "Spiral Galaxy",
   "A spiral galaxy with a prominent dark dust feature.",
   [-1250,-420,-150],
   78,
   "spiral"],

  ["Sunflower Galaxy (M63)",
   "Spiral Galaxy",
   "A flocculent spiral galaxy.",
   [1250,260,-400],
   84,
   "spiral"],

  ["Southern Pinwheel Galaxy (M83)",
   "Barred Spiral Galaxy",
   "A prominent barred spiral galaxy.",
   [-720,-650,700],
   94,
   "barred"],

  ["Centaurus A",
   "Peculiar Galaxy",
   "A nearby galaxy with a prominent dust lane.",
   [680,-780,820],
   82,
   "irregular"],

  ["Sculptor Galaxy (NGC 253)",
   "Spiral Galaxy",
   "A nearby star-forming spiral galaxy.",
   [-1200,-600,850],
   92,
   "spiral"],

  ["Messier 87",
   "Giant Elliptical Galaxy",
   "A giant elliptical galaxy associated with the Virgo Cluster.",
   [1550,650,-900],
   130,
   "elliptical"],

  ["Messier 49",
   "Elliptical Galaxy",
   "A giant elliptical galaxy in the Virgo Cluster.",
   [1660,760,-980],
   92,
   "elliptical"],

  ["Messier 60",
   "Elliptical Galaxy",
   "A giant elliptical galaxy in the Virgo Cluster region.",
   [1730,700,-820],
   80,
   "elliptical"],

  ["NGC 1300",
   "Barred Spiral Galaxy",
   "A well-studied barred spiral galaxy.",
   [-1700,220,-760],
   92,
   "barred"],

  ["NGC 1365",
   "Barred Spiral Galaxy",
   "A large barred spiral galaxy.",
   [1850,-330,820],
   112,
   "barred"],

  ["NGC 4038",
   "Interacting Galaxy",
   "One of the major galaxies in the Antennae system.",
   [-1850,700,920],
   65,
   "irregular"],

  ["NGC 4039",
   "Interacting Galaxy",
   "The second major galaxy in the Antennae system.",
   [-1780,735,960],
   62,
   "irregular"],

  ["NGC 6744",
   "Spiral Galaxy",
   "A large nearby spiral galaxy.",
   [1800,920,160],
   125,
   "spiral"],

  ["NGC 4258",
   "Spiral Galaxy",
   "A nearby spiral galaxy known for its warped disk.",
   [-1600,-850,-430],
   96,
   "spiral"]

];


/* ============================================================
   GALAXY CREATION
============================================================ */

const galaxyObjects = [];


function createGalaxy(
  data
) {

  const [
    name,
    type,
    description,
    position,
    radius,
    style
  ] = data;


  const group =
    new THREE.Group();

  group.position.set(
    ...position
  );


  group.rotation.z =
    random(
      0,
      Math.PI * 2
    );


  group.rotation.x =
    random(
      -.7,
      .7
    );


  /*
    REUSED texture.
    This is the major startup optimization.
  */

  const texture =
    createGalaxyTexture(
      style
    );


  const sprite =
    new THREE.Sprite(

      new THREE.SpriteMaterial({

        map:
          texture,

        transparent:
          true,

        opacity:
          .94,

        depthWrite:
          false,

        blending:
          THREE.AdditiveBlending

      })

    );


  sprite.scale.set(
    radius * 2.25,
    radius * 2.25,
    1
  );


  group.add(
    sprite
  );


  /*
    Small 3D star cloud.
    Kept intentionally lightweight.
  */

  const count =
    isMobile
      ? 45
      : 90;

  const positions =
    new Float32Array(
      count * 3
    );


  for (
    let i = 0;
    i < count;
    i++
  ) {

    const a =
      random(
        0,
        Math.PI * 2
      );

    const r =
      radius *
      Math.pow(
        Math.random(),
        .6
      );

    positions[i * 3] =
      Math.cos(a) *
      r;

    positions[i * 3 + 1] =
      random(
        -radius * .08,
        radius * .08
      );

    positions[i * 3 + 2] =
      Math.sin(a) *
      r;

  }


  const geometry =
    new THREE.BufferGeometry();

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
      positions,
      3
    )
  );


  const particles =
    new THREE.Points(

      geometry,

      new THREE.PointsMaterial({

        color:
          0xcbdcff,

        size:
          isMobile
            ? 1
            : 1.3,

        transparent:
          true,

        opacity:
          .45,

        depthWrite:
          false,

        blending:
          THREE.AdditiveBlending

      })

    );


  group.add(
    particles
  );


  /*
    Core.
  */

  const core =
    new THREE.Sprite(

      new THREE.SpriteMaterial({

        map:
          glowTexture,

        color:
          0xffd9aa,

        transparent:
          true,

        opacity:
          .7,

        depthWrite:
          false,

        blending:
          THREE.AdditiveBlending

      })

    );


  core.scale.set(
    radius * .65,
    radius * .65,
    1
  );


  group.add(
    core
  );


  scene.add(
    group
  );


  const object = {

    name,

    type,

    description,

    status:
      "CATALOGUED",

    group,

    sprite,

    particles,

    radius

  };


  galaxyObjects.push(
    object
  );


  return object;
}


/* ============================================================
   PROGRESSIVE GALAXY LOADING
============================================================ */

let galaxyIndex =
  0;


function loadGalaxiesProgressively() {

  const start =
    performance.now();


  /*
    Add only a few per frame.
  */

  while (
    galaxyIndex <
      GALAXIES.length &&

    performance.now() -
      start <
      7
  ) {

    createGalaxy(
      GALAXIES[
        galaxyIndex
      ]
    );

    galaxyIndex++;

  }


  if (
    galaxyIndex <
      GALAXIES.length
  ) {

    requestAnimationFrame(
      loadGalaxiesProgressively
    );

  } else {

    loadDeepField();

  }
}


/*
  Start galaxy loading AFTER
  the first render has happened.
*/

requestAnimationFrame(
  () => {

    requestAnimationFrame(
      loadGalaxiesProgressively
    );

  }
);


/* ============================================================
   DEEP FIELD
============================================================ */

let deepFieldStarted =
  false;

let deepCount =
  0;

const deepGroup =
  new THREE.Group();

scene.add(
  deepGroup
);


function createDeepGalaxy() {

  const direction =
    new THREE.Vector3(
      random(-1,1),
      random(-1,1),
      random(-1,1)
    ).normalize();


  const distance =
    random(
      4500,
      18000
    );


  const position =
    direction.multiplyScalar(
      distance
    );


  const size =
    random(
      12,
      42
    );


  const styles = [
    "spiral",
    "barred",
    "elliptical",
    "irregular"
  ];


  const style =
    styles[
      Math.floor(
        Math.random() *
        styles.length
      )
    ];


  const sprite =
    new THREE.Sprite(

      new THREE.SpriteMaterial({

        map:
          createGalaxyTexture(
            style
          ),

        transparent:
          true,

        opacity:
          random(
            .35,
            .7
          ),

        depthWrite:
          false,

        blending:
          THREE.AdditiveBlending

      })

    );


  sprite.position.copy(
    position
  );


  sprite.scale.set(
    size * 2,
    size * 2,
    1
  );


  deepGroup.add(
    sprite
  );
}


function loadDeepField() {

  if (
    deepFieldStarted
  ) {
    return;
  }

  deepFieldStarted =
    true;


  const target =
    isMobile
      ? 100
      : 220;


  function batch() {

    const end =
      Math.min(
        deepCount + 10,
        target
      );


    while (
      deepCount <
      end
    ) {

      createDeepGalaxy();

      deepCount++;

    }


    if (
      deepCount <
      target
    ) {

      requestAnimationFrame(
        batch
      );

    }

  }


  requestAnimationFrame(
    batch
  );
}


/* ============================================================
   SOLAR SYSTEM
============================================================ */

const solarSystem =
  new THREE.Group();

scene.add(
  solarSystem
);


/* ============================================================
   SUN
============================================================ */

const sun =
  new THREE.Mesh(

    new THREE.SphereGeometry(
      10,
      32,
      32
    ),

    new THREE.MeshBasicMaterial({
      color:
        0xffd267
    })

  );


solarSystem.add(
  sun
);


const sunGlow =
  new THREE.Sprite(

    new THREE.SpriteMaterial({

      map:
        glowTexture,

      color:
        0xffa927,

      transparent:
        true,

      opacity:
        .85,

      depthWrite:
        false,

      blending:
        THREE.AdditiveBlending

    })

  );


sunGlow.scale.set(
  70,
  70,
  1
);


solarSystem.add(
  sunGlow
);


/* ============================================================
   PLANETS
============================================================ */

const PLANETS = [

  {
    name: "Mercury",
    radius: 1.3,
    distance: 18,
    period: 87.969,
    color: 0x9c9288
  },

  {
    name: "Venus",
    radius: 2,
    distance: 27,
    period: 224.701,
    color: 0xd6b477
  },

  {
    name: "Earth",
    radius: 2.2,
    distance: 38,
    period: 365.256,
    color: 0x3980ce
  },

  {
    name: "Mars",
    radius: 1.7,
    distance: 50,
    period: 686.98,
    color: 0xb75e45
  },

  {
    name: "Jupiter",
    radius: 6.5,
    distance: 78,
    period: 4332.59,
    color: 0xd0aa80
  },

  {
    name: "Saturn",
    radius: 5.7,
    distance: 108,
    period: 10759.22,
    color: 0xd8c28d,
    rings: true
  },

  {
    name: "Uranus",
    radius: 4,
    distance: 137,
    period: 30688.5,
    color: 0x8acfd5
  },

  {
    name: "Neptune",
    radius: 3.9,
    distance: 166,
    period: 60182,
    color: 0x416ac6
  }

];


const planetObjects = [];


/* ============================================================
   ORBIT
============================================================ */

function createOrbit(
  radius
) {

  const points = [];

  for (
    let i = 0;
    i <= 96;
    i++
  ) {

    const angle =
      i /
      96 *
      Math.PI *
      2;

    points.push(

      new THREE.Vector3(

        Math.cos(angle) *
          radius,

        0,

        Math.sin(angle) *
          radius

      )

    );

  }


  const geometry =
    new THREE.BufferGeometry()
      .setFromPoints(
        points
      );


  const material =
    new THREE.LineBasicMaterial({

      color:
        0x58677f,

      transparent:
        true,

      opacity:
        .2

    });


  return new THREE.Line(
    geometry,
    material
  );
}


/* ============================================================
   CREATE PLANETS
============================================================ */

PLANETS.forEach(
  (
    planet,
    index
  ) => {

    solarSystem.add(
      createOrbit(
        planet.distance
      )
    );


    const mesh =
      new THREE.Mesh(

        new THREE.SphereGeometry(
          planet.radius,
          24,
          24
        ),

        new THREE.MeshStandardMaterial({

          color:
            planet.color,

          roughness:
            .85,

          metalness:
            .02

        })

      );


    solarSystem.add(
      mesh
    );


    if (
      planet.rings
    ) {

      const ring =
        new THREE.Mesh(

          new THREE.RingGeometry(
            planet.radius * 1.3,
            planet.radius * 2.15,
            64
          ),

          new THREE.MeshBasicMaterial({

            color:
              0xc5b17f,

            transparent:
              true,

            opacity:
              .65,

            side:
              THREE.DoubleSide

          })

        );


      ring.rotation.x =
        Math.PI / 2;


      mesh.add(
        ring
      );

    }


    if (
      planet.name ===
      "Earth"
    ) {

      const atmosphere =
        new THREE.Mesh(

          new THREE.SphereGeometry(
            planet.radius * 1.08,
            20,
            20
          ),

          new THREE.MeshBasicMaterial({

            color:
              0x4da4ff,

            transparent:
              true,

            opacity:
              .12,

            side:
              THREE.BackSide,

            blending:
              THREE.AdditiveBlending

          })

        );


      mesh.add(
        atmosphere
      );

    }


    planetObjects.push({

      ...planet,

      mesh,

      index

    });

  }
);


/* ============================================================
   ASTEROIDS
============================================================ */

function createAsteroids() {

  const count =
    isMobile
      ? 1000
      : 2400;


  const positions =
    new Float32Array(
      count * 3
    );


  for (
    let i = 0;
    i < count;
    i++
  ) {

    const angle =
      random(
        0,
        Math.PI * 2
      );


    const radius =
      random(
        59,
        70
      );


    positions[i * 3] =
      Math.cos(angle) *
      radius;

    positions[i * 3 + 1] =
      random(-2,2);

    positions[i * 3 + 2] =
      Math.sin(angle) *
      radius;

  }


  const geometry =
    new THREE.BufferGeometry();


  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
      positions,
      3
    )
  );


  const material =
    new THREE.PointsMaterial({

      color:
        0xa29380,

      size:
        .3,

      transparent:
        true,

      opacity:
        .5,

      depthWrite:
        false

    });


  solarSystem.add(

    new THREE.Points(
      geometry,
      material
    )

  );

}


createAsteroids();


/* ============================================================
   LIGHT
============================================================ */

scene.add(
  new THREE.AmbientLight(
    0x7b8da5,
    .18
  )
);


const sunLight =
  new THREE.PointLight(
    0xffffff,
    3,
    700
  );


solarSystem.add(
  sunLight
);


/* ============================================================
   TIME ENGINE
============================================================ */

const J2000 =
  Date.UTC(
    2000,
    0,
    1,
    12
  );


let selectedDate =
  new Date();


let presentMode =
  true;


function daysFromJ2000(
  date
) {

  return (
    date.getTime() -
    J2000
  ) /
  86400000;

}


function updatePlanets() {

  const days =
    daysFromJ2000(
      selectedDate
    );


  planetObjects.forEach(
    planet => {

      const angle =
        days /
        planet.period *
        Math.PI *
        2
        +
        planet.index *
        .72;


      planet.mesh.position.x =
        Math.cos(angle) *
        planet.distance;


      planet.mesh.position.z =
        Math.sin(angle) *
        planet.distance;

    }
  );
}


/* ============================================================
   SCALE
============================================================ */

const slider =
  document.getElementById(
    "scaleSlider"
  );

const scaleText =
  document.getElementById(
    "scaleText"
  );


const SCALE_NAMES = [

  "DEEP UNIVERSE",

  "GALAXY FIELD",

  "LOCAL GROUP",

  "MILKY WAY",

  "PLANETARY SYSTEMS",

  "SOLAR SYSTEM",

  "EARTH",

  "CONTINENT",

  "CITY",

  "STREET"

];


let scaleTarget =
  4200;


function updateScale() {

  const value =
    Number(
      slider.value
    );


  const index =
    Math.round(
      value /
      100 *
      (SCALE_NAMES.length - 1)
    );


  scaleText.textContent =
    SCALE_NAMES[
      clamp(
        index,
        0,
        SCALE_NAMES.length - 1
      )
    ];


  const far =
    18000;

  const near =
    .8;


  const t =
    value /
    100;


  scaleTarget =
    Math.exp(

      Math.log(far) *
        (1 - t)

      +

      Math.log(near) *
        t

    );

}


slider.addEventListener(
  "input",
  updateScale
);


/* ============================================================
   SEARCH
============================================================ */

const searchPanel =
  document.getElementById(
    "searchPanel"
  );

const searchInput =
  document.getElementById(
    "searchInput"
  );

const searchResults =
  document.getElementById(
    "searchResults"
  );


document
  .getElementById(
    "searchBtn"
  )
  .addEventListener(
    "click",
    () => {

      searchPanel.classList.toggle(
        "hidden"
      );

      if (
        !searchPanel.classList.contains(
          "hidden"
        )
      ) {

        setTimeout(
          () =>
            searchInput.focus(),
          80
        );

      }

    }
  );


function performSearch() {

  const query =
    searchInput.value
      .trim()
      .toLowerCase();


  searchResults.innerHTML =
    "";


  if (!query) {
    return;
  }


  const results =
    galaxyObjects.filter(
      object =>

        object.name
          .toLowerCase()
          .includes(query)

        ||

        object.type
          .toLowerCase()
          .includes(query)

    );


  if (
    !results.length
  ) {

    searchResults.innerHTML =
      `
      <div class="search-result">

        <div class="result-name">
          No matching object
        </div>

        <div class="result-type">
          TRY ANOTHER SEARCH
        </div>

      </div>
      `;

    return;
  }


  results
    .slice(0,15)
    .forEach(
      object => {

        const row =
          document.createElement(
            "div"
          );


        row.className =
          "search-result";


        row.innerHTML =
          `
          <div class="result-name">
            ${object.name}
          </div>

          <div class="result-type">
            ${object.type}
          </div>
          `;


        row.onclick =
          () => {

            showObject(
              object
            );

            searchPanel.classList.add(
              "hidden"
            );

          };


        searchResults.appendChild(
          row
        );

      }
    );
}


document
  .getElementById(
    "searchGo"
  )
  .addEventListener(
    "click",
    performSearch
  );


searchInput.addEventListener(
  "keydown",
  event => {

    if (
      event.key ===
      "Enter"
    ) {

      performSearch();

    }

  }
);


/* ============================================================
   OBJECT PANEL
============================================================ */

const objectPanel =
  document.getElementById(
    "objectPanel"
  );


function showObject(
  object
) {

  document
    .getElementById(
      "objectName"
    )
    .textContent =
      object.name;


  document
    .getElementById(
      "objectDescription"
    )
    .textContent =
      object.description;


  document
    .getElementById(
      "objectType"
    )
    .textContent =
      object.type;


  document
    .getElementById(
      "objectStatus"
    )
    .textContent =
      object.status;


  objectPanel.classList.remove(
    "hidden"
  );


  focusObject(
    object.group
  );
}


function focusObject(
  object
) {

  const position =
    new THREE.Vector3();


  object.getWorldPosition(
    position
  );


  controls.target.copy(
    position
  );


  const direction =
    camera.position
      .clone()
      .sub(position)
      .normalize();


  camera.position.copy(

    position.clone().add(

      direction.multiplyScalar(
        300
      )

    )

  );

}


document
  .getElementById(
    "closeObject"
  )
  .addEventListener(
    "click",
    () => {

      objectPanel.classList.add(
        "hidden"
      );

    }
  );


/* ============================================================
   GALAXY CLICK
============================================================ */

const raycaster =
  new THREE.Raycaster();


const pointer =
  new THREE.Vector2();


let pointerX =
  0;

let pointerY =
  0;


renderer.domElement.addEventListener(
  "pointerdown",
  event => {

    pointerX =
      event.clientX;

    pointerY =
      event.clientY;

  }
);


renderer.domElement.addEventListener(
  "pointerup",
  event => {

    const movement =
      Math.hypot(
        event.clientX -
          pointerX,

        event.clientY -
          pointerY
      );


    if (
      movement > 8
    ) {
      return;
    }


    const rect =
      renderer.domElement
        .getBoundingClientRect();


    pointer.x =
      (
        event.clientX -
        rect.left
      ) /
      rect.width *
      2 -
      1;


    pointer.y =
      -(
        (
          event.clientY -
          rect.top
        ) /
        rect.height
      ) *
      2 +
      1;


    raycaster.setFromCamera(
      pointer,
      camera
    );


    const hit =
      raycaster.intersectObjects(
        galaxyObjects.map(
          g => g.sprite
        ),
        false
      );


    if (
      !hit.length
    ) {
      return;
    }


    const selected =
      galaxyObjects.find(
        g =>
          g.sprite ===
          hit[0].object
      );


    if (
      selected
    ) {

      showObject(
        selected
      );

    }

  }
);


/* ============================================================
   DATE
============================================================ */

const timeDisplay =
  document.getElementById(
    "timeDisplay"
  );

const dateInput =
  document.getElementById(
    "dateInput"
  );


function formatDate(
  date
) {

  return date.toLocaleString(
    undefined,
    {

      year:
        "numeric",

      month:
        "numeric",

      day:
        "numeric",

      hour:
        "numeric",

      minute:
        "2-digit",

      second:
        "2-digit"

    }
  );

}


function inputDate(
  date
) {

  const pad =
    n =>
      String(n)
        .padStart(
          2,
          "0"
        );


  return (
    `${date.getFullYear()}-` +
    `${pad(
      date.getMonth() + 1
    )}-` +
    `${pad(
      date.getDate()
    )}T` +
    `${pad(
      date.getHours()
    )}:` +
    `${pad(
      date.getMinutes()
    )}`
  );

}


function updateDateUI() {

  timeDisplay.textContent =
    formatDate(
      selectedDate
    );


  dateInput.value =
    inputDate(
      selectedDate
    );

}


dateInput.addEventListener(
  "change",
  () => {

    if (
      !dateInput.value
    ) {
      return;
    }


    selectedDate =
      new Date(
        dateInput.value
      );


    presentMode =
      false;


    updateDateUI();

    updatePlanets();

  }
);


/* ============================================================
   DAY BUTTONS
============================================================ */

function changeDay(
  days
) {

  selectedDate =
    new Date(
      selectedDate.getTime() +
      days *
      86400000
    );


  presentMode =
    false;


  updateDateUI();

  updatePlanets();

}


document
  .getElementById(
    "previousDay"
  )
  .onclick =
    () =>
      changeDay(-1);


document
  .getElementById(
    "nextDay"
  )
  .onclick =
    () =>
      changeDay(1);


/* ============================================================
   PRESENT
============================================================ */

document
  .getElementById(
    "presentBtn"
  )
  .onclick =
    () => {

      presentMode =
        true;

      selectedDate =
        new Date();

      updateDateUI();

      updatePlanets();

    };


/* ============================================================
   CAMERA SCALE
============================================================ */

function updateCameraScale() {

  const current =
    camera.position.distanceTo(
      controls.target
    );


  const next =
    THREE.MathUtils.lerp(
      current,
      scaleTarget,
      .06
    );


  if (
    Math.abs(
      next - current
    ) <
    .01
  ) {
    return;
  }


  const direction =
    camera.position
      .clone()
      .sub(
        controls.target
      )
      .normalize();


  camera.position.copy(

    controls.target
      .clone()
      .add(

        direction.multiplyScalar(
          next
        )

      )

  );

}


/* ============================================================
   RESIZE
============================================================ */

window.addEventListener(
  "resize",
  () => {

    camera.aspect =
      window.innerWidth /
      window.innerHeight;


    camera.updateProjectionMatrix();


    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

  }
);


/* ============================================================
   ANIMATION
============================================================ */

let lastPresentUpdate =
  0;


function animate(
  time
) {

  requestAnimationFrame(
    animate
  );


  /*
    Present mode updates the
    astronomical clock.
  */

  if (
    presentMode &&
    time -
      lastPresentUpdate >
      500
  ) {

    selectedDate =
      new Date();

    updateDateUI();

    updatePlanets();

    lastPresentUpdate =
      time;

  }


  /*
    Very slow presentation movement.
  */

  stars.rotation.y +=
    .0000015;


  solarSystem.rotation.y +=
    .00001;


  /*
    Galaxy movement is intentionally
    extremely slow. It is visual
    presentation, not real-time
    galactic motion.
  */

  for (
    const galaxy of
    galaxyObjects
  ) {

    galaxy.group.rotation.y +=
      .0000004;

  }


  updateCameraScale();

  controls.update();

  renderer.render(
    scene,
    camera
  );

}


/* ============================================================
   INITIALIZE
============================================================ */

selectedDate =
  new Date();

updateDateUI();

updatePlanets();

slider.value =
  0;

updateScale();


/*
  CRITICAL DIFFERENCE:

  Start rendering immediately.
*/

animate(0);


/*
  Hide loading screen after
  the FIRST rendered frame.

  It does not wait for galaxies.
*/

requestAnimationFrame(
  () => {

    document
      .getElementById(
        "loading"
      )
      .classList.add(
        "hide"
      );

  }
);
