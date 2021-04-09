
import app from './app.js';
import index from './index.js';
import filmDetail from './film-detail.js'
import theaterDetail from './theater-detail.js'
import chooseSeats from './choose-seats.js'
import search from './search.js'
import theaterList from './theater-list'
import theaterSelect from './theater-select'
import payment from './payment'

import my from './my.js';
const trackConfig = [
  app,
  my,
  filmDetail,
  theaterDetail,
  chooseSeats,
  index,
  search,
  theaterList,
  theaterSelect,
  payment
];
export default trackConfig;