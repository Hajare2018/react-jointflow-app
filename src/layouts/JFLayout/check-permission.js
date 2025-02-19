export default function checkPermission(codeName) {
  return (permissions) => permissions?.some(({ permission }) => permission.codename === codeName);
}
