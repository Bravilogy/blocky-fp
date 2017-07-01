import {
  render,
  COLOURS,
  findInGrid,
  createGrid,
  createBlock,
  refillColumn,
  removeElements,
  getRandomColour,
  findNeighboursBy,
  createRandomColour
} from './grid';
import { assert } from 'chai';

describe('createRandomColour', () => {
  it('should pick a random color from passed colours', () => {
    const colour = getRandomColour(COLOURS);
    assert.ok(COLOURS.indexOf(colour) >= 0);
  });
});

describe('createBlock', () => {
  it('should create a block object with right coordinates and colour', () => {
    let blocks = [[1, 2, 'black'], [3, 4, 'white'], [5, 6, 'green']];

    blocks.forEach(coords => {
      let block = createBlock(...coords);

      assert.equal(block.x, coords[0], 'x is set correctly');
      assert.equal(block.y, coords[1], 'y is set correctly');
      assert.equal(block.colour, coords[2], 'colour is set correctly');
    });
  });
});

describe('createGrid', () => {
  it('should create grid of blocks based on maximum x and y', () => {
    let grid = createGrid(5, 5);

    assert.equal(grid.length, 5, 'max x is set correctly');
    assert.equal(grid[grid.length - 1].length, 5, 'max y is set correctly');
  });
});

describe('findInGrid', () => {
  it('should find coordinates of a block in grid', () => {
    const grid = [
      [{ x: 1, y: 1 }, { x: 10, y: 20 }],
      [{ x: 2, y: 1 }, { x: 2, y: 3 }],
    ];
    assert.deepEqual([0, 1], findInGrid(grid, grid[0][1]));
    assert.deepEqual([1, 1], findInGrid(grid, grid[1][1]));
  });
});

describe('findNeighboursBy', () => {
  it('should find block neighbours in grid based on a specific property', () => {
    const grid = [
      [{ x: 3, y: 1 }, { x: 1, y: 20 }],
      [{ x: 3, y: 1 }, { x: 1, y: 3 }],
    ];
    let indexes = findInGrid(grid, grid[0][1]);
    assert.deepEqual([[1], [1]], findNeighboursBy(grid, 'x', indexes));

    indexes = findInGrid(grid, grid[0][0]);
    assert.deepEqual([[0], [0]], findNeighboursBy(grid, 'y', indexes));
  });
});

describe('removeElement', () => {
  it('should remove an element using coordinates supplied', () => {
    const grid = [
      [{ x: 3, y: 1 }, { x: 1, y: 20 }],
      [{ x: 3, y: 1 }, { x: 1, y: 3 }],
    ];

    let removeIndexes = [[1], [0]];
    removeIndexes.forEach((ys, i) => {
      let removed = removeElements(grid, ys, i);
      assert.equal(removed.length, 1);
    });
  });
});

describe('refillColumn', () => {
  it('should refill column if there are elements missing, based on max y', () => {
    const maxY = 5;

    let column = [{ x: 3, y: 1 }];
    column = refillColumn(3, column);
    assert.equal(column.length, 3);
  });
});

describe('render', () => {
  it('should clear the previous content', () => {
    const el = {
      innerHTML: 'Hello world'
    };
    render([], el);
    assert.equal(el.innerHTML, '');
  });
});
