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
            <button id="btn-more${id}">More</button>
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
    const likesP = document.getElementById(`like-p${i}`);

    const modalLikesImg = document.getElementById(`modal-like${i}`);
    const modalLikesP = document.getElementById(`modal-like-p${i}`);
    let clickCount = 1;
    const id = i;
    console.log(modalLikesImg, modalLikesP);
    if (modalLikesImg && modalLikesP) {
      modalLikesImg.addEventListener("click", async (event) => {
        event.preventDefault();
        clickCount++;
        if (clickCount % 2 === 0) {
          modalLikesImg.src = "/assets/like_pressed_icon.svg";
          const [postData, options] = setArgsForReq(id, true);
          const response = await fetch(`/arts`, options);
          if (response.ok) {
            const resp = await response.json();
            console.log(resp[0][0].likes_count + 1);
            modalLikesP.textContent = `${resp[0][0].likes_count + 1} likes`;
          }
        } else {
          modalLikesImg.src = "/assets/like-icon.svg";
          const [postData, options] = setArgsForReq(id, false);
          const response = await fetch(`/arts`, options);
          if (response.ok) {
            const resp = await response.json();
            console.log(resp[0][0].likes_count - 1);
            modalLikesP.textContent = `${resp[0][0].likes_count - 1} likes`;
          }
        }
      });
    }
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
          likesP.textContent = `${resp[0][0].likes_count + 1} likes`;
        }
      } else {
        likesImg.src = "/assets/like-icon.svg";
        const [postData, options] = setArgsForReq(id, false);
        const response = await fetch(`/arts`, options);
        if (response.ok) {
          const resp = await response.json();
          console.log(resp[0][0].likes_count - 1);
          likesP.textContent = `${resp[0][0].likes_count - 1} likes`;
        }
      }
    });
  }
};

const shareFunc = async (event, id, shareImg) => {
  let url = await getArts();
  url = url[id - 1].post_url;

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
};

const copyShareUrl = async (i, length) => {
  for (i; i <= length; i++) {
    const shareImg = document.getElementById(`share${i}`);
    const modalShareImg = document.getElementById(`modal-share${i}`);
    const id = i;
    console.log(modalShareImg);
    if (modalShareImg) {
      console.log(modalShareImg);
      modalShareImg.addEventListener("click", async (event) => {
        shareFunc(event, id, modalShareImg);
      });
    }
    shareImg.addEventListener("click", async (event) => {
      shareFunc(event, id, shareImg);
    });
  }
};

const createModal = (art) => {
  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");
  modalContent.classList.add("post");
  modalContent.innerHTML = `
  <img class="card-img" src="${art.img_url}" alt="" />

  <div class="card-datails">
    <div class="flex-col">
      <div class="flex-col">
        <h2>ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧</h2>
        <p>${art.description}</p>
      </div>

      <div class="view-comments">
        <div
          class="view-comment flex"
          id="view-comment${art.art_id}"
        >
          <img
            style="
              width: 2.5rem;
              height: 2.5rem;
              border-radius: 3.125rem;
              object-fit: cover;
            "
            src="/assets/temp-img.png"
            alt=""
          />
          <div class="flex">
            <p class="user-name">sagarkalis</p>
            <p class="user-comment">wooow cute</p>
          </div>
        </div>

        <div
          class="view-comment flex"
          id="view-comment${art.art_id}"
        >
          <img
            style="
              width: 2.5rem;
              height: 2.5rem;
              border-radius: 3.125rem;
              object-fit: cover;
            "
            src="/assets/temp-img.png"
            alt=""
          />
          <div class="flex">
            <p class="user-name">sagarkalis</p>
            <p class="user-comment">wooow cute</p>
          </div>
        </div>

        <div
          class="view-comment flex"
          id="view-comment${art.art_id}"
        >
          <img
            style="
              width: 2.5rem;
              height: 2.5rem;
              border-radius: 3.125rem;
              object-fit: cover;
            "
            src="/assets/temp-img.png"
            alt=""
          />
          <div class="flex">
            <p class="user-name">sagarkalis</p>
            <p class="user-comment">wooow cute</p>
          </div>
        </div>

        <div
          class="view-comment flex"
          id="view-comment${art.art_id}"
        >
          <img
            style="
              width: 2.5rem;
              height: 2.5rem;
              border-radius: 3.125rem;
              object-fit: cover;
            "
            src="/assets/temp-img.png"
            alt=""
          />
          <div class="flex">
            <p class="user-name">sagarkalis</p>
            <p class="user-comment">wooow cute</p>
          </div>
        </div>
      </div>
    </div>

    <div class="comment-part">
      <div class="react">
        <div
          class="icons"
          style="display: flex; justify-content: space-between"
        >
          <div class="icons">
            <img
              id="modal-like${art.art_id}"
              height="30px"
              src="/assets/like-icon.svg"
              alt=""
              style="
                filter: brightness(0) saturate(100%) invert(100%)
                  sepia(12%) saturate(7500%) hue-rotate(181deg)
                  brightness(112%) contrast(110%);
              "
            />
            <img
              class="comment"
              height="30px"
              src="/assets/comment-icon.svg"
              alt=""
              style="
                filter: brightness(0) saturate(100%) invert(100%)
                  sepia(12%) saturate(7500%) hue-rotate(181deg)
                  brightness(112%) contrast(110%);
              "
            />
            <img
              id="modal-share${art.art_id}"
              class="share"
              height="30px"
              src="/assets/share-icon.svg"
              alt=""
              style="
                filter: brightness(0) saturate(100%) invert(100%)
                  sepia(12%) saturate(7500%) hue-rotate(181deg)
                  brightness(112%) contrast(110%);
              "
            />
          </div>
          <a href="${art.post_url}" target="_blank"
            ><img
              src="/assets/instagram.svg"
              alt=""
              height="35px"
              style="
                filter: brightness(0) saturate(100%) invert(100%)
                  sepia(12%) saturate(7500%) hue-rotate(181deg)
                  brightness(112%) contrast(110%);
              "
          /></a>
        </div>

        <div>
          <p id="modal-like-p${art.art_id}" class="post-likes">
            ${art.likes_count} likes
          </p>
          <hr />
          <div style="display: flex; justify-content: space-between">
            <input
              placeholder="Add a comment..."
              type="comment"
              class="comment"
              id="comment"
              name="comment"
            />
            <div class="Send">
              <button>Send</button>s
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
  return modalContent;
};

const modalContainer = document.getElementById("modal");

const showModal = async (i, length) => {
  const respData = await getArts();

  for (i; i <= length; i++) {
    const btnMore = document.getElementById(`btn-more${i}`);
    const id = i;
    btnMore.addEventListener("click", async (event) => {
      event.preventDefault();

      const art = respData[id - 1];
      const modalContent = createModal(art);
      modalContainer.innerHTML = "";
      modalContainer.classList.add("modal");
      modalContainer.appendChild(modalContent);
      copyShareUrl(1, 5);
      likePost(1, 5);
    });
  }
};

prevBtn.addEventListener("click", () => showNextAns(true));
nextBtn.addEventListener("click", () => showNextAns(false));
window.onclick = (event) => {
  if (event.target === modalContainer) {
    modalContainer.innerHTML = "";
    modalContainer.classList.remove("modal");
  }
};

copyShareUrl(1, 5);
likePost(1, 5);
showModal(1, 5);
