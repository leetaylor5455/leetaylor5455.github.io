import React, { useState } from 'react';
import ListItem from './ListItem';

import skuNumbers from '../data/skunumbers.json';
    
// arrSkus.forEach((product) => {
//     product[1].inStock = false;
//     product[1].units = 0;
// });

function List() {
    
    const allSkus = Object.entries(skuNumbers)
    const [arrSkus, updateList] = useState(allSkus);

    arrSkus.sort(function(a, b){
        if(a[1].productName < b[1].productName) return -1;
        if(a[1].productName > b[1].productName) return 1;
        return 0;
    });


    const [searchTerm, setSearchTerm] = useState("");

    const handleChange = event => {
        setSearchTerm(event.target.value, filter(event.target.value));
    };

    const filter = searchTerm => {
        const filtered = !searchTerm
        ? allSkus
        : allSkus.filter(product =>
            product[1].productName.toLowerCase().includes(searchTerm.toLocaleLowerCase())
        );
        updateList(filtered);
    }

    return (
        <div className="list container">
            <input
                className="search"
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleChange}
                //updateUnits = {updateUnits}
            />
            {arrSkus.map(product => (
                <ListItem 
                    name = {product[1].productName} 
                    sku = {product[0]}
                    key = {product[0]}
                />
            ))}
        </div> 
    );
}

export default List;