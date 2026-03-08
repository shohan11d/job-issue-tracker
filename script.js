const container = document.getElementById("issuesContainer");
let allIssues = [];

// Fetch issues
fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
  .then(res => res.json())
  .then(result => {
    allIssues = result.data;

    // 🔹 Show all issues by default
    renderIssues(allIssues);
  })
  .catch(err => console.error(err));

// Function to render issues
function renderIssues(issues, tab = "all") {
  container.innerHTML = "";
  
    if (tab === "open"){
      document.getElementById("openBtn").classList.add("active");
      document.getElementById("closedBtn").classList.remove("active");
      document.getElementById("allBtn").classList.remove("active");
    }
    
    if (tab === "closed"){
      document.getElementById("openBtn").classList.remove("active");
      document.getElementById("closedBtn").classList.add("active");
      document.getElementById("allBtn").classList.remove("active");
    }
    
    if (tab === "all"){
      document.getElementById("openBtn").classList.remove("active");
      document.getElementById("closedBtn").classList.remove("active");
      document.getElementById("allBtn").classList.add("active");
    }

  // Remove active class from all buttons
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.remove("active");
  });
  
  // Add active class to the current tab
  document.getElementById(`${tab}Btn`).classList.add("active");

  issues.forEach(issue => {
    const labels = issue.labels
      .map(label => `<span class="bg-gray-200 text-xs px-2 py-1 rounded">${label}</span>`)
      .join("");

    const card = document.createElement("div");
    card.className = `bg-white shadow-md rounded-lg p-4 flex flex-col gap-3 border ${issue.status}`;

    card.innerHTML = `
      <div class="flex justify-between items-center">
        ${issue.status === "open"
          ? '<i class="fa-solid fa-circle text-green-500"></i>'
          : '<i class="fa-solid fa-circle text-purple-800"></i>'}

        <span class="text-xs px-2 py-1 rounded
          ${issue.priority === "high" ? "bg-red-100 text-red-600" : ""}
          ${issue.priority === "medium" ? "bg-yellow-100 text-yellow-600" : ""}
          ${issue.priority === "low" ? "bg-green-100 text-green-600" : ""}
        ">
          ${issue.priority}
        </span>
      </div>

      <div>
        <h3 class="font-bold text-lg">${issue.title}</h3>
        <p class="text-sm text-gray-600 mt-1">${issue.description}</p>

        <div class="flex gap-2 mt-2 flex-wrap">
          ${labels}
        </div>
      </div>

      <div class="flex justify-between text-xs text-gray-500 pt-2 border-t">
        <span>${issue.author}</span>
        <span>${issue.createdAt || "Unknown date"}</span>
      </div>
    `;

    container.appendChild(card);
  });
}

// Tabs
document.getElementById("allBtn").onclick = () => renderIssues(allIssues, "all");
document.getElementById("openBtn").onclick = () => renderIssues(allIssues.filter(i => i.status === "open"), "open");
document.getElementById("closedBtn").onclick = () => renderIssues(allIssues.filter(i => i.status === "closed"), "closed");

// Search
document.getElementById("searchInput").addEventListener("input", function () {
  const text = this.value.toLowerCase();

  const filtered = allIssues.filter(issue =>
    issue.title.toLowerCase().includes(text) ||
    issue.description.toLowerCase().includes(text)
  );

  renderIssues(filtered);
});

// Login
function Login(){
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if(username === "admin" && password === "admin123"){
    // Hide login page
    document.querySelector("div[class*='container']").classList.add("hidden");
    // Show issues section
    document.querySelector("section").classList.remove("hidden");
  }
}
// modal

function openModal(issue) {
  document.getElementById("modalTitle").textContent = issue.title;
  document.getElementById("modalDescription").textContent = issue.description;
  document.getElementById("modalAuthor").textContent = issue.author;
  document.getElementById("modalDate").textContent = issue.createdAt || "Unknown date";
  
  const labelsContainer = document.getElementById("modalLabels");
  labelsContainer.innerHTML = "";
  issue.labels.forEach(label => {
    const labelElement = document.createElement("span");
    labelElement.className = "bg-gray-200 text-xs px-2 py-1 rounded";
    labelElement.textContent = label;
    labelsContainer.appendChild(labelElement);
  });
  
  // Open modal
  document.getElementById("issueModal").checked = true;
}