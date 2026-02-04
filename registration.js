let currentStep = 1;
const totalSteps = 3;
const form = document.getElementById('registrationForm');
const successMessage = document.getElementById('successMessage');
const termsCheckboxes = document.querySelectorAll('.terms-checkbox');
const submitBtn = document.getElementById('submitBtn');

const birthDateInput = form.querySelector('input[name="birthDate"]');
const ageCategoryRangeInput = document.getElementById('ageCategoryRangeInput'); // New: hidden input
const categoryOptions = {
    '3k': document.querySelector('input[name="category"][value="3k"]').closest('.card-radio'),
    '5k': document.querySelector('input[name="category"][value="5k"]').closest('.card-radio'),
    '10k': document.querySelector('input[name="category"][value="10k"]').closest('.card-radio')
};

const AGE_CATEGORIES_BY_DISTANCE = {
    '10k': [
        { min: 14, max: 17, displayLabel: "14 to 17 years of age", valueLabel: "14-17" },
        { min: 18, max: 30, displayLabel: "18 to 30 years of age", valueLabel: "18-30" },
        { min: 31, max: 40, displayLabel: "31 to 40 years of age", valueLabel: "31-40" },
        { min: 41, max: 50, displayLabel: "41 to 50 years of age", valueLabel: "41-50" },
        { min: 51, max: Infinity, displayLabel: "51 years of age & above", valueLabel: "51+" },
    ],
    '5k': [
        { min: 12, max: 17, displayLabel: "12 to 17 years of age", valueLabel: "12-17" },
        { min: 18, max: 30, displayLabel: "18 to 30 years of age", valueLabel: "18-30" },
        { min: 31, max: 40, displayLabel: "31 to 40 years of age", valueLabel: "31-40" },
        { min: 41, max: 50, displayLabel: "41 to 50 years of age", valueLabel: "41-50" },
        { min: 51, max: Infinity, displayLabel: "51 years of age & above", valueLabel: "51+" },
    ],
    '3k': [
        { min: 6, max: Infinity, displayLabel: "6 years of age & above", valueLabel: "6+" },
    ]
};

function getCategoryRange(age, distance, forDisplay = true) {
    if (age < 6) return forDisplay ? "Not eligible to participate" : "";
    
    if (!distance || !AGE_CATEGORIES_BY_DISTANCE[distance]) {
        return ""; // No distance selected, return empty.
    }

    const categories = AGE_CATEGORIES_BY_DISTANCE[distance];
    for (const category of categories) {
        if (age >= category.min && age <= category.max) {
            if (distance === '3k' && forDisplay) {
                 return "6 years of age & above (Fun Run - No podium categories)";
            }
            return forDisplay ? category.displayLabel : category.valueLabel;
        }
    }
    return forDisplay ? "Not categorized for this distance" : "";
}

// New age calculation functions
function calculateChronologicalAge(birthDateString) {
    if (!birthDateString) return 0;
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age < 0 ? 0 : age;
}

function getDaysSinceLastBirthday(birthDateString) {
    if (!birthDateString) return null;
    const birthDate = new Date(birthDateString);
    const today = new Date();

    const lastBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (lastBirthday > today) {
        lastBirthday.setFullYear(today.getFullYear() - 1);
    }
    
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor((today.getTime() - lastBirthday.getTime()) / oneDay);
}


function getCategoryAge(birthDateString) {
    if (!birthDateString) return 0;
    const chronologicalAge = calculateChronologicalAge(birthDateString);
    const birthDate = new Date(birthDateString);
    const today = new Date();

    const lastBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (lastBirthday > today) {
        lastBirthday.setFullYear(today.getFullYear() - 1);
    }
    
    const oneDay = 1000 * 60 * 60 * 24;
    // Use floor to get whole days
    const daysSinceBirthday = Math.floor((today.getTime() - lastBirthday.getTime()) / oneDay);

    if (daysSinceBirthday > 10) {
        return chronologicalAge + 1;
    } else {
        return chronologicalAge;
    }
}


function updateAgeAndDistanceInfo() {
    if (!birthDateInput) return;
    const dobValue = birthDateInput.value;
    const chronologicalAge = calculateChronologicalAge(dobValue);
    const categoryAge = getCategoryAge(dobValue);
    const daysSinceBirthday = getDaysSinceLastBirthday(dobValue);

    const selectedCategoryEl = form.querySelector('input[name="category"]:checked');
    const selectedDistance = selectedCategoryEl ? selectedCategoryEl.value : null;

    const categoryDisplayLabel = getCategoryRange(categoryAge, selectedDistance, true);
    const categoryValueLabel = getCategoryRange(categoryAge, selectedDistance, false);

    const dobAgeDisplay = document.getElementById('dobAgeDisplay');
    const dobAgeInfo = document.getElementById('dobAgeInfo');
    const ageDisplay = document.getElementById('ageDisplay');
    const ageInfoContainer = document.getElementById('ageInfoContainer');

    // Handle age display next to DOB input
    if (dobAgeDisplay && dobAgeInfo) {
        if (dobValue) {
            dobAgeDisplay.innerHTML = `Your age is <strong>${chronologicalAge} years and ${daysSinceBirthday} days</strong>.`;
            dobAgeInfo.style.display = 'block';
        } else {
            dobAgeDisplay.innerHTML = '';
            dobAgeInfo.style.display = 'none';
        }
    }

    // Handle category display in Step 2
    if (ageDisplay && ageInfoContainer) {
        if (dobValue) {
            let categoryText = '';
            if (selectedDistance) {
                categoryText = `Your category for ${selectedDistance.toUpperCase()} is: <strong>${categoryDisplayLabel}</strong>.`;
            } else {
                categoryText = `Please select a distance to see your age category.`;
            }
            ageDisplay.innerHTML = categoryText;
            ageInfoContainer.style.display = 'block';

            if (ageCategoryRangeInput) {
                ageCategoryRangeInput.value = categoryValueLabel;
            }
        } else {
            ageDisplay.innerHTML = '';
            ageInfoContainer.style.display = 'none';
            if (ageCategoryRangeInput) {
                ageCategoryRangeInput.value = '';
            }
        }
    }

    const selectedCategoryRadio = form.querySelector('input[name="category"]:checked');

    Object.values(categoryOptions).forEach(option => option.style.display = 'none');

    if (categoryAge === 0) {
        if (selectedCategoryRadio) selectedCategoryRadio.checked = false;
        return;
    }

    if (categoryAge >= 6) {
        categoryOptions['3k'].style.display = 'block';
    }
    if (categoryAge >= 12) {
        categoryOptions['5k'].style.display = 'block';
    }
    if (categoryAge >= 14) {
        categoryOptions['10k'].style.display = 'block';
    }

    if (selectedCategoryRadio && selectedCategoryRadio.closest('.card-radio').style.display === 'none') {
        selectedCategoryRadio.checked = false;
    }
}

if (birthDateInput) {
    birthDateInput.addEventListener('input', updateAgeAndDistanceInfo);
}

document.querySelectorAll('input[name="category"]').forEach(radio => {
    radio.addEventListener('change', () => {
        updateAgeAndDistanceInfo();
        const pastRunContainer = document.getElementById('past-run-container');
        const hasRunBeforeRadios = form.querySelectorAll('input[name="hasRunBefore"]');

        const selectedCategory = form.querySelector('input[name="category"]:checked');
        if (selectedCategory) {
            pastRunContainer.style.display = 'flex';
            hasRunBeforeRadios.forEach(r => r.setAttribute('required', 'required'));
        } else {
            pastRunContainer.style.display = 'none';
            hasRunBeforeRadios.forEach(r => r.removeAttribute('required'));
        }
        updateSubmitButtonState(); // Update submit button state after category change
    });
});

updateAgeAndDistanceInfo();


function toggleMedicalRequirement(isRequired) {
    const textarea = document.getElementById('medicalDetail');
    const container = document.getElementById('medical-detail-container');

    if (isRequired) {
        container.style.display = 'block';
        textarea.setAttribute('required', 'required');
    } else {
        container.style.display = 'none';
        textarea.removeAttribute('required');
        textarea.classList.remove('input-error');
        container.classList.remove('has-error');
    }
}

document.querySelectorAll('.numeric-only').forEach(input => {
    input.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
});

// New function to check overall form validity and update submit button state
function updateSubmitButtonState() {
    const isStep1Valid = validateStep(1, false); // Check validity without displaying errors
    const isStep2Valid = validateStep(2, false);
    const isStep3Valid = validateStep(3, false); // This will include terms validation

    const isFormFullyValid = isStep1Valid && isStep2Valid && isStep3Valid;

    submitBtn.disabled = !isFormFullyValid;
    submitBtn.style.opacity = isFormFullyValid ? '1' : '0.5';
    submitBtn.style.cursor = isFormFullyValid ? 'pointer' : 'not-allowed';
}

// Modify checkAllTerms to remove its direct control over submitBtn
// and ensure it still handles the terms-group error class.
function checkAllTerms() {
    const allChecked = Array.from(termsCheckboxes).every(cb => cb.checked);
    if (!allChecked) {
        document.getElementById('terms-group').classList.add('has-error');
    } else {
        document.getElementById('terms-group').classList.remove('has-error');
    }
    updateSubmitButtonState(); // Update submit button state after terms change
}

termsCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', checkAllTerms);
});

// Listener for category selection to show the 'run before' prompt
document.querySelectorAll('input[name="category"]').forEach(radio => {
    radio.addEventListener('change', () => {
        const pastRunContainer = document.getElementById('past-run-container');
        const hasRunBeforeRadios = form.querySelectorAll('input[name="hasRunBefore"]');

        const selectedCategory = form.querySelector('input[name="category"]:checked');
        if (selectedCategory) {
            pastRunContainer.style.display = 'flex';
            hasRunBeforeRadios.forEach(r => r.setAttribute('required', 'required'));
        } else {
            pastRunContainer.style.display = 'none';
            hasRunBeforeRadios.forEach(r => r.removeAttribute('required'));
        }
        updateSubmitButtonState(); // Update submit button state after category change
    });
});

// Listener for 'has run before' radio buttons to show details
document.querySelectorAll('input[name="hasRunBefore"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        const pastRunDetailsContainer = document.getElementById('past-run-details-container');
        const pastDistanceInput = form.querySelector('input[name="pastDistance"]');
        const pastTimeInput = form.querySelector('input[name="pastTime"]');
        
        pastDistanceInput.addEventListener('input', function() {
            if (this.value.length > 2) {
                this.value = this.value.slice(0, 2);
            }
        });
        if (e.target.value === 'yes') {
            pastRunDetailsContainer.style.display = 'grid';
            pastDistanceInput.setAttribute('required', 'required');
            pastTimeInput.setAttribute('required', 'required');
        } else {
            pastRunDetailsContainer.style.display = 'none';
            pastDistanceInput.removeAttribute('required');
            pastTimeInput.removeAttribute('required');
            // Also clear errors if any
            pastDistanceInput.closest('.field-group').classList.remove('has-error');
            pastDistanceInput.classList.remove('input-error');
            pastTimeInput.closest('.field-group').classList.remove('has-error');
            pastTimeInput.classList.remove('input-error');
        }
        updateSubmitButtonState(); // Update submit button state after 'has run before' change
    });
});

function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
}

function validateStep(step, displayErrors = true) {
    const currentSection = document.getElementById(`step${step}`);
    const inputs = currentSection.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    if (displayErrors) {
        currentSection.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));
        currentSection.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    }

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
                                            input.closest('#medical-group') ||
                                            input.closest('#past-run-group');
                    if (groupContainer && displayErrors) groupContainer.classList.add('has-error');
                }
            }
        } else if (input.type === 'email') {
            if (!validateEmail(input.value)) inputValid = false;
        } else if (input.name.toLowerCase().includes('phone')) {
            if (input.value.length !== 10) inputValid = false;
        
        } else if (input.name === 'birthDate') {
            if (!input.value.trim()) {
                inputValid = false;
            } else {
                const chronologicalAge = calculateChronologicalAge(input.value); // Use chronological age for validation
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const dob = new Date(input.value);

                if (dob > today) {
                    if (displayErrors) input.nextElementSibling.textContent = 'Date of birth cannot be in the future.';
                    inputValid = false;
                } else if (chronologicalAge < 6) { // Minimum age check
                    if (displayErrors) input.nextElementSibling.textContent = 'You must be at least 6 years old to register.';
                    inputValid = false;
                } else {
                    if (displayErrors) input.nextElementSibling.textContent = 'Please enter a valid date of birth.';
                }
            }
        } else if (input.type === 'file' && input.name === 'idCard') {
            // Find the error text element associated with this input
            const parentFieldGroup = input.closest('.field-group');
            const errorTextElement = parentFieldGroup ? parentFieldGroup.querySelector('.error-text') : null;

            if (input.files.length === 0) {
                inputValid = false;
                if (errorTextElement && displayErrors) errorTextElement.textContent = 'Please upload your ID card.';
            } else {
                const file = input.files[0];
                const maxSize = 2 * 1024 * 1024; // 2MB

                // Validate file type
                const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
                if (!allowedTypes.includes(file.type)) {
                    inputValid = false;
                    if (errorTextElement && displayErrors) errorTextElement.textContent = 'Only JPG, PNG, or PDF files are allowed.';
                } 
                // Validate file size
                else if (file.size > maxSize) {
                    inputValid = false;
                    if (errorTextElement && displayErrors) errorTextElement.textContent = 'File size must be 2MB or less.';
                } else {
                    // Reset to default message if valid
                    if (errorTextElement && displayErrors) errorTextElement.textContent = 'Please upload your ID card.'; 
                }
            }
        } else if (input.name === 'pastDistance') {
            if (input.value <= 0) {
                inputValid = false;
            }
        } else if (input.name === 'pastTime') {
            const timeRegex = /^\d{1,2}:[0-5]\d:[0-5]\d$/;
            if (!timeRegex.test(input.value)) {
                inputValid = false;
                if (displayErrors) input.nextElementSibling.textContent = "Please use HH:MM:SS format.";
            } else {
                if (displayErrors) input.nextElementSibling.textContent = "Please enter time in HH:MM:SS format.";
            }
        } else if (input.type === 'checkbox') {
            if (!input.checked) {
                inputValid = false;
                if (displayErrors) input.closest('#terms-group').classList.add('has-error');
            }
        } else if (!input.value.trim()) {
            inputValid = false;
        }

        if (!inputValid) {
            isValid = false;
            if (displayErrors) {
                const fieldGroup = input.closest('.field-group');
                if (fieldGroup) {
                    fieldGroup.classList.add('has-error');
                }
                
                // Add input-error for inputs that need it (text, email, etc.)
                if (input.type !== 'radio' && input.type !== 'checkbox' && input.type !== 'file') {
                     input.classList.add('input-error');
                }
            }
        }
    });

    // Specific terms and conditions validation, only if displayErrors is true
    if (step === 3 && displayErrors) {
        const allTermsChecked = Array.from(termsCheckboxes).every(cb => cb.checked);
        if (!allTermsChecked) {
            isValid = false;
            document.getElementById('terms-group').classList.add('has-error');
        }
    }


    // Validate Coupon Code (Optional but must be 10 digits if entered)
    const couponInput = currentSection.querySelector('input[name="couponCode"]');
    if (couponInput && couponInput.value.trim() !== '') {
        if (couponInput.value.length !== 10) {
            isValid = false;
            if (displayErrors) {
                const fieldGroup = couponInput.closest('.field-group');
                if (fieldGroup) fieldGroup.classList.add('has-error');
                couponInput.classList.add('input-error');
            }
        }
    }

    return isValid;
}

window.nextStep = function(step) {
    if (validateStep(step, true)) {
        const currentEl = document.getElementById(`step${step}`);
        currentEl.classList.add('hidden-step');
        
        setTimeout(() => {
            currentStep = step + 1;
            const nextEl = document.getElementById(`step${currentStep}`);
            nextEl.classList.remove('hidden-step');
            updateProgress();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            updateSubmitButtonState(); // Call after step change
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
        updateSubmitButtonState(); // Call after step change
    }, 300);
};

form.addEventListener('submit', (e) => {
    // Re-validate all steps. If any step is invalid, prevent submission.
    // The validation functions will add error classes, which are handled by the CSS.
    if (!validateStep(1, true) || !validateStep(2, true) || !validateStep(3, true)) {
        e.preventDefault(); // Prevent submission if validation fails
    }
    // If all steps are valid, the form will submit naturally to 'process_payment1.php'
    // No need for window.location.href = 'thank-you.html'; here, as the server-side
    // script (process_payment1.php) should handle redirection after processing.
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
    // Find the parent field-group and remove its error state
    const fieldGroup = e.target.closest('.field-group');
    if (fieldGroup && fieldGroup.classList.contains('has-error')) {
        fieldGroup.classList.remove('has-error');

        // Also attempt to remove .input-error from the visual element
        const inputElement = fieldGroup.querySelector('.input-error');
        if (inputElement) {
            inputElement.classList.remove('input-error');
        }
    }
});

const idCardInput = document.getElementById('idCard');
if (idCardInput) {
    const filenameSpan = document.querySelector('.file-upload-filename');
    idCardInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
            filenameSpan.textContent = e.target.files[0].name;
        } else {
            filenameSpan.textContent = 'No file selected';
        }
    });
}