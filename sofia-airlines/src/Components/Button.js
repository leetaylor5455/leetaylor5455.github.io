import React from 'react'
import { Link } from 'react-router-dom'

function Button(props) {
  return (
    <Link to={props.link}>
        <div className='button'>{props.text}</div>
    </Link>
  )
}

export default Button