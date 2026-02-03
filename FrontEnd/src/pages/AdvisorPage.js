import React, {useEffect, useState} from "react";
import './styles/AdvisorPage.css';

function AdvisorPage() {
    const [role, setRole] = useState('');
    const [notificationText, setNotificationText] = useState('');
    const [toasts, setToasts] = useState([]);

    const[students, setStudents] = useState([]);
    const [studentsLoading, setStudentsLoading] = useState(false); 
    const [studentsError, setStudentsError] = useState(null);

    
      const handleRoleChange = (event) => {
        const selected = event.target.value;
        setRole(selected);
      };

                const sendNotification = () => {
                        const text = notificationText && notificationText.trim();
                        if (!text) return;
                        const id = Date.now();
                        setToasts((t) => [...t, { id, text }]);
                        setNotificationText('');
                        // remove after 3 seconds
                        setTimeout(() => {
                                setToasts((t) => t.filter((x) => x.id !== id));
                        }, 2000);
                };



    useEffect(() => {
        const fetchStudents = async () => {
            try {
            setStudentsLoading(true);
            setStudentsError(null);

            const res = await fetch('http://localhost:8080/api/students');
            if (!res.ok) {
                throw new Error('Failed to load students');
            }

        const data = await res.json();

        const nomalized = data.map((s, idx) => ({
            id: s.id || idx + 1,
            firstName: s.firstName || s.first || '',
            lastName: s.lastName || s.last || s.lastName || '',
            email :s.email || s.mail || '',
            major: s.major || '',
            gpa: s.gpa || '' ,
            year: s.year || '',
            scholarshipsAwarded: s.scholarshipsAwarded || s.awarded || ''
        }));
        setStudents(nomalized);
    } catch (err) {
        console.error(err);
        setStudentsError(err.message);
    } finally {
        setStudentsLoading(false);
    }
};
        fetchStudents();
    }, []);
   
    
    return(

   
<main className="advisor-main">

        {/* Toast container */}
        <div style={{position: 'fixed', right: 16, top: 16, zIndex: 9999}}>
            {toasts.map((toast) => (
                <div key={toast.id} style={{
                    marginBottom: 8,
                    background: 'rgba(2,6,23,0.95)',
                    color: 'white',
                    padding: '10px 14px',
                    borderRadius: 8,
                    boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
                    minWidth: 200,
                    maxWidth: 360,
                    fontSize: 14
                }}>
                    {toast.text}
                </div>
            ))}
        </div>

<section className="card-account-request">
    <h2>Account Approval Requests</h2>
    <div className="card-subtitle">Review pending account and approve or deny them
    </div>

    <table className="table-request-table">
        <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Account Type</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>John Doe</td>
                <td>student</td>
                <td>jdoe@arizona.edu</td>
                <td>11-15-2025</td>
                <td className="Scholarship-decision">
                    <button className="button-approve">Approve</button>
                    <button className="button-deny">Deny</button>
                </td>
            </tr>    
        </tbody>
    </table>

    <section className="scholarship-reports">
        <h2>ScholarShip Reports</h2>
        <div className="card-subtitle">View summary information about scholarship and application.</div>

        <div className="report-filters">
            <div className="filter-field">
                  <p>Category</p>
 <select
          className="category-select"
          value={role}
          onChange={handleRoleChange}
        >
          <option value="" disabled>
            Field of Study
          </option>
          <option value="Engineering">Engineering</option>
          <option value="Biomedical Engineering">Biomedical Engineering</option>
          <option value="Software Engineering">Software Engineering</option>
          <option value="Electical Engineering">Electical Engineering</option>
          <option value="Systems Engineering">Systems Engineering</option>
        </select>    
            </div>
        </div>

        <div className="filter-field">
            <p>Minimum Gpa</p>
            <input type="number" min="0" max="4" step="0.5" placeholder="e.g 3.5"/>
    

        <button className = "button-generate-report">Generate Report</button>
        </div>

        <table className="scholarship-table">
        <thead>
            <tr>
                <th>Scholarship Name</th>
                <th>Field</th>
                <th>Gpa required</th>
                <th>Deadline</th>
                <th>Number of application</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Stem excellence ScholarShip</td>
                <td>STEM</td>
                <td>3.5</td>
                <td>11-15-2025</td>
                <td>25</td>
            </tr>
        </tbody>
        </table>
            <div className = "student-list">
            <p>List of all students and Information</p>

            <table className="student-table">
        <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Gpa</th>
                <th>Field of Study</th>
                <th>ScholarShip Awarded</th>
            </tr>
        </thead>
        <tbody>
            {studentsLoading ? (
                <tr>
                    <td colSpan={5}>Loading students...</td>
                </tr>
            ) : studentsError ? (
                <tr>
                    <td colSpan={5}>Error: {studentsError}</td>
                </tr>
            ) : students.length === 0 ? (
                <tr>
                    <td colSpan={5}>No students found.</td>
                </tr>
            ) : (
                students.map((s) => (
                    <tr key={s.id}>
                        <td>{s.firstName} {s.lastName}</td>
                        <td>{s.email}</td>
                        <td>{s.gpa}</td>
                        <td>{s.major}</td>
                        <td>{s.scholarshipsAwarded}</td>
                    </tr>
                ))
            )}
        </tbody>
         </table>      
            </div>
        
    </section>
    </section>

    <section className="application-reports">
        <div className="card-subtle">Send an anncoument to remind users</div>
    <div className="notification-field">
        <textarea
          placeholder="Write your notification here..."
          value={notificationText}
          onChange={(e) => setNotificationText(e.target.value)}
          style={{width: '100%', minHeight: 80, padding: 8}}
        />
        <button type="button" className="button-send-notification" onClick={sendNotification}>Send Notification</button>
    </div> 




</section>




</main>



    );  
  
}
    export default AdvisorPage;
