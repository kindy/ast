/* your parser/transform code */

export const config = {};

export const defaultInput = `
input can be any thing.
:)
`.trim();

/* accept promise
 * can use load to load packages from unpkg.com
 */
export function depends({context: {load, babel}, input, config}) {
  return Promise.resolve({echo: x => x});
}

/* can only run in sync mode
 */
export default function run({input, depends: {echo}, config}) {
  return {
    ast: {
      input,
      out: echo(input),
    }, // ast is special, other results should be under \`results\` key
    results: {
      input,
    },
  };
};
