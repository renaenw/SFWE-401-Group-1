import './styles/StudentPage.css';
import React, { useEffect, useState } from 'react';

function StudentPage(){
  const [searchQuery, setSearchQuery] = useState('');
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScholarships = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:8080/api/scholarships');
        if (!res.ok) throw new Error('Failed to load scholarships');
        const data = await res.json();
        const normalized = data.map((s, idx) => ({
          id: s.id || idx+1,
          name: s.name || '',
          status: (s.status || '').toLowerCase(),
          amount: s.amount || '',
          deadline: s.deadline || '',
          major: s.major || '',
          gpa: s.gpa || '',
          year: s.year || ''
        }));
        setScholarships(normalized);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchScholarships();
  }, []);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleSearchSubmit = (e) => e.preventDefault();

  const filteredScholarships = scholarships.filter(scholarship =>
    scholarship.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (scholarship.amount || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (scholarship.deadline || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (scholarship.status || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (scholarship.major || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="App">
      <main className='content'>
        <p><strong>Welcome to Scholar Cats!</strong></p>
        <p>Explore Scholarships tailored to your goals and achievements</p>

        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            id="search-input"
            placeholder='Search Scholarships...'
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button type="submit">Search</button>
        </form>

        {loading && <div style={{marginTop: '8px'}}>Loading scholarships…</div>}
        {error && <div style={{marginTop: '8px', color: 'red'}}>Error: {error}</div>}

        <div className="Top-Horziontal-Boxes">
          <div className="Top-Box">Total Available
            <p>{scholarships.length}</p>
          </div>
          <div className="Top-Box">Your Applications
            <p>0</p>
          </div>
          <div className="Top-Box">Match Rate
            <p>75% (insert java output here)</p>
          </div>
        </div>

        <p>Available Scholarships {searchQuery && `(${filteredScholarships.length} results)`}</p>

        <div className="Scholarship-list">
          {filteredScholarships.length > 0 ? (
            filteredScholarships.map(scholarship => (
              <div className="Scholarship" key={scholarship.id}>
                <p>{scholarship.name}</p>
                {scholarship.status && (
                  <span className={`status-badge ${scholarship.status}`}>
                    {scholarship.status === 'open' ? 'Open' : 
                     scholarship.status === 'closed' ? 'Closed' : 
                     'Closing Soon'}
                  </span>
                )}
                <button className='scholar-ship-button'>View</button>
                <div className='money-info'>{scholarship.amount}</div>
                <div className='date-info'>{scholarship.deadline}</div>
              </div>
            ))
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              color: '#666',
              fontSize: '1.1rem'
            }}>
              No scholarships found matching "{searchQuery}"
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default StudentPage;