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

// Attach event listeners to buttons after DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
  const addButton = document.getElementById('addButton');
  const checkButton = document.getElementById('checkButton');

  if (addButton) {
    addButton.addEventListener('click', addPayment);
  }
  if (checkButton) {
    checkButton.addEventListener('click', checkPayment);
  }
});
