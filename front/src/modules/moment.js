
const moment = {
  /**
   * Get a string in format <time>[y,M,w,d,h,m,s]
   * @param {Date} date
   */
  timeSince(date) {
    let seconds = Math.floor(
      (new Date().getTime() / 1000) - (date.getTime() / 1000)
    );
    let interval;

    interval = Math.floor(seconds / (60 * 60 * 24 * 7 * 4 * 12));
    if (interval >= 1) return interval + 'y';

    interval = Math.floor(seconds / (60 * 60 * 24 * 7 * 4));
    if (interval >= 1) return interval + 'M';

    interval = Math.floor(seconds / (60 * 60 * 24 * 7));
    if (interval >= 1) return interval + 'w';

    interval = Math.floor(seconds / (60 * 60 * 24));
    if (interval >= 1) return interval + 'd';

    interval = Math.floor(seconds / (60 * 60));
    if (interval >= 1) return interval + 'h';

    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval + 'm';

    return Math.floor(seconds) + 's';
  }
};

export default moment;
export const timeSince = moment.timeSince;
