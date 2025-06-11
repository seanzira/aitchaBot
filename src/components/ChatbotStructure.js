import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import '../css/chat.css';

// Chat component
const Chat = () => {
    const username = localStorage.getItem('username') || 'You';

    const [ isLoggedIn, setIsLoggedIn ] = useState(!!localStorage.getItem('username'));
    const [ userInput, setUserInput] = useState('');
    const [ loading, setLoading ] = useState(false);
    const [ data, setData ] = useState([]);
    const [ spellErrors, setSpellErrors ] = useState({});
    const [ excelContent, setExcelContent ] = useState(null);

    const [ chatHistory, setChatHistory ] = useState(() => {
        const savedHistory = localStorage.getItem(`chatHistory_${username}`);
        return savedHistory ? JSON.parse(savedHistory) : [];
    })

    // Function to check the spelling of a given text (cell in Excel)
    const checkSpelling = async (text, rowIndex, cellIndex) => {
        const apiKey = process.env.SPELL_CHECKER_API_KEY;
        const response = await fetch(
            `https://api.textgears.com/spelling?key=${apiKey}&text=${encodeURIComponent(text)}&language=en-GB`
        );

        const result = await response.json();

        // Store any spelling found in state
        if (result && result.response && result.response.errors) {
            setSpellErrors(prev => ({
                ...prev,
                [`${rowIndex}-${cellIndex}`] : result.response.errors.map(err => err.bad)
            }));
        }
    };

    // Function to render Excel cell values with misspelled words highlighted
    const highlightMissSpellings = (text, rowIndex, cellIndex) => {
        const key = `${rowIndex}-${cellIndex}`;
        const misspelledWords = spellErrors[key] || [];

        return text.split(/\s+/).map((word, i) => {
            const cleanWord = word.replace(/[.,!?;:]/g, '');
            if (misspelledWords.includes(cleanWord)) {
                return <span key={i} className='misspelled'>{word}</span>
            }

            return word + ' ';
        })
    }

    // Function to handle uploading and processing of Excel files
    const handleFileUpload = async (e) => {
        const reader = new FileReader();
        reader.readAsBinaryString(e.target.files[0]);

        reader.onload = async (e) => {
            const binaryData = e.target.result;
            const workbook = XLSX.read(binaryData, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const parsedData = XLSX.utils.sheet_to_json(sheet);

            // Save raw Excel data temporarily
            setExcelContent(parsedData);

            // Convert to string and set as user input
            const flattenedText = parsedData.map(row => 
                Object.values(row).join(' ')
            ).join('\n');

            // Triggers the submit button
            setUserInput(flattenedText);
        }
    }

    // Function to handle form submission and interaction with AI backend
    const handleStorage = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Regex to detect common greetings
        const greetingRegex = /\b(hi|hello|hey|yo|hola|ola|what'?s up|sup|good morning|good afternoon|good evening)\b/i;

        try {
            let aiResponse;

            // If user input is a greeting, provide a hardcoded friendly response
            if (greetingRegex.test(userInput.trim())) {
                aiResponse = "Que pasa, it's Aitcha, how can I serve you?";
            } else {
                // Logging the user input into the Llama LLM
                const response = await axios.post('http://localhost:3001/api/chatbot', {
                    userInput
                });
                aiResponse = response.data.reply;
            }

            // Create new chat entry and update chat history
            const newEntry = { user: userInput, ai: aiResponse};
            const updatedHistory = [...chatHistory, newEntry]

            if (excelContent) {
                setData(excelContent);

                for (let rowIndex = 0; rowIndex < excelContent.length; rowIndex++) {
                    const row = excelContent[rowIndex];
                    const values = Object.values(row);

                    for (let cellIndex = 0; cellIndex < values.length; cellIndex++) {
                        const value = values[cellIndex];

                        if (typeof value === 'string') {
                            await checkSpelling(value, rowIndex, cellIndex);
                        }
                    }
                }

                updatedHistory.push({ type: 'excel', data: excelContent});
                localStorage.setItem(`chatHistory_${username}`, JSON.stringify(updatedHistory));

                // Reset excelContent after use 
                setExcelContent(null);
            }

            setUserInput('');
        } catch (error) {
            // Error handling and debugging alert to monitor the storage of information
            console.log(error);
            alert('Input is at risk of not being stored');
        } finally {
            // Loading indicator hidden when AI response is generated
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('chatHistory');
        setIsLoggedIn(false);
    }

    return (
        <div className={`form-wrapper ${chatHistory.length > 0 ? 'bottom' : ''}`}>
            <form onSubmit={handleStorage}>
                <div className='chat-history'>
                    {chatHistory.map((entry, index) => {
                        if (entry.type === 'excel') {
                            return (
                                <div key={index} className='chat-entry excel-data'>
                                    <strong>Uploaded Excel File</strong>
                                    <table className='table'>
                                        <thead>
                                            <tr>
                                                {Object.keys(entry.data[0]).map((key) => (
                                                    <th key={key}>{key}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {entry.data.map((row, rowIndex) => (
                                                <tr key={rowIndex}>
                                                    {Object.values(row).map((value, cellIndex) => (
                                                        <td key={cellIndex}>
                                                            {typeof value === 'string'
                                                                ? highlightMissSpellings(value, rowIndex, cellIndex)
                                                                : value}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            );
                        }

                        return (
                            <div key={index} className='chat-entry'>
                                <div className='submitted-input'>
                                    <strong>{username}</strong> {entry.user}
                                </div>
                                <div className='ai-response'>
                                    <strong>AI:</strong> {entry.ai}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {loading && (
                    <div className='loading'>
                        <p>Responding...</p>
                    </div>
                )}

                <input
                    type='text'
                    placeholder='What do you need help with?'
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    required
                />

                {userInput.trim() !== '' && (
                    <button type='submit'>Submit</button>
                )}

                <Link to='/history'>
                    <button type='button'>VIEW HISTORY</button>
                </Link>

                <input
                    type='file'
                    accept='.xlsx, .xls'
                    onChange={handleFileUpload}
                />

                {!isLoggedIn ? (
                    <div className='sign-up-button'>
                        <Link to='/login'>
                            <button type='button'>SIGN UP/LOGIN</button>
                        </Link>
                    </div>
                ) : (
                    <div className='logout-button'>
                        <button type='button' onClick={handleLogout}>LOGOUT</button>
                    </div>
                )}
            </form>
        </div>
    );
};

// Export the component
export default Chat; 
