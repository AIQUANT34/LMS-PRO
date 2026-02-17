import React from 'react'

const NavItem = ({ children }) => (
  <li className="px-4 py-2 rounded hover:bg-gray-200 cursor-pointer">{children}</li>
)

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r">
      <div className="p-4 font-semibold text-gray-700">Menu</div>
      <ul className="space-y-1 p-2 text-gray-600">
        <NavItem>Overview</NavItem>
        <NavItem>Courses</NavItem>
        <NavItem>Students</NavItem>
        <NavItem>Settings</NavItem>
      </ul>
    </aside>
  )
}
