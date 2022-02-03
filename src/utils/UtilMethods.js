export const InvalidText = str => {
  if (
    str == 'null' ||
    str == null ||
    str == 'undefined' ||
    str == undefined ||
    str == ''
  ) {
    return true;
  }
  return false;
};
