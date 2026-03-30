import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
import { StatsRow } from '../components/StatsRow';
import { MovieForm } from '../components/MovieForm';
import { MovieList } from '../components/MovieList';

export function Dashboard() {
  const [activeNav, setActiveNav] = useState('dashboard');

  return (
    <div className="dashboard">
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />
      <main className="main">
        <Topbar />
        <div className="content">
          <StatsRow />
          <MovieForm />
          <MovieList />
        </div>
      </main>
    </div>
  );
}
