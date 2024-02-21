import { useState } from "react";
export function SelectButton ({name, id, selected , action}) {
    return(
        <button
            onClick={() => {
                action(id)
            }}
            className={selected === id? 'but active': 'but'}
        >
            {name}
        </button>
    )
}