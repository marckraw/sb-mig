// component resolution file borrowed from great storyblok-migrate
// https://github.com/maoberlehner/storyblok-migrate

import * as glob from 'glob';
import * as path from 'path';

import storyblokConfig from '../config/config';

export const findComponents = (componentDirectory: string) => {
    const directory = path.resolve(process.cwd(), componentDirectory)

    return (
        glob
            .sync(path.join(directory, `**`, `!(_*|*.datasource)*.js`))
            .map(file => require(path.resolve(directory, file)))
    )
}

export const findComponentsWithExt = (ext: string) => {
    const rootDirectory = "./"
    const directory = path.resolve(process.cwd(), rootDirectory)

    return (
        glob
            .sync(
                path.join(
                    `${directory}/{${storyblokConfig.componentsDirectories.join(",")}}`,
                    `**`,
                    `[^_]*.${ext}`
                ),
                {
                    follow: true
                }
            )
            .map(file => require(path.resolve(directory, file)))
    )
}

export const findComponentsByPackageName = (ext: string | boolean, specifiedComponents: string[]) => {
    const rootDirectory = "./"
    const directory = path.resolve(process.cwd(), rootDirectory)

    return (
        glob
            .sync(
                path.join(
                    `${directory}/{${storyblokConfig.componentsDirectories.join(",")}}`,
                    `**`,
                    `package.json`
                ),
                {
                    follow: true
                }
            )
            .filter(file => {
                return specifiedComponents.includes(require(path.resolve(directory, file)).name)
            })
            .map(file => {
                const fileFolderPath = file.split("/").slice(0, -1).join("/")

                return glob
                    .sync(
                        path.join(
                            `${fileFolderPath}`,
                            `**`,
                            `[^_]*.${ext}`
                        ),
                        {
                            follow: true
                        }
                    )
                    .map(file => require(path.resolve(directory, file)).name)
            })
            .flat()

    )
}

export const findDatasources = () => {
    const rootDirectory = "./"
    const directory = path.resolve(process.cwd(), rootDirectory)

    return (
        glob
            .sync(
                path.join(
                    `${directory}/${storyblokConfig.datasourcesDirectory}`,
                    `**`,
                    `[^_]*.datasource.js`
                )
            )
            // eslint-disable-next-line global-require, import/no-dynamic-require
            .map(file => require(path.resolve(directory, file)))
    )
}