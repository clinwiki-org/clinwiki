// needed for regenerator-runtime
// (ES7 generator support is required by redux-saga)
import 'raf/polyfill';
import 'babel-polyfill';
import Enzyme from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';

// Setup enzyme's react adapter
Enzyme.configure({ adapter: new EnzymeAdapter() });
