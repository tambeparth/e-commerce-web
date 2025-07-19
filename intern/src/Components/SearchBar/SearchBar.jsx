import React, { useState, useEffect } from 'react';
import { FaSearch, FaTimes, FaFilter } from 'react-icons/fa';
import './SearchBar.css';

const SearchBar = ({ onSearch, onFilter, showFilters = true }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [filters, setFilters] = useState({
        category: 'all',
        minPrice: '',
        maxPrice: '',
        sortBy: 'newest'
    });

    useEffect(() => {
        // Only trigger search if there's actually a search query or specific filters applied
        if (searchQuery.trim() || filters.category !== 'all' || filters.minPrice || filters.maxPrice) {
            const delayedSearch = setTimeout(() => {
                onSearch(searchQuery, filters);
            }, 300);

            return () => clearTimeout(delayedSearch);
        }
    }, [searchQuery, filters, onSearch]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        // If search is cleared, reset to normal view
        if (!value.trim()) {
            onSearch('', { ...filters, category: 'all', minPrice: '', maxPrice: '' });
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilter && onFilter(newFilters);
    };

    const resetFilters = () => {
        const defaultFilters = {
            category: 'all',
            minPrice: '',
            maxPrice: '',
            sortBy: 'newest'
        };
        setFilters(defaultFilters);
    };

    return (
        <div className="search-bar-container">
            <div className="search-input-wrapper">
                <FaSearch className="search-icon" />
                <input
                    type="text"
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="search-input"
                />
                {searchQuery && (
                    <FaTimes className="clear-icon" onClick={clearSearch} />
                )}
                {showFilters && (
                    <button
                        className={`filter-toggle ${showFilterPanel ? 'active' : ''}`}
                        onClick={() => setShowFilterPanel(!showFilterPanel)}
                    >
                        <FaFilter />
                    </button>
                )}
            </div>

            {showFilters && showFilterPanel && (
                <div className="filter-panel">
                    <div className="filter-group">
                        <label>Category:</label>
                        <select
                            value={filters.category}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                        >
                            <option value="all">All Categories</option>
                            <option value="men">Men</option>
                            <option value="women">Women</option>
                            <option value="kid">Kids</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Price Range:</label>
                        <div className="price-inputs">
                            <input
                                type="number"
                                placeholder="Min"
                                value={filters.minPrice}
                                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                            />
                            <span>-</span>
                            <input
                                type="number"
                                placeholder="Max"
                                value={filters.maxPrice}
                                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="filter-group">
                        <label>Sort By:</label>
                        <select
                            value={filters.sortBy}
                            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                        >
                            <option value="newest">Newest First</option>
                            <option value="price_low">Price: Low to High</option>
                            <option value="price_high">Price: High to Low</option>
                            <option value="rating">Highest Rated</option>
                        </select>
                    </div>

                    <div className="filter-actions">
                        <button onClick={resetFilters} className="reset-btn">
                            Reset Filters
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
