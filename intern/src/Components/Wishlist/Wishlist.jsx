import React, { useState, useEffect, useContext } from 'react';
import { FaHeart, FaShoppingCart, FaTimes } from 'react-icons/fa';
import { ShopContext } from '../../Context/ShopContext';
import './Wishlist.css';

const Wishlist = () => {
    const { all_product, addToCart } = useContext(ShopContext);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        if (localStorage.getItem('auth-token')) {
            try {
                const response = await fetch('http://localhost:3000/getwishlist', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'auth-token': `${localStorage.getItem('auth-token')}`,
                        'Content-Type': 'application/json',
                    },
                    body: "",
                });
                const data = await response.json();
                setWishlistItems(data);
            } catch (error) {
                console.error('Error fetching wishlist:', error);
            }
        }
        setLoading(false);
    };

    const removeFromWishlist = async (itemId) => {
        if (localStorage.getItem('auth-token')) {
            try {
                await fetch('http://localhost:3000/removefromwishlist', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'auth-token': `${localStorage.getItem('auth-token')}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ itemId: itemId }),
                });
                setWishlistItems(prev => prev.filter(id => id !== itemId));
            } catch (error) {
                console.error('Error removing from wishlist:', error);
            }
        }
    };

    const handleAddToCart = (productId) => {
        addToCart(productId);
        // Optionally remove from wishlist after adding to cart
        // removeFromWishlist(productId);
    };

    const wishlistProducts = all_product.filter(product => 
        wishlistItems.includes(product.id)
    );

    if (loading) {
        return (
            <div className="wishlist-container">
                <div className="loading">Loading wishlist...</div>
            </div>
        );
    }

    if (wishlistProducts.length === 0) {
        return (
            <div className="wishlist-container">
                <div className="empty-wishlist">
                    <FaHeart className="empty-heart-icon" />
                    <h2>Your Wishlist is Empty</h2>
                    <p>Add items you love to your wishlist. Review them anytime and easily move them to your cart.</p>
                    <button onClick={() => window.location.href = '/'} className="continue-shopping-btn">
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="wishlist-container">
            <div className="wishlist-header">
                <h1>My Wishlist</h1>
                <span className="wishlist-count">{wishlistProducts.length} items</span>
            </div>
            
            <div className="wishlist-grid">
                {wishlistProducts.map((product) => (
                    <div key={product.id} className="wishlist-item">
                        <div className="wishlist-item-image">
                            <img src={product.image} alt={product.name} />
                            <button 
                                className="remove-wishlist-btn"
                                onClick={() => removeFromWishlist(product.id)}
                                title="Remove from wishlist"
                            >
                                <FaTimes />
                            </button>
                        </div>
                        
                        <div className="wishlist-item-details">
                            <h3 className="product-name">{product.name}</h3>
                            <div className="product-prices">
                                <span className="new-price">₹{product.new_price}</span>
                                {product.old_price && (
                                    <span className="old-price">₹{product.old_price}</span>
                                )}
                            </div>
                            
                            <div className="wishlist-item-actions">
                                <button 
                                    className="add-to-cart-btn"
                                    onClick={() => handleAddToCart(product.id)}
                                >
                                    <FaShoppingCart />
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wishlist;
