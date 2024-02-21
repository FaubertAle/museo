import { useEffect, useRef } from "react";
import SceneInit from "../../assets/Utils/SceneInit";

import { CodeEditor } from "../editors/CodeEditor";
import { ToggleButton } from "../buttons/ToggleButton";
import { RangeList } from "../inputs/RangeList";
import { ValueList } from "../inputs/ValueList";
import { ColorPickerList } from "../inputs/ColorPickerList";
import { VectorList } from "../inputs/VectorList";
import { InfoCard } from "../cards/InfoCard";

export function Canvas2D({ident, ranges, values, colors, vectors, shaderData, description}){
    const mountRef = useRef(null);
    const threeRef = useRef(null);    

    const setInput = (e, name) => {
        threeRef.current.setInputValue(e, name);
    }

    const toggle3D = () =>{
        threeRef.current.switchCamera();
    }
    const toggleSnap = () => {
        // console.log(threeRef.current.getCanvas());
        var a = document.createElement('a');
        a.href = threeRef.current.snapRender();
        a.download = 'nombre_imagen.jpg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    const toggleModel = () => {
        threeRef.current.switchModel();
    };

    const renderRanges = ranges.length ===0?
    []:
    <RangeList 
        ranges={ranges}
        action={setInput}
    />;

    const renderValues = values.length ===0? 
    []:
    <ValueList
        values={values}
        action={setInput}
    />;

    const renderColors = colors.length ===0?
    []:
    <ColorPickerList
        colors={colors}
        action={setInput}
    />;

    const renderVectors = vectors.length ===0?
    []:
    <VectorList
        vectors={vectors}
        action={setInput}
    />;

    useEffect(()=>{
        const currentMount = mountRef.current;

        threeRef.current = new SceneInit(currentMount, shaderData.uniforms, shaderData.glsl);
        threeRef.current.initialize();
        
        return ()=>{
            threeRef.current.cleanUpScene();
        }
    }, [shaderData])

    return <>
        <div className="viewer-container">
            <ToggleButton name={'3D'} action={toggle3D} text={true}/>
            <ToggleButton name={'snap'} action={toggleSnap} text={false}/>
            <ToggleButton name={'model'} action={toggleModel} text={false}/>
            <div ref={mountRef} className={ident}></div>
            <CodeEditor data={shaderData.glsl.fragmentShader.viewCode} action={toggle3D}/>
        </div>
        <div className="beside">
            <div className="input-container">
                { renderRanges }
                { renderValues }
                { renderVectors }
                { renderColors }
            </div>
            <InfoCard data={description}/>
        </div>
        
    </> 
}