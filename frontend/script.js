const apiUrl = 'http://localhost:3000/api/employees';

let employees = [];
let selectedEmployeeIds = new Set();
let employeeToDeleteId = null;

const employeeTableBody = document.getElementById('employeeTable');
const addEmployeeForm = document.getElementById('employee-form');
const addNameInput = document.getElementById('add-name');
const addEmailInput = document.getElementById('add-email');
const addDepartmentInput = document.getElementById('add-department');
const addPositionInput = document.getElementById('add-position');

const filterNameInput = document.getElementById('filter-name');
const filterDepartmentInput = document.getElementById('filter-department');
const bulkEditBtn = document.getElementById('bulk-edit-btn');
const bulkDeleteBtn = document.getElementById('bulk-delete-btn');
const selectAllCheckbox = document.getElementById('select-all-checkbox');

const successModal = document.getElementById('success-modal');
const successMessage = document.getElementById('success-message');

const editEmployeeModal = document.getElementById('edit-employee-modal');
const editEmployeeForm = document.getElementById('edit-employee-form');
const editEmployeeIdInput = document.getElementById('edit-employee-id');
const editNameInput = document.getElementById('edit-name');
const editEmailInput = document.getElementById('edit-email');
const editDepartmentInput = document.getElementById('edit-department');
const editPositionInput = document.getElementById('edit-position');

const confirmDeleteModal = document.getElementById('confirm-delete-modal');
const confirmDeleteMessage = document.getElementById('confirm-delete-message');
const confirmDeleteActionBtn = document.getElementById('confirm-delete-btn');

const bulkEditModal = document.getElementById('bulk-edit-modal');
const bulkEditSelectedCount = document.getElementById('bulk-edit-selected-count');
const bulkDepartmentInput = document.getElementById('bulk-department');
const bulkPositionInput = document.getElementById('bulk-position');
const applyBulkEditBtn = document.getElementById('apply-bulk-edit-btn');

const confirmBulkEditModal = document.getElementById('confirm-bulk-edit-modal');
const confirmBulkEditMessage = document.getElementById('confirm-bulk-edit-message');
const confirmBulkEditActionBtn = document.getElementById('confirm-bulk-edit-action-btn');

const confirmBulkDeleteModal = document.getElementById('confirm-bulk-delete-modal');
const confirmBulkDeleteMessage = document.getElementById('confirm-bulk-delete-message');
const confirmBulkDeleteActionBtn = document.getElementById('confirm-bulk-delete-action-btn');

function showModal(modalElement, message = '') {
    if (message) {
        if (modalElement === successModal) successMessage.textContent = message;
        if (modalElement === confirmDeleteModal) confirmDeleteMessage.textContent = message;
        if (modalElement === confirmBulkEditModal) confirmBulkEditMessage.textContent = message;
        if (modalElement === confirmBulkDeleteModal) confirmBulkDeleteMessage.textContent = message;
    }
    modalElement.classList.add('active');
}

function closeModal(modalElementId) {
    document.getElementById(modalElementId).classList.remove('active');
}

async function getEmployees() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Failed to fetch employees. Server error.');
        }
        const data = await response.json();
        employees = data.employees || [];
        renderEmployees();
    } catch (error) {
        console.error('Error fetching employees:', error.message);
        alert('Error fetching employees: ' + error.message);
    }
}

function renderEmployees() {
    employeeTableBody.innerHTML = '';
    const nameFilter = filterNameInput.value.toLowerCase();
    const departmentFilter = filterDepartmentInput.value.toLowerCase();

    const filteredEmployees = employees.filter(emp => {
        const matchesName = emp.name.toLowerCase().includes(nameFilter);
        const matchesDepartment = (emp.department || '').toLowerCase().includes(departmentFilter);
        return matchesName && matchesDepartment;
    });

    if (filteredEmployees.length > 0) {
        filteredEmployees.forEach(emp => {
            const row = document.createElement('tr');
            const isSelected = selectedEmployeeIds.has(emp._id);
            row.innerHTML = `
                <td><input type="checkbox" class="employee-checkbox" data-id="${emp._id}" ${isSelected ? 'checked' : ''}></td>
                <td>${emp._id}</td>
                <td>${emp.name}</td>
                <td>${emp.email}</td>
                <td>${emp.department || ''}</td>
                <td>${emp.position || ''}</td>
                <td class="actions">
                    <button class="btn btn-edit" onclick="openEditEmployeeModal('${emp._id}')">Edit</button>
                    <button class="btn btn-delete" onclick="prepareDeleteEmployee('${emp._id}', '${emp.name}')">Delete</button>
                </td>
            `;
            employeeTableBody.appendChild(row);
        });
    } else {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="7">No employees found.</td>`;
        employeeTableBody.appendChild(row);
    }
    updateBulkActionButtons();
    updateSelectAllCheckbox();
}

async function saveNewEmployee(event) {
    event.preventDefault();

    const name = addNameInput.value.trim();
    const email = addEmailInput.value.trim();
    const department = addDepartmentInput.value.trim();
    const position = addPositionInput.value.trim();

    if (!name || !email) {
        alert("Name and Email are required.");
        return;
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, department, position })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Failed to add employee. Server error.');
        }

        const data = await response.json();
        showModal(successModal, data.message || 'Employee added successfully!');

        addNameInput.value = '';
        addEmailInput.value = '';
        addDepartmentInput.value = '';
        addPositionInput.value = '';

        getEmployees();
    } catch (error) {
        console.error('Error saving employee:', error.message);
        alert('Failed to save employee: ' + error.message);
    }
}

function openEditEmployeeModal(id) {
    const employee = employees.find(emp => emp._id === id);
    if (employee) {
        editEmployeeIdInput.value = employee._id;
        editNameInput.value = employee.name;
        editEmailInput.value = employee.email;
        editDepartmentInput.value = employee.department || '';
        editPositionInput.value = employee.position || '';
        showModal(editEmployeeModal);
    } else {
        alert('Employee not found!');
    }
}

async function updateEmployee(event) {
    event.preventDefault();

    const id = editEmployeeIdInput.value;
    const name = editNameInput.value.trim();
    const email = editEmailInput.value.trim();
    const department = editDepartmentInput.value.trim();
    const position = editPositionInput.value.trim();

    if (!name || !email) {
        alert("Name and Email are required.");
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, department, position })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Failed to update employee. Server error.');
        }

        const data = await response.json();
        closeModal('edit-employee-modal');
        showModal(successModal, data.message || 'Employee updated successfully!');
        getEmployees();
    } catch (error) {
        console.error('Error updating employee:', error.message);
        alert('Failed to update employee: ' + error.message);
    }
}

function prepareDeleteEmployee(id, name) {
    employeeToDeleteId = id;
    showModal(confirmDeleteModal, `Are you sure you want to delete ${name}?`);
}

async function executeDeleteEmployee() {
    if (!employeeToDeleteId) return;

    try {
        const response = await fetch(`${apiUrl}/${employeeToDeleteId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Failed to delete employee. Server error.');
        }

        const data = await response.json();
        closeModal('confirm-delete-modal');
        showModal(successModal, data.message || 'Employee deleted successfully!');
        employeeToDeleteId = null;
        getEmployees();
    } catch (error) {
        console.error('Error deleting employee:', error.message);
        alert('Failed to delete employee: ' + error.message);
    }
}

function cancelDelete() {
    closeModal('confirm-delete-modal');
    employeeToDeleteId = null;
}

function updateBulkActionButtons() {
    const selectedCount = selectedEmployeeIds.size;
    bulkEditBtn.disabled = selectedCount === 0;
    bulkDeleteBtn.disabled = selectedCount === 0;
    bulkEditSelectedCount.textContent = `Apply changes to ${selectedCount} selected employees.`;
    confirmBulkEditMessage.textContent = `Are you sure you want to update ${selectedCount} employees?`;
    confirmBulkDeleteMessage.textContent = `Are you sure you want to delete ${selectedCount} selected employees?`;
}

employeeTableBody.addEventListener('change', (event) => {
    if (event.target.classList.contains('employee-checkbox')) {
        const employeeId = event.target.dataset.id;
        if (event.target.checked) {
            selectedEmployeeIds.add(employeeId);
        } else {
            selectedEmployeeIds.delete(employeeId);
        }
        updateBulkActionButtons();
        updateSelectAllCheckbox();
    }
});

selectAllCheckbox.addEventListener('change', (event) => {
    const isChecked = event.target.checked;
    document.querySelectorAll('.employee-checkbox').forEach(checkbox => {
        checkbox.checked = isChecked;
        const employeeId = checkbox.dataset.id;
        if (isChecked) {
            selectedEmployeeIds.add(employeeId);
        } else {
            selectedEmployeeIds.delete(employeeId);
        }
    });
    updateBulkActionButtons();
});

function updateSelectAllCheckbox() {
    const allCheckboxes = document.querySelectorAll('.employee-checkbox');
    const checkedCheckboxes = document.querySelectorAll('.employee-checkbox:checked');
    if (allCheckboxes.length > 0 && allCheckboxes.length === checkedCheckboxes.length) {
        selectAllCheckbox.checked = true;
    } else {
        selectAllCheckbox.checked = false;
    }
}

bulkEditBtn.addEventListener('click', () => {
    if (selectedEmployeeIds.size > 0) {
        bulkDepartmentInput.value = '';
        bulkPositionInput.value = '';
        showModal(bulkEditModal);
    }
});

applyBulkEditBtn.addEventListener('click', () => {
    if (selectedEmployeeIds.size > 0) {
        showModal(confirmBulkEditModal);
    }
});

confirmBulkEditActionBtn.addEventListener('click', async () => {
    const newDepartment = bulkDepartmentInput.value.trim();
    const newPosition = bulkPositionInput.value.trim();

    if (!newDepartment && !newPosition) {
        alert("Please enter a new department or position to apply bulk changes.");
        return;
    }

    const updates = {};
    if (newDepartment) updates.department = newDepartment;
    if (newPosition) updates.position = newPosition;

    try {
        const response = await fetch(`${apiUrl}/bulk-update`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ids: Array.from(selectedEmployeeIds),
                updates: updates
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Failed to bulk update employees. Server error.');
        }

        const data = await response.json();
        closeModal('confirm-bulk-edit-modal');
        closeModal('bulk-edit-modal');
        showModal(successModal, data.message || `${selectedEmployeeIds.size} employees updated successfully!`);
        selectedEmployeeIds.clear();
        getEmployees();
    } catch (error) {
        console.error('Error bulk updating employees:', error.message);
        alert('Failed to bulk update employees: ' + error.message);
    }
});

bulkDeleteBtn.addEventListener('click', () => {
    if (selectedEmployeeIds.size > 0) {
        showModal(confirmBulkDeleteModal);
    }
});

confirmBulkDeleteActionBtn.addEventListener('click', async () => {
    try {
        const response = await fetch(`${apiUrl}/bulk-delete`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: Array.from(selectedEmployeeIds) })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Failed to bulk delete employees. Server error.');
        }

        const data = await response.json();
        closeModal('confirm-bulk-delete-modal');
        showModal(successModal, data.message || `${selectedEmployeeIds.size} employees deleted successfully!`);
        selectedEmployeeIds.clear();
        getEmployees();
    } catch (error) {
        console.error('Error bulk deleting employees:', error.message);
        alert('Failed to bulk delete employees: ' + error.message);
    }
});

window.onload = getEmployees;

addEmployeeForm.addEventListener('submit', saveNewEmployee);
editEmployeeForm.addEventListener('submit', updateEmployee);
confirmDeleteActionBtn.addEventListener('click', executeDeleteEmployee);

filterNameInput.addEventListener('input', renderEmployees);
filterDepartmentInput.addEventListener('input', renderEmployees);

document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal.id);
        }
    });
});
