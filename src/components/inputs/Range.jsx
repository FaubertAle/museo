import { useState } from "react";
export function Range ({data, action}) {
    const [value, setValue] = useState(data.value);
    
    return(
        <div className="input-range">
            <label htmlFor={data.name}>{data.name} {value}</label>
            <input 
                type="range" 
                min={data.propertis.min} 
                max={data.propertis.max} 
                step={data.propertis.step}
                value={value} 
                onChange={(e)=> {
                    setValue(e.target.value);
                    action(e.target.value, data.name);
                }}
                id={data.name}
            />
        </div> 
    )
}