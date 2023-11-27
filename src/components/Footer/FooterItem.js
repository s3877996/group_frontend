import React from "react";

const FooterItem = (props) => {
    const { title, items } = props;
    return (
        <ul className="leading-relaxed">
            <li className="mb-2 font-semibold">{title}</li>
            {items.length > 0 &&
                items.map((item, idx) => <li key={idx}>{item}</li>)}
        </ul>
    );
};

export default FooterItem;
