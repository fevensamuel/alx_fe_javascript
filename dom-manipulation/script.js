// Array to store quotes (quote text and category)
let quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivational" },
  { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", category: "Inspirational" }
  { text: "Believe in yourself and all that you are.", category: "Motivational" },
  { text: "The best way to predict the future is to create it.", category: "Inspirational" }

];


// Function to fetch quotes from the mock server (JSONPlaceholder for demo)
function fetchQuotesFromServer() {
  fetch('https://jsonplaceholder.typicode.com/posts') // This is just for demo purposes; replace with your API
    .then(response => response.json())
    .then(serverQuotes => {
      const updatedQuotes = resolveConflicts(serverQuotes);
      saveQuotesToLocal(updatedQuotes); // Sync with local storage
      notifyUser('Data has been updated from the server!');
    })
    .catch(error => {
      console.error('Error fetching from server:', error);
    });
}

// Function to post a new quote to the mock server (simulated)
function postQuoteToServer(newQuote) {
  fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: newQuote.text, // Simulate sending quote text as title
      body: newQuote.category, // Simulate category as body
      userId: 1 // This is a placeholder for user data
    })
  })
    .then(response => response.json())
    .then(serverResponse => {
      console.log('Posted to server:', serverResponse);
      alert('New quote has been posted to the server!');
    })
    .catch(error => {
      console.error('Error posting to server:', error);
    });
}

// Function to handle conflicts between local and server quotes
function resolveConflicts(serverQuotes) {
  serverQuotes.forEach(serverQuote => {
    const existingQuoteIndex = quotes.findIndex(quote => quote.id === serverQuote.id);
    if (existingQuoteIndex !== -1) {
      quotes[existingQuoteIndex] = serverQuote; // Replace local data with server data
    } else {
      quotes.push(serverQuote); // Add new quote from server
    }
  });
  return quotes; // Return updated quotes
}

// Function to save quotes to local storage
function saveQuotesToLocal(updatedQuotes) {
  localStorage.setItem('quotes', JSON.stringify(updatedQuotes)); // Save to local storage
  quotes = updatedQuotes; // Update in-memory quotes array
}

// Function to notify the user about updates
function notifyUser(message) {
  const notificationElement = document.createElement("div");
  notificationElement.classList.add("notification");
  notificationElement.innerHTML = message;
  document.body.appendChild(notificationElement);

  setTimeout(() => {
    notificationElement.remove(); // Remove notification after 5 seconds
  }, 5000);
}

// Function to handle adding a new quote (this would be connected to a form in your HTML)
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;
  
  if (newQuoteText && newQuoteCategory) {
    const newQuote = {
      id: Date.now(), // Generate unique ID based on timestamp
      text: newQuoteText,
      category: newQuoteCategory
    };
    quotes.push(newQuote);
    saveQuotesToLocal(quotes); // Save new quote to local storage
    postQuoteToServer(newQuote); // Optionally post to server
    alert('New quote added!');
  } else {
    alert('Please enter both quote text and category.');
  }
}

// Set interval for periodic data fetching (every 10 minutes)
setInterval(fetchQuotesFromServer, 600000); // 600000 ms = 10 minutes

// Event listener for the "Add Quote" button (connected to an HTML button)
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);

// Event listener for periodic fetch on page load
window.onload = function() {
  fetchQuotesFromServer(); // Fetch quotes when the page loads
};


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

// Function to filter quotes based on selected category
function filterQuotes() {
  const categoryFilter = document.getElementById("categoryFilter").value;
  const filteredQuotes = categoryFilter === "all" ? quotes : quotes.filter(quote => quote.category === categoryFilter);
  displayQuotes(filteredQuotes);
  
  // Save the selected category to localStorage
  localStorage.setItem("selectedCategory", categoryFilter);
}

// Function to display quotes on the page
function displayQuotes(quotesToDisplay) {
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";
  quotesToDisplay.forEach(quote => {
    quoteDisplay.innerHTML += `<p>"${quote.text}"</p><p><i>- ${quote.category}</i></p>`;
  });
}

// Function to populate the category dropdown dynamically
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  
  // Extract unique categories from the quotes array
  const categories = [...new Set(quotes.map(quote => quote.category))];

  // Add each category to the dropdown
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Add "All Categories" as the first option
  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All Categories";
  categoryFilter.insertBefore(allOption, categoryFilter.firstChild);
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
// Function to export quotes to JSON file
function exportToJsonFile() {
  // Create a Blob with the quotes array as JSON
  const quotesBlob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  
  // Create a temporary URL for the Blob object
  const url = URL.createObjectURL(quotesBlob);
  
  // Create an invisible anchor tag to trigger the download
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";  // Set the default filename for the download
  a.click();  // Simulate the click to trigger download
  
  // Revoke the temporary URL after download
  URL.revokeObjectURL(url);
}

// Add the export button to your HTML
document.getElementById("exportQuotesBtn").addEventListener("click", exportToJsonFile);
// Function to import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();  // Create a new FileReader object
  
  fileReader.onload = function(event) {
    try {
      // Parse the JSON from the file contents
      const importedQuotes = JSON.parse(event.target.result);
      
      // Ensure the data is an array of quotes
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);  // Append imported quotes to the existing array
        saveQuotes();  // Save the updated quotes to localStorage
        alert('Quotes imported successfully!');
        showRandomQuote();  // Optionally display a random quote after import
      } else {
        alert('Invalid file format: The file must contain an array of quotes.');
      }
    } catch (error) {
      alert('Error reading or parsing the JSON file: ' + error.message);
    }
  };
  
  // Read the file as text
  fileReader.readAsText(event.target.files[0]);
}

// Attach the function to the file input
document.getElementById("importFile").addEventListener("change", importFromJsonFile);
let quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivational" },
  { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", category: "Inspirational" }
];

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

// Function to show a random quote
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

  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotes();  // Save updated quotes to localStorage
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    showRandomQuote();
  } else {
    alert("Please enter both quote text and category.");
  }
}

// Function to export quotes to JSON file
function exportToJsonFile() {
  const quotesBlob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(quotesBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Function to import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
        showRandomQuote();
      } else {
        alert('Invalid file format: The file must contain an array of quotes.');
      }
    } catch (error) {
      alert('Error reading or parsing the JSON file: ' + error.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Event listeners for buttons
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("exportQuotesBtn").addEventListener("click", exportToJsonFile);
document.getElementById("importFile").addEventListener("change", importFromJsonFile);

// Initialize the quotes array
loadQuotes();
// Initialize Quotes Array (Typically loaded from localStorage initially)
let quotes = JSON.parse(localStorage.getItem('quotes')) || [];

// Function to fetch quotes from the mock server (e.g., JSONPlaceholder)
function fetchQuotesFromServer() {
  fetch('https://jsonplaceholder.typicode.com/posts') // Mock API for demo; replace with your actual server API
    .then(response => response.json())
    .then(serverQuotes => {
      // Resolve conflicts between local and server data
      const updatedQuotes = resolveConflicts(serverQuotes);
      // Sync with local storage
      saveQuotesToLocal(updatedQuotes);
      // Notify user
      notifyUser('Data has been updated from the server!');
    })
    .catch(error => {
      console.error('Error fetching from server:', error);
    });
}

// Function to post a new quote to the mock server (simulated POST request)
function postQuoteToServer(newQuote) {
  fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: newQuote.text, // Simulate sending quote text as title
      body: newQuote.category, // Simulate category as body
      userId: 1 // Placeholder for user info
    })
  })
    .then(response => response.json())
    .then(serverResponse => {
      console.log('Posted to server:', serverResponse);
      alert('New quote has been posted to the server!');
    })
    .catch(error => {
      console.error('Error posting to server:', error);
    });
}

// Conflict resolution logic: Resolve data discrepancies between local and server quotes
function resolveConflicts(serverQuotes) {
  serverQuotes.forEach(serverQuote => {
    const existingQuoteIndex = quotes.findIndex(quote => quote.id === serverQuote.id);
    if (existingQuoteIndex !== -1) {
      // If quote already exists, update it with server data
      quotes[existingQuoteIndex] = serverQuote;
    } else {
      // If quote doesn't exist, add it
      quotes.push(serverQuote);
    }
  });
  return quotes;
}

// Function to save quotes to localStorage
function saveQuotesToLocal(updatedQuotes) {
  localStorage.setItem('quotes', JSON.stringify(updatedQuotes));
  quotes = updatedQuotes; // Update in-memory quotes array
}

// Function to notify user about data updates
function notifyUser(message) {
  const notificationElement = document.createElement("div");
  notificationElement.classList.add("notification");
  notificationElement.innerHTML = message;
  document.body.appendChild(notificationElement);

  setTimeout(() => {
    notificationElement.remove(); // Remove notification after 5 seconds
  }, 5000);
}

// Add a new quote (called when user submits the form or clicks a button)
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = {
      id: Date.now(), // Generate unique ID (using timestamp)
      text: newQuoteText,
      category: newQuoteCategory
    };

    // Add the new quote to the local array
    quotes.push(newQuote);
    saveQuotesToLocal(quotes); // Save to localStorage

    // Post the new quote to the server
    postQuoteToServer(newQuote);

    // Notify user
    alert('New quote added!');
  } else {
    alert('Please enter both quote text and category.');
  }
}

// Periodically fetch new data from the server (every 10 minutes)
setInterval(fetchQuotesFromServer, 600000); // 600000 ms = 10 minutes

// Event listener for adding a new quote (connected to a button in your HTML)
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);

// On page load, fetch quotes from the server
window.onload = function() {
  fetchQuotesFromServer();
};

// Initialize Quotes Array (Typically loaded from localStorage initially)
let quotes = JSON.parse(localStorage.getItem('quotes')) || [];

// Function to fetch quotes from the mock server (e.g., JSONPlaceholder)
async function fetchQuotesFromServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts'); // Mock API for demo; replace with your actual server API
    const serverQuotes = await response.json();

    // Resolve conflicts between local and server data
    const updatedQuotes = resolveConflicts(serverQuotes);

    // Sync with local storage
    saveQuotesToLocal(updatedQuotes);

    // Notify user about updates
    notifyUser('Data has been updated from the server!');
  } catch (error) {
    console.error('Error fetching from server:', error);
  }
}

// Function to post a new quote to the mock server (simulated POST request)
async function postQuoteToServer(newQuote) {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newQuote.text, // Simulate sending quote text as title
        body: newQuote.category, // Simulate category as body
        userId: 1 // Placeholder for user info
      })
    });

    const serverResponse = await response.json();
    console.log('Posted to server:', serverResponse);

    alert('New quote has been posted to the server!');
  } catch (error) {
    console.error('Error posting to server:', error);
  }
}

// Conflict resolution logic: Resolve data discrepancies between local and server quotes
function resolveConflicts(serverQuotes) {
  serverQuotes.forEach(serverQuote => {
    const existingQuoteIndex = quotes.findIndex(quote => quote.id === serverQuote.id);
    if (existingQuoteIndex !== -1) {
      // If quote already exists, update it with server data
      quotes[existingQuoteIndex] = serverQuote;
    } else {
      // If quote doesn't exist, add it
      quotes.push(serverQuote);
    }
  });
  return quotes;
}

// Function to save quotes to localStorage
function saveQuotesToLocal(updatedQuotes) {
  localStorage.setItem('quotes', JSON.stringify(updatedQuotes));
  quotes = updatedQuotes; // Update in-memory quotes array
}

// Function to notify user about data updates
function notifyUser(message) {
  const notificationElement = document.createElement("div");
  notificationElement.classList.add("notification");
  notificationElement.innerHTML = message;
  document.body.appendChild(notificationElement);

  setTimeout(() => {
    notificationElement.remove(); // Remove notification after 5 seconds
  }, 5000);
}

// Add a new quote (called when user submits the form or clicks a button)
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = {
      id: Date.now(), // Generate unique ID (using timestamp)
      text: newQuoteText,
      category: newQuoteCategory
    };

    // Add the new quote to the local array
    quotes.push(newQuote);
    saveQuotesToLocal(quotes); // Save to localStorage

    // Post the new quote to the server
    postQuoteToServer(newQuote);

    // Notify user
    alert('New quote added!');
  } else {
    alert('Please enter both quote text and category.');
  }
}

// Periodically fetch new data from the server (every 10 minutes)
setInterval(fetchQuotesFromServer, 600000); // 600000 ms = 10 minutes

// Event listener for adding a new quote (connected to a button in your HTML)
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);

// On page load, fetch quotes from the server
window.onload = function() {
  fetchQuotesFromServer();
};
