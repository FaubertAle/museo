import { ColorPicker } from "./ColorPicker";

export function ColorPickerList ({colors, action}) {

    const render = colors.map((color, i) =>{
        return <ColorPicker data={color} action={action} key={i}/>
    });
    
    return(
        <div className="color-container">
            {render}            
        </div> 
    )
}