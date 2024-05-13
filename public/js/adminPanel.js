const setIsAdmin = async () => {
  let users = await fetch(`/getAllUsers`);
  users = await users.json();

  for (let user of users) {
    const checkBoxIsAdmin = document.getElementById(`isAdmin${user.user_id}`);
    const deleteUserBtn = document.getElementById(`delete${user.user_id}`);
    if (user.isAdmin) checkBoxIsAdmin.checked = true;
    const id = user.user_id;

    checkBoxIsAdmin.addEventListener("click", async () => {
      let postData;
      if (checkBoxIsAdmin.checked) {
        postData = {
          id: id,
          isAdmin: true,
        };
      } else {
        postData = {
          id: id,
          isAdmin: false,
        };
      }
      await fetch(`/adminPanel/setUserAdmin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
    });

    deleteUserBtn.addEventListener("click", async () => {
      const div = document.getElementById(`profile${id}`);
      div.remove();
      console.log("meow");
      const postData = {
        id: id,
      };
      await fetch(`/adminPanel/deleteUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
    });
  }
};
setIsAdmin();
