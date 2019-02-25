
import { translatePxToEm } from "../cssParser";
let assert = require('assert');

it('Should translate 14px to 1em', function() {
    let line = 'font-size: 14px; }';
    let expected = 'font-size: 1em; }';

    assert.strictEqual(expected, translatePxToEm(line));
});

it('Should keep string the same if regexp not matched', function() {
    let line1 = 'font-size: 14.45 em; }';
    let line2 = 'background-color: #010101 }';

    assert.strictEqual(line1, translatePxToEm(line1));
    assert.strictEqual(line2, translatePxToEm(line2));
});

it('Should translate decimal px to em', function() {
    let line1 = 'font-size: 177.1px; }';
    let line2 = 'font-size: 113.4px; }';
    let expected1 = 'font-size: 12.65em; }';
    let expected2 = 'font-size: 8.1em; }';

    assert.strictEqual(expected1, translatePxToEm(line1));
    assert.strictEqual(expected2, translatePxToEm(line2));
});

it('Should translate px to em even if blankspace between number and px', function() {
    let line1 = 'font-size: 14 px; }';
    let line2 = 'font-size: 42 px; }';
    let expected1 = 'font-size: 1em; }';
    let expected2 = 'font-size: 3em; }';

    assert.strictEqual(expected1, translatePxToEm(line1));
    assert.strictEqual(expected2, translatePxToEm(line2));
});
