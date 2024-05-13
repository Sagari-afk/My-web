# DOCUMENTATION

### Welcome to the documentation for my portfolio drawing gallery web application! Below is an overview of the core functionality and technologies used in the application.


# About the application
My web application is a portfolio drawing gallery inspired by Instagram. Users can view drawings, add comments to them, as well as register, log in to their accounts and edit their profiles.

## Functionality
**View drawings:** Users can view drawings from the portfolio on the Arts page. Drawings are retrieved using the Instagram API.

**Commenting** on drawings: Users can add comments to drawings.

**Comment Management:** Administrators can delete user comments.

**Register and sign in to an account:** Users can register and sign in to their accounts to access additional features of the app.

**Edit Profile:** Users can change information in their profiles such as first name, last name, avatar and other details.

## Technologies
The following technologies and tools are used in the development of the application:

**Node.js:** A server-side JavaScript runtime environment.
**Express:** A framework for building web applications on Node.js.
**Ajax:** A technology for asynchronous data exchange between client and server.
**Instagram API:** Application programming interface for accessing Instagram data.


# Arts page
The Arts page allows users to view drawings from the portfolio and add comments to them. For administrators, a function to delete comments is also available.

## View drawings
Users can view drawings from the portfolio on the Arts page. The drawings are presented as a gallery, each drawing is accompanied by a description and comments from users.

## Adding comments
Users can add comments to drawings, expressing their thoughts, impressions and feedback on the work. To add a comment a user must be logged in to their account.

## Deleting comments (for administrators)
Administrators have the ability to delete user comments that violate community rules or contain inappropriate content. The administrator needs to be logged in to perform this operation.

## Integration with Instagram API
Instagram API is used to retrieve drawings and their descriptions. The application requests data from Instagram and displays it on the Arts page for users.


# Registration and Login page
The Registration and Login page allows users to register with the system to access additional features of the application or log in to their accounts.

## New User Registration
To register a new user, follow the steps below:

Click on the ‘Sign in’ link on the main page of the app.
Fill out the registration form with your details such as username, email address and password.
Click on the ‘Create user’ button.

Follow the steps below to log in to your account:

Click on the ‘Log in’ link on the main page of the app.
Fill out the login form with your email address and password.
After successful login, you will be redirected to the main page of the app.


## Data security and privacy
I ensure the security and privacy of our users' data. All passwords are stored encrypted and i take steps to protect users' personal information from unauthorised access.



# User Profile page
The User Profile page allows users to view and edit their personal information such as first name, last name and avatar.

## View Profile
Users can view their profile on the User Profile page, which displays information about them including first name, last name, email address and other details.

## Editing a profile
Follow the steps below to edit your profile:

Click on the ‘Profile’ link in the top menu of the application.
Change the required fields such as first name, last name, avatar and other details.
Click on the ‘Save Changes’ button.
Changing your password

## Authorisation and access to personal information
Authentication is required to access a user's personal information and edit their profile. Users must be logged in to the system to perform these actions.


# Environment Variables
The application uses the following environment variables for configuration:

**PORT:** The port on which the server is running (default is 3000).
**DATABASE_URL:** The URL to connect to the database.
**INSTAGRAM_ACCESS_TOKEN:** The token used to access the Instagram API.
**SECRET_KEY:** The secret key used to create and verify JWT authentication tokens.
**Security recommendations*

# Project structure

- data
    - database.js
- public
    - assets
    - css
    - js (ajax)
- routers
- utils
- views
main.js



# Code exemple: 

`Istagram Handler` :

```
const getInstPostById = async (postId) => {
  let postData = {};
  await fetch(
    `https://graph.instagram.com/${postId}?fields=id,permalink,media_type,media_url,caption&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`
  )
    .then((response) => response.json())
    .then((data) => {
      postData = data;
    })
    .catch((error) => console.error("Error fetching Instagram posts:", error));
  return postData;
};

module.exports = {
  getInstPostsIds,
  getInstPostById,
};
`
    - dbHandler.js
    - fileUpload.js
    - instagramhandler


```

`Database handler` :

```
const createUser = async (name, surname, email, password, salt) => {
  await db.query(
    `
    INSERT INTO users (name, surname, email, password, salt, user_img_url) VALUES (?, ?, ?, ?, ?, ?)
  `,
    [name, surname, email, password, salt, "/assets/profile-none-img.png"]
  );
};

const getUserBy = async (col, value) => {
  const [records] = await db.query(
    `
  SELECT * FROM users WHERE ${col} = ?
  `,
    value
  );
  return records;
};
const getAllUsers = async () => {
  const [records] = await db.query(
    `
  SELECT * FROM users 
  `
  );
  return records;
};

const updateUser = async (user) => {
  const { id, name, surname, email, avatar } = user;
  await db.query(
    `
  UPDATE users SET name=?, surname=?, email=?, user_img_url=? WHERE user_id = ?`,
    [name, surname, email, avatar, id]
  );
};
```

`Arts (ajax)` :

```
const createArtsData = async (answers, page) => {
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
            <button id="btn-more${answers[i].art_id}">More</button>
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

    const artsLis = await createArtsData(respData, page);
    artsContainer.innerHTML = "";
    artsContainer.appendChild(artsLis);

    likePost(5 * page - 4, 5 * page);
    copyShareUrl(5 * page - 4, 5 * page);
    showModal(5 * page - 4, 5 * page);
  } catch (error) {
    console.log(error.message);
    // alert("Communication error with server!");
  }
};
```
