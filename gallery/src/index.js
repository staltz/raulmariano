import xs from 'xstream';
import fromEvent from 'xstream/extra/fromEvent';
import {run} from '@cycle/xstream-run';
import isolate from '@cycle/isolate';
import {div, makeDOMDriver} from '@cycle/dom';
import styles from './styles';
import Gallery from './Gallery';

function main(sources) {
  let photosProps$ = xs.of({
    label: 'Fotos',
    photos: [
      './img/Pablo_Bernardo_01.jpg',
      './img/Pablo_Bernardo_02.jpg',
      './img/Pablo_Bernardo_03.jpg',
      './img/Pablo_Bernardo_04.jpg',
      './img/Pablo_Bernardo_05.jpg',
      './img/Pablo_Bernardo_06.jpg',
      './img/Pablo_Bernardo_07.jpg',
      './img/Pablo_Bernardo_08.jpg',
      './img/Flavio_Tavares_01.jpg',
      './img/Flavio_Tavares_02.jpg',
      './img/Flavio_Tavares_03.jpg',
      './img/Flavio_Tavares_04.jpg',
      './img/Flavio_Tavares_05.jpg',
    ],
    thumbnails: [
      './img/Flavio_Tavares_01_thumb.jpg',
      './img/Flavio_Tavares_02_thumb.jpg',
      './img/Pablo_Bernardo_04_thumb.jpg',
      './img/Pablo_Bernardo_03_thumb.jpg',
      './img/Pablo_Bernardo_01_thumb.jpg',
    ]
  });

  let videosProps$ = xs.of({
    label: 'Vídeos',
    photos: [
      'Q9N-rZC1ZlE',
      'nVL0LkVAT1Y',
      'qKdFy687hV0',
    ],
    thumbnails: [
      './img/Pablo_Bernardo_04_thumb.jpg',
      './img/video-thumb2.jpg',
      './img/video-thumb1.jpg',
    ]
  });

  const sinks1 = isolate(Gallery, 'photos')({...sources, props: photosProps$});
  const sinks2 = isolate(Gallery)({...sources, props: videosProps$});

  const vdom$ = xs.combine(sinks1.DOM, sinks2.DOM).map(([vdom1, vdom2]) =>
    div([
      div({style: {position: 'relative', paddingTop: '12rem'}}, [
        vdom1
      ]),
      div({style: {position: 'relative', marginTop: '7rem'}}, [
        vdom2
      ]),
    ])
  );

  return {
    DOM: vdom$,
  };
}

run(main, {
  DOM: makeDOMDriver('.photo-gallery'),
  Keydown: () => fromEvent(document, 'keydown'),
});
styles.inject();
