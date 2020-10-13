import ora from 'ora';
import { flags } from '@oclif/command'
import Command from 'sb-mig/lib/core'
import { installComponentCommand, installProvidedComponents } from '@sb-mig/plugin-add-components/lib/api/add';
import { copyComponents } from '@sb-mig/plugin-add-components/lib/api/copy';
import { updateComponentsJs } from '@sb-mig/plugin-add-components/lib/api/update';
import { cloneRepo, createSpace, removeAndModifyFiles } from '../api';

export default class Hello extends Command {
  static description = 'Generate whole project with sb-mig generate and sb-mig add components'

  static examples = [
    `$ sb-mig generate project-name --add @storyblok-components/ui-accordion @storyblok-components/ui-section`,
  ]

  static strict = false;

  static flags = {
    help: flags.help({ char: 'h' }),
    add: flags.boolean({ char: 'a', description: 'List of components to add to project' }),
    copy: flags.boolean({ char: 'c', description: "Copy downloaded files into your folder structure (outside node_modules)." }),
    nospace: flags.boolean({ char: 'n', description: "Do not create a space for project. (for example when you have one already)" }),
  }

  static args = [{ name: 'project-name' }]

  async run() {
    const { args, argv, flags } = this.parse(Hello)
    const { boilerplateUrl } = this.storyblokConfig()

    console.log(`Starting generating project...`)
    console.log(`Creating start project...`)
    console.log(`Using ${boilerplateUrl} boilerplate...`)

    const components = argv.splice(1, argv.length);
    const projectName = argv[0];

    let spinner = ora(`Cloning repo...\n`).start()
    const clonedRepo = await cloneRepo(boilerplateUrl);
    if (clonedRepo.failed) {
      spinner.stop();
      this.exit();
    }
    spinner.stop()

    if (!flags.nospace) {
      spinner = ora(`Creating space...\n`).start()
      const {
        data: {
          space
        }
      } = await createSpace(this.api().spaces.createSpace, projectName)
      spinner.stop()

      removeAndModifyFiles(space)
      console.log(`Space has been created.`)
    }

    if (flags.add && !flags.copy) {

      let spinner = ora(`Installing provided components...\n`).start()
      const installedComponents = installProvidedComponents(components);
      spinner.stop()

      spinner = ora(`Updating components.js file...\n`).start()
      const data = updateComponentsJs(installedComponents, false, this.storyblokComponentsConfig(), this.storyblokConfig());
      spinner.stop()
    }

    if (flags.add && flags.copy) {
      let spinner = ora(`Installing provided components...\n`).start()
      const installedComponents = await installProvidedComponents(components);
      spinner.stop()

      spinner = ora(`Copying components files to local system...\n`).start()
      const dataAgain = await copyComponents(components, this.storyblokComponentsConfig(), this.storyblokConfig());
      spinner.stop()

      spinner = ora(`Updating components.js file...\n`).start()
      const data = updateComponentsJs(installedComponents, true, this.storyblokComponentsConfig(), this.storyblokConfig());
      spinner.stop()
    }
  }
}



