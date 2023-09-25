import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";

export function Education({ data, isEditing, onSave }) {
  const [educationInfo, setEducationInfo] = useState({
    institution: "",
    degree: "",
    years: ""
  });

  useEffect(() => {
    if (isEditing && data) {
      setEducationInfo({
        institution: data.institution || "",
        degree: data.degree || "",
        years: data.years || ""
      });
    }
  }, [isEditing, data]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEducationInfo({
      ...educationInfo,
      [name]: value,
    });
  };

  const handleSave = () => {
    onSave(educationInfo);
  };

  return (
    <>
      {isEditing ? (
        <>
          <TextField
            name="institution"
            label="École"
            value={educationInfo.institution}
            onChange={handleChange}
          />
          <TextField
            name="degree"
            label="Diplôme"
            value={educationInfo.degree}
            onChange={handleChange}
          />
          <TextField
            name="years"
            label="Années"
            value={educationInfo.years}
            onChange={handleChange}
          />
          <Button onClick={handleSave}>Enregistrer</Button>
        </>
      ) : (
        <>
          <p>École: {educationInfo.institution}</p>
          <p>Diplôme: {educationInfo.degree}</p>
          <p>Années: {educationInfo.years}</p>
        </>
      )}
    </>
  );
}
