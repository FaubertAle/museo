export function InfoCard ({data}) {
    return(
        <div className="descript">
            <h3>{data.title}</h3>
            <p>{data.text}</p>
        </div>
    )
}