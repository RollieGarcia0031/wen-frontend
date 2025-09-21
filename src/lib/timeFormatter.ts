/**
 * converts a 24 hour time to a 12 hour time
 * @param time - 24 hour time (00:00:00) format
 */
export function convertTo12Hour(time:string = "") {
    time = time.substring(0, 5);
    const [hour, minute] = time.split(':');
    
    const ampm = parseInt(hour) >= 12 ? 'PM' : 'AM';

    const hour12 = parseInt(hour) % 12 || 12;
    
    return `${hour12}:${minute} ${ampm}`;
}