const primaryNav = document.querySelector(".primary-navigation");
const navToggle = document.querySelector(".mobile-nav-toggle");

const loc_drop = document.getElementById('loc_drop');
const locdropable = document.getElementById('loc_dropable');

const loca_drop = document.getElementById('loca_drop');
const locadropable = document.getElementById('loca_dropable');

const inventory_drop = document.getElementById('inventory_drop');
const inventory_dropable = document.getElementById('inventory_dropable');

const tools_drop = document.getElementById('tools_drop');
const tools_dropable = document.getElementById('tools_dropable');

navToggle.addEventListener('click', () => {
    const visibility = primaryNav.getAttribute('data-visible');

    if(visibility === "false") {
        primaryNav.setAttribute('data-visible', true);
        navToggle.setAttribute('aria-expanded', true);

        tools_drop.setAttribute('data-expanded', false);
        tools_dropable.setAttribute('expanded', false);
        inventory_drop.setAttribute('data-expanded', false);
        inventory_dropable.setAttribute('expanded', false);
    } else if (visibility === "true") {
        primaryNav.setAttribute('data-visible', false);
        navToggle.setAttribute('aria-expanded', false);
    }

})

loc_drop.addEventListener('click', () => {
    const droped = loc_drop.getAttribute('data-expanded');

    if(droped === "false"){
        loc_drop.setAttribute('data-expanded', true);
        locdropable.setAttribute('expanded', true);

        tools_drop.setAttribute('data-expanded', false);
        tools_dropable.setAttribute('expanded', false);
        inventory_drop.setAttribute('data-expanded', false);
        inventory_dropable.setAttribute('expanded', false);
        loca_drop.setAttribute('data-expanded', false);
        locadropable.setAttribute('expanded', false);
    } else if (droped === "true"){
        loc_drop.setAttribute('data-expanded', false);
        locdropable.setAttribute('expanded', false);
    }
})

loca_drop.addEventListener('click', () => {
    const droped = loca_drop.getAttribute('data-expanded');

    if(droped === "false"){
        loca_drop.setAttribute('data-expanded', true);
        locadropable.setAttribute('expanded', true);

        tools_drop.setAttribute('data-expanded', false);
        tools_dropable.setAttribute('expanded', false);
        inventory_drop.setAttribute('data-expanded', false);
        inventory_dropable.setAttribute('expanded', false);
        loc_drop.setAttribute('data-expanded', false);
        locdropable.setAttribute('expanded', false);
    } else if (droped === "true"){
        loca_drop.setAttribute('data-expanded', false);
        locadropable.setAttribute('expanded', false);
    }
})

inventory_drop.addEventListener('click', () => {
    const droped = inventory_drop.getAttribute('data-expanded');

    if(droped === "false"){
        inventory_drop.setAttribute('data-expanded', true);
        inventory_dropable.setAttribute('expanded', true);

        tools_drop.setAttribute('data-expanded', false);
        tools_dropable.setAttribute('expanded', false);
        loca_drop.setAttribute('data-expanded', false);
        locadropable.setAttribute('expanded', false);
        loc_drop.setAttribute('data-expanded', false);
        locdropable.setAttribute('expanded', false);
    } else if (droped === "true"){
        inventory_drop.setAttribute('data-expanded', false);
        inventory_dropable.setAttribute('expanded', false);
    }
})

tools_drop.addEventListener('click', () => {
    const droped = tools_drop.getAttribute('data-expanded');

    if(droped === "false"){
        tools_drop.setAttribute('data-expanded', true);
        tools_dropable.setAttribute('expanded', true);

        inventory_drop.setAttribute('data-expanded', false);
        inventory_dropable.setAttribute('expanded', false);
        loca_drop.setAttribute('data-expanded', false);
        locadropable.setAttribute('expanded', false);
        loc_drop.setAttribute('data-expanded', false);
        locdropable.setAttribute('expanded', false);
    } else if (droped === "true"){
        tools_drop.setAttribute('data-expanded', false);
        tools_dropable.setAttribute('expanded', false);
    }
})