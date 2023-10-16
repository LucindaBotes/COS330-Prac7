   // The bot finds the form by its action
   const feedbackForm = document.querySelector('form');
   if (feedbackForm) {
       // A bot will usually fill out every input
       const inputs = feedbackForm.querySelectorAll('input, textarea');
       for (let input of inputs) {
               input.value = 'bot_data'; 
       }
   feedbackForm.dispatchEvent(new Event('submit'));
   }