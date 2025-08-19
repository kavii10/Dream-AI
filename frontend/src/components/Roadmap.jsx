import React, { useState } from "react";

export default function Roadmap({ roadmap, occupation, description }) {
  if (!roadmap) return null;
  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-2">{occupation}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      {roadmap.map((stage, idx) => (
        <RoadmapStage key={idx} title={stage.type === "skill/competence" ? "Core Skills" : "Knowledge"} items={stage.items} />
      ))}
    </div>
  );
}

function RoadmapStage({ title, items }) {
  const [open, setOpen] = useState(null);
  if (!items.length) return null;
  return (
    <div className="mb-4">
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <ul>
        {items.map((item, idx) => (
          <li key={idx}>
            <button
              className="bg-gray-100 rounded px-2 py-1 my-1 text-left w-full"
              onClick={() => setOpen(open === idx ? null : idx)}
            >
              <span className="font-medium">{item.title}</span>
            </button>
            {open === idx && (
              <div className="bg-white border p-3 rounded shadow mb-1">
                <span>{item.description}</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
