import React, { Component } from 'react';
import Barcode from 'react-barcode';

class ListItem extends Component {
    constructor() {
        super()
        this.state = {
            inStock: false,
            isDroppedDown: false,
            units: ''
        }

        this.unitsInputRef = React.createRef();

        this.handleListItemOnClick = this.handleListItemOnClick.bind(this);
        this.handleArrowOnClick = this.handleArrowOnClick.bind(this);
        this.handleUnitsChange = this.handleUnitsChange.bind(this);
        this.handleUnitsDisplayOnClick = this.handleUnitsDisplayOnClick.bind(this);
    }

    handleListItemOnClick() {
        if (this.state.units > 0) return;
        this.setState({ inStock: ! this.state.inStock }, () => {
            this.props.setInStock(this.props.sku, this.state.inStock);
        });

        
    }

    handleArrowOnClick(event) {
        event.stopPropagation(); // so it doesn't trigger parent onClick
        this.setState({ isDroppedDown: ! this.state.isDroppedDown });
    }

    handleUnitsChange(event) {
        const input = event.target.value;
        this.setState({ units: input });

        if (input > 0) {
            this.setState({ inStock: true })
            this.props.setInStock(this.props.sku, true);
        } else {
            this.setState({ inStock: false })
            this.props.setInStock(this.props.sku, false);
        }

        this.props.setUnits(this.props.sku, event.target.value);
    }

    handleUnitsOnClick(event) {
        event.stopPropagation(); // so it doesn't trigger parent onClick
    }

    handleUnitsDisplayOnClick(event) {
        event.stopPropagation();
        //if (this.state.isDroppedDown) return;
        this.setState({ isDroppedDown: true }, () => this.unitsInputRef.current.focus());
    }

    getListItemClassNames() {
        if (this.state.inStock) return 'list-item in-stock';
        return 'list-item';
    }

    render() {
        let arrowTransform;

        this.state.isDroppedDown 
            ? arrowTransform = 'rotate(-135deg)' 
            : arrowTransform = 'rotate(45deg)';

        return (
            <div className={this.getListItemClassNames()}
                onClick={this.handleListItemOnClick}
                style={{
                    display: this.props.isVisible ? 'block' : 'none'

                }}
                >

                <div className="arrow-container"
                    onClick={this.handleArrowOnClick}
                >
                    <i className="arrow"
                        style={{
                            borderColor: this.state.inStock ? '#fff' : '#333',
                            transform: arrowTransform,
                            WebkitTransform: arrowTransform,
                        }}
                    ></i>
                </div>

                <p className="list-item-name">
                    {this.props.name + '  '} 
                    <span className='units-display'
                        style={{display: this.state.units ? 'inline-block' : 'none'}}
                        onClick={this.handleUnitsDisplayOnClick}
                    >
                        {this.state.units}
                    </span>
                </p>

                <div
                    className="list-item-dropdown"
                    style = {{
                        display: this.state.isDroppedDown ? 'block' : 'none'
                    }}
                >
                <div className='input-units-container'>
                    <p>Units: </p>
                    <input
                        className='input-units'
                        type='number'
                        placeholder='0'
                        onChange={this.handleUnitsChange}
                        onClick={this.handleUnitsOnClick}
                        ref={this.unitsInputRef}
                    />
                </div>
                    
                    <Barcode
                        value={this.props.sku}
                        background = {this.state.inStock ? '#fff' : '#ddd'}
                        width = {window.innerWidth > 600 ? 5 : 3}
                        height = {100}
                        marginTop = {20}
                    />
                </div>
            </div>
            
        )
    }
}

export default ListItem;