/**
 * @author digimonk Technologies
 * @developer Saral Shrivastava
 * @version 1.0.0
 * @description Formula Service used to update formula details
 * @param {object} data - data to be used to update formula
 * @param {string?} data.title - title of the formula
 * @param {string?} data.formula - formula used to evaluate the value of expression
 * @param {string?} data.formulaToShow - formula used to show on frontend
 * @param {string[]?} data.children - children of the formula
 * @returns {object} - update details of formula
 */
export function updateFormulaRequestService(data) {
  const updateDetails = {};
  if (data.title) {
    updateDetails.title = data.title;
  }
  if (data.formula) {
    updateDetails.formula = data.formula;
  }
  if (data.formulaToShow) {
    updateDetails.formulaToShow = data.formulaToShow;
  }
  if (data.children) {
    updateDetails.children = data.children;
  }

  return updateDetails;
}
