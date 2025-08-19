import React, { useState } from "react";
import RoleSearch from "./components/RoleSearch";
import RoleSelector from "./components/RoleSelector";
import Roadmap from "./components/Roadmap";
import { getRoadmap } from "./api";

function App() {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [roadmap, setRoadmap] = useState(null);

  async function handleSelect(role) {
    setSelectedRole(role);
    setRoadmap(null);
    const data = await getRoadmap(role.id);
    setRoadmap(data);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 font-sans">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">Dream Mentor AI</h1>
      <RoleSearch onRoles={setRoles} />
      <RoleSelector roles={roles} onSelect={handleSelect} />
      {roadmap && (
        <Roadmap {...roadmap} />
      )}
    </div>
  );
}

export default App;
