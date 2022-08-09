import moment from 'moment';

var generateMessage = (from, text) => {
    return {
        from,
        text,
        createdDate: moment().valueOf()
    }
};


export default generateMessage;