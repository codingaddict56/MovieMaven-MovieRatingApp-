import React from 'react'

function ErrorComponent({error}) {
  return (
    <div>
       <span className='text-red-600 text-[10px]'> {error}</span>
    </div>
  )
}

export default ErrorComponent