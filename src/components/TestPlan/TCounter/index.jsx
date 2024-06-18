import React from 'react'

export default function TCounter({count, tColor = "#ffffff", bColor = "#4094F7"}) {
  return (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '50%',
        width: '24px',
        height: '24px',
        color: tColor,
        backgroundColor: bColor,
    }}>
        {count ?? 0}
    </div>
  )
}
