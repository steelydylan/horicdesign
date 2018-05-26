import LazyLoad from 'vanilla-lazyload';
import PrettyScroll from 'pretty-scroll';
import hljs from 'highlight.js';

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

