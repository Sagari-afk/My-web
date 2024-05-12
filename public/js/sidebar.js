const openCloseSidebar = () => {
    console.log("aaa");
    const sidebarMenu = document.getElementById("sidebar-menu");
    const menuIcon = document.getElementById("hamb-icon");
    sidebarMenu.classList.toggle("open");

    if (sidebarMenu.classList.contains("open")) menuIcon.src = "/assets/hamb-menu-l.svg";
    else menuIcon.src = "/assets/hamb-menu.svg";
}