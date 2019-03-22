import React from 'react'
import PropTypes from 'prop-types'

const TueriContext = React.createContext(true)

class TueriProvider extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoaded: false,
            supports: {
                webp: false
            }
        }

        this.supportsWebp = this.supportsWebp.bind(this)

    }

    async supportsWebp() {
        if (!self.createImageBitmap) return false

        const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
        const blob = await fetch(webpData).then(r => r.blob())
        return createImageBitmap(blob).then(() => true, () => false)
    }

    
    componentDidMount() {

        this.supportsWebp()
        .then((webp) => this.setState({ supports: { ...this.state.supports, webp }, isLoaded: true }))

    }

    render() {

        const { isLoaded, supports } = this.state
        const { domain = 'https://cdn.tueri.io', accountId, children } = this.props

        if (!isLoaded) return null

        return(
            <TueriContext.Provider
                value={{ domain, accountId, supports }}
            >
                { children }
            </TueriContext.Provider>
        )

    }

}

TueriProvider.propTypes = {
    domain: PropTypes.string,
    accountId: PropTypes.string,
    children: PropTypes.any
}

export {
    TueriProvider,
    TueriContext
}