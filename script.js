// Default images (stored in localStorage if not already saved)
const defaultImages = [
    { title: "Mountain View", description: "A beautiful mountain landscape.", category: "nature", src: "images/mountain.jpg" },
    { title: "City Lights", description: "The city at night with glowing lights.", category: "urban", src: "images/city.jpg" },
    { title: "Beach Sunset", description: "Golden sunset over a peaceful beach.", category: "nature", src: "images/beach.jpg" },
    { title: "Modern Architecture", description: "A tall skyscraper with glass windows.", category: "architecture", src: "images/architecture.jpg" },
    { title: "Delicious Pizza", description: "A hot slice of cheesy pizza with toppings.", category: "food", src: "images/pizza.jpg" },
    { title: "Fashion Forward", description: "A stylish model in a trendy outfit.", category: "fashion", src: "images/fashion.jpg" }
];

// Load images from localStorage or use defaults
let images = JSON.parse(localStorage.getItem("images")) || [...defaultImages];

let currentPage = 1;
const itemsPerPage = 9;

// Save images to localStorage
function saveImages() {
    localStorage.setItem("images", JSON.stringify(images));
}

// Function to upload images and store them in the correct category
function uploadImage() {
    const fileInput = document.getElementById("fileInput");
    const title = document.getElementById("imageTitle").value;
    const description = document.getElementById("imageDesc").value;
    const category = document.getElementById("imageCategory").value;

    if (!fileInput.files.length || !title || !description || !category) {
        alert("Please fill in all fields and select an image.");
        return;
    }

    Array.from(fileInput.files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = function () {
            const newImage = {
                src: reader.result, // Convert to base64
                title,
                description,
                category
            };
            images.push(newImage);
            saveImages(); // Save updated images to localStorage
            renderGallery();
        };
        reader.readAsDataURL(file);
    });

    // Reset form fields
    document.getElementById("imageTitle").value = "";
    document.getElementById("imageDesc").value = "";
    fileInput.value = "";
}

// Function to render the gallery with pagination, filtering, and search
function renderGallery() {
    const gallery = document.getElementById("gallery");
    gallery.innerHTML = "";

    const start = (currentPage - 1) * itemsPerPage;
    const end = currentPage * itemsPerPage;

    const categoryFilter = document.getElementById("categoryFilter").value.toLowerCase();
    const searchFilter = document.getElementById("searchBox").value.toLowerCase();

    // Filter images based on category and search
    const filteredImages = images.filter(img => {
        const matchesCategory = categoryFilter === "all" || img.category.toLowerCase() === categoryFilter;
        const matchesSearch = img.description.toLowerCase().includes(searchFilter) || img.title.toLowerCase().includes(searchFilter);
        return matchesCategory && matchesSearch;
    });

    const paginatedImages = filteredImages.slice(start, end);

    paginatedImages.forEach(img => {
        const imgContainer = document.createElement("div");
        imgContainer.classList.add("image-container");

        const imgElement = document.createElement("img");
        imgElement.src = img.src;
        imgElement.alt = img.title;
        imgElement.classList.add("gallery-img");
        imgElement.onclick = () => openLightbox(img);

        const caption = document.createElement("p");
        caption.textContent = img.title;

        imgContainer.appendChild(imgElement);
        imgContainer.appendChild(caption);
        gallery.appendChild(imgContainer);
    });

    document.getElementById("pageNumber").textContent = currentPage;
}

// Function to open lightbox with image details
function openLightbox(img) {
    document.getElementById("lightbox").style.display = "flex";
    document.getElementById("lightbox-img").src = img.src;
    document.getElementById("lightbox-title").textContent = img.title;
    document.getElementById("lightbox-desc").textContent = img.description;
}

// Function to close lightbox
function closeLightbox() {
    document.getElementById("lightbox").style.display = "none";
}

// Pagination functions
function nextPage() {
    const totalPages = Math.ceil(images.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderGallery();
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderGallery();
    }
}

// Function to search images based on title and description
function searchImages() {
    currentPage = 1;
    renderGallery();
}

// Function to filter images based on category
function filterImages() {
    currentPage = 1;
    renderGallery();
}

// Initialize gallery on page load
renderGallery();
