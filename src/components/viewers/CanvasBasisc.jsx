import { useEffect, useRef } from "react";
import * as THREE from "three";
import { CodeEditor } from "../editors/CodeEditor";
import { ButtonGroup } from "../buttons/ButtonGroup";
import { RangeList } from "../inputs/RangeList";
import { ValueList } from "../inputs/ValueList";
import { ColorPickerList } from "../inputs/ColorPickerList";
import { VectorList } from "../inputs/VectorList"; 

export function Canvas2DBasic({ident, ranges, values, colors, vectors, shaderData}){
    const mountRef = useRef(null);
    const animationRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const shaderRef = useRef(shaderData.glsl);
    const uniformsRef = useRef(shaderData.uniforms);

    const rangesRef = useRef(ranges);
    const setInputRange = (e, i) => {
        rangesRef.current[i].value = e;
        uniformsRef.current[rangesRef.current[i].name].value = e;
    }
    const renderRanges = rangesRef.current.length ===0?
    []:
    <RangeList 
        ranges={rangesRef.current}
        action={setInputRange}
    />;

    const valuesRef = useRef(values);
    const setInputValue = (e, i) => {
        valuesRef.current[i].value = e;
        uniformsRef.current[valuesRef.current[i].name].value = e;
    }
    const renderValues = valuesRef.current.length ===0? 
    []:
    <ValueList
        values={valuesRef.current}
        action={setInputValue}
    />;

    const colorsRef = useRef(colors);
    const setInputColor = (e, i) => {
        colorsRef.current[i].value = e;
        uniformsRef.current[colorsRef.current[i].name].value = e;
    }
    const renderColors = colorsRef.current.length ===0?
    []:
    <ColorPickerList
        colors={colorsRef.current}
        action={setInputColor}
    />;

    const vectorsRef = useRef(vectors);
    const setInputVector = (e, i) => {
        vectorsRef.current[i].value = e;
        uniformsRef.current[vectorsRef.current[i].name].value = e;
    };
    const renderVectors = vectorsRef.current.length ===0?
    []:
    <VectorList
        vectors={vectorsRef.current}
        action={setInputVector}
    />;

    const pointer = {x: 0, y: 0};

    useEffect(()=>{
        const currentMount = mountRef.current;
        sceneRef.current = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        sceneRef.current.add(camera);
        
        uniformsRef.current.u_resolution.value = new THREE.Vector2(currentMount.clientWidth, currentMount.clientHeight);
        
        const handlerClic = (e) => {
            uniformsRef.current.u_clic.value = !uniformsRef.current.u_clic.value;
            savePointerData(e);
        }

        const savePointerData = (e) => {
            if (uniformsRef.current.u_clic.value) {
                pointer.x = (e.offsetX / currentMount.clientWidth);
                pointer.y = 1-(e.offsetY / currentMount.clientHeight);
                uniformsRef.current.u_pointer.value = 
                new THREE.Vector2(pointer.x, pointer.y);
            }
        }
        
        currentMount.addEventListener("mousedown", handlerClic);
        currentMount.addEventListener("mouseup", handlerClic);
        currentMount.addEventListener("mousemove", savePointerData);

        const geometry = new THREE.PlaneGeometry(2, 2);

        const material = new THREE.ShaderMaterial({
            uniforms: uniformsRef.current,
            vertexShader: shaderRef.current.vertexShader,
            fragmentShader: shaderRef.current.fragmentShader.defaultCode + shaderRef.current.fragmentShader.viewCode
        });

        const mesh = new THREE.Mesh(geometry, material);
        sceneRef.current.add(mesh);

        rendererRef.current = new THREE.WebGLRenderer();
        rendererRef.current.setSize(currentMount.clientWidth, currentMount.clientHeight);
        currentMount.appendChild(rendererRef.current.domElement);

        const animate = (time) =>{
            uniformsRef.current["u_time"].value = time/100;
            rendererRef.current.render(sceneRef.current, camera);
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
        <div className="viewer-container">
            <ButtonGroup/>
            <div ref={mountRef} className={ident}></div>
            <CodeEditor data={shaderRef.current.fragmentShader.viewCode}/>
        </div>
        <div className="input-container">
            { renderRanges }
            { renderValues }
            { renderVectors }
            { renderColors }
        </div>
    </> 
}