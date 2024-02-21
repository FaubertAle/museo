import { useRef, useState } from "react";
import { CheckBoxInput } from "./CheckBoxInput";
export function SnapRenderInput ({}) {
    const [checked, setChecked] = useState(0);    
    const dimensions = [
        {
            name: 'Defecto',
            value: [0, 0],
        },
        {
            name: 'HD',
            value: [1280, 720],
        },
        {
            name: 'Personalizado',
            value: [300, 300],
        }
    ];



    const changeCheck = (check) => {
        setChecked(check);
    };


    return <div className="snap-container">
        <CheckBoxInput action={changeCheck} checked={checked}/>
        <div className="dimensions">

        </div>
    </div>
}
