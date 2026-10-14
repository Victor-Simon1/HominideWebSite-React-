import * as Video from "./Video"
import FetchAPI, * as Data from "./FetchData"
import * as NightMode from "./NightMode"
import * as Graphic from "./Graphic"
import * as Map from "./Map"
import * as DataContext from "./DataContext"
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useParams } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import {useState,useEffect,createContext } from "react";


const SectionPliable = ({ titre, ouvertAuDepart = true, children }) => {
  const [ouvert, setOuvert] = useState(ouvertAuDepart);

  return (
    <section>
      <h1 onClick={() => setOuvert(!ouvert)} style={{ cursor: "pointer" }}>
        {ouvert ? "▼" : "▶"} {titre}
      </h1>
      {ouvert && children}
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
    nom: d.nom,
    periode: [d.fin, Math.max(d.debut, d.fin + 0.01)],
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
    />
    <SectionPliable 
    titre={"La carte de la famille des Hominines"} 
    children={<>
        <Map.CarteFossiles fossiles={fossilesVisibles} couleurs={couleurs} />;
        <Map.Legende especes={especes} couleurs={couleurs} masquees={masquees} onToggle={basculer}/>
    </>}
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
  const { nom } = useParams();
  return (
    <p>voici les fossiles de {nom} </p>
  );
}
const Spacies = () => {
  const { especes,fossiles,isLoading,isError} = DataContext.useDonnees();
  if(isLoading) return null;
  return(
      especes.map((e) => (
        <>
          <Link key={e.oid} to={`/espece/${encodeURIComponent(e.nam)}`}>
            {e.nam}
          </Link> |{" "}
          </>
          ))
  );
}
const App = () => {
  
  return(
  <>
    <BrowserRouter>
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
    </BrowserRouter>
  </>
  );
};

export default App;