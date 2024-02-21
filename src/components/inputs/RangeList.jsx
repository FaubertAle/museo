import { Range } from "./Range"

export function RangeList ({ranges, action}) {

    const render = ranges.map((range, i) =>{
        return <Range data={range} action={action} key={i}/>
    });

    return(
        <div className="range-container">
            {render}            
        </div> 
    )
}