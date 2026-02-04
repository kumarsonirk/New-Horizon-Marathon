<?php
// Always check request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    die('Invalid request');
}
 
// Sanitize inputs
function clean($data) {
    return htmlspecialchars(trim($data));
}
 
// STEP 1 – Runner Profile
$firstName   = clean($_POST['firstName'] ?? '');
$lastName    = clean($_POST['lastName'] ?? '');
$email       = clean($_POST['email'] ?? '');
$phone       = clean($_POST['phone'] ?? '');
$birthDate   = clean($_POST['birthDate'] ?? '');
$gender      = clean($_POST['gender'] ?? '');
$tshirtSize  = clean($_POST['tshirtSize'] ?? '');
$ageCategoryRange = clean($_POST['ageCategoryRange'] ?? '');
$couponCode  = clean($_POST['couponCode'] ?? '');
 
// STEP 2 – Race Details
$category        = clean($_POST['category'] ?? '');
$hasRunBefore    = clean($_POST['hasRunBefore'] ?? '');
$pastDistance    = clean($_POST['pastDistance'] ?? '');
$pastTime        = clean($_POST['pastTime'] ?? '');
$medical         = clean($_POST['medical'] ?? '');
$medicalDetail   = clean($_POST['medicalDetail'] ?? '');
 
// STEP 3 – Emergency Contact
$emergencyName   = clean($_POST['emergencyName'] ?? '');
$emergencyPhone  = clean($_POST['emergencyPhone'] ?? '');
$relationship    = clean($_POST['relationship'] ?? '');
 
// Terms (checkboxes)
$terms1 = isset($_POST['termsConfirm1']) ? 1 : 0;
$terms2 = isset($_POST['termsConfirm2']) ? 1 : 0;
 
// Example: simple validation
if (
    empty($firstName) || empty($email) || empty($phone) ||
    empty($category) || empty($emergencyName)
) {
    die('Required fields are missing');
}
// 👉 At this point data is ready for:
// - database insert
// - payment page redirect
// - confirmation page
 
echo "<h2>Registration Successful</h2>";
echo "<pre>";
print_r($_POST);
echo "</pre>";