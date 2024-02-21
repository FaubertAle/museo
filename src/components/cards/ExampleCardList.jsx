import { ExampleCard } from "./ExampleCard";
export function ExampleCardList ({list, action, selected}) {

    const render = list.map((card, i) =>{
        return <ExampleCard data={card} id={i} action={action} selected={selected} key={i}/>
    });

    return(
        <div className="cards-container">
            {render}            
        </div> 
    )
}