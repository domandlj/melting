import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import DataObject from '@mui/icons-material/DataObject';
import CodeIcon from '@mui/icons-material/Code';
import { Language, NavBarState } from './Types'; 
import { textContent } from './textContext'; 



type NavBarProps = {
  selectedButton: NavBarState;
  setSelectedButton: (value: NavBarState) => void;
  setShowScrapingForm: (value: boolean) => void;
  language: Language;
  setLanguage: (value : Language) => void;
};

const NavBar: React.FC<NavBarProps> = ({
  selectedButton,
  setSelectedButton,
  setShowScrapingForm,
  language,
  setLanguage}) => {

  const toggleLanguage = () => {
    language === 'EN' 
      ? setLanguage('ES') 
      : setLanguage('EN');
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <AppBar position="static" sx={{ backgroundColor: 'black', boxShadow: 'none' }}>
        <Toolbar>
          {/* Logo */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flexGrow: 1, // Pushes the navigation options to the right
            }}
          >
            <img
              src="./melting.png"
              alt="Melting Logo"
              style={{ height: '80px', objectFit: 'contain' }}
            />
          </Box>

          {/* Navigation Options */}
          <Box sx={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {/* Language Toggle Button */}
            <Button
              onClick={toggleLanguage}
              sx={{
                color: '#62ff32',
                fontFamily: '"Press Start 2P", cursive',
                fontSize: '12px',
                textTransform: 'none',
                border: '1px solid #62ff32',
                borderRadius: '8px',
                padding: '5px 10px',
                '&:hover': {
                  backgroundColor: 'rgba(98, 255, 50, 0.1)',
                },
              }}
            >
              {language === 'EN' ? 'ES' : 'EN'}
            </Button>
            {/* Web Services Button */}
            <Button
              onClick={() => {
                setSelectedButton('web');
                setShowScrapingForm(false); // Reset form visibility when switching to data services
              }}
              sx={{
                color: 'white',
                fontFamily: '"Press Start 2P", cursive',
                fontSize: '10px',
                textTransform: 'none', // Prevents uppercase transformation
                position: 'relative', // Required for the pseudo-element
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '2px',
                  backgroundColor: selectedButton === 'web' ? '#62ff32' : 'transparent', // Light green highlight if selected
                  transition: 'background-color 0.3s ease', // Smooth transition
                },
              }}
            >
              {textContent[language].webServices}
              <CodeIcon sx={{ marginLeft: '8px', fontSize: '16px' }} /> {/* Data icon */}
            </Button>

            {/* Data Services Button */}
            <Button
              onClick={() => {
                setSelectedButton('data');
                setShowScrapingForm(false); // Reset form visibility when switching to data services
              }}
              sx={{
                color: 'white',
                fontFamily: '"Press Start 2P", cursive',
                fontSize: '10px',
                textTransform: 'none', // Prevents uppercase transformation
                position: 'relative', // Required for the pseudo-element
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '2px',
                  backgroundColor: selectedButton === 'data' ? '#62ff32' : 'transparent', // Light green highlight if selected
                  transition: 'background-color 0.3s ease', // Smooth transition
                },
              }}
            >
              {textContent[language].dataServices}
              <DataObject sx={{ marginLeft: '8px', fontSize: '16px' }} /> {/* Data icon */}
            </Button>

            {/* About Button */}
            <Button
              onClick={() => setSelectedButton('about')} // Set selected button to 'about'
              sx={{
                color: 'white',
                fontFamily: '"Press Start 2P", cursive',
                fontSize: '12px',
                textTransform: 'none', // Prevents uppercase transformation
                position: 'relative', // Required for the pseudo-element
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '2px',
                  backgroundColor: selectedButton === 'about' ? '#62ff32' : 'transparent', // Light green highlight if selected
                  transition: 'background-color 0.3s ease', // Smooth transition
                },
              }}
            >
              {textContent[language].about}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default NavBar;