import React, { useState } from "react";
import { TextField, Button } from "@mui/material";

export function Languages({ isEditing, onSave }) {
  const [languages, setLanguages] = useState([{ language: "Anglais", level: "Courant" }]);

  return (
    <>
      {isEditing ? (
        <>
          {languages.map((lang, index) => (
            <div key={index}>
              <TextField label="Langue" value={lang.language} onChange={e => setLanguages([...languages.slice(0, index), { ...lang, language: e.target.value }, ...languages.slice(index + 1)])} />
              <TextField label="Niveau" value={lang.level} onChange={e => setLanguages([...languages.slice(0, index), { ...lang, level: e.target.value }, ...languages.slice(index + 1)])} />
            </div>
          ))}
          <Button onClick={onSave}>Enregistrer</Button>
        </>
      ) : (
        <>
          {languages.map((lang, index) => (
            <p key={index}>Langue: {lang.language}, Niveau: {lang.level}</p>
          ))}
        </>
      )}
    </>
  );
}
