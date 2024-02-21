import { Value } from "./Value";

export function ValueList ({values, action}) {

    const render = values.map((value, i) =>{
        return <Value data={value} action={action} key={i}/>
    });
    
    return(
        <div className="value-container">
            {render}          
        </div> 
    )
}