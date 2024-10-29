let sidebar = document.querySelector(".sidebar");
let closeBtn = document.querySelector("#btn");
let searchBtn = document.querySelector(".bx-search");

closeBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    menuBtnChange();//calling the function(optional)
});

// following are the code to change sidebar button(optional)
function menuBtnChange() {
    if (sidebar.classList.contains("open")) {
        closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");//replacing the iocns class
    } else {
        closeBtn.classList.replace("bx-menu-alt-right", "bx-menu");//replacing the iocns class
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.sidebar');
    const mobileTrigger = document.querySelector('.mobile-trigger');
    
    if (mobileTrigger) { // Check if the element exists
        mobileTrigger.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            
            // Rotate arrow icon
            const icon = mobileTrigger.querySelector('i');
            if (sidebar.classList.contains('open')) {
                icon.classList.remove('bx-chevron-right');
                icon.classList.add('bx-chevron-left');
            } else {
                icon.classList.remove('bx-chevron-left');
                icon.classList.add('bx-chevron-right');
            }
        });
    } else {
        console.log("Mobile trigger element not found");
    }
});

// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCRa7Cq_JqPvyICBk9mozxD3XmYwcl-Jm4",
    authDomain: "club-a74c0.firebaseapp.com",
    projectId: "club-a74c0",
    storageBucket: "club-a74c0.appspot.com",
    messagingSenderId: "7273594842",
    appId: "1:7273594842:web:b3a2782b533a5f64b74ae3",
    measurementId: "G-XGJWBYTWRB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Regex patterns
const phoneRegex = /^\d{10}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegex = /^[a-zA-Z\s]{2,50}$/;

// Modal functions
window.showModal = (modalId, message = '') => {
    const modal = document.getElementById(modalId);
    if (modalId === 'errorModal' && message) {
        document.getElementById('errorMessage').textContent = message;
    }
    modal.classList.add('show');
};

window.closeModal = (modalId) => {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
};

// Helper function to validate form data
const validateFormData = (name, phone, email) => {
    if (!nameRegex.test(name)) {
        throw new Error("Please enter a valid name (2-50 characters, letters and spaces only).");
    }
    if (!phoneRegex.test(phone)) {
        throw new Error("Please enter a valid 10-digit phone number.");
    }
    if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email address.");
    }
};

// Helper function to check if user already exists
const checkExistingUser = async (email, phone) => {
    const emailQuery = query(collection(db, "users"), where("email", "==", email));
    const phoneQuery = query(collection(db, "users"), where("phone", "==", phone));
    
    const [emailDocs, phoneDocs] = await Promise.all([
        getDocs(emailQuery),
        getDocs(phoneQuery)
    ]);

    if (!emailDocs.empty) {
        throw new Error("This email is already registered.");
    }
    if (!phoneDocs.empty) {
        throw new Error("This phone number is already registered.");
    }
};

// Update loading state management
const setLoading = (isLoading) => {
    const submitBtn = document.querySelector(".btn");
    submitBtn.disabled = isLoading;
    if (isLoading) {
        submitBtn.innerHTML = 'Signing Up... <div class="loading-spinner"></div>';
        submitBtn.classList.add('loading');
    } else {
        submitBtn.textContent = "SIGN UP";
        submitBtn.classList.remove('loading');
    }
};

// Form submission handling
document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    setLoading(true);

    // Get form data
    const name = document.getElementById("name").value.trim();
    const className = document.getElementById("class").value;
    const section = document.getElementById("section").value;
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();

    try {
        // Validate form data
        validateFormData(name, phone, email);
        
        // Check for existing user
        await checkExistingUser(email, phone);

        // Add new user to Firebase
        await addDoc(collection(db, "users"), {
            name,
            class: className,
            section,
            phone,
            email,
            createdAt: new Date().toISOString()
        });

        showModal('successModal');
        document.getElementById("signupForm").reset();

    } catch (error) {
        showModal('errorModal', error.message || "Error registering user. Please try again.");
        console.error("Registration error:", error);

    } finally {
        setLoading(false);
    }
});

// Close modals when clicking outside
window.onclick = (event) => {
    const modals = document.getElementsByClassName('modal');
    for (let modal of modals) {
        if (event.target === modal) {
            modal.classList.remove('show');
        }
    }
};

// Real-time input validation
document.getElementById("phone").addEventListener("input", (e) => {
    const phone = e.target.value.replace(/\D/g, '').slice(0, 10);
    e.target.value = phone;
});

document.getElementById("name").addEventListener("input", (e) => {
    const name = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    e.target.value = name;
});