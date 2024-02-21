import { CanvasBackground } from "../viewers/CanvasBackground";

import * as THREE from "three";
import { useState } from "react";

import { shaderBasics } from "../../assets/Shaders/Basics";
import { Backgrounds } from "../../assets/Shaders/Background";

export function Home (){
    const [selected, setSelected] = useState(0);

    let glsl = { 
        vertexShader: shaderBasics.vertex,
        fragmentShader: {
          defaultCode: shaderBasics.uniforms + shaderBasics.functions,
          viewCode: Backgrounds[selected].glsl
        } 
    };

    var uniforms = {
        u_time: { value: 1.0 },
        u_resolution: {value: new THREE.Vector2(0, 0)},
        u_clic: {value: false},
        u_pointer: {value: new THREE.Vector2(0, 0)},
    };
    
    return <>
        <CanvasBackground ident="home-bg" 
            shaderData={
                {
                    glsl,
                    uniforms
                }
            } 
        />
    </>
}