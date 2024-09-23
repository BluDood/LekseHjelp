<main>
  <div class="box anim-appear">
    <slot />
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }

  .box {
    padding: 20px;
    background-color: #111;
    border-radius: 8px;
  }
</style>
