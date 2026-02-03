import './styles/StudentPage.css';
import React, { useEffect, useState, useRef } from 'react';

function StudentPage(){
  const [searchQuery, setSearchQuery] = useState('');
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [userPersonalStatement, setUserPersonalStatement] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [submitMessage, setSubmitMessage] = useState('');
  const [profileDraft, setProfileDraft] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [profileMessage, setProfileMessage] = useState('');
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  // sync profileDraft when selected student changes
  useEffect(() => {
    if (!selectedStudent) { setProfileDraft(null); setResumeFile(null); return; }
    setProfileDraft({
      id: selectedStudent.id,
      firstName: selectedStudent.firstName || '',
      lastName: selectedStudent.lastName || '',
      major: selectedStudent.major || '',
      gpa: selectedStudent.gpa || '',
      year: selectedStudent.year || ''
    });
    setResumeFile(null);
    setProfileMessage('');
  }, [selectedStudentId]);

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
          year: s.year || '',
          ps: s.ps || '',
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
    
    
    // fetch students as well
    const fetchStudents = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/students');
        if (!res.ok) throw new Error('Failed to load students');
        const data = await res.json();
        // normalize: give each an id
        const normalized = data.map((s, idx) => ({
          id: s.id || idx+1,
          firstName: s.firstName || s.first || '',
          lastName: s.lastName || s.last || s.lastName || '',
          major: s.major || '',
          gpa: s.gpa || '' ,
          year: s.year || '',
          // student.csv 'score' column may be named score, match, or matchScore
          score: s.score ?? s.match ?? s.matchScore ?? s.scoreValue ?? '',
          // preserve any matchScore array from backend (try several possible property names)
          matchScore: s.matchScore ?? s.matchScores ?? s.match_scores ?? s.match_list ?? []
        }));
        setStudents(normalized);
        if(normalized.length>0) setSelectedStudentId(normalized[0].id);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStudents();
  }, []);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleSearchSubmit = (e) => e.preventDefault();
  const handleProfileChange = (field, value) => setProfileDraft(d => ({...d, [field]: value}));
  const handleResumeChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) setResumeFile({name: f.name, size: f.size});
  };
  const saveProfile = () => {
    if (!profileDraft) return;
    setStudents(prev => prev.map(s => (String(s.id) === String(profileDraft.id) ? {...s, major: profileDraft.major, gpa: profileDraft.gpa, year: profileDraft.year} : s)));
    setProfileMessage('Profile saved locally.');
    // keep resumeFile in UI only (no upload)
    setTimeout(()=>setProfileMessage(''), 3000);
    setProfileModalOpen(false);
  };
  const cancelProfile = () => {
    if (!selectedStudent) return;
    setProfileDraft({
      id: selectedStudent.id,
      firstName: selectedStudent.firstName || '',
      lastName: selectedStudent.lastName || '',
      major: selectedStudent.major || '',
      gpa: selectedStudent.gpa || '',
      year: selectedStudent.year || ''
    });
    setResumeFile(null);
    setProfileMessage('Edits canceled');
    setTimeout(()=>setProfileMessage(''), 1600);
    setProfileModalOpen(false);
  };
  // selected student object
  const selectedStudent = students.find(s => String(s.id) === String(selectedStudentId));

  
  const matchRate = selectedStudent && selectedStudent.score !== '' && selectedStudent.score != null
    ? (isNaN(parseFloat(selectedStudent.score)) ? String(selectedStudent.score) : Math.round(parseFloat(selectedStudent.score)))
    : null;

  const matchedScholarships = React.useMemo(() => {
    if (!selectedStudent || !Array.isArray(selectedStudent.matchScore) || selectedStudent.matchScore.length === 0) {
      // No match data: treat every scholarship as potentially matched (score 0)
      return scholarships.map((sch, idx) => ({ ...sch, __matchScore: 0, __origIndex: idx }));
    }

    const ms = selectedStudent.matchScore;
    return scholarships
      .map((sch, idx) => {
        let score = 0;
        if (ms.length > idx && ms[idx] != null) score = Number(ms[idx]);
        else if (!isNaN(Number(sch.id)) && ms.length > Number(sch.id)) score = Number(ms[Number(sch.id)]);
        if (isNaN(score)) score = 0;
        return { ...sch, __matchScore: score, __origIndex: idx };
      })
      .filter(s => Number(s.__matchScore) > 0 || (Array.isArray(selectedStudent.matchScore) && selectedStudent.matchScore.length === 0));
  }, [scholarships, selectedStudent]);

  const displayScholarships = React.useMemo(() => {
    const q = (searchQuery || '').trim().toLowerCase();
    const matches = (val) => (val || '').toString().toLowerCase().includes(q);
    const base = matchedScholarships;
    const searched = q
      ? base.filter(sch =>
          matches(sch.name) ||
          matches(sch.amount) ||
          matches(sch.deadline) ||
          matches(sch.status) ||
          matches(sch.major) ||
          matches(sch.gpa) ||
          matches(sch.year) ||
          matches(sch.ps)
        )
      : base;
    // sort by match score descending when available
    return searched.slice().sort((a, b) => Number(b.__matchScore || 0) - Number(a.__matchScore || 0));
  }, [matchedScholarships, searchQuery]);

   
  // If a scholarship is selected, show a simple detail page and stop rendering the list
  if (selectedScholarship) {
    return (
      <div className="App">
        <main className='content'>
          <button className='scholar-ship-button' onClick={() => setSelectedScholarship(null)} style={{marginBottom: '12px'}}>←</button>
          <div className='Scholarship-Detail'>
            <h2>{selectedScholarship.name}</h2>
            <p><strong>Amount:</strong> {selectedScholarship.amount || '—'}</p>
            <p><strong>Deadline:</strong> {selectedScholarship.deadline || '—'}</p>
            <p><strong>Major requirement:</strong> {selectedScholarship.major || '—'}</p>
            <p><strong>GPA requirement:</strong> {selectedScholarship.gpa || '—'}</p>
            <hr />
            <p><strong>Personal statement / question</strong></p>
            {String(selectedScholarship.ps).trim().toLowerCase() === 'yes' ? (
              <div>
                <textarea
                  className="personal-statement-box"
                  placeholder="Enter your personal statement here..."
                  value={userPersonalStatement}
                  onChange={(e) => setUserPersonalStatement(e.target.value)}
                  rows={6}
                  style={{ width: "100%", padding: "10px" }}
                />
                <input ref={fileInputRef} type="file" style={{display:'none'}} onChange={(e)=>{
                  const f = e.target.files && e.target.files[0];
                  if(f) setUploadedFile({name: f.name, size: f.size});
                }} />
                <div
                  className="upload-dropzone"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  onDragOver={(e)=>{ e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = 'copy'; e.currentTarget.classList.add('dragover'); }}
                  onDragLeave={(e)=>{ e.currentTarget.classList.remove('dragover'); }}
                  onDrop={(e)=>{ e.preventDefault(); e.stopPropagation(); e.currentTarget.classList.remove('dragover'); const f = e.dataTransfer.files && e.dataTransfer.files[0]; if(f) setUploadedFile({name: f.name, size: f.size}); }}
                >
                  <div style={{pointerEvents:'none'}}>Drop file here or click to choose</div>
                </div>
                {uploadedFile && <div className='file-name' style={{marginTop:8}}>{uploadedFile.name}</div>}
              </div>
            ) : (
              <p style={{ whiteSpace: "pre-wrap" }}>
                {'No personal statement question provided.'}
              </p>
            )}

            <div className='detail-footer'>
              <div style={{display:'flex', alignItems:'center', gap:12}}>
                {/* left slot can show status or uploaded file */}
                {String(selectedScholarship.ps).trim().toLowerCase() === 'yes' && uploadedFile && (
                  <div className='file-name'>{uploadedFile.name}</div>
                )}
              </div>
              <div>
                {/* submit button moved to fixed position on the left side of the screen */}
              </div>
            </div>
            {/* fixed submit button on bottom-left while detail is open */}
            <button className='submit-fixed-left' onClick={() => {
              const needsPs = String(selectedScholarship.ps || '').trim().toLowerCase() === 'yes';
              if(needsPs && !userPersonalStatement && !uploadedFile){
                setSubmitMessage('Please provide a personal statement or upload a document before submitting.');
                return;
              }
              // mark scholarship as submitted so user cannot view it again
              const idToMark = selectedScholarship.id;
              setScholarships(prev => prev.map(s => (String(s.id) === String(idToMark) ? {...s, status: 'submitted'} : s)));
              setApplicationsCount(c => c + 1);
              setSubmitMessage('Application submitted.');
              setUserPersonalStatement('');
              setUploadedFile(null);
              // close detail view after submit
              setSelectedScholarship(null);
            }}>Submit Application</button>
            {submitMessage && <div style={{marginTop:8, color:'#064e3b'}}>{submitMessage}</div>}
          </div>
        </main>
      </div>
    );
  }

  // Help button for students
  return (
    <div className="App">
      {/* Help / chat floating button and panel */}
      <button className="help-button" title="Help" onClick={() => setChatOpen(o => !o)}>?</button>
      {chatOpen && (
        <div className="chat-panel">
          <div className="chat-header">Help Chat</div>
          <div className="chat-messages">
            {chatMessages.length === 0 && <div style={{color:'#666'}}>Hi — ask me about scholarships or how to apply.</div>}
            {chatMessages.map((m, i) => (
              <div key={i} className={`chat-message ${m.role}`}>
                <div className="bubble">{m.text}</div>
              </div>
            ))}
          </div>
          <div className="chat-input-row">
            <input value={chatInput} onChange={e=>setChatInput(e.target.value)} placeholder="Type a question..." />
            <button onClick={() => {
              if(!chatInput.trim()) return;
              const userMsg = {role: 'user', text: chatInput.trim()};
              setChatMessages(prev => [...prev, userMsg]);
              setChatInput('');
              //automatic reponse
              setTimeout(() => {
                let reply = "This is a demo response. More help topics coming soon!";
                setChatMessages(prev => [...prev, {role:'assistant', text: reply}]);
              }, 400);
            }}>Send</button>
          </div>
        </div>
      )}
      <main className='content'>
        {/* Edit Profile button*/}
        <div style={{position: 'absolute', top: '55px', left: '250px', zIndex: 900, fontsize: '14px'}}>
          <button className='scholar-ship-button edit-profile-button' onClick={() => setProfileModalOpen(true)} style={{padding: '0.5rem 1px', whiteSpace: 'nowrap', fontSize: '9px'}}>
            Edit Profile
          </button>
        </div>

        <p><strong>Welcome to Scholar Cats!</strong></p>
        <p>Explore Scholarships tailored to your goals and achievements</p>
        
        {/* Student selector */}
        <div style={{margin: '12px 0', display:'flex', alignItems:'center', gap:12}}>
          <label htmlFor="student-select" style={{marginRight:8}}>Viewing as:</label>
          <select id="student-select" value={selectedStudentId} onChange={e => setSelectedStudentId(e.target.value)}>
            {students.length === 0 && <option value="">(No students)</option>}
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.firstName} {s.lastName} — {s.major} (GPA: {s.gpa})</option>
            ))}
          </select>
          {profileDraft && <div style={{color:'#444'}}>Viewing as: {profileDraft.firstName} {profileDraft.lastName}</div>}
        </div>

        {profileModalOpen && profileDraft && (
          <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100000}}>
            <div style={{width:720, maxWidth:'96%', background:'#fff', borderRadius:10, padding:20}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
                <h3 style={{margin:0}}>Edit Your Profile</h3>
                <button onClick={() => setProfileModalOpen(false)} style={{border:'none', background:'transparent', fontSize:18, cursor:'pointer'}}>✕</button>
              </div>
              <div style={{display:'flex', gap:12, flexWrap:'wrap'}}>
                <div style={{flex:'1 1 220px'}}>
                  <label style={{fontSize:12}}>Major</label>
                  <input value={profileDraft.major} onChange={e=>handleProfileChange('major', e.target.value)} style={{width:'100%', padding:8, borderRadius:6, border:'1px solid #ddd'}} />
                </div>
                <div style={{width:120}}>
                  <label style={{fontSize:12}}>GPA</label>
                  <input value={profileDraft.gpa} onChange={e=>handleProfileChange('gpa', e.target.value)} style={{width:'100%', padding:8, borderRadius:6, border:'1px solid #ddd'}} />
                </div>
                <div style={{width:160}}>
                  <label style={{fontSize:12}}>Year</label>
                  <input value={profileDraft.year} onChange={e=>handleProfileChange('year', e.target.value)} style={{width:'100%', padding:8, borderRadius:6, border:'1px solid #ddd'}} />
                </div>
                <div style={{flex:'0 0 220px'}}>
                  <label style={{fontSize:12}}>Resume (optional)</label>
                  <div style={{display:'flex', gap:8, alignItems:'center'}}>
                    <input type="file" onChange={handleResumeChange} />
                  </div>
                  {resumeFile && <div style={{fontSize:12, marginTop:6}}>{resumeFile.name}</div>}
                </div>
              </div>
              <div style={{marginTop:12, display:'flex', gap:8, justifyContent:'flex-end', alignItems:'center'}}>
                {profileMessage && <div style={{marginRight:'auto', color:'#064e3b'}}>{profileMessage}</div>}
                <button className='scholar-ship-button' onClick={saveProfile}>Save</button>
                <button className='scholar-ship-button' style={{background:'#6b7280', fontSize: '12px'}} onClick={cancelProfile}>Cancel</button>
              </div>
            </div>
          </div>
        )}

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
            <p>{displayScholarships.length}</p>
          </div>
          <div className="Top-Box">Your Applications
            <p>{applicationsCount}</p>
          </div>
          <div className="Top-Box">Match Rate
            <p>{selectedStudent ? `${matchRate}%` : '—'}</p>
          </div>
        </div>

        <p>Available Scholarships {searchQuery && `(${displayScholarships.length} results)`}</p>

            <div className="Scholarship-list">
          {displayScholarships.length > 0 ? (
            displayScholarships.map(scholarship => (
              <div className="Scholarship" key={scholarship.id}>
                <p>{scholarship.name}</p>
                {scholarship.status && (
                  <span className={`status-badge ${scholarship.status}`}>
                    {scholarship.status === 'open' ? 'Open' : 
                     scholarship.status === 'closed' ? 'Closed' : 
                     scholarship.status === 'soon' ? 'Closing Soon' : 
                     scholarship.status === 'submitted' ? 'Submitted' : 
                     scholarship.status}
                  </span>
                )}
                {scholarship.status === 'submitted' ? (
                  <button className='scholar-ship-button' disabled style={{opacity:0.7, cursor:'default'}}>View</button>
                ) : (
                  <button onClick={() => setSelectedScholarship(scholarship)} className='scholar-ship-button'>View</button>
                )}
                <div className='money-info'>{scholarship.amount}</div>
                <div className='date-info'>{scholarship.deadline}</div>
                {scholarship.__matchScore != null && (
                  <div style={{fontSize:12, color:'#444', marginTop:6}}>Match: {scholarship.__matchScore}</div>
                )}
              </div>
            ))
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              color: '#666',
              fontSize: '1.1rem'
            }}>
              No scholarships available
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default StudentPage;