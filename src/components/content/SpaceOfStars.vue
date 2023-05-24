<template>
    <div class="space-of-stars" ref="root">
        <div class="block blur" v-if="profileOpen">
            <User :user="user"/>
            <Button @click="profileOpen = false">Close</Button>
        </div>
    </div>
</template>

<script lang="ts" setup>

import { ref, onMounted } from 'vue';

import Users, { IUser } from '../../libs/api/routes/users';

import User from '../cards/User.vue';

import * as THREE from 'three';
// import { Mesh } from 'three';
// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
// import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { AnaglyphEffect } from 'three/examples/jsm/effects/AnaglyphEffect.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const
    root = ref<HTMLElement | null>(null),
    user = ref<IUser>(),
    profileOpen = ref<Boolean>(false);

const
    scene = new THREE.Scene(),
    clock = new THREE.Clock(),
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }),
    camera = new THREE.PerspectiveCamera(76, window.innerWidth / window.innerHeight, 1, 1000),
    controls = new FlyControls(camera, renderer.domElement),
    composer = new EffectComposer(renderer),
    renderScene = new RenderPass(scene, camera),
    raycaster = new THREE.Raycaster();

const parts = new THREE.Group();

const focusObj: { is: boolean; pos: THREE.Vector3, cb?: Function } = {
    is: false,
    pos: new THREE.Vector3()
};

let users: Array<IUser> = [];

const bloomParams = {
    exposure: 1,
    bloomStrength: 3,
    bloomThreshold: 0,
    bloomRadius: 1,
};

onMounted(async () => {
    let [listUsers, status] = await Users.list({ limit: 500, fields: ['_id', 'color'] });
        
    if (status !== 200) return;
    
    users = listUsers.results;
    
    initRenderer();
    initControls();
    initLight();
    initBloom();
    initPlanets();

    root?.value?.appendChild(renderer.domElement);
});

// Renderer
function initRenderer() {
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 2.3;
    renderer.shadowMap.enabled = true;
    renderer.localClippingEnabled = true;
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
}


function initControls() {
    controls.movementSpeed = 20;
    controls.rollSpeed = Math.PI / 6;
    controls.autoForward = false;
    controls.dragToLook = false;
}


function addPointLight(h: number, s: number, l: number, x: number, y: number, z: number) {
    let light = new THREE.PointLight(0xffffff, 1.5, 2000);

    light.color.setHSL(h, s, l);
    light.position.set(x, y, z);

    scene.add(light);
}
function initLight() {
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.05);
            
    dirLight.position.set(0, - 1, 0).normalize();
    dirLight.color.setHSL(0.1, 0.7, 0.5);

    scene.add(dirLight);

    addPointLight(0.55, 0.9, 0.5, 5000, 0, -1000);
    addPointLight(0.08, 0.8, 0.5, 0, 0, -1000);
    addPointLight(0.995, 0.5, 0.9, 5000, 5000, -1000);
}


function initBloom() {
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, .4, .85);

    bloomPass.threshold = bloomParams.bloomThreshold;
    bloomPass.strength = bloomParams.bloomStrength;
    bloomPass.radius = bloomParams.bloomRadius;

    composer.addPass(renderScene);
    composer.addPass(bloomPass);
}


//#region Parts

const
    quantity = 10000,
    square = 1500;

function addPoints({ size = .2, square = 2000, color = 0xffffff, quantity = 10000 } = {}) {
    let geometry = new THREE.BufferGeometry(),
        vertices = [],
        r = () => (Math.random() * square + Math.random() * square) / 2 - square / 2;
    
    for (let i = 0; i < quantity; i++) {
        vertices.push(r(), r(), r())
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    let material = new THREE.PointsMaterial({ size, color });

    return new THREE.Points(geometry, material);
}

parts.add(addPoints({ quantity, square }));
parts.add(addPoints({ color: 0x8b00ff, quantity, square }));
parts.add(addPoints({ color: 0xba66ff, quantity, square }));
parts.add(addPoints({ color: 0x42aaff, quantity, square }));
parts.add(addPoints({ color: 0x00db6a, quantity, square }));

parts.position.copy(camera.position);

scene.add(parts);

//#endregion


//#region * Planets

// async function loadModel() {
//     let model = null,
//         loader = new GLTFLoader();
//         // dracoLoader = new DRACOLoader();

//     // dracoLoader.setDecoderPath('/src/assets/models/planets/');
//     // loader.setDRACOLoader(dracoLoader);

//     let gltf = await loader.loadAsync('/src/assets/models/planets/heart/scene.gltf');

//     model = gltf.scene;

//     let box3 = new THREE.Box3().setFromObject(model),
//         center = new THREE.Vector3();

//     box3.getCenter(center);
//     model.position.sub(center);
//     model.scale.set(.01, .01, .01);
//     model.traverse(n => {
//         n.castShadow = true;
//         n.receiveShadow = true;
//     });

//     return model;
// }

async function getCorePlanet(user: IUser) {
    let id = user._id.slice(4),
        idNumbers = id.split('').reverse().join('').match(/\d+/g)?.join(''),
        idStrings = id.match(/[a-zA-Z]/g)?.join('');

    let model = null,
        geometry,
        material = new THREE.MeshMatcapMaterial({ color: user.color });

    let n = (index: number) => Number(idNumbers![index]) || 0,
        size = n(1) < 1 ? .4 : (n(1) > 5 ? .15 : .1) * n(1);

    switch(Number(idNumbers![0])) {
        case 0:
            geometry = new THREE.BoxGeometry(size, size, size);
            break;
        case 1:
            geometry = new THREE.CapsuleGeometry(size, size, n(2) || 1, 3 * (n(3) || 1));
            break;
        case 2:
            geometry = new THREE.ConeGeometry(size, size * (n(2) > 5 ? 1 : 2), 3 * (n(3) || 1));
            break;
        case 3:
            geometry = new THREE.CylinderGeometry(size * (n(2) > 5 ? 1 : 2), size * (n(3) > 5 ? 1 : 2), size * 2, 3 * (n(4) || 1));
            break;
        case 4:
            geometry = new THREE.DodecahedronGeometry(size - .5, n(2) > 5 ? 1 : 0);
            break;
        case 5:
            geometry = new THREE.IcosahedronGeometry(size - .5, n(2) > 5 ? 1 : 0);
            break;
        case 6:
            geometry = new THREE.OctahedronGeometry(size - .5, n(2) > 5 ? 0 : 1);
            break;
        case 7:
            geometry = new THREE.SphereGeometry(size - .4, 3 * (n(2) || 1), 3 * (n(3) || 1), 0, Math.PI * 2, 0, Math.PI * (n(4) > 5 ? 1 : 2));
            break;
        case 8:
            geometry = new THREE.TetrahedronGeometry(size - .3, 11 % (n(2) || 1));
            break;
        case 9:
            // model = this.model;
            geometry = new THREE.PlaneGeometry(1, 1);
            // let loader = new GLTFLoader(),
            //     dracoLoader = new DRACOLoader();

            // dracoLoader.setDecoderPath('/src/assets/models/planets/');
            // loader.setDRACOLoader(dracoLoader);

            // let gltf = await loader.loadAsync('/src/assets/models/planets/heart/scene.gltf');

            // model = gltf.scene;

            // let box3 = new THREE.Box3().setFromObject(model),
            //     center = new THREE.Vector3();

            // box3.getCenter(center);
            // model.position.sub(center);
            // model.scale.set(.01, .01, .01);
            // model.traverse(n => {
            //     n.castShadow = true;
            //     n.receiveShadow = true;
            // });
            
            break;
    }
    
    if (model) return model;
    else {
        let planet = new THREE.Mesh(geometry, material);

        planet.userData = { user }

        return planet;
    }
}
function getTrashPlanet(user: IUser) {
    let id = user._id.slice(4),
        idNumbers = id.split('').reverse().join('').match(/\d+/g)?.join(''),
        n = (index: number) => Number(idNumbers![index]) || 0;
    
    let model = null;

    let type = 8;
    switch (type) {
        case 0:
            
            break;
        case 8:
            let t = [30, 12, 16];

            let group = new THREE.Group();

            for (let i = 0; i < n(1); i++) {
                let circleGeometry = new THREE.RingGeometry(1.15 + i, 1.17 + i, n(2) < 3 ? t[n(2)] : n(2), 0),
                    materialTrash = new THREE.MeshBasicMaterial({ color: 0xe8e8e8, side: THREE.DoubleSide }),
                    trash = new THREE.Mesh(circleGeometry, materialTrash);

                trash.rotation.x = n(3) * 10;

                group.add(trash);
            }

            model = group;
            break;
    }

    return model;
}
async function loadPlanets(scene: THREE.Scene) {
    let x = [0, 0],
        y = [0, 0],
        z = [0, 0];

    for (let i = 0; i < users?.length; i++) {
        let id = users[i]._id.slice(4),
            idNumbers = id.split('').reverse().join('').match(/\d+/g)?.join(''),
            n = (index: number) => Number(idNumbers![index]) || 0;

        let user = users[i],
            planet = await getCorePlanet(user),
            trash = getTrashPlanet(user);

        const group = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5), new THREE.MeshPhongMaterial({
            color: '#7975ff',
            opacity: 0,
            transparent: true
        }));

        group.userData = {
            ...user,
            index: i
        }

        group.add(planet);
        group.add(trash!);
                
        let random = () => (Math.random() - 0.5) * 500;

        group.position.set(random(), random(), random());
        group.rotation.set(n(0) * .5, n(1) * .3, n(2) * .7);

        let minMax = (arr: number[], p: number) => {
            if (arr[0] > p) arr[0] = p;
            if (arr[1] < p) arr[1] = p;
        }

        minMax(x, group.position.x);
        minMax(y, group.position.y);
        minMax(z, group.position.z);

        scene.add(group);
    }

    return { x, y, z };
}

async function initPlanets() {
    let { x, y, z } = await loadPlanets(scene);

    camera.position.set((x[0] + x[1]) / 2, (y[0] + y[1]) / 2, (z[0] + z[1]) / 2);
}

//#endregion


//#region * Effect

const effect = new AnaglyphEffect(renderer);

effect.setSize(window.innerWidth, window.innerHeight);

//#endregion


//#region * Events

const mouse = new THREE.Vector2();

function onWindowResize(camera: THREE.PerspectiveCamera, effect: AnaglyphEffect) {
    camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

    effect.setSize(window.innerWidth, window.innerHeight);
}

function getIntersects(event: MouseEvent) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    let intersects = raycaster.intersectObjects(scene.children, true);

    return intersects;
}

window.addEventListener('pointermove', (event: MouseEvent) => {
    if (profileOpen.value) return;

    event.preventDefault();

    let intersects = getIntersects(event);

    if (intersects.length < 1) return root['value']!['style']['cursor'] = 'default';

    let user = intersects[0].object.userData;

    if (!user._id) return;

    root['value']!['style']['cursor'] = 'pointer';
});

let cPos = controls.object.position;

window.addEventListener('pointerdown', (event: MouseEvent) => {
    event.preventDefault();

    let intersects = getIntersects(event);

    if (intersects.length < 1) return;

    let userData = intersects[0].object.userData;
                
    if (!userData._id || (profileOpen.value && user?.value?._id === userData?._id)) return;

    let pos = intersects[0].object?.position;

    focusObj.is = true;
    focusObj.pos = new THREE.Vector3(pos.x > cPos.x ? pos.x - 7 : pos.x + 7, pos.y > cPos.y ? pos.y - 7 : pos.y + 7, pos.z > cPos.z ? pos.z - 7 : pos.z + 7);
    focusObj['cb'] = async () => {
        let [resultUser, status] = await Users.get(userData?._id);
        
        if (status !== 200) return;

        user.value = resultUser;
        profileOpen.value = true;

        controls.object.lookAt(pos);
    }

    controls.object.lookAt(pos);
}, false);

window.addEventListener('resize', () => onWindowResize(camera, effect));

//#endregion


function rendering() {
    requestAnimationFrame(rendering);

    parts.rotation.x += 0.0004;
    parts.rotation.y += 0.0004;
    parts.rotation.z += 0.0004;

    animate();
}

function animate() {
    let delta = clock.getDelta();
    
    if (focusObj.is) {
        cPos.lerp(focusObj.pos, .1);
        
        if (Math.floor(cPos.x) === Math.floor(focusObj.pos.x)) {
            if (focusObj?.cb) focusObj?.cb();

            focusObj.is = false;
        }
    }
    
    if (!profileOpen.value) controls.update(delta);

    renderer.render(scene, camera);
}

rendering();

</script>

<style lang="scss" scoped>

.space-of-stars {
    position: relative;

    .block {
        width: 256px;
        padding: 12px;
        position: absolute;
        right: 5%;
        bottom: 5%;
        border-radius: 5px;
        border: 1px solid var(--background-secondary);

        .ui-button {
            margin: 12px 0 0 0;
        }
    }
}

</style>