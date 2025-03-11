// Firebase configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";

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

document.addEventListener('DOMContentLoaded', async () => {
    const faqContainer = document.querySelector('.faq-container');

    try {
        const snapshot = await getDocs(collection(db, "faqs"));

        snapshot.forEach(doc => {
            const data = doc.data();

            const faqItem = document.createElement('div');
            faqItem.classList.add('faq-item');

            const faqQuestion = document.createElement('div');
            faqQuestion.classList.add('faq-question');
            faqQuestion.innerHTML = `
                ${data.question}
                <svg class="toggle-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            `;

            const faqAnswer = document.createElement('div');
            faqAnswer.classList.add('faq-answer');
            faqAnswer.innerHTML = data.answer;

            faqItem.appendChild(faqQuestion);
            faqItem.appendChild(faqAnswer);
            faqContainer.appendChild(faqItem);
        });

        // Handle both click & touch events
        faqContainer.addEventListener('click', handleFaqToggle);
        faqContainer.addEventListener('touchend', handleFaqToggle);

        function handleFaqToggle(event) {
            event.preventDefault(); // Prevent scrolling jumps
            event.stopPropagation(); // Prevent any unintended bubbling

            const question = event.target.closest('.faq-question');
            if (!question) return;

            const answer = question.nextElementSibling;
            const toggleIcon = question.querySelector('.toggle-icon');

            // Close other open answers
            document.querySelectorAll('.faq-answer.active').forEach(openAnswer => {
                if (openAnswer !== answer) {
                    openAnswer.classList.remove('active');
                    openAnswer.previousElementSibling.querySelector('.toggle-icon').classList.remove('rotated');
                }
            });

            answer.classList.toggle('active');
            toggleIcon.classList.toggle('rotated');
        }
    } catch (error) {
        console.error('Error fetching FAQs: ', error);
    }
});
