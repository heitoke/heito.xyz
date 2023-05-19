<template>
    <div class="space-of-stars">
        <div class="block" v-if="profileOpen"
            :style="{ top: `${top}px`, left: `${left}px` }"
        >
            <Button @click="profileOpen = false">Close</Button>
        </div>
    </div>
</template>

<script lang="ts">

import { defineComponent, PropType } from 'vue';

import $api from '../../libs/api';
import Users from '../../libs/api/routes/users';

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

// import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare';

interface IData {
    top: number;
    left: number;
    model: THREE.Group;
    users: Array<{ _id: string, color: string }>;
    user: {
        _id?: string;
    },
    profileOpen: boolean;
}

interface IPoints {
    size: number;
    square: number;
    quantity: number;
    color: THREE.ColorRepresentation;
}

export default defineComponent({
    name: 'SpaceOfStars',
    computed: {},
    // props: {
    //     users: {
    //         type: Array as PropType<Array<{ _id: string, color: string }>>,
    //         default: []
    //     }
    // },
    data(): IData {
        return {
            top: 0,
            left: 0,
            model: new THREE.Group(),
            users: [],
            user: {},
            profileOpen: false
        };
    },
    watch: {},
    methods: {
        async init() {
            // this.model = await this.loadModel();
            
            const
                scene = new THREE.Scene(),
                clock = new THREE.Clock(),
                renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }),
                camera = new THREE.PerspectiveCamera(76, window.innerWidth / window.innerHeight, 1, 1000);

            // camera.position.z = 10;
            
            let bloomParams = {
                    exposure: 1,
                    bloomStrength: 3,
                    bloomThreshold: 0,
                    bloomRadius: 1,
                };

            // Renderer
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.toneMapping = THREE.ReinhardToneMapping;
            renderer.toneMappingExposure = 2.3;
            renderer.shadowMap.enabled = true;
            renderer.localClippingEnabled = true;
            renderer.setClearColor(0x000000, 0);
            renderer.setSize(window.innerWidth, window.innerHeight);

            let controls = new FlyControls( camera, renderer.domElement );
            controls.movementSpeed = 20;
            controls.rollSpeed = Math.PI / 6;
            controls.autoForward = false;
            controls.dragToLook = false;

            const dirLight = new THREE.DirectionalLight( 0xffffff, 0.05 );
            
            dirLight.position.set( 0, - 1, 0 ).normalize();
            dirLight.color.setHSL( 0.1, 0.7, 0.5 );
            scene.add( dirLight );

            addLight(0.55, 0.9, 0.5, 5000, 0, - 1000);
            addLight(0.08, 0.8, 0.5, 0, 0, - 1000);
            addLight(0.995, 0.5, 0.9, 5000, 5000, - 1000);

            function addLight(h: number, s: number, l: number, x: number, y: number, z: number) {
                let light = new THREE.PointLight(0xffffff, 1.5, 2000);

                light.color.setHSL(h, s, l);
                light.position.set(x, y, z);

                scene.add(light);
            }

            const
                composer = new EffectComposer(renderer),
                renderScene = new RenderPass(scene, camera);

            // Bloom
            const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, .4, .85);
            bloomPass.threshold = bloomParams.bloomThreshold;
            bloomPass.strength = bloomParams.bloomStrength;
            bloomPass.radius = bloomParams.bloomRadius;
            composer.addPass(renderScene);
            composer.addPass(bloomPass);

            let { x, y, z } = await this.loadPlanets(scene);
            camera.position.set((x[0] + x[1]) / 2, (y[0] + y[1]) / 2, (z[0] + z[1]) / 2)


            let parts = new THREE.Group(),
                quantity = 10000,
                square = 2000;

            parts.add(this.addPoints({ quantity, square }));
            parts.add(this.addPoints({ color: 0x8b00ff, quantity, square }));
            parts.add(this.addPoints({ color: 0xba66ff, quantity, square }));
            parts.add(this.addPoints({ color: 0x42aaff, quantity, square }));
            parts.add(this.addPoints({ color: 0x00db6a, quantity, square }));

            parts.position.set(camera.position.x, camera.position.y, camera.position.z);

            scene.add(parts);

            let effect = new AnaglyphEffect(renderer);
            effect.setSize(window.innerWidth, window.innerHeight);

            let raycaster = new THREE.Raycaster(),
                mouse = new THREE.Vector2();

            window.addEventListener('pointerenter', (event: MouseEvent) => {
                event.preventDefault();

                mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

                raycaster.setFromCamera(mouse, camera);
                let intersects = raycaster.intersectObjects(scene.children, true);

                if (intersects.length < 1) return;

                console.log('hover');
                
            });

            window.addEventListener('pointerdown', (event: MouseEvent) => {
                event.preventDefault();

                mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

                raycaster.setFromCamera(mouse, camera);
                let intersects = raycaster.intersectObjects(scene.children, true);

                if (intersects.length < 1) return;

                let user = intersects[0].object.userData;
                
                if (!user._id) return;
                
                console.log('intersects', user);

                this.top = event.clientY;
                this.left = event.clientX;

                this.user = user;
                // this.profileOpen = true;

                let obj = intersects[0].object.parent!;
                let pos = obj?.position;
                let scale = obj?.scale;

                console.log(scale, obj);
                
                
                // controls.object.position.set(pos.x + 1, pos.y + 1, pos.z + 1);
                // controls.object.position.set(pos.x + 1.5, pos.y + 1.5, pos.z + 7);
                // controls.object.lookAt(pos);

                new Promise(res => {
                    let x = controls.object.position.x;

                    let timer = setInterval(async () => {
                        x += .5;

                        controls.object.position.set(x, pos.y + 1.5, pos.z + 7);
                        controls.object.lookAt(pos);

                        if (x >= (pos.x + 1.5)) {
                            clearInterval(timer);
                            return res(1);
                        }
                    }, Math.round(1000 / (pos.z + 7)));
                }).then(() => {
                    let x = controls.object.position.x + 4;

                    let timer = setInterval(() => {
                        controls.object.position.x += .5;

                        if (controls.object.position.x >= x) {
                            clearInterval(timer);
                            return this.profileOpen = true;
                        }
                    });
                })


                // setTimeout(() => {
                //     window.addEventListener('click', () => {
                //         this.top = -999;
                //         this.left = -999;
                //     }, { once: true });
                // }, 100)
            }, false);
            
            window.addEventListener('resize', () => this.onWindowResize(camera, effect));

            let el: Element = this.$el,
                self = this;
            el.appendChild(renderer.domElement);

            function rendering() {
                requestAnimationFrame(rendering);

                // if (!self.profileOpen) {
                //     scene.rotation.x += 0.0009;
                //     scene.rotation.y += 0.0009;
                //     scene.rotation.z += 0.0009;
                // }

                render();
            }
            rendering()
            
            function render() {
                let delta = clock.getDelta();

                controls.update(self.profileOpen ? 0.0005 : delta);

                renderer.render(scene, camera);
            }
        },
        onWindowResize(camera: THREE.PerspectiveCamera, effect: AnaglyphEffect) {
            camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();

            effect.setSize(window.innerWidth, window.innerHeight);
        },
        async getCorePlanet(user: { _id: string, color: string }) {
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
        },
        getTrashPlanet(user: { _id: string, color: string }) {
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
        },
        async loadPlanets(scene: THREE.Scene) {
            let x = [0, 0],
                y = [0, 0],
                z = [0, 0];
            
            for (let i = 0; i < this.users.length; i++) {
                let id = this.users[i]._id.slice(4),
                    idNumbers = id.split('').reverse().join('').match(/\d+/g)?.join(''),
                    n = (index: number) => Number(idNumbers![index]) || 0;
                
                let user = this.users[i],
                    group = new THREE.Group(),
                    planet = await this.getCorePlanet(user),
                    trash = this.getTrashPlanet(user);
                    
                // planet.layers.set(1);

                group.userData = trash!.userData = planet.userData = {
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
        },
        addPoints({ size = .2, square = 2000, color = 0xffffff, quantity = 10000 } = {}) {
            let geometry = new THREE.BufferGeometry(),
                vertices = [],
                r = () => (Math.random() * square + Math.random() * square) / 2 - square / 2;
            
            for (let i = 0; i < quantity; i++) {
                vertices.push(r(), r(), r())
            }

            geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

            let material = new THREE.PointsMaterial({ size, color });

            return new THREE.Points(geometry, material);
        },
        // async loadModel() {
        //     let model = null,
        //         loader = new GLTFLoader(),
        //         dracoLoader = new DRACOLoader();

        //     dracoLoader.setDecoderPath('/src/assets/models/planets/');
        //     loader.setDRACOLoader(dracoLoader);

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
        // },
        async init2() {
            let camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000),
                renderer = new THREE.WebGLRenderer(),
                controls = new OrbitControls(camera, renderer.domElement),
                scene = new THREE.Scene();

            camera.position.z = 100;
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);

            controls.addEventListener('change', render); // remove when using animation loop
            // enable animation loop when using damping or autorotation
            //controls.enableDamping = true;
            //controls.dampingFactor = 0.25;
            controls.enableZoom = true;


            // scene.background = new THREE.Color(0xcccccc);
            // scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

            let el: Element = this.$el;
            el.appendChild(renderer.domElement);

            // world

            var geometry = new THREE.CylinderGeometry(0, .10, .30, 4, 1);
            var material = new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true });

            
            var dummy = new THREE.Object3D();

            let chunk = new THREE.Group();
            
            this.loadPlanets(scene);

            // for (var i = 0; i < this.users.length; i++) {
            //     let userPlanet = await this.getCorePlanet(this.users[i]);

            //     let group = new THREE.Group();
            //     // group.layers.set(1);

            //     // console.log(i);
                

            //     group.add(userPlanet);
                
            //     // mesh.setMatrixAt( i ++, dummy.matrix );
            //     // var mesh = new THREE.Mesh( geometry, material );

            //     // group.add(mesh);
                
            //     group.position.x = (Math.random() - 0.5) * 100;
            //     group.position.y = (Math.random() - 0.5) * 100;
            //     group.position.z = (Math.random() - 0.5) * 100;
                
            //     // group.updateMatrix();

            //     chunk.add( group );

            // }

            scene.add(chunk)
            // lights

            let light1 = new THREE.DirectionalLight(0xffffff);
            light1.position.set(1, 1, 1);
            scene.add(light1);

            let light2 = new THREE.DirectionalLight(0x002288);
            light2.position.set(-1, -1, -1);
            scene.add(light2);

            let light3 = new THREE.AmbientLight(0x222222);
            scene.add(light3);

            function onWindowResize() {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();

                renderer.setSize(window.innerWidth, window.innerHeight);
            }

            function animate() {

            requestAnimationFrame(animate);

            controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true

            render();

            }

            function render() {

            renderer.render(scene, camera);

            }
        }
    },
    async mounted() {
        let [users, status] = await Users.userIds();
        
        if (status !== 200) return;
        
        this.users = users;

        this.init();
        
        // window.addEventListener('load', this.init);
    }
})
/*

500



*/
</script>

<style lang="scss" scoped>

.space-of-stars {
    position: relative;

    .block {
        width: 196px;
        height: 96px;
        position: absolute;
        border-radius: 5px;
        border: 1px solid var(--background-secondary);
        backdrop-filter: blur(5px);
    }
}

</style>