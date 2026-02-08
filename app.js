// AI-Generated Product Images (Emoji based)
const productImages = {
    'rice': '🌾', 'wheat': '🌾', 'corn': '🌽', 'barley': '🌾', 'oats': '🌾',
    'tomato': '🍅', 'potato': '🥔', 'onion': '🧅', 'carrot': '🥕', 'cabbage': '🥬',
    'spinach': '🥬', 'cauliflower': '🥦', 'broccoli': '🥦', 'lettuce': '🥬',
    'apple': '🍎', 'banana': '🍌', 'orange': '🍊', 'mango': '🥭', 'grapes': '🍇',
    'watermelon': '🍉', 'strawberry': '🍓', 'pineapple': '🍍', 'coconut': '🥥',
    'lentil': '🫘', 'chickpea': '🫘', 'bean': '🫘', 'pea': '🫛',
    'milk': '🥛', 'cheese': '🧀', 'butter': '🧈', 'yogurt': '🥛',
    'turmeric': '🌿', 'chili': '🌶️', 'pepper': '🌶️', 'cumin': '🌿', 'coriander': '🌿',
    'organic': '🌱', 'seed': '🌱', 'sapling': '🌱'
};

function getProductImage(productName) {
    const name = productName.toLowerCase();
    for (let key in productImages) {
        if (name.includes(key)) {
            return productImages[key];
        }
    }
    return '🌾'; // Default
}

// Database Class
class FarmerDatabase {
    constructor() {
        this.farmersKey = 'farmers_data';
        this.productsKey = 'products_data';
        this.currentFarmerKey = 'current_farmer';
    }

    // Farmer Management
    getFarmers() {
        const farmers = localStorage.getItem(this.farmersKey);
        return farmers ? JSON.parse(farmers) : [];
    }

    saveFarmers(farmers) {
        localStorage.setItem(this.farmersKey, JSON.stringify(farmers));
    }

    registerFarmer(data) {
        const farmers = this.getFarmers();
        
        // Check if username exists
        if (farmers.find(f => f.username === data.username)) {
            throw new Error('Username already exists');
        }

        // Check if mobile exists
        if (farmers.find(f => f.mobile === data.mobile)) {
            throw new Error('Mobile number already registered');
        }

        const newFarmer = {
            id: Date.now().toString(),
            ...data,
            createdAt: new Date().toISOString(),
            products: []
        };

        farmers.push(newFarmer);
        this.saveFarmers(farmers);
        return newFarmer;
    }

    loginFarmer(username, password) {
        const farmers = this.getFarmers();
        const farmer = farmers.find(f => f.username === username && f.password === password);
        
        if (!farmer) {
            throw new Error('Invalid username or password');
        }

        localStorage.setItem(this.currentFarmerKey, JSON.stringify({
            id: farmer.id,
            name: farmer.name,
            username: farmer.username,
            mobile: farmer.mobile
        }));

        return farmer;
    }

    getCurrentFarmer() {
        const farmer = localStorage.getItem(this.currentFarmerKey);
        return farmer ? JSON.parse(farmer) : null;
    }

    logout() {
        localStorage.removeItem(this.currentFarmerKey);
    }

    verifySecurityQuestions(username, q1Answer, q2Answer) {
        const farmers = this.getFarmers();
        const farmer = farmers.find(f => f.username === username);
        
        if (!farmer) {
            throw new Error('Username not found');
        }

        if (farmer.securityA1.toLowerCase() !== q1Answer.toLowerCase() ||
            farmer.securityA2.toLowerCase() !== q2Answer.toLowerCase()) {
            throw new Error('Security answers do not match');
        }

        return farmer;
    }

    resetPassword(username, newPassword) {
        const farmers = this.getFarmers();
        const farmerIndex = farmers.findIndex(f => f.username === username);
        
        if (farmerIndex === -1) {
            throw new Error('Farmer not found');
        }

        farmers[farmerIndex].password = newPassword;
        this.saveFarmers(farmers);
    }

    // Product Management
    getProducts() {
        const products = localStorage.getItem(this.productsKey);
        return products ? JSON.parse(products) : [];
    }

    saveProducts(products) {
        localStorage.setItem(this.productsKey, JSON.stringify(products));
    }

    addProduct(farmerId, productData) {
        const products = this.getProducts();
        
        const newProduct = {
            id: Date.now().toString(),
            farmerId: farmerId,
            ...productData,
            views: 0,
            inquiries: 0,
            image: getProductImage(productData.name),
            createdAt: new Date().toISOString()
        };

        products.push(newProduct);
        this.saveProducts(products);
        return newProduct;
    }

    getFarmerProducts(farmerId) {
        const products = this.getProducts();
        return products.filter(p => p.farmerId === farmerId);
    }

    deleteProduct(productId, farmerId) {
        const products = this.getProducts();
        const filtered = products.filter(p => !(p.id === productId && p.farmerId === farmerId));
        this.saveProducts(filtered);
    }

    getAllProducts() {
        return this.getProducts();
    }

    incrementViews(productId) {
        const products = this.getProducts();
        const product = products.find(p => p.id === productId);
        if (product) {
            product.views = (product.views || 0) + 1;
            this.saveProducts(products);
        }
    }

    incrementInquiries(productId) {
        const products = this.getProducts();
        const product = products.find(p => p.id === productId);
        if (product) {
            product.inquiries = (product.inquiries || 0) + 1;
            this.saveProducts(products);
        }
    }

    getFarmerByProductId(productId) {
        const products = this.getProducts();
        const product = products.find(p => p.id === productId);
        if (!product) return null;

        const farmers = this.getFarmers();
        return farmers.find(f => f.id === product.farmerId);
    }
}

const db = new FarmerDatabase();

// Utility Functions
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

function maskMobile(mobile) {
    if (!mobile || mobile.length < 10) return mobile;
    return `${mobile.slice(0, 2)}XXXXXX${mobile.slice(-2)}`;
}

// Navigation
document.getElementById('farmer-login-btn').addEventListener('click', () => {
    showPage('farmer-login-page');
});

document.getElementById('buyer-browse-btn').addEventListener('click', () => {
    loadBuyerProducts();
    showPage('buyer-browse-page');
});

document.getElementById('farmer-register-btn').addEventListener('click', () => {
    showPage('farmer-registration-page');
});

document.getElementById('back-to-landing-reg').addEventListener('click', () => {
    showPage('landing-page');
});

document.getElementById('back-to-landing-login').addEventListener('click', () => {
    showPage('landing-page');
});

document.getElementById('back-to-landing-browse').addEventListener('click', () => {
    showPage('landing-page');
});

document.getElementById('goto-register-from-login').addEventListener('click', (e) => {
    e.preventDefault();
    showPage('farmer-registration-page');
});

document.getElementById('forgot-password-link').addEventListener('click', (e) => {
    e.preventDefault();
    showPage('password-recovery-page');
});

document.getElementById('back-to-login-recovery').addEventListener('click', () => {
    showPage('farmer-login-page');
});

document.getElementById('back-to-dashboard').addEventListener('click', () => {
    loadFarmerDashboard();
    showPage('farmer-dashboard-page');
});

// Farmer Registration
document.getElementById('farmer-registration-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;

    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    const privacyConsent = document.getElementById('privacy-consent').checked;
    if (!privacyConsent) {
        showNotification('Please accept Privacy Policy and Terms', 'error');
        return;
    }

    const data = {
        name: document.getElementById('reg-name').value.trim(),
        mobile: document.getElementById('reg-mobile').value.trim(),
        email: document.getElementById('reg-email').value.trim(),
        country: document.getElementById('reg-country').value,
        pin: document.getElementById('reg-pin').value.trim(),
        aadhaar: document.getElementById('reg-aadhaar').value.trim(),
        username: document.getElementById('reg-username').value.trim(),
        password: password,
        securityQ1: document.getElementById('security-q1').value,
        securityA1: document.getElementById('security-a1').value.trim(),
        securityQ2: document.getElementById('security-q2').value,
        securityA2: document.getElementById('security-a2').value.trim()
    };

    try {
        db.registerFarmer(data);
        showNotification('✅ Registration successful! Please login.');
        document.getElementById('farmer-registration-form').reset();
        showPage('farmer-login-page');
    } catch (error) {
        showNotification(error.message, 'error');
    }
});

// Farmer Login
document.getElementById('farmer-login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    try {
        const farmer = db.loginFarmer(username, password);
        showNotification(`Welcome back, ${farmer.name}! 🌾`);
        document.getElementById('farmer-login-form').reset();
        loadFarmerDashboard();
    } catch (error) {
        showNotification(error.message, 'error');
    }
});

// Password Recovery
let recoveryFarmer = null;

document.getElementById('verify-username-btn').addEventListener('click', () => {
    const username = document.getElementById('recovery-username').value.trim();
    
    if (!username) {
        showNotification('Please enter username', 'error');
        return;
    }

    const farmers = db.getFarmers();
    recoveryFarmer = farmers.find(f => f.username === username);

    if (!recoveryFarmer) {
        showNotification('Username not found', 'error');
        return;
    }

    // Display security questions
    const questionMap = {
        'mother': 'What is your mother\'s maiden name?',
        'pet': 'What was your first pet\'s name?',
        'school': 'What is your primary school name?',
        'village': 'What is your native village/town?',
        'color': 'What is your favorite color?',
        'food': 'What is your favorite food crop?',
        'city': 'In which city were you born?',
        'teacher': 'Who was your favorite teacher?'
    };

    document.getElementById('recovery-q1-label').textContent = questionMap[recoveryFarmer.securityQ1];
    document.getElementById('recovery-q2-label').textContent = questionMap[recoveryFarmer.securityQ2];
    document.getElementById('security-questions-section').style.display = 'block';
    showNotification('Please answer your security questions');
});

document.getElementById('password-recovery-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!recoveryFarmer) {
        showNotification('Please verify username first', 'error');
        return;
    }

    const a1 = document.getElementById('recovery-a1').value.trim();
    const a2 = document.getElementById('recovery-a2').value.trim();
    const newPassword = document.getElementById('recovery-new-password').value;
    const confirmPassword = document.getElementById('recovery-confirm-password').value;

    if (newPassword !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    try {
        db.verifySecurityQuestions(recoveryFarmer.username, a1, a2);
        db.resetPassword(recoveryFarmer.username, newPassword);
        showNotification('✅ Password reset successful! Please login.');
        document.getElementById('password-recovery-form').reset();
        document.getElementById('security-questions-section').style.display = 'none';
        recoveryFarmer = null;
        showPage('farmer-login-page');
    } catch (error) {
        showNotification(error.message, 'error');
    }
});

// Farmer Dashboard
function loadFarmerDashboard() {
    const farmer = db.getCurrentFarmer();
    if (!farmer) {
        showPage('farmer-login-page');
        return;
    }

    document.getElementById('farmer-name').textContent = farmer.name;
    document.getElementById('dashboard-farmer-name').textContent = farmer.name;

    const products = db.getFarmerProducts(farmer.id);
    
    // Update stats
    document.getElementById('total-products').textContent = products.length;
    document.getElementById('total-views').textContent = products.reduce((sum, p) => sum + (p.views || 0), 0);
    document.getElementById('total-inquiries').textContent = products.reduce((sum, p) => sum + (p.inquiries || 0), 0);

    // Display products
    const grid = document.getElementById('farmer-products-grid');
    if (products.length === 0) {
        grid.innerHTML = '<p style="text-align:center;color:#757575;grid-column:1/-1;">No products listed yet. Click "Add Product" to start!</p>';
    } else {
        grid.innerHTML = products.map(p => `
            <div class="product-card">
                <div class="product-image">${p.image}</div>
                <h3>${p.name}</h3>
                <span class="product-category">${p.category}</span>
                <div class="product-price">₹${p.price}/${p.unit}</div>
                <div class="product-quantity">${p.quantity} ${p.unit} available</div>
                <div class="product-location">📍 ${p.location}</div>
                <div style="font-size:12px;color:#757575;margin-bottom:10px;">
                    👁️ ${p.views || 0} views • 📞 ${p.inquiries || 0} inquiries
                </div>
                <div class="product-actions">
                    <button class="btn-delete" onclick="deleteProduct('${p.id}')">🗑️</button>
                </div>
            </div>
        `).join('');
    }

    showPage('farmer-dashboard-page');
}

document.getElementById('add-product-btn').addEventListener('click', () => {
    showPage('add-product-page');
});

document.getElementById('farmer-logout-btn').addEventListener('click', () => {
    db.logout();
    showNotification('Logged out successfully');
    showPage('landing-page');
});

// Add Product
document.getElementById('add-product-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const farmer = db.getCurrentFarmer();
    if (!farmer) {
        showNotification('Please login first', 'error');
        showPage('farmer-login-page');
        return;
    }

    const productData = {
        name: document.getElementById('product-name').value.trim(),
        category: document.getElementById('product-category').value,
        quantity: parseInt(document.getElementById('product-quantity').value),
        unit: document.getElementById('product-unit').value,
        price: parseFloat(document.getElementById('product-price').value),
        description: document.getElementById('product-description').value.trim(),
        location: document.getElementById('product-location').value.trim()
    };

    try {
        db.addProduct(farmer.id, productData);
        showNotification('✅ Product listed successfully!');
        document.getElementById('add-product-form').reset();
        loadFarmerDashboard();
    } catch (error) {
        showNotification('Error adding product', 'error');
    }
});

function deleteProduct(productId) {
    const farmer = db.getCurrentFarmer();
    if (!farmer) return;

    if (confirm('Are you sure you want to delete this product?')) {
        db.deleteProduct(productId, farmer.id);
        showNotification('Product deleted successfully');
        loadFarmerDashboard();
    }
}

// Buyer Browse
function loadBuyerProducts(filterCategory = '', sortBy = 'newest', searchQuery = '') {
    let products = db.getAllProducts();

    // Filter by category
    if (filterCategory) {
        products = products.filter(p => p.category === filterCategory);
    }

    // Search filter
    if (searchQuery) {
        products = products.filter(p => 
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    // Sort
    if (sortBy === 'price-low') {
        products.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
        products.sort((a, b) => b.price - a.price);
    } else {
        products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const grid = document.getElementById('buyer-products-grid');
    if (products.length === 0) {
        grid.innerHTML = '<p style="text-align:center;color:white;grid-column:1/-1;">No products found.</p>';
    } else {
        grid.innerHTML = products.map(p => `
            <div class="product-card" onclick="showProductDetail('${p.id}')">
                <div class="product-image">${p.image}</div>
                <h3>${p.name}</h3>
                <span class="product-category">${p.category}</span>
                <div class="product-price">₹${p.price}/${p.unit}</div>
                <div class="product-quantity">${p.quantity} ${p.unit} available</div>
                <div class="product-location">📍 ${p.location}</div>
                <div style="font-size:12px;color:#757575;">
                    👁️ ${p.views || 0} views
                </div>
            </div>
        `).join('');
    }
}

document.getElementById('category-filter').addEventListener('change', (e) => {
    const category = e.target.value;
    const sort = document.getElementById('sort-filter').value;
    const search = document.getElementById('search-input').value;
    loadBuyerProducts(category, sort, search);
});

document.getElementById('sort-filter').addEventListener('change', (e) => {
    const category = document.getElementById('category-filter').value;
    const sort = e.target.value;
    const search = document.getElementById('search-input').value;
    loadBuyerProducts(category, sort, search);
});

document.getElementById('search-input').addEventListener('input', (e) => {
    const category = document.getElementById('category-filter').value;
    const sort = document.getElementById('sort-filter').value;
    const search = e.target.value;
    loadBuyerProducts(category, sort, search);
});

// Product Detail Modal
function showProductDetail(productId) {
    db.incrementViews(productId);
    
    const products = db.getAllProducts();
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const farmer = db.getFarmerByProductId(productId);
    if (!farmer) return;

    const modal = document.getElementById('product-detail-modal');
    const content = document.getElementById('product-detail-content');

    content.innerHTML = `
        <div style="text-align:center;">
            <div style="font-size:80px;margin-bottom:20px;">${product.image}</div>
            <h2>${product.name}</h2>
            <span class="product-category">${product.category}</span>
            <div class="product-price" style="margin:20px 0;">₹${product.price}/${product.unit}</div>
            <div class="product-quantity" style="margin-bottom:20px;">${product.quantity} ${product.unit} available</div>
        </div>
        
        <div style="margin:20px 0;">
            <h3 style="color:#2e7d32;margin-bottom:10px;">Description</h3>
            <p style="color:#757575;">${product.description || 'No description provided.'}</p>
        </div>
        
        <div style="margin:20px 0;">
            <h3 style="color:#2e7d32;margin-bottom:10px;">Location</h3>
            <p style="color:#757575;">📍 ${product.location}</p>
        </div>
        
        <div style="margin:20px 0;padding:20px;background:#f5f5f5;border-radius:12px;">
            <h3 style="color:#2e7d32;margin-bottom:10px;">Farmer Details</h3>
            <p><strong>Name:</strong> ${farmer.name}</p>
            <p><strong>Mobile:</strong> ${maskMobile(farmer.mobile)}</p>
            <p style="font-size:12px;color:#757575;margin-top:10px;">
                * Mobile number masked for privacy. Contact button will reveal full number.
            </p>
        </div>
        
        <button class="btn btn-primary" onclick="contactFarmer('${product.id}')" style="width:100%;">
            📞 Contact Farmer
        </button>
    `;

    modal.classList.add('active');
}

function contactFarmer(productId) {
    db.incrementInquiries(productId);
    
    const farmer = db.getFarmerByProductId(productId);
    if (!farmer) return;

    alert(`Farmer Contact Details:\n\nName: ${farmer.name}\nMobile: ${farmer.mobile}\n\nYou can now call or message the farmer directly!`);
}

document.querySelector('.modal-close').addEventListener('click', () => {
    document.getElementById('product-detail-modal').classList.remove('active');
});

// Close modal on outside click
document.getElementById('product-detail-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('product-detail-modal')) {
        document.getElementById('product-detail-modal').classList.remove('active');
    }
});

// Privacy & Terms Links
document.getElementById('privacy-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Privacy Policy\n\nWe collect minimal personal data. Aadhaar last 4 digits are only for verification and not stored permanently. Your data is encrypted and secure. We never share your information with third parties without consent.');
});

document.getElementById('terms-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Terms & Conditions\n\n1. This platform is 100% free for farmers\n2. No commission on sales\n3. Farmers are responsible for product quality\n4. Buyers contact farmers directly\n5. Platform is not liable for transactions\n6. Respect and professionalism expected from all users');
});

// Initialize
window.addEventListener('load', () => {
    const farmer = db.getCurrentFarmer();
    if (farmer) {
        loadFarmerDashboard();
    } else {
        showPage('landing-page');
    }
});
