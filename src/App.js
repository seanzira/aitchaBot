import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom' ;
import Chat from './components/ChatbotStructure';
import History from './components/History';
import SignUp from './components/SignUp';
import Login from './components/Login';

// Main App component 
function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Chat />} />
          <Route path='/history' element={<History />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

// Export App component as the default export
export default App;
