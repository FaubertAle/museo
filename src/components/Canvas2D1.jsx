import { useEffect, useRef } from "react";
import * as THREE from "three";
import { vertexShader2, fragmentShader2 } from '../assets/Shaders/threeShader2';
import { Value } from "./inputs/Value";
import { Range } from "./inputs/Range";
import { ColorPicker } from "./inputs/ColorPicker";
export function Canvas2D({ident, dataInput}){
    const mountRef = useRef(null);
    const animationRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const valueRef = useRef(dataInput.value);
    const dataColor = {
        name: 'Color A',
        value: [64, 242, 150]
    }
    const colorRef = useRef(dataColor.value);
    const pointer = {x: 0, y: 0};
    const uniforms = {
        u_time: { value: 1.0 },
        u_resolution: {value: new THREE.Vector2(0, 0)},
        u_clic: {value: false},
        u_pointer: {value: new THREE.Vector2(pointer.x, pointer.y)},
        u_color: {value: new THREE.Vector3(colorRef.current[0], colorRef.current[1], colorRef.current[2])},
    };

    const setInputValue = (e) => {
        valueRef.current = e;
    }

    const setInputColor = (e) => {
        colorRef.current = e;
        uniforms.u_color.value = new THREE.Vector3(e[0], e[1], e[2]);
        // console.log(colorRef.current);
    }

    useEffect(()=>{
        const currentMount = mountRef.current;
        sceneRef.current = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        sceneRef.current.add(camera);
        
        uniforms.u_resolution.value = new THREE.Vector2(currentMount.clientWidth, currentMount.clientHeight)
        
        const handlerClic = (e) => {
            uniforms.u_clic.value = !uniforms.u_clic.value;
            savePointerData(e);
        }
        

        const savePointerData = (e) => {
            if (uniforms.u_clic.value) {
                pointer.x = (e.offsetX / currentMount.clientWidth);
                pointer.y = 1-(e.offsetY / currentMount.clientHeight);
                uniforms.u_pointer.value = 
                new THREE.Vector2(pointer.x, pointer.y);
            }
        }

        const actUniforms = () => {
            uniforms.u_color.value = 
            new THREE.Vector3(colorRef.current[0], colorRef.current[1], colorRef.current[2]);
        }
        
        currentMount.addEventListener("mousedown", handlerClic);
        currentMount.addEventListener("mouseup", handlerClic);
        currentMount.addEventListener("mousemove", savePointerData);

        const geometry = new THREE.PlaneGeometry(2, 2);

        const material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertexShader2,
            fragmentShader: fragmentShader2,
        });

        const mesh = new THREE.Mesh(geometry, material);
        sceneRef.current.add(mesh);

        rendererRef.current = new THREE.WebGLRenderer();
        rendererRef.current.setSize(currentMount.clientWidth, currentMount.clientHeight);
        currentMount.appendChild(rendererRef.current.domElement);

        const animate = (time) =>{
            rendererRef.current.render(sceneRef.current, camera);
            uniforms["u_time"].value = time*4*valueRef.current / 100;
            animationRef.current = requestAnimationFrame(animate);
        }
        animationRef.current = requestAnimationFrame(animate);
        

        //Clean up scene
        return ()=>{
            currentMount.removeChild(rendererRef.current.domElement);
            cancelAnimationFrame(animationRef.current);
            sceneRef.current.traverse(obj => {
                if (obj.isMesh) {
                  // Liberar geometrías
                  obj.geometry.dispose();
                  // Liberar materiales
                  if (obj.material.isMaterial) {
                    obj.material.dispose();
                  } else if (Array.isArray(obj.material)) {
                    obj.material.forEach(material => material.dispose());
                  }
                }
              });
            rendererRef.current.dispose();
            currentMount.removeEventListener("mousedown", handlerClic);
            currentMount.removeEventListener("mouseup", handlerClic);
            currentMount.removeEventListener("mousemove", savePointerData);
        }

    }, [])
    return <>
        <div ref={mountRef} className={ident}></div>
        <div className="input-container">
            <Value 
                data={dataInput}
                action={setInputValue}
            />
            <Range
                data={dataInput}
                action={setInputValue}
            />
            <ColorPicker 
                data={dataColor}
                action={setInputColor} 
            />
        </div>
        
    </> 
    
}