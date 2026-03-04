import React from 'react';
import PropTypes from 'prop-types';
import './Input.css';

export const Input = ({ 
  label,
  error,
  success,
  required = false,
  id,
  className = '',
  type = 'text',
  ...props 
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = `${inputId}-error`;
  const successId = `${inputId}-success`;
  
  const inputClasses = [
    'input-landing',
    error ? 'input-error' : '',
    success ? 'input-success' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="input-group">
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required" aria-label="required"> *</span>}
        </label>
      )}
      
      <div className="input-wrapper">
        <input
          id={inputId}
          type={type}
          className={inputClasses}
          aria-required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : success ? successId : undefined}
          {...props}
        />
        
        {success && !error && (
          <span className="input-icon input-icon-success" aria-hidden="true">
            <i className="bi bi-check-circle-fill"></i>
          </span>
        )}
      </div>
      
      {error && (
        <span id={errorId} className="input-error-message" role="alert">
          {error}
        </span>
      )}
      
      {success && !error && (
        <span id={successId} className="input-success-message">
          {success}
        </span>
      )}
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  success: PropTypes.string,
  required: PropTypes.bool,
  id: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
};

export default Input;
