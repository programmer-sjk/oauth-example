import jwt from 'jsonwebtoken'

class Token {
    static refreshTokens: { [key: string]: string; } = {}
    
    public getToken(data) {
        return jwt.sign(data, 'secret', { expiresIn: 30 });
    }

    public getRefreshToken(data) {
        return jwt.sign(data, 'secret', { expiresIn: 60 * 60 * 24 });
    }

    public checkRefreshTokenExist(id: string, refreshToken: string) {
        if(refreshToken in Token.refreshTokens) {
            return true;
        }
        return false;
    }

    public setRefreshToken(id: string, refreshToken: string) {
        Token.refreshTokens[refreshToken] = id;
    }
}

export default Token
