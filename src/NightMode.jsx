import {useState,useEffect} from "react"
export const BoutonTheme = () => {
  const [sombre, setSombre] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.documentElement.dataset.theme = sombre ? "dark" : "light";
    localStorage.setItem("theme", sombre ? "dark" : "light");
  }, [sombre]);

  return (
    <button onClick={() => setSombre(!sombre)}>
      {sombre ? "Mode clair" : "Mode nuit"}
    </button>
  );
};