import React, { useState, useEffect } from 'react';
import { FaUser, FaEdit, FaSave, FaTimes, FaShoppingBag, FaHeart, FaMapMarkerAlt } from 'react-icons/fa';
import './UserProfile.css';

const UserProfile = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [wishlistCount, setWishlistCount] = useState(0);

    useEffect(() => {
        fetchUserProfile();
        fetchUserOrders();
        fetchWishlistCount();
    }, []);

    const fetchUserProfile = async () => {
        // For now, we'll use mock data since we don't have user profile endpoints
        const mockUser = {
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1 (555) 123-4567',
            address: '123 Fashion Street',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'United States'
        };
        setUser(mockUser);
    };

    const fetchUserOrders = async () => {
        // Mock orders data
        const mockOrders = [
            {
                id: 'ORD-001',
                date: '2024-01-15',
                total: 2499,
                status: 'Delivered',
                items: 3
            },
            {
                id: 'ORD-002',
                date: '2024-01-10',
                total: 1899,
                status: 'Shipped',
                items: 2
            },
            {
                id: 'ORD-003',
                date: '2024-01-05',
                total: 3299,
                status: 'Processing',
                items: 4
            }
        ];
        setOrders(mockOrders);
    };

    const fetchWishlistCount = async () => {
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
                setWishlistCount(data.length || 0);
            } catch (error) {
                console.error('Error fetching wishlist:', error);
                setWishlistCount(5); // Mock data
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveProfile = async () => {
        setLoading(true);

        try {
            // Here you would normally send the updated profile to the backend
            // For now, we'll just simulate a save
            await new Promise(resolve => setTimeout(resolve, 1000));

            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        }

        setLoading(false);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        fetchUserProfile(); // Reset to original data
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'delivered':
                return '#28a745';
            case 'shipped':
                return '#007bff';
            case 'processing':
                return '#ffc107';
            case 'cancelled':
                return '#dc3545';
            default:
                return '#6c757d';
        }
    };

    if (!localStorage.getItem('auth-token')) {
        return (
            <div className="profile-container">
                <div className="not-logged-in">
                    <h2>Please log in to view your profile</h2>
                    <button onClick={() => window.location.href = '/login'} className="login-btn">
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-avatar">
                    <FaUser />
                </div>
                <div className="profile-info">
                    <h1>Welcome back, {user.name}!</h1>
                    <p>Manage your account and track your orders</p>
                </div>
            </div>

            <div className="profile-content">
                <div className="profile-stats">
                    <div className="stat-card">
                        <FaShoppingBag className="stat-icon" />
                        <div className="stat-info">
                            <h3>{orders.length}</h3>
                            <p>Total Orders</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <FaHeart className="stat-icon" />
                        <div className="stat-info">
                            <h3>{wishlistCount}</h3>
                            <p>Wishlist Items</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <FaMapMarkerAlt className="stat-icon" />
                        <div className="stat-info">
                            <h3>{user.city}</h3>
                            <p>Location</p>
                        </div>
                    </div>
                </div>

                <div className="profile-sections">
                    <div className="profile-details">
                        <div className="section-header">
                            <h2>Profile Information</h2>
                            {!isEditing ? (
                                <button onClick={() => setIsEditing(true)} className="edit-btn">
                                    <FaEdit /> Edit
                                </button>
                            ) : (
                                <div className="edit-actions">
                                    <button onClick={handleSaveProfile} disabled={loading} className="save-btn">
                                        <FaSave /> {loading ? 'Saving...' : 'Save'}
                                    </button>
                                    <button onClick={handleCancelEdit} className="cancel-btn">
                                        <FaTimes /> Cancel
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="profile-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={user.name}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={user.email}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={user.phone}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={user.address}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={user.city}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={user.state}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Zip Code</label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        value={user.zipCode}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Country</label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={user.country}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="recent-orders">
                        <h2>Recent Orders</h2>
                        <div className="orders-list">
                            {orders.map((order) => (
                                <div key={order.id} className="order-item">
                                    <div className="order-info">
                                        <h3>Order #{order.id}</h3>
                                        <p>{new Date(order.date).toLocaleDateString()}</p>
                                        <p>{order.items} items</p>
                                    </div>
                                    <div className="order-total">
                                        <span className="amount">₹{order.total}</span>
                                        <span
                                            className="status"
                                            style={{ color: getStatusColor(order.status) }}
                                        >
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="view-all-orders-btn">
                            View All Orders
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
