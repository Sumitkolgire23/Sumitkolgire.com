import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './sanity/schemas'
import { dataset, projectId } from './sanity/env'

export default defineConfig({
  basePath: '/studio',
  name: 'default',
  title: 'Sumitkolgire.com Studio',

  projectId,
  dataset,

  plugins: [
    structureTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})


