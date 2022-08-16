import { Request, Response } from 'express';

export function userPostCreate(req: Request, res: Response): void {
    console.log('userPostCreate');
    res.status(201).end();
}
