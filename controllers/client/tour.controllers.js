const Tour= require('../../models/tour')

module.exports.list = async (req, res) => {
    const tourlist= await Tour.find({});
    console.log(tourlist)
    res.render('client/pages/tour-list.pug', { tourlist: tourlist })
}