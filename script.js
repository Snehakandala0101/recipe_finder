function searchRecipe() {
    const query = document.getElementById("searchInput").value.trim();
    const resultsDiv = document.getElementById("results");
  
    if (!query) {
      resultsDiv.innerHTML = "<p>Please enter a recipe name.</p>";
      return;
    }
  
    resultsDiv.innerHTML = "<p>Loading...</p>";
  
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
      .then(response => response.json())
      .then(data => {
        if (!data.meals) {
          resultsDiv.innerHTML = `<p>No results found for "${query}".</p>`;
          return;
        }
  
        resultsDiv.innerHTML = "";
  
        data.meals.forEach(meal => {
          const shortInstructions = meal.strInstructions.slice(0, 200);
          const fullInstructions = meal.strInstructions;
          // ✅ Improved YouTube Handling
        let youtubeContent = "";
        if (meal.strYoutube && meal.strYoutube.includes("watch?v=")) {
          const videoId = meal.strYoutube.split("v=")[1].split("&")[0];
          const embedLink = `https://www.youtube.com/embed/${videoId}`;

        youtubeContent = `
          <div style="margin-top: 10px;">
            <iframe width="300" height="200" 
              src="${embedLink}" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen>
            </iframe>
            <br>
            <a href="${meal.strYoutube}" target="_blank" style="color:blue;">Watch on YouTube</a>
          </div>`;
        } else {
            youtubeContent = `<p style="color: gray;">🎬 YouTube video not available for this recipe.</p>`;
          }

          const card = document.createElement("div");
          card.innerHTML = `
            <h2>${meal.strMeal}</h2>
            <img src="${meal.strMealThumb}" width="200" />
            <p><strong>Category:</strong> ${meal.strCategory}</p>
            <p id="instruction-${meal.idMeal}">
              ${shortInstructions}...
              <button onclick="toggleInstructions('${meal.idMeal}', \`${fullInstructions}\`)">Read More</button>
            </p>
            ${youtubeContent}
          `;
  
          resultsDiv.appendChild(card);
        });
      })
      .catch(error => {
        console.error("Fetch error:", error);
        resultsDiv.innerHTML = "<p>Something went wrong.</p>";
      });
  }
  
  function toggleInstructions(id, fullText) {
    const para = document.getElementById(`instruction-${id}`);
    const button = para.querySelector("button");
  
    if (button.innerText === "Read More") {
      para.innerHTML = `${fullText} <button onclick="toggleInstructions('${id}', \`${fullText}\`)">Read Less</button>`;
    } else {
      const shortText = fullText.slice(0, 200);
      para.innerHTML = `${shortText}... <button onclick="toggleInstructions('${id}', \`${fullText}\`)">Read More</button>`;
    }
  }
  
document.getElementById("searchInput").addEventListener("keypress",function(event){
 if (event.key=="Enter"){
  event.preventDefault();
  searchRecipe();
 }
});