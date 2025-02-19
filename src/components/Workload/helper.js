export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  const newPriority = startIndex - endIndex;
  return { result, removed, newPriority };
};
