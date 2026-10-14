import { useState,useEffect } from "react";

function FetchAPI(url)
{
    const [dataFetch,setDataFetch] = useState([]);
    const [isLoading,setisLoading] = useState(true);
    const [isError,setisError] = useState(false);
    useEffect(()=> {
        //fetch les utilisateur
        //fetch('https://paleobiodb.org/data1.2/taxa/single.json?name=Hominidae&show=attr')
        //fetch("https://paleobiodb.org/data1.2/taxa/list.json?base_name=Homo&rank=species&show=class,order,family,parent,attr,app&limit=all")
        fetch(url)
        .then(res => res.json())
        .then((data) => {
            console.log(data);
            setDataFetch(data.records);
        }).catch(() => {
            setisError(true);
        }).finally( () => {
            setisLoading(false);
        });
    },[]);
 
    return {dataFetch,isLoading,isError}
}
const FetchAPI1 = () =>
{
    const [dataHominidae,setDataHominidae] = useState([]);
    const [isLoading,setisLoading] = useState(true);
    const [isError,setisError] = useState(false);
    useEffect(()=> {
        //fetch les utilisateur
        //fetch('https://paleobiodb.org/data1.2/taxa/single.json?name=Hominidae&show=attr')
        fetch("https://paleobiodb.org/data1.2/taxa/list.json?base_name=Hominidae&rank=genus&show=class,order,family,parent&limit=all")
        .then(res => res.json())
        .then((data) => {
            console.log(data);
            setDataHominidae(data.records);
            setisLoading(false);
        }).catch(() => {
            setisError(true);setisLoading(false);
        });
    },[]);
    if(isLoading)
        return <p>Chargement</p>
    if(isError)
        return <p>Une erreur est survenue</p>
    return (
        <ul>
            {dataHominidae.map((user) => (
                <li key={user.oid}>{user.nam}</li>
        ))}
        </ul>
    );
};

export default FetchAPI;
