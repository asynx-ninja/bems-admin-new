export default function Widget() {
  return (
      <div className="flex h-screen">
        
        <aside className="w-64 bg-zinc-100 dark:bg-zinc-800 p-4">
          <div className="mb-8">
            <img src="https://placehold.co/100x40" alt="Logo" className="mb-4">
            <nav>
              <ul>
                <li className="mb-2"><a href="#" className="flex items-center p-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"><span className="material-icons">dashboard</span>Dashboard</a></li>
                <li className="mb-2"><a href="#" className="flex items-center p-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"><span className="material-icons">api</span>APIs</a></li>
                <li className="mb-2"><a href="#" className="flex items-center p-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"><span className="material-icons">check_circle</span>Approvals</a></li>
                <li className="mb-2"><a href="#" className="flex items-center p-2 text-zinc-700 dark:text-zinc-300 bg-zinc-200 dark:bg-zinc-700 rounded"><span className="material-icons">history</span>Audit Trails</a></li>
                <li className="mb-2"><a href="#" className="flex items-center p-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"><span className="material-icons">event</span>Events</a></li>
              </ul>
            </nav>
          </div>
          <div>
            <h2 className="text-zinc-500 dark:text-zinc-400 mb-2">Administration</h2>
            <nav>
              <ul>
                <li className="mb-2"><a href="#" className="flex items-center p-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"><span className="material-icons">people</span>Users</a></li>
                <li className="mb-2"><a href="#" className="flex items-center p-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"><span className="material-icons">business</span>Organizations</a></li>
                <li className="mb-2"><a href="#" className="flex items-center p-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"><span className="material-icons">subscriptions</span>Subscriptions</a></li>
                <li className="mb-2"><a href="#" className="flex items-center p-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"><span className="material-icons">collections</span>Collections</a></li>
                <li className="mb-2"><a href="#" className="flex items-center p-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"><span className="material-icons">category</span>Categories</a></li>
                <li className="mb-2"><a href="#" className="flex items-center p-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"><span className="material-icons">label</span>Tags</a></li>
                <li className="mb-2"><a href="#" className="flex items-center p-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"><span className="material-icons">language</span>Theming and Language</a></li>
                <li className="mb-2"><a href="#" className="flex items-center p-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"><span className="material-icons">api</span>API Gateways</a></li>
                <li className="mb-2"><a href="#" className="flex items-center p-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"><span className="material-icons">search</span>SEO</a></li>
                <li className="mb-2"><a href="#" className="flex items-center p-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"><span className="material-icons">settings</span>Settings</a></li>
              </ul>
            </nav>
          </div>
        </aside>
        
        <main className="flex-1 p-6 bg-white dark:bg-zinc-900">
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Audit Trails</h1>
            <div className="flex items-center space-x-4">
              <input type="text" placeholder="Search" className="p-2 border border-zinc-300 dark:border-zinc-700 rounded"/>
              <button className="p-2 bg-blue-500 text-white rounded">Search</button>
            </div>
          </header>
      <div className="bg-white dark:bg-zinc-800 shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
          <thead className="bg-zinc-50 dark:bg-zinc-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-300 uppercase tracking-wider">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-300 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-300 uppercase tracking-wider">Time</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-zinc-800 divide-y divide-zinc-200 dark:divide-zinc-700">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900 dark:text-zinc-100"><span className="bg-yellow-200 text-yellow-800 p-1 rounded">sbyrnes</span> created a Super User Login for 5711478</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-300"><img src="https://placehold.co/40" alt="User Avatar" className="inline-block w-8 h-8 rounded-full mr-2"> sbyrnes</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-300">May 11, 2023 17:42</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900 dark:text-zinc-100"><span className="bg-yellow-200 text-yellow-800 p-1 rounded">sbyrnes</span> updated entity EnvConfig (key: marketingPanels, id: 924)</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-300"><img src="https://placehold.co/40" alt="User Avatar" className="inline-block w-8 h-8 rounded-full mr-2"> sbyrnes</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-300">May 10, 2023 06:48</td>
            </tr>
            
          </tbody>
        </table>
      </div>
        </main>
      </div>
  )
}