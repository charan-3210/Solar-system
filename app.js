import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.186.0/build/three.module.js";

import { OrbitControls } from
"https://cdn.jsdelivr.net/npm/three@0.186.0/examples/jsm/controls/OrbitControls.js";

import { EffectComposer } from
"https://cdn.jsdelivr.net/npm/three@0.186.0/examples/jsm/postprocessing/EffectComposer.js";

import { RenderPass } from
"https://cdn.jsdelivr.net/npm/three@0.186.0/examples/jsm/postprocessing/RenderPass.js";

import { UnrealBloomPass } from
"https://cdn.jsdelivr.net/npm/three@0.186.0/examples/jsm/postprocessing/UnrealBloomPass.js";


/* =========================================================
   COSMOS
   Visual rebuild
========================================================= */


/* =========================================================
   BASIC
========================================================= */

const app =
  document.getElementById("app");

const mobile =
  /Android|iPhone|iPad|iPod/i
    .test(navigator.userAgent);


/* =========================================================
   RENDERER
========================================================= */

const renderer =
  new THREE.WebGLRenderer({

    antialias:
      !mobile,

    powerPreference:
      "high-performance",

    logarithmicDepthBuffer:
      true

  });

renderer.setPixelRatio(
  Math.min(
    window.devicePixelRatio || 1,
    mobile ? 1.35 : 1.8
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
  1.25;

app.appendChild(
  renderer.domElement
);


/* =========================================================
   SCENE
========================================================= */

const scene =
  new THREE.Scene();

scene.background =
  new THREE.Color(
    0x000104
  );


/* =========================================================
   CAMERA
========================================================= */

const camera =
  new THREE.PerspectiveCamera(
    55,
    window.innerWidth /
      window.innerHeight,
    .01,
    100000
  );

camera.position.set(
  0,
  600,
  3200
);


/* =========================================================
   CONTROLS
========================================================= */

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
  .48;

controls.zoomSpeed =
  .85;

controls.panSpeed =
  .55;

controls.enablePan =
  true;

controls.screenSpacePanning =
  true;

controls.minDistance =
  .15;

controls.maxDistance =
  50000;

controls.target.set(
  0,
  0,
  0
);


/* =========================================================
   BLOOM
========================================================= */

const composer =
  new EffectComposer(
    renderer
  );

const renderPass =
  new RenderPass(
    scene,
    camera
  );

composer.addPass(
  renderPass
);

const bloom =
  new UnrealBloomPass(
    new THREE.Vector2(
      window.innerWidth,
      window.innerHeight
    ),
    mobile ? .65 : .9,
    .65,
    .08
  );

composer.addPass(
  bloom
);


/* =========================================================
   HELPERS
========================================================= */

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


/* =========================================================
   GLOW TEXTURE
========================================================= */

function makeGlowTexture() {

  const size = 256;

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

  const g =
    ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );

  g.addColorStop(
    0,
    "rgba(255,255,255,1)"
  );

  g.addColorStop(
    .08,
    "rgba(255,255,255,.95)"
  );

  g.addColorStop(
    .25,
    "rgba(190,215,255,.55)"
  );

  g.addColorStop(
    .55,
    "rgba(80,130,255,.12)"
  );

  g.addColorStop(
    1,
    "rgba(0,0,0,0)"
  );

  ctx.fillStyle =
    g;

  ctx.fillRect(
    0,
    0,
    size,
    size
  );

  const texture =
    new THREE.CanvasTexture(
      canvas
    );

  texture.colorSpace =
    THREE.SRGBColorSpace;

  return texture;
}

const glowTexture =
  makeGlowTexture();


/* =========================================================
   STAR FIELD
========================================================= */

function createStars() {

  const count =
    mobile
      ? 11000
      : 26000;

  const positions =
    new Float32Array(
      count * 3
    );

  const colors =
    new Float32Array(
      count * 3
    );

  const color =
    new THREE.Color();

  for (
    let i = 0;
    i < count;
    i++
  ) {

    const radius =
      6000 *
      Math.pow(
        Math.random(),
        .38
      );

    const theta =
      Math.random() *
      Math.PI * 2;

    const phi =
      Math.acos(
        random(-1, 1)
      );

    const x =
      radius *
      Math.sin(phi) *
      Math.cos(theta);

    const y =
      radius *
      Math.cos(phi);

    const z =
      radius *
      Math.sin(phi) *
      Math.sin(theta);

    positions[i * 3] =
      x;

    positions[i * 3 + 1] =
      y;

    positions[i * 3 + 2] =
      z;


    const temperature =
      Math.random();

    if (
      temperature < .15
    ) {

      color.setRGB(
        1,
        .75,
        .58
      );

    } else if (
      temperature < .45
    ) {

      color.setRGB(
        1,
        .9,
        .75
      );

    } else if (
      temperature < .8
    ) {

      color.setRGB(
        .78,
        .88,
        1
      );

    } else {

      color.setRGB(
        .6,
        .75,
        1
      );
    }

    colors[i * 3] =
      color.r;

    colors[i * 3 + 1] =
      color.g;

    colors[i * 3 + 2] =
      color.b;
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
        mobile
          ? 1.2
          : 1.45,

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

const stars =
  createStars();


/* =========================================================
   NEBULA CLOUDS
========================================================= */

function createNebula(
  position,
  color,
  size,
  opacity
) {

  const sprite =
    new THREE.Sprite(

      new THREE.SpriteMaterial({

        map:
          glowTexture,

        color,

        transparent:
          true,

        opacity,

        depthWrite:
          false,

        blending:
          THREE.AdditiveBlending

      })

    );

  sprite.position.set(
    ...position
  );

  sprite.scale.set(
    size,
    size,
    1
  );

  scene.add(
    sprite
  );

  return sprite;
}


const nebulas = [

  [[-900, 700, -900], 0x284f9b, 1100, .035],

  [[1100, -600, -1200], 0x6e2f87, 900, .035],

  [[-1500, -900, 500], 0x1e5681, 1000, .03],

  [[1700, 900, 600], 0x7a3e4c, 900, .025],

  [[0, -1300, -1500], 0x284c88, 1200, .025]

];

nebulas.forEach(
  data =>
    createNebula(
      ...data
    )
);


/* =========================================================
   GALAXY DATA
========================================================= */

const GALAXIES = [

  {
    name:
      "Milky Way",

    type:
      "Barred Spiral Galaxy",

    status:
      "CATALOGUED",

    description:
      "The galaxy containing our Solar System. The Milky Way is a barred spiral galaxy with a central bulge, disk and extended halo.",

    position:
      [0, 0, 0],

    radius:
      170,

    arms:
      4,

    color:
      0xbdd8ff
  },

  {
    name:
      "Andromeda Galaxy (M31)",

    type:
      "Spiral Galaxy",

    status:
      "CATALOGUED",

    description:
      "A large spiral galaxy in the Local Group and one of the nearest major galaxies to the Milky Way.",

    position:
      [650, 120, -260],

    radius:
      125,

    arms:
      3,

    color:
      0xd9e5ff,

    tilt:
      .4
  },

  {
    name:
      "Triangulum Galaxy (M33)",

    type:
      "Spiral Galaxy",

    status:
      "CATALOGUED",

    description:
      "A spiral galaxy and member of the Local Group.",

    position:
      [-500, -80, -390],

    radius:
      82,

    arms:
      3,

    color:
      0x9fc8ff,

    tilt:
      .3
  },

  {
    name:
      "Large Magellanic Cloud",

    type:
      "Irregular Galaxy",

    status:
      "CATALOGUED",

    description:
      "An irregular satellite galaxy of the Milky Way.",

    position:
      [350, -230, 400],

    radius:
      48,

    irregular:
      true,

    color:
      0xa8c8ff
  },

  {
    name:
      "Small Magellanic Cloud",

    type:
      "Dwarf Irregular Galaxy",

    status:
      "CATALOGUED",

    description:
      "A dwarf irregular galaxy associated with the Milky Way.",

    position:
      [440, -280, 480],

    radius:
      35,

    irregular:
      true,

    color:
      0x9fb7ff
  },

  {
    name:
      "Whirlpool Galaxy (M51)",

    type:
      "Spiral Galaxy",

    status:
      "CATALOGUED",

    description:
      "An interacting spiral galaxy system in the constellation Canes Venatici.",

    position:
      [-900, 350, -650],

    radius:
      100,

    arms:
      2,

    color:
      0xc7dcff,

    tilt:
      .25
  },

  {
    name:
      "Sombrero Galaxy (M104)",

    type:
      "Spiral Galaxy",

    status:
      "CATALOGUED",

    description:
      "A galaxy distinguished by its bright central bulge and prominent dust lane.",

    position:
      [1000, -360, -850],

    radius:
      95,

    arms:
      2,

    color:
      0xffd5a0,

    tilt:
      1
  },

  {
    name:
      "Pinwheel Galaxy (M101)",

    type:
      "Spiral Galaxy",

    status:
      "CATALOGUED",

    description:
      "A large asymmetric spiral galaxy in Ursa Major.",

    position:
      [-1000, 520, 380],

    radius:
      120,

    arms:
      5,

    color:
      0xc9e0ff
  },

  {
    name:
      "Bode's Galaxy (M81)",

    type:
      "Spiral Galaxy",

    status:
      "CATALOGUED",

    description:
      "A grand-design spiral galaxy in Ursa Major.",

    position:
      [900, 600, 550],

    radius:
      90,

    arms:
      2,

    color:
      0xd8e6ff
  },

  {
    name:
      "Cigar Galaxy (M82)",

    type:
      "Starburst Galaxy",

    status:
      "CATALOGUED",

    description:
      "An actively star-forming galaxy interacting with nearby M81.",

    position:
      [850, 670, 600],

    radius:
      55,

    elongated:
      true,

    irregular:
      true,

    color:
      0xffb978
  },

  {
    name:
      "Black Eye Galaxy (M64)",

    type:
      "Spiral Galaxy",

    status:
      "CATALOGUED",

    description:
      "A spiral galaxy known for its prominent dark dust feature.",

    position:
      [-1250, -420, -150],

    radius:
      78,

    arms:
      2,

    color:
      0xd6e1ff
  },

  {
    name:
      "Sunflower Galaxy (M63)",

    type:
      "Spiral Galaxy",

    status:
      "CATALOGUED",

    description:
      "A flocculent spiral galaxy with a bright central region.",

    position:
      [1250, 260, -400],

    radius:
      82,

    arms:
      5,

    color:
      0xd5e2ff
  },

  {
    name:
      "Southern Pinwheel Galaxy (M83)",

    type:
      "Barred Spiral Galaxy",

    status:
      "CATALOGUED",

    description:
      "A barred spiral galaxy visible in the southern sky.",

    position:
      [-720, -650, 700],

    radius:
      92,

    arms:
      4,

    color:
      0xc0dcff
  },

  {
    name:
      "Centaurus A",

    type:
      "Peculiar Galaxy",

    status:
      "CATALOGUED",

    description:
      "A prominent nearby galaxy with a strong dust lane and active central region.",

    position:
      [680, -780, 820],

    radius:
      80,

    elongated:
      true,

    irregular:
      true,

    color:
      0xffc18a
  },

  {
    name:
      "Sculptor Galaxy (NGC 253)",

    type:
      "Spiral Galaxy",

    status:
      "CATALOGUED",

    description:
      "A nearby spiral galaxy and prominent star-forming system.",

    position:
      [-1200, -600, 850],

    radius:
      90,

    arms:
      3,

    color:
      0xbdd8ff
  },

  {
    name:
      "Messier 87",

    type:
      "Giant Elliptical Galaxy",

    status:
      "CATALOGUED",

    description:
      "A giant elliptical galaxy associated with the Virgo Cluster.",

    position:
      [1550, 650, -900],

    radius:
      130,

    elliptical:
      true,

    color:
      0xffddb0
  },

  {
    name:
      "Messier 49",

    type:
      "Elliptical Galaxy",

    status:
      "CATALOGUED",

    description:
      "A giant elliptical galaxy in the Virgo Cluster region.",

    position:
      [1660, 760, -980],

    radius:
      90,

    elliptical:
      true,

    color:
      0xffd8a7
  },

  {
    name:
      "Messier 60",

    type:
      "Elliptical Galaxy",

    status:
      "CATALOGUED",

    description:
      "A giant elliptical galaxy in the Virgo Cluster region.",

    position:
      [1730, 700, -820],

    radius:
      78,

    elliptical:
      true,

    color:
      0xffd3a1
  },

  {
    name:
      "NGC 1300",

    type:
      "Barred Spiral Galaxy",

    status:
      "CATALOGUED",

    description:
      "A well-studied barred spiral galaxy.",

    position:
      [-1700, 220, -760],

    radius:
      90,

    arms:
      2,

    color:
      0xc7ddff
  },

  {
    name:
      "NGC 1365",

    type:
      "Barred Spiral Galaxy",

    status:
      "CATALOGUED",

    description:
      "A large barred spiral galaxy in the Fornax region.",

    position:
      [1850, -330, 820],

    radius:
      110,

    arms:
      2,

    color:
      0xc5ddff
  },

  {
    name:
      "NGC 4038",

    type:
      "Interacting Galaxy",

    status:
      "CATALOGUED",

    description:
      "One of the two major galaxies forming the Antennae system.",

    position:
      [-1850, 700, 920],

    radius:
      65,

    irregular:
      true,

    color:
      0xffbd8b
  },

  {
    name:
      "NGC 4039",

    type:
      "Interacting Galaxy",

    status:
      "CATALOGUED",

    description:
      "The second major galaxy in the Antennae system.",

    position:
      [-1780, 735, 960],

    radius:
      62,

    irregular:
      true,

    color:
      0xffbd8b
  },

  {
    name:
      "NGC 6744",

    type:
      "Spiral Galaxy",

    status:
      "CATALOGUED",

    description:
      "A large nearby spiral galaxy whose appearance is often compared broadly with the Milky Way.",

    position:
      [1800, 920, 160],

    radius:
      125,

    arms:
      4,

    color:
      0xc5ddff
  },

  {
    name:
      "NGC 4258",

    type:
      "Spiral Galaxy",

    status:
      "CATALOGUED",

    description:
      "A nearby spiral galaxy known for its warped disk.",

    position:
      [-1600, -850, -430],

    radius:
      95,

    arms:
      3,

    color:
      0xc5d9ff
  }

];


/* =========================================================
   GALAXY TEXTURE
========================================================= */

function createGalaxyTexture(
  data
) {

  const size =
    mobile ? 768 : 1024;

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

  const base =
    new THREE.Color(
      data.color
    );

  /*
    Outer soft light.
  */

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
    `rgba(
      ${Math.floor(base.r * 255)},
      ${Math.floor(base.g * 255)},
      ${Math.floor(base.b * 255)},
      .75
    )`
  );

  glow.addColorStop(
    .12,
    `rgba(
      ${Math.floor(base.r * 255)},
      ${Math.floor(base.g * 255)},
      ${Math.floor(base.b * 255)},
      .45
    )`
  );

  glow.addColorStop(
    .35,
    `rgba(
      ${Math.floor(base.r * 255)},
      ${Math.floor(base.g * 255)},
      ${Math.floor(base.b * 255)},
      .12
    )`
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


  /*
    Elliptical galaxy.
  */

  if (
    data.elliptical
  ) {

    const gradient =
      ctx.createRadialGradient(
        cx,
        cy,
        5,
        cx,
        cy,
        size * .44
      );

    gradient.addColorStop(
      0,
      "rgba(255,245,215,.95)"
    );

    gradient.addColorStop(
      .15,
      "rgba(255,220,170,.75)"
    );

    gradient.addColorStop(
      .45,
      "rgba(230,205,165,.24)"
    );

    gradient.addColorStop(
      1,
      "rgba(0,0,0,0)"
    );

    ctx.fillStyle =
      gradient;

    ctx.beginPath();

    ctx.ellipse(
      cx,
      cy,
      size * .38,
      size * .20,
      0,
      0,
      Math.PI * 2
    );

    ctx.fill();

  } else {

    /*
      Spiral galaxy.
    */

    const arms =
      data.arms || 3;

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
        t += .018
      ) {

        const radius =
          t /
          (Math.PI * 4.5) *
          size *
          .42;

        const angle =
          t * 1.7 +
          offset;

        const x =
          cx +
          Math.cos(angle) *
          radius;

        const y =
          cy +
          Math.sin(angle) *
          radius *
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
        `rgba(
          ${Math.floor(base.r * 255)},
          ${Math.floor(base.g * 255)},
          ${Math.floor(base.b * 255)},
          .34
        )`;

      ctx.lineWidth =
        size * .025;

      ctx.shadowBlur =
        25;

      ctx.shadowColor =
        `rgb(
          ${Math.floor(base.r * 255)},
          ${Math.floor(base.g * 255)},
          ${Math.floor(base.b * 255)}
        )`;

      ctx.stroke();
    }


    /*
      Central bulge.
    */

    const core =
      ctx.createRadialGradient(
        cx,
        cy,
        0,
        cx,
        cy,
        size * .17
      );

    core.addColorStop(
      0,
      "rgba(255,255,245,1)"
    );

    core.addColorStop(
      .15,
      "rgba(255,240,205,.9)"
    );

    core.addColorStop(
      .5,
      "rgba(255,215,165,.25)"
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
      size * .18,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }


  /*
    Random dust/star particles.
  */

  for (
    let i = 0;
    i < 1800;
    i++
  ) {

    const a =
      Math.random() *
      Math.PI *
      2;

    const r =
      Math.pow(
        Math.random(),
        .65
      ) *
      size *
      .43;

    const x =
      cx +
      Math.cos(a) *
      r;

    const y =
      cy +
      Math.sin(a) *
      r *
      .46;

    const alpha =
      Math.random() *
      .4;

    ctx.fillStyle =
      `rgba(
        255,
        255,
        255,
        ${alpha}
      )`;

    const s =
      Math.random() *
      2.2;

    ctx.fillRect(
      x,
      y,
      s,
      s
    );
  }


  const texture =
    new THREE.CanvasTexture(
      canvas
    );

  texture.colorSpace =
    THREE.SRGBColorSpace;

  texture.minFilter =
    THREE.LinearMipmapLinearFilter;

  texture.magFilter =
    THREE.LinearFilter;

  return texture;
}


/* =========================================================
   GALAXY OBJECTS
========================================================= */

const galaxyObjects = [];


function createGalaxy(
  data
) {

  const group =
    new THREE.Group();

  group.position.set(
    ...data.position
  );

  group.rotation.z =
    random(
      0,
      Math.PI * 2
    );

  group.rotation.x =
    data.tilt || 0;


  /*
    Main visual galaxy.
  */

  const texture =
    createGalaxyTexture(
      data
    );

  const material =
    new THREE.SpriteMaterial({

      map:
        texture,

      transparent:
        true,

      opacity:
        .95,

      depthWrite:
        false,

      blending:
        THREE.AdditiveBlending

    });


  const sprite =
    new THREE.Sprite(
      material
    );

  const visualSize =
    data.radius * 2.4;

  sprite.scale.set(
    visualSize,
    visualSize,
    1
  );

  group.add(
    sprite
  );


  /*
    3D depth particles.
  */

  const count =
    mobile ? 350 : 750;

  const positions =
    new Float32Array(
      count * 3
    );

  const colors =
    new Float32Array(
      count * 3
    );

  const c =
    new THREE.Color(
      data.color
    );

  for (
    let i = 0;
    i < count;
    i++
  ) {

    const radius =
      data.radius *
      Math.pow(
        Math.random(),
        .55
      );

    const angle =
      Math.random() *
      Math.PI * 2;

    const spread =
      data.elliptical
        ? .45
        : .18;

    positions[i * 3] =
      Math.cos(angle) *
      radius;

    positions[i * 3 + 1] =
      random(
        -data.radius * spread,
        data.radius * spread
      );

    positions[i * 3 + 2] =
      Math.sin(angle) *
      radius;


    colors[i * 3] =
      c.r *
      random(.55, 1.1);

    colors[i * 3 + 1] =
      c.g *
      random(.55, 1.1);

    colors[i * 3 + 2] =
      c.b *
      random(.55, 1.1);
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


  const particleMaterial =
    new THREE.PointsMaterial({

      size:
        mobile
          ? 1.2
          : 1.5,

      vertexColors:
        true,

      transparent:
        true,

      opacity:
        .65,

      depthWrite:
        false,

      blending:
        THREE.AdditiveBlending

    });


  const particles =
    new THREE.Points(
      geometry,
      particleMaterial
    );

  group.add(
    particles
  );


  /*
    Core glow.
  */

  const core =
    new THREE.Sprite(

      new THREE.SpriteMaterial({

        map:
          glowTexture,

        color:
          data.color,

        transparent:
          true,

        opacity:
          .75,

        depthWrite:
          false,

        blending:
          THREE.AdditiveBlending

      })

    );

  const coreSize =
    data.radius *
    .75;

  core.scale.set(
    coreSize,
    coreSize,
    1
  );

  group.add(
    core
  );


  scene.add(
    group
  );


  const object = {

    ...data,

    group,

    sprite,

    particles,

    core

  };

  galaxyObjects.push(
    object
  );

  return object;
}


GALAXIES.forEach(
  createGalaxy
);


/* =========================================================
   DEEP FIELD GALAXIES
========================================================= */

function createDeepField() {

  const group =
    new THREE.Group();

  const count =
    mobile ? 120 : 260;

  for (
    let i = 0;
    i < count;
    i++
  ) {

    const direction =
      new THREE.Vector3(
        random(-1, 1),
        random(-1, 1),
        random(-1, 1)
      ).normalize();

    const distance =
      random(
        3000,
        11000
      );

    const position =
      direction.multiplyScalar(
        distance
      );

    const data = {

      name:
        `Deep Field ${String(i + 1).padStart(3, "0")}`,

      type:
        Math.random() < .7
          ? "Distant Spiral Galaxy"
          : "Distant Elliptical Galaxy",

      status:
        "ILLUSTRATIVE DEEP FIELD",

      description:
        "A procedural distant-galaxy representation used to create a dense deep-space environment. It is not presented as an individually identified catalogue object.",

      position:
        position.toArray(),

      radius:
        random(12, 38),

      arms:
        Math.floor(
          random(2, 5)
        ),

      color:
        Math.random() < .75
          ? 0x9fbfff
          : 0xd6a9ff,

      elliptical:
        Math.random() > .78,

      procedural:
        true

    };

    const galaxy =
      createGalaxy(
        data
      );

    galaxy.group.scale.setScalar(
      random(.5, 1.4)
    );
  }

  scene.add(
    group
  );
}

createDeepField();


/* =========================================================
   SOLAR SYSTEM
========================================================= */

const solarSystem =
  new THREE.Group();

scene.add(
  solarSystem
);


/* =========================================================
   SUN
========================================================= */

const sun =
  new THREE.Mesh(

    new THREE.SphereGeometry(
      10,
      64,
      64
    ),

    new THREE.MeshBasicMaterial({
      color:
        0xffd36a
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
        0xffb52e,

      transparent:
        true,

      opacity:
        .9,

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


/* =========================================================
   PLANETS
========================================================= */

const PLANETS = [

  {
    name: "Mercury",
    radius: 1.2,
    distance: 18,
    period: 87.969,
    color: 0x9d9288
  },

  {
    name: "Venus",
    radius: 1.9,
    distance: 27,
    period: 224.701,
    color: 0xd7b477
  },

  {
    name: "Earth",
    radius: 2.2,
    distance: 38,
    period: 365.256,
    color: 0x3e83cf
  },

  {
    name: "Mars",
    radius: 1.65,
    distance: 50,
    period: 686.98,
    color: 0xb75d45
  },

  {
    name: "Jupiter",
    radius: 6.4,
    distance: 78,
    period: 4332.59,
    color: 0xd1aa80
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
    color: 0x8bd1d7
  },

  {
    name: "Neptune",
    radius: 3.9,
    distance: 166,
    period: 60182,
    color: 0x416bc7
  }

];


const planetObjects = [];


/* =========================================================
   PLANET TEXTURE
========================================================= */

function createPlanetTexture(
  planet
) {

  const size =
    512;

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

  const base =
    new THREE.Color(
      planet.color
    );


  /*
    Base.
  */

  ctx.fillStyle =
    `rgb(
      ${base.r * 255},
      ${base.g * 255},
      ${base.b * 255}
    )`;

  ctx.fillRect(
    0,
    0,
    size,
    size
  );


  /*
    Planet-specific bands/features.
  */

  if (
    planet.name === "Jupiter" ||
    planet.name === "Saturn"
  ) {

    for (
      let y = 0;
      y < size;
      y += 18
    ) {

      const variation =
        Math.random() *
        45;

      ctx.fillStyle =
        `rgba(
          255,
          255,
          255,
          ${.08 + variation / 400}
        )`;

      ctx.fillRect(
        0,
        y,
        size,
        random(
          5,
          20
        )
      );
    }

  } else if (
    planet.name === "Earth"
  ) {

    /*
      Ocean.
    */

    ctx.fillStyle =
      "#174f91";

    ctx.fillRect(
      0,
      0,
      size,
      size
    );


    /*
      Procedural continents.
    */

    for (
      let i = 0;
      i < 45;
      i++
    ) {

      const x =
        random(
          0,
          size
        );

      const y =
        random(
          0,
          size
        );

      const w =
        random(
          15,
          90
        );

      const h =
        random(
          10,
          55
        );

      ctx.fillStyle =
        `rgba(
          ${random(30,90)},
          ${random(100,180)},
          ${random(50,100)},
          .8
        )`;

      ctx.beginPath();

      ctx.ellipse(
        x,
        y,
        w,
        h,
        random(
          0,
          Math.PI
        ),
        0,
        Math.PI * 2
      );

      ctx.fill();
    }

  } else if (
    planet.name === "Mars"
  ) {

    for (
      let i = 0;
      i < 80;
      i++
    ) {

      ctx.fillStyle =
        `rgba(
          80,
          30,
          20,
          ${random(.05,.25)}
        )`;

      ctx.beginPath();

      ctx.arc(
        random(0,size),
        random(0,size),
        random(3,25),
        0,
        Math.PI * 2
      );

      ctx.fill();
    }
  }


  const texture =
    new THREE.CanvasTexture(
      canvas
    );

  texture.colorSpace =
    THREE.SRGBColorSpace;

  return texture;
}


/* =========================================================
   ORBITS
========================================================= */

function createOrbit(
  radius
) {

  const points = [];

  for (
    let i = 0;
    i <= 160;
    i++
  ) {

    const angle =
      i /
      160 *
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
        0x62708b,

      transparent:
        true,

      opacity:
        .24

    });


  return new THREE.Line(
    geometry,
    material
  );
}


/* =========================================================
   PLANET CREATION
========================================================= */

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
          40,
          40
        ),

        new THREE.MeshStandardMaterial({

          map:
            createPlanetTexture(
              planet
            ),

          roughness:
            .82,

          metalness:
            .02

        })

      );


    solarSystem.add(
      mesh
    );


    /*
      Saturn rings.
    */

    if (
      planet.rings
    ) {

      const ring =
        new THREE.Mesh(

          new THREE.RingGeometry(
            planet.radius * 1.3,
            planet.radius * 2.15,
            96
          ),

          new THREE.MeshBasicMaterial({

            color:
              0xc9b486,

            transparent:
              true,

            opacity:
              .68,

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


    /*
      Atmosphere.
    */

    if (
      planet.name ===
      "Earth"
    ) {

      const atmosphere =
        new THREE.Mesh(

          new THREE.SphereGeometry(
            planet.radius * 1.08,
            32,
            32
          ),

          new THREE.MeshBasicMaterial({

            color:
              0x4ea4ff,

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


/* =========================================================
   ASTEROID BELT
========================================================= */

function createAsteroids() {

  const count =
    mobile
      ? 1800
      : 4200;

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
      random(
        -2,
        2
      );

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
        0xa79785,

      size:
        .32,

      transparent:
        true,

      opacity:
        .55,

      depthWrite:
        false

    });


  const points =
    new THREE.Points(
      geometry,
      material
    );

  solarSystem.add(
    points
  );
}

createAsteroids();


/* =========================================================
   LIGHTING
========================================================= */

scene.add(
  new THREE.AmbientLight(
    0x7788a0,
    .18
  )
);


const sunLight =
  new THREE.PointLight(
    0xffffff,
    3.2,
    700
  );

solarSystem.add(
  sunLight
);


/* =========================================================
   TIME
========================================================= */

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
  ) / 86400000;

}


/* =========================================================
   PLANET POSITION
========================================================= */

function updatePlanets() {

  const days =
    daysFromJ2000(
      selectedDate
    );


  planetObjects.forEach(
    planet => {

      const angle =
        (
          days /
          planet.period
        ) *
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


/* =========================================================
   SCALE
========================================================= */

const scaleSlider =
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

  "GEOGRAPHY",

  "CITY",

  "STREET"

];


function getScaleName(
  value
) {

  const index =
    Math.round(
      value /
      100 *
      (SCALE_NAMES.length - 1)
    );

  return SCALE_NAMES[
    clamp(
      index,
      0,
      SCALE_NAMES.length - 1
    )
  ];
}


let scaleTarget =
  3200;


function updateScale() {

  const value =
    Number(
      scaleSlider.value
    );


  scaleText.textContent =
    getScaleName(
      value
    );


  /*
    Exponential distance mapping.
  */

  const far =
    12000;

  const near =
    .8;

  const t =
    value / 100;


  scaleTarget =
    Math.exp(
      Math.log(far) *
        (1 - t) +
      Math.log(near) *
        t
    );
}


scaleSlider.addEventListener(
  "input",
  updateScale
);


/* =========================================================
   SEARCH
========================================================= */

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
          100
        );

      }

    }
  );


function search() {

  const query =
    searchInput.value
      .trim()
      .toLowerCase();

  searchResults.innerHTML =
    "";


  if (!query) {
    return;
  }


  const matches =
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


  if (!matches.length) {

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


  matches
    .slice(0, 15)
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


        row.addEventListener(
          "click",
          () => {

            showObject(
              object
            );

            searchPanel.classList.add(
              "hidden"
            );

          }
        );


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
    search
  );


searchInput.addEventListener(
  "keydown",
  event => {

    if (
      event.key ===
      "Enter"
    ) {
      search();
    }

  }
);


/* =========================================================
   OBJECT PANEL
========================================================= */

const objectPanel =
  document.getElementById(
    "objectPanel"
  );

const objectName =
  document.getElementById(
    "objectName"
  );

const objectDescription =
  document.getElementById(
    "objectDescription"
  );

const objectType =
  document.getElementById(
    "objectType"
  );

const objectStatus =
  document.getElementById(
    "objectStatus"
  );


function showObject(
  object
) {

  objectName.textContent =
    object.name;

  objectDescription.textContent =
    object.description;

  objectType.textContent =
    object.type;

  objectStatus.textContent =
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


  const distance =
    Math.max(
      object.userData.radius ||
        100,
      250
    );


  camera.position.copy(
    position.clone()
      .add(
        direction.multiplyScalar(
          distance
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


/* =========================================================
   CLICK GALAXIES
========================================================= */

const raycaster =
  new THREE.Raycaster();

const pointer =
  new THREE.Vector2();


let pointerDownX = 0;
let pointerDownY = 0;


renderer.domElement.addEventListener(
  "pointerdown",
  event => {

    pointerDownX =
      event.clientX;

    pointerDownY =
      event.clientY;

  }
);


renderer.domElement.addEventListener(
  "pointerup",
  event => {

    const movement =
      Math.hypot(
        event.clientX -
          pointerDownX,

        event.clientY -
          pointerDownY
      );


    /*
      Ignore clicks that were actually drags.
    */

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


    const objects =
      galaxyObjects.map(
        g =>
          g.sprite
      );


    const hits =
      raycaster.intersectObjects(
        objects,
        false
      );


    if (
      !hits.length
    ) {
      return;
    }


    const selected =
      galaxyObjects.find(
        g =>
          g.sprite ===
          hits[0].object
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


/* =========================================================
   PRESENT
========================================================= */

document
  .getElementById(
    "presentBtn"
  )
  .addEventListener(
    "click",
    () => {

      presentMode =
        true;

      selectedDate =
        new Date();

      updateDateUI();

      updatePlanets();

    }
  );


/* =========================================================
   DATE UI
========================================================= */

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
    value =>
      String(value)
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


function changeDay(
  amount
) {

  selectedDate =
    new Date(
      selectedDate.getTime() +
      amount *
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
  .addEventListener(
    "click",
    () =>
      changeDay(-1)
  );


document
  .getElementById(
    "nextDay"
  )
  .addEventListener(
    "click",
    () =>
      changeDay(1)
  );


/* =========================================================
   MOBILE PINCH
========================================================= */

let pinchDistance =
  null;


renderer.domElement.addEventListener(
  "touchstart",
  event => {

    if (
      event.touches.length ===
      2
    ) {

      const a =
        event.touches[0];

      const b =
        event.touches[1];


      pinchDistance =
        Math.hypot(
          a.clientX -
            b.clientX,

          a.clientY -
            b.clientY
        );

    }

  },
  {
    passive: true
  }
);


renderer.domElement.addEventListener(
  "touchmove",
  event => {

    if (
      event.touches.length !==
      2
    ) {
      return;
    }


    if (
      pinchDistance ===
      null
    ) {
      return;
    }


    const a =
      event.touches[0];

    const b =
      event.touches[1];


    const current =
      Math.hypot(
        a.clientX -
          b.clientX,

        a.clientY -
          b.clientY
      );


    const delta =
      current -
      pinchDistance;


    const direction =
      camera.position
        .clone()
        .sub(
          controls.target
        )
        .normalize();


    camera.position.add(
      direction.multiplyScalar(
        -delta * .025
      )
    );


    pinchDistance =
      current;

  },
  {
    passive: true
  }
);


renderer.domElement.addEventListener(
  "touchend",
  () => {

    pinchDistance =
      null;

  },
  {
    passive: true
  }
);


/* =========================================================
   SMOOTH SCALE
========================================================= */

function updateCameraScale() {

  const direction =
    camera.position
      .clone()
      .sub(
        controls.target
      )
      .normalize();


  const currentDistance =
    camera.position.distanceTo(
      controls.target
    );


  const next =
    THREE.MathUtils.lerp(
      currentDistance,
      scaleTarget,
      .055
    );


  /*
    Only use slider movement when
    it differs significantly.
  */

  if (
    Math.abs(
      next -
      currentDistance
    ) > .001
  ) {

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

}


/* =========================================================
   RESIZE
========================================================= */

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


    composer.setSize(
      window.innerWidth,
      window.innerHeight
    );

  }
);


/* =========================================================
   ANIMATION
========================================================= */

let lastPresent =
  0;


function animate(
  time
) {

  requestAnimationFrame(
    animate
  );


  /*
    Present mode.
  */

  if (
    presentMode &&
    time -
      lastPresent >
      500
  ) {

    selectedDate =
      new Date();

    updateDateUI();

    updatePlanets();

    lastPresent =
      time;

  }


  /*
    Very subtle visual movement.

    This is presentation only;
    it does not claim to represent
    real-time galactic rotation.
  */

  galaxyObjects.forEach(
    galaxy => {

      if (
        galaxy.procedural
      ) {

        galaxy.group.rotation.y +=
          .0000008;

      }

    }
  );


  solarSystem.rotation.y +=
    .000012;


  /*
    Deep-field parallax.
  */

  stars.rotation.y +=
    .000002;


  updateCameraScale();


  controls.update();


  composer.render();

}


/* =========================================================
   START
========================================================= */

selectedDate =
  new Date();

updateDateUI();

updatePlanets();

scaleSlider.value =
  0;

updateScale();


/*
  Let the renderer initialize,
  then remove loading screen.
*/

requestAnimationFrame(
  () => {

    setTimeout(
      () => {

        document
          .getElementById(
            "loading"
          )
          .classList.add(
            "hide"
          );

      },
      700
    );

  }
);


animate(0);
