import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { TueriContext } from './Provider'
import kebabCase from 'lodash.kebabcase'

function Img ({ src, alt, options = {}, format = 'jpg' }) {

    const imgRef = React.createRef()

    const [isInViewport, setIsInViewport] = useState(false)

    const [width, setWidth] = useState(0)
    const [imageLoaded, setImageLoaded] = useState({ thumbnail: false, fullsize: false })


    useEffect(() => {
        setWidth(imgRef.current.clientWidth)
    })

    // const [currentYOffset, setCurrentYOffset] = useState(0)

    function handleScroll() {
        
        // setCurrentYOffset(current)

        // if (!this.inRAF) {
        //     this.inRAF = true
        //     window.requestAnimationFrame(() => {
        //         // this.handleBuffers()
        //         this.inRAF = false
        //     })
        // }

        if (imgRef.current && !imageLoaded.thumbnail) {
            const windowHeight = window.innerHeight
            const imageTopPosition = imgRef.current.getBoundingClientRect().top
            if (windowHeight * 1.5 > imageTopPosition) {
                setIsInViewport(true)
            }

        }

    }

    useEffect(() => {        

        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    })

    let queryString = ''

    options['scale.width'] = options['scale.width'] || width

    Object.keys(options).map((option, i) => {
        return queryString +=  `${i < 1 ? '?' : '&'}${option}=${options[option]}`
    })

    return(
        <TueriContext.Consumer>
            {({ domain, account }) => (
                <figure className={`tueri__imageContainer ${ imageLoaded.thumbnail || imageLoaded.fullsize ? 'tueri__imageContainer--loaded': '' }`} ref={imgRef}>
                    {
                        isInViewport && width > 0 ? (
                            <React.Fragment>
                                <img onLoad={ () => { setImageLoaded({ ...imageLoaded, thumbnail: true }) } } className={`tueri__image--thumbnail ${ imageLoaded.thumbnail && !imageLoaded.fullsize ? 'loaded' : ''} ${ imageLoaded.fullsize ? 'fadeOut' : ''}`} src={`${ domain }/${ src }/${ kebabCase(alt) }.${ format }${ queryString.replace(`scale.width=${ width }`, `scale.width=${ Math.round(width * 0.1) }`) }`} alt={ alt } />
                                <img onLoad={ () => { setImageLoaded({ ...imageLoaded, fullsize: true }) } } className={`tueri__image--fullsize ${ imageLoaded.fullsize ? 'loaded' : ''}`} src={`${ domain }/${ src }/${ kebabCase(alt) }.${ format }${ queryString }`} alt={ alt } />
                            </React.Fragment>
                        ) : null
                    }            
                </figure>
            )}
            
        </TueriContext.Consumer>
    )
}

Img.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    options: PropTypes.object,
    format: PropTypes.string
}

export default Img