// Backend API integration for enhanced-payment-app.html

// Add payment ID to backend
async function addPayment() {
  const paymentIdInput = document.getElementById('addPaymentId');
  const paymentId = paymentIdInput.value.trim();
  const resultElement = document.getElementById('addResult');

  resultElement.textContent = '';
  resultElement.className = 'result';

  if (!paymentId) {
    resultElement.textContent = 'Please enter a payment ID.';
    resultElement.className = 'result show result-error';
    return;
  }

  try {
    const response = await fetch('/add-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payment_id: paymentId })
    });
    const data = await response.json();
    if (response.ok) {
      resultElement.textContent = data.message;
      resultElement.className = 'result show result-success';
      paymentIdInput.value = '';
    } else {
      resultElement.textContent = data.error || 'Error adding payment ID.';
      resultElement.className = 'result show result-error';
    }
  } catch (error) {
    resultElement.textContent = 'Network error.';
    resultElement.className = 'result show result-error';
  }
}

// Check if payment ID exists in backend
async function checkPayment() {
  const paymentIdInput = document.getElementById('checkPaymentId');
  const paymentId = paymentIdInput.value.trim();
  const resultElement = document.getElementById('checkResult');

  resultElement.textContent = '';
  resultElement.className = 'result';

  if (!paymentId) {
    resultElement.textContent = 'Please enter a payment ID to check.';
    resultElement.className = 'result show result-error';
    return;
  }

  try {
    const response = await fetch(`/check-payment?payment_id=${encodeURIComponent(paymentId)}`);
    const data = await response.json();
    if (response.ok) {
      if (data.exists) {
        resultElement.textContent = 'Payment ID exists in the database.';
        resultElement.className = 'result show result-success';
      } else {
        resultElement.textContent = 'Payment ID does not exist.';
        resultElement.className = 'result show result-warning';
      }
    } else {
      resultElement.textContent = data.error || 'Error checking payment ID.';
      resultElement.className = 'result show result-error';
    }
  } catch (error) {
    resultElement.textContent = 'Network error.';
    resultElement.className = 'result show result-error';
  }
}

// Modal control functions
function openModal() {
  const modalContainer = document.getElementById('modalContainer');
  if (modalContainer) {
    modalContainer.classList.add('show');
  }
}

function closeModal() {
  const modalContainer = document.getElementById('modalContainer');
  if (modalContainer) {
    modalContainer.classList.remove('show');
  }
}

// Dark mode toggle
function toggleDarkMode() {
  const body = document.body;
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;

  if (body.classList.contains('dark-mode')) {
    body.classList.remove('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', 'light');
  } else {
    body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    localStorage.setItem('theme', 'dark');
  }
}

// Load theme preference on page load
function loadThemePreference() {
  const theme = localStorage.getItem('theme');
  const body = document.body;
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;

  if (theme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    body.classList.remove('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  }
}

// Attach event listeners to buttons after DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
  const addButton = document.getElementById('addButton');
  const checkButton = document.getElementById('checkButton');
  const modalOpenButton = document.querySelector('.card-option[onclick="openModal()"]');
  const modalCloseButtons = document.querySelectorAll('.modal-close, .btn-outline[onclick="closeModal()"]');
  const themeToggle = document.getElementById('themeToggle');

  if (addButton) {
    addButton.addEventListener('click', addPayment);
  }
  if (checkButton) {
    checkButton.addEventListener('click', checkPayment);
  }
  if (modalOpenButton) {
    modalOpenButton.addEventListener('click', openModal);
  }
  modalCloseButtons.forEach(button => {
    button.addEventListener('click', closeModal);
  });
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleDarkMode);
  }

  loadThemePreference();
});
