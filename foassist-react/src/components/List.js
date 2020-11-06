import React, { Component, isValidElement } from 'react';
import ListItem from './ListItem';

import skuNumbers from '../data/skunumbers.json';
    
// arrSkus.forEach((product) => {
//     product[1].inStock = false;
//     product[1].units = 0;
// });

class List extends Component {

    populateProducts() {
        const skusArray = Object.entries(skuNumbers);
        
        skusArray.sort(function(a, b){
            if(a[1].productName < b[1].productName) return -1;
            if(a[1].productName > b[1].productName) return 1;
            return 0;
        });

        skusArray.forEach(product => {
            product.isVisible = true;
        })

        return skusArray;
    }

    constructor() {
        super()
        this.state = {
            products: this.populateProducts()
        }
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.filter = this.filter.bind(this);
    }

    handleSearchChange(event) {
        this.filter(event.target.value)
    }

    filter(searchTerm) {
        const newProducts = this.state.products.map(product => {
            if (!product[1].productName.toLowerCase().includes(searchTerm.toLocaleLowerCase())) {
                product.isVisible = false;
            } else {
                product.isVisible = true;
            }
            return product;
        });
        this.setState({ products: newProducts })
    }

    render() {
        return (
            <div className="list container">

                <input
                    className="search"
                    type="text"
                    placeholder="Search..."
                    value={this.state.searchTerm}
                    onChange={this.handleSearchChange}
                    //updateUnits = {updateUnits}
                />
                    
                {this.state.products.map(product => (
                    <ListItem 
                        name = {product[1].productName} 
                        sku = {product[0]}
                        key = {product[0]}
                        isVisible = {product.isVisible}
                    />
                ))}
            </div>
        )
    }
}

export default List;