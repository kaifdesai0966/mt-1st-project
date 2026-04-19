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
        q1: "Has your fever lasted for more than 3 days?",
        q2: "Do you have a sore throat or cough?",
        getAdvice: (q1Yes, q2Yes) => {
            let meds = "Acetaminophen (Paracetamol) or Ibuprofen.";
            let rems = "Drink plenty of water, use a cool compress, and rest.";
            if (q1Yes) {
                meds += " <br><strong style='color:var(--color-yellow)'>*Since fever is >3 days, please see a doctor.</strong>";
            }
            if (q2Yes) {
                meds += " Add throat lozenges or a basic cough syrup.";
                rems += " Try a warm salt water gargle and honey.";
            }
            return { medicines: meds, homeRemedies: rems };
        }
    },
    "cold": {
        name: "Common Cold",
        analysis: "Your symptoms indicate a mild viral infection of the upper respiratory tract.",
        q1: "Is your nasal discharge thick and yellowish/green?",
        q2: "Do you have a severe sore throat?",
        getAdvice: (q1Yes, q2Yes) => {
            let meds = "Decongestants and Antihistamines.";
            let rems = "Use a humidifier and practice steam inhalation.";
            if (q1Yes) {
                meds += " <br><strong style='color:var(--color-yellow)'>*Yellow/green mucus could indicate a bacterial infection. Consult a doctor.</strong>";
            }
            if (q2Yes) {
                meds += " Add Acetaminophen for throat pain.";
                rems += " Gargle with warm salt water.";
            }
            return { medicines: meds, homeRemedies: rems };
        }
    },
    "cough": {
        name: "Respiratory Infection or Allergy",
        analysis: "A cough is a reflex action to clear your airways of mucus and irritants.",
        q1: "Are you coughing up thick phlegm?",
        q2: "Do you experience shortness of breath?",
        getAdvice: (q1Yes, q2Yes) => {
            let meds = "Cough suppressants (Dextromethorphan) for dry cough.";
            let rems = "Honey and warm water, ginger tea.";
            if (q1Yes) {
                meds = "Expectorants (Guaifenesin) to help clear the wet cough. Avoid suppressants.";
            }
            if (q2Yes) {
                meds += " <br><strong style='color:var(--color-pink)'>*Shortness of breath is a red flag. Seek medical attention immediately.</strong>";
            }
            return { medicines: meds, homeRemedies: rems };
        }
    },
    "headache": {
        name: "Tension Headache or Dehydration",
        analysis: "Pain in the head region is most commonly a tension headache, but can be triggered by stress, dehydration, or lack of sleep.",
        q1: "Is the pain sudden and extremely severe?",
        q2: "Does light or sound make the headache worse?",
        getAdvice: (q1Yes, q2Yes) => {
            let meds = "Aspirin, Ibuprofen, or Acetaminophen.";
            let rems = "Massage your neck and stay hydrated.";
            if (q1Yes) {
                meds = "<br><strong style='color:var(--color-pink)'>*A sudden, extreme 'thunderclap' headache is a medical emergency. Go to the ER.</strong>";
            }
            if (q2Yes) {
                rems += " Rest in a dark, quiet room (signs point to a possible migraine).";
            }
            return { medicines: meds, homeRemedies: rems };
        }
    },
    "stomach pain": {
        name: "Indigestion or Mild Gastritis",
        analysis: "Discomfort in the abdomen is often caused by indigestion, trapped gas, or consuming irritating foods.",
        q1: "Is the pain sharp, severe, and localized?",
        q2: "Does the pain worsen after eating certain foods?",
        getAdvice: (q1Yes, q2Yes) => {
            let meds = "Antacids, Simethicone (Gas-X), or Bismuth subsalicylate.";
            let rems = "Apply a heating pad to your stomach and rest.";
            if (q1Yes) {
                meds = "<br><strong style='color:var(--color-pink)'>*Sharp, localized pain (especially lower right) could be appendicitis. See a doctor immediately.</strong>";
            }
            if (q2Yes) {
                rems += " Avoid dairy, spicy foods, and heavily processed meals for a few days.";
            }
            return { medicines: meds, homeRemedies: rems };
        }
    },
    "acidity": {
        name: "Acid Reflux / Heartburn",
        analysis: "A burning sensation in your chest indicates stomach acid is flowing back into the esophagus.",
        q1: "Does the burning sensation worsen when you lie down?",
        q2: "Are you experiencing difficulty swallowing?",
        getAdvice: (q1Yes, q2Yes) => {
            let meds = "Antacids, Omeprazole (OTC), or Ranitidine (OTC).";
            let rems = "Chew fennel seeds and drink cold milk.";
            if (q1Yes) {
                rems += " Sit upright for at least 2 hours after meals and elevate your head when sleeping.";
            }
            if (q2Yes) {
                meds += " <br><strong style='color:var(--color-yellow)'>*Difficulty swallowing is a serious symptom. Please consult a gastroenterologist.</strong>";
            }
            return { medicines: meds, homeRemedies: rems };
        }
    },
    "diarrhea": {
        name: "Viral Gastroenteritis or Food Poisoning",
        analysis: "Loose, watery stools indicate gastrointestinal distress, often caused by a virus or contaminated food.",
        q1: "Have you had diarrhea for more than 2 days?",
        q2: "Is there any blood or black color in your stool?",
        getAdvice: (q1Yes, q2Yes) => {
            let meds = "Loperamide (Imodium) and ORS (Oral Rehydration Salts).";
            let rems = "Follow the BRAT diet (Bananas, Rice, Applesauce, Toast).";
            if (q1Yes) {
                meds += " <br><strong style='color:var(--color-yellow)'>*Prolonged diarrhea risks severe dehydration. Consult a doctor.</strong>";
            }
            if (q2Yes) {
                meds = "<br><strong style='color:var(--color-pink)'>*Blood in stool is a major red flag. Seek medical help immediately. Do NOT take Loperamide.</strong>";
            }
            return { medicines: meds, homeRemedies: rems };
        }
    },
    "vomiting": {
        name: "Stomach Bug or Food Poisoning",
        analysis: "The forceful expulsion of stomach contents is your body's way of clearing out toxins or fighting a stomach bug.",
        q1: "Have you been unable to keep any liquids down for 24 hours?",
        q2: "Do you have a high fever along with the vomiting?",
        getAdvice: (q1Yes, q2Yes) => {
            let meds = "ORS (Oral Rehydration Salts). OTC Antiemetics if available.";
            let rems = "Wait 30-60 minutes after vomiting before sipping water slowly.";
            if (q1Yes) {
                meds = "<br><strong style='color:var(--color-pink)'>*You are at high risk of severe dehydration. Please go to an urgent care clinic for IV fluids.</strong>";
            }
            if (q2Yes) {
                rems += " A fever suggests a viral or bacterial infection rather than just food poisoning. Rest extensively.";
            }
            return { medicines: meds, homeRemedies: rems };
        }
    },
    "sore throat": {
        name: "Pharyngitis (Viral or Bacterial)",
        analysis: "Pain or scratchiness in the throat is typically caused by a viral infection, though strep throat is a bacterial possibility.",
        q1: "Do you have a high fever accompanying the sore throat?",
        q2: "Are there any white patches on the back of your throat?",
        getAdvice: (q1Yes, q2Yes) => {
            let meds = "Throat lozenges, Acetaminophen, Ibuprofen.";
            let rems = "Gargle with warm salt water several times a day and drink warm tea with honey.";
            if (q1Yes || q2Yes) {
                meds += " <br><strong style='color:var(--color-yellow)'>*Fever and white patches are strong indicators of Strep Throat. You may need prescription antibiotics from a doctor.</strong>";
            }
            return { medicines: meds, homeRemedies: rems };
        }
    },
    "allergy": {
        name: "Allergic Rhinitis",
        analysis: "Your immune system is reacting to a foreign substance (allergen) like pollen, dust, or pet dander.",
        q1: "Are your eyes excessively itchy or watery?",
        q2: "Are you experiencing any swelling of the lips or face, or difficulty breathing?",
        getAdvice: (q1Yes, q2Yes) => {
            let meds = "Antihistamines (Cetirizine, Loratadine), Saline nasal spray.";
            let rems = "Use a saline nasal rinse to clear allergens.";
            if (q1Yes) {
                meds += " Add OTC allergy eye drops (Olopatadine or Ketotifen).";
                rems += " Apply a cold compress to your eyes.";
            }
            if (q2Yes) {
                meds = "<br><strong style='color:var(--color-pink)'>*These are signs of anaphylaxis, a severe allergic reaction. Use an EpiPen if available and CALL EMERGENCY SERVICES IMMEDIATELY!</strong>";
            }
            return { medicines: meds, homeRemedies: rems };
        }
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
                
                <div class="advice-item" style="margin-bottom: 1.5rem;" id="step3-container">
                    <div class="advice-label" style="color: var(--color-cyan); font-size: 1.2rem; margin-bottom: 0.5rem;"><i class="fa-solid fa-clipboard-question"></i> Step 3: Follow-up Questions</div>
                    <div class="advice-text" style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 10px; border-left: 3px solid var(--color-cyan);">
                        <div style="margin-bottom: 1.5rem;">
                            <p style="margin-bottom: 0.8rem; font-weight: 500;">${data.q1}</p>
                            <button class="btn-secondary q1-btn" data-ans="yes" style="padding: 0.5rem 1.5rem; font-size: 0.95rem; margin-right: 0.8rem; border-radius: 15px;">Yes</button>
                            <button class="btn-secondary q1-btn" data-ans="no" style="padding: 0.5rem 1.5rem; font-size: 0.95rem; border-radius: 15px;">No</button>
                        </div>
                        <div>
                            <p style="margin-bottom: 0.8rem; font-weight: 500;">${data.q2}</p>
                            <button class="btn-secondary q2-btn" data-ans="yes" style="padding: 0.5rem 1.5rem; font-size: 0.95rem; margin-right: 0.8rem; border-radius: 15px;">Yes</button>
                            <button class="btn-secondary q2-btn" data-ans="no" style="padding: 0.5rem 1.5rem; font-size: 0.95rem; border-radius: 15px;">No</button>
                        </div>
                    </div>
                </div>

                <div id="step4-container" style="display: none; animation: fadeIn 0.5s;">
                    <!-- Step 4 logic dynamically injected here -->
                </div>

                <div class="advice-item" style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1); font-size: 0.9rem; color: rgba(255,255,255,0.5);">
                    <em>Disclaimer: This is a simulated interactive assistant. Consult a real doctor for proper diagnosis.</em>
                </div>
            `;

            let q1Answer = null;
            let q2Answer = null;

            const updateStep4 = () => {
                if (q1Answer !== null && q2Answer !== null) {
                    const advice = data.getAdvice(q1Answer, q2Answer);
                    const step4Container = document.getElementById('step4-container');
                    step4Container.innerHTML = `
                        <div class="advice-item" style="margin-bottom: 1.5rem;">
                            <div class="advice-label" style="color: var(--color-cyan); font-size: 1.2rem; margin-bottom: 0.5rem;"><i class="fa-solid fa-kit-medical"></i> Step 4: Medicines & Home Remedies</div>
                            <div class="advice-text" style="margin-bottom: 0.8rem; background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 10px;"><strong>Medicines:</strong> ${advice.medicines}</div>
                            <div class="advice-text" style="background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 10px;"><strong>Home Remedies:</strong> ${advice.homeRemedies}</div>
                        </div>
                    `;
                    step4Container.style.display = 'block';
                }
            };

            document.querySelectorAll('.q1-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    document.querySelectorAll('.q1-btn').forEach(b => {
                        b.style.background = 'rgba(255, 255, 255, 0.05)';
                        b.style.borderColor = 'var(--glass-border)';
                        b.style.color = '#fff';
                    });
                    e.target.style.background = 'rgba(74, 222, 128, 0.2)';
                    e.target.style.borderColor = '#4ade80';
                    e.target.style.color = '#4ade80';
                    q1Answer = e.target.getAttribute('data-ans') === 'yes';
                    updateStep4();
                });
            });

            document.querySelectorAll('.q2-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    document.querySelectorAll('.q2-btn').forEach(b => {
                        b.style.background = 'rgba(255, 255, 255, 0.05)';
                        b.style.borderColor = 'var(--glass-border)';
                        b.style.color = '#fff';
                    });
                    e.target.style.background = 'rgba(74, 222, 128, 0.2)';
                    e.target.style.borderColor = '#4ade80';
                    e.target.style.color = '#4ade80';
                    q2Answer = e.target.getAttribute('data-ans') === 'yes';
                    updateStep4();
                });
            });

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
