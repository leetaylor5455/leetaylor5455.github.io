import React from 'react'

function ActivityCard(props) {
  return (
    <div className='card-wrapper'>
        <div className='card-selected-border'
            style={{
                opacity: props.selected ? 1 : 0,
                boxShadow: props.selected ? '0px 8px 15px rgba(255, 103, 212, 0.3)' : '0px 6px 10px rgba(0, 0, 0, 0.05)'
            }}
            ></div>
        <div className='card'>
            <div className='name'>{props.name}</div>
            <img className='activity-img' src={props.image} alt={props.name} />
        </div>
    </div>
  )
}

export default ActivityCard