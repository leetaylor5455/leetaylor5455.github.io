import React from 'react';
import Barcode from 'react-barcode';

function ListItem(props) {
    return (
        <div className="list-item">
            <p className="list-item-name">{props.name}</p>
            {/* <Barcode 
                value={props.sku}
                background = '#ddd'
            /> */}
        </div>
    )
}

export default ListItem;