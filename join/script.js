// Sidebar functionality
let sidebar = document.querySelector(".sidebar");
let closeBtn = document.querySelector("#btn");

closeBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    menuBtnChange();
});

function menuBtnChange() {
    if (sidebar.classList.contains("open")) {
        closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");
    } else {
        closeBtn.classList.replace("bx-menu-alt-right", "bx-menu");
    }
}

// Mobile trigger functionality
document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.querySelector('.sidebar');
    const mobileTrigger = document.querySelector('.mobile-trigger');

    if (mobileTrigger) {
        mobileTrigger.addEventListener('click', () => {
            sidebar.classList.toggle('open');
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

// Firebase configuration and initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCRa7Cq_JqPvyICBk9mozxD3XmYwcl-Jm4",
    authDomain: "club-a74c0.firebaseapp.com",
    projectId: "club-a74c0",
    storageBucket: "club-a74c0.appspot.com",
    messagingSenderId: "7273594842",
    appId: "1:7273594842:web:b3a2782b533a5f64b74ae3",
    measurementId: "G-XGJWBYTWRB"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Regex patterns
const phoneRegex = /^\d{10}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegex = /^[a-zA-Z\s]{2,50}$/;
const idCardRegex = /^[a-zA-Z0-9]{5,10}$/; // Adjust as needed for your ID format

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

// Form validation
const validateFormData = (name, idCard, phone, email, hasLaptop) => {
    if (!nameRegex.test(name)) {
        throw new Error("Please enter a valid name (2-50 characters, letters and spaces only).");
    }
    if (!idCardRegex.test(idCard)) {
        throw new Error("Please enter a valid ID card number.");
    }
    if (!phoneRegex.test(phone)) {
        throw new Error("Please enter a valid 10-digit phone number.");
    }
    if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email address.");
    }
    if (!hasLaptop) {
        throw new Error("Please select whether you have a laptop.");
    }
};

// Check for existing user
const checkExistingUser = async (email, phone, idCard) => {
    const emailQuery = query(collection(db, "users"), where("email", "==", email));
    const phoneQuery = query(collection(db, "users"), where("phone", "==", phone));
    const idCardQuery = query(collection(db, "users"), where("idCard", "==", idCard));

    const [emailDocs, phoneDocs, idCardDocs] = await Promise.all([
        getDocs(emailQuery),
        getDocs(phoneQuery),
        getDocs(idCardQuery)
    ]);

    if (!emailDocs.empty) {
        throw new Error("This email is already registered.");
    }
    if (!phoneDocs.empty) {
        throw new Error("This phone number is already registered.");
    }
    if (!idCardDocs.empty) {
        throw new Error("This ID card number is already registered.");
    }
};

// Loading state
const setLoading = (isLoading) => {
    const submitBtn = document.querySelector(".btn");
    submitBtn.disabled = isLoading;
    if (isLoading) {
        submitBtn.innerHTML = 'Joining... <div class="loading-spinner"></div>';
        submitBtn.classList.add('loading');
    } else {
        submitBtn.textContent = "JOIN ->";
        submitBtn.classList.remove('loading');
    }
};

// Form submission
document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    setLoading(true);

    // Get form values
    const name = document.getElementById("name").value.trim();
    const idCard = document.getElementById("id_card").value.trim();
    const className = document.getElementById("class").value;
    const section = document.getElementById("section").value;
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const hasLaptop = document.getElementById("laptop").value;

    try {
        // Validate
        validateFormData(name, idCard, phone, email, hasLaptop);
        
        // Check if class and section are selected
        if (!className || !section) {
            throw new Error("Please select both class and section");
        }

        // Check for existing user
        await checkExistingUser(email, phone, idCard);

        // Add to Firestore
        await addDoc(collection(db, "users"), {
            name,
            idCard,
            class: className,
            section,
            phone,
            email,
            hasLaptop,
            createdAt: new Date().toISOString()
        });

        showModal('successModal');
        document.getElementById("signupForm").reset();

    } catch (error) {
        showModal('errorModal', error.message || "Error registering. Please try again.");
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

// Input formatting and validation
document.getElementById("phone").addEventListener("input", (e) => {
    const phone = e.target.value.replace(/\D/g, '').slice(0, 10);
    e.target.value = phone;
});

document.getElementById("name").addEventListener("input", (e) => {
    const name = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    e.target.value = name;
});

document.getElementById("id_card").addEventListener("input", (e) => {
    const idCard = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
    e.target.value = idCard;
});