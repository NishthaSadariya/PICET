import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../Styles/Evaluate.css';
import Banner from '../components/Banner';

const EditResearchPaperRating = () => {
    const { rid } = useParams();
    const navigate = useNavigate();
    const [ratings, setRatings] = useState({ q1: '', q2: '', q3: '', q4: '', q5: '' });
    const [loading, setLoading] = useState(true);
    const [totalScore, setTotalScore] = useState(null);

    useEffect(() => {
        const fetchAssignedPapers = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Unauthorized: No token found');
                }

                const response = await fetch('http://localhost:5000/api/assigned-papers', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                if (!Array.isArray(data)) {
                    throw new Error('Invalid data format received');
                }

                const paper = data.find(paper => paper.rid === parseInt(rid));
                if (paper && Array.isArray(paper.score) && paper.score.length === 5) {
                    const updatedRatings = {
                        q1: paper.score[0].toString(),
                        q2: paper.score[1].toString(),
                        q3: paper.score[2].toString(),
                        q4: paper.score[3].toString(),
                        q5: paper.score[4].toString(),
                    };
                    setRatings(updatedRatings);
                    setTotalScore(paper.score.reduce((acc, val) => acc + parseInt(val, 10), 0));
                }
            } catch (error) {
                console.error('Error fetching assigned papers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAssignedPapers();
    }, [rid]);

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
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Unauthorized: No token found');
            }

            const response = await fetch('http://localhost:5000/api/edit-rating', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    rid: parseInt(rid),
                    q1: parseInt(ratings.q1),
                    q2: parseInt(ratings.q2),
                    q3: parseInt(ratings.q3),
                    q4: parseInt(ratings.q4),
                    q5: parseInt(ratings.q5),
                    totalScore
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Unknown error');
            }

            alert('Research Paper Rating Updated Successfully!');
            navigate('/evaluator/papers');
        } catch (error) {
            alert(`Error updating rating: ${error.message}`);
            console.error('Submit error:', error);
        }
    };

    return (

        <div>
            <Banner title={"Research Paper"} pageName={"Edit Evaluation"}/>
            <div className="evaluate-container">
            
            {loading ? <p>Loading...</p> : (
                <form onSubmit={handleSubmit}>
                    {[
                    "How would you rate the presenter's effectiveness in conveying the problem statement, purpose, methodology, results, and implications of the research?",
                    "How effectively did the presenter showcase the originality, novelty, and significance of the research findings, emphasizing their contribution, to the field through mathematical models, results, and a thorough conclusion that includes project claims, verification, validation, and diagnostics?",
                    "How well-structured was the presentation, with a clear introduction, logical flow of ideas, proper use and representation of data, and a coherent conclusion? Additionally, how effectively did it include elements such as a proposed model, flowcharts, and a comprehensive discussion of implementation and analysis results?",
                    "How effectively did the presenter demonstrate communication skills, teamwork, use of visual aids to enhance understanding, and convey confidence and enthusiasm during the presentation?",
                    "How effective was the organization of the presentation and sequence of sections, and how was the overall format and style of the presentation effective in managing time efficiently?"]
                        .map((question, index) => (
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
                    <button type="submit" className="button button-medium">Update Ratings</button>
                </form>
            )}
        </div>
        </div>
    );
};

export default EditResearchPaperRating;
