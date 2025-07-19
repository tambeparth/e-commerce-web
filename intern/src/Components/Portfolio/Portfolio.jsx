import React, { useState } from 'react';
import { FaReact, FaNodeJs, FaGithub, FaExternalLinkAlt, FaCode, FaMobile, FaShoppingCart, FaUsers, FaSearch, FaHeart, FaPalette, FaShieldAlt } from 'react-icons/fa';
import { SiMongodb, SiExpress, SiJavascript, SiCss3, SiHtml5 } from 'react-icons/si';
import './Portfolio.css';

const Portfolio = () => {
    const [activeTab, setActiveTab] = useState('overview');

    const technologies = [
        { name: 'React.js', icon: <FaReact />, description: 'Frontend framework for building user interfaces' },
        { name: 'Node.js', icon: <FaNodeJs />, description: 'Backend runtime environment' },
        { name: 'Express.js', icon: <SiExpress />, description: 'Web application framework for Node.js' },
        { name: 'MongoDB', icon: <SiMongodb />, description: 'NoSQL database for data storage' },
        { name: 'JavaScript', icon: <SiJavascript />, description: 'Programming language for web development' },
        { name: 'CSS3', icon: <SiCss3 />, description: 'Styling and responsive design' },
        { name: 'HTML5', icon: <SiHtml5 />, description: 'Markup language for web structure' }
    ];

    const features = [
        {
            icon: <FaShoppingCart />,
            title: 'Advanced Shopping Cart',
            description: 'Dynamic cart with quantity management, promo codes, and real-time total calculation'
        },
        {
            icon: <FaHeart />,
            title: 'Wishlist System',
            description: 'Save favorite products with persistent storage and easy cart integration'
        },
        {
            icon: <FaSearch />,
            title: 'Smart Search & Filters',
            description: 'Advanced product search with category, price, and rating filters'
        },
        {
            icon: <FaUsers />,
            title: 'User Management',
            description: 'Complete user authentication, profiles, and order history tracking'
        },
        {
            icon: <FaMobile />,
            title: 'Responsive Design',
            description: 'Fully responsive layout optimized for all device sizes'
        },
        {
            icon: <FaPalette />,
            title: 'Dark Mode',
            description: 'Toggle between light and dark themes with smooth transitions'
        },
        {
            icon: <FaShieldAlt />,
            title: 'Secure Authentication',
            description: 'JWT-based authentication with protected routes and user sessions'
        },
        {
            icon: <FaCode />,
            title: 'Modern UI/UX',
            description: 'Contemporary design with animations, loading states, and notifications'
        }
    ];

    const achievements = [
        { metric: '100%', label: 'Responsive Design' },
        { metric: '8+', label: 'Key Features' },
        { metric: '7', label: 'Technologies Used' },
        { metric: '50+', label: 'Components Built' }
    ];

    const codeSnippets = {
        frontend: `// Modern React Component with Hooks
const Item = ({ id, name, image, new_price, old_price }) => {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const { addToCart } = useContext(ShopContext);

    const handleWishlistToggle = async () => {
        const endpoint = isWishlisted ? 'removefromwishlist' : 'addtowishlist';
        await fetch(\`http://localhost:3000/\${endpoint}\`, {
            method: 'POST',
            headers: {
                'auth-token': localStorage.getItem('auth-token'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ itemId: id }),
        });
        setIsWishlisted(!isWishlisted);
    };

    return (
        <div className="item">
            <img src={image} alt={name} />
            <button onClick={handleWishlistToggle}>
                <FaHeart className={isWishlisted ? 'active' : ''} />
            </button>
            <h3>{name}</h3>
            <div className="prices">
                <span className="new-price">₹{new_price}</span>
                <span className="old-price">₹{old_price}</span>
            </div>
            <button onClick={() => addToCart(id)}>
                Add to Cart
            </button>
        </div>
    );
};`,
        backend: `// Express.js API with MongoDB
app.post('/addtowishlist', fetchUser, async (req, res) => {
    try {
        let userData = await Users.findOne({ _id: req.user.id });
        if (!userData.wishlist.includes(req.body.itemId)) {
            userData.wishlist.push(req.body.itemId);
            await Users.findOneAndUpdate(
                { _id: req.user.id }, 
                { wishlist: userData.wishlist }
            );
        }
        res.json({ success: true, message: "Added to wishlist" });
    } catch (error) {
        res.status(500).json({ success: false, errors: "Server Error" });
    }
});

// Advanced search with filters
app.get('/search', async (req, res) => {
    const { query, category, minPrice, maxPrice, sortBy } = req.query;
    let filter = {};
    
    if (query) {
        filter.$or = [
            { name: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } }
        ];
    }
    
    if (category && category !== 'all') {
        filter.category = category;
    }
    
    if (minPrice || maxPrice) {
        filter.new_price = {};
        if (minPrice) filter.new_price.$gte = Number(minPrice);
        if (maxPrice) filter.new_price.$lte = Number(maxPrice);
    }
    
    let products = await Product.find(filter);
    
    // Sort products based on criteria
    if (sortBy === 'price_low') {
        products.sort((a, b) => a.new_price - b.new_price);
    }
    
    res.send(products);
});`
    };

    return (
        <div className="portfolio">
            <div className="portfolio-hero">
                <div className="hero-content">
                    <h1>FashionClub E-Commerce Platform</h1>
                    <p className="hero-subtitle">
                        A modern, full-stack e-commerce solution built with React.js and Node.js
                    </p>
                    <div className="hero-stats">
                        {achievements.map((achievement, index) => (
                            <div key={index} className="stat">
                                <div className="stat-number">{achievement.metric}</div>
                                <div className="stat-label">{achievement.label}</div>
                            </div>
                        ))}
                    </div>
                    <div className="hero-actions">
                        <a href="https://github.com/PARTH/e-Commerce" target="_blank" rel="noopener noreferrer" className="btn-primary">
                            <FaGithub /> View Source Code
                        </a>
                        <a href="#demo" className="btn-secondary">
                            <FaExternalLinkAlt /> Live Demo
                        </a>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="mockup-browser">
                        <div className="browser-header">
                            <div className="browser-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <div className="browser-url">fashionclub.com</div>
                        </div>
                        <div className="browser-content">
                            <div className="mockup-content">
                                <div className="mockup-header"></div>
                                <div className="mockup-products">
                                    <div className="mockup-product"></div>
                                    <div className="mockup-product"></div>
                                    <div className="mockup-product"></div>
                                    <div className="mockup-product"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="portfolio-content">
                <div className="tab-navigation">
                    <button
                        className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'features' ? 'active' : ''}`}
                        onClick={() => setActiveTab('features')}
                    >
                        Features
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'tech' ? 'active' : ''}`}
                        onClick={() => setActiveTab('tech')}
                    >
                        Technology
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'code' ? 'active' : ''}`}
                        onClick={() => setActiveTab('code')}
                    >
                        Code Examples
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === 'overview' && (
                        <div className="overview-section">
                            <h2>Project Overview</h2>
                            <div className="overview-grid">
                                <div className="overview-text">
                                    <h3>About This Project</h3>
                                    <p>
                                        FashionClub is a comprehensive e-commerce platform that demonstrates modern web development
                                        practices and technologies. Built from the ground up with a focus on user experience,
                                        performance, and scalability.
                                    </p>
                                    <h3>Key Highlights</h3>
                                    <ul>
                                        <li>Full-stack MERN application with modern architecture</li>
                                        <li>Responsive design that works seamlessly across all devices</li>
                                        <li>Advanced features like wishlist, search, and user profiles</li>
                                        <li>Secure authentication and authorization system</li>
                                        <li>Clean, maintainable code with component-based architecture</li>
                                        <li>Modern UI/UX with dark mode and smooth animations</li>
                                    </ul>
                                </div>
                                <div className="overview-metrics">
                                    <h3>Development Metrics</h3>
                                    <div className="metrics-grid">
                                        <div className="metric-item">
                                            <span className="metric-value">2 weeks</span>
                                            <span className="metric-label">Development Time</span>
                                        </div>
                                        <div className="metric-item">
                                            <span className="metric-value">50+</span>
                                            <span className="metric-label">Components</span>
                                        </div>
                                        <div className="metric-item">
                                            <span className="metric-value">15+</span>
                                            <span className="metric-label">API Endpoints</span>
                                        </div>
                                        <div className="metric-item">
                                            <span className="metric-value">100%</span>
                                            <span className="metric-label">Mobile Responsive</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'features' && (
                        <div className="features-section">
                            <h2>Key Features</h2>
                            <div className="features-grid">
                                {features.map((feature, index) => (
                                    <div key={index} className="feature-card">
                                        <div className="feature-icon">{feature.icon}</div>
                                        <h3>{feature.title}</h3>
                                        <p>{feature.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'tech' && (
                        <div className="tech-section">
                            <h2>Technology Stack</h2>
                            <div className="tech-grid">
                                {technologies.map((tech, index) => (
                                    <div key={index} className="tech-card">
                                        <div className="tech-icon">{tech.icon}</div>
                                        <h3>{tech.name}</h3>
                                        <p>{tech.description}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="architecture-diagram">
                                <h3>System Architecture</h3>
                                <div className="architecture-flow">
                                    <div className="arch-layer">
                                        <h4>Frontend (React.js)</h4>
                                        <p>User Interface, State Management, Routing</p>
                                    </div>
                                    <div className="arch-arrow">↓</div>
                                    <div className="arch-layer">
                                        <h4>Backend (Node.js + Express)</h4>
                                        <p>API Endpoints, Authentication, Business Logic</p>
                                    </div>
                                    <div className="arch-arrow">↓</div>
                                    <div className="arch-layer">
                                        <h4>Database (MongoDB)</h4>
                                        <p>Data Storage, User Management, Product Catalog</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'code' && (
                        <div className="code-section">
                            <h2>Code Examples</h2>
                            <div className="code-examples">
                                <div className="code-example">
                                    <h3>Frontend - React Component</h3>
                                    <pre><code>{codeSnippets.frontend}</code></pre>
                                </div>
                                <div className="code-example">
                                    <h3>Backend - Express.js API</h3>
                                    <pre><code>{codeSnippets.backend}</code></pre>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="portfolio-footer">
                <div className="footer-content">
                    <h2>Ready to Collaborate?</h2>
                    <p>I'm passionate about creating exceptional web experiences. Let's build something amazing together!</p>
                    <div className="contact-actions">
                        <a href="mailto:your.email@example.com" className="btn-primary">Get In Touch</a>
                        <a href="/resume.pdf" target="_blank" className="btn-secondary">Download Resume</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Portfolio;
