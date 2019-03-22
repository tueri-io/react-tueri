import React from 'react'
import PropTypes from 'prop-types'
import { TueriContext } from './Provider'
import kebabCase from 'lodash.kebabcase'

class Img extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isInViewport: false,
            width: 0,
            height: 0,
            lqipLoaded: false,
            fullsizeLoaded: false
        }

        this.imgRef = React.createRef()
        this.window = typeof window !== 'undefined' && window 
        this.handleScroll = this.handleScroll.bind(this)
        this.handleResize = this.handleResize.bind(this)
        this.isInViewport = this.isInViewport.bind(this)

    }

    isInViewport() {
        const windowHeight = this.window.innerHeight
        const imageTopPosition = this.imgRef.current.getBoundingClientRect().top
        const buffer = typeof this.props.buffer === 'number' && this.props.buffer > 1 && this.props.buffer < 10 ? this.props.buffer : 1.5
        if (windowHeight * buffer > imageTopPosition) {
            return true
        }
        return false
    }

    handleScroll() {
        if (this.imgRef.current && !this.state.lqipLoaded) {
            this.setState({
                isInViewport: this.isInViewport()
            })
        }
    }

    handleResize() {

        if (this.imgRef.current) {
            const width = this.imgRef.current.clientWidth
            const currentWidth = this.state.width
            const difference = Math.abs(width - currentWidth)
            const differencePercentage = difference / currentWidth * 100
            const isInViewport = this.isInViewport()
            if (differencePercentage >= 10) {
                this.setState({
                    width,
                    lqipLoaded: false,
                    fullsizeLoaded: isInViewport,
                    isInViewport
                })
            }

        }

    } 

    componentDidMount() {

        const width = this.imgRef.current.clientWidth

        this.setState({
            width,
            isInViewport: this.isInViewport()
        })

        this.window.addEventListener('scroll', this.handleScroll)
        this.window.addEventListener('resize', this.handleResize)

    }  

    componentWillUnmount() {
        this.window.removeEventListener('scroll', this.handleScroll)
        this.window.removeEventListener('resize', this.handleResize)
    }

    render() {

        // Destructure props and state
        const { src, alt, options = {}, ext = 'jpg', domain, supports } = this.props
        const { isInViewport, width, fullsizeLoaded } = this.state

        // Create an empty query string
        let queryString = ''        

        // If width is specified, otherwise use auto-detected width
        options['w'] = options['w'] || width

        // If a format has not been specified, detect webp support
        if (!options['fm'] && supports.webp) {
            options['fm'] = 'webp'
        }

        // Loop through option prop and build queryString
        Object.keys(options).map((option, i) => {
            return queryString +=  `${i < 1 ? '?' : '&'}${option}=${options[option]}`
        })

        // Modify the queryString for the LQIP image: replace the width param with a value 1/10 the fullsize
        const lqipQueryString = queryString.replace(`w=${ width }`, `w=${ Math.round(width * 0.1) }`)

        const styles = {
            figure: {
                position: 'relative',
                margin: 0
            },
            lqip: {
                width: '100%',
                filter: 'blur(5px)',
                opacity: 1,
                transition: 'all 0.5s ease-in'
            },
            fullsize: {
                position: 'absolute',
                top: '0px',
                left: '0px',
                width: '100%',
                transition: 'all 0.5s ease-in'
            }
        }

        // When the fullsize image is loaded, fade out the LQIP
        if (fullsizeLoaded) {
            styles.lqip.opacity = 0
        }

        const missingALt = 'ALT TEXT IS REQUIRED'

        return(
            <figure
                style={ styles.figure }
                ref={this.imgRef}
            >
                {
                    isInViewport && width > 0 ? (
                        <React.Fragment>

                            {/* Load fullsize image in background */}
                            <img 
                                onLoad={ () => { this.setState({ fullsizeLoaded: true }) } }
                                style={ styles.fullsize }
                                src={`${ domain }/${ src }/${ kebabCase(alt || missingALt) }.${ ext }${ queryString }`}
                                alt={ alt || missingALt }
                            />

                            {/* Load LQIP in foreground */}
                            <img 
                                onLoad={ () => { this.setState({ lqipLoaded: true }) } }
                                style={ styles.lqip }
                                src={`${ domain }/${ src }/${ kebabCase(alt || missingALt) }.${ ext }${ lqipQueryString }`} 
                                alt={ alt || missingALt } 
                            />
                        </React.Fragment>
                    ) : null
                }            
            </figure>
        )

    }
}

Img.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    options: PropTypes.object,
    ext: PropTypes.string,
    buffer: PropTypes.number
}

export default (props) => (
    <TueriContext.Consumer>
        {(context) => (
            <Img {...props} {...context} />
        )}
    </TueriContext.Consumer>
)