import { generateService } from 'openapi-genuu'

generateService({
  requestLibPath: 'import request from \'../../utils/request\';',
  schemaPath: 'http://127.0.0.1:4523/export/openapi?projectId=3481564&version=3.1',
  serversPath: './src/.generated',
})
