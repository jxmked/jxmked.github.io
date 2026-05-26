# Webpack Multipage Base Template

Wanna do some multipage static sites?

## Config

Open `entries.mjs` file and add your pages in `pages` constant.

```js
{
  title: 'index', // For config title and chunking
  folder: '', // Source file
  output_folder: '' // Url
}
```

> It also supports sub/sub/sub directories like what I did in `/pagetwo/about`

- The `title`, `folder` and `output_folder` keys should be unique.
- The `folder` key will be the actual folder inside of src folder.
- The `output_folder` key will be use as url path like `http://localhost:3000/:folder`

> The webpack config is similar to the first version of the "Webpack base template,"
> but the "Webpack base template" is only for single-page applications. The main
> difference between this template and the others is that this template supports
> multipage rendering, although it requires some additional setup complexity. To
> simplify the process, I added the `entries.mjs` file for easier configuration.
> Additionally, I have updated my [ga4-webpack-plugin](https://www.npmjs.com/package/ga4-webpack-plugin)
> to meet the requirements of this webpack configuration.

**Hope you guys like this**

#### Incase you lost

- [webpack-base-template](https://github.com/jxmked/webpack-base-template)
- [webpack-multipage-base-template](https://github.com/jxmked/webpack-multipage-base-template)

#### **Created with love and frustration** by [Jovan](https://facebook.com/deguia25)
