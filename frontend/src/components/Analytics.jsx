import React from 'react'
import Sidebar from '../scenes/global/Sidebar'


export default function Analytics() {
    return (
        <section style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            height: "100%",
        }}>
            <Sidebar />
            <iframe
                title="MTD_DataAlaytics"
                width="100%"
                height="100%"
                src="https://app.powerbi.com/view?r=eyJrIjoiMmU0Y2FjNjQtMWUxMy00MzVjLWE1YWUtYTg0OTEwYmFlOTczIiwidCI6IjMwNTgxZGY4LWMxMjAtNDNmZC1iZDFlLTk5ZDAzODEzMTFjMCIsImMiOjl9"
                frameborder="0"
                allowFullScreen="true"
            ></iframe>
        </section>
    )
}
