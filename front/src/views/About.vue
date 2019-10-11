<template>
  <div class="about">
    <h1>About Camagru</h1>
    <article>
      <p>Camagru is the first project in <a href="https://42.us.org" target="_blank">42</a>&#39;s web branch. It consists of a basic recreation of Instagram.</p>
      <p>My Camagru uses NodeJs + Express + Mongodb for the back-end and VueJs + CSS for front-end. The back-end was developed as a RESTful application which allows easy integration of third-party apps in the future.</p>
      <p>You can check the code at my Gitlab <a href="https://gitlab.com/raggesilver-42/camagru" target="_blank">repo</a>.</p>
    </article>
    <div class="d-flex mt-3 flex-jc-center">
      <button class="suggested flex-1" @click="$router.push('login')">
        Sign in
      </button>
    </div>
  </div>
</template>

<style scoped>
p {
  text-align: justify;
}

article {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 0 2em;
}

button {
  max-width: 300px;
}
</style>
