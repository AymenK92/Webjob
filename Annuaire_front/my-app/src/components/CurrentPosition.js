import React, { useState } from "react";
import { TextField, Button } from "@mui/material";

export function CurrentPosition({ isEditing, onSave }) {
  const [currentPosition, setCurrentPosition] = useState("Développeur");
  const [desiredPosition, setDesiredPosition] = useState("Architecte Logiciel");

  return (
    <>
      {isEditing ? (
        <>
          <TextField label="Poste actuel" value={currentPosition} onChange={e => setCurrentPosition(e.target.value)} />
          <TextField label="Poste recherché" value={desiredPosition} onChange={e => setDesiredPosition(e.target.value)} />
          <Button onClick={onSave}>Enregistrer</Button>
        </>
      ) : (
        <>
          <p>Poste actuel: {currentPosition}</p>
          <p>Poste recherché: {desiredPosition}</p>
        </>
      )}
    </>
  );
}
