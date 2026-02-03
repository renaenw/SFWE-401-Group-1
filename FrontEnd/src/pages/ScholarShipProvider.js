import React, {useState} from "react";
import './styles/ScholarShipProvider.css';

function ScholarShipProvider() {

const [role, setRole] = useState('');
  

  const handleRoleChange = (event) => {
    const selected = event.target.value;
    setRole(selected);
  };

return(
<div className="ScholarShipProviderPage">

<main className ='content-area'>

<div className ='Basic-Information'>
    <h1>Basic Information</h1>
    <p>Lets start with some basic information about the Scholarship</p>
    <div className ='Contact-Informtation'>
   <p>Scholarship Name</p>
    <input type="text" placeholder='Scholarship Name'/>
    <p>Organization Name</p>
    <input type="text" placeholder='Organization Name'/>
    <p>Contact Email</p>
    <input type="email" placeholder='Contact Email'/>
    <p>Contact Phone Number</p>
    <input type="tel" inputmode ='numeeric' pattern= "[0-9]*" placeholder='Contact Phone Number'/>
    </div>
</div>
  <div className='ScholarShip-info'>
    <p>Award amount</p>
    <input type="number" placeholder='Write in the ammount the ScholarShip is for '/>
    
    <p>Category</p>
 <select
          className="category-select"
          value={role}
          onChange={handleRoleChange}
        >
          <option value="" disabled>
            Select Category
          </option>
          <option value="Engineering">Engineering</option>
          <option value="Biomedical Engineering">Biomedical Engineering</option>
          <option value="Software Engineering">Software Engineering</option>
          <option value="Electical Engineering">Electical Engineering</option>
          <option value="Systems Engineering">Systems Engineering</option>
        </select>    
        <p>Gpa</p>
    <input type="number" step="0.5" min="0.0" max="4.0" placeholder='Minimum Gpa Requirement'/>
        <p>Application Deadline</p>
    <input type="date" placeholder='Application Deadline'/>
    <p>Scholarship Description</p>
    <textarea placeholder='Write a brief description of the Scholarship and its requirements'></textarea>
    <button className='submit-button'>Submit Scholarship</button>

        </div>
    </main>
</div>
); 
}
    export default ScholarShipProvider;
