// Add click interactions to the glassmorphism reminder card buttons
const actionBtns = document.querySelectorAll('.action-btn');

actionBtns.forEach(btn => {
    btn.addEventListener('click', function () {
        const originalText = this.innerText;

        // Immediate visual success feedback (Glassmorphism style)
        this.innerHTML = '<i class="fa-solid fa-check"></i> TAKEN';
        this.style.background = 'rgba(74, 222, 128, 0.2)'; // Glassy green
        this.style.color = '#4ade80';
        this.style.borderColor = 'rgba(74, 222, 128, 0.5)';

        // Disable temporarily to prevent multiple clicks
        this.style.pointerEvents = 'none';

        // Reset after a delay (simulating state reset for UI demo purposes)
        setTimeout(() => {
            this.innerText = originalText;
            this.style.background = '';
            this.style.color = '';
            this.style.borderColor = '';
            this.style.pointerEvents = 'auto';
        }, 2000);
    });
});

// ==================== DOCTOR ADVICE LOGIC ====================
const diseaseDatabase = {
    "fever": {
        name: "Viral or Bacterial Infection",
        analysis: "You are experiencing a systemic inflammatory response. A high body temperature accompanied by chills, sweating, and body aches is your body's natural way of fighting off an infection.",
        questions: "1. How many days have you been experiencing this high fever?<br>2. Are you experiencing any localized symptoms like a sore throat or cough?",
        medicines: "Acetaminophen (Paracetamol) or Ibuprofen",
        homeRemedies: "Drink plenty of water, use a cool compress, and rest."
    },
    "cold": {
        name: "Common Cold",
        analysis: "Your symptoms indicate a mild viral infection of the upper respiratory tract.",
        questions: "1. Is your nasal discharge clear or colored?<br>2. Do you have a severe sore throat along with the cold?",
        medicines: "Decongestants, Antihistamines, Throat Lozenges",
        homeRemedies: "Gargle with warm salt water, use a humidifier, and practice steam inhalation."
    },
    "cough": {
        name: "Respiratory Infection or Allergy",
        analysis: "A cough is a reflex action to clear your airways of mucus and irritants. It can be dry or productive.",
        questions: "1. Are you coughing up any phlegm? If so, what color is it?<br>2. Do you experience shortness of breath when coughing?",
        medicines: "Cough suppressants (Dextromethorphan) for dry cough, Expectorants for wet cough",
        homeRemedies: "Honey and warm water, ginger tea, and steam inhalation."
    },
    "headache": {
        name: "Tension Headache or Dehydration",
        analysis: "Pain in the head region is most commonly a tension headache, but can be triggered by stress, dehydration, or lack of sleep.",
        questions: "1. Where exactly is the pain located (e.g., temples, back of head)?<br>2. Does light or sound make the headache worse?",
        medicines: "Aspirin, Ibuprofen, Acetaminophen",
        homeRemedies: "Apply a cold or warm compress, massage your neck, and rest in a dark room."
    },
    "stomach pain": {
        name: "Indigestion or Mild Gastritis",
        analysis: "Discomfort in the abdomen is often caused by indigestion, trapped gas, or consuming irritating foods.",
        questions: "1. Is the pain sharp and localized, or a general dull ache?<br>2. Does the pain worsen after eating certain foods?",
        medicines: "Antacids, Simethicone (Gas-X), Bismuth subsalicylate",
        homeRemedies: "Apply a heating pad to your stomach, rest, and drink chamomile tea."
    },
    "acidity": {
        name: "Acid Reflux / Heartburn",
        analysis: "A burning sensation in your chest indicates stomach acid is flowing back into the esophagus.",
        questions: "1. Does the burning sensation worsen when you lie down?<br>2. What did you eat recently?",
        medicines: "Antacids, Omeprazole (OTC), Ranitidine (OTC)",
        homeRemedies: "Chew fennel seeds, sit upright after meals, and drink cold milk."
    },
    "diarrhea": {
        name: "Viral Gastroenteritis or Food Poisoning",
        analysis: "Loose, watery stools indicate gastrointestinal distress, often caused by a virus or contaminated food.",
        questions: "1. Have you been able to keep fluids down?<br>2. Is there any blood in your stool?",
        medicines: "Loperamide (Imodium), ORS (Oral Rehydration Salts)",
        homeRemedies: "Follow the BRAT diet (Bananas, Rice, Applesauce, Toast) and focus purely on rehydration."
    },
    "vomiting": {
        name: "Stomach Bug or Food Poisoning",
        analysis: "The forceful expulsion of stomach contents is your body's way of clearing out toxins or fighting a stomach bug.",
        questions: "1. Have you had a fever along with the vomiting?<br>2. When was the last time you were able to hold down water?",
        medicines: "ORS (Oral Rehydration Salts). Antiemetics (OTC).",
        homeRemedies: "Wait 30-60 minutes after vomiting before sipping water slowly. Rest quietly."
    },
    "sore throat": {
        name: "Pharyngitis (Viral or Bacterial)",
        analysis: "Pain or scratchiness in the throat is typically caused by a viral infection, though strep throat is a bacterial possibility.",
        questions: "1. Do you have a fever accompanying the sore throat?<br>2. Are there any white patches on the back of your throat?",
        medicines: "Throat lozenges, Acetaminophen, Ibuprofen",
        homeRemedies: "Gargle with warm salt water several times a day and drink warm tea with honey."
    },
    "allergy": {
        name: "Allergic Rhinitis",
        analysis: "Your immune system is reacting to a foreign substance (allergen) like pollen, dust, or pet dander.",
        questions: "1. Have you been exposed to any known allergens recently (pets, pollen, dust)?<br>2. Are your eyes itchy or watery?",
        medicines: "Antihistamines (Cetirizine, Loratadine), Saline nasal spray",
        homeRemedies: "Use a saline nasal rinse to clear allergens, and apply a cold compress for itchy eyes."
    }
};

const adviceInput = document.getElementById('disease-input');
const getAdviceBtn = document.getElementById('get-advice-btn');
const adviceOutput = document.getElementById('advice-output');

if (getAdviceBtn && adviceInput && adviceOutput) {
    getAdviceBtn.addEventListener('click', () => {
        const query = adviceInput.value.trim().toLowerCase();

        if (!query) return;

        // Clear previous output
        adviceOutput.innerHTML = '';
        adviceOutput.classList.remove('hidden');

        // Check if disease exists in our mock database
        const data = diseaseDatabase[query];

        if (data) {
            adviceOutput.innerHTML = `
                <div class="advice-item" style="margin-bottom: 1.5rem;">
                    <div class="advice-label" style="color: var(--color-cyan); font-size: 1.2rem; margin-bottom: 0.5rem;"><i class="fa-solid fa-user-doctor"></i> Step 1: Symptom Analysis</div>
                    <div class="advice-text">${data.analysis}</div>
                </div>

                <div class="advice-item" style="margin-bottom: 1.5rem;">
                    <div class="advice-label" style="color: var(--color-cyan); font-size: 1.2rem; margin-bottom: 0.5rem;"><i class="fa-solid fa-microscope"></i> Step 2: Possible Causes</div>
                    <div class="advice-text" style="font-weight: 600; font-size: 1.1rem; color: #fff;">${data.name}</div>
                </div>
                
                <div class="advice-item" style="margin-bottom: 1.5rem;">
                    <div class="advice-label" style="color: var(--color-cyan); font-size: 1.2rem; margin-bottom: 0.5rem;"><i class="fa-solid fa-clipboard-question"></i> Step 3: Follow-up Questions</div>
                    <div class="advice-text" style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 10px; border-left: 3px solid var(--color-cyan);">${data.questions}</div>
                </div>

                <div class="advice-item" style="margin-bottom: 1.5rem;">
                    <div class="advice-label" style="color: var(--color-cyan); font-size: 1.2rem; margin-bottom: 0.5rem;"><i class="fa-solid fa-kit-medical"></i> Step 4: Medicines & Home Remedies</div>
                    <div class="advice-text" style="margin-bottom: 0.5rem;"><strong>Medicines:</strong> ${data.medicines}</div>
                    <div class="advice-text"><strong>Home Remedies:</strong> ${data.homeRemedies}</div>
                </div>

                <div class="advice-item" style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1); font-size: 0.9rem; color: rgba(255,255,255,0.5);">
                    <em>Disclaimer: This is a simulated interactive assistant. Consult a real doctor for proper diagnosis.</em>
                </div>
            `;
        } else {
            adviceOutput.innerHTML = `
                <div class="advice-error">
                    <i class="fa-solid fa-circle-exclamation" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                    No data available
                </div>
            `;
        }
    });

    // Allow Enter key to trigger search
    adviceInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            getAdviceBtn.click();
        }
    });
}
