import { useState } from "react";
export function LikeButton () {
    const [follow, setFollow] = useState(true);
    const changeFollow = ()=>{
        setFollow(!follow)
        // console.log('cambiado')
    }
    // console.log('pintado')
    return(
        <button 
            onClick={changeFollow}
            >
                {follow? 'siguiendo':'seguir'}
        </button>
    )
}