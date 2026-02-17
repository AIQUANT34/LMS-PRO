import React from 'react'

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800">LMS Dashboard</h2>
      <div className="flex items-center gap-4">
        <button className="text-sm text-gray-600 hover:text-gray-800">Notifications</button>
        <div className="w-8 h-8 rounded-full bg-gray-300" />
      </div>
    </header>
  )
}
