// Complete Job Database
const jobsDatabase = [
    {
        id: 1,
        title: "Senior Frontend Engineer",
        company: "Google",
        location: "Mountain View, California, USA",
        salary: "$145,000 - $175,000",
        role: "Frontend",
        logoInitial: "G",
        companyDescription: "Google is a multinational technology company specializing in Internet-related services and products including search engines, online advertising, cloud computing, and software.",
        founded: 1998,
        employees: "150,000+",
        website: "google.com",
        headquarters: "Mountain View, CA",
        benefits: ["Health Insurance", "401k Matching", "Free Meals", "Gym Access", "Shuttle Service"]
    },
    {
        id: 2,
        title: "Full Stack Developer",
        company: "Microsoft",
        location: "Redmond, Washington, USA",
        salary: "$138,000 - $165,000",
        role: "Full Stack",
        logoInitial: "M",
        companyDescription: "Microsoft develops, manufactures, licenses, supports, and sells computer software, consumer electronics, personal computers, and related services.",
        founded: 1975,
        employees: "180,000+",
        website: "microsoft.com",
        headquarters: "Redmond, WA",
        benefits: ["Health Insurance", "Stock Options", "Remote Work", "Tuition Reimbursement"]
    },
    {
        id: 3,
        title: "Backend Architect",
        company: "Amazon",
        location: "Seattle, Washington, USA",
        salary: "$155,000 - $190,000",
        role: "Backend",
        logoInitial: "A",
        companyDescription: "Amazon is focused on e-commerce, cloud computing, digital streaming, and artificial intelligence.",
        founded: 1994,
        employees: "1,300,000+",
        website: "amazon.com",
        headquarters: "Seattle, WA",
        benefits: ["Health Insurance", "Tuition Reimbursement", "Employee Discount", "Career Choice Program"]
    },
    {
        id: 4,
        title: "DevOps Engineer",
        company: "Netflix",
        location: "Los Gatos, California, USA",
        salary: "$160,000 - $200,000",
        role: "DevOps",
        logoInitial: "N",
        companyDescription: "Netflix is a streaming service offering award-winning TV shows, movies, anime, and documentaries.",
        founded: 1997,
        employees: "12,000+",
        website: "netflix.com",
        headquarters: "Los Gatos, CA",
        benefits: ["Unlimited Vacation", "Health Insurance", "Stock Options", "Free Streaming"]
    },
    {
        id: 5,
        title: "Data Scientist",
        company: "Meta",
        location: "Menlo Park, California, USA",
        salary: "$150,000 - $185,000",
        role: "Data Science",
        logoInitial: "M",
        companyDescription: "Meta builds technologies that help people connect, find communities, and grow businesses.",
        founded: 2004,
        employees: "70,000+",
        website: "meta.com",
        headquarters: "Menlo Park, CA",
        benefits: ["Health Insurance", "Free Meals", "Transportation", "Wellness Reimbursement"]
    },
    {
        id: 6,
        title: "Product Manager",
        company: "Stripe",
        location: "San Francisco, California, USA",
        salary: "$140,000 - $175,000",
        role: "Product",
        logoInitial: "S",
        companyDescription: "Stripe builds economic infrastructure for the internet. Businesses use Stripe to accept payments online.",
        founded: 2010,
        employees: "8,000+",
        website: "stripe.com",
        headquarters: "San Francisco, CA",
        benefits: ["Health Insurance", "Remote Work", "Learning Stipend", "Wellness Allowance"]
    },
    {
        id: 7,
        title: "UI/UX Designer",
        company: "Apple",
        location: "Cupertino, California, USA",
        salary: "$135,000 - $160,000",
        role: "Design",
        logoInitial: "A",
        companyDescription: "Apple designs, develops, and sells consumer electronics, computer software, and online services.",
        founded: 1976,
        employees: "154,000+",
        website: "apple.com",
        headquarters: "Cupertino, CA",
        benefits: ["Health Insurance", "Product Discounts", "Stock Options", "Fitness Center"]
    },
    {
        id: 8,
        title: "Frontend Developer",
        company: "Shopify",
        location: "Ottawa, Ontario, Canada",
        salary: "$120,000 - $148,000",
        role: "Frontend",
        logoInitial: "S",
        companyDescription: "Shopify is a Canadian e-commerce company providing online retail platform for businesses.",
        founded: 2004,
        employees: "10,000+",
        website: "shopify.com",
        headquarters: "Ottawa, Canada",
        benefits: ["Health Insurance", "Digital Stipend", "Stock Options", "Work from Home"]
    },
    {
        id: 9,
        title: "Cloud Architect",
        company: "Salesforce",
        location: "San Francisco, California, USA",
        salary: "$165,000 - $195,000",
        role: "DevOps",
        logoInitial: "S",
        companyDescription: "Salesforce provides CRM software and enterprise applications for sales and marketing.",
        founded: 1999,
        employees: "70,000+",
        website: "salesforce.com",
        headquarters: "San Francisco, CA",
        benefits: ["Health Insurance", "Wellness Reimbursement", "Volunteer Time", "Stock Options"]
    },
    {
        id: 10,
        title: "Backend Engineer",
        company: "Uber",
        location: "San Francisco, California, USA",
        salary: "$148,000 - $178,000",
        role: "Backend",
        logoInitial: "U",
        companyDescription: "Uber develops and operates mobility, delivery, and freight transportation services.",
        founded: 2009,
        employees: "32,000+",
        website: "uber.com",
        headquarters: "San Francisco, CA",
        benefits: ["Health Insurance", "Free Rides", "Stock Options", "Free Meals"]
    }
];

// Storage Manager
class StorageManager {
    static getSavedJobs() {
        const saved = localStorage.getItem('careerhub_saved');
        return saved ? JSON.parse(saved) : [];
    }
    
    static saveJob(jobId) {
        let saved = this.getSavedJobs();
        if (!saved.includes(jobId)) {
            saved.push(jobId);
            localStorage.setItem('careerhub_saved', JSON.stringify(saved));
        }
    }
    
    static removeJob(jobId) {
        let saved = this.getSavedJobs();
        saved = saved.filter(id => id !== jobId);
        localStorage.setItem('careerhub_saved', JSON.stringify(saved));
    }
    
    static isSaved(jobId) {
        return this.getSavedJobs().includes(jobId);
    }
}

// Get unique companies and locations
function getUniqueCompanies() {
    return [...new Set(jobsDatabase.map(job => job.company))];
}

function getUniqueLocations() {
    return [...new Set(jobsDatabase.map(job => job.location.split(',')[0].trim()))];
}