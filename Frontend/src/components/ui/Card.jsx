import React from 'react';
import PropTypes from 'prop-types';
import './Card.css';

const Card = ({ children, hover = false, className = '', ...props }) => {
  const cardClasses = [
    'card-landing',
    hover ? 'card-hover' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  hover: PropTypes.bool,
  className: PropTypes.string,
};

export const CardIcon = ({ icon, className = '' }) => {
  return (
    <div className={`card-icon ${className}`}>
      <i className={icon}></i>
    </div>
  );
};

CardIcon.propTypes = {
  icon: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export const CardTitle = ({ children, className = '' }) => {
  return (
    <h3 className={`card-title ${className}`}>
      {children}
    </h3>
  );
};

CardTitle.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export const CardBody = ({ children, className = '' }) => {
  return (
    <p className={`card-body ${className}`}>
      {children}
    </p>
  );
};

CardBody.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Card;
