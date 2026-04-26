/**
 * Certificate Display Logic
 * Handles loading and displaying certificate details based on URL parameter
 */

document.addEventListener('DOMContentLoaded', function () {
    // Certificate database - accurately reflects MySirG.com credentials
    const certificateData = [
        { 
            id: 1, 
            title: "C, C++, DSA and STL", 
            desc: "Successfully completed LIVE course with the name 'C, C++, DSA and STL' during the period 26-Feb-2024 to 13-Sep-2024.", 
            img: "Certificate/C Cpp STL and DSA.png",
            issuedBy: "MySirG.com",
            date: "13-Sep-2024"
        },
        { 
            id: 2, 
            title: "Java SE & Data Structures and Algorithms", 
            desc: "Successfully completed the course with the name 'Java SE & Data Structures and Algorithms' of duration 5 months.", 
            img: "Certificate/java SE and DSA.png",
            issuedBy: "MySirG.com",
            date: "28-Jan-2025"
        },
        { 
            id: 3, 
            title: "Full Stack Web Dev Masterclass (Python & Django)", 
            desc: "Successfully completed the course 'Full Stack Web Development Masterclass using Python & Django' of duration 6 months.", 
            img: "Certificate/Full Stack Web Dev in PY.png",
            issuedBy: "MySirG.com",
            date: "19-Aug-2025"
        },
        { 
            id: 4, 
            title: "Java Collection API", 
            desc: "In-depth specialization in Java's Collection Framework and related APIs.", 
            img: "Certificate/certificate4.jpg",
            issuedBy: "MySirG.com",
            date: "Appring may 2026"
        },
        { 
            id: 5, 
            title: "Advanced DSA (15 Pattern Mastery)", 
            desc: "Advanced problem-solving course mastering 15 essential algorithmic patterns.", 
            img: "Certificate/certificate5.jpg",
            issuedBy: "MySirG.com",
            date: "Appring may 2026"
        }
    ];

    // Get certificate ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const certId = urlParams.get('id');

    // Display the certificate
    displayCertificate(certId);

    /**
     * Display certificate details based on ID
     * @param {string} certId - Certificate ID from URL
     */
    function displayCertificate(certId) {
        const contentContainer = document.getElementById('certificate-content');
        
        if (!certId) {
            contentContainer.innerHTML = getNotFoundHTML();
            return;
        }

        const cert = certificateData.find(c => c.id == certId);
        
        if (!cert) {
            contentContainer.innerHTML = getNotFoundHTML();
            return;
        }

        contentContainer.innerHTML = getCertificateHTML(cert);
    }

    /**
     * Generate HTML for certificate details
     * @param {Object} cert - Certificate object
     * @returns {string} HTML string
     */
    function getCertificateHTML(cert) {
        return `
            <div class="cert-detail-card">
                <img src="${cert.img}" alt="${cert.title}" class="cert-detail-image" onerror="this.src='https://placehold.co/900x500/3b82f6/white?text=${encodeURIComponent(cert.title)}'" />
                <div class="cert-detail-body">
                    <h1 class="cert-detail-title">${cert.title}</h1>
                    <p class="cert-detail-desc">${cert.desc}</p>
                    <div class="cert-meta">
                        <div class="cert-meta-item">
                            <span class="cert-meta-label">Issued By</span>
                            <span class="cert-meta-value">${cert.issuedBy}</span>
                        </div>
                        <div class="cert-meta-item">
                            <span class="cert-meta-label">Date</span>
                            <span class="cert-meta-value">${cert.date}</span>
                        </div>
                        <div class="cert-meta-item">
                            <span class="cert-meta-label">Certificate ID</span>
                            <span class="cert-meta-value">#${cert.id}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Generate HTML for not found state
     * @returns {string} HTML string
     */
    function getNotFoundHTML() {
        return `
            <div class="cert-detail-card">
                <div class="cert-detail-body not-found">
                    <h2 style="color: #1e293b; margin-bottom: 10px;">Certificate Not Found</h2>
                    <p style="color: #64748b; margin-bottom: 20px;">The certificate you're looking for doesn't exist or has been removed.</p>
                    <a href="index.html#certificates" class="button-primary" style="display: inline-block; padding: 12px 24px; text-decoration: none; border-radius: 8px;">View All Certificates</a>
                </div>
            </div>
        `;
    }
});