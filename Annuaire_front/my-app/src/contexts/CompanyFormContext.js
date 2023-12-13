import React, { createContext, useState } from 'react';

export const CompanyFormContext = createContext();

export const CompanyFormProvider = ({ children }) => {
  // companyData va stocker les information de l'entreprise sélectionné ou créé
  const [companyData, setCompanyData] = useState({});

  // updateCompanyData est appelé pour mettre à jour companyData avec les nvlles informations de l'entreprise
  const updateCompanyData = (data) => {
    setCompanyData(data);
  };

  return (
    <CompanyFormContext.Provider value={{ companyData, updateCompanyData }}>
      {children}
    </CompanyFormContext.Provider>
  );
};