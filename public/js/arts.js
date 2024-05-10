const cards = document.getElementsByClassName("card");

for (let card of cards) {
  card.addEventListener("mouseover", () => {
    if (!card.classList.contains("active")) {
      for (let c of cards) {
        c.classList.remove("active");
      }
      card.classList.add("active");
    }
  });
}
const searchInput = document.querySelector(".search-by-title");

searchInput.addEventListener("input", function () {
  const searchQuery = this.value.trim(); // Get the value of the input field

  // Perform search
  fetch(`/search?search=${searchQuery}`)
    .then((response) => response.json())
    .then((data) => {
      // Handle search results
      console.log(data);
    })
    .catch((error) => console.error("Error performing search:", error));
});

// // Pages:
// const createArtsData = (answers, page) => {
//   const ul = document.createElement("ul");
//   if (answers.length === 0) {
//     const ansItem = document.createElement("p");
//     ansItem.textContent = "No arts";
//     ul.appendChild(ansItem);
//   } else {
//     for (let i = 5 * page - 4; i < 5 * page + 1; i++) {
//       if (answers[i] == undefined) {
//         return ul;
//       }
//       const li = document.createElement("li");
//       li.innerHTML = `
//       <img class="card-img" src="${answers[i].img_url}" alt="" />

//       <div class="card-datails">
//         <h2>ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧</h2>
//         <p>${answers[i].description}</p>

//         <div class="comment-part">
//           <div class="react">
//             <div class="icons">
//               <img height="35px" src="/assets/like-icon.svg" alt="" />
//               <img height="35px" src="/assets/comment-icon.svg" alt="" />
//               <img height="35px" src="/assets/share-icon.svg" alt="" />
//             </div>
//             <p class="post-likes">${answers[i].likes} likes</p>
//             <input
//               placeholder="Add a comment..."
//               type="comment"
//               class="comment"
//               id="comment"
//               name="comment"
//             />
//           </div>
//           <div class="more">
//             <button>More</button>
//             <a href="https://www.instagram.com/sagarkalis/"
//               ><img
//                 src="/assets/instagram.svg"
//                 alt=""
//                 brightness(0)
//                 saturate(100%)
//                 invert(39%)
//                 sepia(66%)
//                 saturate(564%)
//                 hue-rotate(219deg)
//                 brightness(85%)
//                 contrast(96%)
//             /></a>
//           </div>
//         </div>
//       </div>
//         `;
//       ul.appendChild(li);
//     }
//   }
//   return ul;
// };

// const prevBtn = document.getElementById("prev-btn");
// const nextBtn = document.getElementById("next-btn");
// const artsContainer = document.getElementById("arts-container");

// const showNextAns = async (page) => {
//   console.log(page);
//   try {
//     const response = await fetch(`/arts`);
//     const respData = await response.json(respData);

//     const artsLis = createArtsData(respData, page);
//     artsContainer.innerHTML = "";
//     artsContainer.appendChild(artsLis);
//   } catch (error) {
//     alert("Communication error with server!");
//   }
// };

// prevBtn.addEventListener("click", function () {
//   showNextAns(parseInt(prevBtn.dataset.page));
// });
// nextBtn.addEventListener("click", function () {
//   showNextAns(parseInt(nextBtn.dataset.page));
// });
// document.addEventListener("DOMContentLoaded", function () {
//   showNextAns(parseInt(prevBtn.dataset.page) + 1);
// });
