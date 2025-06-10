import React, {useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/history.css';

// History component
const History = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    // State variables
    const [summary, setSummary] = useState('');
    const [allSummaries, setAllSummaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [likes, setLikes] = useState({});

    // Redirect to login if user is not logged in
    useEffect(() => {
        if (!username) {

            // Pass redirect param so after login, user returns here
            navigate('/login?redirect=/history');
        }
    }, [username, navigate]);

    // Generating a session ID
    function generateSessionId(history) {
        return btoa(
          history.map(entry => `${entry.user}|${entry.ai}`).join('||')
        ).slice(0, 32); // shorten the hash for storage
      }

    // Load summaries + generate new summary if needed
    useEffect(() => {
        // Exit if not logged in
        if (!username) return;

        // Retrieve chat history for current user
        const chatHistory = JSON.parse(localStorage.getItem(`chatHistory_${username}`)) || [];

        // Handle empty chat history
        if (chatHistory.length === 0) {
            setSummary('No chat history available to summarize.');
            setLoading(false);
            return;
        }

        // Generate session ID
        const sessionId = generateSessionId(chatHistory); 

        // Prepare combined prompt from chat history
        const combinedPrompt = chatHistory.map(entry => `User: ${entry.user}\nAI: ${entry.ai}`).join('\n\n');

        // Retrieve stored summaries for current user
        const storedSummaries = JSON.parse(localStorage.getItem(`summaries_${username}`)) || [];

        // Check if summary already exists for this session
        const alreadySummarized = storedSummaries.some(s => s.sessionId === sessionId);
        if (alreadySummarized) {
            setAllSummaries(storedSummaries);
            setSummary('Summary already generated for this session');
            setLoading(false);
            return;
        }

        // If not summarized yet, call API to generate summary
        axios.post('http://localhost:3001/api/summarize', { prompt: combinedPrompt})
        .then(res => {
            const newSummary = res.data.summary;
            const timestamp = new Date().toISOString();
            const summaryEntry = { summary: newSummary, timestamp };

            // Update summary array
            const updatedSummaries = [...storedSummaries, summaryEntry];

            // Store updated summaries in localStorage
            localStorage.setItem(`summaries_${username}`, JSON.stringify(updatedSummaries));

            // Update UI state
            setSummary(newSummary);
            setAllSummaries(updatedSummaries);
            setLoading(false);
        })
        .catch(err => {
            console.error('Failed to fetch summary:', err);
            setSummary('Error generating summary.');
            setLoading(false);
        });

        // Load likes state from localStorage
        const storedLikes = JSON.parse(localStorage.getItem(`summaryLikes_${username}`)) || {};
        setLikes(storedLikes);
    }, [username]);

    // Like / Unlike a summary
    const toggleLike = (timestamp) => {
        const updatedLikes = {
            ...likes,
            [timestamp]: !likes[timestamp]
        }
        setLikes(updatedLikes);
        localStorage.setItem(`summaryLikes_${username}`, JSON.stringify(updatedLikes))
    }

    // Clear chat history, summaries, and likes
    const clearHistory = () => {
        if (window.confirm('Are you sure you want to clear your chat history, summaries and likes?')) {
            localStorage.removeItem(`chatHistory_${username}`);
            localStorage.removeItem(`summaries_${username}`);
            localStorage.removeItem(`summaryLikes_${username}`);
            setAllSummaries([]);
            setLikes({});
            setSummary('No chat history available to summarize');
        }
    };

    // If not logged in, render nothing (to avoid flashing UI)
    if (!username) return null;

    // Render component
    return (
        <div className='history-container'>
            <h2>{username}'s Chat Summary</h2>
            {loading ? (
                <p className='loading'>Responding...</p>
            ) : (
                <p className='summary-text'>{summary}</p>
            )}

            <h2>All Past Summaries</h2>
            <div className='summary-list'>
                {[...allSummaries].reverse().map((entry, index) => (
                    <div key={index} className='summary-item'>
                        <h3>{new Date(entry.timestamp).toLocaleString()}</h3>
                        <div className='summary-row'>
                            <p>{entry.summary}</p>
                            <button className='like-button' onClick={() => toggleLike(entry.timestamp)}>
                                {likes[entry.timestamp] ? '\u2764\uFE0F' : '\uD83E\uDD0D'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className='history-buttons'>
                <Link to='/'>
                <button className='return-button'>Return</button>
                </Link>
                <Link>
                <button className='clear-button' onClick={clearHistory}>Clear History & Summaries</button>
                </Link>
            </div>
        </div>
    );
};

// Export History component
export default History;