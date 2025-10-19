// Array to store quotes (quote text and category)
let quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivational" },
  { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", category: "Inspirational" }
];

// Function to create the form to add new quotes
function createAddQuoteForm() {
  const addQuoteFormContainer = document.createElement("div");
  addQuoteFormContainer.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button id="addQuoteBtn">Add Quote</button>
  `;
  
  document.body.appendChild(addQuoteFormContainer);  // Appends the form to the body
  document.getElementById("addQuoteBtn").addEventListener("click", addQuote); // Attach event listener to the button
}

// Function to display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quoteDisplay = document.getElementById("quoteDisplay");
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `<p>"${quote.text}"</p><p><i>- ${quote.category}</i></p>`;
}

// Function to add a new quote dynamically
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;
  
  // Ensure both fields are filled
  if (newQuoteText && newQuoteCategory) {
    // Add the new quote to the array
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    
    // Clear the input fields
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    
    // Optionally show an alert
    alert("New quote added!");
    
    // Display the updated list of quotes or the new quote
    showRandomQuote();
  } else {
    alert("Please enter both quote text and category.");
  }
}

// Event listener for the "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Initialize the form on page load
createAddQuoteForm();

// Load quotes from localStorage on page load
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Call loadQuotes() when the script runs
loadQuotes();

// Updated addQuote function to save quotes to localStorage
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;
  
  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotes();  // Save updated quotes to localStorage
    
    // Clear input fields
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    
    // Display updated quote
    showRandomQuote();
  } else {
    alert("Please enter both quote text and category.");
  }
}

// Ensure the random quote button works
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Function to store last viewed quote in sessionStorage
function storeLastViewedQuote(index) {
  sessionStorage.setItem("lastViewedQuoteIndex", index);
}

// When displaying a random quote, store its index in sessionStorage
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quoteDisplay = document.getElementById("quoteDisplay");
  const quote = quotes[randomIndex];
  
  quoteDisplay.innerHTML = `<p>"${quote.text}"</p><p><i>- ${quote.category}</i></p>`;
  
  // Store the last viewed quote index in sessionStorage
  storeLastViewedQuote(randomIndex);
}
// Function to import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);  // Append imported quotes to the current array
    saveQuotes();  // Save updated quotes to localStorage
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}
