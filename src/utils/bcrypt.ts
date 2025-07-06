import bcrypt from 'bcrypt';
import { envs } from '../envs';
import { HTTPError } from './http.error';

export class Bcrypt {

    public async gerarHash(senha: string): Promise<string> {
        if(!envs.BCRYPT_SALT) { 
            throw new HTTPError(500, "Bcrypt salt is not provided in env file")
        }

        const hash = await bcrypt.hash(senha, envs.BCRYPT_SALT);

        return hash
    }

    public async comparar(senha: string, hash: string): Promise<boolean> {
        if(!envs.BCRYPT_SALT) {
            throw new HTTPError(500, "Bcrypt salt is not provided in env file")
        }

        const isMatch = await bcrypt.compare(senha, hash) 

        return isMatch
    }
}