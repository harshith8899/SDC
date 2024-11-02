
let sidebar = document.querySelector(".sidebar");
let closeBtn = document.querySelector("#btn");
let searchBtn = document.querySelector(".bx-search");

closeBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    menuBtnChange();//calling the function(optional)
});

// following are the code to change sidebar button(optional)
function menuBtnChange() {
    if (sidebar.classList.contains("open")) {
        closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");//replacing the iocns class
    } else {
        closeBtn.classList.replace("bx-menu-alt-right", "bx-menu");//replacing the iocns class
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.querySelector('.sidebar');
    const mobileTrigger = document.querySelector('.mobile-trigger');

    if (mobileTrigger) { // Check if the element exists
        mobileTrigger.addEventListener('click', () => {
            sidebar.classList.toggle('open');

            // Rotate arrow icon
            const icon = mobileTrigger.querySelector('i');
            if (sidebar.classList.contains('open')) {
                icon.classList.remove('bx-chevron-right');
                icon.classList.add('bx-chevron-left');
            } else {
                icon.classList.remove('bx-chevron-left');
                icon.classList.add('bx-chevron-right');
            }
        });
    } else {
        console.log("Mobile trigger element not found");
    }
});

