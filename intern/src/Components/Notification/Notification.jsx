import React, { useState, useEffect, createContext, useContext } from 'react';
import { FaCheck, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import './Notification.css';

// Create notification context
const NotificationContext = createContext();

// Notification types
export const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
};

// Notification Provider Component
export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = (message, type = NOTIFICATION_TYPES.INFO, duration = 5000) => {
        const id = Date.now() + Math.random();
        const notification = {
            id,
            message,
            type,
            duration
        };

        setNotifications(prev => [...prev, notification]);

        // Auto remove notification after duration
        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }

        return id;
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    };

    const clearAllNotifications = () => {
        setNotifications([]);
    };

    const value = {
        notifications,
        addNotification,
        removeNotification,
        clearAllNotifications
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
            <NotificationContainer />
        </NotificationContext.Provider>
    );
};

// Hook to use notifications
export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

// Individual Notification Component
const NotificationItem = ({ notification, onRemove }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);

    useEffect(() => {
        // Trigger entrance animation
        setTimeout(() => setIsVisible(true), 10);
    }, []);

    const handleRemove = () => {
        setIsRemoving(true);
        setTimeout(() => {
            onRemove(notification.id);
        }, 300);
    };

    const getIcon = () => {
        switch (notification.type) {
            case NOTIFICATION_TYPES.SUCCESS:
                return <FaCheck />;
            case NOTIFICATION_TYPES.ERROR:
                return <FaTimes />;
            case NOTIFICATION_TYPES.WARNING:
                return <FaExclamationTriangle />;
            case NOTIFICATION_TYPES.INFO:
            default:
                return <FaInfoCircle />;
        }
    };

    return (
        <div 
            className={`notification notification-${notification.type} ${isVisible ? 'visible' : ''} ${isRemoving ? 'removing' : ''}`}
            onClick={handleRemove}
        >
            <div className="notification-icon">
                {getIcon()}
            </div>
            <div className="notification-content">
                <p>{notification.message}</p>
            </div>
            <button className="notification-close" onClick={handleRemove}>
                <FaTimes />
            </button>
        </div>
    );
};

// Notification Container Component
const NotificationContainer = () => {
    const { notifications, removeNotification } = useNotification();

    return (
        <div className="notification-container">
            {notifications.map(notification => (
                <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onRemove={removeNotification}
                />
            ))}
        </div>
    );
};

// Utility functions for easy use
export const showSuccessNotification = (message, duration) => {
    const { addNotification } = useNotification();
    return addNotification(message, NOTIFICATION_TYPES.SUCCESS, duration);
};

export const showErrorNotification = (message, duration) => {
    const { addNotification } = useNotification();
    return addNotification(message, NOTIFICATION_TYPES.ERROR, duration);
};

export const showWarningNotification = (message, duration) => {
    const { addNotification } = useNotification();
    return addNotification(message, NOTIFICATION_TYPES.WARNING, duration);
};

export const showInfoNotification = (message, duration) => {
    const { addNotification } = useNotification();
    return addNotification(message, NOTIFICATION_TYPES.INFO, duration);
};

export default NotificationItem;
