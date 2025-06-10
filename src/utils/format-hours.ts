import { format } from 'date-fns';

export const formatTime = (seconds: number) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    return format(date, 'mm:ss');
};
