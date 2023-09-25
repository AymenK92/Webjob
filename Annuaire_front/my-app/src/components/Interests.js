import React, { useState } from "react";
import { TextField, Button } from "@mui/material";

export function Interests({ isEditing, onSave }) {
  const [interests, setInterests] = useState(["Lecture", "Sport"]);

  return (
    <>
      {isEditing ? (
        <>
          {interests.map((interest, index) => (
            <TextField key={index} label="Centre d'intérêt" value={interest} onChange={e => setInterests([...interests.slice(0, index), e.target.value, ...interests.slice(index + 1)])} />
          ))}
          <Button onClick={onSave}>Enregistrer</Button>
        </>
      ) : (
        <>
          {interests.map((interest, index) => (
            <p key={index}>Centre d'intérêt: {interest}</p>
          ))}
        </>
      )}
    </>
  );
}
