import { CHANGE_YEAR } from "./actionTypes";

/**
 * changeYear: action
 * Receives year value and returns to reducer to use appropriate year's data.
 * @param year
 */
export const changeYear = (year) => ({
    type: CHANGE_YEAR,
    year,
    error: !year ? 'Error: No Year Provided' : null
})