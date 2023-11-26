import { Divider, Paper } from '@mui/material'
import React, { useContext } from 'react'
import { DesignContext } from '../../contexts/DesignContext'

export default function NumberCard({ number, title, items, btnText, itemFloat = 'left', img }) {
    const { palette } = useContext(DesignContext);
    return (
        <Paper elevation={3} style={{ padding: '20px', margin: '0px 20px 0px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <img src={img} width={'50px'} />
                <h1 style={{ fontSize: '1.3rem' }}>{number}</h1>
            </div>
            <h2 style={{ color: palette.secondaryColor, textAlign: 'right' }}>{title}</h2>
            {items?.length > 0 &&
                <div>
                    <Divider />
                    <div style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <div style={{ textAlign: itemFloat }}>
                            {items.map((item, i) => {
                                if (!item.onClick)
                                    return (
                                        <p key={i}>•<span style={{ display: 'inline-block', color: palette.primaryColor, fontSize: '1.2rem', fontWeight: 'bold' }}>{item.number}</span>{item.text}</p>
                                    )
                                else {
                                    return (
                                        <button className='button-outlined' onClick={item.onClick}>{item.text}</button>
                                    )
                                }
                            })}
                        </div>
                    </div>
                </div>
            }
            {btnText &&
                <button className='button-outlined' type='button'>{btnText}</button>
            }
        </Paper>


    )
}
