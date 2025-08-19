import React, { useState } from "react";
import { searchRoles } from "../api";

export default function RoleSearch({ onRoles }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    const roles = await searchRoles(input);
    onRoles(roles);
    setLoading(false);
  }

  return (
    <form className="flex gap-2 my-4" onSubmit={handleSearch}>
      <input
        className="border p-2 rounded flex-1"
        placeholder="Type a career goal"
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <button className="bg-blue-500 text-white rounded px-4 py-2" disabled={loading}>
        {loading ? "Searching..." : "Search Roles"}
      </button>
    </form>
  );
}
