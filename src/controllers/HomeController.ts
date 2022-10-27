import { Request, Response } from 'express';

import HomeModel from '../models/HomeModel';

class HomeController {
  index(req: Request, res: Response) {
    const resp = HomeModel.index();

    res.status(200);
    res.json(resp);
  }
}

export default new HomeController();
