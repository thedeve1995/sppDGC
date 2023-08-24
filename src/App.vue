<script setup>
import { RouterLink, RouterView } from 'vue-router'


// function login() {
//   event.preventDefault();
//   var username = document.getElementById("username").value;
//   var password = document.getElementById("password").value;
  
//   if (username === "dani95" && password === "dani1212") {
//     var loginContainer = document.querySelector(".login-container");
//     loginContainer.style.display = "none";
//   } else {
//     alert("Username atau password salah.");
//   }
// }
</script>

<template>
  <!-- <div class="login-container" style="position: fixed;left: 0;top: 0;display: flex; flex-direction: column; align-items: center;">
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="50" height="50" />

    <h1 class="title has-text-white is-size-1" >DGC-Fi</h1>
    <p style="color: aliceblue;">Please enter your credential for login</p>
    
    <form style="display: flex; flex-direction: column; padding: 20px;" >
      <label for="username">Username:</label>
      <input style="background-color: aliceblue;" type="text" id="username" name="username" required>
      
      <label style="margin-top: 20px;" for="password">Password:</label>
      <input style="background-color: aliceblue;" type="password" id="password" name="password" required>
     
      <button style="margin-top: 20px;" @click="login()" class="tombol-login">Log In</button>
    </form>
  </div> -->
  <header>
    <h1 class="title has-text-white is-size-8" >DGC-Fi<br> <i>(Versi Beta)</i></h1>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink> |
        <RouterLink to="/recap">Recapitulation</RouterLink> |
      </nav>
    </div>
  </header>
  <RouterView />
</template>

<style>
@import 'node_modules\bulma\css\bulma.min.css';
.login-container {
  position: fixed;
  display: flex;
  flex-direction: column;
  place-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  padding: 20px;
  background-color: #3f3d3d;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 100;
}



form {
  margin-top: 20px;
  width: 35%;
}

@media (max-width:800px) {
  form {
  margin-top: 20px;
  width: 90%;
}
}

label {
  display: block;
  margin-bottom: 8px;
  color: #e6e6e6;
}


header {
  line-height: 1.5;
  max-height: 100vh;
  place-content: center;
}

header .title{
  text-align: center;
  color:aliceblue;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 25px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: white;
  background-color: rgb(91, 194, 91);
  border-radius: 10px;
  font-weight: 700;
}

nav a.router-link-exact-active:hover {
  background-color: rgb(91, 194, 91);
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
  color: white;
  border-radius: 10px;
}

nav a:hover{
  background-color: rgb(91, 194, 91);
}

nav a:first-of-type {
  border: 0;
}

h1{
  text-align: center;
}
</style>
