import { useRef } from "react";
import { VComp } from "./VComp";

export function Vector({data, action}){
    const vector = useRef(data.value);
    const ind = ['x', 'y', 'z', 'w'];

    const setVector = (e, i) => {
        vector.current[i] = e;
        action(vector.current, data.name); 
    }
    
    const render = data.value.map((comp, i) => {
        return <VComp data={{name: ind[i], value: comp, propertis: data.propertis}} action={setVector} key={i} id={i}/>
    });

    return <div className="input-vector">
        <h4>{data.name+':'}</h4>
        <div className="input-comps">
            {render}
        </div>
        
    </div>
}