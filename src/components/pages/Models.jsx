import { Canvas2D } from "../viewers/Canvas2D";

export function Texture ({ glsl, uniforms, inputData, description }){
    const rangeList = [];
    const valueList = [];
    const colorList = [];
    const vectorList = [];

    inputData.forEach(input => {
        switch (input.propertis.type) {
            case 'range':
                rangeList.push(input);
                break;
            case 'value':
                valueList.push(input);
                break;
            case 'vector':
                vectorList.push(input);
                break;
            case 'color':
                colorList.push(input);
                break;
            default:
                break;
        }        
    });

    return <>
        <Canvas2D
            ident="cv-2dA" 
            ranges={rangeList} 
            values={valueList} 
            colors={colorList}
            vectors={vectorList}
            shaderData={
                {
                    glsl,
                    uniforms
                }
            }
            description={description}
        />

    </>
}