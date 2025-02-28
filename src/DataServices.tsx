import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios'; // Import Axios
import { Language } from './Types';
import { textContent } from './textContext'; 



interface ScrapingProps {
  onReturn: () => void; // Callback to handle returning to the main view
  language: Language;
}

interface UrlItem {
  id: number;
  url: string;
}

interface ObjectField {
  id: number;
  name: string;
  type: string;
  customType?: string; // Optional field for custom type
}

interface DataTypeObject {
  id: number;
  name: string;
  fields: ObjectField[];
}
type MessageType = { type: 'success' | 'error'; text: string };

const Scraping: React.FC<ScrapingProps> = ({ onReturn, language }) => {
  const [url, setUrl] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [urls, setUrls] = useState<UrlItem[]>([]);
  const [objectName, setObjectName] = useState<string>('');
  const [fieldName, setFieldName] = useState<string>('');
  const [fieldType, setFieldType] = useState<string>('string');
  const [customType, setCustomType] = useState<string>('');
  const [dataTypeObjects, setDataTypeObjects] = useState<DataTypeObject[]>([]);
  const [editingObjectId, setEditingObjectId] = useState<number | null>(null);
  const [step, setStep] = useState<number>(1); // 1: Main form, 2: Contact info
  const [email, setEmail] = useState<string>('');
  const [cellphone, setCellphone] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<MessageType | null>(null);


  const t = textContent[language];

  // Handle adding a URL
  const handleAddUrl = () => {
    if (url.trim()) {
      const newUrl: UrlItem = {
        id: Date.now(), // Use timestamp as a unique ID
        url: url.trim(),
      };
      setUrls([...urls, newUrl]);
      setUrl(''); // Clear the URL input
    }
  };

  // Handle deleting a URL
  const handleDeleteUrl = (id: number) => {
    const updatedUrls = urls.filter((item) => item.id !== id);
    setUrls(updatedUrls);
  };

  // Handle adding a data type object
  const handleAddObject = () => {
    if (objectName.trim()) {
      const newObject: DataTypeObject = {
        id: Date.now(), // Use timestamp as a unique ID
        name: objectName.trim(),
        fields: [],
      };
      setDataTypeObjects([...dataTypeObjects, newObject]);
      setObjectName(''); // Clear the object name input
    }
  };

  // Handle adding a field to an object
  const handleAddField = (objectId: number) => {
    if (fieldName.trim() && fieldType.trim()) {
      const newField: ObjectField = {
        id: Date.now(), // Use timestamp as a unique ID
        name: fieldName.trim(),
        type: fieldType,
        customType: fieldType === 'custom' ? customType : undefined, // Add custom type if applicable
      };

      const updatedObjects = dataTypeObjects.map((obj) =>
        obj.id === objectId ? { ...obj, fields: [...obj.fields, newField] } : obj
      );
      setDataTypeObjects(updatedObjects);
      setFieldName(''); // Clear the field name input
      setFieldType('string'); // Reset the field type
      setCustomType(''); // Clear the custom type input
    }
  };

  // Handle deleting a field from an object
  const handleDeleteField = (objectId: number, fieldId: number) => {
    const updatedObjects = dataTypeObjects.map((obj) =>
      obj.id === objectId
        ? { ...obj, fields: obj.fields.filter((field) => field.id !== fieldId) }
        : obj
    );
    setDataTypeObjects(updatedObjects);
  };

  // Handle deleting an object
  const handleDeleteObject = (objectId: number) => {
    const updatedObjects = dataTypeObjects.filter((obj) => obj.id !== objectId);
    setDataTypeObjects(updatedObjects);
  };

  // Handle editing an object
  const handleEditObject = (objectId: number) => {
    setEditingObjectId(objectId);
    const objectToEdit = dataTypeObjects.find((obj) => obj.id === objectId);
    if (objectToEdit) {
      setObjectName(objectToEdit.name);
    }
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    
    // Prepare the JSON body
    const requestBody = {
      description,
      urls,
      data_type_objects: dataTypeObjects, // Ensure this matches the backend schema
      contact_info: { // Ensure this matches the backend schema
        email,
        cellphone,
      },
    };
  
    try {
      // Make the POST request using Axios
      const response = await axios.post('http://127.0.0.1:8080/orders/webscraporder', requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      console.log('Form submitted successfully:', response.data);
      setMessage({ type: 'success', text: 'Form submitted successfully!' });

      // Handle success (e.g., show a success message or redirect)
    } catch (error) {
      console.error('Error submitting the form:', error);
      setMessage({ type: 'error', text: 'Failed to submit the form. Please try again.' });
      // Handle error (e.g., show an error message)
    } finally {
        setLoading(false);
    }
  };


  // Handle moving to the next step
  const handleNextStep = () => {
    setStep(2); // Move to the contact info step
  };

  // Handle moving back to the previous step
  const handlePreviousStep = () => {
    setStep(1); // Move back to the main form step
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      {/* Return Arrow */}
      <IconButton
        onClick={onReturn}
        sx={{
          color: '#62ff32',
          alignSelf: 'flex-start',
          '&:hover': {
            backgroundColor: 'rgba(98, 255, 50, 0.1)',
          },
        }}
      >
        <ArrowBack sx={{ fontSize: '24px' }} />
      </IconButton>

      <Typography
        variant="h6"
        sx={{
          fontFamily: '"Press Start 2P", cursive',
          fontSize: '14px',
          color: '#62ff32',
          textAlign: 'center',
        }}
      >
        {t.webScrapingService}
      </Typography>

      {/* Step 1: Main Form */}
      {step === 1 && (
        <>
          {/* Description Input */}
          <TextField
            label={t.descriptionLabel}
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: '#62ff32',
                },
                '&:hover fieldset': {
                  borderColor: '#62ff32',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#62ff32',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#62ff32',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#62ff32',
              },
            }}
          />

          {/* URL Input */}
          <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <TextField
              label={t.urlLabel}
              variant="outlined"
              fullWidth
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: '#62ff32',
                  },
                  '&:hover fieldset': {
                    borderColor: '#62ff32',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#62ff32',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#62ff32',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#62ff32',
                },
              }}
            />
            <Button
              onClick={handleAddUrl}
              sx={{
                backgroundColor: '#1a1a1a',
                color: 'white',
                border: '1px solid #62ff32',
                borderRadius: '8px',
                fontFamily: '"Press Start 2P", cursive',
                fontSize: '12px',
                padding: '10px 20px',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#62ff32',
                  color: 'black',
                },
              }}
            >
              {t.addUrlButton}
            </Button>
          </Box>

          {/* List of URLs */}
          <List sx={{ width: '100%', marginTop: '20px' }}>
            {urls.map((item) => (
              <ListItem key={item.id} sx={{ borderBottom: '1px solid #62ff32' }}>
                <ListItemText primary={item.url} sx={{ color: 'white' }} />
                <ListItemSecondaryAction>
                  <IconButton
                    onClick={() => handleDeleteUrl(item.id)}
                    sx={{ color: '#ff0000' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>

          {/* Data Type Objects Section */}
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Press Start 2P", cursive',
              fontSize: '14px',
              color: '#62ff32',
              textAlign: 'center',
              marginTop: '20px',
            }}
          >
            {t.defineDataTypes}
          </Typography>

          {/* Object Name Input */}
          <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <TextField
              label={t.objectNameLabel}
              variant="outlined"
              fullWidth
              value={objectName}
              onChange={(e) => setObjectName(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: '#62ff32',
                  },
                  '&:hover fieldset': {
                    borderColor: '#62ff32',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#62ff32',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#62ff32',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#62ff32',
                },
              }}
            />
            <Button
              onClick={handleAddObject}
              sx={{
                backgroundColor: '#1a1a1a',
                color: 'white',
                border: '1px solid #62ff32',
                borderRadius: '8px',
                fontFamily: '"Press Start 2P", cursive',
                fontSize: '12px',
                padding: '10px 20px',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#62ff32',
                  color: 'black',
                },
              }}
            >
              {editingObjectId !== null ? t.updateObjectButton : t.addObjectButton}
            </Button>
          </Box>

          {/* List of Data Type Objects */}
          {dataTypeObjects.map((obj) => (
            <Box key={obj.id} sx={{ marginTop: '20px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: '"Press Start 2P", cursive',
                    fontSize: '12px',
                    color: '#62ff32',
                  }}
                >
                  {obj.name}
                </Typography>
                <IconButton
                  onClick={() => handleEditObject(obj.id)}
                  sx={{ color: '#62ff32' }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDeleteObject(obj.id)}
                  sx={{ color: '#ff0000' }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>

              {/* Fields for the Object */}
              <Box sx={{ marginLeft: '20px', marginTop: '10px' }}>
                <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <TextField
                    label={t.fieldNameLabel}
                    variant="outlined"
                    fullWidth
                    value={fieldName}
                    onChange={(e) => setFieldName(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': {
                          borderColor: '#62ff32',
                        },
                        '&:hover fieldset': {
                          borderColor: '#62ff32',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#62ff32',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#62ff32',
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#62ff32',
                      },
                    }}
                  />
                  <FormControl fullWidth>
                    <InputLabel
                      sx={{
                        color: '#62ff32',
                        '&.Mui-focused': {
                          color: '#62ff32',
                        },
                      }}
                    >
                      {t.fieldTypeLabel}
                    </InputLabel>
                    <Select
                      value={fieldType}
                      onChange={(e) => setFieldType(e.target.value as string)}
                      sx={{
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#62ff32',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#62ff32',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#62ff32',
                        },
                      }}
                      label={t.fieldTypeLabel}
                    >
                      <MenuItem value="string">string</MenuItem>
                      <MenuItem value="number">number</MenuItem>
                      <MenuItem value="boolean">boolean</MenuItem>
                      <MenuItem value="custom">custom</MenuItem>
                    </Select>
                  </FormControl>
                  {fieldType === 'custom' && (
                    <TextField
                      label={t.customTypeLabel}
                      variant="outlined"
                      fullWidth
                      value={customType}
                      onChange={(e) => setCustomType(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': {
                            borderColor: '#62ff32',
                          },
                          '&:hover fieldset': {
                            borderColor: '#62ff32',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#62ff32',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#62ff32',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#62ff32',
                        },
                      }}
                    />
                  )}
                  <Button
                    onClick={() => handleAddField(obj.id)}
                    sx={{
                      backgroundColor: '#1a1a1a',
                      color: 'white',
                      border: '1px solid #62ff32',
                      borderRadius: '8px',
                      fontFamily: '"Press Start 2P", cursive',
                      fontSize: '12px',
                      padding: '10px 20px',
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: '#62ff32',
                        color: 'black',
                      },
                    }}
                  >
                    {t.addFieldButton}
                  </Button>
                </Box>

                {/* List of Fields */}
                <List sx={{ width: '100%', marginTop: '10px' }}>
                  {obj.fields.map((field) => (
                    <ListItem key={field.id} sx={{ borderBottom: '1px solid #62ff32' }}>
                      <ListItemText
                        primary={`${field.name}: ${field.type}${field.customType ? ` (${field.customType})` : ''}`}
                        sx={{ color: 'white' }}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          onClick={() => handleDeleteField(obj.id, field.id)}
                          sx={{ color: '#ff0000' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          ))}

          {/* Next Button */}
          <Button
            onClick={handleNextStep}
            sx={{
              backgroundColor: '#1a1a1a',
              color: 'white',
              border: '1px solid #62ff32',
              borderRadius: '8px',
              fontFamily: '"Press Start 2P", cursive',
              fontSize: '12px',
              padding: '10px 20px',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#62ff32',
                color: 'black',
              },
            }}
          >
            {t.nextButton}
          </Button>
        </>
      )}

      {/* Step 2: Contact Info */}
      {step === 2 && (
        <>
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Press Start 2P", cursive',
              fontSize: '14px',
              color: '#62ff32',
              textAlign: 'center',
            }}
          >
            {t.contactInfoTitle}
          </Typography>

          {/* Email Input */}
          <TextField
            label={t.emailLabel}
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: '#62ff32',
                },
                '&:hover fieldset': {
                  borderColor: '#62ff32',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#62ff32',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#62ff32',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#62ff32',
              },
            }}
          />

          {/* Cellphone Input */}
          <TextField
            label={t.cellphoneLabel}
            variant="outlined"
            fullWidth
            value={cellphone}
            onChange={(e) => setCellphone(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: '#62ff32',
                },
                '&:hover fieldset': {
                  borderColor: '#62ff32',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#62ff32',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#62ff32',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#62ff32',
              },
            }}
          />

          {/* Previous Button */}
          <Button
            onClick={handlePreviousStep}
            sx={{
              backgroundColor: '#1a1a1a',
              color: 'white',
              border: '1px solid #62ff32',
              borderRadius: '8px',
              fontFamily: '"Press Start 2P", cursive',
              fontSize: '12px',
              padding: '10px 20px',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#62ff32',
                color: 'black',
              },
            }}
          >
            {t.backButton}
          </Button>

          {/* Submit Button */}
          
          <Button
            type="submit"
            sx={{
              backgroundColor: '#1a1a1a',
              color: 'white',
              border: '1px solid #62ff32',
              borderRadius: '8px',
              fontFamily: '"Press Start 2P", cursive',
              fontSize: '12px',
              padding: '10px 20px',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#62ff32',
                color: 'black',
              },
            }}
          >
            {t.sendButton}
          </Button>
          {loading && (
          <Typography variant="body2" color="#62ff32" textAlign="center">
            Submitting...
          </Typography>
        )}
              {message && (
        <Typography
          variant="body2"
          color={message.type === 'success' ? 'green' : 'red'}
          textAlign="center"
          sx={{
            fontFamily: '"Press Start 2P", cursive',
          }}
        >
          {message.text}
        </Typography>
      )}

        </>
      )}
    </Box>
  );
};



type DataServiceProps = {
  language: Language;
  showScrapingForm: boolean;
  setShowScrapingForm: (value: boolean) => void;
};

const DataServices : React.FC<DataServiceProps> = ({
  language, 
  showScrapingForm, 
  setShowScrapingForm}) => {
  return(
    <>
    <Box sx={{ marginTop: '20px' }}>
    {/* Show the ScrapingForm if showScrapingForm is true */}
    {showScrapingForm ? (
      <Scraping language={language} onReturn={() => setShowScrapingForm(false)} />
    ) : (
      <>
        <Typography
          variant="h4"
          sx={{
            fontFamily: '"Press Start 2P", cursive',
            fontSize: '24px',
            color: '#62ff32',
            marginBottom: '20px',
          }}
        >
          {textContent[language].dataServicesTitle}
        </Typography>

        {/* Directly show the ScrapingForm when "data services" is selected */}
        <Button
          onClick={() => setShowScrapingForm(true)} // Show the form
          sx={{
            backgroundColor: '#1a1a1a',
            color: 'white',
            border: '1px solid #62ff32',
            borderRadius: '8px',
            fontFamily: '"Press Start 2P", cursive',
            fontSize: '12px',
            padding: '10px 20px',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#62ff32',
              color: 'black',
            },
          }}
        >
          {textContent[language].webScraping}
        </Button>
      </>
    )}
  </Box>
  </>
  );
}

export default DataServices;

