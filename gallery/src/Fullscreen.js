import xs from 'xstream';
import {div, img, span, iframe} from '@cycle/dom';
import styles from './styles';

const userSelectNone = {
  '-webkit-user-select': 'none',
  '-moz-user-select': 'none',
  '-ms-user-select': 'none',
};

const containerStyle = styles.registerStyle({
  'background-color': 'rgba(0,0,0,0.7)',
  'position': 'fixed',
  'top': '0',
  'bottom': '0',
  'left': '0',
  'right': '0',
  'display': 'flex',
  'justify-content': 'center',
  'align-items': 'center',
  'z-index': '100',
  ...userSelectNone,
});

const photoStyle = styles.registerStyle({
  'max-width': '80vw',
  'max-height': '90vh',
  'border': '10px solid white',
  ...userSelectNone,
});

const arrowStyle = styles.registerStyle({
  'font-size': '100px',
  'width': '100px',
  'height': '100px',
  'text-align': 'center',
  'line-height': '85px',
  'color': 'black',
  'background-color': 'white',
  'cursor': 'pointer',
  ...userSelectNone,
});

const exitStyle = styles.registerStyle({
  'position': 'fixed',
  'top': '0',
  'right': '0',
  'z-index': '101',
  'font-size': '70px',
  'width': '70px',
  'height': '70px',
  'text-align': 'center',
  'line-height': '60px',
  'color': 'black',
  'background-color': 'white',
  'cursor': 'pointer',
  ...userSelectNone,
});

function renderVideoOrPicture(src) {
  if (src.match(/\.jpg$/)) {
    return img(`.${photoStyle}`, {attrs: {src: src}});
  } else {
    return iframe(`.${photoStyle}`, {
      attrs: {
        frameborder: "0",
        height: "100%",
        width: "100%",
        src: 'https://youtube.com/embed/' + src +
          '?autoplay=1&controls=1&showinfo=1&autohide=1&modestbranding=1'
      }
    });
  }
}

function Fullscreen(sources) {
  let action$ = xs.merge(
    sources.DOM.select('.leftGalleryButton').events('click').mapTo(-1),
    sources.DOM.select('.rightGalleryButton').events('click').mapTo(+1),
    sources.Keydown.filter(ev => ev.key === 'ArrowLeft').mapTo(-1),
    sources.Keydown.filter(ev => ev.key === 'ArrowRight').mapTo(+1)
  );

  let exit$ = xs.merge(
    sources.DOM.select('.exitGalleryButton').events('click').mapTo(),
    sources.Keydown.filter(ev => ev.key === 'Escape').mapTo()
  );

  let state$ = sources.props.map(props => {
    let length = props.photos.length;
    return action$.fold(
      (selected, delta) => (selected + length + delta) % length,
      0
    ).map(selected => {
      return {photos: props.photos, selected};
    });
  }).flatten();

  let vdom$ = state$.map(({photos, selected}) =>
    div(`.${containerStyle}.fullscreen`, [
      span(`.${arrowStyle}.leftGalleryButton`, '\u2039'),
      renderVideoOrPicture(photos[selected]),
      span(`.${arrowStyle}.rightGalleryButton`, '\u203A'),
      span(`.${exitStyle}.exitGalleryButton`, '\u00D7'),
    ])
  );

  return {
    DOM: vdom$,
    exit: exit$,
  };
}

export default Fullscreen;
