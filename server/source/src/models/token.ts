class Token {
    public refreshTokens: { [key: string]: string; } = {}
    
    public checkRefreshTokenExist(id: string, refreshToken: string) {
        if((refreshToken in this.refreshTokens) && 
           (this.refreshTokens[refreshToken] == id)) {
               return true;
           }
        return false;
    }

    public setRefreshToken(id: string, refreshToken: string) {
        this.refreshTokens[refreshToken] = id;
    }
}

export default Token
