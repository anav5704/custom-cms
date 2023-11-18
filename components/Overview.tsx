"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface OverviewProps {
    data: any[]
}


export const Overview = ({ data }: OverviewProps) => {

    return (
        <ResponsiveContainer width="100%" height={350} >
            <BarChart data={data}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12}  tickLine={false} axisLine={false} />
                <YAxis  padding={{ bottom: 15 }} stroke="#888888" fontSize={12}  tickLine={false} axisLine={false} tickFormatter={(valie) => `$${valie}`}/>
                <Bar dataKey="total" fill="#3498db" radius={[7, 7, 7, 7]} barSize={50}/>
            </BarChart>
        </ResponsiveContainer>
    )
}
