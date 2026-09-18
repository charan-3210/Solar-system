import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.186.0/build/three.module.js";


/* =====================================================
   COSMOS LIVE
===================================================== */

const app =
    document.getElementById("app");


const scene =
    new THREE.Scene();


scene.background =
    new THREE.Color(0x000003);


const camera =
    new THREE.PerspectiveCamera(
        55,
        innerWidth / innerHeight,
        .01,
        100000
    );


camera.position.set(
    0,
    25,
    80
);


const renderer =
    new THREE.WebGLRenderer({
        antialias:true,
        powerPreference:
            "high-performance"
    });


renderer.setPixelRatio(
    Math.min(
        devicePixelRatio,
        2
    )
);


renderer.setSize(
    innerWidth,
    innerHeight
);


renderer.outputColorSpace =
    THREE.SRGBColorSpace;


renderer.toneMapping =
    THREE.ACESFilmicToneMapping;


renderer.toneMappingExposure =
    1.15;


app.appendChild(renderer.domElement);


/* =====================================================
   LIGHT
===================================================== */

scene.add(
    new THREE.AmbientLight(
        0x445577,
        .18
    )
);


const sunlight =
    new THREE.PointLight(
        0xffffff,
        5,
        0,
        2
    );


scene.add(sunlight);


/* =====================================================
   MAIN GROUP
===================================================== */

const cosmos =
    new THREE.Group();


scene.add(cosmos);


/* =====================================================
   STARFIELD
===================================================== */

function createStars(){

    const count =
        22000;

    const positions =
        new Float32Array(
            count * 3
        );

    const colors =
        new Float32Array(
            count * 3
        );


    for(
        let i=0;
        i<count;
        i++
    ){

        const radius =
            1000 +
            Math.random() * 6000;


        const theta =
            Math.random() *
            Math.PI * 2;


        const phi =
            Math.acos(
                2 * Math.random() - 1
            );


        positions[i*3] =
            radius *
            Math.sin(phi) *
            Math.cos(theta);


        positions[i*3+1] =
            radius *
            Math.sin(phi) *
            Math.sin(theta);


        positions[i*3+2] =
            radius *
            Math.cos(phi);


        const brightness =
            .45 +
            Math.random()*.55;


        colors[i*3] =
            brightness;

        colors[i*3+1] =
            brightness;

        colors[i*3+2] =
            brightness;
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

            size:1.8,

            sizeAttenuation:true,

            vertexColors:true,

            transparent:true,

            opacity:.9

        });


    const stars =
        new THREE.Points(
            geometry,
            material
        );


    cosmos.add(stars);

    return stars;
}


const stars =
    createStars();


/* =====================================================
   MILKY WAY
===================================================== */

function createGalaxy(){

    const positions=[];

    const arms=6;

    const points=14000;


    for(
        let i=0;
        i<points;
        i++
    ){

        const arm =
            i % arms;


        const radius =
            Math.random()*500;


        const angle =
            arm /
            arms *
            Math.PI*2
            +
            radius*.018
            +
            (Math.random()-.5)*.55;


        const x =
            Math.cos(angle)*radius;


        const z =
            Math.sin(angle)*radius;


        const y =
            (Math.random()-.5)
            *
            20
            *
            (1-radius/550);


        positions.push(
            x,
            y,
            z
        );
    }


    const geometry =
        new THREE.BufferGeometry();


    geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(
            positions,
            3
        )
    );


    const material =
        new THREE.PointsMaterial({

            color:0xa9c9ff,

            size:1,

            transparent:true,

            opacity:.45

        });


    const galaxy =
        new THREE.Points(
            geometry,
            material
        );


    galaxy.rotation.x=.12;

    cosmos.add(galaxy);

    return galaxy;
}


const galaxy =
    createGalaxy();


/* =====================================================
   SUN
===================================================== */

const sun =
    new THREE.Mesh(

        new THREE.SphereGeometry(
            5,
            64,
            64
        ),

        new THREE.MeshBasicMaterial({
            color:0xffcc55
        })

    );


cosmos.add(sun);


/* glow */

function glow(size,opacity){

    return new THREE.Mesh(

        new THREE.SphereGeometry(
            size,
            32,
            32
        ),

        new THREE.MeshBasicMaterial({

            color:0xffa52e,

            transparent:true,

            opacity,

            blending:
                THREE.AdditiveBlending,

            side:
                THREE.BackSide

        })

    );
}


sun.add(
    glow(6,.25)
);

sun.add(
    glow(8,.07)
);


/* =====================================================
   PLANETS
===================================================== */

const planetInfo=[

    {
        name:"Mercury",
        radius:.65,
        distance:9,
        period:87.969,
        color:0x9d9388
    },

    {
        name:"Venus",
        radius:1,
        distance:13,
        period:224.701,
        color:0xd5ad78
    },

    {
        name:"Earth",
        radius:1.05,
        distance:18,
        period:365.256,
        color:0x367ec4
    },

    {
        name:"Mars",
        radius:.8,
        distance:23,
        period:686.98,
        color:0xb9563b
    },

    {
        name:"Jupiter",
        radius:2.8,
        distance:32,
        period:4332.59,
        color:0xc69b72
    },

    {
        name:"Saturn",
        radius:2.4,
        distance:42,
        period:10759.22,
        color:0xd3bd87
    },

    {
        name:"Uranus",
        radius:1.65,
        distance:53,
        period:30688.5,
        color:0x70c6d4
    },

    {
        name:"Neptune",
        radius:1.6,
        distance:64,
        period:60182,
        color:0x4168bd
    }

];


const planets={};


for(
    const data of planetInfo
){

    const mesh =
        new THREE.Mesh(

            new THREE.SphereGeometry(
                data.radius,
                48,
                48
            ),

            new THREE.MeshStandardMaterial({

                color:data.color,

                roughness:.82

            })

        );


    mesh.userData =
        data;


    cosmos.add(mesh);

    planets[data.name]=mesh;
}


/* =====================================================
   SATURN RINGS
===================================================== */

const ring =
    new THREE.Mesh(

        new THREE.RingGeometry(
            3.2,
            4.8,
            128
        ),

        new THREE.MeshBasicMaterial({

            color:0xb8a477,

            transparent:true,

            opacity:.65,

            side:
                THREE.DoubleSide

        })

    );


ring.rotation.x =
    Math.PI/2;


planets.Saturn.add(
    ring
);


/* =====================================================
   ORBITS
===================================================== */

for(
    const planet of planetInfo
){

    const points=[];


    for(
        let i=0;
        i<=256;
        i++
    ){

        const a =
            i/256*
            Math.PI*2;


        points.push(

            new THREE.Vector3(

                Math.cos(a)*
                planet.distance,

                0,

                Math.sin(a)*
                planet.distance

            )

        );

    }


    const geometry =
        new THREE.BufferGeometry()
            .setFromPoints(
                points
            );


    const line =
        new THREE.LineLoop(

            geometry,

            new THREE.LineBasicMaterial({

                color:0x53647d,

                transparent:true,

                opacity:.23

            })

        );


    cosmos.add(line);
}


/* =====================================================
   MOON
===================================================== */

const moon =
    new THREE.Mesh(

        new THREE.SphereGeometry(
            .28,
            24,
            24
        ),

        new THREE.MeshStandardMaterial({

            color:0xaaa9a5,

            roughness:1

        })

    );


planets.Earth.add(
    moon
);


/* =====================================================
   ASTEROID BELT
===================================================== */

const asteroidPositions=[];


for(
    let i=0;
    i<4000;
    i++
){

    const a =
        Math.random()*
        Math.PI*2;


    const r =
        26+
        Math.random()*4;


    asteroidPositions.push(

        Math.cos(a)*r,

        (Math.random()-.5)*1.5,

        Math.sin(a)*r

    );
}


const asteroidGeometry =
    new THREE.BufferGeometry();


asteroidGeometry.setAttribute(

    "position",

    new THREE.Float32BufferAttribute(
        asteroidPositions,
        3
    )

);


cosmos.add(

    new THREE.Points(

        asteroidGeometry,

        new THREE.PointsMaterial({

            color:0x89796b,

            size:.13,

            transparent:true,

            opacity:.65

        })

    )

);


/* =====================================================
   ASTRONOMICAL CATALOGUE
===================================================== */

const catalogue=[

    ["Sun","Star","Solar System"],
    ["Mercury","Planet","Solar System"],
    ["Venus","Planet","Solar System"],
    ["Earth","Planet","Solar System"],
    ["Mars","Planet","Solar System"],
    ["Jupiter","Planet","Solar System"],
    ["Saturn","Planet","Solar System"],
    ["Uranus","Planet","Solar System"],
    ["Neptune","Planet","Solar System"],

    ["Moon","Natural Satellite","Earth"],

    ["Andromeda Galaxy","Galaxy","Local Group"],
    ["Triangulum Galaxy","Galaxy","Local Group"],
    ["Large Magellanic Cloud","Galaxy","Local Group"],
    ["Small Magellanic Cloud","Galaxy","Local Group"],

    ["Proxima Centauri","Star","Nearby Stars"],
    ["TRAPPIST-1","Planetary System","Exoplanets"],
    ["Kepler-90","Planetary System","Exoplanets"],
    ["55 Cancri","Planetary System","Exoplanets"],
    ["TOI-700","Planetary System","Exoplanets"]

];


/* =====================================================
   TIME ENGINE
===================================================== */

let selectedDate =
    new Date();


function updateTime(){

    const input =
        document.getElementById(
            "date"
        );


    const local =
        new Date(

            selectedDate.getTime()
            -
            selectedDate.getTimezoneOffset()
            *60000

        );


    input.value =
        local
            .toISOString()
            .slice(0,16);


    document.getElementById(
        "timeText"
    ).textContent =
        selectedDate.toLocaleString();

}


updateTime();


function j2000(date){

    return (

        date.getTime()
        -
        Date.UTC(
            2000,
            0,
            1,
            12,
            0,
            0
        )

    )/86400000;

}


function updatePositions(){

    const days =
        j2000(
            selectedDate
        );


    for(
        const p of planetInfo
    ){

        const planet =
            planets[p.name];


        const angle =
            days /
            p.period *
            Math.PI*2;


        planet.position.x =
            Math.cos(angle)
            *
            p.distance;


        planet.position.z =
            Math.sin(angle)
            *
            p.distance;

    }


    const moonAngle =
        days /
        27.321661 *
        Math.PI*2;


    moon.position.set(

        Math.cos(moonAngle)*2.1,

        0,

        Math.sin(moonAngle)*2.1

    );
}


updatePositions();


/* =====================================================
   SCALE
===================================================== */

const scaleNames=[

    "OBSERVABLE UNIVERSE",
    "LOCAL GROUP",
    "MILKY WAY",
    "PLANETARY SYSTEMS",
    "SOLAR SYSTEM",
    "EARTH",
    "COUNTRY / STATE",
    "CITY / STREET"

];


const cameras=[

    [0,700,1400],
    [0,400,700],
    [0,220,380],
    [0,120,210],
    [0,25,80],
    [0,5,13],
    [0,2.8,7],
    [0,1.2,3.2]

];


let scaleIndex=4;

let desired =
    new THREE.Vector3(
        ...cameras[4]
    );


function setScale(i){

    scaleIndex =
        Math.max(
            0,
            Math.min(
                7,
                Number(i)
            )
        );


    desired.set(
        ...cameras[
            scaleIndex
        ]
    );


    document.getElementById(
        "scale"
    ).value =
        scaleIndex;


    document.getElementById(
        "scaleText"
    ).textContent =
        scaleNames[
            scaleIndex
        ];

}


document.getElementById(
    "scale"
).addEventListener(
    "input",
    e =>
        setScale(
            e.target.value
        )
);


/* =====================================================
   CAMERA CONTROL
===================================================== */

let yaw=0;

let pitch=.2;

let dragging=false;

let px=0;

let py=0;


renderer.domElement
.addEventListener(
    "pointerdown",
    e=>{

        dragging=true;

        px=e.clientX;
        py=e.clientY;

    }
);


window.addEventListener(
    "pointerup",
    ()=>{
        dragging=false;
    }
);


window.addEventListener(
    "pointermove",
    e=>{

        if(!dragging)
            return;


        yaw -=
            (e.clientX-px)*.004;


        pitch -=
            (e.clientY-py)*.003;


        pitch =
            THREE.MathUtils.clamp(
                pitch,
                -.9,
                .9
            );


        px=e.clientX;
        py=e.clientY;

    }
);


renderer.domElement
.addEventListener(
    "wheel",
    e=>{

        e.preventDefault();

        setScale(

            scaleIndex +
            (e.deltaY>0?1:-1)

        );

    },
    {
        passive:false
    }
);


/* =====================================================
   PRESENT
===================================================== */

document.getElementById(
    "present"
).onclick=()=>{

    selectedDate =
        new Date();

    updateTime();

    updatePositions();

};


/* =====================================================
   DATE BUTTONS
===================================================== */

function changeDay(n){

    selectedDate.setDate(
        selectedDate.getDate()+n
    );

    updateTime();

    updatePositions();

}


document.getElementById(
    "previous"
).onclick =
    ()=>changeDay(-1);


document.getElementById(
    "next"
).onclick =
    ()=>changeDay(1);


document.getElementById(
    "date"
).onchange =
    e=>{

        selectedDate =
            new Date(
                e.target.value
            );

        updateTime();

        updatePositions();

    };


/* =====================================================
   SEARCH
===================================================== */

const searchPanel =
    document.getElementById(
        "searchPanel"
    );


const searchInput =
    document.getElementById(
        "searchInput"
    );


document.getElementById(
    "searchButton"
).onclick=()=>{

    searchPanel
        .classList
        .remove("hidden");

    searchInput.focus();

};


document.getElementById(
    "closeSearch"
).onclick=()=>{

    searchPanel
        .classList
        .add("hidden");

};


searchInput.oninput=()=>{

    const q =
        searchInput
            .value
            .toLowerCase()
            .trim();


    const results =
        document.getElementById(
            "results"
        );


    results.innerHTML="";


    if(!q)
        return;


    catalogue
        .filter(
            x =>
                x[0]
                .toLowerCase()
                .includes(q)
        )
        .forEach(
            x=>{

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "result";


                div.innerHTML =
                    `
                    <b>${x[0]}</b>
                    <small>
                        ${x[1]} · ${x[2]}
                    </small>
                    `;


                div.onclick =
                    ()=>showObject(x);


                results.appendChild(
                    div
                );

            }
        );

};


/* =====================================================
   OBJECT PANEL
===================================================== */

function showObject(x){

    document.getElementById(
        "objectPanel"
    )
    .classList
    .remove("hidden");


    document.getElementById(
        "objectName"
    ).textContent=x[0];


    document.getElementById(
        "objectDescription"
    ).textContent =
        `${x[0]} is a catalogued ${x[1]} in the ${x[2]} scale of this explorer.`;


    document.getElementById(
        "objectDataType"
    ).textContent=x[1];


    document.getElementById(
        "objectStatus"
    ).textContent="CATALOGUED";


    document.getElementById(
        "objectScale"
    ).textContent=x[2];


    searchPanel
        .classList
        .add("hidden");


    if(
        planets[x[0]]
    ){

        const p =
            planets[x[0]];


        desired.copy(
            p.position
        );


        desired.z += 15;

    }

}


document.getElementById(
    "closeObject"
).onclick=()=>{

    document.getElementById(
        "objectPanel"
    )
    .classList
    .add("hidden");

};


/* =====================================================
   ANIMATION
===================================================== */

const clock =
    new THREE.Clock();


function animate(){

    requestAnimationFrame(
        animate
    );


    const elapsed =
        clock.getElapsedTime();


    galaxy.rotation.y =
        elapsed*.00015;


    stars.rotation.y =
        elapsed*.00001;


    sun.rotation.y +=
        .0003;


    for(
        const p of planetInfo
    ){

        planets[p.name]
            .rotation.y +=
            .0015;

    }


    const cp =
        desired.clone();


    cp.applyAxisAngle(
        new THREE.Vector3(
            0,1,0
        ),
        yaw
    );


    camera.position.lerp(
        cp,
        .045
    );


    camera.lookAt(
        0,
        0,
        0
    );


    renderer.render(
        scene,
        camera
    );

}


animate();


/* =====================================================
   RESIZE
===================================================== */

window.addEventListener(
    "resize",
    ()=>{

        camera.aspect =
            innerWidth/
            innerHeight;


        camera.updateProjectionMatrix();


        renderer.setSize(
            innerWidth,
            innerHeight
        );

    }
);


/* =====================================================
   STARTUP
===================================================== */

setTimeout(
    ()=>{
        document.getElementById(
            "loading"
        ).classList.add("hide");
    },
    700
);
