const apiUrl = 'http://localhost:3000/api/employees'; 

window.onload = getEmployees;

function getEmployees() {
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => {
          throw new Error(err.message || 'Failed to fetch employees. Server error.');
        });
      }
      return response.json();
    })
    .then(data => {
      const employeeTable = document.getElementById('employeeTable');
      employeeTable.innerHTML = '';

      if (data.employees && data.employees.length > 0) {
        data.employees.forEach(emp => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${emp.name}</td>
            <td>${emp.email}</td>
            <td>${emp.department || ''}</td> <td>${emp.position || ''}</td> <td>
              <button class="delete" onclick="deleteEmployee('${emp._id}')">Delete</button>
              </td>
          `;
          employeeTable.appendChild(row);
        });
      } else {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="5">No employees found.</td>`;
        employeeTable.appendChild(row);
      }
    })
    .catch(error => {
      console.error('Error fetching employees:', error.message);
      alert('Error fetching employees: ' + error.message);
    });
}

function saveEmployee() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const department = document.getElementById('department').value.trim();
  const position = document.getElementById('position').value.trim();

  if (!name || !email) {
    alert("Name and Email are required.");
    return;
  }

  fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, department, position })
  })
    .then(response => {
      if (!response.ok) { 
        return response.json().then(err => {
          throw new Error(err.message || 'Failed to save employee. Server error.');
        });
      }
      return response.json();
    })
    .then(data => {
      alert(data.message); 

      document.getElementById('name').value = '';
      document.getElementById('email').value = '';
      document.getElementById('department').value = '';
      document.getElementById('position').value = '';

      getEmployees();
    })
    .catch(error => {
      console.error('Error saving employee:', error.message);
      alert('Failed to save employee: ' + error.message);
    });
}

function deleteEmployee(id) {
  if (!confirm('Are you sure you want to delete this employee?')) {
    return;
  }

  fetch(`${apiUrl}/${id}`, {
    method: 'DELETE'
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => {
          throw new Error(err.message || 'Failed to delete employee. Server error.');
        });
      }
      return response.json();
    })
    .then(data => {
      alert(data.message);
      getEmployees();
    })
    .catch(error => {
      console.error('Error deleting employee:', error.message);
      alert('Failed to delete employee: ' + error.message);
    });
}

document.getElementById('employee-form').addEventListener('submit', function (e) {
  e.preventDefault();
  saveEmployee();
});