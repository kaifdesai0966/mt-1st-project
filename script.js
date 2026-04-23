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

// ==================== WEEKLY SCHEDULE LOGIC ====================
const STORAGE_KEY = 'aura_medicines';

// Track already notified reminders in this session so we don't spam
const notifiedReminders = new Set();

function getMedicines() {
    let meds = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!meds || meds.length === 0) {
        // Initialize with default medicines
        meds = [
            { id: generateId(), name: 'Medicine 1', dosage: 'After Breakfast', time: '09:00', days: [0, 1, 2, 3, 4, 5, 6], statusLog: {}, icon: 'fa-pills', color: 'cyan' },
            { id: generateId(), name: 'Medicine 2', dosage: 'With Water', time: '14:00', days: [0, 1, 2, 3, 4, 5, 6], statusLog: {}, icon: 'fa-prescription-bottle-medical', color: 'yellow' },
            { id: generateId(), name: 'Medicine 3', dosage: 'Before Bed', time: '22:30', days: [0, 1, 2, 3, 4, 5, 6], statusLog: {}, icon: 'fa-moon', color: 'pink' }
        ];
        saveMedicines(meds);
    }
    return meds;
}

function saveMedicines(medicines) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(medicines));
}

function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

function getDayName(dayIndex) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[dayIndex];
}

const addReminderBtn = document.getElementById('add-reminder-btn');
const reminderModal = document.getElementById('reminder-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const reminderForm = document.getElementById('reminder-form');
const weeklyTableBody = document.getElementById('weekly-table-body');
const missedAlertsContainer = document.getElementById('missed-alerts-container');
const remindersGrid = document.getElementById('reminders-grid');

if (addReminderBtn && reminderModal && closeModalBtn) {
    addReminderBtn.addEventListener('click', () => {
        reminderForm.reset();
        document.getElementById('reminder-id').value = '';
        reminderModal.classList.remove('hidden');
    });

    closeModalBtn.addEventListener('click', () => {
        reminderModal.classList.add('hidden');
    });

    reminderModal.addEventListener('click', (e) => {
        if (e.target === reminderModal) reminderModal.classList.add('hidden');
    });
}

if (reminderForm) {
    reminderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const idInput = document.getElementById('reminder-id').value;
        const name = document.getElementById('modal-med-name').value;
        const dosage = document.getElementById('modal-med-dosage').value;
        const time = document.getElementById('modal-med-time').value;
        
        const daysNodes = document.querySelectorAll('input[name="days"]:checked');
        const selectedDays = Array.from(daysNodes).map(node => parseInt(node.value));
        
        if (selectedDays.length === 0) {
            alert('Please select at least one day.');
            return;
        }

        const medicines = getMedicines();
        
        if (idInput) {
            const index = medicines.findIndex(m => m.id === idInput);
            if (index !== -1) {
                medicines[index] = { ...medicines[index], name, dosage, time, days: selectedDays };
            }
        } else {
            // Assign random icon and color for new medicines for demo purposes
            const icons = ['fa-pills', 'fa-prescription-bottle-medical', 'fa-moon', 'fa-capsules', 'fa-syringe'];
            const colors = ['cyan', 'yellow', 'pink', 'green', 'purple'];
            
            medicines.push({
                id: generateId(),
                name,
                dosage,
                time,
                days: selectedDays,
                statusLog: {},
                icon: icons[Math.floor(Math.random() * icons.length)],
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }
        
        saveMedicines(medicines);
        reminderModal.classList.add('hidden');
        renderUI();
    });
}

function getDateForDayThisWeek(targetDayIndex) {
    const today = new Date();
    const currentDayIndex = today.getDay();
    const distance = targetDayIndex - currentDayIndex;
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + distance);
    
    const offset = targetDate.getTimezoneOffset();
    const localTargetDate = new Date(targetDate.getTime() - (offset*60*1000));
    return localTargetDate.toISOString().split('T')[0];
}

function getMinutesDifference(timeStr) {
    const now = new Date();
    const [hours, minutes] = timeStr.split(':').map(Number);
    const target = new Date();
    target.setHours(hours, minutes, 0, 0);
    return (now.getTime() - target.getTime()) / 60000;
}

function formatTimeAMPM(timeStr) {
    let [hours, minutes] = timeStr.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours < 10 ? '0' + hours : hours}:${minutes} ${ampm}`;
}

function updateDateBadge() {
    const badge = document.getElementById('current-date-badge');
    if (badge) {
        const options = { month: 'long', day: 'numeric' };
        const dateString = new Date().toLocaleDateString('en-US', options);
        badge.innerText = `Today, ${dateString}`;
    }
}

function renderCards() {
    if (!remindersGrid) return;
    const medicines = getMedicines();
    remindersGrid.innerHTML = '';
    
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localToday = new Date(today.getTime() - (offset*60*1000));
    const todayDateKey = localToday.toISOString().split('T')[0];
    const todayIndex = today.getDay();
    
    // Filter to medicines scheduled for today, or just show first 3 for UI purposes if none today
    let todayMeds = medicines.filter(m => m.days.includes(todayIndex));
    if (todayMeds.length === 0) todayMeds = medicines.slice(0, 3);
    else todayMeds = todayMeds.slice(0, 3); // Max 3 cards as per design
    
    todayMeds.forEach(med => {
        const loggedStatus = med.statusLog ? med.statusLog[todayDateKey] : null;
        let cardClass = 'glass-card';
        let btnHtml = '';
        
        if (loggedStatus === 'taken') {
            cardClass += ' card-taken';
            btnHtml = `<button class="action-btn" disabled style="background: var(--color-green); color: #0b1120; border: none;"><i class="fa-solid fa-check"></i> TAKEN</button>`;
        } else if (loggedStatus === 'missed') {
            cardClass += ' card-missed';
            btnHtml = `<button class="action-btn" disabled style="color: var(--color-pink); border-color: var(--color-pink); background: transparent;">MISSED</button>`;
        } else {
            cardClass += ' active-card';
            btnHtml = `<button class="action-btn" onclick="markAsTaken('${med.id}', '${todayDateKey}')">Mark as Taken</button>`;
        }
        
        const cardHtml = `
            <div class="${cardClass}">
                ${loggedStatus === 'missed' ? '<div class="missed-badge">Missed</div>' : ''}
                <div class="card-top">
                    <div class="time-box"><i class="fa-regular fa-clock"></i> ${formatTimeAMPM(med.time)}</div>
                    <i class="fa-solid fa-ellipsis menu-dots"></i>
                </div>
                <div class="card-icon icon-${med.color || 'cyan'}">
                    <i class="fa-solid ${med.icon || 'fa-pills'}"></i>
                </div>
                <h3 class="med-name">${med.name}</h3>
                <p class="med-detail">${med.dosage}</p>
                ${btnHtml}
            </div>
        `;
        remindersGrid.innerHTML += cardHtml;
    });
}

function renderWeeklySchedule() {
    if (!weeklyTableBody) return;
    const medicines = getMedicines();
    weeklyTableBody.innerHTML = '';
    
    if (medicines.length === 0) return;
    
    medicines.forEach(med => {
        const tr = document.createElement('tr');
        
        let rowHtml = `
            <td><strong>${med.name}</strong><div style="font-size:0.8rem;color:var(--text-secondary)">${med.dosage}</div></td>
            <td style="font-weight:600;color:var(--color-yellow)">${formatTimeAMPM(med.time)}</td>
        `;
        
        const dayOrder = [1, 2, 3, 4, 5, 6, 0];
        
        dayOrder.forEach(dayIndex => {
            if (med.days.includes(dayIndex)) {
                const dateKey = getDateForDayThisWeek(dayIndex);
                const loggedStatus = med.statusLog && med.statusLog[dateKey] ? med.statusLog[dateKey] : null;
                
                if (loggedStatus === 'taken') {
                    rowHtml += `<td><i class="fa-solid fa-check" style="color: var(--color-green); font-size: 1.2rem;"></i></td>`;
                } else if (loggedStatus === 'missed') {
                    rowHtml += `<td><i class="fa-solid fa-xmark" style="color: var(--color-pink); font-size: 1.2rem;"></i></td>`;
                } else {
                    rowHtml += `<td><i class="fa-regular fa-clock" style="color: var(--color-yellow); font-size: 1.2rem;"></i></td>`;
                }
            } else {
                rowHtml += `<td style="color: rgba(255,255,255,0.2);">-</td>`;
            }
        });
        
        rowHtml += `<td><button class="table-btn btn-view">View</button></td>`;
        tr.innerHTML = rowHtml;
        weeklyTableBody.appendChild(tr);
    });
}

window.markAsTaken = function(medId, dateKey) {
    const medicines = getMedicines();
    const med = medicines.find(m => m.id === medId);
    if (med) {
        if (!med.statusLog) med.statusLog = {};
        med.statusLog[dateKey] = 'taken';
        saveMedicines(medicines);
        renderUI();
    }
};

function showToast(title, message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast-notification type-${type}`;
    
    const icon = type === 'info' ? 'fa-bell' : 'fa-circle-exclamation';
    
    toast.innerHTML = `
        <i class="fa-solid ${icon} fa-xl"></i>
        <div>
            <strong style="display:block; margin-bottom: 0.2rem;">${title}</strong>
            <span style="font-size: 0.9rem; color: var(--text-secondary);">${message}</span>
        </div>
    `;
    
    container.appendChild(toast);
    
    // Attempt Browser Notification
    if (Notification && Notification.permission === "granted") {
        new Notification(title, { body: message });
    }
    
    setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 5000);
}

// Request Notification Permission
const notifyBtn = document.getElementById('notify-btn');
if (notifyBtn) {
    notifyBtn.addEventListener('click', () => {
        if (Notification && Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    });
}

function checkMissedDoses() {
    const medicines = getMedicines();
    const today = new Date();
    const todayIndex = today.getDay();
    
    const offset = today.getTimezoneOffset();
    const localToday = new Date(today.getTime() - (offset*60*1000));
    const todayDateKey = localToday.toISOString().split('T')[0];
    let changed = false;
    
    const missedAlerts = [];
    
    medicines.forEach(med => {
        if (med.days.includes(todayIndex)) {
            const loggedStatus = med.statusLog ? med.statusLog[todayDateKey] : null;
            const diff = getMinutesDifference(med.time);
            const notifyKey = `${med.id}-${todayDateKey}`;
            
            if (loggedStatus !== 'taken' && loggedStatus !== 'missed') {
                // Reminder Alert (between 0 and 2 minutes after)
                if (diff >= 0 && diff < 2 && !notifiedReminders.has(notifyKey)) {
                    showToast("Medicine Reminder", `Time to take your medicine: ${med.name}`, 'info');
                    notifiedReminders.add(notifyKey);
                }
                
                // Missed Alert (Grace period of 30 minutes)
                if (diff >= 30) {
                    if (!med.statusLog) med.statusLog = {};
                    med.statusLog[todayDateKey] = 'missed';
                    changed = true;
                    showToast("Missed Dose", `You missed your medicine: ${med.name}`, 'error');
                }
            }
        }
        
        if (med.statusLog) {
            Object.keys(med.statusLog).forEach(dateStr => {
                if (med.statusLog[dateStr] === 'missed') {
                    const dateObj = new Date(dateStr + "T00:00:00");
                    const dayStr = dateStr === todayDateKey ? 'today' : `on ${getDayName(dateObj.getDay())}`;
                    missedAlerts.push(`You missed ${med.name} ${dayStr} at ${formatTimeAMPM(med.time)}`);
                }
            });
        }
    });
    
    if (changed) {
        saveMedicines(medicines);
        renderUI(); // re-render to show missed status
    }
    
    if (missedAlertsContainer) {
        missedAlertsContainer.innerHTML = '';
        if (missedAlerts.length > 0) {
            missedAlerts.forEach(alertText => {
                const div = document.createElement('div');
                div.className = 'missed-alert';
                div.innerHTML = `
                    <div class="missed-alert-content">
                        <i class="fa-solid fa-circle-exclamation"></i>
                        <span>${alertText}</span>
                    </div>
                    <button class="table-btn btn-view">View Details</button>
                `;
                missedAlertsContainer.appendChild(div);
            });
        }
    }
}

function renderUI() {
    updateDateBadge();
    renderCards();
    renderWeeklySchedule();
    checkMissedDoses();
}

document.addEventListener('DOMContentLoaded', () => {
    // Check permission on load
    if (Notification && Notification.permission === "default") {
        Notification.requestPermission();
    }
    
    renderUI();
    setInterval(checkMissedDoses, 60000);
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
