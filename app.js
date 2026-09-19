import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

/* =========================================================
   COSMOS 1.0
   Fast-start 3D universe explorer
   ========================================================= */

const canvas = document.getElementById("space");

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x010207);

const camera = new THREE.PerspectiveCamera(
  55,
  innerWidth / innerHeight,
  0.01,
  100000
);

camera.position.set(0, 18, 45);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: innerWidth > 700,
  powerPreference: "high-performance"
});

renderer.setSize(innerWidth, innerHeight, false);

renderer.setPixelRatio(
  innerWidth < 700 ? 1 : Math.min(devicePixelRatio, 1.25)
);

renderer.outputColorSpace = THREE.SRGBColorSpace;

const controls = new OrbitControls(
  camera,
  renderer.domElement
);

controls.enableDamping = true;
controls.dampingFactor = 0.055;

controls.minDistance = 2;
controls.maxDistance = 50000;

controls.enablePan = true;

controls.target.set(0, 0, 0);

const clock = new THREE.Clock();

/* =========================================================
   DATA
   ========================================================= */

const objects = [];

const planets = [
  {
    name: "Mercury",
    radius: .38,
    distance: 5,
    color: 0x999999,
    period: 87.97,
    type: "PLANET"
  },
  {
    name: "Venus",
    radius: .72,
    distance: 7,
    color: 0xd8a95b,
    period: 224.7,
    type: "PLANET"
  },
  {
    name: "Earth",
    radius: .82,
    distance: 9.5,
    color: 0x3f83ff,
    period: 365.25,
    type: "PLANET"
  },
  {
    name: "Mars",
    radius: .58,
    distance: 12,
    color: 0xd75d38,
    period: 686.98,
    type: "PLANET"
  },
  {
    name: "Jupiter",
    radius: 2.7,
    distance: 18,
    color: 0xc99a72,
    period: 4332.6,
    type: "PLANET"
  },
  {
    name: "Saturn",
    radius: 2.25,
    distance: 25,
    color: 0xd8c08b,
    period: 10759,
    type: "PLANET"
  },
  {
    name: "Uranus",
    radius: 1.45,
    distance: 32,
    color: 0x77cfe0,
    period: 30687,
    type: "PLANET"
  },
  {
    name: "Neptune",
    radius: 1.4,
    distance: 39,
    color: 0x416be8,
    period: 60190,
    type: "PLANET"
  }
];

const galaxies = [
  ["Milky Way", 0, 0, 0],
  ["Andromeda Galaxy", 220, 35, -90],
  ["Triangulum Galaxy", -250, 60, 80],
  ["Whirlpool Galaxy", 500, -100, -300],
  ["Sombrero Galaxy", -520, 170, -160],
  ["Pinwheel Galaxy", 620, 90, 360],
  ["Black Eye Galaxy", -700, -120, 300],
  ["Sunflower Galaxy", 850, 240, -420],
  ["Cigar Galaxy", -900, 300, 500],
  ["Cartwheel Galaxy", 1100, -250, -500],
  ["Tadpole Galaxy", -1250, -300, -300],
  ["Large Magellanic Cloud", 300, -500, 850],
  ["Small Magellanic Cloud", -350, -550, 900],
  ["Centaurus A", 1400, 450, -800],
  ["Messier 87", -1500, 600, -650],
  ["NGC 1300", 1700, -500, 600],
  ["NGC 1365", -1750, 400, 700],
  ["NGC 4414", 1900, 700, -400],
  ["NGC 6744", -2000, -700, 400],
  ["NGC 6946", 2150, 800, 500]
];

/* =========================================================
   UTILITIES
   ========================================================= */

function addObject(object) {
  objects.push(object);
  return object;
}

function glowTexture(size = 64) {

  const c = document.createElement("canvas");

  c.width = size;
  c.height = size;

  const ctx = c.getContext("2d");

  const g = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );

  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(.12, "rgba(255,255,255,.95)");
  g.addColorStop(.35, "rgba(255,255,255,.35)");
  g.addColorStop(1, "rgba(255,255,255,0)");

  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(c);

  texture.colorSpace = THREE.SRGBColorSpace;

  return texture;
}

const glow = glowTexture();

/* =========================================================
   STARS
   ========================================================= */

function createStars(count) {

  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  for (let i = 0; i < count; i++) {

    const r = 80 + Math.random() * 900;

    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i * 3] =
      r * Math.sin(phi) * Math.cos(theta);

    positions[i * 3 + 1] =
      r * Math.cos(phi);

    positions[i * 3 + 2] =
      r * Math.sin(phi) * Math.sin(theta);

    sizes[i] =
      .5 + Math.random() * 1.7;
  }

  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: innerWidth < 700 ? .55 : .75,
    map: glow,
    transparent: true,
    opacity: .8,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  scene.add(new THREE.Points(
    geometry,
    material
  ));
}

createStars(
  innerWidth < 700 ? 2400 : 5200
);

/* =========================================================
   SUN
   ========================================================= */

const sun = new THREE.Mesh(
  new THREE.SphereGeometry(2.1, 32, 32),
  new THREE.MeshBasicMaterial({
    color: 0xffb347
  })
);

scene.add(sun);

addObject({
  name: "Sun",
  type: "STAR",
  object: sun
});

const sunLight = new THREE.PointLight(
  0xffffff,
  1200,
  500
);

scene.add(sunLight);

/* =========================================================
   ORBITS
   ========================================================= */

function createOrbit(radius) {

  const points = [];

  for (let i = 0; i <= 128; i++) {

    const a =
      (i / 128) * Math.PI * 2;

    points.push(
      new THREE.Vector3(
        Math.cos(a) * radius,
        0,
        Math.sin(a) * radius
      )
    );
  }

  const geometry =
    new THREE.BufferGeometry()
      .setFromPoints(points);

  const material =
    new THREE.LineBasicMaterial({
      color: 0x426080,
      transparent: true,
      opacity: .24
    });

  return new THREE.Line(
    geometry,
    material
  );
}

/* =========================================================
   PLANETS
   ========================================================= */

const planetMeshes = [];

for (const p of planets) {

  scene.add(createOrbit(p.distance));

  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(
      p.radius,
      innerWidth < 700 ? 18 : 28,
      innerWidth < 700 ? 18 : 28
    ),
    new THREE.MeshStandardMaterial({
      color: p.color,
      roughness: .8,
      metalness: .05
    })
  );

  mesh.userData = p;

  scene.add(mesh);

  planetMeshes.push({
    mesh,
    data: p
  });

  addObject({
    ...p,
    object: mesh
  });

  if (p.name === "Saturn") {

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(
        p.radius * 1.45,
        p.radius * 2.35,
        64
      ),
      new THREE.MeshBasicMaterial({
        color: 0xb7a47d,
        transparent: true,
        opacity: .62,
        side: THREE.DoubleSide
      })
    );

    ring.rotation.x =
      Math.PI / 2.15;

    mesh.add(ring);
  }
}

/* =========================================================
   ASTEROID BELT
   ========================================================= */

function createAsteroidBelt() {

  const count =
    innerWidth < 700 ? 500 : 1000;

  const positions =
    new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {

    const a =
      Math.random() * Math.PI * 2;

    const r =
      14 + Math.random() * 2.4;

    positions[i * 3] =
      Math.cos(a) * r;

    positions[i * 3 + 1] =
      (Math.random() - .5) * .6;

    positions[i * 3 + 2] =
      Math.sin(a) * r;
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
      color: 0x8c806f,
      size: .08,
      transparent: true,
      opacity: .6
    });

  scene.add(
    new THREE.Points(
      geometry,
      material
    )
  );
}

setTimeout(
  createAsteroidBelt,
  250
);

/* =========================================================
   GALAXIES
   ========================================================= */

function createGalaxyTexture() {

  const size = 256;

  const c =
    document.createElement("canvas");

  c.width = size;
  c.height = size;

  const ctx = c.getContext("2d");

  const cx = size / 2;
  const cy = size / 2;

  const gradient =
    ctx.createRadialGradient(
      cx,
      cy,
      2,
      cx,
      cy,
      size / 2
    );

  gradient.addColorStop(
    0,
    "rgba(255,255,255,1)"
  );

  gradient.addColorStop(
    .08,
    "rgba(255,245,210,.9)"
  );

  gradient.addColorStop(
    .3,
    "rgba(150,190,255,.35)"
  );

  gradient.addColorStop(
    1,
    "rgba(0,0,0,0)"
  );

  ctx.fillStyle = gradient;

  ctx.fillRect(
    0,
    0,
    size,
    size
  );

  for (let i = 0; i < 700; i++) {

    const angle =
      Math.random() * Math.PI * 2;

    const radius =
      Math.pow(Math.random(), .65) *
      size * .43;

    const x =
      cx + Math.cos(angle) * radius;

    const y =
      cy + Math.sin(angle) *
      radius * .42;

    ctx.fillStyle =
      `rgba(255,255,255,${Math.random() * .55})`;

    ctx.fillRect(
      x,
      y,
      1,
      1
    );
  }

  return new THREE.CanvasTexture(c);
}

let galaxyTexture;

function createGalaxy(data) {

  if (!galaxyTexture) {
    galaxyTexture =
      createGalaxyTexture();
  }

  const [name, x, y, z] =
    data;

  const material =
    new THREE.SpriteMaterial({
      map: galaxyTexture,
      transparent: true,
      opacity: .9,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

  const sprite =
    new THREE.Sprite(material);

  const size =
    name === "Milky Way"
      ? 70
      : 20 + Math.random() * 25;

  sprite.scale.set(
    size,
    size * .62,
    1
  );

  sprite.position.set(
    x,
    y,
    z
  );

  sprite.userData = {
    name,
    type: "GALAXY"
  };

  scene.add(sprite);

  addObject({
    name,
    type: "GALAXY",
    object: sprite,
    description:
      "Catalogue galaxy represented in the COSMOS deep-space layer."
  });
}

/* =========================================================
   PROGRESSIVE GALAXY LOADING
   ========================================================= */

let galaxyIndex = 0;

function loadGalaxyBatch() {

  if (galaxyIndex >= galaxies.length)
    return;

  createGalaxy(
    galaxies[galaxyIndex]
  );

  galaxyIndex++;

  requestAnimationFrame(
    loadGalaxyBatch
  );
}

setTimeout(
  loadGalaxyBatch,
  900
);

/* =========================================================
   PLANET POSITION ENGINE
   ========================================================= */

let selectedDate =
  new Date();

function daysSinceJ2000(date) {

  return (
    date.getTime() -
    Date.UTC(
      2000,
      0,
      1,
      12
    )
  ) / 86400000;
}

function updatePlanetPositions() {

  const days =
    daysSinceJ2000(
      selectedDate
    );

  for (const item of planetMeshes) {

    const p = item.data;

    const angle =
      (
        days /
        p.period
      ) *
      Math.PI *
      2;

    item.mesh.position.x =
      Math.cos(angle) *
      p.distance;

    item.mesh.position.z =
      Math.sin(angle) *
      p.distance;

    item.mesh.position.y =
      Math.sin(angle * .37) *
      p.distance *
      .015;

    item.mesh.rotation.y +=
      .002;
  }
}

/* =========================================================
   TIME UI
   ========================================================= */

const dateInput =
  document.getElementById(
    "dateInput"
  );

const timeReadout =
  document.getElementById(
    "timeReadout"
  );

function formatDate(date) {

  return date
    .toLocaleString(
      undefined,
      {
        dateStyle: "medium",
        timeStyle: "medium"
      }
    );
}

function updateTimeUI() {

  const local =
    new Date(
      selectedDate.getTime() -
      selectedDate.getTimezoneOffset() *
      60000
    )
      .toISOString()
      .slice(0,16);

  dateInput.value =
    local;

  timeReadout.textContent =
    formatDate(
      selectedDate
    );

  updatePlanetPositions();
}

dateInput.addEventListener(
  "change",
  () => {

    selectedDate =
      new Date(
        dateInput.value
      );

    updateTimeUI();
  }
);

document
  .getElementById("presentBtn")
  .onclick = () => {

    selectedDate =
      new Date();

    updateTimeUI();
  };

document
  .getElementById("nowBtn")
  .onclick = () => {

    selectedDate =
      new Date();

    updateTimeUI();
  };

document
  .getElementById("pastBtn")
  .onclick = () => {

    selectedDate =
      new Date(
        selectedDate.getTime() -
        365.25 *
        86400000
      );

    updateTimeUI();
  };

document
  .getElementById("futureBtn")
  .onclick = () => {

    selectedDate =
      new Date(
        selectedDate.getTime() +
        365.25 *
        86400000
      );

    updateTimeUI();
  };

updateTimeUI();

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
  .getElementById("searchBtn")
  .onclick = () => {

    searchPanel.classList.toggle(
      "hidden"
    );

    if (!searchPanel.classList.contains("hidden")) {
      searchInput.focus();
    }
  };

searchInput.addEventListener(
  "input",
  () => {

    const query =
      searchInput.value
        .trim()
        .toLowerCase();

    searchResults.innerHTML = "";

    if (!query)
      return;

    const matches =
      objects
        .filter(
          o =>
            o.name
              .toLowerCase()
              .includes(query)
        )
        .slice(0, 12);

    for (const item of matches) {

      const div =
        document.createElement("div");

      div.className =
        "result";

      div.innerHTML = `
        <div class="result-name">
          ${item.name}
        </div>
        <div class="result-type">
          ${item.type}
        </div>
      `;

      div.onclick = () => {

        focusObject(
          item.object
        );

        showInfo(
          item
        );

        searchPanel.classList.add(
          "hidden"
        );
      };

      searchResults.appendChild(
        div
      );
    }
  });

/* =========================================================
   OBJECT FOCUS
   ========================================================= */

function focusObject(object) {

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
    position
      .clone()
      .add(
        direction.multiplyScalar(
          Math.max(
            object.scale.x * 4,
            8
          )
        )
      )
  );

  controls.update();
}

function showInfo(item) {

  const panel =
    document.getElementById(
      "infoPanel"
    );

  const content =
    document.getElementById(
      "infoContent"
    );

  content.innerHTML = `
    <div class="info-title">
      ${item.name}
    </div>

    <div class="info-type">
      ${item.type}
    </div>

    <div class="info-line">
      ${item.description ||
        "COSMOS astronomical object."}
    </div>
  `;

  panel.classList.remove(
    "hidden"
  );
}

document
  .getElementById("closeInfo")
  .onclick = () => {

    document
      .getElementById(
        "infoPanel"
      )
      .classList.add(
        "hidden"
      );
  };

/* =========================================================
   SCALE BUTTONS
   ========================================================= */

document
  .querySelectorAll(
    "[data-scale]"
  )
  .forEach(
    button => {

      button.onclick = () => {

        const scale =
          button.dataset.scale;

        if (scale === "system") {

          camera.position.set(
            0,
            18,
            45
          );

          controls.target.set(
            0,
            0,
            0
          );
        }

        if (scale === "galaxy") {

          camera.position.set(
            0,
            150,
            350
          );

          controls.target.set(
            0,
            0,
            0
          );
        }

        if (scale === "universe") {

          camera.position.set(
            0,
            900,
            1800
          );

          controls.target.set(
            0,
            0,
            0
          );
        }

        controls.update();
      };
    }
  );

/* =========================================================
   CLICK OBJECTS
   ========================================================= */

const raycaster =
  new THREE.Raycaster();

const pointer =
  new THREE.Vector2();

function pointerSelect(
  event
) {

  const rect =
    canvas.getBoundingClientRect();

  pointer.x =
    ((event.clientX - rect.left) /
      rect.width) *
    2 - 1;

  pointer.y =
    -((event.clientY - rect.top) /
      rect.height) *
    2 + 1;

  raycaster.setFromCamera(
    pointer,
    camera
  );

  const hits =
    raycaster.intersectObjects(
      scene.children,
      true
    );

  if (!hits.length)
    return;

  let selected =
    hits[0].object;

  while (
    selected &&
    !selected.userData?.name &&
    selected.parent
  ) {
    selected =
      selected.parent;
  }

  if (
    selected?.userData?.name
  ) {

    const found =
      objects.find(
        o =>
          o.object === selected
      );

    if (found) {
      showInfo(found);
    }
  }
}

canvas.addEventListener(
  "click",
  pointerSelect
);

/* =========================================================
   RESIZE
   ========================================================= */

addEventListener(
  "resize",
  () => {

    camera.aspect =
      innerWidth /
      innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      innerWidth,
      innerHeight,
      false
    );

    renderer.setPixelRatio(
      innerWidth < 700
        ? 1
        : Math.min(
            devicePixelRatio,
            1.25
          )
    );
  }
);

/* =========================================================
   RENDER LOOP
   ========================================================= */

function animate() {

  requestAnimationFrame(
    animate
  );

  const elapsed =
    clock.getElapsedTime();

  controls.update();

  sun.scale.setScalar(
    1 +
    Math.sin(elapsed * 2) *
    .015
  );

  renderer.render(
    scene,
    camera
  );
}

animate();

/* =========================================================
   READY
   ========================================================= */

document.getElementById(
  "statusText"
).textContent =
  "COSMOS READY — 3D ENGINE ONLINE";
