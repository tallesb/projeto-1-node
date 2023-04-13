// /users/:id
export function buildRoutePath(path) {
  // expressão regular: forma de encontrar padrões de textos que se encaixam na condição
  const routeParametersRegex = /:([a-zA-Z]+)/g

  const pathWithParams = path.replaceAll(routeParametersRegex, '(?<$1>[a-z0-9\-_]+)')
  const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`)

  return pathRegex;
}