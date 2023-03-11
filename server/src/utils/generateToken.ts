import jwt from 'jsonwebtoken';

type User = {
    id: Number;
    email: string;
}

export default function (user: User, role?: string) {
    return jwt.sign({ id: user.id, email: user.email, role: role ?? `user` }, process.env.JWT_SECRET!)
} 