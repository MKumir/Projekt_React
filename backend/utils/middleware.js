const logger = require('./logger')

const zathjevInfo = (req, res, next) => {
    logger.info('Metoda: ', req.method)
    logger.info('Putanja: ', req.path)
    logger.info('Tijelo: ', req.body)
    logger.info('---')
    next()
}

const nepoznataRuta = (req, res) => {
    res.status(404).send({ error: 'nepostojeca ruta' })
}

const errorHandler = (err, req, res, next) => {
    logger.greska(err.message)

    if(err.name === 'CastError') {
        return res.status(400).send({error: 'Krivi format ID-a'})
    } else if (err.name === 'ValidationError'){
        return res.status(400).send({error: err.message})
    } else if (err.name === 'JsonWebTokenError'){
        return res.status(401).send({error: "Neispravni token"})
    } else if (err.name === 'TypeError'){
        return res.status(400).send({error: "Neispravan unos"})
    } 
    next(err)
}

module.exports = {zathjevInfo, nepoznataRuta, errorHandler}
