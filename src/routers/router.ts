interface Router {
  path: string,
  icon?: string,
  name: string,
  children?: Array<Router>
}

export default Router