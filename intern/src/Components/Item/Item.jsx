import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaStar } from 'react-icons/fa';
import { ShopContext } from '../../Context/ShopContext';
import './Item.css';

const Item = (props) => {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { addToCart } = useContext(ShopContext);

    const handleWishlistToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!localStorage.getItem('auth-token')) {
            alert('Please login to add items to wishlist');
            return;
        }

        setIsLoading(true);
        try {
            const endpoint = isWishlisted ? 'removefromwishlist' : 'addtowishlist';
            await fetch(`http://localhost:3000/${endpoint}`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId: props.id }),
            });
            setIsWishlisted(!isWishlisted);
        } catch (error) {
            console.error('Error updating wishlist:', error);
        }
        setIsLoading(false);
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(props.id);
    };

    const handleImageClick = () => {
        window.scrollTo(0, 0);
    };

    return (
        <div className='item'>
            <div className="item-image-container">
                <Link to={`/product/${props.id}`}>
                    <img onClick={handleImageClick} src={props.image} alt={props.name} />
                </Link>
                <div className="item-overlay">
                    <button
                        className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
                        onClick={handleWishlistToggle}
                        disabled={isLoading}
                        title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                        <FaHeart />
                    </button>
                    <button
                        className="quick-add-btn"
                        onClick={handleAddToCart}
                        title="Add to cart"
                    >
                        <FaShoppingCart />
                    </button>
                </div>
                {props.discount && (
                    <div className="discount-badge">
                        -{Math.round(((props.old_price - props.new_price) / props.old_price) * 100)}%
                    </div>
                )}
            </div>

            <div className="item-details">
                <Link to={`/product/${props.id}`}>
                    <p className="item-name">{props.name}</p>
                    <div className="item-rating">
                        {[...Array(5)].map((_, i) => (
                            <FaStar
                                key={i}
                                className={i < (props.rating || 4) ? 'star-filled' : 'star-empty'}
                            />
                        ))}
                        <span className="rating-count">({props.reviewCount || 0})</span>
                    </div>
                    <div className="item-prices">
                        <div className="item-price-new">
                            ₹{props.new_price}
                        </div>
                        {props.old_price && props.old_price !== props.new_price && (
                            <div className="item-price-old">
                                ₹{props.old_price}
                            </div>
                        )}
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default Item;
