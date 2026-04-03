// Saved Jobs Page Logic
document.addEventListener('DOMContentLoaded', () => {
    renderSavedJobs();
    updateSavedCount();
});

function renderSavedJobs() {
    const savedIds = StorageManager.getSavedJobs();
    const savedJobs = jobsDatabase.filter(job => savedIds.includes(job.id));
    const container = document.getElementById('savedJobsContainer');
    
    if (savedJobs.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>📭 No saved jobs yet</h3>
                <p>Browse jobs and click "Save" to bookmark them here</p>
                <a href="index.html" class="back-link" style="margin-top: 1rem; display: inline-block;">Browse Jobs →</a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = savedJobs.map(job => `
        <div class="saved-card">
            <h3>${escapeHtml(job.title)}</h3>
            <div class="company">🏢 ${escapeHtml(job.company)}</div>
            <div class="location">📍 ${job.location.split(',')[0]}</div>
            <div class="salary" style="background: #e6f7ed; padding: 4px 12px; border-radius: 20px; display: inline-block; margin: 0.5rem 0;">💰 ${job.salary}</div>
            <div class="saved-actions">
                <button class="remove-btn" data-id="${job.id}">🗑 Remove</button>
                <button class="apply-now-btn" data-id="${job.id}">📝 Apply Now</button>
                <button class="view-details-btn" data-id="${job.id}" style="background: #f0f0f0; border: none; padding: 8px 16px; border-radius: 10px; cursor: pointer;">View Details</button>
            </div>
        </div>
    `).join('');
    
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            StorageManager.removeJob(id);
            renderSavedJobs();
            updateSavedCount();
        });
    });
    
    document.querySelectorAll('.apply-now-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const job = jobsDatabase.find(j => j.id === id);
            showApplyModal(job);
        });
    });
    
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            localStorage.setItem('selectedJob', JSON.stringify(jobsDatabase.find(j => j.id === id)));
            window.location.href = 'company.html';
        });
    });
}

function showApplyModal(job) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Apply for ${escapeHtml(job.title)}</h2>
            <p style="color: #667eea;">${escapeHtml(job.company)}</p>
            <input type="text" id="applicantName" placeholder="Full Name" required>
            <input type="email" id="applicantEmail" placeholder="Email Address" required>
            <input type="tel" id="applicantPhone" placeholder="Phone Number">
            <textarea id="applicantMessage" placeholder="Tell us why you're interested..."></textarea>
            <div class="modal-buttons">
                <button class="submit-apply">Submit Application</button>
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
        
        alert(`✅ Application Submitted!\n\nPosition: ${job.title}\nCompany: ${job.company}\nWe'll contact you at ${email}`);
        modal.remove();
    });
    
    modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
}

function updateSavedCount() {
    const count = StorageManager.getSavedJobs().length;
    const badge = document.getElementById('navSavedCount');
    if (badge) badge.textContent = count;
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