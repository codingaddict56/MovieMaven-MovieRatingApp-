import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ViewPolls = ({ userId, username }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [redirected, setRedirected] = useState(false);
  const [polls, setPolls] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); // State to track current poll index
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (userId && username && !redirected) {
      localStorage.setItem('userId', userId);
      localStorage.setItem('username', username);
      setRedirected(true);
      navigate('/');
    }

    const fetchPolls = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/users/polls?userId=${userId}`);
        setPolls(response.data);
      } catch (error) {
        console.error('Error fetching polls:', error);
      }
    };

    fetchPolls();
  }, [location, navigate, redirected, userId, username]);

  const handleVote = async (pollId, optionIndex) => {
    if (!userId) {
      setError('Please log in to vote.');
      return;
    }
    try {
      const response = await axios.post(`http://localhost:4000/users/polls/${pollId}/vote`, {
        userId,
        optionIndex,
      });
      setPolls(polls.map(poll => poll._id === pollId ? response.data : poll));
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Error voting on poll');
    }
  };

  const handleCreatePoll = () => {
    navigate('/createPoll');
  };

  const handleNext = () => {
    setCurrentIndex(currentIndex => currentIndex + 1); // Move to the next poll
  };

  const handlePrevious = () => {
    setCurrentIndex(currentIndex => currentIndex - 1); // Move to the previous poll
  };

  return (
    <>
      <div className="wrap">
        <h2 className="register-title">Polls</h2>
        {polls.length === 0 || currentIndex >= polls.length || currentIndex < 0 ? (
          <p>No more polls available.</p>
        ) : (
          <div className="register">
            <h3>{polls[currentIndex].title}</h3>
            <div>
              {polls[currentIndex].options.map((option, index) => (
                <div key={index}>
                  <button className="custom-button-add" onClick={() => handleVote(polls[currentIndex]._id, index) } style={{background:'#d7604b',  marginTop: '10px', width: '100%'}}>
                    {option.text}
                  </button>
                  {option.votes} votes
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <button className="custom-button-add" onClick={handlePrevious} disabled={currentIndex === 0} style={{background:'#3290B1'}}>&lt;</button>
              <button className="custom-button-add" onClick={handleNext} disabled={currentIndex === polls.length - 1} style={{background:'#3290B1'}}>&gt;</button>
            </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button className="custom-button-add" onClick={handleCreatePoll} style={{marginTop:'10px'}}>
          Add Poll
        </button>   
          </div>
        )}
       
      </div>
    </>
  );
};

export default ViewPolls;
