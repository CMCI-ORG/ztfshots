import { CirclePaint, FogProps } from 'mapbox-gl';

export const clusterPaintConfig: CirclePaint = {
  'circle-color': [
    'step',
    ['get', 'point_count'],
    '#51bbd6',
    100,
    '#f1f075',
    750,
    '#f28cb1'
  ],
  'circle-radius': [
    'step',
    ['get', 'point_count'],
    20,
    100,
    30,
    750,
    40
  ]
};

export const pointPaintConfig: CirclePaint = {
  'circle-color': '#10B981',
  'circle-radius': 8,
  'circle-stroke-width': 2,
  'circle-stroke-color': '#fff'
};

export const atmosphereConfig: FogProps = {
  'color': 'rgb(186, 210, 235)',
  'high-color': 'rgb(36, 92, 223)',
  'horizon-blend': 0.02,
  'space-color': 'rgb(11, 11, 25)',
  'star-intensity': 0.6
};