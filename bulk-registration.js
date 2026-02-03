document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('bulkRegistrationForm');
    const submitBtn = document.getElementById('submitBtn');
    const fileInput = document.getElementById('bulk-upload-file');
    const fileUploadLabel = document.querySelector('label[for="bulk-upload-file"]');
    const filenameSpan = document.getElementById('file-upload-filename');
    const downloadBtn = document.getElementById('downloadTemplateBtn');

    let hasDownloadedTemplate = false;

    // Initialize file upload as disabled
    fileInput.disabled = true;
    fileUploadLabel.classList.add('disabled');
    fileUploadLabel.style.cursor = 'not-allowed';

    // 1. Download CSV Template Logic
    downloadBtn.addEventListener('click', () => {
        const headers = [
            "first_name", 
            "last_name", 
            "email", 
            "phone", 
            "birth_date", 
            "gender", 
            "category", 
            "previous_marathon_participation", 
            "farthest_distance_run_km", 
            "time_for_that_distance", 
            "medical", 
            "medical_detail", 
            "emergency_name", 
            "emergency_phone", 
            "relationship"
        ];
        const csvContent = "data:text/csv;charset=utf-8," + headers.join(",");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "bulk-registration-template.csv");
        document.body.appendChild(link); // Required for Firefox
        link.click();
        document.body.removeChild(link);

        // After download initiates:
        hasDownloadedTemplate = true;
        fileInput.disabled = false; // Enable the input
        fileUploadLabel.classList.remove('disabled'); // Remove disabled styling from label
        fileUploadLabel.style.cursor = 'pointer'; // Restore cursor

        // If there was a validation error on file input, clear it as the action is now enabled.
        const fileFieldGroup = fileInput.closest('.field-group');
        if (fileFieldGroup) {
            fileFieldGroup.classList.remove('has-error');
        }
    });

    // 2. File Upload Filename Display
    fileInput.addEventListener('change', (e) => {
        const fieldGroup = fileInput.closest('.field-group');
        if (e.target.files && e.target.files.length > 0) {
            const fileName = e.target.files[0].name;
            filenameSpan.textContent = fileName;
            
            // Remove error state if a file is chosen
            if(fieldGroup.classList.contains('has-error')) {
                fieldGroup.classList.remove('has-error');
            }
        } else {
            filenameSpan.textContent = 'No file selected';
        }
    });

    // 3. Form Submission and Validation
    form.addEventListener('submit', (e) => {
        if (!validateForm()) {
            e.preventDefault(); // Stop submission if validation fails
            console.log("Validation failed.");
        } else {
            // On successful validation, you could process the file or submit the form.
            // For this example, we'll just log to the console and prevent actual submission.
            e.preventDefault();
            alert('Form is valid! (Submission is prevented in this demo)');
            console.log('Form is valid and ready for submission.');
        }
    });
    
    function validateEmail(email) {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    }

    function validateForm() {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required]');

        // Clear all previous errors
        form.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));

        inputs.forEach(input => {
            let inputValid = true;
            const fieldGroup = input.closest('.field-group');

            if (input.type === 'file') {
                if (input.files.length === 0) {
                    inputValid = false;
                }
            } else if (input.type === 'email') {
                if (!validateEmail(input.value)) {
                    inputValid = false;
                }
            } else {
                if (!input.value.trim()) {
                    inputValid = false;
                }
            }
            
            if (!inputValid) {
                isValid = false;
                if (fieldGroup) {
                    fieldGroup.classList.add('has-error');
                }
            }
        });

        return isValid;
    }

    // Real-time validation feedback
    form.addEventListener('input', (e) => {
        const input = e.target;
        const fieldGroup = input.closest('.field-group');
        if (!fieldGroup) return;

        if(fieldGroup.classList.contains('has-error')) {
             let inputValid = true;
             if (input.type === 'email') {
                if (!validateEmail(input.value)) inputValid = false;
             } else if (!input.value.trim()) {
                inputValid = false;
             }

             if(inputValid) {
                fieldGroup.classList.remove('has-error');
             }
        }
    });
});
