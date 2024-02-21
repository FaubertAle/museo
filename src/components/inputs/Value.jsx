import { useState } from "react";
export function Value({data, action}){
    const [value, setValue] = useState(data.value);
    return(
        <div className="input-value">
            <label htmlFor={data.name}>{data.name}</label>
            <input 
                type="number"
                min={data.propertis.min} 
                max={data.propertis.max} 
                step={data.propertis.step}
                value={value} 
                onChange={(e)=>{
                    setValue(e.target.value);
                    action(e.target.value, data.name);
                }}
                id={data.name}
            />
        </div>
    );
}