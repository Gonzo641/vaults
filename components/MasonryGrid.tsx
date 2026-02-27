'use client'

import React, { useState, useEffect } from 'react'

export function MasonryGrid({ children }: { children: React.ReactNode }) {
    const [cols, setCols] = useState(4)

    useEffect(() => {
        const updateCols = () => {
            if (window.innerWidth < 640) setCols(1)
            else if (window.innerWidth < 1024) setCols(2)
            else if (window.innerWidth < 1280) setCols(3)
            else setCols(4)
        }

        updateCols()
        window.addEventListener('resize', updateCols)
        return () => window.removeEventListener('resize', updateCols)
    }, [])

    const items = React.Children.toArray(children)
    const columns = Array.from({ length: cols }, () => [] as React.ReactNode[])

    items.forEach((item, i) => {
        columns[i % cols].push(item)
    })

    return (
        <div className="flex gap-6 items-start">
            {columns.map((col, i) => (
                <div key={i} className="flex-1 flex flex-col gap-6">
                    {col}
                </div>
            ))}
        </div>
    )
}
