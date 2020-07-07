import fs from 'fs';
import * as path from 'path';


export function getAccount(cb: any) {
    const filepath: string = path.join(__dirname, "../data/fakeAccount.json")
    fs.readFile(filepath, (err: Error | null, data: Buffer) => {
        if(err) 
            cb(err, null);
        else 
            cb(null, JSON.parse(data.toString()));
    })
}
