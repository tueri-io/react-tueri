import React, { useState } from 'react'
import PropTypes from 'prop-types'

function Img ({ src, alt }) {

    const [width, setWidth] = useState(0)

    useEffect(() => {
        console.log(imgRef)
    })

    const imgRef = React.createRef()

    return(
        <img ref={imgRef} src={src} alt={ alt } />
    )
}

Img.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired
}

export default Img