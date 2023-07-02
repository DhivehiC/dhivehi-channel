const OmmitProps = (omitProps: string[], props: any) => {
    let temp = { ...props }
    omitProps.map((prop)=>{
        delete temp[prop]
    })

    return temp
}

export default OmmitProps