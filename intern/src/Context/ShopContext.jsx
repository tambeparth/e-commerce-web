import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
    let cart = {};
    for (let index = 0; index < 300 + 1; index++) {
        cart[index] = 0;
    }
    return cart;
};

const ShopContextProvider = (props) => {
    const [all_product, setAll_product] = useState([]);
    const [cartItems, setCartItems] = useState(getDefaultCart());

    useEffect(() => {
        fetch(process.env.REACT_APP_API_URL || 'http://localhost:3000' + '/allproducts')
            .then((response) => response.json())
            .then((data) => {
                console.log("Fetched products:", data);
                setAll_product(data);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });

        if (localStorage.getItem('auth-token')) {
            fetch((process.env.REACT_APP_API_URL || 'http://localhost:3000') + '/getcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: "",
            }).then((response) => response.json())
                .then((data) => setCartItems(data));
        }
    }, [])

    const addToCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));

        if (localStorage.getItem("auth-token")) {
            fetch((process.env.REACT_APP_API_URL || 'http://localhost:3000') + "/addtocart", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "auth-token": `${localStorage.getItem("auth-token")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ itemId: itemId }),
            })
                .then((response) => response.json())
                .then((data) => console.log(data));
        }
    };

    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
        if (localStorage.getItem("auth-token")) {
            fetch((process.env.REACT_APP_API_URL || 'http://localhost:3000') + "/removefromcart", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "auth-token": `${localStorage.getItem("auth-token")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ itemId: itemId }),
            })
                .then((response) => response.json())
                .then((data) => console.log(data));
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = all_product.find((product) => product.id === Number(item));
                if (itemInfo) {
                    totalAmount += itemInfo.new_price * cartItems[item];
                }
            }
        }
        return totalAmount;
    };

    const getTotalCartItems = () => {
        let totalItem = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                totalItem += cartItems[item];
            }
        }
        return totalItem;
    };

    const contextValue = {
        getTotalCartItems,
        getTotalCartAmount,
        all_product,
        cartItems,
        addToCart,
        removeFromCart,
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
