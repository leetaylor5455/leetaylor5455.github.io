import React, { Component } from 'react';
import ListItem from './ListItem';
import Barcodes from './Barcodes';
import Barcode from 'react-barcode';

import productsData from '../data/productsData.json';

class Main extends Component {

    constructor() {
        super()
        this.state = {
            products: this.populateProducts(),
            showBarcodes: false,
            barcodeSlides: []
        }

        this.toggleBarcodes = this.toggleBarcodes.bind(this);
        this.handleBarcodeButtonOnClick = this.handleBarcodeButtonOnClick.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.filter = this.filter.bind(this);
        this.setInStock = this.setInStock.bind(this);
        this.setUnits = this.setUnits.bind(this);
    }

    populateProducts() {
        const skusArray = Object.entries(productsData);
        
        skusArray.sort((a, b) => {
            if(a[1].productName < b[1].productName) return -1;
            if(a[1].productName > b[1].productName) return 1;
            return 0;
        });

        skusArray.forEach(product => {
            product.isVisible = true;
            product[1].inStock = false;
        })

        return skusArray;
    }

    handleBarcodeButtonOnClick() {
        this.setState({ showBarcodes: ! this.state.showBarcodes }, () => {
            this.toggleBarcodes(this.state.showBarcodes);
        })
    }

    handleSearchChange(event) {
        this.filter(event.target.value)
    }

    setUnits(sku, amount) {
        const newProducts = this.state.products.map(product => {
            if (product[0] === sku) {
                product[1].units = amount;
            }
            return product;
        })

        this.setState({ products: newProducts });
    }

    setInStock(sku, inStock) {
        const newProducts = this.state.products.map(product => {
            if (product[0] === sku) {
                product[1].inStock = inStock;
            }
            return product;
        })

        this.setState({ products: newProducts });
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

    toggleBarcodes(show) {
        if (show) {
            this.setState({ 
                barcodeSlides: (
                    <Barcodes
                        products = {this.state.products}
                    />
                )
            })
        } else {
            this.setState({ barcodeSlides: [] })
        }
    }

    render() {
        return (
            <main>
                <div className="list container"
                    style={{display: this.state.showBarcodes ? 'none' : 'block'}}
                >
                    <input
                        className="search"
                        type="text"
                        placeholder="Search..."
                        value={this.state.searchTerm}
                        onChange={this.handleSearchChange}
                    />
                        
                    {this.state.products.map(product => (
                        <ListItem 
                            name = {product[1].productName} 
                            sku = {product[0]}
                            key = {product[0]}
                            isVisible = {product.isVisible}
                            setInStock = {this.setInStock}
                            setUnits = {this.setUnits}
                        />
                    ))}
                </div>

                {this.state.barcodeSlides}

                <div className='container'>
                    <button
                        onClick = {this.handleBarcodeButtonOnClick}
                    >
                    {this.state.showBarcodes 
                        ? String.fromCharCode(9776)
                        : <Barcode 
                            value='Barcodes'
                            background = '#f06c00'
                            lineColor = '#ffffff'
                            fontSize = {32}
                            width = {window.innerWidth > 900 ? 3 : 2}
                            height = {50}
                            marginTop = {20}
                        />
                    }
                        
                    </button>
                    <h4>Created By Lee Taylor</h4>
                </div>
                
            </main>
        )
    }
}

export default Main;