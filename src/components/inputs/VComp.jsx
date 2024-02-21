import { useState } from "react";
export function VComp({data, action, id}){
    const [value, setValue] = useState(data.value);
    return(
        <div>
            {data.name+': '}
            <input
                type="number"
                name={data.name+id}
                min={data.propertis.min} 
                max={data.propertis.max} 
                step={data.propertis.step}
                value={value} 
                onChange={(e)=>{
                    setValue(e.target.value);
                    action(e.target.value, id);
                }}
            />
        </div>
    );
}