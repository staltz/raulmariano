import xs from 'xstream';
import {div, img, span} from '@cycle/dom';
import styles from './styles';

function stringToNumber(str) {
  return str.split('').reduce((acc,c) => acc + c.charCodeAt(0), 0) * 7 * 13;
}

function randomThumbnailStyle(i) {
  const angle = (i / AMOUNT_THUMBNAILS) * 2 * Math.PI;
  const spreadRadius = 6; // vw
  return {
    'position': 'absolute',
    'width': '30vw',
    'top': '0',
    'left': '0',
    'border': '10px solid white',
    'transform': `rotateZ(${-9 + 18 * Math.random()}deg)`,
    'transition': 'top 0.3s, left 0.3s',
    '&.spread': {
      'top': `${0 + spreadRadius * Math.sin(angle)}vw`,
      'left': `${0 + spreadRadius * Math.cos(angle)}vw`,
    },
  };
}

const AMOUNT_THUMBNAILS = 5;

const thumbnailStyles = (function () {
  let arr = [];
  for (let i = 0; i < AMOUNT_THUMBNAILS; i++) {
    arr.push(styles.registerStyle(randomThumbnailStyle(i)));
  }
  return arr;
})();

const photosLinkStyle = styles.registerStyle({
  'font-size': '50px',
  'position': 'relative',
  'top': '0',
  'width': '30vw',
  'height': '20vw',
  'cursor': 'pointer',
  'line-height': '20vw',
  'display': 'block',
  'text-align': 'center',
  'text-decoration': 'underline',
  'text-shadow': '0 1px 5px black',
});

function Thumbnails(sources) {
  let spread$ = xs.merge(
    sources.DOM.select('.photosLink').events('mouseenter').mapTo(true),
    sources.DOM.select('.photosLink').events('mouseleave').mapTo(false)
  ).startWith(false);

  let gotoFullscreen$ = sources.DOM.select('.photosLink').events('click').mapTo();

  let containerStyle = {
    'text-align': 'center',
    'position': 'relative',
    'width': '30vw',
    'height': '30vw',
    'margin': '0 auto',
  };

  let state$ = xs.combine(sources.props, spread$).map(([props, spread]) => {
    return {props, spread};
  });

  let vdom$ = state$.map(({props, spread}) =>
    div('.thumbnails', {style: containerStyle},
      props.thumbnails.map((photoSrc, i) =>
        img({
          class: {
            [thumbnailStyles[i]]: true,
            spread: i !== props.thumbnails.length - 1 && spread,
          },
          attrs: {src: photoSrc}
        })
      ).concat(
        span(`.${photosLinkStyle}.photosLink`, props.label)
      )
    )
  );

  return {
    DOM: vdom$,
    gotoFullscreen: gotoFullscreen$,
  };
}

export default Thumbnails;
