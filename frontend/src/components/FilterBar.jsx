import React from 'react';
import { Search } from 'lucide-react';
import '../styles/FilterBar.css';

const FilterBar = ({
    searchValue,
    onSearchChange,
    categories,
    selectedCategory,
    onCategoryChange,
    placeholder = 'Rechercher...'
}) => {
    return (
        <div className="filter-bar">
            <div className="search-box">
                <Search size={20} />
                <input
                    type="text"
                    placeholder={placeholder}
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            <div className="category-filters">
                <button
                    className={`filter-btn ${!selectedCategory ? 'active' : ''}`}
                    onClick={() => onCategoryChange('')}
                >
                    Toutes
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.value}
                        className={`filter-btn ${selectedCategory === cat.value ? 'active' : ''}`}
                        onClick={() => onCategoryChange(cat.value)}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FilterBar;
