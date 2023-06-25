import { leftPad } from "./leftPad";

export function convertDate(date: any) {
    var formatedDate = `${date.$y}-${leftPad(date.$M + 1, 2)}-${leftPad(date.$D, 2)}`;
    return formatedDate;
}

export function formatDateBR(dateString: string) {
    const dateParts = dateString.split('-');
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];

    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
}