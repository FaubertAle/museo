import { useEffect, useRef, useState } from "react"

export function DespButton ({active, action}) {

    const mountRef = useRef(null);

    useEffect(() => {
        const currentMount = mountRef.current;
        const divHeight = currentMount.getBoundingClientRect().height;
        currentMount.style.width = `${divHeight}px`;
        
    });
    return <div ref={mountRef} className={active? 'desp-button active': 'desp-button'}
        onClick={()=> action(!active)}
    >
    </div>
}