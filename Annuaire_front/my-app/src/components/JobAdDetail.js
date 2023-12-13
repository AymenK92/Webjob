import React, { useState } from 'react';
import { Box, Typography, Grid, Link, Button } from '@mui/material';
import axios from 'axios';


const JobAdDetail = ({ jobAd }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString() : 'Non spécifiée';
  };

  // Fonction pour obtenir le nom de l'entreprise
  const getCompanyName = (jobAd) => {
    if (jobAd && jobAd.company_details && jobAd.company_details.name) {
      return jobAd.company_details.name;
    }
    return 'Non spécifié';
  };

   const generatePDF = () => {
    console.log("Génération du PDF pour l'annonce ID:", jobAd.id);
    setIsGenerating(true);

    axios.get(`http://localhost:8000/api/generate-pdf/${jobAd.id}`, { responseType: 'blob' })
      .then(response => {
        const pdfBlob = response.data;
        console.log("Blob PDF reçu:", pdfBlob);
        const pdfUrl = window.URL.createObjectURL(pdfBlob);

        // Création d'un élément de lien pour le téléchargement
        const downloadLink = document.createElement('a');
        downloadLink.href = pdfUrl;
        downloadLink.setAttribute('download', `annonce_${jobAd.id}.pdf`);
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        window.URL.revokeObjectURL(pdfUrl);
      })
      .catch(error => {
        console.error('Erreur lors de la génération du PDF:', error);
      })
      .finally(() => {
        setIsGenerating(false);
      });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>{jobAd.job_title}</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Entreprise:</Typography>
          <Typography variant="body1">{getCompanyName(jobAd)}</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Lieu:</Typography>
          <Typography variant="body1">{jobAd.job_location}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Description:</Typography>
          <Typography variant="body1">{jobAd.job_description}</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Type de poste:</Typography>
          <Typography variant="body1">{jobAd.job_type}</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Site du poste:</Typography>
          <Typography variant="body1">{jobAd.job_site}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Lien vers l'annonce:</Typography>
          {jobAd.job_link ? (
            <Link href={jobAd.job_link} target="_blank" rel="noopener noreferrer">
              Voir l'annonce
            </Link>
          ) : (
            <Typography variant="body1">Non spécifié</Typography>
          )}
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Date de contact:</Typography>
          <Typography variant="body1">{formatDate(jobAd.contact_date)}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="outlined"
            color="primary"
            onClick={generatePDF}
            disabled={isGenerating}
          >
            {isGenerating ? 'Génération en cours...' : 'Générer PDF'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default JobAdDetail;
