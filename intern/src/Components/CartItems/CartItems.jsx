import React, { useContext, useState } from 'react';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext';
import { FaPlus, FaMinus, FaTrash, FaShoppingBag, FaTag, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const CartItems = () => {
    const { getTotalCartAmount, all_product, cartItems, removeFromCart, addToCart } = useContext(ShopContext);
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [promoApplied, setPromoApplied] = useState(false);

    const cartItemsList = all_product.filter(e => cartItems[e.id] > 0);

    const handleQuantityChange = (productId, action) => {
        if (action === 'increase') {
            addToCart(productId);
        } else if (action === 'decrease') {
            if (cartItems[productId] > 1) {
                removeFromCart(productId);
            }
        }
    };

    const handleRemoveItem = (productId) => {
        // Remove all quantities of this item
        const quantity = cartItems[productId];
        for (let i = 0; i < quantity; i++) {
            removeFromCart(productId);
        }
    };

    const applyPromoCode = () => {
        // Simple promo code logic - you can enhance this
        const validCodes = {
            'SAVE10': 10,
            'WELCOME20': 20,
            'FASHION15': 15
        };

        if (validCodes[promoCode.toUpperCase()]) {
            const discountPercent = validCodes[promoCode.toUpperCase()];
            setDiscount(discountPercent);
            setPromoApplied(true);
        } else {
            alert('Invalid promo code');
        }
    };

    const removePromoCode = () => {
        setDiscount(0);
        setPromoApplied(false);
        setPromoCode('');
    };

    const subtotal = getTotalCartAmount();
    const discountAmount = (subtotal * discount) / 100;
    const finalTotal = subtotal - discountAmount;

    if (cartItemsList.length === 0) {
        return (
            <div className="empty-cart">
                <div className="empty-cart-content">
                    <FaShoppingBag className="empty-cart-icon" />
                    <h2>Your Cart is Empty</h2>
                    <p>Looks like you haven't added anything to your cart yet.</p>
                    <Link to="/" className="continue-shopping-btn">
                        <FaArrowLeft />
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cartitems">
            <div className="cart-header">
                <h1>Shopping Cart</h1>
                <span className="cart-count">{cartItemsList.length} items</span>
            </div>

            <div className="cart-content">
                <div className="cart-items-section">
                    <div className="cartitems-header">
                        <span>Product</span>
                        <span>Price</span>
                        <span>Quantity</span>
                        <span>Total</span>
                        <span>Remove</span>
                    </div>

                    {cartItemsList.map((product) => (
                        <div key={product.id} className="cart-item">
                            <div className="cart-item-product">
                                <img src={product.image} alt={product.name} className="cart-item-image" />
                                <div className="cart-item-details">
                                    <h3>{product.name}</h3>
                                    <p className="cart-item-category">{product.category}</p>
                                </div>
                            </div>

                            <div className="cart-item-price">
                                ₹{product.new_price}
                            </div>

                            <div className="cart-item-quantity">
                                <button
                                    className="quantity-btn"
                                    onClick={() => handleQuantityChange(product.id, 'decrease')}
                                    disabled={cartItems[product.id] <= 1}
                                >
                                    <FaMinus />
                                </button>
                                <span className="quantity-display">{cartItems[product.id]}</span>
                                <button
                                    className="quantity-btn"
                                    onClick={() => handleQuantityChange(product.id, 'increase')}
                                >
                                    <FaPlus />
                                </button>
                            </div>

                            <div className="cart-item-total">
                                ₹{product.new_price * cartItems[product.id]}
                            </div>

                            <div className="cart-item-remove">
                                <button
                                    className="remove-btn"
                                    onClick={() => handleRemoveItem(product.id)}
                                    title="Remove item"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="cart-summary">
                    <div className="promo-section">
                        <h3><FaTag /> Promo Code</h3>
                        {!promoApplied ? (
                            <div className="promo-input-group">
                                <input
                                    type="text"
                                    placeholder="Enter promo code"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                    className="promo-input"
                                />
                                <button onClick={applyPromoCode} className="apply-promo-btn">
                                    Apply
                                </button>
                            </div>
                        ) : (
                            <div className="promo-applied">
                                <span className="promo-code-display">{promoCode} (-{discount}%)</span>
                                <button onClick={removePromoCode} className="remove-promo-btn">
                                    Remove
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="order-summary">
                        <h3>Order Summary</h3>
                        <div className="summary-line">
                            <span>Subtotal</span>
                            <span>₹{subtotal}</span>
                        </div>
                        {promoApplied && (
                            <div className="summary-line discount-line">
                                <span>Discount ({discount}%)</span>
                                <span>-₹{discountAmount}</span>
                            </div>
                        )}
                        <div className="summary-line">
                            <span>Shipping</span>
                            <span className="free-shipping">Free</span>
                        </div>
                        <hr />
                        <div className="summary-line total-line">
                            <span>Total</span>
                            <span>₹{finalTotal}</span>
                        </div>

                        <button className="checkout-btn">
                            Proceed to Checkout
                        </button>

                        <Link to="/" className="continue-shopping-link">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartItems;
