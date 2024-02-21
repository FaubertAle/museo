import { useEffect, useRef } from "react"

export function ExampleCard ({data, action, id, selected}) {
    const mountRef = useRef();
    useEffect(()=>{
        const currentMount = mountRef.current;
        const handlerClic = () => {
            action(id);
        }
        currentMount.addEventListener("click", handlerClic);

    }, []);
    return(
        <div className={selected===id? 'card active': 'card'} ref={mountRef}>
            <h3>{data.title}</h3>
            <div id={'img-'+id}>
                {selected===id? 'act': id}
            </div>
            <p>{data.text}</p>
        </div>
    )
}