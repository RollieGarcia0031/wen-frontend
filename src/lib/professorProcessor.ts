import { SearchProfessorResponseDataItem } from '@/lib/response';

interface newProfList {
    [key: number] : newProfItem
}

export interface newProfItem {
    name: string
    data: SearchProfessorResponseDataItem[]
}

export function ProcessProfData(professors: SearchProfessorResponseDataItem[]): newProfList {
    const groupedByUserId = professors.reduce((newlist: newProfList, professors: SearchProfessorResponseDataItem) => {
        const { user_id } = professors;

        if (!user_id) {
            return newlist;
        }

        const data = professors;
        const name = professors.name || 'no name';

        if (newlist[user_id]) {
            newlist[user_id]['data'].push(professors);
        } else {
            newlist[user_id] = {
                name: name,
                data: [data]
            };
        }
        return newlist;
    }, {})

    return groupedByUserId;
}