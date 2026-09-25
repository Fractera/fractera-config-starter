// КОМАНДЫ ЭЛЕМЕНТА «НАСТРОЙКИ ПРОЕКТА» — то, что его MCP умеет (шаг 299). Каркас MCP — `mcp/serve-mcp.js`, общий для любой
// службы. В 299-1 одна команда — что это за элемент и какие двери у него будут; чтение и запись настроек — 299-2.
export function configTools(publicUrl) {
  const base = publicUrl.replace(/\/+$/, '')
  return [
    {
      name: 'describe_config',
      title: 'Describe the settings element',
      description: 'What this element is, where it lives and which settings of the project it keeps.',
      run: () => ({
        element: 'config',
        address: base,
        keeps: ['APP-CONFIG', 'PLATFORM-CONFIG', 'DESIGN-CONFIG', 'menu'],
        readers: 'every element of the node — site, sign-in, data, blocks and the core — reads the settings here',
        writers: 'only the architect, through the sign-in service',
        status: '299-1: the element is up; the settings doors arrive in 299-2',
      }),
    },
  ]
}
