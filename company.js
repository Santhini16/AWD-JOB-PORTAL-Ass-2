// Company Detail Page Logic
document.addEventListener('DOMContentLoaded', () => {
    const savedJob = localStorage.getItem('selectedJob');
    if (savedJob) {
        const job = JSON.parse(savedJob);
        renderCompanyDetails(job);
    } else {
        document.getElementById('companyDetail').innerHTML = '<div class="empty-state"><h3>No company selected</h3><a href="index.html" class="back-link">Go back to search</a></div>';
    }
    updateSavedCount();
});

function renderCompanyDetails(job) {
    const companyJobs = jobsDatabase.filter(j => j.company === job.company);
    
    const html = `
        <div class="company-header">
            <div class="company-logo-large">${job.logoInitial}</div>
            <h1>${escapeHtml(job.company)}</h1>
            <div class="company-meta">
                <span>🏢 Founded ${job.founded}</span>
                <span>👥 ${job.employees} employees</span>
                <span>🌐 ${job.website}</span>
                <span>📍 ${job.headquarters}</span>
            </div>
        </div>
        
        <div class="company-description">
            <h2>About ${escapeHtml(job.company)}</h2>
            <p>${job.companyDescription}</p>
        </div>
        
        <div class="benefits-section">
            <h2>✨ Benefits & Perks</h2>
            <div class="benefits-list">
                ${job.benefits.map(b => `<span class="benefit-tag">✓ ${b}</span>`).join('')}
            </div>
        </div>
        
        <div class="jobs-at-company">
            <h2>📋 Open Positions at ${escapeHtml(job.company)}</h2>
            ${companyJobs.map(j => `
                <div class="job-item">
                    <h3>${escapeHtml(j.title)}</h3>
                    <p>📍 ${j.location.split(',')[0]} | 💰 ${j.salary}</p>
                    <button class="apply-btn" data-id="${j.id}" style="margin-top: 0.5rem; padding: 8px 20px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 30px; cursor: pointer;">Apply Now</button>
                </div>
            `).join('')}
        </div>
        
        <div style="margin-top: 2rem; padding: 1rem; background: #f0fdf4; border-radius: 16px; text-align: center;">
            <h3>🎯 Current Opening: ${escapeHtml(job.title)}</h3>
            <p style="margin: 0.5rem 0;">Salary: ${job.salary} • Location: ${job.location}</p>
            <button class="apply-main-btn" data-id="${job.id}" style="margin-top: 0.5rem; padding: 10px 30px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 40px; font-size: 1rem; font-weight: 600; cursor: pointer;">📝 Apply for this position</button>
        </div>
    `;
    
    document.getElementById('companyDetail').innerHTML = html;
    
    document.querySelectorAll('.apply-btn, .apply-main-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const selectedJob = jobsDatabase.find(j => j.id === id);
            showApplyModal(selectedJob);
        });
    });
}

function showApplyModal(job) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>📝 Apply for ${escapeHtml(job.title)}</h2>
            <p style="color: #667eea; margin-bottom: 1rem;">${escapeHtml(job.company)} • ${job.location.split(',')[0]}</p>
            <input type="text" id="applicantName" placeholder="Full Name *" required>
            <input type="email" id="applicantEmail" placeholder="Email Address *" required>
            <input type="tel" id="applicantPhone" placeholder="Phone Number">
            <textarea id="applicantMessage" placeholder="Cover letter / Why you're a good fit?"></textarea>
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
            alert('Please fill in your name and email address');
            return;
        }
        
        alert(`✅ Application submitted successfully!\n\nPosition: ${job.title}\nCompany: ${job.company}\n\nWe've sent a confirmation to ${email}\nThe hiring team will review your application.`);
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