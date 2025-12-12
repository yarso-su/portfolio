export type Project = {
  title: string
  description: string
  link: string
  imageKey?: string
}

export const projects: Array<Project> = [
  {
    title: 'Systemd TUI',
    description:
      'A simple utility to interact with systemd services through a TUI.',
    link: 'https://github.com/yarso-su/systemctl-manager',
    imageKey: 'github'
  },
  {
    title: 'Jollaadmin',
    description:
      'Microservices-based system, internal data management and monitoring.',
    link: 'https://residenciallajolla.net',
    imageKey: 'jollaadmin'
  },
  {
    title: 'Technical Blog (ES)',
    description:
      'Personal blog covering software engineering and programming concepts.',
    link: 'https://es.yarso.dev',
    imageKey: 'blog'
  }
]

export const packages: Array<Project> = [
  {
    title: 'astro-theme-toggler',
    description: 'Lightweight theme toggler utility for Astro.',
    link: 'https://github.com/yarso-su/astro-theme-toggler'
  },
  {
    title: 'astro-dropdown',
    description: 'Customizable dropdown component for Astro.',
    link: 'https://github.com/yarso-su/astro-dropdown'
  },
  {
    title: 'zoho-mail',
    description: 'Utility for sending emails through Zoho API.',
    link: 'https://github.com/yarso-su/zoho-mail'
  }
]
