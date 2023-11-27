// import React from 'react';
// import PropTypes from 'prop-types';

// const MenuItem = ({ onClick, label }) => {
//     return (
//         <div onClick={onClick} className="px-4 py-3 hover:bg-neutral-100 transition font-semibold">
//             {label}
//         </div>
//     );
// };

// MenuItem.propTypes = {
//     onClick: PropTypes.func.isRequired,
//     label: PropTypes.string.isRequired,
// };

// export default MenuItem;

import React from 'react';
import PropTypes from 'prop-types';

const MenuItem = ({ onClick, label, Icon }) => {
    return (
        <div onClick={onClick} className="px-4 py-3 hover:bg-neutral-100 transition font-semibold flex items-center">
            <Icon className="mr-2 h-5 w-5"/>
            {label}
        </div>
    );
};

MenuItem.propTypes = {
    onClick: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    Icon: PropTypes.elementType.isRequired,
};

export default MenuItem;