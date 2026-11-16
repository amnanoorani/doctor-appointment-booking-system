const API_BASE = 'api';

// Auth check
const adminUser = JSON.parse(localStorage.getItem('admin_user'));
if (!adminUser || adminUser.role !== 'admin') {
    window.location.href = 'admin_login.html';
}

document.getElementById('adminName').textContent = adminUser.name;

const adminLogout = () => {
    localStorage.removeItem('admin_user');
    window.location.href = 'admin_login.html';
};

// Load stats and data
const loadDashboard = async () => {
    await Promise.all([loadDoctors(), loadAppointments()]);
};

// --- DOCTORS ---
const loadDoctors = async () => {
    try {
        const res = await fetch(`${API_BASE}/doctors.php`);
        const data = await res.json();
        if (data.status === 'success') {
            renderDoctors(data.data);
        }
    } catch (e) {
        console.error('Failed to load doctors', e);
    }
};

const getInitials = (name) => {
    return name.replace('Dr. ', '').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

const renderDoctors = (doctors) => {
    const tbody = document.querySelector('#doctorsTable tbody');
    tbody.innerHTML = '';
    doctors.forEach(doc => {
        tbody.innerHTML += `
            <tr>
                <td>
                    <div class="doc-cell">
                        <div class="doc-avatar">${getInitials(doc.name)}</div>
                        <span>${doc.name}</span>
                    </div>
                </td>
                <td>${doc.specialization}</td>
                <td>${doc.experience} yrs</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteDoctor(${doc.id})">
                        <i class="ph ph-trash"></i> Remove
                    </button>
                </td>
            </tr>
        `;
    });
};

const deleteDoctor = async (id) => {
    if (!confirm('Are you sure you want to remove this doctor?')) return;
    try {
        const res = await fetch(`${API_BASE}/doctors.php`, {
            method: 'DELETE',
            body: JSON.stringify({ id })
        });
        const data = await res.json();
        if (data.status === 'success') {
            loadDoctors();
        } else {
            alert(data.message);
        }
    } catch (e) {
        alert('Failed to remove doctor');
    }
};

// Add Doctor Modal
document.getElementById('addDoctorBtn').addEventListener('click', () => {
    document.getElementById('addDoctorModal').classList.add('active');
});

document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
        document.getElementById('addDoctorModal').classList.remove('active');
    });
});

document.getElementById('addDoctorForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        name: document.getElementById('docName').value,
        specialization: document.getElementById('docSpec').value,
        experience: parseInt(document.getElementById('docExp').value)
    };
    try {
        const res = await fetch(`${API_BASE}/doctors.php`, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.status === 'success') {
            document.getElementById('addDoctorModal').classList.remove('active');
            document.getElementById('addDoctorForm').reset();
            loadDoctors();
        } else {
            alert(data.message);
        }
    } catch (e) {
        alert('Failed to add doctor');
    }
});

// --- APPOINTMENTS ---
const loadAppointments = async () => {
    try {
        const res = await fetch(`${API_BASE}/appointments.php`);
        const data = await res.json();
        if (data.status === 'success') {
            renderAppointments(data.data);
            updateStats(data.data);
        }
    } catch (e) {
        console.error('Failed to load appointments', e);
    }
};

const updateStats = (appointments) => {
    document.getElementById('statTotal').textContent = appointments.length;
    document.getElementById('statPending').textContent = appointments.filter(a => a.status === 'Pending').length;
    document.getElementById('statApproved').textContent = appointments.filter(a => a.status === 'Approved').length;
    document.getElementById('statRejected').textContent = appointments.filter(a => a.status === 'Rejected').length;
};

const renderAppointments = (appointments) => {
    const list = document.getElementById('appointmentList');
    list.innerHTML = '';
    if (appointments.length === 0) {
        list.innerHTML = '<p style="padding:20px; color:#64748b; text-align:center;">No appointments yet.</p>';
        return;
    }
    appointments.slice(0, 10).forEach(apt => {
        const date = new Date(apt.appointment_date).toLocaleString();
        list.innerHTML += `
            <div class="apt-item">
                <div class="apt-header">
                    <div>
                        <div class="apt-name">${apt.patient_name}</div>
                        <div class="apt-doctor">with ${apt.doctor_name}</div>
                        <div class="apt-date">${date}</div>
                    </div>
                    <span class="badge badge-${apt.status.toLowerCase()}">${apt.status}</span>
                </div>
                ${apt.status === 'Pending' ? `
                <div class="apt-actions">
                    <button class="btn btn-success btn-sm" onclick="updateAppointment(${apt.id}, 'Approved')">
                        <i class="ph ph-check"></i> Approve
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="updateAppointment(${apt.id}, 'Rejected')">
                        <i class="ph ph-x"></i> Reject
                    </button>
                </div>` : ''}
            </div>
        `;
    });
};

const updateAppointment = async (id, status) => {
    try {
        const res = await fetch(`${API_BASE}/appointments.php`, {
            method: 'PUT',
            body: JSON.stringify({ id, status })
        });
        const data = await res.json();
        if (data.status === 'success') {
            loadAppointments();
        } else {
            alert(data.message);
        }
    } catch (e) {
        alert('Failed to update appointment');
    }
};

loadDashboard();
