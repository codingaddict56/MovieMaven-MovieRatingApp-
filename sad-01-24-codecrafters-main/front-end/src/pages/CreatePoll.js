import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreatePoll = ({ userId }) => {
  const [title, setTitle] = useState('');
  const navigate = useNavigate();
  const [options, setOptions] = useState(['', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (options.length < 2) {
      setError('Please provide at least two options.');
      return;
    }
    
    // Transform options to have the desired structure
    const formattedOptions = options.map(option => ({ text: option, votes: 0 }));
    
    const pollData = { title, options: formattedOptions, userId };
    
    try {
      const response = await axios.post('http://localhost:4000/users/create', pollData);
      console.log(response.data);
      setTitle('');
      setOptions(['', '']);
      setError('');
      setSuccess('Poll created successfully!');
      // Redirect to view polls page
      navigate('/view-poll');
    } catch (error) {
      console.error(error);
      setError(error.response ? error.response.data : 'Error occurred');
      setSuccess('');
    }
  };

  return (
    <div className="wrap">
      <h2 className="register-title">Create Poll</h2>
      <form className="register" onSubmit={handleSubmit}>
        <div>
          <textarea
            required
            className="custom-input-long"
            placeholder="Poll Question"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        {options.map((option, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            required
            className="register-input"
            placeholder={"Option " + (index + 1)}
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
          />
          <button type="button" className="custom-button-remove" onClick={() => handleRemoveOption(index)}>
            &#x2716; {/* Unicode for '✖' symbol */}
          </button>
        </div>        
        ))}
        <button type="button" className="custom-button-add" onClick={(handleAddOption)} style={{marginTop:'10px'}}>
            Add Option
        </button>
        <div>
          <input type="submit" value="Add" className="register-button"/>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </form>
    </div>
  );
};

export default CreatePoll;
