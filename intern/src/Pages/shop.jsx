import React, { useState, useEffect, useContext } from 'react';
import Hero from '../Components/Hero/Hero';
import Popular from '../Components/Popular/Popular';
import Offers from '../Components/Offers/Offers';
import NewCollection from '../Components/NewCollection/NewCollection';
import NewsLetter from '../Components/NewsLetter/NewsLetter';
import SearchBar from '../Components/SearchBar/SearchBar';
import Item from '../Components/Item/Item';
import Loading from '../Components/Loading/Loading';
import { ShopContext } from '../Context/ShopContext';
import './CSS/Shop.css';

const Shop = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [loading, setLoading] = useState(false);
    const { all_product } = useContext(ShopContext);

    useEffect(() => {
        // Check if there's a search query in URL
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search');
        if (searchQuery) {
            handleSearch(searchQuery, {});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSearch = async (query, filters) => {
        if (!query.trim() && !filters.category && !filters.minPrice && !filters.maxPrice) {
            setIsSearching(false);
            setSearchResults([]);
            return;
        }

        setLoading(true);
        setIsSearching(true);

        try {
            const params = new URLSearchParams();
            if (query) params.append('query', query);
            if (filters.category && filters.category !== 'all') params.append('category', filters.category);
            if (filters.minPrice) params.append('minPrice', filters.minPrice);
            if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
            if (filters.sortBy) params.append('sortBy', filters.sortBy);

            const response = await fetch(`http://localhost:3000/search?${params}`);
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Search error:', error);
            // Fallback to client-side search
            const filtered = all_product.filter(product => {
                const matchesQuery = !query ||
                    product.name.toLowerCase().includes(query.toLowerCase()) ||
                    (product.description && product.description.toLowerCase().includes(query.toLowerCase()));

                const matchesCategory = !filters.category || filters.category === 'all' ||
                    product.category === filters.category;

                const matchesPrice = (!filters.minPrice || product.new_price >= Number(filters.minPrice)) &&
                    (!filters.maxPrice || product.new_price <= Number(filters.maxPrice));

                return matchesQuery && matchesCategory && matchesPrice;
            });

            setSearchResults(filtered);
        }

        setLoading(false);
    };

    const handleFilter = (filters) => {
        // This will be called when filters change
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search') || '';
        handleSearch(searchQuery, filters);
    };

    if (isSearching) {
        return (
            <div className="shop-search">
                <div className="search-container-page">
                    <SearchBar onSearch={handleSearch} onFilter={handleFilter} />
                </div>

                {loading ? (
                    <Loading size="large" text="Searching products..." />
                ) : (
                    <div className="search-results">
                        <div className="search-results-header">
                            <h2>Search Results ({searchResults.length} items found)</h2>
                        </div>

                        {searchResults.length > 0 ? (
                            <div className="search-results-grid">
                                {searchResults.map((item) => (
                                    <Item
                                        key={item.id}
                                        id={item.id}
                                        name={item.name}
                                        image={item.image}
                                        new_price={item.new_price}
                                        old_price={item.old_price}
                                        rating={item.rating}
                                        reviewCount={item.reviews?.length}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="no-results">
                                <h3>No products found</h3>
                                <p>Try adjusting your search terms or filters</p>
                                <button
                                    onClick={() => {
                                        setIsSearching(false);
                                        setSearchResults([]);
                                        window.history.pushState({}, '', '/');
                                    }}
                                    className="back-to-shop-btn"
                                >
                                    Back to Shop
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="shop">
            <Hero />
            <div className="search-section">
                <SearchBar onSearch={handleSearch} onFilter={handleFilter} />
            </div>
            <Popular />
            <Offers />
            <NewCollection />
            <NewsLetter />
        </div>
    );
}

export default Shop;
