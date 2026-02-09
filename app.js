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
        if (name.includes(key)) return productImages[key];
    }
    return '🌾';
}

// DEVICE DETECTION
function getDeviceInfo() {
    const parser = new UAParser();
    const device = parser.getDevice();
    const os = parser.getOS();
    const browser = parser.getBrowser();
    
    return {
        deviceType: device.type || 'desktop',
        osName: os.name || 'Unknown',
        osVersion: os.version || 'Unknown',
        browserName: browser.name || 'Unknown',
        browserVersion: browser.version || 'Unknown',
        screenResolution: `${screen.width}x${screen.height}`,
        timestamp: new Date().toISOString()
    };
}

async function getUserLocation() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        return { ip: data.ip, city: data.city, region: data.region, country: data.country_name };
    } catch (error) {
        return { ip: 'Unknown', city: 'Unknown', country: 'Unknown' };
    }
}

// PIN CODE TO LOCATION
async function fetchLocationFromPIN(pincode) {
    if (pincode.length !== 6) return null;
    try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await response.json();
        if (data[0].Status === 'Success' && data[0].PostOffice.length > 0) {
            const po = data[0].PostOffice[0];
            return { city: po.District, state: po.State, district: po.District };
        }
    } catch (error) {
        console.error('PIN lookup failed:', error);
    }
    return null;
}

// PASSWORD VALIDATION
function validatePassword(password) {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const minLength = password.length >= 8;
    return hasLetter && hasNumber && minLength;
}

function getPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    if (strength <= 2) return 'weak';
    if (strength <= 3) return 'medium';
    return 'strong';
}

// FORM VALIDATION
function validateField(field, rules) {
    const value = field.value.trim();
    const errorDiv = document.getElementById(`${field.id}-error`);
    
    if (rules.required && !value) {
        if (errorDiv) errorDiv.textContent = rules.requiredMessage || 'Required';
        field.classList.add('error');
        return false;
    }
    if (rules.pattern && !rules.pattern.test(value)) {
        if (errorDiv) errorDiv.textContent = rules.patternMessage || 'Invalid format';
        field.classList.add('error');
        return false;
    }
    if (rules.minLength && value.length < rules.minLength) {
        if (errorDiv) errorDiv.textContent = `Min ${rules.minLength} characters`;
        field.classList.add('error');
        return false;
    }
    if (rules.custom && !rules.custom(value)) {
        if (errorDiv) errorDiv.textContent = rules.customMessage || 'Invalid';
        field.classList.add('error');
        return false;
    }
    if (errorDiv) errorDiv.textContent = '';
    field.classList.remove('error');
    return true;
}

const validationRules = {
    'reg-name': { required: true, minLength: 2, requiredMessage: 'Name is required' },
    'reg-mobile': { required: true, pattern: /^[0-9]{10}$/, patternMessage: 'Enter valid 10-digit mobile' },
    'reg-email': { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, patternMessage: 'Enter valid email' },
    'reg-pin': { required: true, pattern: /^[0-9]{6}$/, patternMessage: 'Enter valid 6-digit PIN' },
    'reg-username': { required: true, minLength: 4, pattern: /^[a-zA-Z0-9]+$/, patternMessage: '4-20 alphanumeric chars' },
    'reg-password': { required: true, custom: validatePassword, customMessage: '8+ chars with letters AND numbers' }
};

// DATABASE CLASS
class FarmerDatabase {
    constructor() {
        this.farmersKey = 'farmers_data';
        this.productsKey = 'products_data';
        this.currentFarmerKey = 'current_farmer';
        this.viewsKey = 'product_views';
        this.loginHistoryKey = 'login_history';
    }

    getFarmers() {
        const farmers = localStorage.getItem(this.farmersKey);
        return farmers ? JSON.parse(farmers) : [];
    }

    saveFarmers(farmers) {
        localStorage.setItem(this.farmersKey, JSON.stringify(farmers));
    }

    registerFarmer(data) {
        const farmers = this.getFarmers();
        if (farmers.find(f => f.username === data.username)) {
            throw new Error('Username already exists');
        }
        if (farmers.find(f => f.mobile === data.mobile)) {
            throw new Error('Mobile number already registered');
        }
        const newFarmer = {
            id: Date.now().toString(),
            ...data,
            createdAt: new Date().toISOString()
        };
        farmers.push(newFarmer);
        this.saveFarmers(farmers);
        return newFarmer;
    }

    loginFarmer(username, password) {
        const farmers = this.getFarmers();
        const farmer = farmers.find(f => f.username === username && f.password === password);
        if (!farmer) throw new Error('Invalid username or password');
        localStorage.setItem(this.currentFarmerKey, JSON.stringify({
            id: farmer.id, name: farmer.name, username: farmer.username, mobile: farmer.mobile
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
        if (!farmer) throw new Error('Username not found');
        if (farmer.securityA1.toLowerCase() !== q1Answer.toLowerCase() ||
            farmer.securityA2.toLowerCase() !== q2Answer.toLowerCase()) {
            throw new Error('Security answers do not match');
        }
        return farmer;
    }

    resetPassword(username, newPassword) {
        const farmers = this.getFarmers();
        const farmerIndex = farmers.findIndex(f => f.username === username);
        if (farmerIndex === -1) throw new Error('Farmer not found');
        farmers[farmerIndex].password = newPassword;
        this.saveFarmers(farmers);
    }

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

    async addProductView(productId) {
        const views = this.getViews();
        const deviceInfo = getDeviceInfo();
        const locationInfo = await getUserLocation();
        const viewData = {
            id: Date.now().toString(),
            productId: productId,
            ...deviceInfo,
            ...locationInfo,
            viewedAt: new Date().toISOString()
        };
        views.push(viewData);
        localStorage.setItem(this.viewsKey, JSON.stringify(views));
        this.incrementViews(productId);
        return viewData;
    }

    getViews() {
        const views = localStorage.getItem(this.viewsKey);
        return views ? JSON.parse(views) : [];
    }

    getUniqueViewersCount(farmerId) {
        const products = this.getFarmerProducts(farmerId);
        const views = this.getViews();
        const productIds = products.map(p => p.id);
        const relevantViews = views.filter(v => productIds.includes(v.productId));
        const uniqueIPs = [...new Set(relevantViews.map(v => v.ip))];
        return uniqueIPs.length;
    }

    async trackLogin(farmerId) {
        const history = this.getLoginHistory();
        const deviceInfo = getDeviceInfo();
        const locationInfo = await getUserLocation();
        const loginData = {
            id: Date.now().toString(),
            farmerId: farmerId,
            ...deviceInfo,
            ...locationInfo,
            loginTime: new Date().toISOString()
        };
        history.push(loginData);
        localStorage.setItem(this.loginHistoryKey, JSON.stringify(history));
    }

    getLoginHistory() {
        const history = localStorage.getItem(this.loginHistoryKey);
        return history ? JSON.parse(history) : [];
    }
}

const db = new FarmerDatabase();

// UTILITY FUNCTIONS
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    setTimeout(() => notification.classList.remove('show'), 4000);
}

function maskMobile(mobile) {
    if (!mobile || mobile.length < 10) return mobile;
    return `${mobile.slice(0, 2)}XXXXXX${mobile.slice(-2)}`;
}

// NAVIGATION
document.getElementById('farmer-login-btn')?.addEventListener('click', () => showPage('farmer-login-page'));
document.getElementById('buyer-browse-btn')?.addEventListener('click', () => { loadBuyerProducts(); showPage('buyer-browse-page'); });
document.getElementById('farmer-register-btn')?.addEventListener('click', () => showPage('farmer-registration-page'));
document.getElementById('back-to-landing-reg')?.addEventListener('click', () => showPage('landing-page'));
document.getElementById('back-to-landing-login')?.addEventListener('click', () => showPage('landing-page'));
document.getElementById('back-to-landing-browse')?.addEventListener('click', () => showPage('landing-page'));
document.getElementById('goto-register-from-login')?.addEventListener('click', (e) => { e.preventDefault(); showPage('farmer-registration-page'); });
document.getElementById('forgot-password-link')?.addEventListener('click', (e) => { e.preventDefault(); showPage('password-recovery-page'); });
document.getElementById('back-to-login-recovery')?.addEventListener('click', () => showPage('farmer-login-page'));
document.getElementById('back-to-dashboard')?.addEventListener('click', () => { loadFarmerDashboard(); showPage('farmer-dashboard-page'); });

// PIN CODE LOOKUP
document.getElementById('reg-pin')?.addEventListener('blur', async function() {
    const pin = this.value.trim();
    const locationDisplay = document.getElementById('location-display');
    const locationText = document.getElementById('location-text');
    if (pin.length === 6) {
        const location = await fetchLocationFromPIN(pin);
        if (location) {
            locationText.textContent = `📍 ${location.city}, ${location.state}`;
            locationDisplay.classList.add('show');
            locationDisplay.style.display = 'flex';
            window.userLocation = location;
        }
    }
});

// PASSWORD STRENGTH
document.getElementById('reg-password')?.addEventListener('input', function() {
    const password = this.value;
    const strengthDiv = document.getElementById('password-strength');
    const errorDiv = document.getElementById('reg-password-error');
    if (password.length === 0) {
        strengthDiv.className = 'password-strength';
        if (errorDiv) errorDiv.textContent = '';
        return;
    }
    if (!validatePassword(password)) {
        if (errorDiv) errorDiv.textContent = 'Password must have 8+ chars with letters AND numbers';
        this.classList.add('error');
    } else {
        if (errorDiv) errorDiv.textContent = '';
        this.classList.remove('error');
    }
    const strength = getPasswordStrength(password);
    strengthDiv.className = `password-strength ${strength}`;
});

// REAL-TIME VALIDATION
Object.keys(validationRules).forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
        field.addEventListener('blur', () => validateField(field, validationRules[fieldId]));
    }
});

// FARMER REGISTRATION
document.getElementById('farmer-registration-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isValid = true;
    Object.keys(validationRules).forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !validateField(field, validationRules[fieldId])) isValid = false;
    });
    
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    if (password !== confirmPassword) {
        const errorDiv = document.getElementById('reg-confirm-password-error');
        if (errorDiv) errorDiv.textContent = 'Passwords do not match';
        document.getElementById('reg-confirm-password').classList.add('error');
        isValid = false;
    }
    
    const privacyConsent = document.getElementById('privacy-consent')?.checked;
    if (!privacyConsent) {
        showNotification('Please accept Privacy Policy and Terms', 'error');
        isValid = false;
    }
    
    if (!isValid) return;
    
    const data = {
        name: document.getElementById('reg-name').value.trim(),
        mobile: document.getElementById('reg-mobile').value.trim(),
        email: document.getElementById('reg-email').value.trim(),
        country: document.getElementById('reg-country').value,
        pin: document.getElementById('reg-pin').value.trim(),
        city: window.userLocation?.city || '',
        state: window.userLocation?.state || '',
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

// FARMER LOGIN
document.getElementById('farmer-login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    
    try {
        const farmer = db.loginFarmer(username, password);
        await db.trackLogin(farmer.id);
        showNotification(`Welcome back, ${farmer.name}! 🌾`);
        document.getElementById('farmer-login-form').reset();
        loadFarmerDashboard();
    } catch (error) {
        showNotification(error.message, 'error');
    }
});

// PASSWORD RECOVERY
let recoveryFarmer = null;
document.getElementById('verify-username-btn')?.addEventListener('click', () => {
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
    const questionMap = {
        'mother': "What is your mother's maiden name?",
        'pet': "What was your first pet's name?",
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

document.getElementById('password-recovery-form')?.addEventListener('submit', (e) => {
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
    if (!validatePassword(newPassword)) {
        showNotification('Password must have 8+ chars with letters AND numbers', 'error');
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

// FARMER DASHBOARD
function loadFarmerDashboard() {
    const farmer = db.getCurrentFarmer();
    if (!farmer) {
        showPage('farmer-login-page');
        return;
    }
    document.getElementById('farmer-name').textContent = farmer.name;
    document.getElementById('dashboard-farmer-name').textContent = farmer.name;
    
    const products = db.getFarmerProducts(farmer.id);
    document.getElementById('total-products').textContent = products.length;
    document.getElementById('total-views').textContent = products.reduce((sum, p) => sum + (p.views || 0), 0);
    document.getElementById('total-inquiries').textContent = products.reduce((sum, p) => sum + (p.inquiries || 0), 0);
    document.getElementById('unique-viewers').textContent = db.getUniqueViewersCount(farmer.id);
    
    const grid = document.getElementById('farmer-products-grid');
    if (products.length === 0) {
        grid.innerHTML = '<p style="text-align:center;color:#757575;grid-column:1/-1;">No products yet. Click "Add Product"!</p>';
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

document.getElementById('add-product-btn')?.addEventListener('click', () => {
    const farmer = db.getCurrentFarmer();
    if (farmer && window.userLocation) {
        const locationText = document.getElementById('product-location-text');
        if (locationText) {
            locationText.textContent = `${window.userLocation.city}, ${window.userLocation.state}`;
        }
    }
    showPage('add-product-page');
});

document.getElementById('farmer-logout-btn')?.addEventListener('click', () => {
    db.logout();
    showNotification('Logged out successfully');
    showPage('landing-page');
});

// ADD PRODUCT
document.getElementById('product-description')?.addEventListener('input', function() {
    const charCount = document.getElementById('char-count');
    if (charCount) charCount.textContent = this.value.length;
});

document.getElementById('add-product-form')?.addEventListener('submit', (e) => {
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
        location: window.userLocation ? `${window.userLocation.city}, ${window.userLocation.state}` : 'Location not set'
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
    if (confirm('Delete this product?')) {
        db.deleteProduct(productId, farmer.id);
        showNotification('Product deleted');
        loadFarmerDashboard();
    }
}

// BUYER BROWSE
function loadBuyerProducts(filterCategory = '', sortBy = 'newest', searchQuery = '') {
    let products = db.getAllProducts();
    
    if (filterCategory) {
        products = products.filter(p => p.category === filterCategory);
    }
    if (searchQuery) {
        products = products.filter(p => 
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    
    if (sortBy === 'price-low') {
        products.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
        products.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'popular') {
        products.sort((a, b) => (b.views || 0) - (a.views || 0));
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
                <div style="font-size:12px;color:#757575;">👁️ ${p.views || 0} views</div>
            </div>
        `).join('');
    }
}

document.getElementById('category-filter')?.addEventListener('change', (e) => {
    loadBuyerProducts(e.target.value, document.getElementById('sort-filter').value, document.getElementById('search-input').value);
});

document.getElementById('sort-filter')?.addEventListener('change', (e) => {
    loadBuyerProducts(document.getElementById('category-filter').value, e.target.value, document.getElementById('search-input').value);
});

document.getElementById('search-input')?.addEventListener('input', (e) => {
    loadBuyerProducts(document.getElementById('category-filter').value, document.getElementById('sort-filter').value, e.target.value);
});

// PRODUCT DETAIL MODAL
async function showProductDetail(productId) {
    await db.addProductView(productId);
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
            <p style="color:#757575;">${product.description || 'No description.'}</p>
        </div>
        <div style="margin:20px 0;">
            <h3 style="color:#2e7d32;margin-bottom:10px;">Location</h3>
            <p style="color:#757575;">📍 ${product.location}</p>
        </div>
        <div style="margin:20px 0;padding:20px;background:#f5f5f5;border-radius:12px;">
            <h3 style="color:#2e7d32;margin-bottom:10px;">Farmer Details</h3>
            <p><strong>Name:</strong> ${farmer.name}</p>
            <p><strong>Mobile:</strong> ${maskMobile(farmer.mobile)}</p>
            <p style="font-size:12px;color:#757575;margin-top:10px;">* Contact button reveals full number</p>
        </div>
        <button class="btn btn-primary" onclick="contactFarmer('${product.id}')" style="width:100%;">📞 Contact Farmer</button>
    `;
    modal.classList.add('active');
}

function contactFarmer(productId) {
    db.incrementInquiries(productId);
    const farmer = db.getFarmerByProductId(productId);
    if (!farmer) return;
    alert(`Farmer Contact:\n\nName: ${farmer.name}\nMobile: ${farmer.mobile}\n\nYou can now call or message!`);
}

document.querySelector('.modal-close')?.addEventListener('click', () => {
    document.getElementById('product-detail-modal').classList.remove('active');
});

document.getElementById('product-detail-modal')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('product-detail-modal')) {
        document.getElementById('product-detail-modal').classList.remove('active');
    }
});

// PRIVACY & TERMS
document.getElementById('privacy-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Privacy Policy\n\nWe collect minimal data. Aadhaar (last 4) for verification only. Your data is secure. No third-party sharing without consent.');
});

document.getElementById('terms-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Terms & Conditions\n\n1. 100% free for farmers\n2. No commission\n3. Farmers responsible for quality\n4. Direct buyer-farmer contact\n5. Platform not liable for transactions\n6. Respectful conduct expected');
});

// INITIALIZE
window.addEventListener('load', () => {
    const farmer = db.getCurrentFarmer();
    if (farmer) {
        loadFarmerDashboard();
    } else {
        showPage('landing-page');
    }
});
