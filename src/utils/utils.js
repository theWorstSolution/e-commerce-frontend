

function getResponsiveValue(screenSize, mobileValue, pcValue){ 
    if(screenSize.isMobile){
        return mobileValue
    }else{
        return pcValue
    }
}



function convertDate(dateString) {
    // Create a new Date object
    const date = new Date(dateString);

    // Options for formatting the date
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    };

    // Format the date
    const formattedDate = date.toLocaleString('en-US', options);
    return formattedDate
}

export default {convertDate, getResponsiveValue}