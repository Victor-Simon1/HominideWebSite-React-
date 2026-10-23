import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import * as DataContext from "./DataContext"
export const MenuEspeces = () => {
  const { especes, isLoading } = DataContext.useDonnees();
  const [ouvert, setOuvert] = useState(false);
  const conteneur = useRef(null);

  // Fermer au clic en dehors du menu et avec la touche Échap
  useEffect(() => {
    const clicExterieur = (ev) => {
      if (conteneur.current && !conteneur.current.contains(ev.target)) {
        setOuvert(false);
      }
    };
    const echap = (ev) => {
      if (ev.key === "Escape") setOuvert(false);
    };

    document.addEventListener("mousedown", clicExterieur);
    document.addEventListener("keydown", echap);
    return () => {
      document.removeEventListener("mousedown", clicExterieur);
      document.removeEventListener("keydown", echap);
    };
  }, []);

  if (isLoading) return null;

  const liste = especes
    .filter((e) => !e.tdf)
    .sort((a, b) => a.nam.localeCompare(b.nam));

  return (
    <div className="menu-especes" ref={conteneur}>
      <button
        className="menu-bouton"
        onClick={() => setOuvert(!ouvert)}
        aria-expanded={ouvert}
        aria-haspopup="true"
      >
        Espèces {ouvert ? "▲" : "▼"}
      </button>

      {ouvert && (
        <ul className="menu-liste">
          {liste.map((e) => (
            <li key={e.oid}>
              <Link
                to={`/espece/${encodeURIComponent(e.nam)}`}
                onClick={() => setOuvert(false)}
              >
                {e.nam}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};