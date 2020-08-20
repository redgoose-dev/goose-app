import layout from './layout';
import article from './article';

// import scss
import '../scss/app.scss';

layout();
if (window.app.mode === 'article') article();
