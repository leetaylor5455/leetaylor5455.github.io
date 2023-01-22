import React, { useState, useEffect } from 'react'

function ActivityCard(props) {

  const bg = {
    selected: '#FEF9FF',
    unselected: '#fff'
  }

  const [active, setActive] = useState(false);

  useEffect(() => {
    if (props.activities.find(element => element.id === props.data.id)) {
        setActive(true);
    } else {
        setActive(false);
    }
  }, [props.activities, props.data])

  return (
    <div className='card-wrapper'
        onClick={() => props.selectActivity(props.data)}
    >
        <div className='card-selected-border'
            style={{
                opacity: active ? 1 : 0,
                boxShadow: active ? '0px 8px 15px rgba(255, 103, 212, 0.3)' : '0px 6px 10px rgba(0, 0, 0, 0.05)'
            }}
            ></div>
        <div className='card'
            style={{ backgroundColor: active ? bg.selected : bg.unselected }}
        >
            <div className='name'>{props.name}</div>
            <img className='activity-img' src={props.image} alt={props.name} />
        </div>
    </div>
  )
}

export default ActivityCard