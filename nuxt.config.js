const {getConfigForKeys} = require('./lib/config.js')
const ctfConfig = getConfigForKeys([
  'CTF_BLOG_POST_TYPE_ID',
  'CTF_SPACE_ID',
  'CTF_CDA_ACCESS_TOKEN',
  'CTF_CMA_ACCESS_TOKEN',
  // 'CTF_PERSON_ID',
  "CTF_CASE_STUDY_TYPE_ID",
  "CTF_CLIENT_TYPE_ID",
  "CTF_TEAM_MEMBER_TYPE_ID"
])
const {createClient} = require('./plugins/contentful')
const cdaClient = createClient(ctfConfig)
const cmaContentful = require('contentful-management')
const cmaClient = cmaContentful.createClient({
  accessToken: ctfConfig.CTF_CMA_ACCESS_TOKEN
})

const config = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Contra Studios',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Contra Studios' }
    ],
    css: [
        { src: '~/static/slick/slick.css', lang: 'css' },
        { src: '~/static/slick/slick-theme.css'}
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/minireset.css/0.0.2/minireset.min.css' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#2199e8' },

  /*
  ** Build configuration
  */
  build: {

    // extractCSS: true

    /*
    ** Run ESLINT on save
    */
    extend (config, ctx) {
      if (ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },

    postcss: [
      require('autoprefixer')({
        browsers: ['> 5%']
      })
    ]
  },

  // modules: [
  //  'bootstrap-vue/nuxt',
  // ],

  /*
  ** ᕕ( ᐛ )ᕗ CTF-BLOG-IN-5-MINUTES
  ** Make client available everywhere via Nuxt plugins
  */
  plugins: [
    '~/plugins/contentful'
  ],

  /*
  ** ᕕ( ᐛ )ᕗ CTF-BLOG-IN-5-MINUTES
  ** Get all blog posts from Contentful
  ** and generate the needed files upfront
  **
  ** Included:
  ** - blog posts
  ** - available blog post tags
  */
  generate: {
  //   routes () {
  //     return Promise.all([
  //       // get all blog posts
  //       cdaClient.getEntries({
  //         'content_type': ctfConfig.CTF_BLOG_POST_TYPE_ID
  //       }),
  //       // get the blog post content type
  //       cmaClient.getSpace(ctfConfig.CTF_SPACE_ID)
  //         .then(space => space.getContentType(ctfConfig.CTF_BLOG_POST_TYPE_ID))
  //     ])
  //     .then(([entries, postType]) => {
  //       return [
  //         // map entries to URLs
  //         ...entries.items.map(entry => `/blog/${entry.fields.slug}`),
  //         // map all possible tags to URLs
  //         ...postType.fields.find(field => field.id === 'tags').items.validations[0].in.map(tag => `/tags/${tag}`)
  //       ]
  //     })
  //   }
  // },

  routes () {
      return Promise.all([
        // get all case studies
        cdaClient.getEntries({
          'content_type': ctfConfig.CTF_CASE_STUDY_TYPE_ID
        }),
        // get the case study content type
        cmaClient.getSpace(ctfConfig.CTF_SPACE_ID)
          .then(space => space.getContentType(ctfConfig.CTF_CASE_STUDY_TYPE_ID))
      ])
      .then(([entries, postType]) => {
        return [
          // map entries to URLs
          ...entries.items.map(entry => `/case-study/work/${entry.fields.slug}`),
          ...entries.items.map(entry => `case-study/story/${entry.fields.slug}`),
        ]
      })
    }
  },

  /*
  ** Define environment variables being available
  ** in generate and browser context
  */
  env: {
    CTF_SPACE_ID: ctfConfig.CTF_SPACE_ID,
    CTF_CDA_ACCESS_TOKEN: ctfConfig.CTF_CDA_ACCESS_TOKEN,
    // CTF_PERSON_ID: ctfConfig.CTF_PERSON_ID,
    CTF_BLOG_POST_TYPE_ID: ctfConfig.CTF_BLOG_POST_TYPE_ID,
    CTF_CASE_STUDY_TYPE_ID: ctfConfig.CTF_CASE_STUDY_TYPE_ID,
    CTF_CLIENT_TYPE_ID: ctfConfig.CTF_CLIENT_TYPE_ID,
    CTF_TEAM_MEMBER_TYPE_ID: ctfConfig.CTF_TEAM_MEMBER_TYPE_ID
  }
}

module.exports = config
