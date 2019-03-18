import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { TueriContext } from './Provider'
import kebabCase from 'lodash.kebabcase'

class Img extends React.Component{ // ({ src, alt, options = {}, format = 'jpg' }) {

    constructor(props) {
        super(props)
        this.state = {
            isInViewport: false,
            width: 0,
            height: 0,
            thumbnailLoaded: false,
            fullsizeLoaded: false
        }

        this.imgRef = React.createRef()

        this.handleViewport = this.handleViewport.bind(this)

    }

    componentDidMount() {

        const width = this.imgRef.current.clientWidth

        this.setState({
            width
        })
        
        this.handleViewport()

        window.addEventListener('scroll', this.handleViewport)

    }

    // const [currentYOffset, setCurrentYOffset] = useState(0)

    handleViewport() {
        if (this.imgRef.current && !this.state.thumbnailLoaded) {
            const windowHeight = window.innerHeight
            const imageTopPosition = this.imgRef.current.getBoundingClientRect().top
            if (windowHeight * 1.5 > imageTopPosition) {
                this.setState({
                    isInViewport: true
                })
            }

        }
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleViewport)
    }

    render() {

        let queryString = ''

        const { src, alt, options = {}, format = 'jpg' } = this.props
        const { isInViewport, width, thumbnailLoaded, fullsizeLoaded } = this.state

        options['scale.width'] = options['scale.width'] || width

        Object.keys(options).map((option, i) => {
            return queryString +=  `${i < 1 ? '?' : '&'}${option}=${options[option]}`
        })

        return(
            <TueriContext.Consumer>
                {({ domain, account }) => (
                    <figure className={`tueri__imageContainer ${ thumbnailLoaded || fullsizeLoaded ? 'tueri__imageContainer--loaded': '' }`} ref={this.imgRef}>
                        {
                            isInViewport && width > 0 ? (
                                <React.Fragment>
                                    <img onLoad={ () => { this.setState({ thumbnailLoaded: true }) } } className={`tueri__image--thumbnail ${ thumbnailLoaded && !fullsizeLoaded ? 'loaded' : ''} ${ fullsizeLoaded ? 'fadeOut' : ''}`} src={`${ domain }/${ src }/${ kebabCase(alt) }.${ format }${ queryString.replace(`scale.width=${ width }`, `scale.width=${ Math.round(width * 0.1) }`) }`} alt={ alt } />
                                    <img onLoad={ () => { this.setState({ fullsizeLoaded: true }) } } className={`tueri__image--fullsize ${ fullsizeLoaded ? 'loaded' : ''}`} src={`${ domain }/${ src }/${ kebabCase(alt) }.${ format }${ queryString }`} alt={ alt } />
                                </React.Fragment>
                            ) : null
                        }            
                    </figure>
                )}
                
            </TueriContext.Consumer>
        )

    }
}

Img.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    options: PropTypes.object,
    format: PropTypes.string
}

export default Img