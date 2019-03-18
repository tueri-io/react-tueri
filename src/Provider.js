import React from 'react'
import PropTypes from 'prop-types'

const TueriContext = React.createContext(true)

function TueriProvider ({ domain = 'https://cdn.tueri.io', accountId, children }) {

    return(
        <TueriContext.Provider
            value={{ domain, accountId }}
        >
            { children }
        </TueriContext.Provider>
    )

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