
module.exports = {
    validCoords: function(lon, lat) {
        // Check to ensure lon and lat are numbers
        if ( !isNaN(lon) || !isNaN(lat) ) {
            lat = parseFloat(lat);
            lon = parseFloat(lon);

            if ( (lat >= -90 && lat <= 90) && (lon >= -180 && lon <= 180 )) {
                return true;
            }
        }
        return false;
    },

    capitalise: function (str) {
        if (typeof str !== 'undefined') {
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        } else {
            return '';
        }
    },

    validDay: function(str) {
        var dow = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        str = this.capitalise(str);

        return (dow.indexOf(str) > -1);
    }
};
