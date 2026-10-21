import * as Video from "./Video"
import FetchAPI, * as Data from "./FetchData"
import * as NightMode from "./NightMode"
import * as Graphic from "./Graphic"
import * as Map from "./Map"
import * as DataContext from "./DataContext"
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useParams } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import {useState,Fragment ,useEffect,createContext } from "react";


const SectionPliable = ({ titre, ouvertAuDepart = true, children ,className}) => {
  const [ouvert, setOuvert] = useState(ouvertAuDepart);

  return (
    <section>
      <h1 onClick={() => setOuvert(!ouvert)} style={{ cursor: "pointer" }}>
        {ouvert ? "▼" : "▶"} {titre}
      </h1>
      {ouvert && <div className={className}>{children}</div>}
    </section>
  );
};
const Body = () => {
  const { especes,fossiles,isLoading,isError} = DataContext.useDonnees();
  const [masquees, setMasquees] = useState([]);

  const basculer = (id) => {
    setMasquees((actuel) =>
      actuel.includes(id) ? actuel.filter((x) => x !== id) : [...actuel, id]
    );
  };
  if(isLoading )
      return <p>Chargement</p>
  if( isError)
      return <p>Une erreur est survenue</p>

  // Regrouper les fossiles par espèce : { "txn:123": [fossile, fossile], ... }
  const fossilesParEspece = {};
  fossiles.forEach((f) => {
    if (!fossilesParEspece[f.tid]) fossilesParEspece[f.tid] = [];
    fossilesParEspece[f.tid].push(f);
  });

  const fossilesVisibles = fossiles.filter((f) => !masquees.includes(f.tid));

 
  //Couleur par especes
  const couleurs = {};
  especes.forEach((e, i) => {
      const teinte = (i * 360) / especes.length;
      couleurs[e.oid] = `hsl(${teinte}, 70%, 45%)`;
  });
  const donneesGraphique = especes
  .map((d) => ({
    nom: d.nam,
    periode: [d.lla, Math.max(d.fea, d.lla + 0.01)],
    couleur: couleurs[d.oid] ?? "#888",
  }))
  .sort((a, b) => b.periode[1] - a.periode[1]);

  return (
  <>
    <SectionPliable 
    titre={"Family"} 
    children={<DifferentFamily especesAvecDates={especes} fossilesParEspece={fossilesParEspece}/>}
    />
    <SectionPliable 
    titre={"L'évolution de la famille des Hominines"} 
    children={<Graphic.GraphiqueTemps donnees={donneesGraphique} />}
    className={"graphics"}
    />
    <SectionPliable 
    titre={"La carte de la famille des Hominines"} 
    children={
      <>
        <Map.CarteFossiles fossiles={fossilesVisibles} couleurs={couleurs} />
        <Map.Legende especes={especes} couleurs={couleurs} masquees={masquees} onToggle={basculer}/>
      </>
    }
    className={"carte"}
    />
  </>
 );
}



const DifferentFamily = ({especesAvecDates = [],fossilesParEspece = []}) => {
  const [recherche, setRecherche] = useState("");
  const [tri, setTri] = useState("nom");
  console.log(tri)

  const comparateurs = {
  nom: (a, b) => a.nam.localeCompare(b.nam),
  ancien: (a, b) => Number(b.fea) - Number(a.fea),
  recent: (a, b) => Number(a.fea) - Number(b.fea),
  fossiles: (a, b) =>
    (fossilesParEspece[b.oid] ?? []).length -
    (fossilesParEspece[a.oid] ?? []).length,
  };
  const resultat = especesAvecDates
    .filter((e) => (fossilesParEspece[e.oid] ?? []).length > 0)
    .filter((e) => e.nam.toLowerCase().includes(recherche.toLowerCase()))
    .sort(comparateurs[tri] ?? comparateurs.nom);

  return (
    <>
    <input type="text" placeholder="rechercher une espéces" value={recherche}  onChange={(e) => setRecherche(e.target.value)}/ >
    <select value={tri} onChange={(e) => setTri(e.target.value)} >
      <option value="nom">nom</option>
      <option value="ancien">Date de début</option>
      <option value="recent">Date de fin</option>
      <option value="fossiles">Nombre de fossile</option>
    </select>
    <p>{resultat.length} espèce{resultat.length > 1 ? "s" : ""} affichée{resultat.length > 1 ? "s" : ""}</p>
    {
    resultat.map((e) => (
      <section key={e.oid}>
        <h2>{e.nam}</h2>
        <ul>
          <li>Début : {e.fea} Ma</li>
          <li>Fin : {e.lla} Ma</li>
          <li>Nombres de fossiles découvert :  {(fossilesParEspece[e.oid] ?? []).length} </li>
        </ul>
      </section>
    ))
    
    }
    </>
  );
};


const Header = () =>{
  return ( 
    <div className="header">
      <p>En apprendre plus sur les espéces disparu</p>
       <NightMode.BoutonTheme/>
    </div>
  );
}
const Footer = () => {
  return (
    <div className="footer">
      <p>Crée par Victor SIMON<br />
      Data prise sur <a href="https://paleobiodb.org/#/" >paleobiodb.org</a> et sur Wikipedia</p>
    </div>
  );
};

const PageEspece = () => {
  const { especes,fossiles,isLoading,isError} = DataContext.useDonnees();
  const { nom } = useParams();

  if(isLoading)
    return <p></p>
  const spacie =  especes.find(item => item.nam == nom);
  if(!spacie)
    return <p>Espece introuvable</p>

  const spacieFossile = fossiles.filter((f) => f.tid === spacie.oid);
  console.log(spacie)

  return (
    <>
      <p>voici les fossiles de {nom} </p>
      <ul>
        {spacieFossile.map((f) => (
          <li key={f.oid}>
            <img
            src={`https://flagcdn.com/w20/${f.cc2.toLowerCase()}.png`}
            alt={f.cc2}
            width="20"
            /> 
            : entre {f.lag} et {f.eag} Ma</li>
        ))}
      </ul>
    </>
  );

}
const Spacies = () => {
  const { especes,fossiles,isLoading,isError} = DataContext.useDonnees();
  if(isLoading) return null;
  return(
      especes.map((e) => (     
        <Fragment  key={e.oid}>
          <Link  to={`/espece/${encodeURIComponent(e.nam)}`}>
            {e.nam}
          </Link> |{" "}
        </Fragment >
        ))
  );
}
const App = () => {
  
  return(
  <>
    <HashRouter  >
    <DataContext.DonneesProvider>
      <Header />
      <nav>
        <Link to="/">Accueil</Link> |{" "}
        <Spacies />
      </nav>
      
        <Routes>
          <Route path="/" element={<Body />} />
          <Route path="/espece/:nom" element={<PageEspece />} />
        </Routes>
      
      <Footer />
      </DataContext.DonneesProvider>
    </HashRouter >
  </>
  );
};

export default App;