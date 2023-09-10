import { Divider, Paper } from '@mui/material'
import React, { useContext } from 'react'
import { DesignContext } from '../../contexts/DesignContext'

export default function NumberCard({ number, title, items, btnText, btnOnClick }) {
    const { palette } = useContext(DesignContext);
    return (
        <Paper elevation={3} style={{ padding: '20px', margin: '0px 20px 0px 20px', textAlign: 'right' }}>
            <h1>{number}</h1>
            <h2 style={{ color: palette.secondaryColor }}>{title}</h2>
            {items?.length > 0 &&
                <div>
                    <Divider />
                    <div style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <div style={{ textAlign: 'left' }}>
                            {items.map((item, i) => {
                                return (
                                    <p key={i}>•<span style={{ display: 'inline-block', color: palette.primaryColor, fontSize: '1.2rem', fontWeight: 'bold' }}>{item.number}</span>{item.text}</p>
                                )
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
