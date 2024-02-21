import { Vector } from "./Vector";

export function VectorList ({ vectors, action}) {
const render = vectors.map((vector, i) => {
    return <Vector data={vector} action={action} key={i} id={i}/>
});

return (
    <div className="vector-container">
        {render}            
    </div> 
)
}