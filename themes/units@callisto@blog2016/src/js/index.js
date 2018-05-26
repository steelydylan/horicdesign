import LazyLoad from 'vanilla-lazyload';
import PrettyScroll from 'pretty-scroll';
import hljs from 'highlight.js';
import 'unitscss/src/js/_import.js';

import 'font-awesome/scss/font-awesome.scss';
import 'unitscss/dist/units.min.css';
import 'highlight.js/styles/default.css';
import 'highlight.js/styles/github.css';

import '../../../system/scss/acms.scss';
import '../scss/override.scss';

new PrettyScroll('#ad', {
  container: '.uc-section',
  offsetTop: 20,
  offsetBottom: 20
});

new LazyLoad({
  elements_selector: '.js-lazy'
});

$('pre').each(function () {
  const html = $(this).html();
  $('pre').html(`<code>${html}</code>`);
});

hljs.initHighlightingOnLoad();

