import React, { useState, useEffect } from "react";
import { Button, TextField, Box } from "@mui/material";

export function Skills({ data, isEditing, onSave }) {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [addingSkill, setAddingSkill] = useState(false);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setSkills(data);
    }
  }, [data]);

  const handleAddSkill = () => {
    setAddingSkill(true);
  };

  const handleSaveNewSkill = () => {
    if (newSkill.trim() === "") {
      alert("Veuillez entrer une compétence valide.");
      return;
    }

    const updatedSkills = [...skills, newSkill];
    setSkills(updatedSkills);
    setNewSkill("");
    setAddingSkill(false);
    onSave(updatedSkills);
  };

  const handleChange = (event) => {
    setNewSkill(event.target.value);
  };

  const skillList = skills.map((skill, index) => (
    <li key={index}>{skill}</li>
  ));

  console.log("Skills:", skills);

  return (
    <>
      {isEditing ? (
        <Box>
          <ul>
            {skillList}
          </ul>
          {addingSkill ? (
            <Box>
              <TextField label="Compétence" value={newSkill} onChange={handleChange} />
              <Button onClick={handleSaveNewSkill} sx={{ mt: 2 }}>Enregistrer</Button>
            </Box>
          ) : (
            <Button onClick={handleAddSkill} sx={{ mt: 2 }}>Ajouter</Button>
          )}
        </Box>
      ) : (
        <ul>
          {skillList}
        </ul>
      )}
    </>
  );
}
