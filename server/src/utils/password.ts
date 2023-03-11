import bcrypt from 'bcryptjs';
import { promisify } from 'util';

const hash = promisify(bcrypt.hash);

export const hashPassword = async (password: string) => {
    const salt = await hash(password, 8);
    return salt;
}

export const comparePassword = async (suppliedPassword: string, storedPassword: string) => {
    const isMatch = await bcrypt.compare(suppliedPassword, storedPassword);    
    return isMatch;
}