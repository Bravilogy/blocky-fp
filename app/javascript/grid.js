import { curry, prop, maxBy, compose, map, reduce, addIndex } from 'ramda';

export const COLOURS = ['red', 'green', 'blue', 'yellow'];
const MAX_X = 10;
const MAX_Y = 10;

export const getRandomColour = colours =>
  colours[Math.floor(Math.random() * colours.length)];

export const createBlock = (x, y, colour) => ({
  x, y, colour
});

export const createGrid = (maxX, maxY, result = []) => {
  if (result.length >= maxX) return result;

  let l = result.length;

  result[l] = [];

  for (let i = 0; i < maxY; i++) {
    result[l][i] = createBlock(l, i, getRandomColour(COLOURS));
  }

  return createGrid(maxX, maxY, result);
}

export const findInGrid = curry((grid, block) => {
  function find(grid, block, x = 0, y = 0) {
    if (grid[x][y] === block) return [x, y];

    [x, y] = y === grid[x].length - 1 ? [x + 1, 0] : [x, y + 1];

    return find(grid, block, x, y);
  }

  return find(grid, block);
});

export const findNeighboursBy = curry((grid, prop, idx) => {
  function find(grid, prop, indexes, hash = []) {
    if (!indexes.length) return hash;

    let [x, y] = indexes.shift(),
        possibilities = [[0, 1], [0, -1], [1, 0], [-1, 0]];

    hash[x] = hash[x].concat([y]);

    for (let i = 0; i < possibilities.length; i++) {
      let [px, py] = [x + possibilities[i][0], y + possibilities[i][1]];

      if (!grid[px] || !grid[px][py] || hash[px].indexOf(py) >= 0) continue;

      if (grid[px][py][prop] === grid[x][y][prop]) {
        indexes.push([px, py]);
      }
    }

    return find(grid, prop, indexes, hash);
  }

  let hash = [];

  for (let i = 0; i < grid.length; i++)
    hash[i] = [];

  return find(grid, prop, [idx], hash);
});

export const refillColumn = curry((max, column) => {
  function refill(max, x, column) {
    if (column.length >= max) return column;

    let block = createBlock(x, reduce(maxBy(prop('y')), 0, column), getRandomColour(COLOURS));

    return refill(max, x, column.concat([block]));
  }

  return refill(max, column[0] ? column[0]['x'] : 0, column)
});

export const removeElements = curry((column, ys) =>
  column.filter((_, i) => ys.indexOf(i) < 0));

export const render = (grid, el = document.querySelector('#gridEl')) => {
  el.innerHTML = '';
  for (let x = 0; x < grid.length; x++) {
    let id = 'col_' + x;
    let colEl = document.createElement('div');
    colEl.className = 'col';
    colEl.id = id;
    el.appendChild(colEl);

    for (let y = grid[x].length - 1; y >= 0; y--) {
      let block = grid[x][y],
        id = `block_${x}x${y}`,
        blockEl = document.createElement('div');

      blockEl.id = id;
      blockEl.className = 'block';
      blockEl.style.background = block.colour;
      blockEl.addEventListener('click', evt => {
        compose(
          render,
          map(refillColumn(MAX_Y)),
          addIndex(reduce)((result, ys, x) => {
            result[x] = removeElements(result[x], ys);
            return result;
          }, grid),
          findNeighboursBy(grid, 'colour'),
          findInGrid(grid)
        )(block);
      });

      colEl.appendChild(blockEl);
    }
  }
}

window.addEventListener(
  'DOMContentLoaded',
  () => render(createGrid(MAX_X, MAX_Y))
);
