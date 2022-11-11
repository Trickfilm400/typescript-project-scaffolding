/**
 * Can be added to every prompt json for easier change of values in every prompt
 * @version 1.0.0
 * @author Nico W.
 * @since 01.11.2022
 */
export const additionalObjects = {
  suffix: ' =>',
};
/**
 * Helper Function to add a zero in front of numbers < 10 for better display
 * @param {number} i Input number
 * @version 1.0.0
 * @author Nico W.
 * @since 01.11.2022
 */
export const addZero = (i: number) => (i < 10 ? '0' + i : i);

//region MESSAGE_PREFIX
/**
 * Count of all prompts for progress display
 * @version 1.0.0
 * @author Nico W.
 * @since 01.11.2022
 */
const length = 12;
/**
 * Index Count for progress display in prompt Array
 * @version 1.0.0
 * @author Nico W.
 * @since 01.11.2022
 */
let i = 0;
/**
 * messagePrefix
 * @version 1.0.0
 * @author Nico W.
 * @since 01.11.2022
 */
export function mP() {
  i++;
  return `[${addZero(i)}/${addZero(length)}] `;
}
//endregion
