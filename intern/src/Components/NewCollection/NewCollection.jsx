import { useState, useEffect } from 'react';
import './NewCollection.css';
import Item from '../Item/Item';

const NewCollection = () => {
    const [new_collection, setNew_collection] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetch((process.env.REACT_APP_API_URL || 'http://localhost:3000') + '/newcollections')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("New collections fetched:", data);
                setNew_collection(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching new collections:", error);
                setError(error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="new-Collection">
                <h1>NEW COLLECTIONS</h1>
                <hr />
                <div className="collection">
                    <p>Loading new collections...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="new-Collection">
                <h1>NEW COLLECTIONS</h1>
                <hr />
                <div className="collection">
                    <p>Error loading collections: {error.message}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="new-Collection">
            <h1>NEW COLLECTIONS</h1>
            <hr />
            <div className="collection">
                {new_collection.length > 0 ? (
                    new_collection.map((item, i) => {
                        return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
                    })
                ) : (
                    <p>No new collections available at the moment.</p>
                )}
            </div>
        </div>
    );
};

export default NewCollection;
