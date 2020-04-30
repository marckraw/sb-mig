import Command from '@oclif/command'
import storyblokConfig, { IStoryblokConfig } from './config/config'
import {
    getCurrentDirectoryBase,
    isDirectoryExists,
    createDir,
    createJsonFile,
    copyFolder,
    copyFile
} from './utils/files'
import { findComponents, findComponentsWithExt, findDatasources } from './utils/discover'
import {
    getAllComponents,
    getComponent,
    getComponentsGroup,
    getAllComponentsGroups,
    createComponentsGroup
} from './api/components'
import {
    getAllDatasources,
    getDatasource,
    getDatasourceEntries,
    createDatasource,
    createDatasourceEntry,
    updateDatasourceEntry,
    updateDatasource,
    createDatasourceEntries,
    syncDatasources
} from './api/datasources'
import { getComponentPresets } from './api/componentPresets'
import { getPreset, getAllPresets, createPreset, updatePreset } from './api/presets'
import { syncComponents, syncAllComponents } from './api/migrate'
import { updateComponent, createComponent } from './api/mutateComponents'
import { createSpace, getSpace } from './api/spaces'

export default abstract class extends Command {
    storyblokConfig(): IStoryblokConfig {
        return storyblokConfig
    }

    files() {
        return {
            getCurrentDirectoryBase,
            isDirectoryExists,
            createDir,
            createJsonFile,
            copyFolder,
            copyFile
        }
    }

    api() {
        return {
            discover: {
                findComponents,
                findComponentsWithExt,
                findDatasources,
            },
            datasources: {
                getAllDatasources,
                getDatasource,
                getDatasourceEntries,
                createDatasource,
                createDatasourceEntry,
                updateDatasourceEntry,
                updateDatasource,
                createDatasourceEntries,
                syncDatasources,
            },
            components: {
                getAllComponents,
                getComponent,
                getComponentsGroup,
                getAllComponentsGroups,
                createComponentsGroup,
                syncComponents,
                syncAllComponents,
                updateComponent,
                createComponent
            },
            presets: {
                getComponentPresets,
                getPreset,
                getAllPresets,
                createPreset,
                updatePreset
            },
            spaces: {
                createSpace,
                getSpace
            }
        }
    }
}