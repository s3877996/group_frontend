import React from 'react';
import PropTypes from 'prop-types';

const MenuItem = ({ onClick, label }) => {
    return (
        <div onClick={onClick} className="px-4 py-3 hover:bg-neutral-100 transition font-semibold">
            {label}
        </div>
    );
};

MenuItem.propTypes = {
    onClick: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
};

export default MenuItem;
