import { useEffect, useRef } from "react";
import BackgroundScene from "../../assets/Utils/BackgroundScene";

export function CanvasBackground({ident, shaderData}){
    const mountRef = useRef(null);
    const threeRef = useRef(null);
    
    useEffect(()=>{
        const currentMount = mountRef.current;
        threeRef.current = new BackgroundScene(currentMount, shaderData.uniforms, shaderData.glsl);
        threeRef.current.initialize();

        //Clean up scene
        return ()=>{
            threeRef.current.cleanUpScene();
        }
    }, [])
    return <>
        <div ref={mountRef} className={ident}></div>
    </> 
}