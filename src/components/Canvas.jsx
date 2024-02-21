import { useEffect, useRef } from "react";
import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
export function Canvas(){
    const mountRef = useRef(null);
    useEffect(()=>{
        const currentMount = mountRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            currentMount.clientWidth/currentMount.clientHeight,
            0.1,
            5
        );
        camera.position.set(0, 0, 2);
        scene.add(camera);

        //Luces 
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
        hemiLight.position.set(0, 10, 0);
        scene.add(hemiLight);

        const dirLight = new THREE.DirectionalLight(0xffffff);
        dirLight.position.set(0, 10, 10);
        scene.add(dirLight);

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight)
        currentMount.appendChild(renderer.domElement);
        //Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        const geometry = new THREE.BoxGeometry( 1, 1, 1 ); 
        const material = new THREE.MeshPhongMaterial( {color: 0xffff00} ); 
        const cube = new THREE.Mesh( geometry, material );
        scene.add(cube);

        const animate = (time) =>{
            time *= 0.001;
            console.log(time); 
            renderer.render(scene, camera);
            controls.update();
            requestAnimationFrame(animate);
        }
        animate();
        

        //Clean up scene
        return ()=>{
            currentMount.removeChild(renderer.domElement);
        }

    }, [])
    return <div ref={mountRef} style={{width: '100%', height: '100%'}} className="canvas"></div>
}