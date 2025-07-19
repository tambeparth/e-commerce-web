import React, { useState, useEffect } from 'react';
import { FaStar, FaUser, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import './ProductReviews.css';

const ProductReviews = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({
        rating: 5,
        comment: ''
    });
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        fetchReviews();
    }, [productId, sortBy]);

    const fetchReviews = async () => {
        try {
            // For now, we'll use mock data since the backend doesn't have review endpoints yet
            const mockReviews = [
                {
                    id: 1,
                    user: 'John Doe',
                    rating: 5,
                    comment: 'Excellent product! Great quality and fast delivery.',
                    date: new Date('2024-01-15'),
                    helpful: 12,
                    notHelpful: 1
                },
                {
                    id: 2,
                    user: 'Jane Smith',
                    rating: 4,
                    comment: 'Good product overall, but the sizing runs a bit small.',
                    date: new Date('2024-01-10'),
                    helpful: 8,
                    notHelpful: 2
                },
                {
                    id: 3,
                    user: 'Mike Johnson',
                    rating: 5,
                    comment: 'Love this! Perfect fit and amazing quality. Highly recommended.',
                    date: new Date('2024-01-05'),
                    helpful: 15,
                    notHelpful: 0
                }
            ];
            
            // Sort reviews based on selected option
            const sortedReviews = [...mockReviews].sort((a, b) => {
                switch (sortBy) {
                    case 'newest':
                        return new Date(b.date) - new Date(a.date);
                    case 'oldest':
                        return new Date(a.date) - new Date(b.date);
                    case 'highest':
                        return b.rating - a.rating;
                    case 'lowest':
                        return a.rating - b.rating;
                    case 'helpful':
                        return b.helpful - a.helpful;
                    default:
                        return 0;
                }
            });
            
            setReviews(sortedReviews);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        
        if (!localStorage.getItem('auth-token')) {
            alert('Please login to submit a review');
            return;
        }

        if (!newReview.comment.trim()) {
            alert('Please write a comment');
            return;
        }

        setLoading(true);
        
        try {
            const response = await fetch('http://localhost:3000/addreview', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId: productId,
                    rating: newReview.rating,
                    comment: newReview.comment
                }),
            });

            const data = await response.json();
            
            if (data.success) {
                setNewReview({ rating: 5, comment: '' });
                setShowReviewForm(false);
                fetchReviews(); // Refresh reviews
                alert('Review submitted successfully!');
            } else {
                alert('Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Error submitting review');
        }
        
        setLoading(false);
    };

    const renderStars = (rating, interactive = false, onRatingChange = null) => {
        return [...Array(5)].map((_, index) => (
            <FaStar
                key={index}
                className={`star ${index < rating ? 'star-filled' : 'star-empty'} ${interactive ? 'star-interactive' : ''}`}
                onClick={interactive ? () => onRatingChange(index + 1) : undefined}
            />
        ));
    };

    const getAverageRating = () => {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (sum / reviews.length).toFixed(1);
    };

    const getRatingDistribution = () => {
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach(review => {
            distribution[review.rating]++;
        });
        return distribution;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const averageRating = getAverageRating();
    const ratingDistribution = getRatingDistribution();

    return (
        <div className="product-reviews">
            <div className="reviews-header">
                <h2>Customer Reviews</h2>
                
                <div className="reviews-summary">
                    <div className="average-rating">
                        <div className="rating-number">{averageRating}</div>
                        <div className="rating-stars">
                            {renderStars(Math.round(averageRating))}
                        </div>
                        <div className="rating-count">Based on {reviews.length} reviews</div>
                    </div>
                    
                    <div className="rating-distribution">
                        {[5, 4, 3, 2, 1].map(rating => (
                            <div key={rating} className="rating-bar">
                                <span className="rating-label">{rating}</span>
                                <FaStar className="star-small" />
                                <div className="bar-container">
                                    <div 
                                        className="bar-fill" 
                                        style={{ 
                                            width: `${reviews.length > 0 ? (ratingDistribution[rating] / reviews.length) * 100 : 0}%` 
                                        }}
                                    ></div>
                                </div>
                                <span className="rating-count-small">({ratingDistribution[rating]})</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="reviews-actions">
                <div className="sort-controls">
                    <label>Sort by:</label>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="highest">Highest Rating</option>
                        <option value="lowest">Lowest Rating</option>
                        <option value="helpful">Most Helpful</option>
                    </select>
                </div>
                
                <button 
                    className="write-review-btn"
                    onClick={() => setShowReviewForm(!showReviewForm)}
                >
                    Write a Review
                </button>
            </div>

            {showReviewForm && (
                <div className="review-form-container">
                    <form onSubmit={handleSubmitReview} className="review-form">
                        <h3>Write Your Review</h3>
                        
                        <div className="rating-input">
                            <label>Rating:</label>
                            <div className="stars-input">
                                {renderStars(newReview.rating, true, (rating) => 
                                    setNewReview(prev => ({ ...prev, rating }))
                                )}
                            </div>
                        </div>
                        
                        <div className="comment-input">
                            <label>Your Review:</label>
                            <textarea
                                value={newReview.comment}
                                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                                placeholder="Share your thoughts about this product..."
                                rows="4"
                                required
                            />
                        </div>
                        
                        <div className="form-actions">
                            <button type="submit" disabled={loading} className="submit-review-btn">
                                {loading ? 'Submitting...' : 'Submit Review'}
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setShowReviewForm(false)}
                                className="cancel-btn"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="reviews-list">
                {reviews.map((review) => (
                    <div key={review.id} className="review-item">
                        <div className="review-header">
                            <div className="reviewer-info">
                                <FaUser className="user-icon" />
                                <span className="reviewer-name">{review.user}</span>
                            </div>
                            <div className="review-meta">
                                <div className="review-rating">
                                    {renderStars(review.rating)}
                                </div>
                                <span className="review-date">{formatDate(review.date)}</span>
                            </div>
                        </div>
                        
                        <div className="review-content">
                            <p>{review.comment}</p>
                        </div>
                        
                        <div className="review-actions">
                            <span className="helpful-text">Was this helpful?</span>
                            <button className="helpful-btn">
                                <FaThumbsUp /> Yes ({review.helpful})
                            </button>
                            <button className="helpful-btn">
                                <FaThumbsDown /> No ({review.notHelpful})
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductReviews;
