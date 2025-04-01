import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Banner from '../components/Banner';
import '../Styles/Evaluate.css';
import "../Styles/GlobalStyle.css";

const EvaluateResearchPaper = () => {
    const { rid } = useParams();
    const navigate = useNavigate();
    const [ratings, setRatings] = useState({
        q1: '',
        q2: '',
        q3: '',
        q4: '',
        q5: ''
    });
    
    const [totalScore, setTotalScore] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedRatings = { ...ratings, [name]: value };
        setRatings(updatedRatings);
        
        if (Object.values(updatedRatings).every(val => val !== '')) {
            const score = Object.values(updatedRatings).reduce((acc, val) => acc + parseInt(val, 10), 0);
            setTotalScore(score);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/rate-research-paper', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ rid, ...ratings, totalScore })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Research Paper Rated Successfully!');
                navigate('/evaluator/papers');
            } else {
                alert(`Failed to rate the paper: ${data.message || 'Unknown error'}`);
            }
        } catch (error) {
            alert('Error submitting rating. Please try again.');
            console.error('Submit error:', error);
        }
    };

    return (
        <div>
            <Banner pageName="Research Paper" title="Manuscript Evaluation" />
            <div className="evaluate-container">
            
            <h2 className='page-title'>Evaluate Research Paper</h2>
            <form onSubmit={handleSubmit}>
                {[ 
                    "How would you rate the presenter's effectiveness in conveying the problem statement, purpose, methodology, results, and implications of the research?",
                    "How effectively did the presenter showcase the originality, novelty, and significance of the research findings, emphasizing their contribution, to the field through mathematical models, results, and a thorough conclusion that includes project claims, verification, validation, and diagnostics?",
                    "How well-structured was the presentation, with a clear introduction, logical flow of ideas, proper use and representation of data, and a coherent conclusion? Additionally, how effectively did it include elements such as a proposed model, flowcharts, and a comprehensive discussion of implementation and analysis results?",
                    "How effectively did the presenter demonstrate communication skills, teamwork, use of visual aids to enhance understanding, and convey confidence and enthusiasm during the presentation?",
                    "How effective was the organization of the presentation and sequence of sections, and how was the overall format and style of the presentation effective in managing time efficiently?"
                ].map((question, index) => (
                    <div className="form-group" key={index}>
                        <label>{question}</label>
                        <select
                            name={`q${index + 1}`}
                            value={ratings[`q${index + 1}`]}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a Rating</option>
                            <option value="5">5 - Excellent</option>
                            <option value="4">4 - Very Good</option>
                            <option value="3">3 - Good</option>
                            <option value="2">2 - Fair</option>
                            <option value="1">1 - Poor</option>
                            <option value="0">0 - Absent</option>
                        </select>
                    </div>
                ))}

                {totalScore !== null && (
                    <div className="total-score">
                        <h3>Total Score: {totalScore}</h3>
                    </div>
                )}

                <button type="submit" className="button button-medium">Submit Rating</button>
            </form>
        </div>
        </div>
    );
};

export default EvaluateResearchPaper;
