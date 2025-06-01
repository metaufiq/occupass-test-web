import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <header className="p-2 flex gap-2 bg-slate-900 text-white justify-between">
      <nav className="flex flex-row">
        <div className="px-2 font-bold">
          <Link to="/">Home</Link>
          <Link to="/customer" className="ml-4">Customers</Link>
          <Link to="/order" className="ml-4">Orders</Link>
        </div>
      </nav>
    </header>
  )
}
