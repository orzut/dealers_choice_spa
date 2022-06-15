const axios = require("axios");
const state = {};

const usersList = document.querySelector("#users-list");
const restaurantsList = document.querySelector("#restaurants-list");
const ordersList = document.querySelector("#orders-list");

window.addEventListener("hashchange", async () => {
  renderUsers();
  renderRestaurants();
  await fetchOrders();
  renderOrders();
});

ordersList.addEventListener("click", async (ev) => {
  if (ev.target.tagName === "BUTTON") {
    const orderId = ev.target.getAttribute("data-id");
    await axios.delete(`/api/orders/${orderId}`);
    state.orders = state.orders.filter((order) => order.id !== orderId);
    renderUsers();
    renderOrders();
  }
});

restaurantsList.addEventListener("click", async (ev) => {
  if (ev.target.tagName === "LI") {
    const restaurantId = ev.target.getAttribute("data-id");

    await fetchMeals(restaurantId);
    renderMeals(restaurantId);
    renderRestaurants();
  }
});
// menu.addEventListener("click", (ev) => {
//   if (ev.target.tagName === "BUTTON") {
//     const mealId = ev.target.getAttribute("data-id");
//   }
// });

const fetchUsers = async () => {
  const response = await axios.get("/api/users");
  state.users = response.data;
};

const fetchRestaurants = async () => {
  const response = await axios.get("/api/restaurants");
  state.restaurants = response.data;
};

const fetchMeals = async (id) => {
  const response = await axios.get(`/api/restaurants/${id}/menu`);
  state.meals = response.data;
};

const fetchOrders = async () => {
  const userId = window.location.hash.slice(1);
  const response = await axios.get(`/api/users/${userId}/orders`);
  state.orders = response.data;
};

const renderUsers = () => {
  const id = window.location.hash.slice(1);
  const html = state.users
    .map((user) => {
      return `<li class='${user.id === id ? "selected" : ""}'><a href='#${
        user.id
      }'>${user.name}</a></li>`;
    })
    .join("");
  usersList.innerHTML = html;
};

const renderRestaurants = () => {
  const html = state.restaurants
    .map((restaurant) => {
      return `
          <li data-id='${restaurant.id}'>${restaurant.name}
          <ul data-id='${restaurant.id}' class="menu">
          </ul>
          </li>
         `;
    })
    .join("");
  restaurantsList.innerHTML = html;
};

const renderMeals = (id) => {
  return state.meals
    .filter((meal) => id === meal.restaurantId)
    .map((meal) => {
      return `
      <li>${meal.name} $${meal.price} <button data-id='${meal.id}'>+</button></li>

      `;
    })
    .join("");
};

const renderOrders = () => {
  const userId = window.location.hash.slice(1);
  const html = state.orders
    .filter((order) => order.userId === userId)
    .map((order) => {
      return `<div id='orders'>
      <li>${order.user.name} ordered ${order.meal.name}</li>
      <button data-id='${order.id}'>X</button>
      </div>`;
    })
    .join("");
  ordersList.innerHTML = html;
};

const start = async () => {
  await fetchUsers();
  await fetchRestaurants();
  await fetchOrders();
  renderUsers();
  renderRestaurants();
  renderOrders();
};

start();
