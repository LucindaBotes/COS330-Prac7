document.addEventListener('DOMContentLoaded', function() {
    fetchProducts();
    fetchPotentialHackers();
    const feedbackForm = document.querySelector('form');
    const responseContainer = document.getElementById('response');
    feedbackForm.after(responseContainer);

    feedbackForm.addEventListener('submit', async function(e) {
        console.log('Form submitted');
        e.preventDefault();

        const dataObject = {};
        const formData = new FormData(feedbackForm);

        formData.forEach((value, key) => {
            dataObject[key] = value;
        });

        try {
            const response = await fetch('/submit_feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataObject)
            });
            const result = await response.text();
            responseContainer.textContent = result;
        } catch (error) {
            console.error('There was an error submitting the feedback:', error);
            responseContainer.textContent = 'Error submitting feedback.';
        }
    });
});
async function fetchProducts() {
    try {
        const response = await fetch('/data');
        console.log('Response:', response);
        const products = await response.json();

        const productDisplay = document.getElementById('product-display');
        
        let productsHTML = "";
        for (const product of products) {
            productsHTML += `
                <section class="product">
                    <img class="picture" src="${product.image}" alt="${product.name}">
                    <div class="product-sec">
                        <div class="product-info">
                            <h2 class="name">${product.name}</h2>
                            <p class="description">${product.description}</p>
                            <p class="price">${product.price}</p>
                        </div>
                        <button>Add to Cart</button>
                    </div>
                </section>
            `;
        }
        productDisplay.innerHTML = productsHTML;

    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

async function fetchPotentialHackers() {
    try {
        const response = await fetch('/hackers');
        const hackers = await response.json();

        const hackersDisplay = document.getElementById('potential-hackers');
        hackersDisplay.innerHTML = hackers.map(hacker => `
            <div>
                <ul>
                    <li> IP: ${hacker.ip}</li>
                    <ul>
                    <li>Time: ${hacker.time}</li>
                    <li>City: ${hacker.location.city}</li>
                    <li>Region: ${hacker.location.region}</li>
                    <li>Country: ${hacker.location.country}</li>
                    </ul>     
                </ul>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error fetching potential hackers:', error);
    }
}


function submitFeedback() {
    // This function will be triggered upon form submission due to the onsubmit attribute.
    // However, since we have added an event listener to the form's submit event, 
    // this function doesn't need to contain any logic. 
    // It's here to prevent the default form submission behavior.
    return false; 
}
