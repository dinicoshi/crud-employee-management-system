const apiUrl = 'http://localhost:3000/api/employees'; // Change if your backend runs on another port

// Load employees when the page loads
window.onload = getEmployees;

// Get and display all employees
function getEmployees() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const employeeTable = document.getElementById('employeeTable');
      employeeTable.innerHTML = '';

      data.employees.forEach(emp => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${emp.name}</td>
          <td>${emp.email}</td>
          <td>${emp.department}</td>
          <td>${emp.position}</td>
          <td>
            <button onclick="deleteEmployee('${emp._id}')">Delete</button>
          </td>
        `;
        employeeTable.appendChild(row);
      });
    })
    .catch(error => console.error('Error fetching employees:', error));
}

// Save a new employee
function saveEmployee() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const department = document.getElementById('department').value;
  const position = document.getElementById('position').value;

  // Validation
  if (!name || !email || !department || !position) {
    alert("Please fill in all fields");
    return;
  }

  fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, department, position })
  })
    .then(response => response.json())
    .then(data => {
      // Clear form inputs
      document.getElementById('name').value = '';
      document.getElementById('email').value = '';
      document.getElementById('department').value = '';
      document.getElementById('position').value = '';

      // Refresh employee list
      getEmployees();
    })
    .catch(error => console.error('Error saving employee:', error));
}

// Delete an employee
function deleteEmployee(id) {
  if (!confirm('Are you sure you want to delete this employee?')) return;

  fetch(`${apiUrl}/${id}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => {
      // Refresh employee list
      getEmployees();
    })
    .catch(error => console.error('Error deleting employee:', error));
}

// Attach form submit handler
document.getElementById('employee-form').addEventListener('submit', function (e) {
  e.preventDefault(); // Prevent form refresh
  saveEmployee();
});
