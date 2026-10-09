const catImg = document.getElementById('cat-img');
const nextBtn = document.getElementById('next-btn');
const downloadBtn = document.getElementById('download-btn');
const loader = document.getElementById('loader');

let currentImageUrl = '';

// Function to fetch a random cat image from The Cat API
async function fetchRandomCat() {
    try {
        showLoader(true);
        
        // Fetching a random cat
        const response = await fetch('https://api.thecatapi.com/v1/images/search');
        const data = await response.json();
        
        if (data && data.length > 0) {
            currentImageUrl = data[0].url;
            catImg.src = currentImageUrl;
        }
    } catch (error) {
        console.error('Error fetching cat image:', error);
        showLoader(false);
        alert('Oops! Could not fetch a cat right now. Please try again.');
    }
}

// Listen for when the cat image finishes loading in background
catImg.onload = () => {
    showLoader(false);
};

// Handle potential image load errors
catImg.onerror = () => {
    showLoader(false);
    console.error('Failed to load image.');
};

// Function to handle downloading the current cat picture
async function downloadCatImage() {
    if (!currentImageUrl) return;

    try {
        downloadBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Downloading...';
        
        // Fetch image as blob to bypass potential CORS download blocks
        const response = await fetch(currentImageUrl);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `random-cat-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
        // Fallback open in new tab if CORS blocks direct blob download
        window.open(currentImageUrl, '_blank');
    } finally {
        downloadBtn.innerHTML = '<i class="fa-solid fa-download"></i> Download Cat';
    }
}

// Helper to toggle loader state
function showLoader(isLoading) {
    if (isLoading) {
        loader.classList.remove('hidden');
        downloadBtn.classList.add('hidden');
    } else {
        loader.classList.add('hidden');
        downloadBtn.classList.remove('hidden');
    }
}

// Event Listeners
nextBtn.addEventListener('click', fetchRandomCat);
downloadBtn.addEventListener('click', downloadCatImage);

// Load initial cat on startup
fetchRandomCat();