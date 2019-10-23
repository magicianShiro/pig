#!/usr/bin/env node

import Pick from './utils/pick'
import inintInputHandle from './init/inputHandle'
import initValidateHandle from './init/validateHandle'
import initFileHandle from './init/fileHandle'
import initDataHandle from './init/dataHandle'
import initOutPutHandle from './init/outPutHandle'

const pick = new Pick()

pick.use(initValidateHandle)
pick.use(inintInputHandle)
pick.use(initFileHandle)
pick.use(initDataHandle)
pick.use(initOutPutHandle)

pick.exec()
