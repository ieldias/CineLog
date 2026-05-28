import { useState, useEffect, useRef } from 'react';
import { searchTmdb, POSTER_BASE, getGenreName } from '../lib/tmdb';
import type { TmdbResult, MediaType } from '../types';

interface MovieSearchProps {
  onSelect: (result: TmdbResult, type: MediaType) => void;
}

export function MovieSearch({ onSelect }: MovieSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<TmdbResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) { setResults([]); setOpen(false); return; }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const data = await searchTmdb(query);
      setResults(data);
      setOpen(data.length > 0);
      setLoading(false);
    }, 400);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (r: TmdbResult) => {
    const type: MediaType = r.media_type === 'tv' ? 'series' : 'movie';
    onSelect(r, type);
    setQuery(r.title || r.name || '');
    setOpen(false);
    setResults([]);
  };

  const year = (r: TmdbResult) => {
    const d = r.release_date || r.first_air_date || '';
    return d ? d.slice(0, 4) : '';
  };

  return (
    <div className="movie-search-wrap" ref={wrapRef}>
      <label className="form-label">Buscar filme ou série</label>
      <div className="movie-search-input-wrap">
        <input
          className="form-input"
          placeholder="Digite o nome para buscar na base do TMDB..."
          value={query}
          onChange={e => { setQuery(e.target.value); }}
          onFocus={() => results.length > 0 && setOpen(true)}
          autoComplete="off"
        />
        {loading && <span className="movie-search-spinner">⏳</span>}
        {query && !loading && (
          <button
            className="movie-search-clear"
            onClick={() => { setQuery(''); setResults([]); setOpen(false); }}
            type="button"
          >✕</button>
        )}
      </div>

      {open && (
        <div className="movie-dropdown">
          {results.map(r => (
            <button
              key={r.id}
              className="movie-dropdown-item"
              onClick={() => handleSelect(r)}
              type="button"
            >
              <div className="movie-dropdown-poster">
                {r.poster_path
                  ? <img src={`${POSTER_BASE}${r.poster_path}`} alt={r.title || r.name} />
                  : <div className="movie-dropdown-noposter">🎬</div>
                }
              </div>
              <div className="movie-dropdown-info">
                <span className="movie-dropdown-title">{r.title || r.name}</span>
                <div className="movie-dropdown-meta">
                  <span className={`movie-dropdown-type ${r.media_type === 'tv' ? 'type-series' : 'type-movie'}`}>
                    {r.media_type === 'tv' ? '📺 Série' : '🎬 Filme'}
                  </span>
                  {year(r) && <span className="movie-dropdown-year">{year(r)}</span>}
                  {r.genre_ids.length > 0 && (
                    <span className="movie-dropdown-genre">{getGenreName(r.genre_ids)}</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
