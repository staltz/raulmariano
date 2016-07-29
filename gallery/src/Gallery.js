import xs from 'xstream';
import {div} from '@cycle/dom';
import isolate from '@cycle/isolate';
import Thumbnails from './Thumbnails';
import Fullscreen from './Fullscreen';

export default function Gallery(sources) {
  const thumbnails = isolate(Thumbnails)(sources);
  const fullscreen = isolate(Fullscreen)(sources);

  const mode$ = xs.merge(
    thumbnails.gotoFullscreen.mapTo('fullscreen'),
    fullscreen.exit.mapTo('thumbnails')
  ).startWith('thumbnails');

  const vdom$ = mode$
    .map(mode => mode === 'thumbnails' ? thumbnails.DOM : fullscreen.DOM)
    .flatten()
    .map(childVDom =>
      div('.gallery', [
        childVDom
      ])
    );

  return {
    DOM: vdom$,
  };
}
