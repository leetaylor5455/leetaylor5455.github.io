import React from 'react';
import ListItem from './ListItem';

import skuNumbers from '../data/skunumbers.json';
    
// arrSkus.forEach((product) => {
//     product[1].inStock = false;
//     product[1].units = 0;
// });

function List() {
    
    let list = [];


    const populateList = products => {
        products.sort(function(a, b){
            if(a[1].productName < b[1].productName) return -1;
            if(a[1].productName > b[1].productName) return 1;
            return 0;
        });
    
        products.forEach((product) => {
    
            let name = product[1].productName;
            let sku = product[0];
    
            list.push(
                <ListItem 
                    key = {sku}
                    name = {name}
                    sku = {sku}
                />
            )

            return list;
        });
    }


    const [searchTerm, setSearchTerm] = React.useState("");
    const handleChange = event => {
        setSearchTerm(event.target.value);
    };

    let arrSkus = Object.entries(skuNumbers);

    const filtered = !searchTerm
        ? arrSkus
        : arrSkus.filter(product => 
            product[1].productName.toLowerCase().includes(searchTerm.toLocaleLowerCase())
        );
    
    populateList(filtered);

    return (
        <div className="list container">
            <input
                className="search"
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleChange}
            />
            {list}
        </div> 
    );
}

export default List;