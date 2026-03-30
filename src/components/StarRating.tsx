import { useState } from 'react';

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  readOnly?: boolean;
  size?: number;
}

export function StarRating({ value, onChange, readOnly = false, size = 22 }: StarRatingProps) {
  const [hover, setHover] = useState(0);

  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(s => (
        <button
          key={s}
          type="button"
          className="star-btn"
          style={{ fontSize: size, cursor: readOnly ? 'default' : 'pointer' }}
          onMouseEnter={() => !readOnly && setHover(s)}
          onMouseLeave={() => !readOnly && setHover(0)}
          onClick={() => !readOnly && onChange(s === value ? 0 : s)}
          disabled={readOnly}
        >
          {s <= (hover || value) ? '★' : '☆'}
        </button>
      ))}
    </div>
  );
}
