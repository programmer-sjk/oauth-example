import fs from 'fs';
import * as path from 'path';

class User {
    public filepath: string;
    constructor() {
        this.filepath = path.join(__dirname, "../data/fakeAccount.json")
    }

    public getUser(cb: any) {
        fs.readFile(this.filepath, (err: Error | null, data: Buffer) => {
            if(err) 
                cb(err, null);
            else 
                cb(null, JSON.parse(data.toString()));
        })
    }
}

export default User
