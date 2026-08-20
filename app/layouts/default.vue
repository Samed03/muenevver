<template>
  <div>
    <AppHeader />

    <main>
      <slot />
    </main>

    <footer class="site-footer">
      <p>&copy; {{ new Date().getFullYear() }} Münevver Arslan</p>
    </footer>
  </div>
</template>
