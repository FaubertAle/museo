import { ExampleCardList } from "../cards/ExampleCardList";
export function Gallery ({list, action, selected}){
    const dataList = list.map((item)=>{
        return item.descript;
    });
    
    return (
        <>
            <ExampleCardList list={dataList} action={action} selected={selected}/>
        </>
    );
}