import React from "react";

export default function RoleSelector({ roles, onSelect }) {
  if (!roles.length) return null;
  return (
    <div className="my-4">
      <h2 className="font-bold mb-2">Select your intended occupation:</h2>
      <ul>
        {roles.map(role => (
          <li key={role.id} className="my-2">
            <button
              className="text-blue-700 hover:underline"
              onClick={() => onSelect(role)}
            >
              {role.title}
            </button>
            <p className="text-sm text-gray-600">{role.description?.slice(0, 120)}...</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
