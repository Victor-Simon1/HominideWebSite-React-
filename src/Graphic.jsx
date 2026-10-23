import {
  ReferenceLine, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer,
} from "recharts";
import { useState } from "react";

const MAX_MA = 8;
const DOMAINE = [0, MAX_MA];
const MARGES = { left: 20, right: 20 };
const TICK = { fontSize: 12 };
const formater = (v) => (Array.isArray(v) ? `de ${v[1]} à ${v[0]} Ma` : v);

export const GraphiqueTemps = ({ donnees = [] }) => {
  const [ma, setMa] = useState(MAX_MA);

  const existantes = donnees.filter(
    (d) => d.periode[0] <= ma && ma <= d.periode[1]
  );

  return (
    <>
      <ResponsiveContainer width="100%" height={donnees.length * 28 + 60}>
        <BarChart layout="vertical" data={donnees} margin={MARGES}>
          <XAxis type="number" reversed domain={DOMAINE} unit=" Ma" />
          <YAxis type="category" dataKey="nom" width={190} interval={0} tick={TICK} />
          <Tooltip formatter={formater} />
          <Bar dataKey="periode" barSize={14}>
            {donnees.map((d) => {
              const existe = d.periode[0] <= ma && ma <= d.periode[1];
              return <Cell key={d.nom} fill={d.couleur} fillOpacity={existe ? 1 : 0.15} />;
            })}
          </Bar>
          <ReferenceLine x={ma} stroke="red" strokeWidth={2} />
        </BarChart>
      </ResponsiveContainer>

      <div className="curseur-temps">
        <label>
          <span className="curseur-valeur">Il y a {ma.toFixed(1)} millions d'années</span>
          <input
            type="range"
            min="0"
            max={MAX_MA}
            step="0.1"
            value={MAX_MA - ma}
            onChange={(e) => setMa(MAX_MA - Number(e.target.value))}
          />
        </label>
        <p className="liste-existantes">
          {existantes.length} espèce{existantes.length > 1 ? "s" : ""} à cette époque :{" "}
          {existantes.map((d) => d.nom).join(", ")}
        </p>
      </div>
    </>
  );
};