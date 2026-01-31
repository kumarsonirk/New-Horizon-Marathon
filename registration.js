let currentStep = 1;
const totalSteps = 3;
const form = document.getElementById('registrationForm');
const successMessage = document.getElementById('successMessage');
const termsCheckbox = document.getElementById('termsCheckbox');
const submitBtn = document.getElementById('submitBtn');

// 1. Changed ageInput to birthDateInput
const birthDateInput = form.querySelector('input[name="birthDate"]');
const categoryOptions = {
    '3k': document.querySelector('input[name="category"][value="3k"]').closest('.card-radio'),
    '5k': document.querySelector('input[name="category"][value="5k"]').closest('.card-radio'),
    '10k': document.querySelector('input[name="category"][value="10k"]').closest('.card-radio')
};

// 2. Added calculateAge function
function calculateAge(birthDateString) {
    if (!birthDateString) return 0;
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

// 3. Modified updateDistanceOptions
function updateDistanceOptions() {
    if (!birthDateInput) return;
    const age = calculateAge(birthDateInput.value); // Use new function
    const selectedCategory = form.querySelector('input[name="category"]:checked');

    // Hide all options by default
    Object.values(categoryOptions).forEach(option => option.style.display = 'none');

    if (age === 0) { // If no date is entered, age will be 0
        if (selectedCategory) selectedCategory.checked = false;
        return;
    }

    // Show options based on age
    if (age >= 6) {
        categoryOptions['3k'].style.display = 'block';
    }
    if (age >= 12) {
        categoryOptions['5k'].style.display = 'block';
    }
    if (age >= 14) {
        categoryOptions['10k'].style.display = 'block';
    }

    // If the currently selected category is now hidden, uncheck it
    if (selectedCategory && selectedCategory.closest('.card-radio').style.display === 'none') {
        selectedCategory.checked = false;
    }
}

// 4. Modified event listener
if (birthDateInput) {
    birthDateInput.addEventListener('input', updateDistanceOptions);
    // Initial call to set the state when the page loads
    updateDistanceOptions();
}


function toggleMedicalRequirement(isRequired) {
    const textarea = document.getElementById('medicalDetail');
    if (isRequired) {
        textarea.setAttribute('required', 'required');
    } else {
        textarea.removeAttribute('required');
        textarea.classList.remove('input-error');
        document.getElementById('medical-detail-container').classList.remove('has-error');
    }
}

document.querySelectorAll('.numeric-only').forEach(input => {
    input.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
});

termsCheckbox.addEventListener('change', function() {
    submitBtn.disabled = !this.checked;
    submitBtn.style.opacity = this.checked ? '1' : '0.5';
    submitBtn.style.cursor = this.checked ? 'pointer' : 'not-allowed';
    if (this.checked) {
        document.getElementById('terms-group').classList.remove('has-error');
    }
});

function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
}

function validateStep(step) {
    const currentSection = document.getElementById(`step${step}`);
    const inputs = currentSection.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    currentSection.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));
    currentSection.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));

    inputs.forEach(input => {
        let inputValid = true;

        if (input.type === 'radio') {
            const groupName = input.name;
            if (currentSection.querySelector(`input[name="${groupName}"]`)) { 
                const checked = currentSection.querySelector(`input[name="${groupName}"]:checked`);
                if (!checked) {
                    inputValid = false;
                    const groupContainer = input.closest('#gender-group') ||
                                            input.closest('#category-group') ||
                                            input.closest('#experience-group') ||
                                            input.closest('#medical-group');
                    if (groupContainer) groupContainer.classList.add('has-error');
                }
            }
        } else if (input.type === 'email') {
            if (!validateEmail(input.value)) inputValid = false;
        } else if (input.name.toLowerCase().includes('phone')) {
            if (input.value.length !== 10) inputValid = false;
        
        // 5. Replaced 'age' validation with 'birthDate' validation
        } else if (input.name === 'birthDate') {
            if (!input.value.trim()) {
                inputValid = false;
            } else {
                const age = calculateAge(input.value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const dob = new Date(input.value);

                if (dob > today) {
                    input.nextElementSibling.textContent = 'Date of birth cannot be in the future.';
                    inputValid = false;
                } else if (age < 6) {
                    input.nextElementSibling.textContent = 'You must be at least 6 years old to register.';
                    inputValid = false;
                } else {
                    input.nextElementSibling.textContent = 'Please enter a valid date of birth.';
                }
            }
        } else if (input.type === 'checkbox') {
            if (!input.checked) {
                inputValid = false;
                input.closest('#terms-group').classList.add('has-error');
            }
        } else if (!input.value.trim()) {
            inputValid = false;
        }

        if (!inputValid) {
            isValid = false;
            if (input.type !== 'radio' && input.type !== 'checkbox') {
                input.classList.add('input-error');
                if (input.id === 'medicalDetail') {
                    document.getElementById('medical-detail-container').classList.add('has-error');
                }
            }
        }
    });

    return isValid;
}

window.nextStep = function(step) {
    if (validateStep(step)) {
        const currentEl = document.getElementById(`step${step}`);
        currentEl.classList.add('hidden-step');
        
        setTimeout(() => {
            currentStep = step + 1;
            const nextEl = document.getElementById(`step${currentStep}`);
            nextEl.classList.remove('hidden-step');
            updateProgress();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 300);
    }
};

window.prevStep = function(step) {
    const currentEl = document.getElementById(`step${step}`);
    currentEl.classList.add('hidden-step');
    
    setTimeout(() => {
        currentStep = step - 1;
        const prevEl = document.getElementById(`step${currentStep}`);
        prevEl.classList.remove('hidden-step');
        updateProgress();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateStep(3) && validateStep(2) && validateStep(1)) { // Re-validate all steps
        window.location.href = 'thank-you.html';
    }
});

function updateProgress() {
    const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
    
    const stepItems = document.querySelectorAll('.step-item');
    stepItems.forEach((item, index) => {
        const stepNum = index + 1;
        const dot = item.querySelector('.step-dot');
        
        item.classList.remove('active');
        dot.classList.remove('active', 'completed');
        
        if (stepNum < currentStep) {
            dot.innerHTML = '✓';
            dot.classList.add('completed');
        } else if (stepNum === currentStep) {
            dot.innerHTML = stepNum;
            dot.classList.add('active');
            item.classList.add('active');
        } else {
            dot.innerHTML = stepNum;
        }
    });
}

form.addEventListener('input', (e) => {
    if (e.target.required) {
        if (e.target.value.trim()) {
            e.target.classList.remove('input-error');
        }
    }

    if (e.target.type === 'radio') {
        const groupContainer = e.target.closest('.has-error');
        if (groupContainer) groupContainer.classList.remove('has-error');
    }
});