export type Project = {
  title: string
  description: string
  link: string
  imageKey?: string
}

export const projects: Array<Project> = [
  {
    title: 'Technical spanish blog',
    description:
      'Personal blog covering software engineering and programming concepts.',
    link: 'https://es.yarso.dev',
    imageKey: 'blog'
  },
  {
    title: 'Jollaadmin',
    description:
      'Microservices-based system, internal data management and monitoring.',
    link: 'https://residenciallajolla.net',
    imageKey: 'jollaadmin'
  },
  {
    title: 'Cusmer',
    description:
      'Web application for managing customers as an independent contractor.',
    link: 'https://github.com/yarso-su/cusmer',
    imageKey: 'github'
  }
]

export const packages: Array<Project> = [
  {
    title: 'astro-theme-toggler',
    description: 'Lightweight theme toggler utility.',
    link: 'https://github.com/yarso-su/astro-theme-toggler'
  },
  {
    title: 'astro-dropdown',
    description: 'Customizable dropdown component.',
    link: 'https://github.com/yarso-su/astro-dropdown'
  },
  {
    title: 'zoho-mail',
    description: 'Utility for sending emails through Zoho API.',
    link: 'https://github.com/yarso-su/zoho-mail'
  }
]

export const crates: Array<Project> = [
  {
    title: 'systemctl-manager',
    description: 'Utility to interact with systemctl through a TUI.',
    link: 'https://crates.io/crates/systemctl-manager'
  },
  {
    title: 'jsnpar',
    description: 'JSON parser implementation for Rust.',
    link: 'https://crates.io/crates/jsnpar'
  }
]
