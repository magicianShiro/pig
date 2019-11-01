#!/usr/bin/env node

import Pig from './utils/pig'
import inintInputHandle from './init/inputHandle'
import initValidateHandle from './init/validateHandle'
import initFileHandle from './init/fileHandle'
import initDataHandle from './init/dataHandle'
import initOutPutHandle from './init/outPutHandle'

const pig = new Pig()

pig.use(initValidateHandle)
pig.use(inintInputHandle)
pig.use(initFileHandle)
pig.use(initDataHandle)
pig.use(initOutPutHandle)

pig.exec()
