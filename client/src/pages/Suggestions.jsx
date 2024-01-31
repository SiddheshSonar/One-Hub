import React, { useState, useEffect } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Center from '../animated-components/DCenter';
import Api from '../api';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';

const Suggestions = () => {
    const [loading, setLoading] = useState(true);
    const [suggestions, setSuggestions] = useState([]);
    const [hasNoSuggestions, setHasNoSuggestions] = useState(false); 
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchSuggestions = async () => {
            await Api.getUserSuggestions({
                email: user.email
            })
                .then((res) => {
                    console.log(res.data);
                    if (res.data.suggestion.length === 0) {
                        setHasNoSuggestions(true);
                    }
                    else {
                        setHasNoSuggestions(false);
                    }
                    setSuggestions(res.data.suggestion);
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    toast.error("Something went wrong!");
                })
        }
        fetchSuggestions();
    }, []);

    const formatDate = (dateString) => {
        const dateObject = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        return dateObject.toLocaleString('en-US', options);
    };

    return (
        <div className='w-full h-full'>
            {loading ?
                (<div className='flex justify-center items-center h-full'>
                    <CircularProgress sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                    }} />
                </div>)
                :
                (<div className='w-full p-4 h-screen flex flex-col items-center gap-4'>
                    <Center>
                    <div className='w-full text-center'>
                        <h1 className='text-3xl font-bold'>Suggestions</h1>
                        <p>All your suggestions are stored here!</p>
                    </div>
                    {hasNoSuggestions ? 
                    (<div className='w-full h-full flex flex-col items-center justify-center mt-16'>
                        <h1 className='text-3xl font-bold'>No Suggestions Found :(</h1>
                        {/* <p>You have not made any suggestions yet!</p> */}
                    </div>)
                    : (<div className='w-full'>
                        {suggestions.reverse().map((suggestion, index) => (
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1-content"
                                    id="panel1-header"
                                    sx={{
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {suggestion.app + ' - ' + formatDate(suggestion.date)}
                                </AccordionSummary>
                                <AccordionDetails sx={{ textAlign: 'justify' }}>
                                    {suggestion.description}
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </div>)}
                    </Center>
                </div>)}
        </div>
    );
};

export default Suggestions;