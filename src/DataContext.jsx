// DonneesContext.jsx
import { createContext, useContext } from "react";
import FetchAPI from "./FetchData";

const DonneesContext = createContext(null);

export const DonneesProvider = ({ children }) => {
    const urlEspeces = "https://paleobiodb.org/data1.2/taxa/list.json?base_name=Homininae&rank=species&show=app&limit=all";
    const urlFossiles = "https://paleobiodb.org/data1.2/occs/list.json?base_name=Homininae&show=coords,loc,minAge,maxAge&limit=500";
    const especes= FetchAPI(urlEspeces);
    const fossiles= FetchAPI(urlFossiles);

    // Regrouper les fossiles par espèce : { "txn:123": [fossile, fossile], ... }
    const fossilesParEspece = {};
    fossiles.dataFetch.forEach((f) => {
        if (!fossilesParEspece[f.tid]) fossilesParEspece[f.tid] = [];
        fossilesParEspece[f.tid].push(f);
    });



    const donneesEspeces = [
  { nom: "Sahelanthropus tchadensis", oid: "txn:77368", debut: 7.1, fin: 6.9 },
  { nom: "Orrorin tugenensis", oid: null, debut: 7.2, fin: 6.9 },
  { nom: "Ardipithecus kadabba", oid: "txn:430484", debut: 5.8, fin: 5.3 },
  { nom: "Ardipithecus ramidus", oid: "txn:83091", debut: 4.5, fin: 4.3 },
  { nom: "Australopithecus anamensis", oid: "txn:384433", debut: 4.2, fin: 3.8 },
  { nom: "Australopithecus africanus", oid: "txn:83066", debut: 2.8, fin: 2.3 },
  { nom: "Australopithecus afarensis", oid: "txn:83055", debut: 3.9, fin: 2.9 },
  { nom: "Australopithecus bahrelghazali", oid: null, debut: 3.5, fin: 3.0 },
  { nom: "Australopithecus sediba", oid: "txn:165364", debut: 2.047, fin: 1.975 },
  { nom: "Australopithecus garhi", oid: "txn:384431", debut: 2.6, fin: 2.5 },
  { nom: "Kenyanthropus platyops", oid: "txn:83080", debut: 3.5, fin: 3.2 },
  { nom: "Paranthropus aethiopicus", oid: null, debut: 2.7, fin: 2.3 },
  { nom: "Paranthropus boisei", oid: null, debut: 2.4, fin: 1.2 },
  { nom: "Paranthropus robustus", oid: null, debut: 2.0, fin: 1.5 },
  { nom: "Homo rudolfensis", oid: "txn:83081", debut: 2.4, fin: 1.8 },
  { nom: "Homo habilis", oid: "txn:83082", debut: 2.3, fin: 1.4 },
  { nom: "Homo antecessor", oid: "txn:83085", debut: 0.858, fin: 0.781 },
  { nom: "Homo naledi", oid: "txn:384458", debut: 0.335, fin: 0.236 },
  { nom: "Homo ergaster", oid: "txn:83083", debut: 1.9, fin: 1.4 },
  { nom: "Homo floresiensis", oid: "txn:91487", debut: 0.129, fin: 0.0117 },
  { nom: "Homo erectus", oid: "txn:83084", debut: 1.0, fin: 0.117 },
  { nom: "Homo denisovensis", oid: null, debut: 0.04, fin: 0.04 },
  { nom: "Homo neanderthalensis", oid: "txn:83087", debut: 0.45, fin: 0.03 },
  { nom: "Homo heidelbergensis", oid: "txn:83086", debut: 0.774, fin: 0.3 },
  { nom: "Homo rhodesiensis", oid: "txn:91597", debut: 0.6, fin: 0.2 },
  { nom: "Homo sapiens", oid: "txn:83088", debut: 0.3, fin: 0.0 },
];

    const especesAvecDates = especes.dataFetch
    .map((e) => {
      const perso = donneesEspeces.find((d) => d.oid === e.oid);
      if (!perso) return null;            // espèce absente de ton tableau : on l'écarte

      return { ...e, fea: perso.debut, lla: perso.fin };
    }) 
    .filter(Boolean);

    const value = {
        especes:especesAvecDates,
        fossiles: fossiles.dataFetch,
        isLoading: especesAvecDates.isLoading || fossiles.isLoading,
        isError: especesAvecDates.isError || fossiles.isError,
    };
  return (
    <DonneesContext.Provider value={value}>
      {children}
    </DonneesContext.Provider>
  );
};

export const useDonnees = () => useContext(DonneesContext);