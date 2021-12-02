export const generateEstimationNumber = (lastEntry) => {
  const today = new Date();
  let dd = today.getDate().toString();
  dd = dd.length === 1 ? "0" + dd : dd;
  let mm = (today.getMonth() + 1).toString();
  mm = mm.length === 1 ? "0" + mm : mm;
  const yy = today.getFullYear().toString().substr(-2);
  const checkdate = mm + "" + dd + "" + yy;
  const newRegex = new RegExp(checkdate, "i");
  console.log("lastEntry: ", lastEntry);
  if (lastEntry) {
    const match = lastEntry.match(newRegex);
    if (match && match.length > 0) {
      let newEntry = (Number(lastEntry.split("-")[1]) + 1).toString();
      newEntry = newEntry.length === 1 ? 0 + newEntry : newEntry;
      return `${checkdate}-${newEntry}`;
    }
  }
  return `${checkdate}-01`;
};
