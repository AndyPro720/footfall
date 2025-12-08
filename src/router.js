export class Router {
  constructor(routes) {
    this.routes = routes;
    this.app = document.getElementById('app');
    this.init();
  }

  init() {
    window.addEventListener('popstate', () => this.handleRoute());
    document.body.addEventListener('click', e => {
      if (e.target.matches('[data-link]')) {
        e.preventDefault();
        this.navigateTo(e.target.href);
      }
    });
    this.handleRoute();
  }

  navigateTo(url) {
    history.pushState(null, null, url);
    this.handleRoute();
  }

  async handleRoute() {
    const path = window.location.pathname;
    
    // Set data-page attribute for global styling overrides
    const pageName = path === '/' ? 'home' : path.substring(1);
    document.body.dataset.page = pageName;

    const route = this.routes[path] || this.routes['/'];
    
    if (route) {
      // Fade out
      this.app.classList.remove('page-fade-in');
      
      this.app.innerHTML = await route.render();
      
      // Fade in
      requestAnimationFrame(() => {
        this.app.classList.add('page-fade-in');
      });

      if (route.afterRender) route.afterRender();
    }
  }
}
