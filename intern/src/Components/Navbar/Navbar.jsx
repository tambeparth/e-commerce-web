import React, { useState, useContext, useRef, useEffect } from 'react';
import './Navbar.css';
import logo from '../Asset/logo1.png';
import cart_icon from '../Asset/cart_icon.png';
import { Link, useLocation } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';
import nav_dropdown from '../Asset/dropdown_icon.png';
import { FaHeart, FaSearch, FaMoon, FaSun, FaUser } from 'react-icons/fa';

const Navbar = () => {
    const [menu, setMenu] = useState("shop");
    const [darkMode, setDarkMode] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [wishlistCount, setWishlistCount] = useState(0);
    const { getTotalCartItems } = useContext(ShopContext);
    const menuRef = useRef();
    const location = useLocation();

    useEffect(() => {
        // Set active menu based on current path
        const path = location.pathname;
        if (path === '/') setMenu("shop");
        else if (path === '/mens') setMenu("Men");
        else if (path === '/womens') setMenu("Women");
        else if (path === '/kids') setMenu("Kids");
        else if (path === '/wishlist') setMenu("wishlist");

        // Load dark mode preference
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(savedDarkMode);

        // Apply dark mode to body
        if (savedDarkMode) {
            document.body.classList.add('dark-mode');
        }

        // Fetch wishlist count
        fetchWishlistCount();
    }, [location]);

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
            }
        }
    };

    const dropdownToggle = (e) => {
        menuRef.current.classList.toggle('nav-menu-visible');
        e.target.classList.toggle('open');
    }

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        localStorage.setItem('darkMode', newDarkMode);

        if (newDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Navigate to search results page or filter current page
            window.location.href = `/?search=${encodeURIComponent(searchQuery)}`;
        }
    };

    const toggleSearch = () => {
        setShowSearch(!showSearch);
        if (!showSearch) {
            setTimeout(() => {
                document.querySelector('.search-input')?.focus();
            }, 100);
        }
    };

    return (
        <div className={`navbar ${darkMode ? 'dark-mode' : ''}`}>
            <div className="nav-logo">
                <Link to="/">
                    <img src={logo} alt="FashionClub" />
                    <p>FashionClub</p>
                </Link>
            </div>

            <img className='nav-dr' onClick={dropdownToggle} src={nav_dropdown} alt="" />

            <ul ref={menuRef} className="nav-menu">
                <li onClick={() => setMenu("shop")}>
                    <Link to='/'>Shop</Link>
                    {menu === "shop" && <hr />}
                </li>
                <li onClick={() => setMenu("Men")}>
                    <Link to='/mens'>Men</Link>
                    {menu === "Men" && <hr />}
                </li>
                <li onClick={() => setMenu("Women")}>
                    <Link to='/womens'>Women</Link>
                    {menu === "Women" && <hr />}
                </li>
                <li onClick={() => setMenu("Kids")}>
                    <Link to='/kids'>Kids</Link>
                    {menu === "Kids" && <hr />}
                </li>
                <li onClick={() => setMenu("Portfolio")}>
                    <Link to='/portfolio'>Portfolio</Link>
                    {menu === "Portfolio" && <hr />}
                </li>
            </ul>

            <div className="nav-actions">
                {/* Search */}
                <div className={`search-container ${showSearch ? 'active' : ''}`}>
                    {showSearch && (
                        <form onSubmit={handleSearch} className="search-form">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                        </form>
                    )}
                    <button className="nav-icon-btn" onClick={toggleSearch} title="Search">
                        <FaSearch />
                    </button>
                </div>

                {/* Dark Mode Toggle */}
                <button className="nav-icon-btn" onClick={toggleDarkMode} title="Toggle Dark Mode">
                    {darkMode ? <FaSun /> : <FaMoon />}
                </button>

                {/* Wishlist */}
                {localStorage.getItem('auth-token') && (
                    <Link to='/wishlist' className="nav-icon-link" onClick={() => setMenu("wishlist")}>
                        <div className="nav-icon-container">
                            <FaHeart />
                            {wishlistCount > 0 && <span className="count-badge">{wishlistCount}</span>}
                        </div>
                    </Link>
                )}

                {/* User Account */}
                <div className="nav-login-cart">
                    {localStorage.getItem('auth-token') ? (
                        <div className="user-menu">
                            <button className="nav-icon-btn user-btn" title="Account">
                                <FaUser />
                            </button>
                            <div className="user-dropdown">
                                <Link to="/profile">Profile</Link>
                                <Link to="/orders">Orders</Link>
                                <button onClick={() => {
                                    localStorage.removeItem('auth-token');
                                    window.location.replace('/')
                                }}>
                                    Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link to='/login'>
                            <button className="login-btn">Login</button>
                        </Link>
                    )}

                    {/* Cart */}
                    <Link to='/cart' className="nav-icon-link">
                        <div className="nav-icon-container">
                            <img src={cart_icon} alt="Shopping Cart" />
                            {getTotalCartItems() > 0 && (
                                <span className="count-badge">{getTotalCartItems()}</span>
                            )}
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
