import React, { useState } from 'react';
import {  Box, Container } from '@mui/material';
import { Language, NavBarState } from './Types'; 
import NavBar from './NavBar'; 
import DataServices from './DataServices'; 



const App: React.FC = () => {
  const [selectedButton, setSelectedButton] = useState<NavBarState>('data');
  const [showScrapingForm, setShowScrapingForm] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>('ES'); 

  return (
    <Box
      sx={{
        backgroundColor: 'black',
        color: 'white',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      {/* Top Navigation Bar */}
      <NavBar
        selectedButton={selectedButton}
        setSelectedButton={setSelectedButton}
        setShowScrapingForm={setShowScrapingForm}
        language={language}
        setLanguage={setLanguage}
      />

      {/* Main Content */}
      <Container>
        {/* Display content based on selected button */}
        {selectedButton === 'data' && (
          <DataServices   
            language={language}
            showScrapingForm={showScrapingForm}
            setShowScrapingForm={setShowScrapingForm} 
          />
        )}
      </Container>
    </Box>
  );
};

export default App;