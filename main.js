// Main Jobs Page Logic
let currentSearch = "";
let currentCompany = "all";
let currentRole = "all";
let currentLocation = "all";

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    populateFilters();
    renderJobs();
    updateSavedCount();
    attachEvents();
});

function populateFilters() {
    const companySelect = document.getElementById('companyFilter');
    const locationSelect = document.getElementById('locationFilter');
    
    getUniqueCompanies().forEach(company => {
        const option = document.createElement('option');
        option.value = company;
        option.textContent = company;
        companySelect.appendChild(option);
    });
    
    getUniqueLocations().forEach(location => {
        const option = document.createElement('option');
        option.value = location;
        option.textContent = location;
        locationSelect.appendChild(option);
    });
}

function getFilteredJobs() {
    return jobsDatabase.filter(job => {
        const matchSearch = currentSearch === "" || 
            job.title.toLowerCase().includes(currentSearch.toLowerCase()) ||
            job.company.toLowerCase().includes(currentSearch.toLowerCase()) ||
            job.location.toLowerCase().includes(currentSearch.toLowerCase());
        
        const matchCompany = currentCompany === "all" || job.company === currentCompany;
        const matchRole = currentRole === "all" || job.role === currentRole;
        const matchLocation = currentLocation === "all" || job.location.includes(currentLocation);
        
        return matchSearch && matchCompany && matchRole && matchLocation;
    });
}

function renderJobs() {
    const filtered = getFilteredJobs();
    const grid = document.getElementById('jobsGrid');
    const resultCount = document.getElementById('resultCount');
    
    resultCount.textContent = filtered.length;
    
    if (filtered.length === 0) {
        grid.innerHTML = `<div class="empty-state"><h3>🔍 No jobs found</h3><p>Try adjusting your filters</p></div>`;
        return;
    }
    
    grid.innerHTML = filtered.map(job => `
        <div class="job-card" data-job-id="${job.id}">
            <div class="card-header">
                <div class="company-logo">${job.logoInitial}</div>
                <div class="job-info">
                    <h3>${escapeHtml(job.title)}</h3>
                    <div class="company-name">${escapeHtml(job.company)}</div>
                </div>
            </div>
            <div class="job-details">
                <span class="detail-item">📍 ${job.location.split(',')[0]}</span>
                <span class="detail-item salary">💰 ${job.salary}</span>
                <span class="detail-item">⚙️ ${job.role}</span>
            </div>
            <div class="card-actions">
                <button class="save-btn ${StorageManager.isSaved(job.id) ? 'saved' : ''}" data-id="${job.id}">
                    ${StorageManager.isSaved(job.id) ? '★ Saved' : '☆ Save'}
                </button>
                <button class="apply-btn" data-id="${job.id}">📝 Apply Now</button>
            </div>
        </div>
    `).join('');
    
    // Attach event listeners
    document.querySelectorAll('.save-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            toggleSave(id, btn);
        });
    });
    
    document.querySelectorAll('.apply-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            const job = jobsDatabase.find(j => j.id === id);
            showApplyModal(job);
        });
    });
    
    document.querySelectorAll('.job-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('save-btn') && !e.target.classList.contains('apply-btn')) {
                const id = parseInt(card.dataset.jobId);
                localStorage.setItem('selectedJob', JSON.stringify(jobsDatabase.find(j => j.id === id)));
                window.location.href = 'company.html';
            }
        });
    });
}

function toggleSave(id, btn) {
    if (StorageManager.isSaved(id)) {
        StorageManager.removeJob(id);
        btn.textContent = '☆ Save';
        btn.classList.remove('saved');
    } else {
        StorageManager.saveJob(id);
        btn.textContent = '★ Saved';
        btn.classList.add('saved');
    }
    updateSavedCount();
}

function updateSavedCount() {
    const count = StorageManager.getSavedJobs().length;
    const badge = document.getElementById('navSavedCount');
    if (badge) badge.textContent = count;
}

function showApplyModal(job) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Apply for ${escapeHtml(job.title)}</h2>
            <p style="color: #667eea; margin-bottom: 1rem;">${escapeHtml(job.company)} • ${job.location.split(',')[0]}</p>
            <input type="text" id="applicantName" placeholder="Full Name" required>
            <input type="email" id="applicantEmail" placeholder="Email Address" required>
            <input type="tel" id="applicantPhone" placeholder="Phone Number">
            <textarea id="applicantMessage" placeholder="Why are you a good fit for this role?"></textarea>
            <div class="modal-buttons">
                <button class="submit-apply" data-id="${job.id}">Submit Application</button>
                <button class="close-modal">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.submit-apply').addEventListener('click', () => {
        const name = document.getElementById('applicantName').value;
        const email = document.getElementById('applicantEmail').value;
        
        if (!name || !email) {
            alert('Please fill in name and email');
            return;
        }
        
        alert(`✅ Application submitted!\n\nPosition: ${job.title}\nCompany: ${job.company}\nName: ${name}\nEmail: ${email}\n\nWe'll contact you soon!`);
        modal.remove();
    });
    
    modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
}

function attachEvents() {
    document.getElementById('searchInput').addEventListener('input', (e) => {
        currentSearch = e.target.value;
        renderJobs();
    });
    
    document.getElementById('companyFilter').addEventListener('change', (e) => {
        currentCompany = e.target.value;
        renderJobs();
    });
    
    document.getElementById('roleFilter').addEventListener('change', (e) => {
        currentRole = e.target.value;
        renderJobs();
    });
    
    document.getElementById('locationFilter').addEventListener('change', (e) => {
        currentLocation = e.target.value;
        renderJobs();
    });
    
    document.getElementById('resetBtn').addEventListener('click', () => {
        currentSearch = "";
        currentCompany = "all";
        currentRole = "all";
        currentLocation = "all";
        
        document.getElementById('searchInput').value = "";
        document.getElementById('companyFilter').value = "all";
        document.getElementById('roleFilter').value = "all";
        document.getElementById('locationFilter').value = "all";
        
        renderJobs();
    });
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}