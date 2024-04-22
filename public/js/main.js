const fish_img = document.getElementById("fish-img");
var left_eye = document.getElementById("left-eye");
var right_eye = document.getElementById("right-eye");

function rotate() {
  left_eye.classList.add("rotate");
  right_eye.classList.add("rotate");
  console.log("meow");
}

fish_img.addEventListener("click", rotate);

left_eye.addEventListener("animationend", (event) => {
  left_eye.classList.remove("rotate");
});
right_eye.addEventListener("animationend", (event) => {
  right_eye.classList.remove("rotate");
});
