import React, { useState, useContext, useRef } from 'react';
import './Navbar.css';
import logo from '../Asset/logo1.png';
import cart_icon from '../Asset/cart_icon.png';
import { Link, } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';
import nav_dropdown from '../Asset/dropdown_icon.png';

const Navbar = () => {
    const [menu, setMenu] = useState("shop");
    const { getTotalCartItems } = useContext(ShopContext);
    const menuRef = useRef();


    const dropdownToggle = (e) => {
        menuRef.current.classList.toggle('nav-menu-visible');
        e.target.classList.toggle('open');
    }


    return (
        <div className='navbar'>
            <div className="nav-logo">
                <img src={logo} alt="" />
                <p>FashionClub</p>
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
            </ul>

            <div className="nav-login-cart">
                {localStorage.getItem('auth-token')
                    ? <button onClick={() => { localStorage.removeItem('auth-token'); window.location.replace('/') }}>Logout</button>
                    : <Link to='/login'><button>Login</button></Link>}
                <Link to='/cart'>
                    <img src={cart_icon} alt="Shopping Cart" />
                </Link>
                <div className="cart-count">{getTotalCartItems()}</div>
            </div>
        </div>
    );
};


export default Navbar;
