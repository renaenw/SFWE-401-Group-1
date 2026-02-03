import './App.css';
import { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import StudentPage from './pages/StudentPage';
import AdvisorPage from './pages/AdvisorPage';
import ScholarShipProvider from './pages/ScholarShipProvider';


function App() {
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const handleRoleChange = (event) => {
    const selected = event.target.value;
    setRole(selected);

      if (selected == 'Student') navigate ('/student');
      else if (selected == 'Advisor') navigate ('/advisor');
      else if (selected == 'Scholarship Provider') navigate ('/provider');
      else navigate ('/');
  };







  return (
    <div className="App">
      {/* Header / Top Bar */}
      <header className="top-bar">
        <h1 className="title">Scholar Cats</h1>



        {/* Role dropdown */}
        <select
          className="role-select"
          value={role}
          onChange={handleRoleChange}
        >
          <option value="" disabled>
            Select Role
          </option>
          <option value="Student">Student</option>
          <option value="Advisor">Advisor</option>
          <option value="Scholarship Provider">Scholarship Provider</option>
        </select>
      </header>

      {/* Page content */}
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/student" element={<StudentPage />} />
          <Route path="/advisor" element={<AdvisorPage />} />
          <Route path="/provider" element={<ScholarShipProvider />} />

        </Routes>
      </main>


<footer className='footer'>
<small>Scholarship Tracker</small>
</footer>
    </div>
  );
}

export default App;
