import { useState } from "react";
import { SelectButton } from "./SelectButton";
export function ButtonGroup ({name, buttons, action}) {
    const [selected, setSelected] = useState(1);
    const changeSelected = (id)=>{
        setSelected(id);
    }
    // const render = buttons.map((button, i) =>{
    //     return <SelectButton name={button} id={i} selected={selected} action={changeSelected}/>
    // });
    return(
        <div className="viewer-buttons">
            <SelectButton name="Codigo" id={0} selected={selected} action={changeSelected}/>
            <SelectButton name="Textura" id={1} selected={selected} action={changeSelected}/> 
            <SelectButton name="Objeto" id={2} selected={selected} action={changeSelected}/>
        </div>   
    )
}