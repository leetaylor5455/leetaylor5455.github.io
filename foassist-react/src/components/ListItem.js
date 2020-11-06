import React from 'react';
import Barcode from 'react-barcode';

function ListItem(props) {
    return (
        <div 
            className="list-item"
            style={{
                display: props.isVisible ? 'block' : 'none'
            }}
            >
            <p className="list-item-name">{props.name}</p>
            <div className="list-item-dropdown hidden">
                <Barcode 
                    value={props.sku}
                    background = '#ddd'
                    width = {6}
                    height = {150}
                    marginTop = {20}
                />
            </div>
        </div>
    )
}

export default ListItem;