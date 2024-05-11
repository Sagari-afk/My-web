const cards = document.getElementsByClassName("card");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const artsContainer = document.getElementById("arts-container");
const pageNumElement = document.getElementById("pageNum");
let page = 1;

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
  let searchQuery = this.value.trim(); // Get the value of the input field

  // Perform search
  fetch(`/getArts/search=${searchQuery}`)
    .then((response) => response.json())
    .then((data) => {
      // Handle search results
      showNextAns(false);
    })
    .catch((error) => console.error("Error performing search:", error));
});

// // Pages:
const createArtsData = (answers, page) => {
  const ul = document.createElement("ul");
  if (answers.length === 0) {
    const ansItem = document.createElement("p");
    ansItem.textContent = "No arts";
    ul.appendChild(ansItem);
  } else {
    for (let i = 5 * page - 5; i < 5 * page; i++) {
      if (answers[i] == undefined) {
        return ul;
      }
      const li = document.createElement("li");
      li.innerHTML = `
      <img class="card-img" src="${answers[i].img_url}" alt="" />

      <div class="card-datails">
        <h2>ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧</h2>
        <p>${answers[i].description}</p>

        <div class="comment-part">
          <div class="react">
            <div class="icons">
              <img id="like${answers[i].art_id}" height="35px" src="/assets/like-icon.svg" alt="" />
              <img height="35px" src="/assets/comment-icon.svg" alt="" />
              <img id="share${answers[i].art_id}" height="35px" src="/assets/share-icon.svg" alt="" />
            </div>
            <p id="like-p${answers[i].art_id}" class="post-likes">${answers[i].likes_count} likes</p>
            <input
              placeholder="Add a comment..."
              type="comment"
              class="comment"
              id="comment" 
              name="comment"
            />
          </div>
          <div class="more">
            <button>More</button>
            <a href="${answers[i].post_url}" target='_blank'
              ><img
                src="/assets/instagram.svg"
                alt=""
                brightness(0)
                saturate(100%)
                invert(39%)
                sepia(66%)
                saturate(564%)
                hue-rotate(219deg)
                brightness(85%)
                contrast(96%)
            /></a>
          </div>
        </div>
      </div>
        `;
      ul.appendChild(li);
    }
  }

  return ul;
};

const getArts = async () => {
  let query = searchInput.value;
  if (!query) query = "all";
  const response = await fetch(`/getArts/search=${query}`);
  return await response.json();
};

const showNextAns = async (backwards) => {
  try {
    const respData = await getArts();
    page += backwards ? -1 : 1;
    const maxPage = parseInt(Math.ceil(respData.length / 5));

    if (page < 1) page = maxPage;
    if (page > maxPage) page = 1;
    pageNumElement.textContent = `${page} / ${maxPage}`;

    const artsLis = createArtsData(respData, page);
    artsContainer.innerHTML = "";
    artsContainer.appendChild(artsLis);
    likePost(5 * page - 4, 5 * page);
    copyShareUrl(5 * page - 4, 5 * page);
  } catch (error) {
    console.log(error.message);
    // alert("Communication error with server!");
  }
};

prevBtn.addEventListener("click", () => showNextAns(true));
nextBtn.addEventListener("click", () => showNextAns(false));

// LIKES:

const setArgsForReq = (id, like) => {
  const postData = {
    id: id,
    like: like,
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  };
  return [postData, options];
};

const likePost = async (i, length) => {
  for (i; i <= length; i++) {
    const likesImg = document.getElementById(`like${i}`);
    const lekesP = document.getElementById(`like-p${i}`);
    let clickCount = 1;
    const id = i;
    likesImg.addEventListener("click", async (event) => {
      event.preventDefault();
      clickCount++;
      if (clickCount % 2 === 0) {
        likesImg.src = "/assets/like_pressed_icon.svg";
        const [postData, options] = setArgsForReq(id, true);
        const response = await fetch(`/arts`, options);
        if (response.ok) {
          const resp = await response.json();
          console.log(resp[0][0].likes_count + 1);
          lekesP.textContent = `${resp[0][0].likes_count + 1} likes`;
        }
      } else {
        likesImg.src = "/assets/like-icon.svg";
        const [postData, options] = setArgsForReq(id, false);
        const response = await fetch(`/arts`, options);
        if (response.ok) {
          const resp = await response.json();
          console.log(resp[0][0].likes_count - 1);
          lekesP.textContent = `${resp[0][0].likes_count - 1} likes`;
        }
      }
    });
  }
};

likePost(1, 5);

const copyShareUrl = async (i, length) => {
  for (i; i <= length; i++) {
    const shareImg = document.getElementById(`share${i}`);
    // console.log(shareImg);
    const id = i;
    shareImg.addEventListener("click", async (event) => {
      let url = await getArts();
      url = url[id - 1].post_url;
      console.log();
      event.preventDefault();
      try {
        await navigator.clipboard.writeText(url);
        console.log("URL copied to clipboard:", url);
        // Provide visual feedback (if desired)
        shareImg.style.opacity = "0.80";
        setTimeout(() => {
          shareImg.style.opacity = "1";
        }, 200);
      } catch (error) {
        console.error("Failed to copy URL to clipboard:", error);
      }
    });
  }
};
copyShareUrl(1, 5);
