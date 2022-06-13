export default (input, navigator, files) => {
  const commandArr = input.split(' ');
  const fileNames = commandArr.filter((fileName, idx) => idx !== 0 && fileName);
  const currentPath = navigator.get();
  files.setPath(currentPath);
  return fileNames;
}