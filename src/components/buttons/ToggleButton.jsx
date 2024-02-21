import { useState } from "react";
export function ToggleButton ({name, action, text}) {
    const [active, setActive] = useState(false);
    return(
        <button
            className={active? `toggle b-${name} active`: `toggle b-${name}`}
            onClick={() => {
                setActive(!active);
                action();
            }}  
        >
            {!text||name}
        </button>
    )
}