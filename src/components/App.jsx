import { useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import { Layout } from "./Layout";
import { Home } from "./pages/Home";
import { Gallery } from "./pages/Gallery";
import { Texture } from "./pages/Texture";
import { shaderBasics } from '../assets/Shaders/Basics';
import { group1 } from '../assets/Shaders/group1';
import * as THREE from "three";

function App() {

  const [selected, setSelected] = useState(0);

  let newUniforms = '';

  var uniforms = {
    u_time: { value: 1.0 },
    u_resolution: {value: new THREE.Vector2(0, 0)},
    u_clic: {value: false},
    u_pointer: {value: new THREE.Vector2(0, 0)},
  };

  group1[selected].uniforms.forEach((uniform) => {
    switch (uniform.value.length) {
      case 2:
        Object.defineProperty(uniforms, uniform.name, {
          value: { value: new THREE.Vector2(uniform.value[0], uniform.value[1]) }
        });
        newUniforms += 'uniform vec2 ' + uniform.name + ';\n';
        break;
      case 3:
        Object.defineProperty(uniforms, uniform.name, {
          value: { value: new THREE.Vector3(uniform.value[0], uniform.value[1], uniform.value[2]) }
        });
        newUniforms += 'uniform vec3 ' + uniform.name + ';\n';
        break;
      default:
        Object.defineProperty(uniforms, uniform.name, {
          value: { value: uniform.value }
        });
        newUniforms += 'uniform float ' + uniform.name + ';\n';
        break;
    }
  }); 

  let glsl = { 
    vertexShader: shaderBasics.vertex,
    fragmentShader: {
      defaultCode: shaderBasics.uniforms + shaderBasics.functions,
      viewCode: newUniforms + group1[selected].glsl
    } 
  };

  useEffect(()=>{
    
  });

  return (
    <>
      <Routes>
        <Route path="/" element= {<Layout/>}>
          <Route path="/" element={
            <Home 
              shaderBasics={glsl}
            />
          }
          />
          <Route path="gallery" element={<Gallery list={group1} action={setSelected} selected={selected}/>}/>
          <Route path="texture" element={
            <Texture 
              glsl={glsl} 
              uniforms={uniforms}
              inputData={group1[selected].uniforms}
              description={group1[selected].descript}
            />
          }
          />
        </Route>
      </Routes>
    </>
  )
}

export default App
