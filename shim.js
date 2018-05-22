// fix warning polyfill R16
global.requestAnimationFrame = callback => setTimeout(callback, 0);

const Enzyme = require('enzyme');
const EnzymeAdapter = require('enzyme-adapter-react-16');

// Setup enzyme's react adapter
Enzyme.configure({ adapter: new EnzymeAdapter() });

// Add jQuery for testing
import $ from 'jquery';

window.jQuery = global.$ = global.jQuery = $;

require('jquery-ui/ui/widget');
require('jquery-ui/ui/widgets/mouse');
