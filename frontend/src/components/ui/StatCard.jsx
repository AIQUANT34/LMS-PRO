import React from 'react'

export default function StatCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-2 text-2xl font-bold text-gray-800">{value}</div>
    </div>
  )
}
