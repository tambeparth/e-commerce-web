import React from 'react'
import './DescriptionBox.css'
const DescriptionBox = () => {
    return (
        <div className="descriptionbox">
            <div className="descriptionbox-navigator">
                <div className="descriptionbox-nav-box">Description</div>
                <div className="descriptionbox-nav-box-fade">Reviews</div>
            </div>
            <div className="descriptionbox-description">
                <p>In e-commerce websites, each product may have a description box that provides details about the product, its features, specifications, and any other relevant information.
                </p>
                <p> When filling out forms online, some fields may have a description box to give users additional instructions or explanations about what information is expected in that field.</p>
            </div>
        </div>
    )
}

export default DescriptionBox
