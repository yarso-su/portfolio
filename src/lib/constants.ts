export const projects: Array<{
  title: string
  tag: string
  description: string
  link: string
  type: 'package' | 'website' | 'private'
}> = [
  {
    title: 'astro-theme-toggler',
    tag: 'NPM Package',
    description:
      'Lightweight theme toggler utility for Astro with vanilla JavaScript.',
    link: 'https://github.com/yarso-su/astro-theme-toggler',
    type: 'package'
  },
  {
    title: 'astro-dropdown',
    tag: 'NPM Package',
    description:
      'Customizable dropdown component for Astro with vanilla JavaScript.',
    link: 'https://github.com/yarso-su/astro-dropdown',
    type: 'package'
  },
  {
    title: 'Technical Blog (ES)',
    tag: 'Website',
    description:
      'Personal blog covering software engineering and programming concepts.',
    link: 'https://es.yarso.dev',
    type: 'website'
  },
  {
    title: 'Jollaadmin',
    tag: 'Private Project',
    description:
      'Microservices-based system for internal data management and monitoring.',
    link: 'https://residenciallajolla.net',
    type: 'private'
  },
  {
    title: 'zoho-mail',
    tag: 'NPM Package',
    description: 'Typed utility for sending emails through Zoho Mail API.',
    link: 'https://github.com/yarso-su/zoho-mail',
    type: 'package'
  }
]
