import { useState } from "react";
export function ColorPicker ({data, action}) {

    const [value, setValue] = useState(data.value);
    const hexa2rgb = (e) => {
        let r = parseInt(e.substring(1, 3), 16);
        let g = parseInt(e.substring(3, 5), 16);
        let b = parseInt(e.substring(5, 7), 16);
        action([r,g,b], data.name);
        return [r, g, b];
    }
    
    return(
        <div className="input-color">
            <label htmlFor={data.name}>{data.name} </label>
            <input type="color" name={data.name} 
                onChange={(e)=> {
                    setValue(hexa2rgb(e.target.value));
                }}
                id={data.name}
            />
        </div> 
    )
}