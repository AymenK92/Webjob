import React, { useState } from "react";
import { Card, IconButton, List, ListItem, ListItemText, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function Abilities({ isEditing }) {
  const [skills, setSkills] = useState(["Compétence 1", "Compétence 2"]);
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    setSkills([...skills, newSkill]);
    setNewSkill("");
  };

  const handleNewSkillChange = (event) => {
    setNewSkill(event.target.value);
  };

  return (
    <Card>
      {isEditing ? (
        <>
          {skills.map((skill, index) => (
            <TextField
              key={index}
              label="Compétence"
              value={skill}
              onChange={(e) =>
                setSkills([...skills.slice(0, index), e.target.value, ...skills.slice(index + 1)])
              }
            />
          ))}
          <TextField label="Nouvelle compétence" value={newSkill} onChange={handleNewSkillChange} />
          <IconButton onClick={addSkill}>
            <AddIcon />
          </IconButton>
        </>
      ) : (
        <List>
          {skills.map((skill, index) => (
            <ListItem key={index}>
              <ListItemText primary={skill} />
            </ListItem>
          ))}
        </List>
      )}
    </Card>
  );
}
