# Tueri.io - ReactJS Integration
React integration for [Tueri](https://tueri.io) image processing service.

[Documentation](https://tueri.io/docs/reactjs-integration)

* Automatic image optimization (compression, resizing and image format)
* Responsive images
* Lazy Loading
* Low-quality image placeholders (LQIP)

## Installation

* NPM: `npm install @tueri/react`
* YARN: `yarn add @tueri/react`

## Usage

1. Add the `<TueriProvider/>` component to the root of your React component tree. This component [provides](https://reactjs.org/docs/context.html) child components api and base url information.

```
import TueriProvider from '@tueri/react'

ReactDOM.render(
    <TueriProvider>
        <MyRootComponent />
    </TueriProvider>,
    document.getElementById('root)
)
```

2. Use the Tueri `<Img />` component to render your images.

```
<Img src={ tueriImageId } alt='Alt Text' />
```

The `<Img />` component automatically handles image optimization, responsive images, lazy loading and low-quality image placeholders.

### Props

* `src`: String **(REQUIRED)**

* `alt`: String **(REQUIRED)**

* `options`: Object (optional)
  * Default: `{ w: autoCalculatedWidth }`
  * Possible values: see documentation for complete option list

* `format`: String (optional)
  * Default: `'jpg'`
  * Possible values: `'jpg', 'png', 'webp', 'gif'`
