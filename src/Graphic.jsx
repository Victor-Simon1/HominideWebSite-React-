import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer,
} from "recharts";

export const GraphiqueTemps = ({ donnees = [] }) => (
  <ResponsiveContainer width="100%" height={Math.max(300, donnees.length * 32)}>
    <BarChart layout="vertical" data={donnees} margin={{ left: 20, right: 20 }}>
      <XAxis type="number" reversed domain={[0, "auto"]} unit=" Ma" />
      <YAxis type="category" dataKey="nom" width={150} />
      <Tooltip
        formatter={(v) => (Array.isArray(v) ? `de ${v[1]} à ${v[0]} Ma` : v)}
      />
      <Bar dataKey="periode">
        {donnees.map((d) => (
          <Cell key={d.nom} fill={d.couleur} />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);
